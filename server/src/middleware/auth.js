import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";
import { findFallbackUserById, isDatabaseUnavailable } from "../services/fallbackAuthStore.js";

function publicFallbackUser(user) {
  return user ? {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    bio: user.bio,
    status: user.status
  } : null;
}

export async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Authentication required" });

    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    const [[user]] = await pool.query(
      "SELECT id, name, email, role, avatar, status FROM users WHERE id = ?",
      [payload.id]
    );
    if (!user || ["suspended", "disabled"].includes(user.status)) return res.status(401).json({ message: "Account unavailable" });
    req.user = user;
    next();
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      try {
        const header = req.headers.authorization || "";
        const token = header.startsWith("Bearer ") ? header.slice(7) : null;
        const payload = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
        const user = publicFallbackUser(await findFallbackUserById(payload.id));
        if (user && !["suspended", "disabled"].includes(user.status)) {
          req.user = user;
          return next();
        }
      } catch {
        // Continue to the normal invalid-token response.
      }
    }
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

export async function optionalAuth(req, _res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return next();
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    req.authId = payload.id;
    const [[user]] = await pool.query(
      "SELECT id, name, email, role, avatar, status FROM users WHERE id = ?",
      [payload.id]
    );
    if (user && !["suspended", "disabled"].includes(user.status)) req.user = user;
    next();
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      try {
        const header = req.headers.authorization || "";
        const token = header.startsWith("Bearer ") ? header.slice(7) : null;
        if (token) {
          const payload = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
          req.authId = payload.id;
          const user = publicFallbackUser(await findFallbackUserById(payload.id));
          if (user && !["suspended", "disabled"].includes(user.status)) req.user = user;
        }
      } catch {
        // Optional auth intentionally ignores invalid fallback tokens.
      }
    }
    next();
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You do not have permission for this action" });
    }
    next();
  };
}
