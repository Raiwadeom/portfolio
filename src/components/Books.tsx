"use client";

/**
 * The shelf.
 *
 * Books stand spine-out, the way they do on a shelf. Pick one and it swings
 * out of the row on its hinge and turns to face you, the rest sliding over to
 * make room. Real 3D: the spine plate counter-rotates so it keeps facing the
 * reader while the book is shut, then fades away as the cover comes round.
 */

import Image from "next/image";
import { books } from "@/lib/content";
import { useSpotlight } from "@/lib/spotlight";
import { Section, SectionHead } from "./ui";

const stateTint: Record<string, string> = {
  READING: "var(--color-amber)",
  READ: "var(--color-dim)",
  NEXT: "var(--color-haze-lit)",
};

export default function Books() {
  const { scope, index: open, pick, release } = useSpotlight<HTMLDivElement>(books.list.length, { ms: 3000 });
  const active = books.list[open];

  return (
    <Section id="books" className="overflow-hidden">
      <SectionHead label="BOOKS" index="02" right="THE SHELF" />

      {/* the rule-flanked plate from the reference */}
      <p className="shelf-plate">
        <span />
        {books.heading}
        <span />
      </p>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[22%] h-[60%] transition-[background] duration-[900ms]"
        style={{
          background: `radial-gradient(ellipse 46% 44% at 50% 46%, ${active.tint}3d, transparent 70%)`,
        }}
      />

      {/* ---------- the shelf ---------- */}
      <div ref={scope} className="shelf" onPointerLeave={release}>
        <div className="shelf-row" style={{ ["--n" as string]: books.list.length }}>
          {books.list.map((b, i) => (
            <button
              key={b.title}
              type="button"
              className="book"
              data-open={i === open ? "" : undefined}
              aria-pressed={i === open}
              aria-label={`${b.title} by ${b.author}`}
              tabIndex={-1}
              style={{
                ["--i" as string]: i,
                ["--past" as string]: i > open ? 1 : 0,
                zIndex: i === open ? 40 : 20 - Math.abs(i - open),
              }}
            >
              {/* the cover, edge-on until the book is opened */}
              <span className="book-cover">
                <Image
                  src={b.cover}
                  alt={`${b.title} cover`}
                  fill
                  sizes="(max-width: 640px) 40vw, 200px"
                  className="object-cover"
                />
                <span className="book-gloss" aria-hidden />
              </span>

              {/* the spine, kept facing the reader while the book is shut */}
              <span className="book-spine" style={{ background: b.tint }}>
                <span className="book-spine-text">
                  <b>{b.title}</b>
                  <i>{b.author}</i>
                </span>
              </span>
            </button>
          ))}

          {/* Hit-testing lives here, not on the books. An opened book is wide
              and lies across the spines to its right; these flat strips sit
              above all of it, one per slot, so running the cursor along the
              shelf opens each book in turn. */}
          {books.list.map((b, i) => (
            <button
              key={`hit-${b.title}`}
              type="button"
              className="shelf-hit"
              aria-label={`${b.title} by ${b.author}`}
              style={{ ["--i" as string]: i }}
              {...pick(i)}
            />
          ))}
        </div>
        <span className="shelf-board" aria-hidden />
      </div>

      {/* ---------- what's pulled out ---------- */}
      <div className="relative mx-auto mt-9 max-w-[620px] text-center">
        <span
          className="label !text-[9px]"
          style={{ color: stateTint[active.state] ?? "var(--color-dim)" }}
        >
          {active.state} · {active.series}
        </span>
        <h3 className="display mt-2 text-[clamp(1.4rem,5vw,2.4rem)] text-[var(--color-ice)]">
          {active.title}
        </h3>
        <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-[var(--color-dim)]">
          {active.author}
        </p>
        <p className="mt-3 text-[13px] leading-relaxed text-[var(--color-dim)]">{active.note}</p>
      </div>
    </Section>
  );
}
