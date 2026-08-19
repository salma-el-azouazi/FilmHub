import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import AdminShell from "../components/AdminShell";
import { api } from "../lib/api";
import { sampleComments } from "../lib/mockData";

type Comment = { id: number; content: string; post_title: string; author_name: string; created_at: string };

export default function ManageComments() {
  const [comments, setComments] = useState<Comment[]>([]);
  function load() {
    api<Comment[]>("/admin/comments").then(setComments).catch(() => setComments(sampleComments.map((comment) => ({
      ...comment,
      post_title: "Why Neo-Noir Still Owns the Night",
      created_at: new Date().toISOString()
    }))));
  }
  useEffect(load, []);
  async function remove(id: number) {
    await api(`/admin/comments/${id}`, { method: "DELETE" }).catch(() => setComments((current) => current.filter((comment) => comment.id !== id)));
    load();
  }
  return (
    <AdminShell title="Manage Comments">
      <div className="grid gap-3">
        {comments.map((comment) => (
          <div key={comment.id} className="glass flex items-center gap-3 rounded-lg p-4">
            <div className="mr-auto"><b>{comment.author_name}</b><p className="text-sm text-slate-400">{comment.post_title}</p><p className="mt-1 text-slate-300">{comment.content}</p></div>
            <button onClick={() => remove(comment.id)} className="rounded p-2 text-cinema-red hover:bg-white/10"><Trash2 size={18} /></button>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
