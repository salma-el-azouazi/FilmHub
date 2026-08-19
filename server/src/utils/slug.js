import slugify from "slugify";
import { pool } from "../config/db.js";

export async function uniqueSlug(title, existingId = null) {
  const base = slugify(title, { lower: true, strict: true }) || "filmhub-post";
  let slug = base;
  let i = 2;
  while (true) {
    const params = existingId ? [slug, existingId] : [slug];
    const sql = existingId ? "SELECT id FROM posts WHERE slug = ? AND id <> ?" : "SELECT id FROM posts WHERE slug = ?";
    const [rows] = await pool.query(sql, params);
    if (rows.length === 0) return slug;
    slug = `${base}-${i++}`;
  }
}
