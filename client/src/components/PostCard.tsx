import { motion } from "framer-motion";
import { Bookmark, Clapperboard, Eye, Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { asset, FilmPost, stripHtml } from "../lib/api";

export default function PostCard({ post }: { post: FilmPost }) {
  return (
    <motion.article whileHover={{ y: -10, rotateX: 4, rotateY: -4 }} className="glass group overflow-hidden rounded-lg shadow-glow">
      <Link to={`/blogs/${post.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden">
          <img src={asset(post.featured_image) || "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1000&q=80"} alt={post.title} className="moving-poster-img h-full w-full object-cover transition duration-500 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-cinema-ink via-transparent to-transparent" />
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded bg-cinema-red px-2 py-1 text-xs font-bold uppercase tracking-wide"><Clapperboard size={13} />{post.category_name || "Cinema"}</span>
          <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded bg-black/60 px-2 py-1 text-xs"><Star size={14} className="fill-cinema-gold text-cinema-gold" />{Number(post.rating || 0).toFixed(1)}</span>
        </div>
        <div className="p-5">
          <div className="mb-2 text-xs uppercase tracking-[0.24em] text-cinema-teal">{post.author_name || "FilmHub"}</div>
          <h3 className="line-clamp-2 text-xl font-black leading-tight">{post.title}</h3>
          <p className="line-clamp-3 mt-3 text-sm leading-6 text-slate-300">{post.excerpt || stripHtml(post.content)}</p>
          <div className="mt-5 flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1"><Eye size={15} />{post.views}</span>
            <span className="flex items-center gap-1"><Heart size={15} />{post.likes}</span>
            <span className="ml-auto flex items-center gap-1"><Bookmark size={15} />Save</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
