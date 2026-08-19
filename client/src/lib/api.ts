function defaultApiUrl() {
  if (typeof window === "undefined") return "http://127.0.0.1:5202/api";
  return `${window.location.protocol}//${window.location.hostname}:5202/api`;
}

export const API_URL = import.meta.env.VITE_API_URL || defaultApiUrl();

export type FilmPost = {
  id: number;
  user_id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  trailer_url?: string;
  status: string;
  category_id?: number;
  category_name?: string;
  category_slug?: string;
  author_name?: string;
  author_avatar?: string;
  tags?: string;
  rating?: number;
  views: number;
  likes: number;
  dislikes?: number;
  liked_by_me?: boolean | number;
  bookmarked_by_me?: boolean | number;
  featured?: number;
  block_reason?: string;
  block_moderator_name?: string;
  blocked_at?: string;
  created_at: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  avatar?: string;
  bio?: string;
  status: string;
};

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("filmhub_token");
  const isForm = options.body instanceof FormData;
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(isForm ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
}

export function asset(url?: string) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_URL.replace("/api", "")}${url}`;
}

export function stripHtml(value = "") {
  return value.replace(/<[^>]*>?/gm, "");
}

export function safeHtml(value = "") {
  return value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}
