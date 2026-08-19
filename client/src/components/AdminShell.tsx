import { BarChart3, FolderKanban, MessageSquare, Newspaper, Users } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

const items = [
  ["Dashboard", "/admin", BarChart3],
  ["Users", "/admin/users", Users],
  ["Posts", "/admin/posts", Newspaper],
  ["Categories", "/admin/categories", FolderKanban],
  ["Comments", "/admin/comments", MessageSquare],
  ["Analytics", "/admin/analytics", BarChart3]
] as const;

export default function AdminShell({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[230px_1fr]">
      <aside className="glass h-fit rounded-lg p-3">
        <div className="mb-3 rounded bg-cinema-red/15 px-3 py-3 text-sm">
          <b className="block text-cinema-gold">Admin Full Access</b>
          <span className="text-slate-400">Platform-wide control</span>
        </div>
        {items.map(([label, href, Icon]) => (
          <Link key={href} to={href} className="mb-1 flex items-center gap-2 rounded px-3 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white">
            <Icon size={17} /> {label}
          </Link>
        ))}
      </aside>
      <div>
        <h1 className="mb-6 text-3xl font-black">{title}</h1>
        {children}
      </div>
    </section>
  );
}
