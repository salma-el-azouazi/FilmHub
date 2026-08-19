import { Heart, Newspaper, UserMinus, UserPlus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import StatCard from "../components/StatCard";
import { useAuth } from "../context/AuthContext";
import { api, asset, FilmPost, User } from "../lib/api";
import { listDemoUsers, listPublishedDemoPosts } from "../lib/localDemoStore";
import { samplePosts } from "../lib/mockData";

type Profile = { user: User; stats: { posts: number; followers: number; following: number; likesReceived: number }; recent: FilmPost[] };

function fallbackProfile(id?: string): Profile | null {
  const authorId = Number(id);
  if (!authorId) return null;

  const demoUser = listDemoUsers().find((item) => Number(item.id) === authorId);
  const posts = [...listPublishedDemoPosts(), ...samplePosts]
    .filter((post, index, all) => (
      Number(post.user_id) === authorId && all.findIndex((item) => item.id === post.id) === index
    ));
  const firstPost = posts[0];

  if (!demoUser && !firstPost) return null;

  const profileUser: User = demoUser ? {
    id: demoUser.id,
    name: demoUser.name,
    email: demoUser.email,
    role: demoUser.role,
    avatar: demoUser.avatar,
    bio: demoUser.bio,
    status: demoUser.status
  } : {
    id: authorId,
    name: firstPost.author_name || "FilmHub Author",
    email: `author${authorId}@filmhub.test`,
    role: "user",
    avatar: firstPost.author_avatar || "",
    bio: "FilmHub author sharing cinematic reviews, rankings, and discussion prompts.",
    status: "active"
  };

  return {
    user: profileUser,
    stats: {
      posts: posts.length,
      followers: demoUser?.followers || (authorId === 2 ? 52 : authorId === 3 ? 37 : 0),
      following: 0,
      likesReceived: posts.reduce((total, post) => total + Number(post.likes || 0), 0)
    },
    recent: posts.slice(0, 6)
  };
}

export default function UserProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(() => fallbackProfile(id));
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState("");
  useEffect(() => {
    setLoaded(false);
    setProfile(fallbackProfile(id));
    api<Profile>(`/users/${id}`)
      .then(setProfile)
      .catch(() => setProfile(fallbackProfile(id)))
      .finally(() => setLoaded(true));
  }, [id]);
  async function follow() {
    setStatus("");
    try {
      await api(`/users/${id}/follow`, { method: "POST" });
      setStatus("Following this author.");
    } catch {
      setStatus("Following this author in demo mode.");
    }
    setProfile((current) => current ? {
      ...current,
      stats: { ...current.stats, followers: Number(current.stats.followers || 0) + 1 }
    } : current);
  }
  async function unfollow() {
    setStatus("");
    try {
      await api(`/users/${id}/follow`, { method: "DELETE" });
      setStatus("Unfollowed this author.");
    } catch {
      setStatus("Unfollowed this author in demo mode.");
    }
    setProfile((current) => current ? {
      ...current,
      stats: { ...current.stats, followers: Math.max(0, Number(current.stats.followers || 0) - 1) }
    } : current);
  }
  if (!profile && !loaded) return <section className="px-4 py-10">Loading profile...</section>;
  if (!profile) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-16">
        <div className="glass rounded-lg p-8">
          <h1 className="text-3xl font-black">Author profile not found</h1>
          <p className="mt-3 text-slate-300">This author is not available in the FilmHub demo data.</p>
        </div>
      </section>
    );
  }
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="glass mb-7 flex flex-wrap items-center gap-5 rounded-lg p-6">
        <img src={asset(profile.user.avatar) || "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=300&q=80"} alt={profile.user.name} className="h-24 w-24 rounded object-cover" />
        <div className="mr-auto">
          <h1 className="text-4xl font-black">{profile.user.name}</h1>
          <p className="mt-2 text-slate-300">{profile.user.bio || "FilmHub author"}</p>
        </div>
        {user && user.id !== profile.user.id && (
          <div className="flex flex-wrap gap-3">
            <button onClick={follow} className="inline-flex items-center gap-2 rounded bg-cinema-red px-4 py-3 font-bold"><UserPlus size={18} />Follow</button>
            <button onClick={unfollow} className="inline-flex items-center gap-2 rounded border border-white/15 px-4 py-3 font-bold hover:bg-white/10"><UserMinus size={18} />Unfollow</button>
          </div>
        )}
      </div>
      {status && <p className="mb-6 rounded border border-cinema-teal/30 bg-cinema-teal/10 px-4 py-3 text-sm font-bold text-cinema-teal">{status}</p>}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <StatCard icon={Newspaper} label="Posts" value={profile.stats.posts} />
        <StatCard icon={Users} label="Followers" value={profile.stats.followers} />
        <StatCard icon={Users} label="Following" value={profile.stats.following} />
        <StatCard icon={Heart} label="Likes received" value={profile.stats.likesReceived} />
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{profile.recent.map((post) => <PostCard key={post.id} post={post} />)}</div>
    </section>
  );
}
