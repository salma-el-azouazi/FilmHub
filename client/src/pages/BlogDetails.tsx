import { motion } from "framer-motion";
import { Bookmark, Clapperboard, Edit3, ExternalLink, Eye, Heart, MessageSquare, PlayCircle, Reply, ScrollText, Send, Star, ThumbsDown, ThumbsUp, Trash2, Trophy, UserPlus, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api, asset, FilmPost, safeHtml } from "../lib/api";
import { enrichCastImages } from "../lib/castImages";
import {
  addDemoComment,
  bookmarkDemoPost,
  deleteDemoComment,
  findDemoPostBySlug,
  likeDemoComment,
  likeDemoPost,
  overlayDemoComments,
  reactDemoMovie,
  updateDemoComment,
  viewDemoMovie,
  withDemoEngagement
} from "../lib/localDemoStore";
import { getMovieDetail, type MovieDetail, samplePosts } from "../lib/mockData";
import { fetchTmdbMovieDetail } from "../lib/tmdb";

type Comment = {
  id: number;
  post_id?: number;
  user_id?: number;
  content: string;
  author_name: string;
  author_avatar?: string;
  parent_comment_id?: number | null;
  likes_count?: number;
  liked_by_me?: number;
};

type MovieStats = { views: number; likes: number; dislikes: number };

function normalizeTrailerUrl(url = "") {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com")) {
      const videoId = parsed.searchParams.get("v");
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    if (parsed.hostname === "youtu.be") {
      const videoId = parsed.pathname.replace("/", "");
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
  } catch {
    return url;
  }
  return url;
}

function isEmbeddableTrailer(url = "") {
  return /youtube(?:-nocookie)?\.com\/embed|player\.vimeo\.com\/video/.test(url);
}

function trailerWatchUrl(embedUrl = "", fallback = "") {
  const youtubeMatch = embedUrl.match(/youtube(?:-nocookie)?\.com\/embed\/([^?&/]+)/);
  if (youtubeMatch?.[1]) return `https://www.youtube.com/watch?v=${youtubeMatch[1]}`;
  return fallback;
}

function mergeDetail(post: FilmPost, remoteDetail: Partial<MovieDetail>): MovieDetail {
  const baseDetail = getMovieDetail(post.slug, post);
  return {
    ...baseDetail,
    ...remoteDetail,
    trailerUrl: remoteDetail.trailerUrl || baseDetail.trailerUrl,
    releaseDate: remoteDetail.releaseDate || baseDetail.releaseDate,
    genre: remoteDetail.genre || baseDetail.genre,
    director: remoteDetail.director || baseDetail.director,
    cast: remoteDetail.cast || baseDetail.cast,
    filmingLocations: remoteDetail.filmingLocations || baseDetail.filmingLocations,
    comments: baseDetail.comments
  };
}

function StatRing({ label, value, tone }: { label: string; value: number; tone: "views" | "likes" | "dislikes" }) {
  const capped = Math.min(100, Math.max(8, value % 101));
  return (
    <div className={`slayer-stat-ring slayer-stat-${tone}`} style={{ "--value": `${capped}%` } as CSSProperties}>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

export default function BlogDetails() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState<FilmPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [replyDrafts, setReplyDrafts] = useState<Record<number, string>>({});
  const [editing, setEditing] = useState<Record<number, string>>({});
  const [message, setMessage] = useState("");
  const [movieStats, setMovieStats] = useState<MovieStats | null>(null);
  const [castCards, setCastCards] = useState<MovieDetail["cast"]>([]);
  const [remoteDetail, setRemoteDetail] = useState<Partial<MovieDetail>>({});

  function load() {
    api<{ post: FilmPost; comments: Comment[] }>(`/posts/${slug}`).then((data) => {
      const nextPost = withDemoEngagement(data.post, user);
      setPost(nextPost);
      setComments(overlayDemoComments(nextPost.id, data.comments, user));
    }).catch(() => {
      const fallback = findDemoPostBySlug(slug) || samplePosts.find((item) => item.slug === slug) || samplePosts[0];
      const nextPost = withDemoEngagement(fallback, user);
      setPost(nextPost);
      setComments(overlayDemoComments(nextPost.id, [], user));
    });
  }

  useEffect(() => {
    if (slug) load();
  }, [slug, user?.id]);

  useEffect(() => {
    if (!post) return;
    const base = getMovieDetail(post.slug, post);
    setCastCards([]);
    setRemoteDetail({});
    fetchTmdbMovieDetail(base).then(setRemoteDetail).catch(() => setRemoteDetail({}));
  }, [post?.slug]);

  useEffect(() => {
    if (!post) return;
    const detail = mergeDetail(post, remoteDetail);
    let active = true;
    setCastCards(detail.cast);
    enrichCastImages(detail).then((cast) => {
      if (active) setCastCards(cast);
    }).catch(() => undefined);
    return () => {
      active = false;
    };
  }, [post?.slug, remoteDetail.cast, remoteDetail.genre, remoteDetail.releaseDate, remoteDetail.director]);

  useEffect(() => {
    if (!post) return;
    api<MovieStats>(`/movies/${post.slug}/view`, { method: "POST" })
      .then(setMovieStats)
      .catch(() => setMovieStats(viewDemoMovie(post.slug, { views: post.views, likes: post.likes, dislikes: post.dislikes || 0 })));
  }, [post?.slug]);

  async function comment(event: FormEvent) {
    event.preventDefault();
    if (!post || !user) return;
    try {
      const data = await api<{ comments?: Comment[] }>(`/posts/${post.id}/comments`, { method: "POST", body: JSON.stringify({ content }) });
      setContent("");
      if (data.comments) setComments(overlayDemoComments(post.id, data.comments, user));
      else load();
      setMessage("Comment added");
    } catch {
      addDemoComment(post.id, user, content);
      setContent("");
      setComments(overlayDemoComments(post.id, comments, user));
      setMessage("Comment added in demo mode");
    }
  }

  async function replyTo(commentId: number, event: FormEvent) {
    event.preventDefault();
    if (!post || !user) return;
    const replyContent = replyDrafts[commentId] || "";
    try {
      const data = await api<{ comments?: Comment[] }>(`/posts/${post.id}/comments/${commentId}/replies`, {
        method: "POST",
        body: JSON.stringify({ content: replyContent })
      });
      setReplyDrafts((current) => ({ ...current, [commentId]: "" }));
      if (data.comments) setComments(overlayDemoComments(post.id, data.comments, user));
      else load();
      setMessage("Reply added");
    } catch {
      addDemoComment(post.id, user, replyContent, commentId);
      setReplyDrafts((current) => ({ ...current, [commentId]: "" }));
      setComments(overlayDemoComments(post.id, comments, user));
      setMessage("Reply added in demo mode");
    }
  }

  async function saveComment(commentId: number) {
    if (!post || !user) return;
    try {
      await api(`/posts/comments/${commentId}`, {
        method: "PATCH",
        body: JSON.stringify({ content: editing[commentId] })
      });
      load();
    } catch {
      updateDemoComment(commentId, user, editing[commentId]);
      setComments((current) => current.map((item) => (
        item.id === commentId ? { ...item, content: editing[commentId] } : item
      )));
      setMessage("Comment updated in demo mode");
    }
    setEditing((current) => {
      const copy = { ...current };
      delete copy[commentId];
      return copy;
    });
  }

  async function removeComment(commentId: number) {
    if (!post || !user) return;
    try {
      await api(`/posts/comments/${commentId}`, { method: "DELETE" });
      load();
    } catch {
      deleteDemoComment(commentId, user);
      setComments((current) => current.filter((item) => item.id !== commentId && Number(item.parent_comment_id) !== Number(commentId)));
      setMessage("Comment deleted in demo mode");
    }
  }

  async function likeComment(commentId: number) {
    if (!post || !user) return;
    try {
      await api(`/posts/comments/${commentId}/like`, { method: "POST" });
      load();
    } catch {
      likeDemoComment(commentId, user);
      setComments((current) => current.map((item) => (
        item.id === commentId
          ? { ...item, likes_count: Number(item.likes_count || 0) + (item.liked_by_me ? 0 : 1), liked_by_me: 1 }
          : item
      )));
    }
  }

  async function act(kind: "like" | "bookmark") {
    if (!post || !user) return;
    try {
      const data = await api<{ likes?: number; message?: string }>(`/posts/${post.id}/${kind}`, { method: "POST" });
      if (kind === "like" && data.likes !== undefined) {
        setPost((current) => current ? { ...current, likes: data.likes ?? current.likes, liked_by_me: true } : current);
      } else if (kind === "bookmark") {
        setPost((current) => current ? { ...current, bookmarked_by_me: true } : current);
      }
      setMessage(data.message || (kind === "like" ? "Post liked" : "Post bookmarked"));
    } catch {
      const nextPost = kind === "like" ? likeDemoPost(post, user) : bookmarkDemoPost(post, user);
      setPost(nextPost);
      setMessage(kind === "like" ? "Post liked in demo mode" : "Post bookmarked in demo mode");
    }
  }

  async function reactMovie(reaction: "like" | "dislike") {
    if (!post) return;
    try {
      const data = await api<MovieStats>(`/movies/${post.slug}/reaction`, {
        method: "POST",
        body: JSON.stringify({ reaction })
      });
      setMovieStats(data);
      setMessage(reaction === "like" ? "Movie liked" : "Movie disliked");
    } catch {
      setMovieStats(reactDemoMovie(post.slug, reaction, stats, user));
      setMessage(reaction === "like" ? "Movie liked in demo mode" : "Movie disliked in demo mode");
    }
  }

  async function followAuthor() {
    if (!post) return;
    if (!user) {
      setMessage("Login to follow this author.");
      return;
    }
    if (user.id === post.user_id) {
      setMessage("This is your post.");
      return;
    }

    try {
      await api(`/users/${post.user_id}/follow`, { method: "POST" });
      setMessage(`Following ${post.author_name || "this author"}.`);
    } catch {
      setMessage(`Following ${post.author_name || "this author"} in demo mode.`);
    }
  }

  if (!post) return <div className="mx-auto max-w-4xl px-4 py-16">Loading cinematic dispatch...</div>;
  const detail = mergeDetail(post, remoteDetail);
  const trailer = post.trailer_url || detail.trailerUrl;
  const playableTrailer = normalizeTrailerUrl(trailer);
  const hasEmbeddedTrailer = isEmbeddableTrailer(playableTrailer);
  const watchTrailer = trailerWatchUrl(playableTrailer, trailer);
  const usesCharacterCards = /anime|animated/i.test(`${detail.type} ${detail.genre || ""}`);
  const stats = movieStats || { views: post.views, likes: post.likes, dislikes: post.dislikes || 0 };
  const detailComments: Comment[] = comments.length
    ? comments
    : detail.comments.map((text, index) => ({ id: 9000 + index, content: text, author_name: index % 2 ? "FilmHub Member" : "Cinema Guest", likes_count: 0 }));
  const rootComments = detailComments.filter((item) => !item.parent_comment_id);
  const repliesFor = (id: number) => detailComments.filter((item) => Number(item.parent_comment_id) === Number(id));

  return (
    <article>
      <section className="movie-detail-hero relative min-h-[62vh] overflow-hidden">
        <img src={asset(post.featured_image) || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1500&q=80"} alt={post.title} className="moving-poster-img absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-ink via-cinema-ink/70 to-cinema-ink/30" />
        <div className="relative mx-auto grid min-h-[62vh] max-w-7xl items-end gap-8 px-4 pb-12 lg:grid-cols-[1fr_360px]">
          <div>
            <Link to="/blogs" className="text-sm font-bold text-cinema-teal">Back to blogs</Link>
            <p className="mt-5 text-sm uppercase tracking-[0.24em] text-cinema-gold">{detail.type} - {detail.movieTitle}</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight md:text-6xl">{post.title}</h1>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-300">
              <Link to={`/users/${post.user_id}`} className="rounded border border-white/15 px-3 py-2 font-bold text-cinema-teal hover:bg-white/10">
                By {post.author_name || "FilmHub"}
              </Link>
              {user && user.id !== post.user_id ? (
                <button onClick={followAuthor} className="inline-flex items-center gap-2 rounded bg-cinema-red px-3 py-2 font-bold text-white shadow-glow">
                  <UserPlus size={16} />Follow author
                </button>
              ) : !user ? (
                <Link to="/login" className="rounded border border-white/15 px-3 py-2 font-bold hover:bg-white/10">Login to follow</Link>
              ) : null}
              <span>{post.category_name}</span>
              <span className="flex items-center gap-1"><Star size={16} className="fill-cinema-gold text-cinema-gold" />{Number(post.rating || 0).toFixed(1)}</span>
              <span className="flex items-center gap-1"><Eye size={16} />{post.views}</span>
              <span className="flex items-center gap-1"><Heart size={16} />{post.likes}</span>
            </div>
            <div className="mt-7 flex flex-wrap gap-4">
              <StatRing label="Views" value={stats.views} tone="views" />
              <StatRing label="Likes" value={stats.likes} tone="likes" />
              <StatRing label="Dislikes" value={stats.dislikes} tone="dislikes" />
            </div>
          </div>
          <motion.div initial={{ opacity: 0, y: 30, rotateY: -18 }} animate={{ opacity: 1, y: 0, rotateY: 0 }} className="movie-rank-card glass rounded-lg p-5">
            <Trophy className="mb-4 text-cinema-gold" size={34} />
            <p className="text-sm uppercase tracking-[0.22em] text-cinema-teal">FilmHub rank</p>
            <h2 className="mt-2 text-3xl font-black">{detail.rank}</h2>
            <div className="mt-4 grid gap-2 text-sm text-slate-300">
              <span><b>Release:</b> {detail.releaseDate}</span>
              <span><b>Genre:</b> {detail.genre}</span>
              <span><b>Director:</b> {detail.director}</span>
            </div>
          </motion.div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[1fr_320px]">
        <div>
          <section className="movie-trailer-shell glass rounded-lg p-4">
            <div className="mb-3 flex items-center gap-2 text-xl font-black"><PlayCircle className="text-cinema-red" />Trailer</div>
            {hasEmbeddedTrailer ? (
              <>
                <iframe className="aspect-video w-full rounded-lg" src={playableTrailer} title={`${detail.movieTitle} trailer`} allowFullScreen />
                <a href={watchTrailer} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 rounded border border-white/15 px-4 py-2 text-sm font-bold hover:bg-white/10">
                  Open on YouTube <ExternalLink size={16} />
                </a>
              </>
            ) : (
              <div className="trailer-search-panel flex aspect-video flex-col items-center justify-center rounded-lg border border-white/10 bg-cinema-ink/70 p-6 text-center">
                <PlayCircle className="mb-4 text-cinema-red" size={54} />
                <p className="max-w-xl text-lg font-black">Official trailer search for {detail.movieTitle}</p>
                <p className="mt-2 max-w-lg text-sm text-slate-300">This dataset uses YouTube search links so FilmHub never displays fake trailer videos.</p>
                <a href={trailer} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded bg-cinema-red px-4 py-3 font-bold shadow-glow">
                  Open trailer <ExternalLink size={17} />
                </a>
              </div>
            )}
          </section>

          <section className="mt-6 grid gap-5 lg:grid-cols-2">
            <div className="prose-film glass rounded-lg p-6 text-lg">
              <div className="mb-4 flex items-center gap-2 text-xl font-black"><Clapperboard className="text-cinema-teal" />Review</div>
              <p>{detail.review}</p>
              <div dangerouslySetInnerHTML={{ __html: safeHtml(post.content) }} />
            </div>
            <div className="script-panel glass rounded-lg p-6">
              <div className="mb-4 flex items-center gap-2 text-xl font-black"><ScrollText className="text-cinema-gold" />Script excerpt</div>
              <p>{detail.script}</p>
            </div>
          </section>

          <section className="mt-6 glass rounded-lg p-6">
            <h2 className="mb-4 text-2xl font-black">Filming Locations</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(detail.filmingLocations || []).map((location) => (
                <div key={location} className="location-chip-3d">{location}</div>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <div className="mb-5 flex items-center gap-2 text-2xl font-black"><UsersRound className="text-cinema-teal" />{usesCharacterCards ? "Main Characters" : "Principal Actors"}</div>
            <div className="actor-drop-zone">
              {(castCards.length ? castCards : detail.cast).map((actor, index) => (
                <motion.article
                  key={actor.name}
                  initial={{ opacity: 0, y: -180, rotate: index % 2 ? 16 : -16, scale: 0.8 }}
                  whileInView={{ opacity: 1, y: 0, rotate: index % 2 ? 3 : -3, scale: 1 }}
                  whileHover={{ y: -12, rotate: 0, scale: 1.04 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ type: "spring", stiffness: 120, damping: 12, delay: index * 0.16 }}
                  className="actor-card-thrown"
                >
                  <span className="actor-string" />
                  <img src={actor.photo} alt={actor.name} />
                  <div>
                    <span>{actor.role}</span>
                    <b>{actor.name}</b>
                    <p>{actor.bio}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>

          <div className="mt-6 flex gap-3">
            <button disabled={!user} onClick={() => act("like")} className="inline-flex items-center gap-2 rounded bg-cinema-red px-4 py-3 font-bold disabled:opacity-50"><Heart size={18} />{post.liked_by_me ? "Liked" : "Like"}</button>
            <button disabled={!user} onClick={() => act("bookmark")} className="inline-flex items-center gap-2 rounded border border-white/15 px-4 py-3 font-bold disabled:opacity-50"><Bookmark size={18} />{post.bookmarked_by_me ? "Bookmarked" : "Bookmark"}</button>
            <button onClick={() => reactMovie("like")} className="inline-flex items-center gap-2 rounded border border-white/15 px-4 py-3 font-bold hover:bg-white/10"><ThumbsUp size={18} />Movie Like</button>
            <button onClick={() => reactMovie("dislike")} className="inline-flex items-center gap-2 rounded border border-white/15 px-4 py-3 font-bold hover:bg-white/10"><ThumbsDown size={18} />Movie Dislike</button>
          </div>
          {message && <p className="mt-3 text-sm text-cinema-teal">{message}</p>}
          <section className="mt-10">
            <h2 className="mb-4 flex items-center gap-2 text-2xl font-black"><MessageSquare /> Comments</h2>
            {user ? (
              <form onSubmit={comment} className="mb-5 flex gap-3">
                <input value={content} onChange={(e) => setContent(e.target.value)} required className="h-12 flex-1 rounded border border-white/10 bg-white/5 px-3 outline-none" placeholder="Add to the discussion" />
                <button className="rounded bg-cinema-teal px-4 text-cinema-ink"><Send size={18} /></button>
              </form>
            ) : <Link to="/login" className="mb-5 inline-block text-cinema-gold">Please login or create an account to comment.</Link>}
            <div className="grid gap-3">
              {rootComments.map((item, index) => (
                <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.04 }} key={`${item.id}-${index}`} className="glass rounded-lg p-4">
                  <div className="mb-2 flex flex-wrap items-center gap-3">
                    <div className="mr-auto text-sm font-bold">{item.author_name}</div>
                    {comments.length > 0 && user && (
                      <button onClick={() => likeComment(item.id)} className="inline-flex items-center gap-1 rounded border border-white/10 px-2 py-1 text-xs hover:bg-white/10"><ThumbsUp size={14} />{item.likes_count || 0}</button>
                    )}
                    {comments.length > 0 && user && (item.user_id === user.id || user.role === "admin") && (
                      <>
                        <button onClick={() => setEditing({ ...editing, [item.id]: item.content })} className="rounded p-1 hover:bg-white/10" title="Edit comment"><Edit3 size={15} /></button>
                        <button onClick={() => removeComment(item.id)} className="rounded p-1 text-cinema-red hover:bg-white/10" title="Delete comment"><Trash2 size={15} /></button>
                      </>
                    )}
                  </div>
                  {editing[item.id] !== undefined ? (
                    <div className="grid gap-2">
                      <textarea value={editing[item.id]} onChange={(e) => setEditing({ ...editing, [item.id]: e.target.value })} rows={3} className="rounded border border-white/10 bg-white/5 p-3 outline-none" />
                      <button onClick={() => saveComment(item.id)} className="w-fit rounded bg-cinema-teal px-3 py-2 text-sm font-bold text-cinema-ink">Save</button>
                    </div>
                  ) : (
                    <p className="text-slate-300">{item.content}</p>
                  )}
                  {user && comments.length > 0 && (
                    <form onSubmit={(event) => replyTo(item.id, event)} className="mt-3 flex gap-2">
                      <input value={replyDrafts[item.id] || ""} onChange={(e) => setReplyDrafts({ ...replyDrafts, [item.id]: e.target.value })} required className="h-10 flex-1 rounded border border-white/10 bg-white/5 px-3 text-sm outline-none" placeholder="Reply" />
                      <button className="rounded border border-white/15 px-3"><Reply size={16} /></button>
                    </form>
                  )}
                  {repliesFor(item.id).length > 0 && (
                    <div className="mt-4 grid gap-3 border-l border-white/10 pl-4">
                      {repliesFor(item.id).map((reply) => (
                        <div key={reply.id} className="rounded border border-white/10 bg-white/5 p-3">
                          <div className="mb-1 flex items-center gap-2 text-sm font-bold">
                            <span className="mr-auto">{reply.author_name}</span>
                            {comments.length > 0 && user && (
                              <button onClick={() => likeComment(reply.id)} className="inline-flex items-center gap-1 rounded border border-white/10 px-2 py-1 text-xs hover:bg-white/10"><ThumbsUp size={14} />{reply.likes_count || 0}</button>
                            )}
                            {comments.length > 0 && user && (reply.user_id === user.id || user.role === "admin") && (
                              <>
                                <button onClick={() => setEditing({ ...editing, [reply.id]: reply.content })} className="rounded p-1 hover:bg-white/10" title="Edit reply"><Edit3 size={15} /></button>
                                <button onClick={() => removeComment(reply.id)} className="rounded p-1 text-cinema-red hover:bg-white/10" title="Delete reply"><Trash2 size={15} /></button>
                              </>
                            )}
                          </div>
                          {editing[reply.id] !== undefined ? (
                            <div className="grid gap-2">
                              <textarea value={editing[reply.id]} onChange={(e) => setEditing({ ...editing, [reply.id]: e.target.value })} rows={3} className="rounded border border-white/10 bg-white/5 p-3 outline-none" />
                              <button onClick={() => saveComment(reply.id)} className="w-fit rounded bg-cinema-teal px-3 py-2 text-sm font-bold text-cinema-ink">Save</button>
                            </div>
                          ) : (
                            <p className="text-sm text-slate-300">{reply.content}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </section>
        </div>
        <aside className="movie-sidebar h-fit">
          <div className="glass rounded-lg p-5">
            <h3 className="font-black">Rank & tags</h3>
            <div className="mt-4 rounded bg-cinema-red/15 p-3 text-sm font-black text-cinema-gold">{detail.rank}</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {(post.tags || "").split(",").filter(Boolean).map((tag) => <span key={tag} className="rounded bg-white/10 px-2 py-1 text-xs">{tag.trim()}</span>)}
            </div>
          </div>
          <div className="glass mt-5 rounded-lg p-5">
            <h3 className="font-black">Movie type</h3>
            <p className="mt-2 text-slate-300">{detail.type}</p>
            <div className="mt-4 grid gap-2 text-sm text-slate-400">
              <span><b>Release:</b> {detail.releaseDate}</span>
              <span><b>Genre:</b> {detail.genre}</span>
              <span><b>Director:</b> {detail.director}</span>
            </div>
            <p className="mt-4 text-sm text-slate-400">Every FilmHub blog can include trailer, review, rank, script notes, actors, and comments.</p>
          </div>
        </aside>
      </section>
    </article>
  );
}
