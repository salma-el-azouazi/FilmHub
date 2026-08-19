import { Film, UserPlus, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api, asset } from "../lib/api";
import { listDemoUsers } from "../lib/localDemoStore";
import { samplePosts } from "../lib/mockData";

type Author = {
  id: number;
  name: string;
  avatar?: string;
  bio?: string;
  posts: number;
  followers: number;
};

const fallbackAvatar = "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=300&q=80";

function fallbackAuthors() {
  const authors = new Map<number, Author>();

  for (const post of samplePosts) {
    const current = authors.get(post.user_id);
    authors.set(post.user_id, {
      id: post.user_id,
      name: post.author_name || "FilmHub Author",
      avatar: post.author_avatar || current?.avatar || "",
      bio: current?.bio || "FilmHub writer sharing cinematic reviews, rankings, and discussion prompts.",
      posts: (current?.posts || 0) + 1,
      followers: current?.followers || (post.user_id === 2 ? 52 : 37)
    });
  }

  for (const user of listDemoUsers()) {
    authors.set(user.id, {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      bio: user.bio || "FilmHub community member.",
      posts: user.posts || 0,
      followers: user.followers || 0
    });
  }

  return Array.from(authors.values()).sort((a, b) => b.followers - a.followers || b.posts - a.posts);
}

export default function Authors() {
  const { user } = useAuth();
  const [authors, setAuthors] = useState<Author[]>(() => fallbackAuthors());
  const [status, setStatus] = useState("");

  useEffect(() => {
    api<Author[]>("/users")
      .then((data) => setAuthors(data.length ? data : fallbackAuthors()))
      .catch(() => setAuthors(fallbackAuthors()));
  }, []);

  async function follow(author: Author) {
    setStatus("");
    if (!user) {
      setStatus("Login to follow authors.");
      return;
    }
    if (user.id === author.id) {
      setStatus("This is your author profile.");
      return;
    }

    try {
      await api(`/users/${author.id}/follow`, { method: "POST" });
      setStatus(`Following ${author.name}.`);
    } catch {
      setStatus(`Following ${author.name} in demo mode.`);
    }
    setAuthors((current) => current.map((item) => (
      item.id === author.id ? { ...item, followers: Number(item.followers || 0) + 1 } : item
    )));
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="movie-detail-hero relative mb-8 overflow-hidden rounded-lg border border-white/10 p-6">
        <div className="absolute inset-0 opacity-25">
          <img src="https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?auto=format&fit=crop&w=1600&q=80" alt="" className="moving-poster-img h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-cinema-ink via-cinema-ink/88 to-cinema-ink/40" />
        <div className="relative max-w-3xl">
          <p className="text-sm uppercase tracking-[0.24em] text-cinema-teal">FilmHub authors</p>
          <h1 className="mt-3 text-4xl font-black md:text-5xl">Find writers to follow</h1>
          <p className="mt-3 text-slate-300">Follow movie bloggers, open their profiles, and keep their latest posts close to your FilmHub dashboard.</p>
        </div>
      </div>

      {status && <p className="mb-5 rounded border border-cinema-teal/30 bg-cinema-teal/10 px-4 py-3 text-sm font-bold text-cinema-teal">{status}</p>}

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {authors.map((author) => (
          <article key={author.id} className="glass rounded-lg p-5">
            <div className="flex items-center gap-4">
              <img src={asset(author.avatar) || fallbackAvatar} alt={author.name} className="h-16 w-16 rounded object-cover" />
              <div className="min-w-0">
                <h2 className="truncate text-2xl font-black">{author.name}</h2>
                <p className="mt-1 text-sm text-slate-400">{author.bio || "FilmHub author"}</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded border border-white/10 bg-white/5 p-3">
                <Film className="mb-2 text-cinema-gold" size={18} />
                <b>{Number(author.posts || 0)}</b>
                <span className="ml-1 text-slate-400">posts</span>
              </div>
              <div className="rounded border border-white/10 bg-white/5 p-3">
                <UsersRound className="mb-2 text-cinema-teal" size={18} />
                <b>{Number(author.followers || 0)}</b>
                <span className="ml-1 text-slate-400">followers</span>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to={`/users/${author.id}`} className="inline-flex items-center justify-center rounded border border-white/15 px-4 py-2 text-sm font-bold hover:bg-white/10">
                View profile
              </Link>
              <button onClick={() => follow(author)} disabled={user?.id === author.id} className="inline-flex items-center justify-center gap-2 rounded bg-cinema-red px-4 py-2 text-sm font-bold shadow-glow disabled:cursor-not-allowed disabled:opacity-50">
                <UserPlus size={17} />Follow
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
