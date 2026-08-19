import type { CSSProperties } from "react";
import { sampleFilms } from "../lib/mockData";

const posterPositions = [
  ["8vw", "14vh"],
  ["82vw", "18vh"],
  ["16vw", "72vh"],
  ["74vw", "68vh"],
  ["50vw", "10vh"],
  ["4vw", "44vh"],
  ["92vw", "48vh"],
  ["42vw", "84vh"]
];

export default function CinemaBackdrop() {
  return (
    <div className="cinema-backdrop" aria-hidden="true">
      <div className="cinema-grid" />
      <div className="projector-beam projector-beam-a" />
      <div className="projector-beam projector-beam-b" />
      <div className="floating-reel reel-a" />
      <div className="floating-reel reel-b" />
      <div className="floating-cube cube-a" />
      <div className="floating-cube cube-b" />
      <div className="floating-strip strip-a" />
      <div className="floating-strip strip-b" />
      <div className="background-poster-cloud">
        {sampleFilms.map((film, index) => (
          <div
            key={film.title}
            className="background-poster"
            style={{
              "--i": index,
              "--x": posterPositions[index % posterPositions.length][0],
              "--y": posterPositions[index % posterPositions.length][1]
            } as CSSProperties}
          >
            <img src={film.poster} alt="" />
          </div>
        ))}
      </div>
      <div className="cinema-dust">
        {Array.from({ length: 26 }, (_, index) => (
          <span key={index} style={{ "--i": index } as CSSProperties} />
        ))}
      </div>
    </div>
  );
}
