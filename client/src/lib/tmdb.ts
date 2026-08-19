import type { MovieDetail, PrincipalActor } from "./mockData";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMAGE = "https://image.tmdb.org/t/p/w500";

type TmdbMovie = {
  release_date?: string;
  genres?: { name: string }[];
  videos?: { results?: { key: string; site: string; type: string; official?: boolean; name: string }[] };
  credits?: {
    crew?: { job: string; name: string }[];
    cast?: { name: string; character: string; profile_path?: string }[];
  };
};

export async function fetchTmdbMovieDetail(detail: MovieDetail): Promise<Partial<MovieDetail>> {
  if (!API_KEY || !detail.tmdbId) return {};

  const response = await fetch(`${TMDB_BASE}/movie/${detail.tmdbId}?api_key=${API_KEY}&append_to_response=videos,credits`);
  if (!response.ok) return {};
  const movie = (await response.json()) as TmdbMovie;

  const trailer = movie.videos?.results?.find((video) => video.site === "YouTube" && video.type === "Trailer" && video.official)
    || movie.videos?.results?.find((video) => video.site === "YouTube" && video.type === "Trailer")
    || movie.videos?.results?.find((video) => video.site === "YouTube");

  const director = movie.credits?.crew?.find((person) => person.job === "Director")?.name;
  const cast: PrincipalActor[] | undefined = movie.credits?.cast?.slice(0, 3).map((person, index) => ({
    name: person.name,
    role: person.character || detail.cast[index]?.role || "Principal cast",
    photo: person.profile_path ? `${TMDB_IMAGE}${person.profile_path}` : detail.cast[index]?.photo || detail.cast[0]?.photo,
    bio: `Principal cast member in ${detail.movieTitle}, playing ${person.character || "a key role"}.`
  }));

  return {
    trailerUrl: trailer ? `https://www.youtube.com/embed/${trailer.key}` : undefined,
    releaseDate: movie.release_date || undefined,
    genre: movie.genres?.map((genre) => genre.name).join(", "),
    director,
    cast: cast?.length ? cast : undefined
  };
}
