import { motion } from "framer-motion";
import { Clapperboard, Film, Sparkles, Tags, Tv } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { entertainmentDataset, filterSamplePostsByGenre, genreCards, sampleCategories } from "../lib/mockData";

type Category = { id: number; name: string; slug: string; description: string; post_count: number; views: number };

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>(sampleCategories);
  useEffect(() => { api<Category[]>("/categories").then((data) => setCategories(data.length ? data : sampleCategories)).catch(() => setCategories(sampleCategories)); }, []);

  const libraryStats = [
    { label: "Movies", value: entertainmentDataset.movies.length, icon: Clapperboard },
    { label: "Anime", value: entertainmentDataset.anime.length, icon: Sparkles },
    { label: "Animated", value: entertainmentDataset.animated_movies.length, icon: Film },
    { label: "TV + K-drama", value: entertainmentDataset.tv_series.length + entertainmentDataset.kdramas.length, icon: Tv }
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="movie-detail-hero relative mb-8 overflow-hidden rounded-lg border border-white/10 p-6">
        <div className="absolute inset-0 opacity-30">
          <img src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=80" alt="" className="moving-poster-img h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-cinema-ink via-cinema-ink/85 to-cinema-ink/30" />
        <div className="relative">
          <p className="text-sm uppercase tracking-[0.24em] text-cinema-teal">Browse FilmHub</p>
          <h1 className="mt-3 text-4xl font-black md:text-5xl">Categories & Genres</h1>
          <p className="mt-3 max-w-3xl text-slate-300">
            Jump into the library by genre, editorial category, or entertainment type. Every card leads to movies you can search, open, review, and discuss.
          </p>
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {libraryStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} viewport={{ once: true }} className="glass rounded-lg p-5 shadow-teal">
              <Icon className="mb-4 text-cinema-gold" />
              <p className="text-3xl font-black">{stat.value}</p>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-cinema-teal">Genre cards</p>
          <h2 className="text-3xl font-black">Search by cinema mood</h2>
        </div>
        <Link to="/blogs" className="text-sm font-bold text-cinema-gold">All blogs</Link>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {genreCards.map((genre, index) => (
          <motion.article key={genre.slug} whileHover={{ y: -10, rotateY: index % 2 ? -6 : 6, scale: 1.02 }} className="genre-card-3d">
            <Link to={`/blogs?genre=${genre.slug}`}>
              <img className="moving-poster-img" src={genre.image} alt={genre.label} />
              <div>
                <span>{filterSamplePostsByGenre("", "", genre.slug).length} posts</span>
                <b>{genre.label}</b>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>

      <div className="mb-6 mt-12">
        <p className="text-sm uppercase tracking-[0.24em] text-cinema-teal">Editorial categories</p>
        <h2 className="text-3xl font-black">Manageable admin categories</h2>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
        {categories.map((cat) => (
          <Link to={`/blogs?category=${cat.slug}`} key={cat.id} className="glass rounded-lg p-5 transition hover:-translate-y-1 hover:shadow-teal">
            <Tags className="mb-5 text-cinema-teal" />
            <h3 className="text-xl font-black">{cat.name}</h3>
            <p className="mt-3 min-h-20 text-sm leading-6 text-slate-300">{cat.description}</p>
            <div className="mt-5 flex justify-between text-sm text-slate-400"><span>{cat.post_count} posts</span><span>{cat.views} views</span></div>
          </Link>
        ))}
      </div>
    </section>
  );
}
