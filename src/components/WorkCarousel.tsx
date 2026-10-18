"use client";

/**
 * The projects, as a row of tall cards.
 *
 * The project in the middle is big and the others lean away on either side.
 * Only the front card's clip plays, and only while the row is on screen, so
 * scrolling stays smooth. The backdrop is the current project's own
 * screenshot thrown out of focus. Click a side card
 * to bring it forward, click the front card (or "Open case study") to read
 * the full write-up. Arrow keys and swipes work too.
 */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { projects } from "@/lib/content";
import { motionOn } from "@/lib/motion";
import { getCaseStudy } from "@/lib/case-studies";

const items = projects.map((p) => ({ p, media: getCaseStudy(p.slug)?.solution.media }));

/** Which side of the front card this one sits on: -1, 0 or 1. */
function offset(i: number, index: number) {
  const n = items.length;
  let o = (i - index) % n;
  if (o > n / 2) o -= n;
  if (o < -n / 2) o += n;
  return o;
}

/** A muted looping clip that only plays while it is the front card and in view. */
function CardVideo({ src, poster, active }: { src: string; poster?: string; active: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const still =
      document.documentElement.getAttribute("data-motion") === "off" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (active && seen && !still && !document.hidden) el.play().catch(() => {});
    else el.pause();
  }, [active, seen]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden
      className="wc-card-video"
    />
  );
}

export default function WorkCarousel({ id = "work" }: { id?: string }) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const drag = useRef<number | null>(null);
  const swiped = useRef(false);
  const current = items[index].p;

  const go = (d: number) => setIndex((n) => (n + d + items.length) % items.length);

  /* the projects slide round on their own while the row is in view, and
     hold still while someone is pointing at, touching or focused on it */
  const root = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);
  const [held, setHeld] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!seen || held || !motionOn()) return;
    const t = setInterval(() => setIndex((n) => (n + 1) % items.length), 4000);
    return () => clearInterval(t);
  }, [seen, held, index]);

  return (
    <section
      id={id}
      ref={root}
      className="wc"
      aria-label="Projects"
      tabIndex={0}
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(-1);
        if (e.key === "ArrowRight") go(1);
      }}
    >
      {/* the current project, out of focus, as the room behind the cards */}
      <div className="wc-bg" aria-hidden>
        {items.map(({ p, media }, i) =>
          media?.image ? (
            <span key={p.slug} className="wc-bg-img" data-on={i === index ? "" : undefined}>
              <Image src={media.image} alt="" fill sizes="50vw" className="object-cover" />
            </span>
          ) : null
        )}
      </div>

      <div
        className="wc-stage"
        onPointerDown={(e) => {
          drag.current = e.clientX;
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
        onPointerUp={(e) => {
          const from = drag.current;
          drag.current = null;
          if (from !== null && Math.abs(e.clientX - from) > 48) {
            go(e.clientX < from ? 1 : -1);
            /* a swipe ends in a click on whatever is under the finger */
            swiped.current = true;
            setTimeout(() => (swiped.current = false), 60);
          }
        }}
      >
        {items.map(({ p, media }, i) => {
          const o = offset(i, index);
          const front = o === 0;
          return (
            <div
              key={p.slug}
              role="group"
              aria-roledescription="slide"
              aria-label={`${p.title}, ${i + 1} of ${items.length}`}
              className="wc-card"
              data-front={front ? "" : undefined}
              style={{ ["--o" as string]: o, zIndex: front ? 3 : 1 }}
              tabIndex={front ? 0 : undefined}
              onKeyDown={(e) => {
                if (front && e.key === "Enter") router.push(`/work/${p.slug}`);
              }}
              onClick={() => {
                if (swiped.current) return;
                if (front) router.push(`/work/${p.slug}`);
                else setIndex(i);
              }}
            >
              {media?.image ? (
                <Image
                  src={media.image}
                  alt={`Preview of ${p.title}`}
                  fill
                  sizes="(max-width: 640px) 70vw, 340px"
                  className="wc-card-img"
                />
              ) : null}
              {media?.video ? (
                <CardVideo src={media.video} poster={media.image} active={front} />
              ) : null}
              <span className="wc-card-scrim" aria-hidden />
              <span className="wc-card-count">
                {i + 1} / {items.length}
              </span>
              <span className="wc-card-text">
                <span className="wc-card-name">{p.title}</span>
                <span className="wc-card-kind">{p.kind}</span>
              </span>
              {front ? null : (
                <button
                  type="button"
                  className="wc-card-hit"
                  aria-label={`Show ${p.title}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIndex(i);
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="wc-pills" aria-live="polite">
        <span>{current.stack.length} technologies</span>
        <span>{current.year}</span>
        <span>
          <i aria-hidden className="wc-dot" /> {current.status}
        </span>
        <span>{current.role}</span>
      </div>

      <div className="wc-actions">
        <button type="button" className="wc-arrow" aria-label="Previous project" onClick={() => go(-1)}>
          ‹
        </button>
        <Link href={`/work/${current.slug}`} className="wc-open">
          Open case study →
        </Link>
        <a href={current.live} target="_blank" rel="noopener noreferrer" className="wc-live">
          Visit live ↗
        </a>
        <button type="button" className="wc-arrow" aria-label="Next project" onClick={() => go(1)}>
          ›
        </button>
      </div>
    </section>
  );
}
