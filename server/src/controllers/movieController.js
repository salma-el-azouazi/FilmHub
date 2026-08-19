import { pool } from "../config/db.js";
import { hashActor } from "../utils/security.js";

const fallbackMovieStats = new Map();
const fallbackMovieReactions = new Map();

function emptyStats() {
  return { views: 0, likes: 0, dislikes: 0 };
}

function fallbackStatsFor(movieKey) {
  return fallbackMovieStats.get(movieKey) || emptyStats();
}

function saveFallbackStats(movieKey, stats) {
  fallbackMovieStats.set(movieKey, {
    views: Number(stats.views || 0),
    likes: Number(stats.likes || 0),
    dislikes: Number(stats.dislikes || 0)
  });
  return fallbackStatsFor(movieKey);
}

function fallbackActor(req) {
  return hashActor(req, req.authId).replace(/[^a-z0-9:-]/gi, "");
}

async function statsFor(movieKey) {
  const [[stats]] = await pool.query(
    `SELECT
       (SELECT COUNT(*) FROM movie_views WHERE movie_key = ?) AS views,
       (SELECT COUNT(*) FROM movie_likes WHERE movie_key = ?) AS likes,
       (SELECT COUNT(*) FROM movie_dislikes WHERE movie_key = ?) AS dislikes`,
    [movieKey, movieKey, movieKey]
  );
  return {
    views: Number(stats.views || 0),
    likes: Number(stats.likes || 0),
    dislikes: Number(stats.dislikes || 0)
  };
}

export async function getMovieStats(req, res, next) {
  try {
    res.json(await statsFor(req.params.movieKey));
  } catch (error) {
    console.warn("Movie stats are using local fallback storage.", error.message);
    res.json(fallbackStatsFor(req.params.movieKey));
  }
}

export async function trackMovieView(req, res, next) {
  try {
    const { movieKey } = req.params;
    await pool.query(
      "INSERT INTO movie_views (movie_key, viewer_hash, user_id, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)",
      [movieKey, hashActor(req, req.authId), req.authId || null, req.ip || "", req.get("user-agent") || ""]
    );
    res.status(201).json(await statsFor(movieKey));
  } catch (error) {
    console.warn("Movie view is using local fallback storage.", error.message);
    const current = fallbackStatsFor(req.params.movieKey);
    res.status(201).json(saveFallbackStats(req.params.movieKey, { ...current, views: current.views + 1 }));
  }
}

export async function reactToMovie(req, res, next) {
  try {
    const { movieKey } = req.params;
    const reaction = req.body.reaction === "dislike" ? "dislike" : "like";
    const actorHash = hashActor(req, req.authId);
    const insertTable = reaction === "like" ? "movie_likes" : "movie_dislikes";
    const deleteTable = reaction === "like" ? "movie_dislikes" : "movie_likes";

    await pool.query(`DELETE FROM ${deleteTable} WHERE movie_key = ? AND actor_hash = ?`, [movieKey, actorHash]);
    await pool.query(
      `INSERT INTO ${insertTable} (movie_key, actor_hash, user_id, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE created_at = CURRENT_TIMESTAMP`,
      [movieKey, actorHash, req.authId || null, req.ip || "", req.get("user-agent") || ""]
    );
    res.json(await statsFor(movieKey));
  } catch (error) {
    console.warn("Movie reaction is using local fallback storage.", error.message);
    const { movieKey } = req.params;
    const reaction = req.body.reaction === "dislike" ? "dislike" : "like";
    const actorHash = fallbackActor(req);
    const reactionKey = `${movieKey}:${actorHash}`;
    const previous = fallbackMovieReactions.get(reactionKey);
    const current = { ...fallbackStatsFor(movieKey) };

    if (previous && previous !== reaction) {
      const previousKey = previous === "like" ? "likes" : "dislikes";
      current[previousKey] = Math.max(0, current[previousKey] - 1);
    }
    if (previous !== reaction) {
      current[reaction === "like" ? "likes" : "dislikes"] += 1;
    }

    fallbackMovieReactions.set(reactionKey, reaction);
    res.json(saveFallbackStats(movieKey, current));
  }
}
