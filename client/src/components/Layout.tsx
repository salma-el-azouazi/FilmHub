import { Film, KeyRound, LayoutDashboard, LogOut, Menu, Moon, Search, Sun, UserPlus, UserRound, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CinemaBackdrop from "./CinemaBackdrop";

const nav = [
  ["Blogs", "/blogs"],
  ["Authors", "/authors"],
  ["Categories", "/categories"],
  ["About", "/about"],
  ["Contact", "/contact"]
];

export default function Layout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [light, setLight] = useState(() => localStorage.getItem("filmhub_theme") === "light");
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle("light", light);
    localStorage.setItem("filmhub_theme", light ? "light" : "dark");
  }, [light]);

  function search(event: FormEvent) {
    event.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <div className="min-h-screen overflow-hidden">
      <CinemaBackdrop />
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-cinema-ink/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
          <Link to="/" className="flex items-center gap-2 font-black tracking-wide">
            <span className="grid h-10 w-10 place-items-center rounded bg-cinema-red text-white shadow-glow">
              <Film size={22} />
            </span>
            <span>FilmHub</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map(([label, href]) => (
              <NavLink key={href} to={href} className={({ isActive }) => `rounded px-3 py-2 text-sm ${isActive ? "bg-white/12 text-white" : "text-slate-300 hover:bg-white/8"}`}>
                {label}
              </NavLink>
            ))}
          </nav>
          <form onSubmit={search} className="ml-auto hidden min-w-64 items-center gap-2 rounded border border-white/10 bg-white/6 px-3 py-2 md:flex">
            <Search size={16} className="text-slate-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full bg-transparent text-sm outline-none" placeholder="Search movies, anime, actors" />
          </form>
          <button title="Toggle theme" className="rounded p-2 hover:bg-white/10" onClick={() => setLight((v) => !v)}>
            {light ? <Moon size={19} /> : <Sun size={19} />}
          </button>
          {user ? (
            <>
              <Link title="Dashboard" to={user.role === "admin" ? "/admin" : "/dashboard"} className="rounded p-2 hover:bg-white/10">
                <LayoutDashboard size={19} />
              </Link>
              <button title="Log out" onClick={logout} className="rounded p-2 hover:bg-white/10">
                <LogOut size={19} />
              </button>
            </>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link to="/login" className="inline-flex items-center gap-2 rounded border border-white/15 px-3 py-2 text-sm font-bold text-white hover:bg-white/10">
                <KeyRound size={16} /> Login
              </Link>
              <Link to="/register" className="inline-flex items-center gap-2 rounded bg-white px-3 py-2 text-sm font-bold text-cinema-ink">
                <UserPlus size={16} /> Register
              </Link>
              <Link to="/admin-login" className="rounded bg-cinema-red px-3 py-2 text-sm font-bold shadow-glow">
                Admin
              </Link>
            </div>
          )}
          <button className="rounded p-2 md:hidden" onClick={() => setOpen((v) => !v)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <div className="border-t border-white/10 px-4 py-4 md:hidden">
            <form onSubmit={search} className="mb-3 flex items-center gap-2 rounded border border-white/10 bg-white/6 px-3 py-2">
              <Search size={16} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full bg-transparent outline-none" placeholder="Search movies, anime, actors" />
            </form>
            <div className="grid gap-2">
              {nav.map(([label, href]) => <Link key={href} to={href} onClick={() => setOpen(false)} className="rounded px-3 py-2 hover:bg-white/10">{label}</Link>)}
              <Link to={user ? "/dashboard" : "/login"} className="rounded px-3 py-2 hover:bg-white/10"><UserRound className="mr-2 inline" size={17} />{user ? "Dashboard" : "Login"}</Link>
              {!user && <Link to="/register" className="rounded px-3 py-2 hover:bg-white/10"><UserPlus className="mr-2 inline" size={17} />Register</Link>}
              <Link to="/admin-login" className="rounded px-3 py-2 hover:bg-white/10"><LayoutDashboard className="mr-2 inline" size={17} />Admin Panel</Link>
            </div>
          </div>
        )}
      </header>
      <main className="relative z-10 pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname + location.search}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <footer className="relative z-10 border-t border-white/10 px-4 py-8 text-center text-sm text-slate-400">
        FilmHub E-Business Project - React, Express, MySQL, Three.js, JWT, Multer, and Tailwind CSS.
      </footer>
    </div>
  );
}
