import { Save, Send } from "lucide-react";
import { SyntheticEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api, FilmPost } from "../lib/api";
import { listDemoPostsForUser, updateDemoPost } from "../lib/localDemoStore";
import { sampleCategories } from "../lib/mockData";

type Category = { id: number; name: string };

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    category_id: "",
    tags: "",
    rating: "0",
    trailer_url: "",
    featured_image: ""
  });

  useEffect(() => {
    api<Category[]>("/categories").then(setCategories).catch(() => setCategories(sampleCategories));
    const localPost = listDemoPostsForUser(user).find((item) => String(item.id) === String(id));
    if (localPost) {
      setForm({
        title: localPost.title,
        excerpt: localPost.excerpt || "",
        content: localPost.content,
        category_id: String(localPost.category_id || ""),
        tags: localPost.tags || "",
        rating: String(localPost.rating || 0),
        trailer_url: localPost.trailer_url || "",
        featured_image: localPost.featured_image || ""
      });
    }
    api<FilmPost[]>(user?.role === "admin" ? "/admin/posts" : "/posts/me").then((posts) => {
      const post = posts.find((item) => String(item.id) === String(id));
      if (post) {
        setForm({
          title: post.title,
          excerpt: post.excerpt || "",
          content: post.content,
          category_id: String(post.category_id || ""),
          tags: post.tags || "",
          rating: String(post.rating || 0),
          trailer_url: post.trailer_url || "",
          featured_image: post.featured_image || ""
        });
      }
    }).catch(() => undefined);
  }, [id, user?.id]);

  async function submit(status: "draft" | "published", event: SyntheticEvent) {
    event.preventDefault();
    let result: { slug: string };
    try {
      result = await api<{ slug: string }>(`/posts/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ ...form, status, category_id: form.category_id || null })
      });
    } catch {
      const localPost = updateDemoPost(user, Number(id), { ...form, status, category_id: form.category_id || null });
      result = { slug: localPost?.slug || "" };
    }
    if (!result.slug) return navigate("/my-posts");
    navigate(`/blogs/${result.slug}`);
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-4xl font-black">Edit Post</h1>
      <form className="glass grid gap-4 rounded-lg p-6">
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="h-12 rounded border border-white/10 bg-white/5 px-3 outline-none" />
        <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={3} className="rounded border border-white/10 bg-white/5 p-3 outline-none" />
        <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={11} required className="rounded border border-white/10 bg-white/5 p-3 outline-none" />
        <div className="grid gap-4 md:grid-cols-2">
          <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="h-12 rounded border border-white/10 bg-cinema-panel px-3">
            <option value="">Category</option>
            {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
          <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="h-12 rounded border border-white/10 bg-white/5 px-3 outline-none" />
          <input value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} type="number" min="0" max="10" step="0.1" className="h-12 rounded border border-white/10 bg-white/5 px-3 outline-none" />
          <input value={form.featured_image} onChange={(e) => setForm({ ...form, featured_image: e.target.value })} className="h-12 rounded border border-white/10 bg-white/5 px-3 outline-none" />
          <input value={form.trailer_url} onChange={(e) => setForm({ ...form, trailer_url: e.target.value })} className="h-12 rounded border border-white/10 bg-white/5 px-3 outline-none md:col-span-2" />
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={(e) => submit("published", e)} className="inline-flex items-center gap-2 rounded bg-cinema-red px-5 py-3 font-bold"><Send size={18} />Publish</button>
          <button onClick={(e) => submit("draft", e)} className="inline-flex items-center gap-2 rounded border border-white/15 px-5 py-3 font-bold"><Save size={18} />Save draft</button>
        </div>
      </form>
    </section>
  );
}
