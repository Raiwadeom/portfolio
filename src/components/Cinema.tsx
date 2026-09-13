"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { cinema, links } from "@/lib/content";
import { Section, SectionHead, Reveal } from "./ui";

const letterboxd =
  links.find((l) => l.label === "LETTERBOXD")?.href ?? "https://letterboxd.com/oruim/";

const DWELL = 5200;

export default function Cinema() {
  const films = cinema.favorites;
  const [ch, setCh] = useState(0);
  const [tuning, setTuning] = useState(false);
  const paused = useRef(false);
  const timer = useRef<number | null>(null);

  /* Switching channels fires a burst of static, then swaps the picture —
     the same beat an old set takes to lock onto a new signal. */
  const tuneTo = useCallback(
    (next: number) => {
      if (next === ch) return;
      setTuning(true);
      window.setTimeout(() => {
        setCh(next);
        window.setTimeout(() => setTuning(false), 170);
      }, 130);
    },
    [ch]
  );

  // Auto-advance, paused while the viewer is interacting.
  useEffect(() => {
    timer.current = window.setInterval(() => {
      if (!paused.current && !document.hidden) {
        setTuning(true);
        window.setTimeout(() => {
          setCh((c) => (c + 1) % films.length);
          window.setTimeout(() => setTuning(false), 170);
        }, 130);
      }
    }, DWELL);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [films.length]);

  const film = films[ch];

  return (
    <Section id="cinema">
      <SectionHead label="CINEMA" index="05" />

      <div className="mt-8 sm:mt-12 grid gap-8 lg:gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:items-center">
        {/* ───────────── left: the dial ───────────── */}
        <div>
          <Reveal>
            <h2 className="display font-black text-[clamp(1.9rem,6.5vw,4.4rem)] text-[var(--color-ice)]">
              {cinema.heading}
            </h2>
          </Reveal>

          {/* channel list */}
          <Reveal delay={100}>
            <div
              className="mt-8 border-t border-[var(--color-line-soft)]"
              onMouseEnter={() => (paused.current = true)}
              onMouseLeave={() => (paused.current = false)}
            >
              {films.map((f, i) => {
                const on = i === ch;
                return (
                  <button
                    key={f.title}
                    onClick={() => tuneTo(i)}
                    onFocus={() => {
                      paused.current = true;
                      tuneTo(i);
                    }}
                    onBlur={() => (paused.current = false)}
                    aria-pressed={on}
                    className="group relative w-full flex items-center gap-3 sm:gap-4 border-b border-[var(--color-line-soft)] py-3 text-left"
                  >
                    {/* dwell bar for the active channel */}
                    <span
                      key={`bar-${ch}-${i}`}
                      className={`absolute left-0 bottom-[-1px] h-px bg-[var(--color-cyan)] ${
                        on ? "cine-dwell" : "w-0"
                      }`}
                    />
                    <span
                      className={`label shrink-0 transition-colors ${
                        on ? "!text-[var(--color-cyan)]" : ""
                      }`}
                    >
                      CH{String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`font-display text-[11px] sm:text-[13px] tracking-[0.06em] truncate transition-colors duration-300 ${
                        on
                          ? "text-[var(--color-ice)]"
                          : "text-[var(--color-dim)] group-hover:text-[var(--color-ice)]"
                      }`}
                    >
                      {f.short}
                    </span>
                    <span className="ml-auto shrink-0 label">{f.year}</span>
                  </button>
                );
              })}
            </div>
          </Reveal>

          <Reveal delay={160}>
            <a
              href={letterboxd}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 mt-6 label hover:!text-[var(--color-cyan)] transition-colors"
            >
              FULL LOG ON LETTERBOXD
              <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5">
                ↗
              </span>
            </a>
          </Reveal>
        </div>

        {/* ───────────── right: the set ───────────── */}
        <Reveal delay={140}>
          <div
            className="relative"
            onMouseEnter={() => (paused.current = true)}
            onMouseLeave={() => (paused.current = false)}
          >
            {/* bezel */}
            <div
              className="relative rounded-[14px] p-[3.5%] border border-[rgba(160,205,255,0.2)]"
              style={{
                background:
                  "linear-gradient(160deg, #26354f 0%, #121c32 52%, #0a1122 100%)",
              }}
            >
              <div className="relative aspect-[4/5] sm:aspect-[4/3] overflow-hidden rounded-[7px] bg-[#04091a]">
                {/* stacked channels — only the tuned one is lit */}
                {films.map((f, i) => (
                  <div
                    key={f.title}
                    className="absolute inset-0 transition-opacity duration-500"
                    style={{ opacity: i === ch ? 1 : 0 }}
                    aria-hidden={i !== ch}
                  >
                    {/* blurred bed so a 2:3 poster fills a 4:3 screen.
                        Inline filter/transform — a utility class here gets
                        overridden by next/image's own positioning styles. */}
                    <Image
                      src={f.poster}
                      alt=""
                      fill
                      priority={i === 0}
                      sizes="(max-width: 1024px) 100vw, 55vw"
                      className="object-cover"
                      style={{
                        filter: "blur(34px) saturate(1.3)",
                        transform: "scale(1.35)",
                        opacity: 0.4,
                      }}
                      aria-hidden
                    />
                    <Image
                      src={f.poster}
                      alt={`${f.title} (${f.year}) poster`}
                      fill
                      priority={i === 0}
                      sizes="(max-width: 1024px) 60vw, 34vw"
                      className="object-contain"
                      style={{ padding: "4% 0" }}
                    />
                  </div>
                ))}

                {/* CRT treatment */}
                <span className="pointer-events-none absolute inset-0 crt-lines opacity-70" />
                <span
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse 78% 70% at 50% 45%, transparent 45%, rgba(3,7,18,0.85) 100%)",
                  }}
                />
                <span
                  className="pointer-events-none absolute inset-0 opacity-30"
                  style={{
                    background:
                      "linear-gradient(118deg, rgba(255,255,255,0.14) 0%, transparent 36%, transparent 68%, rgba(255,255,255,0.06) 100%)",
                  }}
                />
                {/* scrim under the caption */}
                <span
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 0%, rgba(3,7,18,0.55) 45%, rgba(3,7,18,0.94) 100%)",
                  }}
                />

                {/* tracking band drifting down the tube */}
                <span className="pointer-events-none absolute inset-x-0 h-[14%] cine-track" />

                {/* static burst while tuning */}
                <span
                  className="pointer-events-none absolute inset-0 grain-tex transition-opacity duration-150"
                  style={{ opacity: tuning ? 0.5 : 0 }}
                />

                {/* on-screen display */}
                <span className="pointer-events-none absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#ff4d4d] animate-pulse" />
                  <span className="font-display text-[9px] sm:text-[11px] tracking-[0.22em] text-[rgba(220,238,255,0.92)]">
                    CH{String(ch + 1).padStart(2, "0")}
                  </span>
                </span>
                <span className="pointer-events-none absolute top-3 right-3 sm:top-4 sm:right-4 label !text-[8px] sm:!text-[9px] !text-[rgba(190,220,255,0.7)]">
                  {tuning ? "TUNING…" : "PLAY ▶"}
                </span>

                <span className="pointer-events-none absolute inset-x-3 bottom-3 sm:inset-x-5 sm:bottom-4">
                  <span className="block font-display text-[12px] sm:text-[17px] font-bold leading-tight text-[var(--color-ice)]">
                    {film.short}
                  </span>
                  <span className="block label mt-1 !text-[8px] sm:!text-[9px]">
                    {film.year} · DIR. {film.dir.toUpperCase()}
                  </span>
                </span>
              </div>
            </div>

            {/* caption under the set */}
            <p className="mt-4 text-[12px] sm:text-[13px] leading-relaxed text-[var(--color-dim)] min-h-[2.6em]">
              <span className="text-[var(--color-cyan)]">&ldquo;</span>
              {film.note}
              <span className="text-[var(--color-cyan)]">&rdquo;</span>
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
