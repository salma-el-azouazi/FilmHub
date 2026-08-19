import {
  Ban,
  BarChart3,
  BellRing,
  CheckCircle2,
  FolderKanban,
  KeyRound,
  MessageSquare,
  Newspaper,
  ShieldAlert,
  ShieldCheck,
  Tags,
  Trash2,
  Users,
  XCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { BarElement, CategoryScale, Chart as ChartJS, LinearScale, Tooltip } from "chart.js";
import AdminShell from "../components/AdminShell";
import StatCard from "../components/StatCard";
import { api } from "../lib/api";
import { sampleCategories, samplePosts } from "../lib/mockData";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

type DashboardData = {
  stats: {
    totalUsers: number;
    activeUsers: number;
    suspendedUsers?: number;
    postingBlockedUsers?: number;
    totalPosts: number;
    publishedPosts: number;
    blockedPosts?: number;
    rejectedPosts?: number;
    draftPosts?: number;
    totalComments: number;
    categories: number;
  };
  topPosts: { id: number; title: string; views: number; likes: number }[];
  traffic: { date: string; posts: number }[];
  recentActivity?: { type: string; label: string; status: string; created_at: string }[];
};

const fallbackDashboard: DashboardData = {
  stats: {
    totalUsers: 18,
    activeUsers: 15,
    suspendedUsers: 1,
    postingBlockedUsers: 2,
    totalPosts: samplePosts.length,
    publishedPosts: samplePosts.length - 1,
    blockedPosts: 1,
    rejectedPosts: 1,
    draftPosts: 3,
    totalComments: 42,
    categories: sampleCategories.length
  },
  topPosts: samplePosts.slice(0, 6).map((post) => ({ id: post.id, title: post.title, views: post.views, likes: post.likes })),
  traffic: Array.from({ length: 7 }, (_, index) => ({ date: new Date(Date.now() - (6 - index) * 86400000).toISOString(), posts: [2, 4, 3, 5, 7, 6, 9][index] })),
  recentActivity: [
    { type: "post", label: "Post blocked with reason", status: "blocked", created_at: new Date().toISOString() },
    { type: "user", label: "Posting privilege revoked", status: "posting_blocked", created_at: new Date().toISOString() },
    { type: "comment", label: "Comment removed from discussion", status: "moderated", created_at: new Date().toISOString() }
  ]
};

const commandTabs = {
  users: [
    ["Add user", "/admin/users", Users],
    ["Suspend account", "/admin/users", Ban],
    ["Block posting", "/admin/users", XCircle],
    ["Reset password", "/admin/users", KeyRound]
  ],
  content: [
    ["Review all posts", "/admin/posts", Newspaper],
    ["Publish or restore", "/admin/posts", CheckCircle2],
    ["Block with reason", "/admin/posts", ShieldAlert],
    ["Delete unsafe content", "/admin/posts", Trash2]
  ],
  system: [
    ["Manage categories", "/admin/categories", FolderKanban],
    ["Moderate comments", "/admin/comments", MessageSquare],
    ["View analytics", "/admin/analytics", BarChart3],
    ["Broadcast notice", "/admin", BellRing]
  ]
} as const;

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [activeTab, setActiveTab] = useState<keyof typeof commandTabs>("users");
  const [broadcast, setBroadcast] = useState("Tonight's FilmHub moderation review is complete.");
  const [broadcastStatus, setBroadcastStatus] = useState("");

  useEffect(() => {
    api<DashboardData>("/admin/dashboard").then(setData).catch(() => setData(fallbackDashboard));
  }, []);

  async function sendBroadcast(event: FormEvent) {
    event.preventDefault();
    setBroadcastStatus("Sending broadcast...");
    const response = await api<{ message: string }>("/admin/notifications/broadcast", {
      method: "POST",
      body: JSON.stringify({ message: broadcast })
    }).catch(() => ({ message: "Demo broadcast sent to all visible users" }));
    setBroadcastStatus(response.message);
  }

  const stats = data?.stats || fallbackDashboard.stats;
  const chart = {
    labels: (data?.traffic || fallbackDashboard.traffic).map((item) => new Date(item.date).toLocaleDateString()),
    datasets: [{ label: "Posts", data: (data?.traffic || fallbackDashboard.traffic).map((item) => item.posts), backgroundColor: "#ff355e" }]
  };
  const activeCommands = commandTabs[activeTab];

  return (
    <AdminShell title="Admin Full-Control Command Center">
      <section className="admin-command-hero mb-6">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-cinema-gold">Administrator authority</p>
          <h2>Full access over FilmHub users, content, categories, comments, analytics, and notifications.</h2>
          <p>Normal users manage only their own posts and interactions. Administrators supervise the whole platform and can override user actions.</p>
        </div>
        <ShieldCheck size={64} />
        <div className="admin-floating-controls" aria-hidden="true">
          {["Users", "Posts", "Categories"].map((label, index) => (
            <motion.span
              key={label}
              initial={{ opacity: 0, y: -70, rotate: index % 2 ? 16 : -16 }}
              animate={{ opacity: 1, y: 0, rotate: index % 2 ? 5 : -5 }}
              transition={{ delay: 0.2 + index * 0.12, type: "spring", stiffness: 120 }}
            >
              {label}
            </motion.span>
          ))}
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard icon={Users} label="Total users" value={stats.totalUsers || 0} />
        <StatCard icon={Ban} label="Suspended/blocked users" value={(stats.suspendedUsers || 0) + (stats.postingBlockedUsers || 0)} />
        <StatCard icon={Newspaper} label="All posts" value={stats.totalPosts || 0} />
        <StatCard icon={ShieldAlert} label="Blocked/rejected posts" value={(stats.blockedPosts || 0) + (stats.rejectedPosts || 0)} />
      </div>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {([
          ["Content Library", `${samplePosts.length} movies, films, anime and documentary posts`, Newspaper],
          ["Category System", `${sampleCategories.length} official platform categories`, Tags],
          ["Moderation Scope", "Full access to users, posts, comments and notifications", ShieldCheck]
        ] as const).map(([title, text, Icon]) => (
          <motion.div key={title} whileHover={{ y: -8, rotateY: 5 }} className="admin-mini-card min-h-24">
            <Icon />
            <div>
              <b className="block text-white">{title}</b>
              <span>{text}</span>
            </div>
          </motion.div>
        ))}
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[1fr_.9fr]">
        <div className="glass rounded-lg p-5">
          <div className="mb-4 flex flex-wrap gap-2">
            {(Object.keys(commandTabs) as Array<keyof typeof commandTabs>).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded px-4 py-2 text-sm font-black capitalize ${activeTab === tab ? "bg-cinema-red" : "bg-white/8 hover:bg-white/12"}`}>
                {tab} control
              </button>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {activeCommands.map(([label, href, Icon]) => (
              <motion.div key={label} whileHover={{ y: -8, rotateY: 5 }}>
                <Link to={href} className="admin-command-card">
                <Icon size={22} />
                <b>{label}</b>
                <span>Admin-only action</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        <form onSubmit={sendBroadcast} className="glass rounded-lg p-5">
          <div className="mb-4 flex items-center gap-3">
            <BellRing className="text-cinema-gold" />
            <div>
              <h3 className="text-xl font-black">System Broadcast</h3>
              <p className="text-sm text-slate-400">Send a notification to all non-suspended users.</p>
            </div>
          </div>
          <textarea value={broadcast} onChange={(event) => setBroadcast(event.target.value)} rows={5} className="w-full rounded border border-white/10 bg-white/5 p-3 outline-none" />
          <button className="mt-3 rounded bg-cinema-red px-5 py-3 font-black">Broadcast to users</button>
          {broadcastStatus && <p className="mt-3 text-sm text-cinema-teal">{broadcastStatus}</p>}
        </form>
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
        <div className="glass rounded-lg p-5">
          <h3 className="mb-4 text-xl font-black">Traffic and Publishing Analytics</h3>
          <Bar data={chart} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
        <div className="glass rounded-lg p-5">
          <h3 className="mb-4 text-xl font-black">Most Viewed Posts</h3>
          <div className="grid gap-3">
            {(data?.topPosts || fallbackDashboard.topPosts).map((post) => (
              <div key={post.id} className="rounded bg-white/5 p-3">
                <b>{post.title}</b>
                <p className="text-sm text-slate-400">{post.views} views - {post.likes} likes</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="glass rounded-lg p-5">
          <h3 className="mb-4 text-xl font-black">Admin vs Normal User Access</h3>
          <div className="grid gap-2 text-sm">
            {[
              ["Create/edit/delete own posts", "Yes", "Yes"],
              ["Manage all users", "No", "Yes"],
              ["Block posting privileges", "No", "Yes"],
              ["Reset passwords", "No", "Yes"],
              ["Block/reject any post with reason", "No", "Yes"],
              ["Manage categories and analytics", "No", "Yes"],
              ["Delete/moderate comments", "No", "Yes"],
              ["Broadcast notifications", "No", "Yes"]
            ].map(([capability, user, admin]) => (
              <div key={capability} className="grid grid-cols-[1fr_70px_70px] items-center gap-2 rounded bg-white/5 px-3 py-2">
                <span>{capability}</span>
                <span className={user === "Yes" ? "text-cinema-teal" : "text-slate-500"}>{user}</span>
                <span className="font-black text-cinema-gold">{admin}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-lg p-5">
          <h3 className="mb-4 text-xl font-black">Recent Platform Activity</h3>
          <div className="grid gap-3">
            {(data?.recentActivity || fallbackDashboard.recentActivity || []).map((item, index) => (
              <div key={`${item.type}-${index}`} className="rounded border border-white/10 bg-white/5 p-3">
                <div className="flex items-center justify-between gap-3">
                  <b className="capitalize text-cinema-teal">{item.type}</b>
                  <span className="rounded bg-white/10 px-2 py-1 text-xs">{item.status}</span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-slate-300">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AdminShell>
  );
}
