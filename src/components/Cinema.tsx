"use client";

/**
 * The films, as a deck you flick through.
 *
 * The picks are stacked like a hand of cards. The top one is out in front;
 * the ones already seen are thrown off to the left, the ones still to come
 * sit behind it, each a little smaller and further back.
 *
 * Which card is on top follows the cursor on a desktop and the scroll on a
 * phone, so the deck deals itself as you come down the page.
 */

import Image from "next/image";
import { cinema } from "@/lib/content";
import { useSpotlight } from "@/lib/spotlight";
import { Section, SectionHead } from "./ui";

export default function Cinema() {
  const films = cinema.favorites;
  const { scope, index, pick, release } = useSpotlight<HTMLDivElement>(films.length, { ms: 3000 });
  const active = films[index];

  return (
    <Section id="cinema" className="overflow-hidden">
      <SectionHead label="CINEMA" index="03" right="FILMS" />

      <p className="shelf-plate">
        <span />
        {cinema.heading}
        <span />
      </p>

      <div ref={scope} className="deck-wrap" onPointerLeave={release}>
        {/* ---------- the deck ---------- */}
        <div className="deck">
          {films.map((f, i) => {
            const o = i - index;
            return (
              <button
                key={f.title}
                type="button"
                className="deck-card"
                data-state={o === 0 ? "top" : o < 0 ? "gone" : "back"}
                aria-label={`${f.short}, ${f.year}`}
                aria-pressed={o === 0}
                tabIndex={-1}
                style={{ ["--o" as string]: o, zIndex: films.length - Math.abs(o) }}
              >
                <Image
                  src={f.poster}
                  alt={`${f.short} poster`}
                  fill
                  sizes="(max-width: 640px) 62vw, 300px"
                  className="object-cover"
                />
                <span className="deck-sheen" aria-hidden />
                <span className="deck-tag">
                  {String(i + 1).padStart(2, "0")} / {String(films.length).padStart(2, "0")}
                </span>
              </button>
            );
          })}

          {/* Hover targets live here, flat and still. The cards themselves
              move as they deal, so using them would pull the target out from
              under the cursor and make the deck flicker.

              Ordered by ON-SCREEN position and capped to roughly the width
              the fanned cards actually occupy, not spread across the whole
              (much wider) deck box: laid out by raw array order over the
              full box, a tap "on" a poster could bring a totally different
              one forward, since that x-position fell inside another film's
              segment. That was the deck feeling unresponsive on a phone —
              taps were landing, just on the wrong slice. */}
          <div
            className="deck-hits"
            style={{ maxWidth: "calc(clamp(190px, 30vw, 286px) + 160px)", margin: "0 auto" }}
          >
            {films
              .map((f, i) => ({ f, i, o: i - index }))
              .sort((a, b) => a.o - b.o)
              .map(({ f, i }) => (
                <button
                  key={`hit-${f.title}`}
                  type="button"
                  aria-label={`Bring ${f.short} to the top`}
                  {...pick(i)}
                />
              ))}
          </div>
        </div>

        {/* ---------- what's on top ---------- */}
        <div className="deck-read">
          <span className="label !text-[var(--color-amber)]">
            {active.year} · {active.dir}
          </span>
          <h3 className="display mt-3 text-[clamp(1.6rem,5.5vw,3rem)] leading-[0.92] text-[var(--color-ice)]">
            {active.short}
          </h3>
          <p className="mt-4 max-w-[38ch] text-[13.5px] leading-relaxed text-[var(--color-dim)]">
            {active.note}
          </p>

          <div className="mt-7 flex items-center gap-1.5">
            {films.map((f, i) => (
              <button
                key={f.title}
                type="button"
                aria-label={`Bring ${f.short} to the top`}
                className="deck-pip"
                data-on={i === index ? "" : undefined}
                {...pick(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
