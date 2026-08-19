import bcrypt from "bcryptjs";
import { pool } from "../config/db.js";

export async function dashboard(req, res, next) {
  try {
    const [[stats]] = await pool.query(`
      SELECT
      (SELECT COUNT(*) FROM users) AS totalUsers,
      (SELECT COUNT(*) FROM users WHERE status='active') AS activeUsers,
      (SELECT COUNT(*) FROM users WHERE status='suspended') AS suspendedUsers,
      (SELECT COUNT(*) FROM users WHERE status='posting_blocked') AS postingBlockedUsers,
      (SELECT COUNT(*) FROM posts) AS totalPosts,
      (SELECT COUNT(*) FROM posts WHERE status='published') AS publishedPosts,
      (SELECT COUNT(*) FROM posts WHERE status='blocked') AS blockedPosts,
      (SELECT COUNT(*) FROM posts WHERE status='rejected') AS rejectedPosts,
      (SELECT COUNT(*) FROM posts WHERE status='draft') AS draftPosts,
      (SELECT COUNT(*) FROM comments) AS totalComments,
      (SELECT COUNT(*) FROM categories) AS categories
    `);
    const [topPosts] = await pool.query("SELECT id, title, slug, views, likes FROM posts ORDER BY views DESC LIMIT 6");
    const [topUsers] = await pool.query(`
      SELECT u.id, u.name, u.avatar, COUNT(f.id) AS followers FROM users u
      LEFT JOIN followers f ON f.following_id = u.id GROUP BY u.id, u.name, u.avatar ORDER BY followers DESC LIMIT 6
    `);
    const [traffic] = await pool.query(`
      SELECT DATE(created_at) AS date, COUNT(*) AS posts FROM posts
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 13 DAY)
      GROUP BY DATE(created_at) ORDER BY date
    `);
    const [recentActivity] = await pool.query(`
      SELECT 'post' AS type, title AS label, status, created_at FROM posts
      UNION ALL
      SELECT 'user' AS type, name AS label, status, created_at FROM users
      UNION ALL
      SELECT 'comment' AS type, content AS label, 'active' AS status, created_at FROM comments
      ORDER BY created_at DESC LIMIT 12
    `);
    res.json({ stats, topPosts, topUsers, traffic, recentActivity });
  } catch (error) {
    next(error);
  }
}

export async function listUsers(req, res, next) {
  try {
    const search = req.query.search ? `%${req.query.search}%` : null;
    const [users] = await pool.query(`
      SELECT u.id, u.name, u.email, u.role, u.avatar, u.status, u.created_at,
      COUNT(DISTINCT p.id) AS posts, COUNT(DISTINCT f.id) AS followers
      FROM users u
      LEFT JOIN posts p ON p.user_id = u.id
      LEFT JOIN followers f ON f.following_id = u.id
      WHERE (? IS NULL OR u.name LIKE ? OR u.email LIKE ? OR u.role LIKE ? OR u.status LIKE ?)
      GROUP BY u.id, u.name, u.email, u.role, u.avatar, u.status, u.created_at ORDER BY u.created_at DESC
    `, [search, search, search, search, search]);
    res.json(users);
  } catch (error) {
    next(error);
  }
}

export async function updateUser(req, res, next) {
  try {
    const { name, email, role, status, password } = req.body;
    if (password) {
      await pool.query("UPDATE users SET password = ? WHERE id = ?", [await bcrypt.hash(password, 12), req.params.id]);
    }
    await pool.query("UPDATE users SET name=COALESCE(?, name), email=COALESCE(?, email), role=COALESCE(?, role), status=COALESCE(?, status) WHERE id=?", [
      name || null,
      email || null,
      role || null,
      status || null,
      req.params.id
    ]);
    res.json({ message: "User updated" });
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req, res, next) {
  try {
    await pool.query("DELETE FROM users WHERE id = ?", [req.params.id]);
    res.json({ message: "User deleted" });
  } catch (error) {
    next(error);
  }
}

export async function listPostsAdmin(_req, res, next) {
  try {
    const [posts] = await pool.query(`
      SELECT p.*, u.name AS author_name, c.name AS category_name, moderator.name AS block_moderator_name
      FROM posts p
      JOIN users u ON u.id = p.user_id LEFT JOIN categories c ON c.id = p.category_id
      LEFT JOIN users moderator ON moderator.id = p.block_moderator_id
      ORDER BY p.created_at DESC
    `);
    res.json(posts);
  } catch (error) {
    next(error);
  }
}

export async function moderatePost(req, res, next) {
  try {
    const { status, block_reason = null, featured = 0 } = req.body;
    const [[post]] = await pool.query("SELECT id, status FROM posts WHERE id = ?", [req.params.id]);
    if (!post) return res.status(404).json({ message: "Post not found" });
    const nextStatus = status || post.status;
    const shouldBlock = nextStatus === "blocked" || nextStatus === "rejected";
    await pool.query(
      `UPDATE posts SET status = COALESCE(?, status), block_reason = ?, block_moderator_id = ?,
       blocked_at = ?, featured = ? WHERE id = ?`,
      [
        status || null,
        shouldBlock ? block_reason || "Blocked by admin moderation" : null,
        shouldBlock ? req.user.id : null,
        shouldBlock ? new Date() : null,
        featured,
        req.params.id
      ]
    );
    await pool.query(
      `INSERT INTO moderation_logs (moderator_id, target_type, target_id, action, reason)
       VALUES (?, 'post', ?, ?, ?)`,
      [req.user.id, req.params.id, nextStatus, shouldBlock ? block_reason || "Blocked by admin moderation" : "Post restored"]
    );
    res.json({ message: "Post moderation saved" });
  } catch (error) {
    next(error);
  }
}

export async function listComments(_req, res, next) {
  try {
    const [comments] = await pool.query(`
      SELECT cm.*, p.title AS post_title, u.name AS author_name FROM comments cm
      JOIN posts p ON p.id = cm.post_id JOIN users u ON u.id = cm.user_id
      ORDER BY cm.created_at DESC
    `);
    res.json(comments);
  } catch (error) {
    next(error);
  }
}

export async function deleteComment(req, res, next) {
  try {
    await pool.query("DELETE FROM comments WHERE id = ?", [req.params.id]);
    res.json({ message: "Comment deleted" });
  } catch (error) {
    next(error);
  }
}

export async function broadcastNotification(req, res, next) {
  try {
    const { message } = req.body;
    if (!message || message.trim().length < 3) {
      return res.status(422).json({ message: "Broadcast message is required" });
    }
    const [users] = await pool.query("SELECT id FROM users WHERE status <> 'suspended'");
    if (users.length) {
      await pool.query(
        "INSERT INTO notifications (user_id, message) VALUES ?",
        [users.map((user) => [user.id, `[Admin broadcast] ${message.trim()}`])]
      );
    }
    res.json({ message: `Broadcast sent to ${users.length} users`, recipients: users.length });
  } catch (error) {
    next(error);
  }
}
