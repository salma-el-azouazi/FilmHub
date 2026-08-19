import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import { api, FilmPost } from "../lib/api";
import { listPublishedDemoPosts } from "../lib/localDemoStore";
import { filterSamplePostsByGenre, samplePosts } from "../lib/mockData";

export default function SearchResults() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const [posts, setPosts] = useState<FilmPost[]>(() => filterSamplePostsByGenre(q));
  function fallback() {
    return [...listPublishedDemoPosts(q), ...filterSamplePostsByGenre(q)];
  }
  useEffect(() => {
    setPosts(fallback());
    api<{ posts: FilmPost[] }>(`/posts?search=${encodeURIComponent(q)}`)
      .then((data) => {
        const apiPosts = Array.isArray(data.posts) ? data.posts : [];
        setPosts(apiPosts.length ? apiPosts : fallback());
      })
      .catch(() => setPosts(fallback()));
  }, [q]);
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-7">
        <p className="text-sm uppercase tracking-[0.24em] text-cinema-teal">FilmHub search</p>
        <h1 className="mt-2 text-4xl font-black">Search Results</h1>
        <p className="mt-3 text-slate-400">
          Showing {posts.length} of {samplePosts.length} posts for "{q || "all cinema"}".
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{posts.map((post) => <PostCard key={post.id} post={post} />)}</div>
      {!posts.length && (
        <div className="glass mt-8 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-black">No matching movies found</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-300">Try searching for Inception, horror, romance, anime, Korea, superhero, thriller, or a cast name.</p>
          <Link to="/blogs" className="mt-5 inline-flex rounded bg-cinema-red px-5 py-3 font-bold">Browse all blogs</Link>
        </div>
      )}
    </section>
  );
}
