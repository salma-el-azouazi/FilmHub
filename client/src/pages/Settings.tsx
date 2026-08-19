import { FormEvent, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

export default function Settings() {
  const { user, refresh } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault();
    await api("/users/me", { method: "PATCH", body: JSON.stringify({ name, bio }) });
    await refresh();
    setMessage("Profile updated");
  }
  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-4xl font-black">Settings</h1>
      <form onSubmit={submit} className="glass grid gap-4 rounded-lg p-6">
        <input value={name} onChange={(e) => setName(e.target.value)} className="h-12 rounded border border-white/10 bg-white/5 px-3 outline-none" />
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={5} className="rounded border border-white/10 bg-white/5 p-3 outline-none" placeholder="Bio" />
        <button className="rounded bg-cinema-red px-5 py-3 font-bold">Save profile</button>
        {message && <p className="text-sm text-cinema-teal">{message}</p>}
      </form>
    </section>
  );
}
