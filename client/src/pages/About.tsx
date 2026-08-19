import { motion } from "framer-motion";
import { ArrowRight, BarChart3, CalendarDays, Clapperboard, Database, Film, Goal, LockKeyhole, MessageSquare, Search, ShieldCheck, Sparkles, Tags, Telescope, UploadCloud, UserRoundCog, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import { entertainmentDataset, samplePosts } from "../lib/mockData";

export default function About() {
  const stats = [
    { label: "Blog profiles", value: samplePosts.length },
    { label: "Movies", value: entertainmentDataset.movies.length },
    { label: "Anime", value: entertainmentDataset.anime.length },
    { label: "Series extras", value: entertainmentDataset.tv_series.length + entertainmentDataset.kdramas.length }
  ];

  const roles = [
    { title: "Guests", icon: Search, text: "Browse public blogs, search titles, read movie details, and explore categories without an account." },
    { title: "Normal users", icon: UsersRound, text: "Create multimedia posts, edit their own work, delete drafts, follow posters, bookmark films, and comment." },
    { title: "Administrators", icon: ShieldCheck, text: "Control users, posting permissions, password resets, blocked posts with reasons, comments, analytics, and categories." }
  ];

  const details = [
    { title: "Movie details", icon: Clapperboard, text: "Each profile can show a story summary, release year, genre, director or studio, filming location, trailer link, rank, and review." },
    { title: "Cast cards", icon: UserRoundCog, text: "Principal actors and anime characters appear as animated cards with names, roles, photos, and short definitions." },
    { title: "Community layer", icon: MessageSquare, text: "Comments, likes, bookmarks, follows, and admin moderation make the site feel like a living film discussion space." }
  ];

  const missionVision = [
    { title: "Mission", icon: Goal, text: "Help students and film fans publish thoughtful multimedia writing around movies, anime, TV, and K-drama in one searchable place." },
    { title: "Vision", icon: Telescope, text: "Become a polished cinema community where discovery, criticism, creator tools, and moderation feel fast, visual, and trustworthy." }
  ];

  const timeline = [
    { year: "Phase 1", title: "Public library", text: "Guests browse posts, categories, trailers, cast cards, and movie details." },
    { year: "Phase 2", title: "Creator tools", text: "Members publish drafts, upload media, tag posts, follow authors, and join discussions." },
    { year: "Phase 3", title: "Admin control", text: "Moderators manage users, categories, blocked posts, comments, notifications, and analytics." }
  ];

  const pillars = [
    { title: "Rich publishing", icon: UploadCloud, text: "Posts support images, videos, YouTube embeds, drafts, publishing, tags, categories, and searchable content." },
    { title: "Discovery engine", icon: Search, text: "Visitors can move through titles by genre, author, category, tag, cast member, or search phrase." },
    { title: "Community signals", icon: BarChart3, text: "Views, likes, dislikes, comments, replies, follows, bookmarks, and notifications make activity visible." },
    { title: "Moderation memory", icon: Database, text: "Blocked posts keep reasons, moderators, timestamps, and logs so admin decisions stay traceable." }
  ];

  const workflow = [
    { step: "01", title: "Find a title", text: "Start from search, genre cards, categories, or a featured post." },
    { step: "02", title: "Read the profile", text: "Open the trailer, review, locations, cast, character cards, and comments." },
    { step: "03", title: "Join the discussion", text: "Members can comment, reply, like, bookmark, and follow the author." },
    { step: "04", title: "Publish your own", text: "Creators draft, upload media, choose tags, and publish when ready." }
  ];

  const safeguards = [
    { title: "Secure accounts", icon: LockKeyhole, text: "Passwords are bcrypt hashed, password-reset links expire, and persistent login uses server-side tokens." },
    { title: "Clean content", icon: ShieldCheck, text: "Admins can block posts, remove comments, disable accounts, and restore posting privileges." },
    { title: "Organized taxonomy", icon: Tags, text: "Categories can be described, merged, icon-labeled, and used to keep the library easy to browse." }
  ];

  return (
    <section>
      <div className="movie-detail-hero relative min-h-[54vh] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1800&q=80" alt="" className="moving-poster-img absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-cinema-ink via-cinema-ink/80 to-cinema-ink/30" />
        <div className="relative mx-auto flex min-h-[54vh] max-w-7xl flex-col justify-end px-4 pb-12">
          <p className="text-sm uppercase tracking-[0.24em] text-cinema-teal">About FilmHub</p>
          <h1 className="mt-3 max-w-4xl text-5xl font-black leading-tight md:text-6xl">A cinematic blog platform for movies, anime, TV, and K-drama.</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            FilmHub combines an entertainment database with multimedia blogging, searchable categories, animated 3D cards, public browsing, member posting, and full administrator control.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/blogs" className="inline-flex items-center gap-2 rounded bg-cinema-red px-5 py-3 font-bold shadow-glow">Explore library <ArrowRight size={18} /></Link>
            <Link to="/categories" className="inline-flex items-center gap-2 rounded border border-white/15 px-5 py-3 font-bold hover:bg-white/10">Browse categories <Film size={18} /></Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="-mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} className="glass rounded-lg p-5 shadow-teal">
              <p className="text-4xl font-black text-cinema-gold">{stat.value}</p>
              <p className="mt-2 text-sm uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <section className="py-12">
          <div className="grid gap-5 md:grid-cols-2">
            {missionVision.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.article key={item.title} whileHover={{ y: -8, rotateX: 3 }} className="glass rounded-lg p-6">
                  <Icon className={index ? "mb-5 text-cinema-teal" : "mb-5 text-cinema-gold"} size={36} />
                  <h2 className="text-3xl font-black">{item.title}</h2>
                  <p className="mt-4 leading-8 text-slate-300">{item.text}</p>
                </motion.article>
              );
            })}
          </div>
        </section>

        <section className="py-12">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.24em] text-cinema-teal">Access model</p>
            <h2 className="text-3xl font-black">Three spaces, different permissions</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {roles.map((role, index) => {
              const Icon = role.icon;
              return (
                <motion.article key={role.title} whileHover={{ y: -10, rotateY: index % 2 ? -5 : 5 }} className="glass rounded-lg p-6">
                  <Icon className="mb-5 text-cinema-red" size={34} />
                  <h3 className="text-2xl font-black">{role.title}</h3>
                  <p className="mt-4 leading-7 text-slate-300">{role.text}</p>
                </motion.article>
              );
            })}
          </div>
        </section>

        <section className="py-10">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.24em] text-cinema-teal">Timeline</p>
            <h2 className="text-3xl font-black">How the platform grows</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {timeline.map((item, index) => (
              <motion.article key={item.title} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} viewport={{ once: true }} className="glass rounded-lg p-5">
                <CalendarDays className="mb-4 text-cinema-red" />
                <span className="text-sm font-black uppercase tracking-[0.2em] text-cinema-gold">{item.year}</span>
                <h3 className="mt-3 text-2xl font-black">{item.title}</h3>
                <p className="mt-3 leading-7 text-slate-300">{item.text}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="py-12">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.24em] text-cinema-teal">Core platform</p>
            <h2 className="text-3xl font-black">Designed for discovery, posting, and moderation</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {pillars.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.article key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} viewport={{ once: true }} className="glass rounded-lg p-5">
                  <Icon className="mb-4 text-cinema-gold" />
                  <h3 className="text-xl font-black">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{item.text}</p>
                </motion.article>
              );
            })}
          </div>
        </section>

        <section className="theater-screen my-8 rounded-xl p-6">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-cinema-teal">User journey</p>
              <h2 className="mt-3 text-4xl font-black">From browsing to publishing in four steps.</h2>
              <p className="mt-4 leading-8 text-slate-300">
                FilmHub is built around a simple loop: discover a title, inspect the movie profile, react with the community, then publish your own multimedia take.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {workflow.map((item) => (
                <div key={item.step} className="rounded-lg border border-white/10 bg-white/6 p-4">
                  <span className="text-sm font-black text-cinema-gold">{item.step}</span>
                  <h3 className="mt-2 font-black">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-cinema-teal">Platform features</p>
            <h2 className="mt-3 text-4xl font-black">Blogs behave like movie profile pages.</h2>
            <p className="mt-5 leading-8 text-slate-300">
              The expanded content library gives the blog page real material to search: action films, horror, comedy, drama, sci-fi, thriller, romance, anime, animated movies, TV series, and K-dramas.
            </p>
          </div>
          <div className="grid gap-4">
            {details.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.title} initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} viewport={{ once: true }} className="glass rounded-lg p-5">
                  <div className="flex gap-4">
                    <Icon className="shrink-0 text-cinema-gold" />
                    <div>
                      <h3 className="font-black">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{item.text}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="py-10">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.24em] text-cinema-teal">Trust layer</p>
            <h2 className="text-3xl font-black">Professional controls behind the movie shine</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {safeguards.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.article key={item.title} whileHover={{ y: -8 }} className="glass rounded-lg p-6">
                  <Icon className={index === 1 ? "mb-5 text-cinema-red" : "mb-5 text-cinema-teal"} size={34} />
                  <h3 className="text-2xl font-black">{item.title}</h3>
                  <p className="mt-4 leading-7 text-slate-300">{item.text}</p>
                </motion.article>
              );
            })}
          </div>
        </section>

        <section className="theater-screen grid items-center gap-6 rounded-xl p-6 md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-cinema-teal">Current library</p>
            <h2 className="mt-2 text-3xl font-black">Ready for search, categories, and admin moderation.</h2>
            <p className="mt-3 max-w-3xl text-slate-300">
              The website now has a populated fallback library, title-specific cast data, anime character cards, and database-backed routes for the full community system.
            </p>
          </div>
          <Link to="/blogs" className="inline-flex items-center justify-center gap-2 rounded bg-white px-5 py-3 font-black text-cinema-ink">Open blogs <Sparkles size={18} /></Link>
        </section>
      </div>
    </section>
  );
}
