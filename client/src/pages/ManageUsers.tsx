import { CheckCircle2, Crown, KeyRound, Search, ShieldBan, Trash2, UserPlus, XCircle } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import AdminShell from "../components/AdminShell";
import { api } from "../lib/api";
import { createDemoUser, deleteDemoUser, listDemoUsers, updateDemoUser } from "../lib/localDemoStore";

type AdminUser = { id: number; name: string; email: string; role: string; status: string; posts: number; followers: number };

export default function ManageUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [form, setForm] = useState({ name: "", email: "", password: "FilmHub123!", role: "user" });
  const [search, setSearch] = useState("");
  function fallbackUsers() {
    const baseline: AdminUser[] = [
      { id: 1, name: "Admin Director", email: "admin@filmhub.test", role: "admin", status: "active", posts: 0, followers: 8 },
      { id: 2, name: "Maya Sterling", email: "maya@filmhub.test", role: "user", status: "active", posts: 0, followers: 52 },
      { id: 3, name: "Jonas Vale", email: "jonas@filmhub.test", role: "user", status: "posting_blocked", posts: 0, followers: 37 }
    ];
    const demo = listDemoUsers().map((user) => ({ ...user, role: user.role, posts: user.posts || 0, followers: user.followers || 0 }));
    return [...demo, ...baseline.filter((base) => !demo.some((user) => user.id === base.id || user.email === base.email))];
  }
  function load() {
    const query = search.trim() ? `?search=${encodeURIComponent(search.trim())}` : "";
    api<AdminUser[]>(`/admin/users${query}`).then(setUsers).catch(() => {
      const fallback = fallbackUsers();
      const term = search.trim().toLowerCase();
      setUsers(term ? fallback.filter((user) => `${user.name} ${user.email} ${user.role} ${user.status}`.toLowerCase().includes(term)) : fallback);
    });
  }
  useEffect(load, []);
  async function add(event: FormEvent) {
    event.preventDefault();
    try {
      await api("/admin/users", { method: "POST", body: JSON.stringify(form) });
      load();
    } catch {
      createDemoUser(form);
      setUsers(fallbackUsers());
    }
    setForm({ name: "", email: "", password: "FilmHub123!", role: "user" });
  }
  async function updateUser(id: number, payload: Partial<AdminUser> & { password?: string }) {
    try {
      await api(`/admin/users/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
      load();
    } catch {
      updateDemoUser(id, payload);
      setUsers((current) => current.map((user) => (user.id === id ? { ...user, ...payload } : user)));
    }
  }
  async function resetPassword(id: number) {
    await api(`/admin/users/${id}`, { method: "PATCH", body: JSON.stringify({ password: "FilmHub123!" }) }).catch(() => undefined);
  }
  async function remove(id: number) {
    try {
      await api(`/admin/users/${id}`, { method: "DELETE" });
      load();
    } catch {
      deleteDemoUser(id);
      setUsers((current) => current.filter((user) => user.id !== id));
    }
  }
  return (
    <AdminShell title="Manage Users">
      <form onSubmit={add} className="glass mb-5 grid gap-3 rounded-lg p-4 md:grid-cols-5">
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="h-11 rounded border border-white/10 bg-white/5 px-3" placeholder="Name" />
        <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required type="email" className="h-11 rounded border border-white/10 bg-white/5 px-3" placeholder="Email" />
        <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="h-11 rounded border border-white/10 bg-white/5 px-3" placeholder="Password" />
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="h-11 rounded border border-white/10 bg-cinema-panel px-3"><option>user</option><option>admin</option></select>
        <button className="inline-flex items-center justify-center gap-2 rounded bg-cinema-red px-4 font-bold"><UserPlus size={17} />Add</button>
      </form>
      <form onSubmit={(event) => { event.preventDefault(); load(); }} className="glass mb-5 flex gap-3 rounded-lg p-4">
        <div className="flex flex-1 items-center gap-2 rounded border border-white/10 bg-white/5 px-3">
          <Search size={17} className="text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="h-11 w-full bg-transparent outline-none" placeholder="Search users by name, email, role, or status" />
        </div>
        <button className="rounded bg-white px-4 font-bold text-cinema-ink">Search</button>
      </form>
      <div className="mb-4 grid gap-4 md:grid-cols-3">
        <div className="admin-mini-card"><Crown />Admins can promote users to administrator.</div>
        <div className="admin-mini-card"><XCircle />Admins can block posting without deleting accounts.</div>
        <div className="admin-mini-card"><KeyRound />Admins can reset credentials when needed.</div>
      </div>
      <div className="grid gap-3">
        {users.map((user) => (
          <div key={user.id} className="glass flex flex-wrap items-center gap-3 rounded-lg p-4">
            <div className="mr-auto"><b>{user.name}</b><p className="text-sm text-slate-400">{user.email} - {user.role} - {user.status} - {user.posts} posts</p></div>
            <button title="Activate user" onClick={() => updateUser(user.id, { status: "active" })} className="inline-flex items-center gap-2 rounded border border-white/10 px-3 py-2 text-sm hover:bg-white/10"><CheckCircle2 size={17} />Activate</button>
            <button title="Suspend user" onClick={() => updateUser(user.id, { status: "suspended" })} className="inline-flex items-center gap-2 rounded border border-white/10 px-3 py-2 text-sm hover:bg-white/10"><ShieldBan size={17} />Suspend</button>
            <button title="Disable user" onClick={() => updateUser(user.id, { status: "disabled" })} className="inline-flex items-center gap-2 rounded border border-white/10 px-3 py-2 text-sm hover:bg-white/10"><ShieldBan size={17} />Disable</button>
            <button title="Block posting privileges" onClick={() => updateUser(user.id, { status: "posting_blocked" })} className="inline-flex items-center gap-2 rounded border border-white/10 px-3 py-2 text-sm hover:bg-white/10"><XCircle size={17} />Block posting</button>
            <button title="Restore posting privileges" onClick={() => updateUser(user.id, { status: "active" })} className="inline-flex items-center gap-2 rounded border border-white/10 px-3 py-2 text-sm hover:bg-white/10"><CheckCircle2 size={17} />Restore posting</button>
            <button title="Promote or demote role" onClick={() => updateUser(user.id, { role: user.role === "admin" ? "user" : "admin" })} className="inline-flex items-center gap-2 rounded border border-white/10 px-3 py-2 text-sm hover:bg-white/10"><Crown size={17} />{user.role === "admin" ? "Demote" : "Promote"}</button>
            <button title="Reset password to FilmHub123!" onClick={() => resetPassword(user.id)} className="inline-flex items-center gap-2 rounded border border-white/10 px-3 py-2 text-sm hover:bg-white/10"><KeyRound size={17} />Reset password</button>
            <button title="Delete user" onClick={() => remove(user.id)} className="rounded p-2 text-cinema-red hover:bg-white/10"><Trash2 size={18} /></button>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
