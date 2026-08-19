import bcrypt from "bcryptjs";
import { pool } from "../config/db.js";

const publicUser = "id, name, email, role, avatar, bio, status, created_at";

export async function listAuthors(_req, res, next) {
  try {
    const [users] = await pool.query(`
      SELECT u.id, u.name, u.avatar, u.bio, COUNT(DISTINCT p.id) AS posts,
      COUNT(DISTINCT f.id) AS followers
      FROM users u
      LEFT JOIN posts p ON p.user_id = u.id AND p.status = 'published'
      LEFT JOIN followers f ON f.following_id = u.id
      WHERE u.status = 'active'
      GROUP BY u.id, u.name, u.avatar, u.bio
      ORDER BY followers DESC, posts DESC
    `);
    res.json(users);
  } catch (error) {
    next(error);
  }
}

export async function getProfile(req, res, next) {
  try {
    const [[user]] = await pool.query(`SELECT ${publicUser} FROM users WHERE id = ?`, [req.params.id]);
    if (!user) return res.status(404).json({ message: "User not found" });
    const [[stats]] = await pool.query(`
      SELECT
      (SELECT COUNT(*) FROM posts WHERE user_id = ? AND status = 'published') AS posts,
      (SELECT COUNT(*) FROM followers WHERE following_id = ?) AS followers,
      (SELECT COUNT(*) FROM followers WHERE follower_id = ?) AS following,
      (SELECT COALESCE(SUM(likes),0) FROM posts WHERE user_id = ?) AS likesReceived
    `, [user.id, user.id, user.id, user.id]);
    const [recent] = await pool.query(
      "SELECT id, title, slug, featured_image, created_at FROM posts WHERE user_id = ? AND status = 'published' ORDER BY created_at DESC LIMIT 6",
      [user.id]
    );
    res.json({ user, stats, recent });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const avatar = req.file ? `/uploads/${req.file.filename}` : req.body.avatar;
    const { name, bio } = req.body;
    await pool.query("UPDATE users SET name = COALESCE(?, name), bio = COALESCE(?, bio), avatar = COALESCE(?, avatar) WHERE id = ?", [
      name || null,
      bio || null,
      avatar || null,
      req.user.id
    ]);
    const [[user]] = await pool.query(`SELECT ${publicUser} FROM users WHERE id = ?`, [req.user.id]);
    res.json({ user });
  } catch (error) {
    next(error);
  }
}

export async function followUser(req, res, next) {
  try {
    const targetId = Number(req.params.id);
    if (targetId === req.user.id) return res.status(400).json({ message: "You cannot follow yourself" });
    await pool.query("INSERT IGNORE INTO followers (follower_id, following_id) VALUES (?, ?)", [req.user.id, targetId]);
    await pool.query("INSERT INTO notifications (user_id, message) VALUES (?, ?)", [targetId, `${req.user.name} followed you`]);
    res.json({ message: "Following user" });
  } catch (error) {
    next(error);
  }
}

export async function unfollowUser(req, res, next) {
  try {
    await pool.query("DELETE FROM followers WHERE follower_id = ? AND following_id = ?", [req.user.id, req.params.id]);
    res.json({ message: "Unfollowed user" });
  } catch (error) {
    next(error);
  }
}

export async function notifications(req, res, next) {
  try {
    const [items] = await pool.query("SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50", [req.user.id]);
    res.json(items);
  } catch (error) {
    next(error);
  }
}

export async function markNotificationsRead(req, res, next) {
  try {
    await pool.query("UPDATE notifications SET read_status = 1 WHERE user_id = ?", [req.user.id]);
    res.json({ message: "Notifications marked as read" });
  } catch (error) {
    next(error);
  }
}

export async function createUser(req, res, next) {
  try {
    const { name, email, password, role = "user", status = "active" } = req.body;
    const hash = await bcrypt.hash(password || "FilmHub123!", 12);
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)",
      [name, email, hash, role, status]
    );
    res.status(201).json({ id: result.insertId, name, email, role, status });
  } catch (error) {
    next(error);
  }
}
