import { motion } from "framer-motion";
import { Bell, Bookmark, Clapperboard, Heart, Lock, Newspaper, PenLine, ShieldCheck, Star, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatCard from "../components/StatCard";
import { useAuth } from "../context/AuthContext";
import { api, FilmPost } from "../lib/api";
import { listDemoPostsForUser } from "../lib/localDemoStore";

export default function Dashboard() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<FilmPost[]>([]);
  useEffect(() => {
    setPosts(listDemoPostsForUser(user));
    api<FilmPost[]>("/posts/me")
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .catch(() => setPosts(listDemoPostsForUser(user)));
  }, [user?.id]);
  const likes = posts.reduce((sum, post) => sum + Number(post.likes || 0), 0);
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="creator-cockpit mb-8 grid gap-6 lg:grid-cols-[1fr_430px]">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-cinema-teal">Creator dashboard</p>
          <h1 className="mt-2 text-5xl font-black">Hello, {user?.name}</h1>
          <p className="mt-4 max-w-2xl text-slate-300">Your user space is for writing, posting, commenting, bookmarking, and following. Admin controls stay separated in the command center.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/create-post" className="inline-flex items-center gap-2 rounded bg-cinema-red px-5 py-3 font-bold"><PenLine size={18} />Create post</Link>
            {user?.role === "admin" && <Link to="/admin" className="inline-flex items-center gap-2 rounded border border-cinema-gold/40 px-5 py-3 font-bold text-cinema-gold"><ShieldCheck size={18} />Admin full control</Link>}
          </div>
        </div>
        <div className="creator-card-stack">
          {posts.length ? posts.slice(0, 3).map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: -80, rotate: index % 2 ? 12 : -12 }}
              animate={{ opacity: 1, y: 0, rotate: index % 2 ? 4 : -4 }}
              transition={{ delay: index * 0.12, type: "spring", stiffness: 110 }}
              className={`creator-floating-card creator-floating-card-${index + 1}`}
            >
              <img src={post.featured_image} alt={post.title} />
              <div><span>{post.category_name}</span><b>{post.title}</b></div>
            </motion.div>
          )) : (
            <div className="glass rounded-lg p-5 text-slate-300">
              <Clapperboard className="mb-4 text-cinema-red" />
              <b className="block text-xl text-white">No posts yet</b>
              <p className="mt-2 text-sm leading-6">Your new account starts empty. Create your first movie blog and it will appear here.</p>
            </div>
          )}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard icon={Newspaper} label="Total posts" value={posts.length} />
        <StatCard icon={Heart} label="Likes received" value={likes} />
        <StatCard icon={Bookmark} label="Bookmarks" value="Saved" />
        <StatCard icon={Users} label="Community" value={user?.role || "user"} />
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {([
          ["My Posts", "/my-posts", Newspaper],
          ["Bookmarks", "/bookmarks", Bookmark],
          ["Notifications", "/notifications", Bell]
        ] as const).map(([label, href, Icon]) => (
          <Link key={href} to={href} className="glass rounded-lg p-5 hover:bg-white/10">
            <Icon className="mb-4 text-cinema-teal" />
            <h2 className="text-xl font-black">{label}</h2>
          </Link>
        ))}
      </div>
      <div className="mt-8 grid gap-4 lg:grid-cols-4">
        {posts.slice(0, 4).map((post, index) => (
          <motion.div whileHover={{ y: -10, rotateY: index % 2 ? -5 : 5 }} key={post.id} className="dashboard-movie-tile glass rounded-lg p-4">
            <Clapperboard className="mb-3 text-cinema-red" />
            <h3 className="line-clamp-2 font-black">{post.title}</h3>
            <p className="mt-2 flex items-center gap-1 text-sm text-cinema-gold"><Star size={15} />{Number(post.rating || 0).toFixed(1)} rank score</p>
          </motion.div>
        ))}
      </div>
      {!posts.length && (
        <div className="glass mt-8 rounded-lg p-6">
          <h2 className="text-2xl font-black">Your creator space is empty</h2>
          <p className="mt-3 max-w-2xl text-slate-300">When you publish or save a draft, it will show here and in My Posts. From there you can edit or delete it.</p>
          <Link to="/create-post" className="mt-5 inline-flex items-center gap-2 rounded bg-cinema-red px-5 py-3 font-bold"><PenLine size={18} />Create your first post</Link>
        </div>
      )}
      <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_.9fr]">
        <section className="glass rounded-lg p-5">
          <h2 className="mb-4 text-2xl font-black">Creator Access</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {([
              ["Write multimedia review", "/create-post", PenLine],
              ["Edit my posts", "/my-posts", Newspaper],
              ["Saved cinema list", "/bookmarks", Bookmark],
              ["Notification center", "/notifications", Bell]
            ] as const).map(([label, href, Icon]) => (
              <Link key={label} to={href} className="admin-command-card">
                <Icon size={22} />
                <b>{label}</b>
                <span>User-level access</span>
              </Link>
            ))}
          </div>
        </section>
        <section className="glass rounded-lg p-5">
          <h2 className="mb-4 text-2xl font-black">Recent Creator Activity</h2>
          <div className="grid gap-3">
            {posts.length ? posts.slice(0, 5).map((post) => (
              <div key={`activity-${post.id}`} className="rounded border border-white/10 bg-white/5 p-3">
                <b className="line-clamp-2">{post.title}</b>
                <p className="mt-1 text-sm text-slate-400">{post.views} views - {post.likes} likes - {post.category_name}</p>
              </div>
            )) : <p className="rounded border border-white/10 bg-white/5 p-3 text-sm text-slate-400">No activity yet. Publish a post to start building your archive.</p>}
          </div>
        </section>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="glass rounded-lg p-5">
          <ShieldCheck className="mb-4 text-cinema-teal" />
          <h2 className="text-xl font-black">Normal User Access</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">Create multimedia posts, edit/delete your own posts, comment, follow posters, bookmark content, and receive notifications.</p>
        </div>
        <div className="glass rounded-lg p-5 opacity-80">
          <Lock className="mb-4 text-cinema-red" />
          <h2 className="text-xl font-black">Admin-Only Controls</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">Managing all users, blocking posting, resetting passwords, moderating all posts, deleting comments, editing categories, analytics, and broadcasts are reserved for administrators.</p>
        </div>
      </div>
    </section>
  );
}
