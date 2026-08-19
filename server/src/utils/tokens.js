import jwt from "jsonwebtoken";

export function signToken(user, expiresIn = process.env.JWT_EXPIRES_IN || "7d") {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || "dev-secret", {
    expiresIn
  });
}
