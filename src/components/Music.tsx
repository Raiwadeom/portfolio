"use client";

/**
 * A cover-flow player driven by a hidden Spotify embed.
 *
 * Everything visible here is ours; the embed is parked off-screen and takes
 * orders from the transport bar. Cover art and canonical titles come from
 * Spotify's public oEmbed endpoint, so `content.ts` only ever holds a link.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { music } from "@/lib/content";
import {
  loadIframeApi,
  oembed,
  toEmbed,
  toLink,
  toUri,
  type PlaybackData,
  type SpotifyController,
} from "@/lib/spotify";
import { useSpotlight } from "@/lib/spotlight";
import { Section, SectionHead } from "./ui";

const mmss = (ms: number) => {
  if (!ms || ms < 0) return "0:00";
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

export default function Music() {
  const tracks = useMemo(
    () => music.tracks.map((t) => ({ ...t, uri: toUri(t.uri) })),
    []
  );

  const [covers, setCovers] = useState<Record<string, string>>({});
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0);
  const [dur, setDur] = useState(0);
  const [blocked, setBlocked] = useState(false);
  const [stalled, setStalled] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  /** Which track is actually loaded in the player — separate from `i`, which
      is just the cover-flow's own browsing position and drifts on its own
      the whole time. Without this split, letting the flow keep moving while
      a track played meant the transport bar started describing whichever
      cover the carousel had wandered to, not what was actually playing. */
  const [nowPlaying, setNowPlaying] = useState<number | null>(null);

  const {
    scope: flow,
    index: i,
    release,
    hold,
    set: bringToFront,
  } = useSpotlight<HTMLDivElement>(music.tracks.length, { ms: 3400 });

  const host = useRef<HTMLDivElement>(null);
  const ctrl = useRef<SpotifyController | null>(null);
  /** The uri the controller currently holds, so we only reload on a change. */
  const loaded = useRef<string>("");
  /** When the most recent play command went out, so a play that never
      actually produces audio can be caught rather than shown as playing
      forever. */
  const playedAt = useRef(0);
  const posRef = useRef(0);

  const activeIndex = nowPlaying ?? i;
  const current = tracks[i];
  const active = tracks[activeIndex];
  const playable = tracks.filter((t) => t.uri).length > 0;

  /* The whole playlist, in Spotify's own list player: every track listed,
     any one of them playable on a click. */
  const listUri = toUri(music.playlist, "playlist");
  const listSrc = toEmbed(listUri);

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

  /* ---------- the hidden player ---------- */
  useEffect(() => {
    if (!playable || !host.current) return;
    let dead = false;

    const first = tracks.find((t) => t.uri)!.uri;

    loadIframeApi()
      .then((api) => {
        if (dead || !host.current) return;
        api.createController(
          host.current,
          { uri: first, width: "100%", height: 80 },
          (c) => {
            if (dead) return c.destroy();
            ctrl.current = c;
            loaded.current = first;
            c.addListener("playback_update", (e: { data: PlaybackData }) => {
              posRef.current = e.data.position;
              setPos(e.data.position);
              setDur(e.data.duration);
              setPlaying(!e.data.isPaused);
              /* Real movement is proof of real audio — clear any stall flag
                 the moment position actually advances. */
              if (e.data.position > 0) setStalled(false);
            });
          }
        );
      })
      .catch(() => setBlocked(true));

    return () => {
      dead = true;
      ctrl.current?.destroy();
      ctrl.current = null;
    };
  }, [playable, tracks]);

  /* ---------- transport ---------- */

  /** Watches for a play that goes nowhere — issued, reported as playing,
      but position never leaves 0 — and surfaces that honestly rather than
      leave the transport bar quietly lying. Spotify's embed can only stream
      what it has a preview for; when it doesn't, it still answers commands
      as though it does. */
  const watchForStall = useCallback(() => {
    const startedAt = (playedAt.current = Date.now());
    setStalled(false);
    setTimeout(() => {
      if (playedAt.current === startedAt && posRef.current === 0) setStalled(true);
    }, 4000);
  }, []);

  const go = useCallback(
    (next: number, autoplay: boolean) => {
      const n = (next + tracks.length) % tracks.length;
      setNowPlaying(n);
      bringToFront(n);
      setPos(0);
      posRef.current = 0;
      const uri = tracks[n].uri;
      const c = ctrl.current;
      if (!c || !uri) {
        setPlaying(false);
        return;
      }
      c.loadUri(uri);
      loaded.current = uri;
      if (autoplay) {
        c.play();
        watchForStall();
      }
    },
    [tracks, watchForStall, bringToFront]
  );

  const toggle = () => {
    const c = ctrl.current;
    if (!c || !active.uri) return;
    if (loaded.current !== active.uri) {
      c.loadUri(active.uri);
      loaded.current = active.uri;
      c.play();
      watchForStall();
      return;
    }
    if (!playing) watchForStall();
    c.togglePlay();
  };

  const seek = (e: React.MouseEvent<HTMLElement>) => {
    const c = ctrl.current;
    if (!c || !dur) return;
    const r = e.currentTarget.getBoundingClientRect();
    c.seek(((e.clientX - r.left) / r.width) * (dur / 1000));
  };

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
            return (
              <button
                key={t.title}
                type="button"
                /* Only the front card is reached by keyboard directly — the
                   rest are behind the hit strips below, which are the real
                   pointer target for everything but the centred track. */
                tabIndex={n === i ? 0 : -1}
                /* A click always plays — every card is a pick, never a
                   pause. Branching on whatever was already playing meant
                   the very first click of a session (nothing playing yet)
                   loaded the track but never actually told Spotify to start
                   it, so nothing was heard until an unrelated toggle
                   happened to flip it on. Pausing lives on the transport's
                   own button now, where it unambiguously belongs. */
                onClick={() => go(n, true)}
                aria-label={`Play ${t.title}`}
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

                  {n === activeIndex && playable ? (
                    <span
                      className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 hover:opacity-100"
                      style={{ background: "rgba(0,0,0,0.35)" }}
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/92 text-[#101413]">
                        {playing ? <PauseGlyph /> : <PlayGlyph />}
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
              </button>
            );
          })}

          {/* Flat, still hover targets over the flow — the covers move, so
              they make poor ones. Ordered by ON-SCREEN position (left to
              right), not by track order, and capped to roughly the width
              the visible cards actually occupy: a strip laid out by raw
              track index across the full section width put a click "on"
              a card in the wrong hands entirely — clicking the card drawn
              on the left could select a track several slots away, because
              that x-position fell inside a different track's segment.
              The centred slot has no strip: that gap lets clicks and taps
              reach the real card underneath, which is what actually calls
              toggle()/loadUri() on the player. A strip there would swallow
              every click, which is why nothing but the very first track
              could ever be played. */}
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
                    aria-label={`Play ${t.title}`}
                    /* Hovering only previews — it loads the track but
                       respects whatever is already happening (silent if
                       nothing is playing, keeps playing through the switch
                       if something is). A deliberate click or a keyboard
                       Enter always plays: that is the one gesture a visitor
                       cannot mean any other way. */
                    onPointerEnter={(e) => {
                      hold(e);
                      if (e.pointerType === "mouse") go(n, playing);
                    }}
                    onFocus={() => go(n, true)}
                    onClick={() => go(n, true)}
                  />
              )
            )}
          </div>
        </div>

        {/* ---------- transport ----------
             Same bar as the site nav: dark, rounded, icon-only, with a tab
             riding the bottom edge. Here that tab is the progress line, and
             it is seekable. The track name goes underneath, the way the nav
             puts the section name under its bar. */}
        <div className="playbar-wrap">
          <div className="playbar">
            <button
              type="button"
              onClick={() => go(activeIndex - 1, true)}
              aria-label="Previous track"
              className="playbar-item"
            >
              <PrevGlyph />
            </button>

            <button
              type="button"
              onClick={toggle}
              disabled={!active.uri}
              aria-label={playing ? "Pause" : "Play"}
              className="playbar-item playbar-item--main"
            >
              {playing ? <PauseGlyph /> : <PlayGlyph />}
            </button>

            <button
              type="button"
              onClick={() => go(activeIndex + 1, true)}
              aria-label="Next track"
              className="playbar-item"
            >
              <NextGlyph />
            </button>

            <span className="playbar-split" aria-hidden />

            <button
              type="button"
              onClick={() => go(Math.floor(Math.random() * tracks.length), true)}
              aria-label="Shuffle"
              className="playbar-item"
            >
              <ShuffleGlyph />
            </button>

            <button
              type="button"
              onClick={() => {
                /* Two players must never sing at once. */
                if (!listOpen) ctrl.current?.pause();
                setListOpen((v) => !v);
              }}
              disabled={!listSrc}
              aria-expanded={listOpen}
              aria-label={listOpen ? "Close the playlist" : "Open the whole playlist"}
              className={`playbar-item ${listOpen ? "is-on" : ""}`}
            >
              <ListGlyph />
            </button>

            <a
              href={toLink(active.uri) || music.playlist || music.profile}
              target="_blank"
              rel="noreferrer"
              aria-label="Open in Spotify"
              className="playbar-item"
            >
              <SpotifyGlyph />
            </a>

            {/* the tab on the edge, doing real work */}
            <span
              className="playbar-rail"
              onClick={seek}
              role="presentation"
              aria-hidden
            >
              <span
                className="playbar-fill"
                style={{ width: dur ? `${Math.min(100, (pos / dur) * 100)}%` : "0%" }}
              />
            </span>
          </div>

          <p className="playbar-caption">
            <span className="playbar-now">{active.title}</span>
            <span className="playbar-by">{active.artist}</span>
            <span className="playbar-time">
              {mmss(pos)} / {mmss(dur)}
            </span>
          </p>

          {stalled ? (
            <p className="playbar-stall">
              Spotify isn’t giving this one any sound to play — it happens
              when a track has no anonymous preview.{" "}
              <a
                href={toLink(active.uri) || music.playlist || music.profile}
                target="_blank"
                rel="noreferrer"
              >
                Hear it on Spotify ↗
              </a>
            </p>
          ) : null}

          {/* ---------- the whole playlist ----------
               Spotify's own list player: every track in the playlist, each
               one playable on a click, so a visitor can pick their own. */}
          <div className={`playlist ${listOpen ? "is-open" : ""}`}>
            <div className="playlist-inner">
              {listSrc ? (
                <iframe
                  src={listSrc}
                  title="The full playlist on Spotify"
                  width="100%"
                  height="420"
                  loading="lazy"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  style={{ border: 0, borderRadius: 14 }}
                />
              ) : null}
            </div>
          </div>
        </div>

        {/* The embed itself — present and playing, just not seen. The
            wrapper does the hiding: createController replaces the element it
            is given, so anything styled on that element is thrown away. */}
        <div className="embed-hide" aria-hidden>
          <div ref={host} />
        </div>

        <p className="mt-5 text-center text-[10.5px] leading-relaxed text-[var(--color-dim)]">
          {blocked
            ? "Spotify’s player could not load here — open the playlist instead."
            : playable
              ? "Playback depends on Spotify: signed in on this device, you get the full track; otherwise a short preview, when one exists — some tracks have none."
              : "Paste Spotify song links into music.tracks in content.ts to make these play."}
          {listSrc ? " Hit the list button for every track in the playlist." : ""}
          {" "}
          <a
            href={music.playlist || music.profile}
            target="_blank"
            rel="noreferrer"
            className="text-[var(--color-amber)] hover:underline"
          >
            Open Spotify ↗
          </a>
        </p>
      </div>
    </Section>
  );
}

/* ---------- glyphs ---------- */

const PlayGlyph = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M7 4.5 20 12 7 19.5Z" />
  </svg>
);
const PauseGlyph = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <rect x="6" y="4.5" width="4.2" height="15" rx="1" />
    <rect x="13.8" y="4.5" width="4.2" height="15" rx="1" />
  </svg>
);
const PrevGlyph = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M11 12 20 5.5v13ZM4 5.5h2.4v13H4Z" />
  </svg>
);
const NextGlyph = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M13 12 4 18.5v-13ZM17.6 5.5H20v13h-2.4Z" />
  </svg>
);
const ShuffleGlyph = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M3 6.5h3.6l3 4.2M3 17.5h3.6l8-11.2H21M14.6 17.5H21M18.4 3.7 21 6.3l-2.6 2.6M18.4 14.9 21 17.5l-2.6 2.6" />
  </svg>
);
const ListGlyph = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    aria-hidden
  >
    <path d="M4 6.5h11M4 12h11M4 17.5h7M18.5 10v8.2" />
    <circle cx="16.6" cy="18.4" r="1.9" />
    <path d="M18.5 10c1.4-.3 2.4-.8 3-1.5" />
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
