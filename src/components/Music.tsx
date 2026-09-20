"use client";

/**
 * A cover-flow gallery, purely visual.
 *
 * Covers and titles come from Spotify's public oEmbed endpoint, so
 * `content.ts` only ever holds a link. No embedded player here — every
 * cover opens its own track on Spotify, and the button under the flow
 * opens the profile or playlist.
 */

import { useEffect, useMemo, useState } from "react";
import { music } from "@/lib/content";
import { oembed, toLink, toUri } from "@/lib/spotify";
import { useSpotlight } from "@/lib/spotlight";
import { Section, SectionHead } from "./ui";

export default function Music() {
  const tracks = useMemo(
    () => music.tracks.map((t) => ({ ...t, uri: toUri(t.uri) })),
    []
  );

  const [covers, setCovers] = useState<Record<string, string>>({});

  const { scope: flow, index: i, pick, release, hold } = useSpotlight<HTMLDivElement>(
    music.tracks.length,
    { ms: 3400 }
  );

  const current = tracks[i];

  /* ---------- cover art ---------- */
  useEffect(() => {
    let live = true;
    tracks.forEach((t) => {
      if (!t.uri) return;
      oembed(t.uri).then((d) => {
        if (live && d) setCovers((c) => (c[t.uri] ? c : { ...c, [t.uri]: d.thumbnail }));
      });
    });
    return () => {
      live = false;
    };
  }, [tracks]);

  return (
    <Section id="music" className="overflow-hidden">
      <SectionHead label={music.heading} index="01" right="SPOTIFY" />

      {/* ambient wash in the current track's colour */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[10%] h-[80%] transition-[background] duration-[1200ms]"
        style={{
          background: `radial-gradient(ellipse 55% 50% at 50% 45%, ${current.tint}55, transparent 70%)`,
        }}
      />

      <div className="relative mt-12 sm:mt-16">
        {/* ---------- cover flow ---------- */}
        <div
          ref={flow}
          onPointerEnter={hold}
          onPointerLeave={release}
          className="relative flex h-[240px] items-center justify-center sm:h-[310px]"
          style={{ perspective: "1200px" }}
        >
          {tracks.map((t, n) => {
            const o = n - i;
            if (Math.abs(o) > 2) return null;
            const cover = covers[t.uri];
            const href = toLink(t.uri) || music.playlist || music.profile;
            return (
              <a
                key={t.title}
                href={href}
                target="_blank"
                rel="noreferrer"
                tabIndex={n === i ? 0 : -1}
                aria-label={`Open ${t.title} on Spotify`}
                className="flow-card absolute rounded-[16px] border text-left will-change-transform"
                style={{
                  width: "clamp(150px, 40vw, 210px)",
                  transform: `translateX(calc(${o} * var(--flow-step))) translateY(${o === 0 ? -14 : 0}px) translateZ(${o === 0 ? 46 : 0}px) scale(${1 - Math.abs(o) * 0.15}) rotateY(${-o * 20}deg)`,
                  zIndex: 10 - Math.abs(o),
                  opacity: 1 - Math.abs(o) * 0.32,
                  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                  background: "rgba(236,244,240,0.1)",
                  borderColor: "rgba(255,255,255,0.16)",
                  boxShadow: "0 24px 60px -24px rgba(0,0,0,0.85)",
                  padding: "10px 10px 12px",
                }}
              >
                <span
                  className="relative block aspect-square w-full overflow-hidden rounded-[10px]"
                  style={{
                    background: `linear-gradient(150deg, ${t.tint}, ${t.tint}55)`,
                  }}
                >
                  {cover ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={cover}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span className="absolute inset-0 flex items-end p-3 display text-[13px] leading-tight text-white/85">
                      {t.title}
                    </span>
                  )}

                  {n === i ? (
                    <span
                      className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 hover:opacity-100"
                      style={{ background: "rgba(0,0,0,0.35)" }}
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/92 text-[#101413]">
                        <OpenGlyph />
                      </span>
                    </span>
                  ) : null}
                </span>

                <span className="mt-2.5 block truncate text-center text-[12px] font-medium text-white/95">
                  {t.title}
                </span>
                <span className="block truncate text-center text-[10px] text-white/55">
                  {t.artist}
                </span>
              </a>
            );
          })}

          {/* Flat, still hover targets over the flow — the covers move, so
              they make poor ones. Ordered by ON-SCREEN position (left to
              right), not by track order, and capped to roughly the width
              the visible cards actually occupy. */}
          <div
            className="deck-hits"
            style={{ maxWidth: "calc(var(--flow-step) * 4 + 210px)", margin: "0 auto" }}
          >
            {tracks
              .map((t, n) => ({ t, n, o: n - i }))
              .filter(({ o }) => Math.abs(o) <= 2)
              .sort((a, b) => a.o - b.o)
              .map(({ t, n, o }) =>
                o === 0 ? (
                  <span key={`hit-${t.title}`} aria-hidden />
                ) : (
                  <button
                    key={`hit-${t.title}`}
                    type="button"
                    aria-label={`Bring ${t.title} to the front`}
                    {...pick(n)}
                  />
                )
              )}
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href={music.playlist || music.profile}
            target="_blank"
            rel="noreferrer"
            className="spotify-cta"
          >
            <span className="spotify-cta-shine" aria-hidden />
            <SpotifyGlyph />
            Open Spotify
          </a>
        </div>
      </div>
    </Section>
  );
}

/* ---------- glyphs ---------- */

const OpenGlyph = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M7 17 17 7M9 7h8v8" />
  </svg>
);
const SpotifyGlyph = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    aria-hidden
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M7.4 9.4c3.1-.9 6.4-.6 9.2 1M8 12.6c2.5-.7 5.2-.4 7.5.9M8.7 15.6c2-.5 4-.3 5.8.7" />
  </svg>
);
