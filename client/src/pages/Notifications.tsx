import { Bell, CheckCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../lib/api";

type Notice = { id: number; message: string; read_status: number; created_at: string };

export default function Notifications() {
  const [items, setItems] = useState<Notice[]>([]);
  function load() { api<Notice[]>("/users/notifications").then(setItems).catch(() => setItems([])); }
  useEffect(load, []);
  async function read() {
    await api("/users/notifications/read", { method: "PATCH" });
    load();
  }
  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-4xl font-black">Notifications</h1>
        <button onClick={read} className="inline-flex items-center gap-2 rounded border border-white/15 px-4 py-2"><CheckCheck size={18} />Mark read</button>
      </div>
      <div className="grid gap-3">
        {items.map((item) => (
          <div key={item.id} className={`glass rounded-lg p-4 ${item.read_status ? "opacity-65" : ""}`}>
            <Bell className="mb-2 text-cinema-teal" size={18} />
            <p>{item.message}</p>
            <p className="mt-1 text-xs text-slate-400">{new Date(item.created_at).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
