import { Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api, FilmPost } from "../lib/api";
import { deleteDemoPost, listDemoPostsForUser } from "../lib/localDemoStore";

export default function MyPosts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<FilmPost[]>([]);
  function load() {
    setPosts(listDemoPostsForUser(user));
    api<FilmPost[]>("/posts/me").then(setPosts).catch(() => setPosts(listDemoPostsForUser(user)));
  }
  useEffect(load, [user?.id]);
  async function remove(id: number) {
    await api(`/posts/${id}`, { method: "DELETE" }).catch(() => deleteDemoPost(id, user));
    load();
  }
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-4xl font-black">My Posts</h1>
      <div className="grid gap-3">
        {!posts.length && (
          <div className="glass rounded-lg p-6">
            <h2 className="text-2xl font-black">No posts yet</h2>
            <p className="mt-2 text-slate-300">This account is empty until you create a post. Drafts and published posts will both appear here.</p>
            <Link to="/create-post" className="mt-5 inline-flex rounded bg-cinema-red px-5 py-3 font-bold">Create post</Link>
          </div>
        )}
        {posts.map((post) => (
          <div key={post.id} className="glass flex flex-wrap items-center gap-3 rounded-lg p-4">
            <div className="mr-auto">
              <h2 className="font-bold">{post.title}</h2>
              <p className="text-sm text-slate-400">{post.status} - {post.views} views - {post.likes} likes</p>
            </div>
            <Link to={`/edit-post/${post.id}`} className="rounded p-2 hover:bg-white/10"><Edit size={18} /></Link>
            <button onClick={() => remove(post.id)} className="rounded p-2 text-cinema-red hover:bg-white/10"><Trash2 size={18} /></button>
          </div>
        ))}
      </div>
    </section>
  );
}
