import slugify from "slugify";
import { pool } from "../config/db.js";

export async function listCategories(_req, res, next) {
  try {
    const [categories] = await pool.query(`
      SELECT c.id, c.name, c.slug, c.description, c.icon, c.created_at,
      COUNT(p.id) AS post_count, COALESCE(SUM(p.views),0) AS views
      FROM categories c LEFT JOIN posts p ON p.category_id = c.id AND p.status = 'published'
      GROUP BY c.id, c.name, c.slug, c.description, c.icon, c.created_at ORDER BY c.name
    `);
    res.json(categories);
  } catch (error) {
    next(error);
  }
}

export async function createCategory(req, res, next) {
  try {
    const { name, description = "", icon = "Film" } = req.body;
    const slug = slugify(name, { lower: true, strict: true });
    const [result] = await pool.query("INSERT INTO categories (name, slug, description, icon) VALUES (?, ?, ?, ?)", [name, slug, description, icon]);
    res.status(201).json({ id: result.insertId, name, slug, description, icon });
  } catch (error) {
    next(error);
  }
}

export async function updateCategory(req, res, next) {
  try {
    const { name, description, icon } = req.body;
    const slug = name ? slugify(name, { lower: true, strict: true }) : undefined;
    await pool.query("UPDATE categories SET name = COALESCE(?, name), slug = COALESCE(?, slug), description = COALESCE(?, description), icon = COALESCE(?, icon) WHERE id = ?", [
      name || null,
      slug || null,
      description || null,
      icon || null,
      req.params.id
    ]);
    res.json({ message: "Category updated" });
  } catch (error) {
    next(error);
  }
}

export async function deleteCategory(req, res, next) {
  try {
    await pool.query("DELETE FROM categories WHERE id = ?", [req.params.id]);
    res.json({ message: "Category deleted" });
  } catch (error) {
    next(error);
  }
}

export async function mergeCategory(req, res, next) {
  try {
    const fromId = Number(req.params.id);
    const toId = Number(req.body.target_category_id);
    if (!fromId || !toId || fromId === toId) return res.status(400).json({ message: "Choose two different categories" });
    const [[target]] = await pool.query("SELECT id FROM categories WHERE id = ?", [toId]);
    if (!target) return res.status(404).json({ message: "Target category not found" });
    await pool.query("UPDATE posts SET category_id = ? WHERE category_id = ?", [toId, fromId]);
    await pool.query("UPDATE IGNORE post_categories SET category_id = ? WHERE category_id = ?", [toId, fromId]);
    await pool.query("DELETE FROM post_categories WHERE category_id = ?", [fromId]);
    await pool.query("DELETE FROM categories WHERE id = ?", [fromId]);
    res.json({ message: "Category merged" });
  } catch (error) {
    next(error);
  }
}
