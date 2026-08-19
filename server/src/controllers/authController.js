import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import { pool } from "../config/db.js";
import { contactSenderTemplate, passwordResetTemplate, sendEmail } from "../services/emailService.js";
import {
  createFallbackReset,
  createFallbackUser,
  findFallbackReset,
  findFallbackUserByEmail,
  isDatabaseUnavailable,
  markFallbackResetUsed,
  updateFallbackPassword
} from "../services/fallbackAuthStore.js";
import { getCookie, hashToken, secureToken, setCookie, clearCookie } from "../utils/security.js";
import { signToken } from "../utils/tokens.js";

const rememberCookie = "filmhub_remember";
const csrfCookie = "filmhub_csrf";
const rememberMaxAge = 1000 * 60 * 60 * 24 * 30;
const resetMinutes = Number(process.env.PASSWORD_RESET_MINUTES || 60);
const fallbackClientUrl = "http://localhost:5173";

function sendValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ message: "Validation failed", errors: errors.array() });
    return true;
  }
  return false;
}

function cleanOrigin(value = "") {
  try {
    const parsed = new URL(String(value));
    if (!["http:", "https:"].includes(parsed.protocol)) return "";
    return parsed.origin;
  } catch {
    return "";
  }
}

function clientOriginFromRequest(req) {
  const origin = cleanOrigin(req.get("origin"));
  if (origin) return origin;

  const referer = req.get("referer");
  if (referer) {
    const refererOrigin = cleanOrigin(referer);
    if (refererOrigin) return refererOrigin;
  }

  return cleanOrigin(process.env.CLIENT_URL) || fallbackClientUrl;
}

function allowedClientOrigin(value) {
  const origin = cleanOrigin(value);
  const configured = cleanOrigin(process.env.CLIENT_URL);
  if (!origin) return configured || fallbackClientUrl;
  if (configured && origin === configured) return origin;

  try {
    const { hostname } = new URL(origin);
    if (["localhost", "127.0.0.1", "::1"].includes(hostname)) return origin;
  } catch {
    return configured || fallbackClientUrl;
  }

  return configured || fallbackClientUrl;
}

function apiOriginFromRequest(req) {
  return cleanOrigin(process.env.API_PUBLIC_URL) || `${req.protocol}://${req.get("host")}`;
}

function resetConfirmationUrl(req, token) {
  const client = encodeURIComponent(clientOriginFromRequest(req));
  return `${apiOriginFromRequest(req)}/api/auth/confirm-reset/${encodeURIComponent(token)}?client=${client}`;
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    bio: user.bio,
    status: user.status
  };
}

async function registerWithFallback(req, res, next, originalError) {
  try {
    console.warn("Register is using fallback account storage.", originalError.message);
    const { name, email, password } = req.body;
    const exists = await findFallbackUserByEmail(email);
    if (exists) return res.status(409).json({ message: "Email is already registered" });

    const user = await createFallbackUser({
      name,
      email,
      password: await bcrypt.hash(password, 12)
    });
    res.status(201).json({ user: publicUser(user), token: signToken(user) });
  } catch (fallbackError) {
    next(fallbackError);
  }
}

async function loginWithFallback(req, res, next, originalError) {
  try {
    console.warn("Login is using fallback account storage.", originalError.message);
    const { email, password } = req.body;
    const user = await findFallbackUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    if (["suspended", "disabled"].includes(user.status)) {
      return res.status(403).json({ message: `Account is ${user.status}` });
    }
    res.json({ user: publicUser(user), token: signToken(user) });
  } catch (fallbackError) {
    next(fallbackError);
  }
}

async function forgotPasswordWithFallback(req, res, next, originalError) {
  try {
    console.warn("Forgot password is using fallback account storage.", originalError.message);
    const { email } = req.body;
    const message = "If an account exists for that email, a password reset link has been sent.";
    const user = await findFallbackUserByEmail(email);
    if (!user) return res.json({ message });

    const token = secureToken(32);
    const resetUrl = resetConfirmationUrl(req, token);
    await createFallbackReset({
      userId: user.id,
      email: user.email,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + resetMinutes * 60 * 1000).toISOString()
    });
    const delivery = await sendEmail({
      to: user.email,
      subject: "Reset your FilmHub password",
      html: passwordResetTemplate({ name: user.name, resetUrl, expiresMinutes: resetMinutes })
    });
    if (!delivery.delivered) {
      return res.status(503).json({ message: "Reset email could not be sent. Check the Gmail App Password in server/.env and restart the server." });
    }
    res.json({ message });
  } catch (fallbackError) {
    next(fallbackError);
  }
}

async function resetPasswordWithFallback(req, res, next, originalError) {
  try {
    console.warn("Reset password is using fallback account storage.", originalError.message);
    const { token, password } = req.body;
    const reset = await findFallbackReset(hashToken(token));
    if (!reset) return res.status(400).json({ message: "Reset link is invalid or expired" });

    await updateFallbackPassword(reset.user.id, await bcrypt.hash(password, 12));
    await markFallbackResetUsed(reset.id);
    await sendEmail({
      to: reset.user.email,
      subject: "Your FilmHub password was changed",
      html: contactSenderTemplate({
        name: reset.user.name,
        subject: "password change confirmation",
        timestamp: new Date().toISOString()
      })
    }).catch(() => undefined);
    res.json({ message: "Password reset successfully. You can now log in." });
  } catch (fallbackError) {
    next(fallbackError);
  }
}

async function issueRememberToken(res, req, userId) {
  const token = secureToken(48);
  const csrf = secureToken(24);
  await pool.query(
    `INSERT INTO remember_tokens (user_id, token_hash, csrf_token_hash, user_agent, ip_address, expires_at)
     VALUES (?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY))`,
    [userId, hashToken(token), hashToken(csrf), req.get("user-agent") || "", req.ip || ""]
  );
  setCookie(res, rememberCookie, token, { maxAge: rememberMaxAge, httpOnly: true, sameSite: "Lax", path: "/api/auth" });
  setCookie(res, csrfCookie, csrf, { maxAge: rememberMaxAge, sameSite: "Lax", path: "/" });
}

async function revokeRememberToken(req, res) {
  const token = getCookie(req, rememberCookie);
  if (token) {
    await pool.query("UPDATE remember_tokens SET revoked_at = NOW() WHERE token_hash = ?", [hashToken(token)]);
  }
  clearCookie(res, rememberCookie, "/api/auth");
  clearCookie(res, csrfCookie, "/");
}

export async function register(req, res, next) {
  try {
    if (sendValidation(req, res)) return;
    const { name, email, password, remember = false } = req.body;
    const [[exists]] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (exists) return res.status(409).json({ message: "Email is already registered" });

    const hash = await bcrypt.hash(password, 12);
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, 'user', 'active')",
      [name, email, hash]
    );
    const user = { id: result.insertId, name, email, role: "user", status: "active", avatar: null, bio: null };
    if (remember) await issueRememberToken(res, req, user.id);
    res.status(201).json({ user, token: signToken(user) });
  } catch (error) {
    if (isDatabaseUnavailable(error)) return registerWithFallback(req, res, next, error);
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    if (sendValidation(req, res)) return;
    const { email, password, remember = false } = req.body;
    const [[user]] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    if (["suspended", "disabled"].includes(user.status)) {
      return res.status(403).json({ message: `Account is ${user.status}` });
    }
    if (remember) await issueRememberToken(res, req, user.id);
    res.json({ user: publicUser(user), token: signToken(user) });
  } catch (error) {
    if (isDatabaseUnavailable(error)) return loginWithFallback(req, res, next, error);
    next(error);
  }
}

export async function restoreRememberedSession(req, res, next) {
  try {
    const token = getCookie(req, rememberCookie);
    const csrfCookieValue = getCookie(req, csrfCookie);
    const csrfHeader = req.get("x-csrf-token") || "";
    if (!token || !csrfCookieValue || !csrfHeader || csrfCookieValue !== csrfHeader) {
      return res.status(401).json({ message: "Remembered session unavailable" });
    }
    const [[row]] = await pool.query(
      `SELECT rt.*, u.id, u.name, u.email, u.role, u.avatar, u.bio, u.status
       FROM remember_tokens rt
       JOIN users u ON u.id = rt.user_id
       WHERE rt.token_hash = ? AND rt.revoked_at IS NULL AND rt.expires_at > NOW()`,
      [hashToken(token)]
    );
    if (!row || hashToken(csrfHeader) !== row.csrf_token_hash || ["suspended", "disabled"].includes(row.status)) {
      await revokeRememberToken(req, res);
      return res.status(401).json({ message: "Remembered session expired" });
    }
    await pool.query("UPDATE remember_tokens SET last_used_at = NOW() WHERE id = ?", [row.id]);
    const user = publicUser(row);
    res.json({ user, token: signToken(user) });
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res, next) {
  try {
    const token = getCookie(req, rememberCookie);
    if (token) {
      const csrfCookieValue = getCookie(req, csrfCookie);
      const csrfHeader = req.get("x-csrf-token") || "";
      if (!csrfCookieValue || csrfCookieValue !== csrfHeader) {
        return res.status(403).json({ message: "Invalid CSRF token" });
      }
    }
    await revokeRememberToken(req, res);
    res.json({ message: "Logged out" });
  } catch (error) {
    next(error);
  }
}

export async function me(req, res) {
  res.json({ user: req.user });
}

export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    const [[user]] = await pool.query("SELECT password FROM users WHERE id = ?", [req.user.id]);
    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }
    await pool.query("UPDATE users SET password = ? WHERE id = ?", [await bcrypt.hash(newPassword, 12), req.user.id]);
    await pool.query("UPDATE remember_tokens SET revoked_at = NOW() WHERE user_id = ?", [req.user.id]);
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
}

export async function forgotPassword(req, res, next) {
  try {
    if (sendValidation(req, res)) return;
    const { email } = req.body;
    const [[user]] = await pool.query("SELECT id, name, email FROM users WHERE email = ?", [email]);
    const message = "If an account exists for that email, a password reset link has been sent.";
    if (!user) return res.json({ message });

    const token = secureToken(32);
    const resetUrl = resetConfirmationUrl(req, token);
    await pool.query(
      `INSERT INTO password_resets (user_id, email, token_hash, expires_at)
       VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL ? MINUTE))`,
      [user.id, user.email, hashToken(token), resetMinutes]
    );
    const delivery = await sendEmail({
      to: user.email,
      subject: "Reset your FilmHub password",
      html: passwordResetTemplate({ name: user.name, resetUrl, expiresMinutes: resetMinutes })
    });
    if (!delivery.delivered) {
      return res.status(503).json({ message: "Reset email could not be sent. Check the Gmail App Password in server/.env and restart the server." });
    }
    res.json({ message });
  } catch (error) {
    if (isDatabaseUnavailable(error)) return forgotPasswordWithFallback(req, res, next, error);
    next(error);
  }
}

export function confirmReset(req, res) {
  const token = String(req.params.token || "");
  const client = allowedClientOrigin(req.query.client);
  if (!/^[a-f0-9]{64}$/i.test(token)) {
    return res.redirect(302, `${client}/forgot-password`);
  }
  return res.redirect(302, `${client}/reset-password/${encodeURIComponent(token)}`);
}

export async function resetPassword(req, res, next) {
  try {
    if (sendValidation(req, res)) return;
    const { token, password } = req.body;
    const [[reset]] = await pool.query(
      `SELECT pr.*, u.name, u.email
       FROM password_resets pr
       JOIN users u ON u.id = pr.user_id
       WHERE pr.token_hash = ? AND pr.used_at IS NULL AND pr.expires_at > NOW()
       ORDER BY pr.created_at DESC LIMIT 1`,
      [hashToken(token)]
    );
    if (!reset) return res.status(400).json({ message: "Reset link is invalid or expired" });

    await pool.query("UPDATE users SET password = ? WHERE id = ?", [await bcrypt.hash(password, 12), reset.user_id]);
    await pool.query("UPDATE password_resets SET used_at = NOW() WHERE id = ?", [reset.id]);
    await pool.query("UPDATE remember_tokens SET revoked_at = NOW() WHERE user_id = ?", [reset.user_id]);
    await sendEmail({
      to: reset.email,
      subject: "Your FilmHub password was changed",
      html: contactSenderTemplate({
        name: reset.name,
        subject: "password change confirmation",
        timestamp: new Date().toISOString()
      })
    }).catch(() => undefined);
    res.json({ message: "Password reset successfully. You can now log in." });
  } catch (error) {
    if (isDatabaseUnavailable(error)) return resetPasswordWithFallback(req, res, next, error);
    next(error);
  }
}
