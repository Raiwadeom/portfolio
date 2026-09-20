"use client";

/**
 * The films, as a list you read down and a poster that answers.
 *
 * A column of titles on one side; pick one and the poster, year, director
 * and note on the other side swap to match. Which title is picked follows
 * the cursor on a desktop and advances on its own otherwise, so the panel
 * still changes for a reader who never touches it.
 */

import Image from "next/image";
import { cinema } from "@/lib/content";
import { useSpotlight } from "@/lib/spotlight";
import { Section, SectionHead } from "./ui";

export default function Cinema() {
  const films = cinema.favorites;
  const { scope, index, pick, release } = useSpotlight<HTMLDivElement>(films.length, { ms: 3500 });
  const active = films[index];

  return (
    <Section id="cinema" className="overflow-hidden">
      <SectionHead label="CINEMA" index="03" right="FILMS" />

      <p className="shelf-plate">
        <span />
        {cinema.heading}
        <span />
      </p>

      <div ref={scope} className="cine-wrap" onPointerLeave={release}>
        {/* ---------- the list, read down ---------- */}
        <ol className="cine-list">
          {films.map((f, i) => (
            <li key={f.title}>
              <button
                type="button"
                className="cine-row"
                data-on={i === index ? "" : undefined}
                aria-current={i === index ? "true" : undefined}
                aria-label={`${f.short}, ${f.year}`}
                {...pick(i)}
              >
                <span className="cine-row-n">{String(i + 1).padStart(2, "0")}</span>
                <span className="cine-row-title">{f.short}</span>
                <span className="cine-row-year">{f.year}</span>
              </button>
            </li>
          ))}
        </ol>

        {/* ---------- the poster and its detail, on the right ---------- */}
        <div className="cine-panel">
          <div className="cine-frame">
            <Image
              key={active.poster}
              src={active.poster}
              alt={`${active.short} poster`}
              fill
              sizes="(max-width: 880px) 62vw, 300px"
              className="object-cover"
            />
            <span className="cine-frame-sheen" aria-hidden />
            <span className="cine-frame-tag">
              {String(index + 1).padStart(2, "0")} / {String(films.length).padStart(2, "0")}
            </span>
          </div>

          <div className="cine-detail">
            <span className="label !text-[var(--color-amber)]">
              {active.year} · {active.dir}
            </span>
            <h3 className="display mt-2 text-[clamp(1.4rem,4.5vw,2.4rem)] leading-[0.94] text-[var(--color-ice)]">
              {active.short}
            </h3>
            <p className="mt-3 max-w-[42ch] text-[13px] leading-relaxed text-[var(--color-dim)]">
              {active.note}
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
