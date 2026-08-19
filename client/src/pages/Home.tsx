import { motion } from "framer-motion";
import { ArrowRight, Clapperboard, Film, Flame, KeyRound, MessageCircle, PenLine, Search, ShieldCheck, Sparkles, Ticket, UserCog, UserPlus, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HeroScene from "../components/HeroScene";
import Cinema3DShowcase from "../components/Cinema3DShowcase";
import MovingPosterRail from "../components/MovingPosterRail";
import PostCard from "../components/PostCard";
import StatCard from "../components/StatCard";
import { api, FilmPost } from "../lib/api";
import { listPublishedDemoPosts } from "../lib/localDemoStore";
import { genreCards, sampleFilms, samplePosts } from "../lib/mockData";

export default function Home() {
  const [posts, setPosts] = useState<FilmPost[]>([]);

  useEffect(() => {
    const fallback = [...listPublishedDemoPosts(), ...samplePosts].slice(0, 12);
    setPosts(fallback);
    api<FilmPost[]>("/posts/trending").then((data) => setPosts(data.length ? data : fallback)).catch(() => setPosts(fallback));
  }, []);

  const roles = [
    {
      title: "Guest users",
      icon: Search,
      lines: ["View blogs", "Search by title or content", "Read public comments"],
      tone: "text-cinema-teal",
      action: "Browse blogs",
      href: "/blogs"
    },
    {
      title: "Normal users",
      icon: PenLine,
      lines: ["Create, edit, and delete multimedia posts", "Follow posters", "Comment on posts"],
      tone: "text-cinema-gold",
      action: "Register",
      href: "/register"
    },
    {
      title: "Administrator",
      icon: ShieldCheck,
      lines: ["Add, delete, suspend, and reset users", "Block posting privileges", "Moderate posts with reasons and manage categories"],
      tone: "text-cinema-red",
      action: "Admin panel",
      href: "/admin-login"
    }
  ];

  return (
    <>
      <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
        <HeroScene />
        <div className="absolute inset-0 bg-gradient-to-r from-cinema-ink via-cinema-ink/70 to-transparent" />
        <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-9 px-4 pb-24 pt-14 lg:grid-cols-[1fr_430px]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded border border-white/15 bg-white/8 px-3 py-2 text-sm text-cinema-teal">
              <Sparkles size={16} /> 3D movie blogs, film reviews, rankings, and community debate
            </div>
            <h1 className="text-5xl font-black leading-none sm:text-7xl">FilmHub</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              A cinematic movie platform with visible access for guests, writers, and administrators. Browse films, publish multimedia posts, comment, follow posters, and manage the community from a film-studio dashboard.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/blogs" className="inline-flex items-center gap-2 rounded bg-cinema-red px-5 py-3 font-bold shadow-glow">
                Explore blogs <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="inline-flex items-center gap-2 rounded border border-white/15 px-5 py-3 font-bold hover:bg-white/10">
                Login <KeyRound size={18} />
              </Link>
              <Link to="/register" className="inline-flex items-center gap-2 rounded bg-white px-5 py-3 font-bold text-cinema-ink">
                Register <UserPlus size={18} />
              </Link>
              <Link to="/admin-login" className="inline-flex items-center gap-2 rounded border border-cinema-red/50 bg-cinema-red/15 px-5 py-3 font-bold text-white hover:bg-cinema-red/25">
                Admin Panel <ShieldCheck size={18} />
              </Link>
            </div>
          </motion.div>
          <motion.aside initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="hero-ticket glass rounded-lg p-5">
            <div className="mb-4 flex items-center justify-between border-b border-dashed border-white/20 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-cinema-gold">Access Pass</p>
                <h2 className="text-2xl font-black">Choose your role</h2>
              </div>
              <Ticket className="text-cinema-red" size={34} />
            </div>
            <div className="grid gap-3">
              <Link to="/blogs" className="cinema-pass flex items-center gap-3 rounded p-3">
                <Search className="text-cinema-teal" />
                <span><b>Guest</b><small>View and search public blogs</small></span>
              </Link>
              <Link to="/login" className="cinema-pass flex items-center gap-3 rounded p-3">
                <KeyRound className="text-cinema-gold" />
                <span><b>Login</b><small>Comment, follow, bookmark, write</small></span>
              </Link>
              <Link to="/register" className="cinema-pass flex items-center gap-3 rounded p-3">
                <UserPlus className="text-white" />
                <span><b>Register</b><small>Create a normal user account</small></span>
              </Link>
              <Link to="/admin-login" className="cinema-pass admin-pass flex items-center gap-3 rounded p-3">
                <ShieldCheck className="text-cinema-red" />
                <span><b>Admin</b><small>Manage users, posts, categories</small></span>
              </Link>
            </div>
          </motion.aside>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-cinema-ink to-transparent" />
      </section>

      <section className="mx-auto -mt-12 grid max-w-7xl gap-4 px-4 pb-10 md:grid-cols-3">
        <StatCard icon={Flame} label="Trending essays" value={posts.length || 8} />
        <StatCard icon={UsersRound} label="Community roles" value="Guest/User/Admin" />
        <StatCard icon={Sparkles} label="Interactive UI" value="3D + Motion" />
      </section>

      <Cinema3DShowcase />

      <MovingPosterRail />

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.24em] text-cinema-teal">Browse by genre</p>
          <h2 className="text-4xl font-black">Choose a cinema mood.</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {genreCards.map((genre, index) => (
            <motion.div key={genre.slug} whileHover={{ y: -10, rotateY: index % 2 ? -6 : 6, scale: 1.02 }} className="genre-card-3d">
              <Link to={`/blogs?genre=${genre.slug}`}>
                <img className="moving-poster-img" src={genre.image} alt={genre.label} />
                <div>
                  <span>Genre</span>
                  <b>{genre.label}</b>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="cinema-marquee mb-5 h-6 rounded opacity-70" />
        <div className="theater-screen grid items-center gap-8 rounded-xl p-5 lg:grid-cols-[.85fr_1.15fr] lg:p-8">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-cinema-teal">Featured films</p>
            <h2 className="mt-2 text-4xl font-black">A movie wall with depth, posters, ratings, and genre energy.</h2>
            <p className="mt-4 text-slate-300">
              FilmHub is styled around cinema objects: reels, clapperboards, projector light, poster cards, dark screening rooms, and animated glass panels.
            </p>
          </div>
          <div className="poster-stage grid grid-cols-2 gap-4 md:grid-cols-4">
            {sampleFilms.map((film, index) => (
              <motion.div
                key={film.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="poster-tilt glass overflow-hidden rounded-lg transition duration-300"
              >
                <div className="relative aspect-[2/3]">
                  <img src={film.poster} alt={film.title} className="moving-poster-img h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-xs uppercase tracking-widest text-cinema-teal">{film.genre}</p>
                    <h3 className="font-black leading-tight">{film.title}</h3>
                    <p className="mt-1 text-sm text-cinema-gold">{film.rating}/10</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-cinema-teal">Now playing</p>
            <h2 className="text-3xl font-black">Trending on FilmHub</h2>
          </div>
          <Link to="/blogs" className="text-sm font-bold text-cinema-gold">View all</Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => <PostCard key={post.id} post={post} />)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.24em] text-cinema-teal">Access rules</p>
          <h2 className="text-3xl font-black">User Roles Built Into FilmHub</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <div key={role.title} className="glass rounded-lg p-6 shadow-teal">
                <Icon className={`mb-5 ${role.tone}`} size={32} />
                <h3 className="text-2xl font-black">{role.title}</h3>
                <div className="mt-5 grid gap-3">
                  {role.lines.map((line) => (
                    <div key={line} className="flex items-start gap-3 text-sm text-slate-300">
                      <Film className="mt-0.5 shrink-0 text-cinema-teal" size={15} />
                      <span>{line}</span>
                    </div>
                  ))}
                </div>
                <Link to={role.href} className="mt-5 inline-flex items-center gap-2 rounded bg-white px-4 py-2 text-sm font-black text-cinema-ink">
                  {role.action} <ArrowRight size={16} />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="glass grid gap-6 rounded-lg p-6 md:grid-cols-3">
          <div className="flex gap-4">
            <Clapperboard className="shrink-0 text-cinema-red" />
            <div>
              <h3 className="font-black">Multimedia blog studio</h3>
              <p className="mt-2 text-sm text-slate-300">Users can create posts with featured images, trailers, ratings, categories, tags, drafts, and publishing controls.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <MessageCircle className="shrink-0 text-cinema-gold" />
            <div>
              <h3 className="font-black">Community discussion</h3>
              <p className="mt-2 text-sm text-slate-300">Logged-in users can follow posters and comment on posts; guests stay read-only with search access.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <UserCog className="shrink-0 text-cinema-teal" />
            <div>
              <h3 className="font-black">Admin control room</h3>
              <p className="mt-2 text-sm text-slate-300">Administrators manage users, passwords, posting blocks, post moderation reasons, and categories.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
