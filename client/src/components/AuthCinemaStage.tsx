import type { ReactNode } from "react";
import { Clapperboard, Film, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { sampleFilms } from "../lib/mockData";

type AuthCinemaStageProps = {
  mode: "login" | "register" | "admin";
  title: string;
  subtitle: string;
  children: ReactNode;
};

export default function AuthCinemaStage({ mode, title, subtitle, children }: AuthCinemaStageProps) {
  const films = sampleFilms.slice(0, 5);

  return (
    <section className="auth-cinema-page">
      <div className="auth-cinema-stage">
        <div className="auth-light auth-light-left" />
        <div className="auth-light auth-light-right" />

        <div className="auth-poster-world" aria-hidden="true">
          {films.map((film, index) => (
            <div key={film.title} className={`auth-poster-card auth-poster-${index + 1}`}>
              <img className="moving-poster-img" src={film.poster} alt="" />
              <div>
                <span>{film.genre}</span>
                <b>{film.title}</b>
              </div>
            </div>
          ))}
        </div>

        <div className="auth-copy">
          <div className="inline-flex items-center gap-2 rounded border border-white/15 bg-white/8 px-3 py-2 text-sm text-cinema-teal">
            <Sparkles size={16} /> FilmHub secure cinema access
          </div>
          <h1>{mode === "admin" ? "Open the control room." : mode === "login" ? "Enter the screening room." : "Claim your critic pass."}</h1>
          <p>
            Guests can watch and search. Members publish posts, comment and follow.
            Administrators control the full platform.
          </p>
          <div className="auth-feature-strip">
            <span><Film size={16} /> Blogs</span>
            <span><Clapperboard size={16} /> Posts</span>
            <span><ShieldCheck size={16} /> Admin</span>
          </div>
        </div>

        <div className="auth-form-wrap">
          <div className="auth-tabs">
            <Link className={mode === "login" ? "active" : ""} to="/login">Login</Link>
            <Link className={mode === "register" ? "active" : ""} to="/register">Register</Link>
            <Link className={mode === "admin" ? "active" : ""} to="/admin-login">Admin</Link>
          </div>
          <div className="auth-ticket-form">
            <div className="auth-ticket-header">
              <div>
                <span>{mode === "admin" ? "Full access" : mode === "login" ? "Returning member" : "New member"}</span>
                <h2>{title}</h2>
              </div>
              <Film />
            </div>
            <p className="auth-subtitle">{subtitle}</p>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
