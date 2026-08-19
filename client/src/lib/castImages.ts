import type { MovieDetail, PrincipalActor } from "./mockData";

const imageCache = new Map<string, string | null>();

function isGenericPhoto(url = "") {
  return !url || url.includes("images.unsplash.com") || url.includes("i.ytimg.com") || url.includes("image.tmdb.org/t/p/w780");
}

function isAnimeDetail(detail: MovieDetail) {
  return /anime/i.test(`${detail.type} ${detail.genre || ""}`);
}

function isAnimatedCharacterDetail(detail: MovieDetail) {
  return /anime|animated/i.test(`${detail.type} ${detail.genre || ""}`);
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

type WikiSummary = {
  thumbnail?: { source?: string };
  originalimage?: { source?: string };
};

type JikanCharacters = {
  data?: {
    name?: string;
    images?: {
      jpg?: { image_url?: string; large_image_url?: string };
      webp?: { image_url?: string; large_image_url?: string };
    };
  }[];
};

type JikanAnimeSearch = {
  data?: { mal_id?: number; title?: string }[];
};

type JikanAnimeCharacters = {
  data?: {
    character?: {
      name?: string;
      images?: {
        jpg?: { image_url?: string; large_image_url?: string };
        webp?: { image_url?: string; large_image_url?: string };
      };
    };
  }[];
};

type JikanCharacterEntry = NonNullable<JikanCharacters["data"]>[number];
type JikanAnimeCharacterEntry = NonNullable<JikanAnimeCharacters["data"]>[number];

function normalizeName(value = "") {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function characterImageFromEntry(entry?: JikanCharacterEntry) {
  return entry?.images?.webp?.large_image_url
    || entry?.images?.webp?.image_url
    || entry?.images?.jpg?.large_image_url
    || entry?.images?.jpg?.image_url
    || "";
}

function animeCharacterImageFromEntry(entry?: JikanAnimeCharacterEntry) {
  return entry?.character?.images?.webp?.large_image_url
    || entry?.character?.images?.webp?.image_url
    || entry?.character?.images?.jpg?.large_image_url
    || entry?.character?.images?.jpg?.image_url
    || "";
}

async function wikipediaImage(name: string) {
  const key = `wiki:${name}`;
  if (imageCache.has(key)) return imageCache.get(key) || "";
  const data = await fetchJson<WikiSummary>(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`);
  const image = data?.thumbnail?.source || data?.originalimage?.source || "";
  imageCache.set(key, image || null);
  return image;
}

async function wikipediaCharacterImage(title: string, name: string) {
  const candidates = [
    `${name} (${title})`,
    `${name} (${title} character)`,
    `${name} (Disney)`,
    `${name} (Pixar)`,
    name
  ];

  for (const candidate of candidates) {
    const image = await wikipediaImage(candidate);
    if (image) return image;
  }
  return "";
}

async function jikanCharacterImage(name: string) {
  const key = `jikan:${name}`;
  if (imageCache.has(key)) return imageCache.get(key) || "";
  const data = await fetchJson<JikanCharacters>(`https://api.jikan.moe/v4/characters?q=${encodeURIComponent(name)}&limit=1`);
  const first = data?.data?.[0];
  const image = characterImageFromEntry(first);
  imageCache.set(key, image || null);
  return image;
}

async function jikanAnimeCharacterImage(title: string, name: string) {
  const key = `jikan-anime:${title}:${name}`;
  if (imageCache.has(key)) return imageCache.get(key) || "";

  const anime = await fetchJson<JikanAnimeSearch>(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(title)}&limit=1`);
  const animeId = anime?.data?.[0]?.mal_id;
  if (!animeId) return jikanCharacterImage(name);

  const characters = await fetchJson<JikanAnimeCharacters>(`https://api.jikan.moe/v4/anime/${animeId}/characters`);
  const normalized = normalizeName(name);
  const match = characters?.data?.find((entry) => normalizeName(entry.character?.name || "") === normalized)
    || characters?.data?.find((entry) => normalizeName(entry.character?.name || "").includes(normalized) || normalized.includes(normalizeName(entry.character?.name || "")));
  const image = animeCharacterImageFromEntry(match);
  imageCache.set(key, image || null);
  return image || jikanCharacterImage(name);
}

export async function enrichCastImages(detail: MovieDetail): Promise<PrincipalActor[]> {
  const anime = isAnimeDetail(detail);
  const characterSet = isAnimatedCharacterDetail(detail);

  return Promise.all(detail.cast.map(async (person) => {
    const shouldReplace = isGenericPhoto(person.photo) || characterSet;
    if (!shouldReplace) return person;

    const upgraded = anime
      ? await jikanAnimeCharacterImage(detail.movieTitle, person.name)
      : characterSet
        ? await wikipediaCharacterImage(detail.movieTitle, person.name)
        : await wikipediaImage(person.name);

    return {
      ...person,
      photo: upgraded || person.photo,
      role: characterSet ? person.role || "Main character" : person.role || "Principal actor"
    };
  }));
}
