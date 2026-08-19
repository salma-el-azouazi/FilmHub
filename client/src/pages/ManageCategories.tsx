import { Edit3, Plus, Save, Trash2 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import AdminShell from "../components/AdminShell";
import { api } from "../lib/api";
import { sampleCategories } from "../lib/mockData";

type Category = { id: number; name: string; description: string; icon?: string; post_count: number; views: number };

export default function ManageCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ name: "", description: "", icon: "Film" });
  const [editing, setEditing] = useState<Record<number, { name: string; description: string; icon: string }>>({});
  const [mergeTargets, setMergeTargets] = useState<Record<number, string>>({});
  function load() { api<Category[]>("/categories").then((data) => setCategories(data.length ? data : sampleCategories)).catch(() => setCategories(sampleCategories)); }
  useEffect(load, []);
  async function add(event: FormEvent) {
    event.preventDefault();
    try {
      await api("/admin/categories", { method: "POST", body: JSON.stringify(form) });
      load();
    } catch {
      setCategories((current) => [{ id: Date.now(), name: form.name, description: form.description, icon: form.icon, post_count: 0, views: 0 }, ...current]);
    }
    setForm({ name: "", description: "", icon: "Film" });
  }
  async function save(id: number) {
    const next = editing[id];
    if (!next) return;
    try {
      await api(`/admin/categories/${id}`, { method: "PATCH", body: JSON.stringify(next) });
      load();
    } catch {
      setCategories((current) => current.map((cat) => (cat.id === id ? { ...cat, ...next } : cat)));
    }
    setEditing((current) => {
      const copy = { ...current };
      delete copy[id];
      return copy;
    });
  }
  async function remove(id: number) {
    try {
      await api(`/admin/categories/${id}`, { method: "DELETE" });
      load();
    } catch {
      setCategories((current) => current.filter((cat) => cat.id !== id));
    }
  }
  async function merge(id: number) {
    const target = mergeTargets[id];
    if (!target) return;
    try {
      await api(`/admin/categories/${id}/merge`, { method: "POST", body: JSON.stringify({ target_category_id: target }) });
      load();
    } catch {
      setCategories((current) => current.filter((cat) => cat.id !== id));
    }
  }
  return (
    <AdminShell title="Manage Categories">
      <form onSubmit={add} className="glass mb-5 grid gap-3 rounded-lg p-4 md:grid-cols-[180px_140px_1fr_auto]">
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="h-11 rounded border border-white/10 bg-white/5 px-3" placeholder="Category name" />
        <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="h-11 rounded border border-white/10 bg-white/5 px-3" placeholder="Lucide icon" />
        <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="h-11 rounded border border-white/10 bg-white/5 px-3" placeholder="Description" />
        <button className="inline-flex items-center justify-center gap-2 rounded bg-cinema-red px-4 font-bold"><Plus size={17} />Add</button>
      </form>
      <div className="mb-4 grid gap-4 md:grid-cols-3">
        <div className="admin-mini-card"><Plus />Create official platform categories.</div>
        <div className="admin-mini-card"><Edit3 />Edit names and descriptions.</div>
        <div className="admin-mini-card"><Trash2 />Delete categories when needed.</div>
      </div>
      <div className="grid gap-3">
        {categories.map((cat) => (
          <div key={cat.id} className="glass flex flex-wrap items-center gap-3 rounded-lg p-4">
            <div className="mr-auto min-w-64">
              {editing[cat.id] ? (
                <div className="grid gap-2">
                  <input value={editing[cat.id].name} onChange={(event) => setEditing({ ...editing, [cat.id]: { ...editing[cat.id], name: event.target.value } })} className="h-10 rounded border border-white/10 bg-white/5 px-3 outline-none" />
                  <input value={editing[cat.id].icon} onChange={(event) => setEditing({ ...editing, [cat.id]: { ...editing[cat.id], icon: event.target.value } })} className="h-10 rounded border border-white/10 bg-white/5 px-3 outline-none" />
                  <input value={editing[cat.id].description} onChange={(event) => setEditing({ ...editing, [cat.id]: { ...editing[cat.id], description: event.target.value } })} className="h-10 rounded border border-white/10 bg-white/5 px-3 outline-none" />
                </div>
              ) : (
                <>
                  <b>{cat.name}</b>
                  <p className="text-xs uppercase tracking-[0.16em] text-cinema-gold">{cat.icon || "Film"}</p>
                  <p className="text-sm text-slate-400">{cat.description}</p>
                  <p className="text-sm text-slate-500">{cat.post_count} posts - {cat.views} views</p>
                </>
              )}
            </div>
            {editing[cat.id] ? (
              <button onClick={() => save(cat.id)} className="inline-flex items-center gap-2 rounded bg-cinema-red px-3 py-2 text-sm font-bold"><Save size={17} />Save</button>
            ) : (
              <button onClick={() => setEditing({ ...editing, [cat.id]: { name: cat.name, description: cat.description, icon: cat.icon || "Film" } })} className="rounded p-2 hover:bg-white/10"><Edit3 size={18} /></button>
            )}
            <select value={mergeTargets[cat.id] || ""} onChange={(e) => setMergeTargets({ ...mergeTargets, [cat.id]: e.target.value })} className="h-10 rounded border border-white/10 bg-cinema-panel px-2 text-sm">
              <option value="">Merge into</option>
              {categories.filter((target) => target.id !== cat.id).map((target) => <option key={target.id} value={target.id}>{target.name}</option>)}
            </select>
            <button onClick={() => merge(cat.id)} className="rounded border border-white/10 px-3 py-2 text-sm hover:bg-white/10">Merge</button>
            <button onClick={() => remove(cat.id)} className="rounded p-2 text-cinema-red hover:bg-white/10"><Trash2 size={18} /></button>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
