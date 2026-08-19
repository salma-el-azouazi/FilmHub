import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { Clapperboard, MessageCircle, PenLine, Search, ShieldCheck, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { samplePosts } from "../lib/mockData";

const orbitCards = samplePosts.slice(0, 6);

const featurePanels = [
  { label: "Guest", text: "View and search blogs", icon: Search, href: "/blogs" },
  { label: "User", text: "Create posts, follow, comment", icon: UserPlus, href: "/register" },
  { label: "Admin", text: "Manage users, posts, categories", icon: ShieldCheck, href: "/admin-login" }
];

export default function Cinema3DShowcase() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-cinema-teal">Immersive 3D cinema interface</p>
          <h2 className="mt-2 text-4xl font-black">FilmHub as a floating movie control room.</h2>
        </div>
        <Link to="/register" className="inline-flex items-center gap-2 rounded bg-white px-4 py-3 text-sm font-black text-cinema-ink">
          Join FilmHub <UserPlus size={17} />
        </Link>
      </div>

      <div className="filmhub-3d-stage">
        <div className="stage-light stage-light-a" />
        <div className="stage-light stage-light-b" />

        <motion.div
          className="central-screen"
          initial={{ opacity: 0, scale: 0.92, rotateX: 12 }}
          whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="screen-topbar">
            <span />
            <span />
            <span />
            <b>FilmHub Studio</b>
          </div>
          <div className="screen-body">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-cinema-gold">Now publishing</p>
              <h3>Movie reviews, rankings, news and recommendations</h3>
              <p>Write multimedia posts with posters, trailers, ratings, tags, comments, follows, bookmarks and admin moderation.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link to="/login" className="rounded bg-cinema-red px-4 py-2 text-sm font-bold">Login</Link>
                <Link to="/register" className="rounded bg-white px-4 py-2 text-sm font-bold text-cinema-ink">Register</Link>
                <Link to="/admin-login" className="rounded border border-white/20 px-4 py-2 text-sm font-bold">Admin</Link>
              </div>
            </div>
            <div className="mini-dashboard">
              <div><Clapperboard size={18} /> 3D posts</div>
              <div><PenLine size={18} /> Drafts</div>
              <div><MessageCircle size={18} /> Comments</div>
              <div><ShieldCheck size={18} /> Moderation</div>
            </div>
          </div>
        </motion.div>

        <div className="poster-orbit" aria-hidden="true">
          {orbitCards.map((post, index) => (
            <div key={post.id} className="orbit-card" style={{ "--i": index, "--count": orbitCards.length } as CSSProperties}>
              <img className="moving-poster-img" src={post.featured_image} alt="" />
              <div>
                <b>{post.category_name}</b>
                <span>{post.title}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="floating-feature-panels">
          {featurePanels.map((panel, index) => {
            const Icon = panel.icon;
            return (
              <Link key={panel.label} to={panel.href} className={`feature-panel feature-panel-${index + 1}`}>
                <Icon size={22} />
                <b>{panel.label}</b>
                <span>{panel.text}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
