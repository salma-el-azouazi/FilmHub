import type { FilmPost, User } from "./api";
import { sampleCategories, samplePosts } from "./mockData";

type DemoUser = User & { posts?: number; followers?: number; passwordSalt?: string; passwordHash?: string };
export type DemoComment = {
  id: number;
  post_id?: number;
  user_id?: number;
  content: string;
  author_name: string;
  author_avatar?: string;
  parent_comment_id?: number | null;
  likes_count?: number;
  liked_by_me?: number;
  created_at?: string;
};

type PostInput = {
  title: string;
  excerpt?: string;
  content: string;
  category_id?: string | number | null;
  tags?: string;
  rating?: string | number;
  trailer_url?: string;
  featured_image?: string;
};

const USERS_KEY = "filmhub_demo_users";
const POSTS_KEY = "filmhub_demo_posts";
const POST_LIKES_KEY = "filmhub_demo_post_likes";
const BOOKMARKS_KEY = "filmhub_demo_bookmarks";
const COMMENTS_KEY = "filmhub_demo_comments";
const COMMENT_LIKES_KEY = "filmhub_demo_comment_likes";
const MOVIE_STATS_KEY = "filmhub_demo_movie_stats";
const MOVIE_REACTIONS_KEY = "filmhub_demo_movie_reactions";

function canStore() {
  return typeof localStorage !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!canStore()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (canStore()) localStorage.setItem(key, JSON.stringify(value));
}

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function publicDemoUser(user: DemoUser): User {
  const { passwordHash: _passwordHash, passwordSalt: _passwordSalt, posts: _posts, followers: _followers, ...publicUser } = user;
  return publicUser;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function categoryMeta(categoryId?: string | number | null) {
  const category = sampleCategories.find((item) => String(item.id) === String(categoryId)) || sampleCategories[0];
  return { category_id: category.id, category_name: category.name, category_slug: category.slug };
}

function normalizeTrailer(url = "") {
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

function allUsers() {
  return readJson<DemoUser[]>(USERS_KEY, []);
}

function saveUsers(users: DemoUser[]) {
  writeJson(USERS_KEY, users);
}

export function upsertDemoUser(user: User) {
  const users = allUsers();
  const existing = users.findIndex((item) => item.id === user.id || item.email.toLowerCase() === user.email.toLowerCase());
  const next = { ...user, posts: countPostsForUser(user.id), followers: users[existing]?.followers || 0 };
  if (existing >= 0) users[existing] = { ...users[existing], ...next };
  else users.push(next);
  saveUsers(users);
}

export async function createDemoRegisteredUser(name: string, email: string, password: string) {
  const users = allUsers();
  const existing = users.find((item) => item.email.toLowerCase() === email.toLowerCase());
  const salt = crypto.randomUUID();
  const demoUser: DemoUser = {
    ...(existing || {
      id: Date.now(),
      role: "user",
      status: "active",
      avatar: "",
      bio: "Demo user available while MySQL is not connected."
    }),
    name,
    email,
    passwordSalt: salt,
    passwordHash: await sha256(`${salt}:${password}`)
  };
  const next = users.filter((item) => item.email.toLowerCase() !== email.toLowerCase());
  next.push(demoUser);
  saveUsers(next);
  return publicDemoUser(demoUser);
}

export async function findDemoUserByCredentials(email: string, password: string) {
  const user = allUsers().find((item) => item.email.toLowerCase() === email.toLowerCase());
  if (!user?.passwordSalt || !user.passwordHash) return null;
  const hash = await sha256(`${user.passwordSalt}:${password}`);
  return hash === user.passwordHash ? publicDemoUser(user) : null;
}

export function listDemoUsers(): DemoUser[] {
  return allUsers().map((user) => ({ ...user, posts: countPostsForUser(user.id), followers: user.followers || 0 }));
}

export function createDemoUser(input: { name: string; email: string; role: string }) {
  const user: DemoUser = {
    id: Date.now(),
    name: input.name,
    email: input.email,
    role: input.role === "admin" ? "admin" : "user",
    status: "active",
    avatar: "",
    bio: "Demo account created while MySQL is offline.",
    posts: 0,
    followers: 0
  };
  upsertDemoUser(user);
  return user;
}

export function updateDemoUser(id: number, payload: { name?: string; email?: string; role?: string; status?: string; avatar?: string; bio?: string }) {
  const normalized: Partial<DemoUser> = {};
  if (payload.name !== undefined) normalized.name = payload.name;
  if (payload.email !== undefined) normalized.email = payload.email;
  if (payload.status !== undefined) normalized.status = payload.status;
  if (payload.avatar !== undefined) normalized.avatar = payload.avatar;
  if (payload.bio !== undefined) normalized.bio = payload.bio;
  if (payload.role === "admin" || payload.role === "user") normalized.role = payload.role;
  const users = allUsers().map((user) => (user.id === id ? { ...user, ...normalized } : user));
  saveUsers(users);
}

export function deleteDemoUser(id: number) {
  saveUsers(allUsers().filter((user) => user.id !== id));
  writeJson(POSTS_KEY, allDemoPosts().filter((post) => post.user_id !== id));
}

export function allDemoPosts() {
  return readJson<FilmPost[]>(POSTS_KEY, []);
}

function savePosts(posts: FilmPost[]) {
  writeJson(POSTS_KEY, posts);
}

function reactionKey(user: User, id: number) {
  return `${user.id}:${id}`;
}

function allReadablePosts() {
  const merged = [...allDemoPosts(), ...samplePosts];
  return Array.from(new Map(merged.map((post) => [post.id, post])).values());
}

function postLikeKeys() {
  return readJson<string[]>(POST_LIKES_KEY, []);
}

function savePostLikeKeys(keys: string[]) {
  writeJson(POST_LIKES_KEY, Array.from(new Set(keys)));
}

function bookmarkKeys() {
  return readJson<string[]>(BOOKMARKS_KEY, []);
}

function saveBookmarkKeys(keys: string[]) {
  writeJson(BOOKMARKS_KEY, Array.from(new Set(keys)));
}

function commentLikeKeys() {
  return readJson<string[]>(COMMENT_LIKES_KEY, []);
}

function saveCommentLikeKeys(keys: string[]) {
  writeJson(COMMENT_LIKES_KEY, Array.from(new Set(keys)));
}

function demoComments() {
  return readJson<DemoComment[]>(COMMENTS_KEY, []);
}

function saveDemoComments(comments: DemoComment[]) {
  writeJson(COMMENTS_KEY, comments);
}

function decorateComment(comment: DemoComment, user?: User | null): DemoComment {
  const likes = commentLikeKeys().filter((key) => key.endsWith(`:${comment.id}`));
  return {
    ...comment,
    likes_count: Number(comment.likes_count || 0) + likes.length,
    liked_by_me: user && likes.includes(`${user.id}:${comment.id}`) ? 1 : 0
  };
}

export function withDemoEngagement(post: FilmPost, user?: User | null): FilmPost {
  const likes = postLikeKeys().filter((key) => key.endsWith(`:${post.id}`));
  const bookmarks = bookmarkKeys();
  return {
    ...post,
    likes: Number(post.likes || 0) + likes.length,
    liked_by_me: user ? likes.includes(reactionKey(user, post.id)) : false,
    bookmarked_by_me: user ? bookmarks.includes(reactionKey(user, post.id)) : false
  };
}

export function listDemoBookmarks(user?: User | null) {
  if (!user) return [];
  const saved = new Set(bookmarkKeys().filter((key) => key.startsWith(`${user.id}:`)).map((key) => Number(key.split(":")[1])));
  return allReadablePosts()
    .filter((post) => saved.has(post.id))
    .map((post) => withDemoEngagement(post, user))
    .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
}

export function likeDemoPost(post: FilmPost, user?: User | null) {
  if (!user) return withDemoEngagement(post, user);
  savePostLikeKeys([...postLikeKeys(), reactionKey(user, post.id)]);
  return withDemoEngagement(post, user);
}

export function bookmarkDemoPost(post: FilmPost, user?: User | null) {
  if (!user) return withDemoEngagement(post, user);
  saveBookmarkKeys([...bookmarkKeys(), reactionKey(user, post.id)]);
  return withDemoEngagement(post, user);
}

export function overlayDemoComments(postId: number, baseComments: DemoComment[] = [], user?: User | null) {
  const local = demoComments().filter((comment) => comment.post_id === postId);
  const byId = new Map<number, DemoComment>();
  [...baseComments, ...local].forEach((comment) => {
    byId.set(comment.id, decorateComment({ ...comment, post_id: comment.post_id || postId }, user));
  });
  return Array.from(byId.values());
}

export function addDemoComment(postId: number, user: User, content: string, parentCommentId?: number | null) {
  const clean = content.trim();
  if (!clean) return overlayDemoComments(postId, [], user);
  const comment: DemoComment = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    post_id: postId,
    user_id: user.id,
    content: clean,
    author_name: user.name,
    author_avatar: user.avatar || "",
    parent_comment_id: parentCommentId || null,
    likes_count: 0,
    liked_by_me: 0,
    created_at: new Date().toISOString()
  };
  saveDemoComments([...demoComments(), comment]);
  return overlayDemoComments(postId, [], user);
}

export function updateDemoComment(commentId: number, user: User, content: string) {
  const comments = demoComments();
  const target = comments.find((comment) => comment.id === commentId);
  if (!target || (target.user_id !== user.id && user.role !== "admin")) return comments;
  saveDemoComments(comments.map((comment) => (
    comment.id === commentId ? { ...comment, content: content.trim() || comment.content } : comment
  )));
  return demoComments();
}

export function deleteDemoComment(commentId: number, user: User) {
  const comments = demoComments();
  const target = comments.find((comment) => comment.id === commentId);
  if (!target || (target.user_id !== user.id && user.role !== "admin")) return comments;
  const removeIds = new Set([commentId, ...comments.filter((comment) => comment.parent_comment_id === commentId).map((comment) => comment.id)]);
  saveDemoComments(comments.filter((comment) => !removeIds.has(comment.id)));
  saveCommentLikeKeys(commentLikeKeys().filter((key) => !removeIds.has(Number(key.split(":")[1]))));
  return demoComments();
}

export function likeDemoComment(commentId: number, user?: User | null) {
  if (!user) return;
  saveCommentLikeKeys([...commentLikeKeys(), `${user.id}:${commentId}`]);
}

export function viewDemoMovie(movieKey: string, fallback: MovieStatsFallback) {
  const stats = readJson<Record<string, MovieStatsFallback>>(MOVIE_STATS_KEY, {});
  const current = stats[movieKey] || {
    views: Number(fallback.views || 0),
    likes: Number(fallback.likes || 0),
    dislikes: Number(fallback.dislikes || 0)
  };
  const next = { ...current, views: current.views + 1 };
  writeJson(MOVIE_STATS_KEY, { ...stats, [movieKey]: next });
  return next;
}

type MovieStatsFallback = { views: number; likes: number; dislikes: number };

export function reactDemoMovie(movieKey: string, reaction: "like" | "dislike", fallback: MovieStatsFallback, user?: User | null) {
  const actor = user ? `user:${user.id}` : "guest";
  const reactionMap = readJson<Record<string, "like" | "dislike">>(MOVIE_REACTIONS_KEY, {});
  const previous = reactionMap[`${movieKey}:${actor}`];
  const stats = readJson<Record<string, MovieStatsFallback>>(MOVIE_STATS_KEY, {});
  const current = stats[movieKey] || {
    views: Number(fallback.views || 0),
    likes: Number(fallback.likes || 0),
    dislikes: Number(fallback.dislikes || 0)
  };
  const next = { ...current };
  if (previous && previous !== reaction) next[previous === "like" ? "likes" : "dislikes"] = Math.max(0, next[previous === "like" ? "likes" : "dislikes"] - 1);
  if (previous !== reaction) next[reaction === "like" ? "likes" : "dislikes"] += 1;
  writeJson(MOVIE_REACTIONS_KEY, { ...reactionMap, [`${movieKey}:${actor}`]: reaction });
  writeJson(MOVIE_STATS_KEY, { ...stats, [movieKey]: next });
  return next;
}

function uniqueSlug(title: string, ignoreId?: number) {
  const base = slugify(title) || "filmhub-post";
  const posts = allDemoPosts();
  let candidate = base;
  let index = 2;
  while (posts.some((post) => post.id !== ignoreId && post.slug === candidate)) {
    candidate = `${base}-${index++}`;
  }
  return candidate;
}

export function countPostsForUser(userId: number) {
  return allDemoPosts().filter((post) => post.user_id === userId).length;
}

export function listDemoPostsForUser(user?: User | null) {
  if (!user) return [];
  return allDemoPosts()
    .filter((post) => post.user_id === user.id)
    .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
}

export function listPublishedDemoPosts(search = "", category = "", genre = "") {
  const term = search.trim().toLowerCase();
  const genreTerm = genre.trim().toLowerCase();
  const categoryTerm = category.trim().toLowerCase();
  return allDemoPosts().filter((post) => {
    if (post.status !== "published") return false;
    const haystack = [post.title, post.content, post.excerpt, post.tags, post.author_name, post.category_name, post.category_slug].join(" ").toLowerCase();
    const matchesTerm = !term || haystack.includes(term);
    const matchesCategory = !categoryTerm || post.category_slug === categoryTerm || String(post.category_id) === categoryTerm || haystack.includes(categoryTerm);
    const matchesGenre = !genreTerm || haystack.includes(genreTerm);
    return matchesTerm && matchesCategory && matchesGenre;
  }).map((post) => withDemoEngagement(post));
}

export function findDemoPostBySlug(slug?: string) {
  if (!slug) return undefined;
  const post = allDemoPosts().find((item) => item.slug === slug);
  return post ? withDemoEngagement(post) : undefined;
}

export function createDemoPost(user: User, input: PostInput, status: "draft" | "published") {
  const meta = categoryMeta(input.category_id);
  const now = new Date().toISOString();
  const post: FilmPost = {
    id: Date.now(),
    user_id: user.id,
    title: input.title,
    slug: uniqueSlug(input.title),
    content: input.content,
    excerpt: input.excerpt || "",
    featured_image: input.featured_image || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
    trailer_url: normalizeTrailer(input.trailer_url || ""),
    status,
    ...meta,
    author_name: user.name,
    author_avatar: user.avatar || "",
    tags: input.tags || "",
    rating: Number(input.rating || 0),
    views: 0,
    likes: 0,
    featured: 0,
    created_at: now
  };
  savePosts([post, ...allDemoPosts()]);
  upsertDemoUser(user);
  return post;
}

export function updateDemoPost(user: User | null, id: number, input: PostInput & { status?: string }, admin = false) {
  let updated: FilmPost | undefined;
  const posts = allDemoPosts().map((post) => {
    if (post.id !== id) return post;
    if (!admin && (!user || post.user_id !== user.id)) return post;
    const meta = categoryMeta(input.category_id || post.category_id);
    updated = {
      ...post,
      title: input.title || post.title,
      slug: input.title && input.title !== post.title ? uniqueSlug(input.title, post.id) : post.slug,
      content: input.content || post.content,
      excerpt: input.excerpt ?? post.excerpt,
      featured_image: input.featured_image ?? post.featured_image,
      trailer_url: normalizeTrailer(input.trailer_url ?? post.trailer_url),
      status: input.status || post.status,
      ...meta,
      tags: input.tags ?? post.tags,
      rating: Number(input.rating ?? post.rating)
    };
    return updated;
  });
  savePosts(posts);
  return updated;
}

export function deleteDemoPost(id: number, user?: User | null, admin = false) {
  const posts = allDemoPosts();
  const target = posts.find((post) => post.id === id);
  if (!target) return false;
  if (!admin && (!user || target.user_id !== user.id)) return false;
  savePosts(posts.filter((post) => post.id !== id));
  return true;
}

export function moderateDemoPost(id: number, payload: Partial<FilmPost>) {
  savePosts(allDemoPosts().map((post) => (post.id === id ? { ...post, ...payload } : post)));
}
