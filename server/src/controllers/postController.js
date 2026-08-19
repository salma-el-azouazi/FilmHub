import slugify from "slugify";
import { pool } from "../config/db.js";
import { sanitizeHtml } from "../utils/sanitize.js";
import { uniqueSlug } from "../utils/slug.js";
import { hashActor } from "../utils/security.js";

function normalizeFile(req, field) {
  const file = req.files?.[field]?.[0] || (field === "featured_image" ? req.file : null);
  return file ? `/uploads/${file.filename}` : undefined;
}

function normalizeCategoryId(value) {
  return value === "" || value === undefined || value === null ? null : Number(value);
}

function normalizeTags(tags = "") {
  return String(tags)
    .split(",")
    .map((tag) => sanitizeHtml(tag.trim()))
    .filter(Boolean)
    .slice(0, 20);
}

async function syncPostTaxonomy(postId, categoryId, tags) {
  await pool.query("DELETE FROM post_categories WHERE post_id = ?", [postId]);
  await pool.query("DELETE FROM post_tags WHERE post_id = ?", [postId]);
  if (categoryId) {
    await pool.query("INSERT IGNORE INTO post_categories (post_id, category_id) VALUES (?, ?)", [postId, categoryId]);
  }
  const normalized = normalizeTags(tags);
  if (normalized.length) {
    await pool.query(
      "INSERT IGNORE INTO post_tags (post_id, tag, slug) VALUES ?",
      [normalized.map((tag) => [postId, tag, slugify(tag, { lower: true, strict: true })])]
    );
  }
}

async function publicComments(postId, viewerId = null) {
  const [comments] = await pool.query(
    `SELECT cm.*, u.name AS author_name, u.avatar AS author_avatar,
      (SELECT COUNT(*) FROM comment_likes cl WHERE cl.comment_id = cm.id) AS likes_count,
      ${viewerId ? "EXISTS(SELECT 1 FROM comment_likes clm WHERE clm.comment_id = cm.id AND clm.user_id = ?)" : "0"} AS liked_by_me
     FROM comments cm
     JOIN users u ON u.id = cm.user_id
     WHERE cm.post_id = ? AND cm.deleted_at IS NULL
     ORDER BY COALESCE(cm.parent_comment_id, cm.id), cm.parent_comment_id IS NOT NULL, cm.created_at ASC`,
    viewerId ? [viewerId, postId] : [postId]
  );
  return comments;
}

export async function listPosts(req, res, next) {
  try {
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 9), 1), 30);
    const offset = (page - 1) * limit;
    const where = ["p.status = 'published'"];
    const params = [];
    if (req.query.search) {
      where.push("(p.title LIKE ? OR p.content LIKE ? OR u.name LIKE ?)");
      const like = `%${req.query.search}%`;
      params.push(like, like, like);
    }
    if (req.query.category) {
      where.push("(c.slug = ? OR c.id = ? OR EXISTS (SELECT 1 FROM post_categories pc WHERE pc.post_id = p.id AND pc.category_id = ?))");
      params.push(req.query.category, req.query.category, req.query.category);
    }
    if (req.query.tag) {
      where.push("(p.tags LIKE ? OR EXISTS (SELECT 1 FROM post_tags pt WHERE pt.post_id = p.id AND pt.slug = ?))");
      params.push(`%${req.query.tag}%`, slugify(String(req.query.tag), { lower: true, strict: true }));
    }
    const [posts] = await pool.query(
      `
      SELECT p.*, u.name AS author_name, u.avatar AS author_avatar, c.name AS category_name, c.slug AS category_slug
      FROM posts p
      JOIN users u ON u.id = p.user_id
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE ${where.join(" AND ")}
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `,
      [...params, limit, offset]
    );
    const [[{ total }]] = await pool.query(
      `
      SELECT COUNT(*) AS total FROM posts p
      JOIN users u ON u.id = p.user_id
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE ${where.join(" AND ")}
    `,
      params
    );
    res.json({ posts, page, total, hasMore: offset + posts.length < total });
  } catch (error) {
    next(error);
  }
}

export async function getPost(req, res, next) {
  try {
    const [[post]] = await pool.query(
      `
      SELECT p.*, u.name AS author_name, u.avatar AS author_avatar, u.bio AS author_bio, c.name AS category_name
      FROM posts p
      JOIN users u ON u.id = p.user_id
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.slug = ?
    `,
      [req.params.slug]
    );
    if (!post || (post.status !== "published" && req.user?.role !== "admin" && req.user?.id !== post.user_id)) {
      return res.status(404).json({ message: "Post not found" });
    }
    await pool.query(
      "INSERT INTO post_views (post_id, user_id, viewer_hash, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)",
      [post.id, req.authId || null, hashActor(req, req.authId), req.ip || "", req.get("user-agent") || ""]
    );
    await pool.query("UPDATE posts SET views = (SELECT COUNT(*) FROM post_views WHERE post_id = ?) WHERE id = ?", [post.id, post.id]);
    const comments = await publicComments(post.id, req.authId || null);
    res.json({ post: { ...post, views: Number(post.views) + 1 }, comments });
  } catch (error) {
    next(error);
  }
}

export async function createPost(req, res, next) {
  try {
    if (req.user.status === "posting_blocked") return res.status(403).json({ message: "Posting privileges are blocked" });
    const { title, content, excerpt, trailer_url, status = "draft", tags = "", rating = 0 } = req.body;
    const categoryId = normalizeCategoryId(req.body.category_id);
    const featured = normalizeFile(req, "featured_image") || req.body.featured_image || "";
    const trailerFile = normalizeFile(req, "trailer") || "";
    const slug = await uniqueSlug(title);
    const [result] = await pool.query(
      `
      INSERT INTO posts (user_id, title, slug, content, excerpt, featured_image, trailer_url, trailer_file, status, category_id, tags, rating)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        req.user.id,
        title,
        slug,
        sanitizeHtml(content),
        sanitizeHtml(excerpt || ""),
        featured,
        trailer_url,
        trailerFile,
        status,
        categoryId,
        normalizeTags(tags).join(", "),
        rating
      ]
    );
    await syncPostTaxonomy(result.insertId, categoryId, tags);
    res.status(201).json({ id: result.insertId, slug, message: status === "published" ? "Post published" : "Draft saved" });
  } catch (error) {
    next(error);
  }
}

export async function updatePost(req, res, next) {
  try {
    const [[post]] = await pool.query("SELECT * FROM posts WHERE id = ?", [req.params.id]);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.user_id !== req.user.id && req.user.role !== "admin") return res.status(403).json({ message: "Not allowed" });

    const title = req.body.title || post.title;
    const slug = title !== post.title ? await uniqueSlug(title, post.id) : post.slug;
    const featured = normalizeFile(req, "featured_image") || req.body.featured_image || post.featured_image;
    const trailerFile = normalizeFile(req, "trailer") || post.trailer_file;
    const categoryId = normalizeCategoryId(req.body.category_id ?? post.category_id);
    const tags = req.body.tags !== undefined ? normalizeTags(req.body.tags).join(", ") : post.tags;
    await pool.query(
      `
      UPDATE posts SET title=?, slug=?, content=?, excerpt=?, featured_image=?, trailer_url=?, trailer_file=?,
      status=?, category_id=?, tags=?, rating=? WHERE id=?
    `,
      [
        title,
        slug,
        req.body.content ? sanitizeHtml(req.body.content) : post.content,
        req.body.excerpt ? sanitizeHtml(req.body.excerpt) : post.excerpt,
        featured,
        req.body.trailer_url ?? post.trailer_url,
        trailerFile,
        req.body.status ?? post.status,
        categoryId,
        tags,
        req.body.rating ?? post.rating,
        post.id
      ]
    );
    await syncPostTaxonomy(post.id, categoryId, tags);
    res.json({ slug, message: "Post updated" });
  } catch (error) {
    next(error);
  }
}

export async function deletePost(req, res, next) {
  try {
    const [[post]] = await pool.query("SELECT user_id FROM posts WHERE id = ?", [req.params.id]);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.user_id !== req.user.id && req.user.role !== "admin") return res.status(403).json({ message: "Not allowed" });
    await pool.query("DELETE FROM posts WHERE id = ?", [req.params.id]);
    res.json({ message: "Post deleted" });
  } catch (error) {
    next(error);
  }
}

export async function myPosts(req, res, next) {
  try {
    const [posts] = await pool.query("SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC", [req.user.id]);
    res.json(posts);
  } catch (error) {
    next(error);
  }
}

export async function likePost(req, res, next) {
  try {
    const [[post]] = await pool.query("SELECT id FROM posts WHERE id = ?", [req.params.id]);
    if (!post) return res.status(404).json({ message: "Post not found" });
    await pool.query("INSERT IGNORE INTO post_likes (user_id, post_id) VALUES (?, ?)", [req.user.id, req.params.id]);
    await pool.query("UPDATE posts SET likes = (SELECT COUNT(*) FROM post_likes WHERE post_id = ?) WHERE id = ?", [req.params.id, req.params.id]);
    const [[{ likes }]] = await pool.query("SELECT likes FROM posts WHERE id = ?", [req.params.id]);
    res.json({ message: "Post liked", likes });
  } catch (error) {
    next(error);
  }
}

export async function bookmarkPost(req, res, next) {
  try {
    await pool.query("INSERT IGNORE INTO bookmarks (user_id, post_id) VALUES (?, ?)", [req.user.id, req.params.id]);
    res.json({ message: "Post bookmarked" });
  } catch (error) {
    next(error);
  }
}

export async function listBookmarks(req, res, next) {
  try {
    const [posts] = await pool.query(
      `
      SELECT p.*, u.name AS author_name, c.name AS category_name FROM bookmarks b
      JOIN posts p ON p.id = b.post_id
      JOIN users u ON u.id = p.user_id
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE b.user_id = ? ORDER BY b.created_at DESC
    `,
      [req.user.id]
    );
    res.json(posts);
  } catch (error) {
    next(error);
  }
}

export async function addComment(req, res, next) {
  try {
    const { content } = req.body;
    const parent_comment_id = req.params.commentId || req.body.parent_comment_id || null;
    const clean = sanitizeHtml(content || "").trim();
    if (clean.length < 1) return res.status(422).json({ message: "Comment is required" });
    const [result] = await pool.query("INSERT INTO comments (post_id, user_id, content, parent_comment_id) VALUES (?, ?, ?, ?)", [
      req.params.id,
      req.user.id,
      clean,
      parent_comment_id
    ]);
    if (parent_comment_id) {
      await pool.query("INSERT IGNORE INTO comment_replies (comment_id, reply_comment_id) VALUES (?, ?)", [parent_comment_id, result.insertId]);
    }
    const comments = await publicComments(req.params.id, req.user.id);
    res.status(201).json({ id: result.insertId, comments, message: "Comment added" });
  } catch (error) {
    next(error);
  }
}

export async function updateComment(req, res, next) {
  try {
    const [[comment]] = await pool.query("SELECT * FROM comments WHERE id = ? AND deleted_at IS NULL", [req.params.commentId]);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (comment.user_id !== req.user.id && req.user.role !== "admin") return res.status(403).json({ message: "Not allowed" });
    const clean = sanitizeHtml(req.body.content || "").trim();
    if (!clean) return res.status(422).json({ message: "Comment is required" });
    await pool.query("UPDATE comments SET content = ?, updated_at = NOW() WHERE id = ?", [clean, comment.id]);
    res.json({ message: "Comment updated" });
  } catch (error) {
    next(error);
  }
}

export async function deleteComment(req, res, next) {
  try {
    const [[comment]] = await pool.query("SELECT * FROM comments WHERE id = ? AND deleted_at IS NULL", [req.params.commentId]);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (comment.user_id !== req.user.id && req.user.role !== "admin") return res.status(403).json({ message: "Not allowed" });
    await pool.query("UPDATE comments SET deleted_at = NOW(), content = '[deleted]' WHERE id = ?", [comment.id]);
    res.json({ message: "Comment deleted" });
  } catch (error) {
    next(error);
  }
}

export async function likeComment(req, res, next) {
  try {
    const [[comment]] = await pool.query("SELECT id FROM comments WHERE id = ? AND deleted_at IS NULL", [req.params.commentId]);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    await pool.query("INSERT IGNORE INTO comment_likes (comment_id, user_id) VALUES (?, ?)", [comment.id, req.user.id]);
    await pool.query("UPDATE comments SET likes_count = (SELECT COUNT(*) FROM comment_likes WHERE comment_id = ?) WHERE id = ?", [comment.id, comment.id]);
    const [[{ likes_count }]] = await pool.query("SELECT likes_count FROM comments WHERE id = ?", [comment.id]);
    res.json({ message: "Comment liked", likes_count });
  } catch (error) {
    next(error);
  }
}

export async function trending(req, res, next) {
  try {
    const [posts] = await pool.query(`
      SELECT p.*, u.name AS author_name, c.name AS category_name FROM posts p
      JOIN users u ON u.id = p.user_id LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.status = 'published'
      ORDER BY (p.views + p.likes * 8) DESC, p.created_at DESC LIMIT 8
    `);
    res.json(posts);
  } catch (error) {
    next(error);
  }
}
