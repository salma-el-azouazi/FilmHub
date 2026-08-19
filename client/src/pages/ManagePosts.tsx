import { CheckCircle2, Edit3, FileClock, RotateCcw, Star, Trash2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminShell from "../components/AdminShell";
import { api, FilmPost } from "../lib/api";
import { allDemoPosts, deleteDemoPost, moderateDemoPost } from "../lib/localDemoStore";
import { samplePosts } from "../lib/mockData";

export default function ManagePosts() {
  const [posts, setPosts] = useState<FilmPost[]>([]);
  const [reasons, setReasons] = useState<Record<number, string>>({});
  function fallbackPosts() {
    return [...allDemoPosts(), ...samplePosts];
  }
  function load() { api<FilmPost[]>("/admin/posts").then(setPosts).catch(() => setPosts(fallbackPosts())); }
  useEffect(load, []);
  async function moderate(id: number, status: string, featured = 0) {
    const block_reason = status === "blocked" || status === "rejected" ? reasons[id] || "Blocked by admin moderation" : null;
    try {
      await api(`/admin/posts/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status, featured, block_reason })
      });
      load();
    } catch {
      moderateDemoPost(id, { status, featured, block_reason: block_reason || undefined });
      setPosts((current) => current.map((post) => post.id === id ? { ...post, status, featured, block_reason: block_reason || undefined } : post));
    }
  }
  async function remove(id: number) {
    try {
      await api(`/admin/posts/${id}`, { method: "DELETE" });
      load();
    } catch {
      deleteDemoPost(id, null, true);
      setPosts((current) => current.filter((post) => post.id !== id));
    }
  }
  return (
    <AdminShell title="Manage Posts">
      <div className="mb-4 grid gap-4 md:grid-cols-4">
        <div className="admin-mini-card"><CheckCircle2 />Publish or restore any post.</div>
        <div className="admin-mini-card"><XCircle />Block or reject posts with a reason.</div>
        <div className="admin-mini-card"><Star />Feature important film writing.</div>
        <div className="admin-mini-card"><Trash2 />Delete unsafe or unwanted content.</div>
      </div>
      <div className="grid gap-3">
        {posts.map((post) => (
          <div key={post.id} className="glass flex flex-wrap items-center gap-3 rounded-lg p-4">
            <div className="mr-auto min-w-64">
              <b>{post.title}</b>
              <p className="text-sm text-slate-400">
                {post.author_name} - {post.status} - {post.views} views {post.block_reason ? `- ${post.block_reason}` : ""}
                {post.block_moderator_name ? ` - by ${post.block_moderator_name}` : ""}
                {post.blocked_at ? ` - ${new Date(post.blocked_at).toLocaleDateString()}` : ""}
              </p>
            </div>
            <input value={reasons[post.id] || ""} onChange={(e) => setReasons({ ...reasons, [post.id]: e.target.value })} className="h-10 min-w-56 rounded border border-white/10 bg-white/5 px-3 text-sm outline-none" placeholder="Moderation reason" />
            <Link title="Edit post" to={`/edit-post/${post.id}`} className="rounded p-2 hover:bg-white/10"><Edit3 size={18} /></Link>
            <button title="Publish" onClick={() => moderate(post.id, "published")} className="rounded p-2 hover:bg-white/10"><CheckCircle2 size={18} /></button>
            <button title="Restore as published" onClick={() => moderate(post.id, "published", post.featured || 0)} className="rounded p-2 hover:bg-white/10"><RotateCcw size={18} /></button>
            <button title="Move to draft" onClick={() => moderate(post.id, "draft")} className="rounded p-2 hover:bg-white/10"><FileClock size={18} /></button>
            <button title="Feature" onClick={() => moderate(post.id, post.status, 1)} className="rounded p-2 hover:bg-white/10"><Star size={18} /></button>
            <button title="Block post with reason" onClick={() => moderate(post.id, "blocked")} className="rounded p-2 hover:bg-white/10"><XCircle size={18} /></button>
            <button title="Reject post with reason" onClick={() => moderate(post.id, "rejected")} className="rounded border border-white/10 px-3 py-2 text-sm hover:bg-white/10">Reject</button>
            <button title="Delete" onClick={() => remove(post.id)} className="rounded p-2 text-cinema-red hover:bg-white/10"><Trash2 size={18} /></button>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
