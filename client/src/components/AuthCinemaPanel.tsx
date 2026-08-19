import { Clapperboard, Film, ShieldCheck, Sparkles, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { sampleFilms } from "../lib/mockData";

export default function AuthCinemaPanel({ mode }: { mode: "login" | "register" }) {
  return (
    <aside className="auth-cinema-panel">
      <div className="auth-projector" />
      <div className="auth-orbit" aria-hidden="true">
        {sampleFilms.slice(0, 5).map((film, index) => (
          <div key={film.title} className="auth-floating-poster" style={{ "--i": index } as React.CSSProperties}>
            <img className="moving-poster-img" src={film.poster} alt="" />
            <span>{film.genre}</span>
          </div>
        ))}
      </div>
      <div className="auth-visual-copy">
        <div className="inline-flex items-center gap-2 rounded border border-white/15 bg-white/8 px-3 py-2 text-sm text-cinema-teal">
          <Sparkles size={16} /> FilmHub access studio
        </div>
        <h2>{mode === "login" ? "Enter the cinema control room." : "Create your film writer pass."}</h2>
        <p>
          Browse as guest, write as a normal user, or enter the admin panel for full platform control.
        </p>
        <div className="auth-feature-grid">
          <Link to="/blogs"><Film size={17} /> Guest browsing</Link>
          <Link to="/register"><UserPlus size={17} /> User account</Link>
          <Link to="/admin-login"><ShieldCheck size={17} /> Admin access</Link>
          <Link to="/create-post"><Clapperboard size={17} /> Multimedia posts</Link>
        </div>
      </div>
    </aside>
  );
}
