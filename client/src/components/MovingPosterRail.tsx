import { Star } from "lucide-react";
import { sampleFilms } from "../lib/mockData";

export default function MovingPosterRail() {
  const posters = [...sampleFilms, ...sampleFilms];

  return (
    <section className="overflow-hidden py-12">
      <div className="mx-auto mb-6 max-w-7xl px-4">
        <p className="text-sm uppercase tracking-[0.24em] text-cinema-teal">Moving film wall</p>
        <h2 className="mt-2 text-4xl font-black">Posters that move like cinema previews.</h2>
      </div>
      <div className="poster-rail-wrap">
        <div className="poster-rail">
          {posters.map((film, index) => (
            <article key={`${film.title}-${index}`} className="rail-poster">
              <img className="moving-poster-img" src={film.poster} alt={film.title} />
              <div className="rail-poster-info">
                <span>{film.genre}</span>
                <b>{film.title}</b>
                <small><Star size={13} /> {film.rating}</small>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
