import crypto from "crypto";

export function secureToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString("hex");
}

export function hashToken(token) {
  return crypto.createHash("sha256").update(String(token)).digest("hex");
}

export function hashActor(req, userId = null) {
  if (userId) return `user:${userId}`;
  const raw = `${req.ip || ""}:${req.get("user-agent") || ""}`;
  return `guest:${hashToken(raw).slice(0, 48)}`;
}

export function getCookie(req, name) {
  const cookies = req.headers.cookie || "";
  const found = cookies
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`));
  return found ? decodeURIComponent(found.slice(name.length + 1)) : "";
}

export function setCookie(res, name, value, options = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  const maxAge = options.maxAge;
  if (maxAge) parts.push(`Max-Age=${Math.floor(maxAge / 1000)}`);
  parts.push(`Path=${options.path || "/"}`);
  if (options.httpOnly) parts.push("HttpOnly");
  parts.push(`SameSite=${options.sameSite || "Lax"}`);
  if (options.secure || process.env.NODE_ENV === "production") parts.push("Secure");
  res.append("Set-Cookie", parts.join("; "));
}

export function clearCookie(res, name, path = "/") {
  res.append("Set-Cookie", `${name}=; Max-Age=0; Path=${path}; SameSite=Lax`);
}
