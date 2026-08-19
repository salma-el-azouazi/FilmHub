import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import { useAuth } from "../context/AuthContext";
import { api, FilmPost } from "../lib/api";
import { listDemoBookmarks, withDemoEngagement } from "../lib/localDemoStore";

export default function Bookmarks() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<FilmPost[]>([]);

  useEffect(() => {
    const fallback = listDemoBookmarks(user);
    api<FilmPost[]>("/posts/bookmarks/me")
      .then((data) => {
        const apiPosts = data.map((post) => withDemoEngagement(post, user));
        const merged = Array.from(new Map([...apiPosts, ...fallback].map((post) => [post.id, post])).values());
        setPosts(merged);
      })
      .catch(() => setPosts(fallback));
  }, [user?.id]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-6 text-4xl font-black">Bookmarks</h1>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{posts.map((post) => <PostCard key={post.id} post={post} />)}</div>
    </section>
  );
}
