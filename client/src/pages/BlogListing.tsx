import { Film, KeyRound, Library, Search, ShieldCheck, UserPlus } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import { api, FilmPost } from "../lib/api";
import { listPublishedDemoPosts } from "../lib/localDemoStore";
import { filterSamplePostsByGenre, genreCards, sampleCategories, samplePosts } from "../lib/mockData";

type Category = { id: number; name: string; slug: string };

export default function BlogListing() {
  const [params] = useSearchParams();
  const urlCategory = params.get("category") || "";
  const urlGenre = params.get("genre") || "";
  const [posts, setPosts] = useState<FilmPost[]>(() => filterSamplePostsByGenre("", urlCategory, urlGenre));
  const [categories, setCategories] = useState<Category[]>(sampleCategories);
  const [search, setSearch] = useState(params.get("q") || "");
  const [category, setCategory] = useState(urlCategory);
  const [genre, setGenre] = useState(urlGenre);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  function fallback(nextSearch = search, nextCategory = category, nextGenre = genre) {
    return [...listPublishedDemoPosts(nextSearch, nextCategory, nextGenre), ...filterSamplePostsByGenre(nextSearch, nextCategory, nextGenre)];
  }

  function load(nextPage = 1, append = false, nextSearch = search, nextCategory = category, nextGenre = genre) {
    const params = new URLSearchParams({ page: String(nextPage), limit: "9" });
    if (nextSearch) params.set("search", nextSearch);
    if (nextCategory) params.set("category", nextCategory);
    if (nextGenre) params.set("tag", nextGenre);
    api<{ posts: FilmPost[]; hasMore: boolean }>(`/posts?${params}`)
      .then((data) => {
        const apiPosts = Array.isArray(data.posts) ? data.posts : [];
        const nextPosts = apiPosts.length ? apiPosts : fallback(nextSearch, nextCategory, nextGenre);
        setPosts((current) => (append ? [...current, ...nextPosts] : nextPosts));
        setHasMore(Boolean(apiPosts.length && data.hasMore));
        setPage(nextPage);
      })
      .catch(() => {
        setPosts(fallback(nextSearch, nextCategory, nextGenre));
        setHasMore(false);
      });
  }

  useEffect(() => {
    api<Category[]>("/categories").then((data) => setCategories(data.length ? data : sampleCategories)).catch(() => setCategories(sampleCategories));
  }, []);

  useEffect(() => {
    const nextSearch = params.get("q") || "";
    const nextCategory = params.get("category") || "";
    const nextGenre = params.get("genre") || "";
    setSearch(nextSearch);
    setCategory(nextCategory);
    setGenre(nextGenre);
    setPosts(fallback(nextSearch, nextCategory, nextGenre));
    load(1, false, nextSearch, nextCategory, nextGenre);
  }, [urlCategory, urlGenre, params.get("q") || ""]);

  function submit(event: FormEvent) {
    event.preventDefault();
    load();
  }

  function chooseGenre(nextGenre: string) {
    setGenre(nextGenre);
    setPosts(fallback(search, category, nextGenre));
    load(1, false, search, category, nextGenre);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="movie-detail-hero relative mb-8 overflow-hidden rounded-lg border border-white/10 p-6">
        <div className="absolute inset-0 opacity-25">
          <img src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80" alt="" className="moving-poster-img h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-cinema-ink via-cinema-ink/85 to-cinema-ink/40" />
        <div className="relative">
          <p className="text-sm uppercase tracking-[0.24em] text-cinema-teal">Explore the archive</p>
          <h1 className="mt-3 text-4xl font-black md:text-5xl">Movie Blogs & Film Library</h1>
          <p className="mt-3 max-w-3xl text-slate-300">
            Search across {samplePosts.length} FilmHub posts covering movies, anime, animated movies, TV series, and K-dramas. Guests can browse and search; members can post, follow, comment, and bookmark.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/login" className="inline-flex items-center gap-2 rounded border border-white/15 px-4 py-2 text-sm font-bold hover:bg-white/10"><KeyRound size={17} />Login</Link>
            <Link to="/register" className="inline-flex items-center gap-2 rounded bg-white px-4 py-2 text-sm font-bold text-cinema-ink"><UserPlus size={17} />Register</Link>
            <Link to="/admin-login" className="inline-flex items-center gap-2 rounded bg-cinema-red px-4 py-2 text-sm font-bold shadow-glow"><ShieldCheck size={17} />Admin</Link>
          </div>
        </div>
      </div>

      <form onSubmit={submit} className="glass mb-7 grid gap-3 rounded-lg p-4 md:grid-cols-[1fr_220px_auto]">
        <label className="flex items-center gap-2 rounded border border-white/10 bg-white/5 px-3">
          <Search size={18} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="h-12 w-full bg-transparent outline-none" placeholder="Search movies, anime, actors, genre, content" />
        </label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="h-12 rounded border border-white/10 bg-cinema-panel px-3">
          <option value="">All categories</option>
          {categories.map((cat) => <option key={cat.id} value={cat.slug}>{cat.name}</option>)}
        </select>
        <button className="rounded bg-cinema-red px-6 font-bold">Filter</button>
      </form>

      <div className="mb-7 glass rounded-lg p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-black"><Library className="text-cinema-gold" /> Showing {posts.length} posts</div>
          {(genre || category || search) && <Link to="/blogs" className="text-sm font-bold text-cinema-teal">Clear filters</Link>}
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => chooseGenre("")} className={`rounded px-3 py-2 text-sm font-bold ${!genre ? "bg-white text-cinema-ink" : "bg-white/10 hover:bg-white/15"}`}>All</button>
          {genreCards.filter((item) => item.slug !== "documentary").map((item) => (
            <button key={item.slug} onClick={() => chooseGenre(item.slug)} className={`inline-flex items-center gap-2 rounded px-3 py-2 text-sm font-bold ${genre === item.slug ? "bg-cinema-red text-white" : "bg-white/10 hover:bg-white/15"}`}>
              <Film size={15} />{item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => <PostCard key={post.id} post={post} />)}
      </div>
      {!posts.length && (
        <div className="glass mt-8 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-black">No matching movies yet</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-300">Try a title like Inception, a genre like horror, anime, romance, sci-fi, K-drama, or clear the filters to return to the full library.</p>
          <Link to="/blogs" className="mt-5 inline-flex rounded bg-cinema-red px-5 py-3 font-bold">Show all movies</Link>
        </div>
      )}
      {hasMore && (
        <div className="mt-8 text-center">
          <button onClick={() => load(page + 1, true)} className="rounded border border-white/15 px-5 py-3 font-bold hover:bg-white/10">Load more</button>
        </div>
      )}
    </section>
  );
}
