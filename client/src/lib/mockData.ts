import type { FilmPost } from "./api";
import entertainmentContent from "../data/entertainment-content.json";
import titleEnrichment from "../data/title-enrichment.json";

type EntertainmentMovie = {
  title: string;
  genre: string;
  summary: string;
  year: number;
  main_cast: string[];
  director: string;
  filming_location: string;
  trailer_link: string;
};

type EntertainmentAnime = {
  title: string;
  genre: string;
  summary: string;
  year_started: number;
  studio: string;
  main_characters: string[];
  trailer_link: string;
};

type EntertainmentSimple = {
  title: string;
  genre: string;
  summary: string;
  year: number;
  main_cast: string[];
  trailer_link: string;
};

export type EntertainmentDataset = {
  movies: EntertainmentMovie[];
  anime: EntertainmentAnime[];
  animated_movies: EntertainmentSimple[];
  tv_series: EntertainmentSimple[];
  kdramas: EntertainmentSimple[];
};

export const entertainmentDataset = entertainmentContent as EntertainmentDataset;

type TitleEnrichment = {
  titles: Record<string, {
    videoId?: string;
    trailerEmbed?: string;
    youtubeUrl?: string;
    poster?: string;
    category?: string;
    characters?: string[];
  }>;
  people: Record<string, string>;
  animatedCharacters: Record<string, string[]>;
};

const enriched = titleEnrichment as TitleEnrichment;

export const sampleCategories = [
  { id: 1, name: "Reviews", slug: "reviews", description: "Critical reactions, scene analysis, and rating-focused essays.", post_count: 32, views: 42500 },
  { id: 2, name: "News", slug: "news", description: "Festival updates, casting reports, production notes, and release coverage.", post_count: 16, views: 18900 },
  { id: 3, name: "Rankings", slug: "rankings", description: "Top lists, watch guides, marathons, and themed cinema countdowns.", post_count: 27, views: 38100 },
  { id: 4, name: "Recommendations", slug: "recommendations", description: "Curated picks for mood, genre, director, and movie-night style.", post_count: 34, views: 44700 },
  { id: 5, name: "Film Craft", slug: "film-craft", description: "Cinematography, editing, sound, production design, and visual effects.", post_count: 17, views: 26300 }
];

export const sampleFilms = [
  {
    title: "Neon Harbor",
    genre: "Neo-noir",
    rating: "9.2",
    poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "The Last Frame",
    genre: "Drama",
    rating: "8.8",
    poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Orbit Premiere",
    genre: "Sci-fi",
    rating: "9.0",
    poster: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Midnight Cut",
    genre: "Thriller",
    rating: "8.6",
    poster: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Red Carpet Static",
    genre: "Festival",
    rating: "8.7",
    poster: "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Velvet Exit",
    genre: "Mystery",
    rating: "8.9",
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Rain Sequence",
    genre: "Romance",
    rating: "8.5",
    poster: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Soundstage 9",
    genre: "Documentary",
    rating: "9.1",
    poster: "https://images.unsplash.com/photo-1572188863110-46d457c9234d?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Moonlit Bento",
    genre: "Anime",
    rating: "9.4",
    poster: "https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Archive of Shadows",
    genre: "Documentary",
    rating: "8.9",
    poster: "https://images.unsplash.com/photo-1497015289639-54688650d173?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Glass Planet",
    genre: "Sci-fi",
    rating: "8.7",
    poster: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Painted City",
    genre: "Animation",
    rating: "9.0",
    poster: "https://images.unsplash.com/photo-1616097970275-1e187b4ce59f?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "House of Frames",
    genre: "Horror",
    rating: "8.5",
    poster: "https://images.unsplash.com/photo-1505635552518-3448ff116af3?auto=format&fit=crop&w=800&q=80"
  }
];

export type PrincipalActor = {
  name: string;
  role: string;
  photo: string;
  bio: string;
};

export type MovieDetail = {
  movieTitle: string;
  type: string;
  rank: string;
  trailerUrl: string;
  tmdbId?: number;
  releaseDate?: string;
  genre?: string;
  director?: string;
  filmingLocations?: string[];
  review: string;
  script: string;
  cast: PrincipalActor[];
  comments: string[];
};

export const genreCards = [
  { label: "Horror", slug: "horror", image: "https://images.unsplash.com/photo-1505635552518-3448ff116af3?auto=format&fit=crop&w=900&q=80" },
  { label: "Action", slug: "action", image: "https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?auto=format&fit=crop&w=900&q=80" },
  { label: "Drama", slug: "drama", image: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=900&q=80" },
  { label: "Comedy", slug: "comedy", image: "https://images.unsplash.com/photo-1527224538127-2104bb71c51b?auto=format&fit=crop&w=900&q=80" },
  { label: "Thriller", slug: "thriller", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80" },
  { label: "Romance", slug: "romance", image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=900&q=80" },
  { label: "Anime", slug: "anime", image: "https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&w=900&q=80" },
  { label: "Animated", slug: "animated", image: "https://images.unsplash.com/photo-1616097970275-1e187b4ce59f?auto=format&fit=crop&w=900&q=80" },
  { label: "Sci-Fi", slug: "sci-fi", image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=900&q=80" },
  { label: "TV Series", slug: "tv", image: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=900&q=80" },
  { label: "K-Drama", slug: "kdrama", image: "https://images.unsplash.com/photo-1534270804882-6b5048b1c1fc?auto=format&fit=crop&w=900&q=80" },
  { label: "Documentary", slug: "documentary", image: "https://images.unsplash.com/photo-1497015289639-54688650d173?auto=format&fit=crop&w=900&q=80" }
];

const castPool: PrincipalActor[] = [
  { name: "Lina Marlow", role: "Detective Elara", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80", bio: "A sharp lead performer known for quiet intensity, noir dialogue, and expressive close-ups." },
  { name: "Noah Vale", role: "The Projectionist", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80", bio: "A character actor who brings mystery, restraint, and old-cinema atmosphere to every scene." },
  { name: "Ari Kwan", role: "Sound Engineer", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80", bio: "A technical performer with documentary roots and a calm presence in suspense-driven stories." },
  { name: "Milo Reyes", role: "Festival Director", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80", bio: "A warm screen presence often cast as mentors, curators, directors, and cultural gatekeepers." },
  { name: "Sara Nadir", role: "Rain Sequence Lead", photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80", bio: "A romantic-drama specialist with graceful movement, emotional timing, and strong visual storytelling." },
  { name: "Kenji Sato", role: "Anime Voice Lead", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80", bio: "A voice and motion performer known for anime leads, fantasy heroes, and expressive vocal rhythm." },
  { name: "Mina Sol", role: "Cyber Pilot", photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=500&q=80", bio: "A sci-fi actor with futuristic screen energy, strong action posture, and emotional restraint." },
  { name: "Omar Stone", role: "Creature Performer", photo: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=500&q=80", bio: "A physical performer trained in stunt movement, creature suits, and practical-effects acting." },
  { name: "Yara Bell", role: "Archive Researcher", photo: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?auto=format&fit=crop&w=500&q=80", bio: "A documentary-style performer with a thoughtful, investigative screen presence." },
  { name: "Rami Cole", role: "Animated City Guide", photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80", bio: "A bright comedic actor used for animated worlds, narration, and quick character turns." }
];

const trailers = [
  "https://www.youtube.com/embed/aqz-KE-bpKQ",
  "https://www.youtube.com/embed/eRsGyueVLvQ",
  "https://www.youtube.com/embed/YE7VzlLtp-4",
  "https://www.youtube.com/embed/WhWc3b3KhnY",
  "https://www.youtube.com/embed/ScMzIvxBSi4",
  "https://www.youtube.com/embed/tgbNymZ7vqY",
  "https://www.youtube.com/embed/sOnqjkJTMaA",
  "https://www.youtube.com/embed/2Vv-BfVoq4g",
  "https://www.youtube.com/embed/ysz5S6PUM-U",
  "https://www.youtube.com/embed/kXYiU_JCYtU",
  "https://www.youtube.com/embed/hHW1oY26kxQ",
  "https://www.youtube.com/embed/3fumBcKC6RE"
];

type NormalizedEntertainmentItem = {
  title: string;
  genre: string;
  summary: string;
  year: number;
  cast: string[];
  director: string;
  filmingLocation: string;
  trailerLink: string;
  kind: string;
  categoryTag: string;
};

const entertainmentItems: NormalizedEntertainmentItem[] = [
  ...entertainmentDataset.movies.map((item) => ({
    title: item.title,
    genre: item.genre,
    summary: item.summary,
    year: item.year,
    cast: item.main_cast,
    director: item.director,
    filmingLocation: item.filming_location,
    trailerLink: item.trailer_link,
    kind: "Feature film",
    categoryTag: "movie"
  })),
  ...entertainmentDataset.anime.map((item) => ({
    title: item.title,
    genre: item.genre,
    summary: item.summary,
    year: item.year_started,
    cast: item.main_characters,
    director: item.studio,
    filmingLocation: `${item.studio} animation production`,
    trailerLink: item.trailer_link,
    kind: "Anime series",
    categoryTag: "anime"
  })),
  ...entertainmentDataset.animated_movies.map((item) => ({
    title: item.title,
    genre: item.genre,
    summary: item.summary,
    year: item.year,
    cast: enriched.animatedCharacters[item.title] || item.main_cast,
    director: "Animation studio feature",
    filmingLocation: "Animation production studio",
    trailerLink: item.trailer_link,
    kind: "Animated movie",
    categoryTag: "animated"
  })),
  ...entertainmentDataset.tv_series.map((item) => ({
    title: item.title,
    genre: item.genre,
    summary: item.summary,
    year: item.year,
    cast: item.main_cast,
    director: "Series creative team",
    filmingLocation: "Series production locations",
    trailerLink: item.trailer_link,
    kind: "TV series",
    categoryTag: "tv"
  })),
  ...entertainmentDataset.kdramas.map((item) => ({
    title: item.title,
    genre: item.genre,
    summary: item.summary,
    year: item.year,
    cast: item.main_cast,
    director: "K-drama production team",
    filmingLocation: "South Korea production locations",
    trailerLink: item.trailer_link,
    kind: "K-drama",
    categoryTag: "kdrama"
  }))
];

const contentImagesByGenre = [
  ["horror", "https://images.unsplash.com/photo-1505635552518-3448ff116af3?auto=format&fit=crop&w=1200&q=80"],
  ["action", "https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?auto=format&fit=crop&w=1200&q=80"],
  ["sci-fi", "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80"],
  ["thriller", "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80"],
  ["romance", "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1200&q=80"],
  ["comedy", "https://images.unsplash.com/photo-1527224538127-2104bb71c51b?auto=format&fit=crop&w=1200&q=80"],
  ["drama", "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1200&q=80"],
  ["anime", "https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&w=1200&q=80"],
  ["animated", "https://images.unsplash.com/photo-1616097970275-1e187b4ce59f?auto=format&fit=crop&w=1200&q=80"],
  ["fantasy", "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=1200&q=80"],
  ["crime", "https://images.unsplash.com/photo-1453873531674-2151bcd01707?auto=format&fit=crop&w=1200&q=80"],
  ["music", "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"]
];

const authors = ["Maya Sterling", "Jonas Vale", "Ari Lens", "Nora Cut", "FilmHub Archive"];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function primaryGenre(value: string) {
  return value.split(",")[0]?.trim() || "Cinema";
}

function genreKeywords(item: NormalizedEntertainmentItem) {
  const fromGenre = item.genre.split(",").map((tag) => tag.trim().toLowerCase()).filter(Boolean);
  const castTerms = item.cast.map((name) => name.toLowerCase());
  return Array.from(new Set([...fromGenre, ...castTerms, item.categoryTag, item.kind.toLowerCase(), "official trailer", "filmhub"]));
}

function titleInfo(item: NormalizedEntertainmentItem) {
  return enriched.titles[item.title] || {};
}

function trailerForItem(item: NormalizedEntertainmentItem) {
  return titleInfo(item).trailerEmbed || item.trailerLink;
}

function youtubeForItem(item: NormalizedEntertainmentItem) {
  return titleInfo(item).youtubeUrl || item.trailerLink;
}

function imageForItem(item: NormalizedEntertainmentItem) {
  const titlePoster = titleInfo(item).poster;
  if (titlePoster) return titlePoster;
  const haystack = `${item.genre} ${item.kind} ${item.categoryTag}`.toLowerCase();
  const match = contentImagesByGenre.find(([key]) => haystack.includes(key));
  return match?.[1] || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80";
}

function categoryForItem(item: NormalizedEntertainmentItem, index: number) {
  const genre = item.genre.toLowerCase();
  if (item.categoryTag === "anime" || item.categoryTag === "animated" || item.categoryTag === "kdrama" || item.categoryTag === "tv") return sampleCategories[3];
  if (genre.includes("action") || genre.includes("adventure")) return sampleCategories[2];
  if (genre.includes("sci-fi") || genre.includes("animation") || genre.includes("music")) return sampleCategories[4];
  if (genre.includes("comedy") || genre.includes("romance")) return sampleCategories[3];
  return sampleCategories[index % sampleCategories.length];
}

function archiveDate(index: number) {
  const month = String((index % 5) + 1).padStart(2, "0");
  const day = String((index % 27) + 1).padStart(2, "0");
  return `2026-${month}-${day}`;
}

function ratingForIndex(index: number) {
  return Number((8.1 + ((index * 7) % 18) / 10).toFixed(1));
}

function makeCastCards(item: NormalizedEntertainmentItem, itemIndex: number): PrincipalActor[] {
  const isCharacterSet = item.categoryTag === "anime" || item.categoryTag === "animated";
  const fallbackImage = imageForItem(item);
  return item.cast.slice(0, 4).map((name, castIndex) => ({
    ...castPool[(itemIndex + castIndex) % castPool.length],
    name,
    role: isCharacterSet ? "Main character" : castIndex === 0 ? "Lead actor" : "Principal actor",
    photo: isCharacterSet ? fallbackImage : enriched.people[name] || fallbackImage,
    bio: isCharacterSet
      ? `${name} is one of the central characters in ${item.title}, carrying the ${primaryGenre(item.genre).toLowerCase()} story through conflict and growth.`
      : `${name} is one of the real main cast members in ${item.title}, helping shape its ${primaryGenre(item.genre).toLowerCase()} tone.`
  }));
}

const generatedMovieDetails: Record<string, MovieDetail> = Object.fromEntries(
  entertainmentItems.map((item, index) => {
    const slug = slugify(`${item.title} ${item.categoryTag} filmhub profile`);
    return [
      slug,
      {
        movieTitle: item.title,
        type: item.kind,
        rank: `#${index + 1} ${primaryGenre(item.genre)} Pick`,
        trailerUrl: trailerForItem(item),
        releaseDate: String(item.year),
        genre: item.genre,
        director: item.director,
        filmingLocations: [item.filmingLocation],
        review: item.summary,
        script: `INT. FILMHUB SCREENING ROOM - NIGHT. The ${item.title} card swings into projector light while the archive opens cast notes, story context, an embedded trailer, and audience reactions.`,
        cast: makeCastCards(item, index),
        comments: [
          `${item.title} belongs perfectly in a ${primaryGenre(item.genre).toLowerCase()} watchlist.`,
          item.categoryTag === "anime" || item.categoryTag === "animated"
            ? "The character cards make this page feel closer to anime and animation browsing."
            : "The real cast names and embedded trailer make this page feel ready for a movie database."
        ]
      }
    ];
  })
) as Record<string, MovieDetail>;

const generatedContentPosts: FilmPost[] = entertainmentItems.map((item, index) => {
  const category = categoryForItem(item, index);
  const slug = slugify(`${item.title} ${item.categoryTag} filmhub profile`);
  const tags = genreKeywords(item).join(",");
  return {
    id: 1000 + index,
    user_id: index % 2 ? 3 : 2,
    title: `${item.title}: ${item.kind} Profile`,
    slug,
    content: `<p>${item.summary}</p><p><strong>Year:</strong> ${item.year}. <strong>Genre:</strong> ${item.genre}. <strong>${item.categoryTag === "anime" || item.categoryTag === "animated" ? "Main characters" : "Main cast"}:</strong> ${item.cast.slice(0, 4).join(", ")}.</p><p><strong>Location or studio:</strong> ${item.filmingLocation}. <strong>Director or studio:</strong> ${item.director}.</p><p><a href="${youtubeForItem(item)}" target="_blank" rel="noreferrer">Open trailer on YouTube</a></p>`,
    excerpt: item.summary,
    featured_image: imageForItem(item),
    trailer_url: trailerForItem(item),
    status: "published",
    category_id: category.id,
    category_name: category.name,
    category_slug: category.slug,
    author_name: authors[index % authors.length],
    tags,
    rating: ratingForIndex(index),
    views: 2400 + index * 137,
    likes: 120 + ((index * 29) % 780),
    featured: index < 12 ? 1 : 0,
    created_at: archiveDate(index)
  };
});

function enrichDetail(detail: MovieDetail): MovieDetail {
  const info = enriched.titles[detail.movieTitle];
  const isCharacterSet = /anime|animated/i.test(`${detail.type} ${detail.genre || ""}`);
  const poster = info?.poster || detail.cast[0]?.photo || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80";
  const characters = info?.characters;
  const cast = (isCharacterSet && characters?.length ? characters.slice(0, 4).map((name) => ({
    name,
    role: "Main character",
    photo: poster,
    bio: `${name} is one of the central characters in ${detail.movieTitle}.`
  })) : detail.cast.map((actor) => ({
    ...actor,
    photo: enriched.people[actor.name] || info?.poster || actor.photo,
    bio: enriched.people[actor.name]
      ? actor.bio
      : `${actor.name} is part of the real main cast for ${detail.movieTitle}.`
  }))) as PrincipalActor[];

  return {
    ...detail,
    trailerUrl: info?.trailerEmbed || detail.trailerUrl,
    cast
  };
}

export const movieDetails: Record<string, MovieDetail> = {
  "inception-dreams-built-like-architecture": {
    movieTitle: "Inception",
    type: "Feature film",
    rank: "#1 Sci-Fi Action",
    trailerUrl: "https://www.youtube.com/embed/YoHD9XEInc0",
    tmdbId: 27205,
    releaseDate: "July 16, 2010",
    genre: "Sci-Fi, Action, Thriller",
    director: "Christopher Nolan",
    filmingLocations: ["Los Angeles, USA", "Paris, France", "Tokyo, Japan", "Tangier, Morocco", "Calgary, Canada"],
    review: "Inception makes impossible dream logic feel physical through clean action geography, layered editing, and emotional stakes built around memory.",
    script: "INT. DREAM HOTEL - NIGHT. The hallway turns without warning. Cobb grabs the wall as gravity gives up. ARTHUR smiles: The dream is collapsing ahead of schedule.",
    cast: [
      { ...castPool[1], name: "Leonardo DiCaprio", role: "Dom Cobb", bio: "Leads the film as a haunted extractor whose grief turns every dream into a trap." },
      { ...castPool[6], name: "Elliot Page", role: "Ariadne", bio: "Plays the architect who learns how imagination, ethics, and danger overlap inside dreams." },
      { ...castPool[2], name: "Joseph Gordon-Levitt", role: "Arthur", bio: "Brings precision and dry control to the team's most technically demanding dream sequences." }
    ],
    comments: ["The rotating hallway still feels unreal.", "This is exactly the kind of movie page I wanted."]
  },
  "get-out-social-horror-with-a-perfect-smile": {
    movieTitle: "Get Out",
    type: "Feature film",
    rank: "#1 Social Horror",
    trailerUrl: "https://www.youtube.com/embed/DzfpyUB60YY",
    tmdbId: 419430,
    releaseDate: "February 24, 2017",
    genre: "Horror, Mystery, Thriller",
    director: "Jordan Peele",
    filmingLocations: ["Fairhope, Alabama, USA", "Mobile, Alabama, USA"],
    review: "Get Out turns social discomfort into horror grammar, using smiles, pauses, and politeness as weapons.",
    script: "INT. LIVING ROOM - NIGHT. The spoon circles the teacup. Chris tries to laugh. The sound becomes a door opening somewhere behind his eyes.",
    cast: [
      { ...castPool[5], name: "Daniel Kaluuya", role: "Chris Washington", bio: "Anchors the film with subtle fear, restraint, and emotional intelligence." },
      { ...castPool[0], name: "Allison Williams", role: "Rose Armitage", bio: "Uses warmth and control to make the film's social horror feel personal." },
      { ...castPool[3], name: "Lakeith Stanfield", role: "Andre Logan King", bio: "Delivers one of the film's most unsettling shifts in tone and identity." }
    ],
    comments: ["The Sunken Place section should be required reading.", "A perfect horror/social thriller mix."]
  },
  "spirited-away-anime-as-a-living-dream": {
    movieTitle: "Spirited Away",
    type: "Anime feature",
    rank: "#1 Anime Classic",
    trailerUrl: "https://www.youtube.com/embed/ByXuk9QqQkk",
    tmdbId: 129,
    releaseDate: "July 20, 2001",
    genre: "Anime, Fantasy, Adventure",
    director: "Hayao Miyazaki",
    filmingLocations: ["Studio Ghibli, Koganei, Tokyo, Japan", "Inspired by Dogo Onsen, Matsuyama, Japan"],
    review: "Spirited Away creates a world that feels ancient and improvised at the same time, full of spirits, labor, appetite, fear, and kindness.",
    script: "INT. BATHHOUSE CORRIDOR - NIGHT. Chihiro runs past lanterns and steam. A spirit without a face waits at the bridge, holding out a handful of gold.",
    cast: [
      { ...castPool[5], name: "Chihiro Ogino", role: "Main character", photo: "https://image.tmdb.org/t/p/w780/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg", bio: "A young girl learning courage, work, kindness, and identity inside the spirit bathhouse." },
      { ...castPool[9], name: "Haku", role: "Main character", photo: "https://image.tmdb.org/t/p/w780/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg", bio: "A mysterious spirit who protects Chihiro while searching for his own forgotten name." },
      { ...castPool[4], name: "No-Face", role: "Main character", photo: "https://image.tmdb.org/t/p/w780/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg", bio: "A lonely spirit whose hunger and silence reveal the bathhouse's temptations." }
    ],
    comments: ["The bathhouse world feels alive.", "Anime details like this make FilmHub much better."]
  },
  "mad-max-fury-road-and-pure-action-geography": {
    movieTitle: "Mad Max: Fury Road",
    type: "Feature film",
    rank: "#1 Action Film",
    trailerUrl: "https://www.youtube.com/embed/hEJnMQG9ev8",
    tmdbId: 76341,
    releaseDate: "May 15, 2015",
    genre: "Action, Adventure, Sci-Fi",
    director: "George Miller",
    filmingLocations: ["Namib Desert, Namibia", "Cape Town Film Studios, South Africa"],
    review: "Fury Road is a masterclass in action clarity, practical movement, and visual storytelling under extreme speed.",
    script: "EXT. DESERT CONVOY - DAY. The War Rig roars across the salt flats. Furiosa sees the bikes rise from the dunes like a storm with engines.",
    cast: [
      { ...castPool[7], name: "Charlize Theron", role: "Imperator Furiosa", bio: "Carries the film with physical intensity, grief, strategy, and revolutionary force." },
      { ...castPool[1], name: "Tom Hardy", role: "Max Rockatansky", bio: "Uses silence, survival instinct, and physical acting to rebuild the iconic wanderer." },
      { ...castPool[3], name: "Nicholas Hoult", role: "Nux", bio: "Turns a chaotic war boy into one of the film's most emotional arcs." }
    ],
    comments: ["The desert locations are insane.", "Action geography is a great way to explain this movie."]
  },
  "parasite-a-house-built-for-class-war": {
    movieTitle: "Parasite",
    type: "Feature film",
    rank: "#1 Drama Thriller",
    trailerUrl: "https://www.youtube.com/embed/5xH0HfJHsaY",
    tmdbId: 496243,
    releaseDate: "May 30, 2019",
    genre: "Drama, Thriller, Dark Comedy",
    director: "Bong Joon Ho",
    filmingLocations: ["Seoul, South Korea", "Jeonju, South Korea"],
    review: "Parasite turns architecture into social structure, using stairs, windows, basements, and rooms as class language.",
    script: "INT. PARK HOUSE - NIGHT. Rain taps the glass. Beneath the table, three bodies hold their breath while the house speaks above them.",
    cast: [
      { ...castPool[3], name: "Song Kang-ho", role: "Kim Ki-taek", bio: "Balances comedy, fatigue, anger, and heartbreak in a performance that slowly darkens." },
      { ...castPool[0], name: "Cho Yeo-jeong", role: "Park Yeon-gyo", bio: "Plays privilege with airy charm, innocence, and quiet blindness." },
      { ...castPool[8], name: "Park So-dam", role: "Kim Ki-jung", bio: "Brings sharp confidence, improvisation, and dry humor to the Kim family plan." }
    ],
    comments: ["The house really is the movie.", "The locations and production design info help a lot."]
  },
  "dune-part-one-and-the-weight-of-desert-worlds": {
    movieTitle: "Dune: Part One",
    type: "Feature film",
    rank: "#2 Sci-Fi Epic",
    trailerUrl: "https://www.youtube.com/embed/8g18jFHCLXk",
    tmdbId: 438631,
    releaseDate: "October 22, 2021",
    genre: "Sci-Fi, Adventure, Drama",
    director: "Denis Villeneuve",
    filmingLocations: ["Wadi Rum, Jordan", "Abu Dhabi, UAE", "Budapest, Hungary", "Norway"],
    review: "Dune gives science fiction the weight of myth through desert scale, ritual, sound, and monumental production design.",
    script: "EXT. ARRAKIS - DUSK. Paul steps into the sand. The horizon moves. Somewhere beneath them, the desert answers with a tremor.",
    cast: [
      { ...castPool[6], name: "Timothee Chalamet", role: "Paul Atreides", bio: "Plays Paul as uncertain, observant, and trapped between prophecy and politics." },
      { ...castPool[4], name: "Rebecca Ferguson", role: "Lady Jessica", bio: "Gives the film its emotional core through control, fear, and maternal force." },
      { ...castPool[1], name: "Oscar Isaac", role: "Duke Leto", bio: "Brings nobility and melancholy to a leader aware of political danger." }
    ],
    comments: ["The location list is exactly what I wanted.", "The trailer section looks much more real now."]
  },
  "why-neo-noir-still-owns-the-night": {
    movieTitle: "Neon Harbor",
    type: "Neo-noir film",
    rank: "#1 on FilmHub Noir Week",
    trailerUrl: trailers[0],
    review: "A stylish night-city thriller with sharp lighting, patient suspense, and a lead performance that feels haunted before the plot even begins.",
    script: "INT. HARBOR DINER - NIGHT. Rain presses against the windows. ELARA studies a strip of film under red neon. The PROJECTIONIST whispers: Some frames are not meant to be developed.",
    cast: [castPool[0], castPool[1], castPool[3]],
    comments: ["The neon mood is perfect for this platform.", "The script sample makes me want a full screenplay section."]
  },
  "ten-practical-effects-that-still-feel-impossible": {
    movieTitle: "Midnight Cut",
    type: "Practical-effects feature",
    rank: "#2 in Film Craft",
    trailerUrl: trailers[1],
    review: "A tactile celebration of physical cinema, with models, smoke, wires, and camera tricks that make every frame feel handmade.",
    script: "EXT. MINIATURE CITY - DAWN. The monster suit bends between towers. A fan shakes paper windows. The director smiles because the illusion finally breathes.",
    cast: [castPool[7], castPool[2], castPool[1]],
    comments: ["I love that this explains the craft, not only the result.", "Practical effects always feel alive."]
  },
  "the-comfort-of-rewatching-a-perfect-opening-scene": {
    movieTitle: "The Last Frame",
    type: "Drama film",
    rank: "#3 Rewatch Pick",
    trailerUrl: trailers[2],
    review: "A gentle but precise opening that uses silence, blocking, and one perfect cut to tell the audience exactly how to watch.",
    script: "INT. EMPTY CINEMA - MORNING. A cleaner finds one ticket under row seven. On the screen, the final frame of last night's film refuses to fade.",
    cast: [castPool[4], castPool[0], castPool[2]],
    comments: ["Opening scenes are underrated.", "This made me rewatch three movies immediately."]
  },
  "how-sound-design-turns-silence-into-suspense": {
    movieTitle: "Soundstage 9",
    type: "Sound design documentary",
    rank: "#1 Technical Review",
    trailerUrl: trailers[3],
    review: "A brilliant breakdown of how sound can become architecture: bass pressure, room tone, missing footsteps, and silence as a threat.",
    script: "INT. RECORDING BOOTH - 2:13 AM. The waveform goes flat. The engineer removes her headphones. In the silence, something knocks from inside the wall.",
    cast: [castPool[2], castPool[5], castPool[1]],
    comments: ["The room tone idea is scary by itself.", "This is the kind of craft content FilmHub needs."]
  },
  "festival-watch-five-films-built-for-the-big-screen": {
    movieTitle: "Red Carpet Static",
    type: "Festival cinema",
    rank: "#4 Festival Watch",
    trailerUrl: trailers[4],
    review: "Large-format images, long shadows, and a crowd-ready sound mix make this feel built for a packed theater.",
    script: "EXT. FESTIVAL STEPS - NIGHT. Cameras flash. A director looks past the carpet toward the old theater, where the projector has started by itself.",
    cast: [castPool[3], castPool[0], castPool[6]],
    comments: ["This feels like a real festival program.", "The poster energy is beautiful."]
  },
  "best-rain-scenes-in-modern-cinema": {
    movieTitle: "Rain Sequence",
    type: "Romantic thriller",
    rank: "#5 Visual Ranking",
    trailerUrl: trailers[5],
    review: "Rain becomes rhythm, texture, and memory. The scenes work because weather changes the characters, not only the lighting.",
    script: "EXT. ROOFTOP - RAIN. The city below disappears. She holds the photograph against her coat and says: If the rain stops, we run.",
    cast: [castPool[4], castPool[6], castPool[5]],
    comments: ["The rain visuals are so cinematic.", "This would make a great animated background."]
  },
  "anime-frames-that-feel-like-moving-paintings": {
    movieTitle: "Velvet Exit: Blue Episode",
    type: "Anime feature",
    rank: "#1 Anime Frame Ranking",
    trailerUrl: trailers[1],
    review: "A luminous anime feature where still frames become emotional pauses and action bursts feel like ink thrown across glass.",
    script: "EXT. SKY TRAIN - SUNSET. The city floats below. MINA touches the window and every reflection becomes a different version of home.",
    cast: [castPool[5], castPool[6], castPool[2]],
    comments: ["The anime section makes the platform feel wider.", "I want more animated movies like this on FilmHub."]
  },
  "cyber-pilots-and-the-future-of-sci-fi-cinema": {
    movieTitle: "Orbit Premiere",
    type: "Sci-fi film",
    rank: "#2 Future Cinema",
    trailerUrl: trailers[2],
    review: "A sleek sci-fi story that makes cockpit lights, memory systems, and orbital cities feel personal rather than cold.",
    script: "INT. ORBITAL COCKPIT - NIGHT CYCLE. The pilot watches Earth reload from backup memory. The ship asks: Which version do you miss?",
    cast: [castPool[6], castPool[1], castPool[5]],
    comments: ["The cockpit concept is excellent.", "This would look amazing as a 3D dashboard theme."]
  },
  "documentaries-that-turn-real-life-into-suspense": {
    movieTitle: "Soundstage 9: The Real Cut",
    type: "Documentary",
    rank: "#3 Documentary Picks",
    trailerUrl: trailers[4],
    review: "A smart documentary list that treats real life like cinema without forcing it into fiction.",
    script: "INT. ARCHIVE ROOM - EVENING. Boxes of footage line the wall. A researcher opens a reel labeled only: Do not screen after midnight.",
    cast: [castPool[3], castPool[2], castPool[0]],
    comments: ["Documentaries absolutely belong here.", "The archive-room script is a nice touch."]
  },
  "animated-worlds-with-the-best-production-design": {
    movieTitle: "The Painted City",
    type: "Animated film",
    rank: "#1 Animated Design",
    trailerUrl: trailers[5],
    review: "A joyful look at animated production design: tiny signs, busy rooms, impossible streets, and background details that tell whole stories.",
    script: "EXT. PAINTED CITY - MORNING. Doors unfold like paper fans. A child chases a red kite through a street that redraws itself with every step.",
    cast: [castPool[5], castPool[4], castPool[7]],
    comments: ["The production design angle is perfect for animation.", "I like that FilmHub has anime and animated films too."]
  },
  "moonlit-bento-and-the-beauty-of-small-anime-stories": {
    movieTitle: "Moonlit Bento",
    type: "Slice-of-life anime",
    rank: "#2 Anime Comfort Watch",
    trailerUrl: trailers[6],
    review: "A quiet anime film where food, night streets, and tiny gestures become emotional worldbuilding.",
    script: "INT. TINY KITCHEN - MIDNIGHT. Steam rises from a blue lunchbox. The radio plays softly. KENJI says: Some meals are letters we forgot to send.",
    cast: [castPool[5], castPool[9], castPool[4]],
    comments: ["This anime section is cozy and cinematic.", "I love the food-as-memory idea."]
  },
  "archive-of-shadows-review-documentary-or-ghost-story": {
    movieTitle: "Archive of Shadows",
    type: "Mystery documentary",
    rank: "#2 Documentary Review",
    trailerUrl: trailers[7],
    review: "A documentary that edits real interviews like a ghost story, without losing its investigative patience.",
    script: "INT. FILM ARCHIVE - BASEMENT. YARA holds the reel to the light. Every frame is blank except one: a door she has never seen, already open.",
    cast: [castPool[8], castPool[3], castPool[2]],
    comments: ["This sounds like a documentary thriller.", "The archive imagery fits FilmHub perfectly."]
  },
  "glass-planet-and-the-new-wave-of-space-films": {
    movieTitle: "Glass Planet",
    type: "Space sci-fi",
    rank: "#3 Sci-Fi Watch",
    trailerUrl: trailers[8],
    review: "A space film with glowing interiors, fragile planets, and human choices that feel heavier than the visual spectacle.",
    script: "EXT. GLASS PLANET - ORBIT. The planet below cracks with light. MINA asks the ship to lower the shields, just enough to hear it sing.",
    cast: [castPool[6], castPool[1], castPool[8]],
    comments: ["More sci-fi like this please.", "The glowing planet concept is very cinematic."]
  },
  "house-of-frames-the-horror-film-that-watches-back": {
    movieTitle: "House of Frames",
    type: "Horror film",
    rank: "#1 Midnight Screening",
    trailerUrl: trailers[9],
    review: "A horror film built around old photographs, shifting walls, and the fear that every frame is looking back.",
    script: "INT. HALLWAY - NIGHT. Omar lifts the photograph. The figure inside turns its head first. Then the hallway does.",
    cast: [castPool[7], castPool[0], castPool[8]],
    comments: ["This horror concept is strong.", "The actor cards need to look spooky here."]
  },
  ...generatedMovieDetails
};

export const samplePosts: FilmPost[] = [
  {
    id: 201,
    user_id: 2,
    title: "Inception: Dreams Built Like Architecture",
    slug: "inception-dreams-built-like-architecture",
    content: "<p>Christopher Nolan's Inception turns dreams into heist locations, emotional traps, and collapsing cities. Its power comes from making the impossible feel engineered.</p>",
    excerpt: "A sci-fi action review about dream layers, practical spectacle, and emotional architecture.",
    featured_image: "https://image.tmdb.org/t/p/w780/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    trailer_url: "https://www.youtube.com/embed/YoHD9XEInc0",
    status: "published",
    category_id: 1,
    category_name: "Reviews",
    category_slug: "reviews",
    author_name: "Maya Sterling",
    tags: "sci-fi,action,drama,nolan,review",
    rating: 9.4,
    views: 8420,
    likes: 624,
    featured: 1,
    created_at: "2026-06-01"
  },
  {
    id: 202,
    user_id: 3,
    title: "Get Out: Social Horror With a Perfect Smile",
    slug: "get-out-social-horror-with-a-perfect-smile",
    content: "<p>Get Out builds horror from politeness, performance, and the terror of being watched by people who refuse to say what they mean.</p>",
    excerpt: "A horror review about tension, satire, performance, and the Sunken Place.",
    featured_image: "https://image.tmdb.org/t/p/w780/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg",
    trailer_url: "https://www.youtube.com/embed/DzfpyUB60YY",
    status: "published",
    category_id: 1,
    category_name: "Reviews",
    category_slug: "reviews",
    author_name: "Jonas Vale",
    tags: "horror,thriller,drama,review",
    rating: 9.2,
    views: 7104,
    likes: 510,
    featured: 1,
    created_at: "2026-05-30"
  },
  {
    id: 203,
    user_id: 2,
    title: "Spirited Away: Anime as a Living Dream",
    slug: "spirited-away-anime-as-a-living-dream",
    content: "<p>Spirited Away is fantasy, coming-of-age drama, and animated worldbuilding at once. Every creature, bathhouse room, and train window feels alive.</p>",
    excerpt: "An anime review about imagination, childhood fear, fantasy spaces, and hand-drawn wonder.",
    featured_image: "https://image.tmdb.org/t/p/w780/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
    trailer_url: "https://www.youtube.com/embed/ByXuk9QqQkk",
    status: "published",
    category_id: 1,
    category_name: "Reviews",
    category_slug: "reviews",
    author_name: "Maya Sterling",
    tags: "anime,animation,fantasy,drama,review",
    rating: 9.6,
    views: 9210,
    likes: 802,
    featured: 1,
    created_at: "2026-05-28"
  },
  {
    id: 204,
    user_id: 3,
    title: "Mad Max: Fury Road and Pure Action Geography",
    slug: "mad-max-fury-road-and-pure-action-geography",
    content: "<p>Fury Road is action cinema drawn in sand, metal, smoke, and impossible movement. It never loses geography, even at maximum speed.</p>",
    excerpt: "An action ranking about movement, practical stunts, desert production, and visual clarity.",
    featured_image: "https://image.tmdb.org/t/p/w780/hA2ple9q4qnwxp3hKVNhroipsir.jpg",
    trailer_url: "https://www.youtube.com/embed/hEJnMQG9ev8",
    status: "published",
    category_id: 3,
    category_name: "Rankings",
    category_slug: "rankings",
    author_name: "Jonas Vale",
    tags: "action,stunts,desert,rankings",
    rating: 9.3,
    views: 6902,
    likes: 489,
    featured: 1,
    created_at: "2026-05-26"
  },
  {
    id: 205,
    user_id: 2,
    title: "Parasite: A House Built for Class War",
    slug: "parasite-a-house-built-for-class-war",
    content: "<p>Parasite is a thriller, comedy, tragedy, and social diagram. The house is not just a location; it is the movie's argument.</p>",
    excerpt: "A drama/thriller analysis of production design, class, stairs, rooms, and social tension.",
    featured_image: "https://image.tmdb.org/t/p/w780/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    trailer_url: "https://www.youtube.com/embed/5xH0HfJHsaY",
    status: "published",
    category_id: 5,
    category_name: "Film Craft",
    category_slug: "film-craft",
    author_name: "Maya Sterling",
    tags: "drama,thriller,korean,production-design",
    rating: 9.5,
    views: 7840,
    likes: 690,
    featured: 1,
    created_at: "2026-05-24"
  },
  {
    id: 206,
    user_id: 3,
    title: "Dune: Part One and the Weight of Desert Worlds",
    slug: "dune-part-one-and-the-weight-of-desert-worlds",
    content: "<p>Dune uses scale, sound, sand, and ritual to make science fiction feel ancient. It is less a future than a mythology rebuilt with machines.</p>",
    excerpt: "A sci-fi review about desert scale, sound design, worldbuilding, and mythic production.",
    featured_image: "https://image.tmdb.org/t/p/w780/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    trailer_url: "https://www.youtube.com/embed/8g18jFHCLXk",
    status: "published",
    category_id: 1,
    category_name: "Reviews",
    category_slug: "reviews",
    author_name: "Jonas Vale",
    tags: "sci-fi,drama,desert,worldbuilding,review",
    rating: 9.0,
    views: 6501,
    likes: 442,
    featured: 1,
    created_at: "2026-05-23"
  },
  {
    id: 101,
    user_id: 2,
    title: "Why Neo-Noir Still Owns the Night",
    slug: "why-neo-noir-still-owns-the-night",
    content: "<p>Neo-noir survives because cities keep inventing new shadows. This essay follows rain-slick streets, unreliable heroes, and the way modern thrillers use light as a confession.</p><p>In the best films, neon is not decoration. It is pressure. It tells us who is trapped, who is pretending, and who already knows the ending.</p>",
    excerpt: "Rain, neon, silhouettes, and moral fog: a cinematic study of why neo-noir still feels alive.",
    featured_image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80",
    trailer_url: trailers[0],
    status: "published",
    category_id: 1,
    category_name: "Reviews",
    category_slug: "reviews",
    author_name: "Maya Sterling",
    author_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    tags: "noir,cinematography,thriller",
    rating: 9.1,
    views: 2810,
    likes: 244,
    featured: 1,
    created_at: "2026-05-22"
  },
  {
    id: 102,
    user_id: 3,
    title: "Ten Practical Effects That Still Feel Impossible",
    slug: "ten-practical-effects-that-still-feel-impossible",
    content: "<p>Before pixels took over the conversation, crews built impossible things with motors, matte paintings, glass, smoke, and patience. These sequences still hit because the camera believed them first.</p>",
    excerpt: "A ranked celebration of handmade spectacle, physical texture, and movie magic built for the lens.",
    featured_image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80",
    trailer_url: trailers[1],
    status: "published",
    category_id: 3,
    category_name: "Rankings",
    category_slug: "rankings",
    author_name: "Jonas Vale",
    author_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    tags: "effects,rankings,behind-the-scenes",
    rating: 8.7,
    views: 1640,
    likes: 151,
    featured: 1,
    created_at: "2026-05-18"
  },
  {
    id: 103,
    user_id: 2,
    title: "The Comfort of Rewatching a Perfect Opening Scene",
    slug: "the-comfort-of-rewatching-a-perfect-opening-scene",
    content: "<p>A great opening scene teaches you how to watch the movie. It sets tempo, stakes, and trust. That is why we return to them like favorite songs.</p>",
    excerpt: "On the ritual pleasure of replaying unforgettable first scenes and how they train the audience.",
    featured_image: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1200&q=80",
    trailer_url: trailers[2],
    status: "published",
    category_id: 4,
    category_name: "Recommendations",
    category_slug: "recommendations",
    author_name: "Maya Sterling",
    tags: "rewatch,openings,essay",
    rating: 8.9,
    views: 1180,
    likes: 92,
    featured: 0,
    created_at: "2026-05-12"
  },
  {
    id: 104,
    user_id: 3,
    title: "How Sound Design Turns Silence Into Suspense",
    slug: "how-sound-design-turns-silence-into-suspense",
    content: "<p>The scariest sound in cinema is often the one that almost disappears. A distant hum, a room tone shift, or a missing footstep can pull the audience closer than a jump scare.</p>",
    excerpt: "A craft essay about room tone, bass pressure, and why silence can feel louder than impact.",
    featured_image: "https://images.unsplash.com/photo-1572188863110-46d457c9234d?auto=format&fit=crop&w=1200&q=80",
    trailer_url: trailers[3],
    status: "published",
    category_id: 5,
    category_name: "Film Craft",
    category_slug: "film-craft",
    author_name: "Jonas Vale",
    tags: "sound,editing,suspense",
    rating: 9.0,
    views: 1422,
    likes: 133,
    featured: 1,
    created_at: "2026-05-09"
  },
  {
    id: 105,
    user_id: 2,
    title: "Festival Watch: Five Films Built for the Big Screen",
    slug: "festival-watch-five-films-built-for-the-big-screen",
    content: "<p>Some films ask for a screen so large that every glance becomes architecture. This preview highlights festival titles with bold framing, theatrical color, and room-shaking sound.</p>",
    excerpt: "A festival-style watchlist for films that deserve theatrical sound, scale, and crowd energy.",
    featured_image: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?auto=format&fit=crop&w=1200&q=80",
    trailer_url: trailers[4],
    status: "published",
    category_id: 2,
    category_name: "News",
    category_slug: "news",
    author_name: "Maya Sterling",
    tags: "festival,news,cinema",
    rating: 8.4,
    views: 980,
    likes: 77,
    featured: 0,
    created_at: "2026-05-02"
  },
  {
    id: 106,
    user_id: 3,
    title: "Best Rain Scenes in Modern Cinema",
    slug: "best-rain-scenes-in-modern-cinema",
    content: "<p>Rain gives cinema texture, rhythm, reflection, and release. These scenes use water as atmosphere, memory, and sometimes a complete emotional reset.</p>",
    excerpt: "A visual ranking of rain scenes where weather becomes character, movement, and mood.",
    featured_image: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=1200&q=80",
    trailer_url: trailers[5],
    status: "published",
    category_id: 3,
    category_name: "Rankings",
    category_slug: "rankings",
    author_name: "Jonas Vale",
    tags: "rain,visuals,rankings",
    rating: 8.5,
    views: 1320,
    likes: 119,
    featured: 0,
    created_at: "2026-04-29"
  },
  {
    id: 107,
    user_id: 2,
    title: "Anime Frames That Feel Like Moving Paintings",
    slug: "anime-frames-that-feel-like-moving-paintings",
    content: "<p>Anime can hold a frame until it becomes a painting, then break it open with movement. This ranking follows color, stillness, and emotional timing.</p>",
    excerpt: "A celebration of anime composition, color, motion, and frames that feel impossible to pause.",
    featured_image: "https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&w=1200&q=80",
    trailer_url: "https://www.youtube.com/embed/eRsGyueVLvQ",
    status: "published",
    category_id: 3,
    category_name: "Rankings",
    category_slug: "rankings",
    author_name: "Maya Sterling",
    tags: "anime,animation,frames,rankings",
    rating: 9.3,
    views: 2140,
    likes: 201,
    featured: 1,
    created_at: "2026-04-24"
  },
  {
    id: 108,
    user_id: 3,
    title: "Cyber Pilots and the Future of Sci-Fi Cinema",
    slug: "cyber-pilots-and-the-future-of-sci-fi-cinema",
    content: "<p>New sci-fi films are less interested in shiny cities and more interested in the people trapped inside their systems. The best ones make technology feel emotional.</p>",
    excerpt: "A sci-fi review about pilots, neon cockpits, artificial memory, and human-scale futures.",
    featured_image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80",
    trailer_url: "https://www.youtube.com/embed/YE7VzlLtp-4",
    status: "published",
    category_id: 1,
    category_name: "Reviews",
    category_slug: "reviews",
    author_name: "Jonas Vale",
    tags: "sci-fi,future,technology,review",
    rating: 8.8,
    views: 1690,
    likes: 145,
    featured: 0,
    created_at: "2026-04-21"
  },
  {
    id: 109,
    user_id: 2,
    title: "Documentaries That Turn Real Life Into Suspense",
    slug: "documentaries-that-turn-real-life-into-suspense",
    content: "<p>The strongest documentaries build suspense from observation. A glance, a door, a missing answer, or a pause can carry the force of a thriller.</p>",
    excerpt: "A recommendation list for documentaries with tension, atmosphere, and cinematic structure.",
    featured_image: "https://images.unsplash.com/photo-1497015289639-54688650d173?auto=format&fit=crop&w=1200&q=80",
    trailer_url: "https://www.youtube.com/embed/ScMzIvxBSi4",
    status: "published",
    category_id: 4,
    category_name: "Recommendations",
    category_slug: "recommendations",
    author_name: "Maya Sterling",
    tags: "documentary,recommendations,suspense",
    rating: 8.6,
    views: 1260,
    likes: 98,
    featured: 0,
    created_at: "2026-04-18"
  },
  {
    id: 110,
    user_id: 3,
    title: "Animated Worlds With the Best Production Design",
    slug: "animated-worlds-with-the-best-production-design",
    content: "<p>Animation can build a world from scratch, but the memorable ones still feel used, repaired, crowded, and lived in.</p>",
    excerpt: "A film craft essay about animated cities, fantasy rooms, props, texture, and worldbuilding.",
    featured_image: "https://images.unsplash.com/photo-1616097970275-1e187b4ce59f?auto=format&fit=crop&w=1200&q=80",
    trailer_url: "https://www.youtube.com/embed/tgbNymZ7vqY",
    status: "published",
    category_id: 5,
    category_name: "Film Craft",
    category_slug: "film-craft",
    author_name: "Jonas Vale",
    tags: "animation,production-design,worldbuilding",
    rating: 9.0,
    views: 1888,
    likes: 172,
    featured: 1,
    created_at: "2026-04-12"
  },
  {
    id: 111,
    user_id: 2,
    title: "Moonlit Bento and the Beauty of Small Anime Stories",
    slug: "moonlit-bento-and-the-beauty-of-small-anime-stories",
    content: "<p>Not every anime needs a world-ending battle. Some of the most powerful animated films find drama in food, routine, silence, and one person waiting under a streetlight.</p>",
    excerpt: "A soft anime review about food, nighttime streets, small emotions, and beautiful quiet frames.",
    featured_image: "https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&w=1200&q=80",
    trailer_url: trailers[6],
    status: "published",
    category_id: 4,
    category_name: "Recommendations",
    category_slug: "recommendations",
    author_name: "Maya Sterling",
    tags: "anime,comfort,food,recommendations",
    rating: 9.4,
    views: 2412,
    likes: 224,
    featured: 1,
    created_at: "2026-04-08"
  },
  {
    id: 112,
    user_id: 3,
    title: "Archive of Shadows Review: Documentary or Ghost Story?",
    slug: "archive-of-shadows-review-documentary-or-ghost-story",
    content: "<p>This documentary moves like an investigation and lands like a haunted-house film. The tension comes from documents, pauses, and footage nobody can fully explain.</p>",
    excerpt: "A review of a documentary that borrows suspense grammar from ghost stories.",
    featured_image: "https://images.unsplash.com/photo-1497015289639-54688650d173?auto=format&fit=crop&w=1200&q=80",
    trailer_url: trailers[7],
    status: "published",
    category_id: 1,
    category_name: "Reviews",
    category_slug: "reviews",
    author_name: "Jonas Vale",
    tags: "documentary,mystery,review,archive",
    rating: 8.9,
    views: 1742,
    likes: 136,
    featured: 0,
    created_at: "2026-04-05"
  },
  {
    id: 113,
    user_id: 2,
    title: "Glass Planet and the New Wave of Space Films",
    slug: "glass-planet-and-the-new-wave-of-space-films",
    content: "<p>The new wave of space cinema is less about conquest and more about fragility. Ships feel smaller, planets feel alive, and silence carries grief.</p>",
    excerpt: "A sci-fi feature about fragile planets, quiet spacecraft, and emotional future cinema.",
    featured_image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80",
    trailer_url: trailers[8],
    status: "published",
    category_id: 2,
    category_name: "News",
    category_slug: "news",
    author_name: "Maya Sterling",
    tags: "sci-fi,space,news,feature",
    rating: 8.7,
    views: 1538,
    likes: 129,
    featured: 0,
    created_at: "2026-04-02"
  },
  {
    id: 114,
    user_id: 3,
    title: "House of Frames: The Horror Film That Watches Back",
    slug: "house-of-frames-the-horror-film-that-watches-back",
    content: "<p>House of Frames understands that the scariest image is not the one that moves, but the one you are certain moved when you looked away.</p>",
    excerpt: "A midnight horror review about old photographs, shifting rooms, and images that stare back.",
    featured_image: "https://images.unsplash.com/photo-1505635552518-3448ff116af3?auto=format&fit=crop&w=1200&q=80",
    trailer_url: trailers[9],
    status: "published",
    category_id: 1,
    category_name: "Reviews",
    category_slug: "reviews",
    author_name: "Jonas Vale",
    tags: "horror,midnight,review,frames",
    rating: 8.5,
    views: 1998,
    likes: 188,
    featured: 1,
    created_at: "2026-03-29"
  },
  ...generatedContentPosts
];

export const sampleComments = [
  { id: 1, content: "The lighting examples make the whole piece feel like a director's commentary.", author_name: "Admin Director" },
  { id: 2, content: "This is exactly the kind of film writing I wanted FilmHub to showcase.", author_name: "Jonas Vale" }
];

export function filterSamplePosts(search = "", category = "") {
  const term = search.trim().toLowerCase();
  return samplePosts.filter((post) => {
    const matchesTerm = !term || [post.title, post.content, post.author_name, post.tags].some((value) => String(value || "").toLowerCase().includes(term));
    const matchesCategory = !category || post.category_slug === category || String(post.category_id) === category;
    return matchesTerm && matchesCategory;
  });
}

export function getMovieDetail(slug: string, post?: FilmPost): MovieDetail {
  const known = movieDetails[slug];
  if (known) return enrichDetail(known);

  return enrichDetail({
    movieTitle: post?.title || "FilmHub Feature",
    type: post?.category_name || "Movie feature",
    rank: `#${Math.max(1, Math.round(Number(post?.rating || 8)))} FilmHub Pick`,
    trailerUrl: post?.trailer_url || trailers[0],
    releaseDate: "FilmHub archive",
    genre: post?.tags?.split(",").slice(0, 3).join(", ") || "Cinema",
    director: "FilmHub editorial desk",
    filmingLocations: ["Studio backlot", "Cinema archive", "Digital soundstage"],
    review: post?.excerpt || "A FilmHub movie page with trailer, cast, review, script notes, rank and comments.",
    script: "INT. FILMHUB SCREENING ROOM - NIGHT. The projector starts. A new story opens inside the light.",
    cast: [castPool[0], castPool[1], castPool[2]],
    comments: ["A complete FilmHub movie page.", "The details make the blog feel like a film profile."]
  });
}

export function filterSamplePostsByGenre(search = "", category = "", genre = "") {
  const categoryMatches = filterSamplePosts(search, category);
  const sourcePosts = category && categoryMatches.length === 0 ? filterSamplePosts(search, "") : categoryMatches;
  const genreTerms = [genre, category && categoryMatches.length === 0 ? category : ""]
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  return sourcePosts.filter((post) => {
    if (!genreTerms.length) return true;
    const detail = getMovieDetail(post.slug, post);
    return [post.tags, post.category_name, detail.genre, detail.type, detail.movieTitle]
      .some((value) => genreTerms.some((term) => String(value || "").toLowerCase().includes(term)));
  });
}
