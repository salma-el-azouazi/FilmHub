import { Save, Send } from "lucide-react";
import { SyntheticEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { createDemoPost } from "../lib/localDemoStore";
import { sampleCategories } from "../lib/mockData";

type Category = { id: number; name: string };

export default function PostForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    category_id: "",
    tags: "",
    rating: "8.0",
    trailer_url: "",
    featured_image: ""
  });
  const [featuredFile, setFeaturedFile] = useState<File | null>(null);
  const [trailerFile, setTrailerFile] = useState<File | null>(null);

  useEffect(() => { api<Category[]>("/categories").then((data) => setCategories(data.length ? data : sampleCategories)).catch(() => setCategories(sampleCategories)); }, []);

  async function submit(status: "draft" | "published", event: SyntheticEvent) {
    event.preventDefault();
    let result: { slug: string };
    try {
      if (featuredFile || trailerFile) {
        const body = new FormData();
        Object.entries({ ...form, status, category_id: form.category_id || "" }).forEach(([key, value]) => body.append(key, value));
        if (featuredFile) body.append("featured_image", featuredFile);
        if (trailerFile) body.append("trailer", trailerFile);
        result = await api<{ slug: string }>("/posts", { method: "POST", body });
      } else {
        const body = JSON.stringify({ ...form, status, category_id: form.category_id || null });
        result = await api<{ slug: string }>("/posts", { method: "POST", body });
      }
    } catch {
      if (!user) return;
      const localPost = createDemoPost(user, form, status);
      result = { slug: localPost.slug };
    }
    navigate(`/blogs/${result.slug}`);
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-4xl font-black">Create Post</h1>
      <form className="glass grid gap-4 rounded-lg p-6">
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="h-12 rounded border border-white/10 bg-white/5 px-3 outline-none" placeholder="Movie blog title" />
        <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={3} className="rounded border border-white/10 bg-white/5 p-3 outline-none" placeholder="Excerpt" />
        <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={11} required className="rounded border border-white/10 bg-white/5 p-3 outline-none" placeholder="Rich text content. HTML tags like <p> and <strong> are supported." />
        <div className="grid gap-4 md:grid-cols-2">
          <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="h-12 rounded border border-white/10 bg-cinema-panel px-3">
            <option value="">Category</option>
            {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
          <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="h-12 rounded border border-white/10 bg-white/5 px-3 outline-none" placeholder="Tags: noir, ranking, festival" />
          <input value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} type="number" min="0" max="10" step="0.1" className="h-12 rounded border border-white/10 bg-white/5 px-3 outline-none" placeholder="Rating" />
          <input value={form.featured_image} onChange={(e) => setForm({ ...form, featured_image: e.target.value })} className="h-12 rounded border border-white/10 bg-white/5 px-3 outline-none" placeholder="Featured image URL" />
          <input value={form.trailer_url} onChange={(e) => setForm({ ...form, trailer_url: e.target.value })} className="h-12 rounded border border-white/10 bg-white/5 px-3 outline-none md:col-span-2" placeholder="Trailer embed URL" />
          <label className="rounded border border-dashed border-white/15 bg-white/5 p-3 text-sm text-slate-300">
            Upload poster/image/GIF
            <input onChange={(e) => setFeaturedFile(e.target.files?.[0] || null)} type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="mt-2 block w-full text-sm" />
          </label>
          <label className="rounded border border-dashed border-white/15 bg-white/5 p-3 text-sm text-slate-300">
            Upload trailer video
            <input onChange={(e) => setTrailerFile(e.target.files?.[0] || null)} type="file" accept="video/mp4,video/webm" className="mt-2 block w-full text-sm" />
          </label>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={(e) => submit("published", e)} className="inline-flex items-center gap-2 rounded bg-cinema-red px-5 py-3 font-bold"><Send size={18} />Publish</button>
          <button onClick={(e) => submit("draft", e)} className="inline-flex items-center gap-2 rounded border border-white/15 px-5 py-3 font-bold"><Save size={18} />Save draft</button>
        </div>
      </form>
    </section>
  );
}
