"use client";

/**
 * The library, on the landing page.
 *
 * Three slabs standing in real perspective. The one you are on swings square,
 * comes forward and pops its deck out of the top-right corner.
 *
 * Two ways in, depending on what the reader has:
 *  • pointer — the rig leans towards the cursor and the slab under it opens.
 *  • scroll  — the rig tips as the section crosses the viewport, and on a
 *    phone each slab opens in turn as it reaches the middle of the screen,
 *    so the deck still pops without a hover to trigger it.
 */

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { books, cinema, music } from "@/lib/content";
import { motionOn } from "@/lib/motion";
import { Section, SectionHead, Reveal } from "./ui";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Shelf = {
  id: string;
  k: string;
  v: string;
  tint: string;
  art: string[];
  /** Music has no local artwork, so its deck is pressed rather than printed. */
  vinyl?: string[];
};

const shelves: Shelf[] = [
  {
    id: "music",
    k: "MUSIC",
    v: "What's on repeat, playable on the page.",
    tint: "#1db954",
    art: [],
    vinyl: music.tracks.slice(0, 3).map((t) => t.tint),
  },
  {
    id: "books",
    k: "BOOKS",
    v: "Potter to Dune, comics to rom-coms.",
    tint: "#8b5e34",
    art: books.list.slice(0, 3).map((b) => b.cover),
  },
  {
    id: "cinema",
    k: "FILMS",
    v: "Four picks, tuned in like channels.",
    tint: "#c98a2b",
    art: cinema.favorites.slice(0, 3).map((f) => f.poster),
  },
];

export default function Library() {
  const scope = useRef<HTMLDivElement>(null);
  const rig = useRef<HTMLDivElement>(null);
  const [over, setOver] = useState<string | null>(null);
  /** Set once a pointer actually moves, so scroll doesn't fight the cursor. */
  const pointing = useRef(false);
  /** The lean and the per-card tilt go straight to the DOM through these
      refs, throttled to one write per frame — through React state they
      would re-render the whole rig on every pixel of raw mousemove, which
      is what made the cursor feel like it was dragging the deck instead of
      just tilting it. */
  const leanFrame = useRef(0);
  const tiltFrame = useRef(0);

  useGSAP(
    () => {
      if (!motionOn()) return;

      /* The rig tips as the section crosses, so it never looks like a
         screenshot of itself. */
      gsap.fromTo(
        rig.current,
        { rotateX: 13, y: 40 },
        {
          rotateX: -5,
          y: -20,
          ease: "none",
          scrollTrigger: {
            trigger: scope.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.1,
          },
        }
      );

      /* Each slab drifts at its own rate. This has to move the WRAPPER: the
         slab's own transform is the perspective fan, and GSAP would write
         straight over it. */
      gsap.utils.toArray<HTMLElement>("[data-drift]").forEach((slab, i) => {
        gsap.fromTo(
          slab,
          { y: 34 * (i + 1) },
          {
            y: -26 * (i + 1),
            ease: "none",
            scrollTrigger: {
              trigger: scope.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.3,
            },
          }
        );
      });

      /* Without a pointer, the slab in the middle of the screen is the open
         one — so the decks still pop as you scroll a phone. */
      const io = new IntersectionObserver(
        (entries) => {
          if (pointing.current) return;
          entries.forEach((e) => {
            if (e.isIntersecting) setOver((e.target as HTMLElement).dataset.id ?? null);
          });
        },
        { rootMargin: "-42% 0px -42% 0px" }
      );
      gsap.utils.toArray<HTMLElement>("[data-slab]").forEach((s) => io.observe(s));
      return () => io.disconnect();
    },
    { scope }
  );

  const track = (e: React.MouseEvent<HTMLDivElement>) => {
    pointing.current = true;
    const r = e.currentTarget.getBoundingClientRect();
    const y = ((e.clientX - (r.left + r.width / 2)) / r.width) * 12;
    const x = -((e.clientY - (r.top + r.height / 2)) / r.height) * 8;
    if (leanFrame.current) return;
    leanFrame.current = requestAnimationFrame(() => {
      leanFrame.current = 0;
      rig.current?.style.setProperty("--lx", `${x}deg`);
      rig.current?.style.setProperty("--ly", `${y}deg`);
    });
  };

  return (
    <Section id="library" className="overflow-hidden">
      <SectionHead label="OFF THE CLOCK" index="05" right="THE LIBRARY" />

      <Reveal className="mt-10 sm:mt-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="display m-0 text-[clamp(2.2rem,9vw,5rem)] leading-[0.88] text-[var(--color-ice)]">
            The Library
          </h2>
          <Link
            href="/library"
            className="label border border-[var(--color-line)] px-5 py-3 transition-colors hover:border-[var(--color-amber)] hover:!text-[var(--color-amber)]"
          >
            OPEN ALL THREE →
          </Link>
        </div>
      </Reveal>

      <div
        ref={scope}
        className="lib-stage"
        onMouseMove={track}
        onMouseLeave={() => {
          pointing.current = false;
          rig.current?.style.setProperty("--lx", "0deg");
          rig.current?.style.setProperty("--ly", "0deg");
        }}
      >
        <div
          ref={rig}
          className="lib-rig"
          style={{ ["--lx" as string]: "0deg", ["--ly" as string]: "0deg" }}
        >
          {shelves.map((s, i) => (
            <div key={s.id} data-drift className="lib-drift">
            <Link
              href={`/library#${s.id}`}
              data-slab
              data-id={s.id}
              className="lib-slab"
              data-on={over === s.id ? "" : undefined}
              onPointerEnter={(e) => {
                if (e.pointerType === "mouse") pointing.current = true;
                setOver(s.id);
              }}
              onFocus={() => setOver(s.id)}
              onPointerMove={(e) => {
                /* Real desktop pointer only — a per-card tilt and a glare that
                   follows the cursor, layered on top of the rig's own lean.
                   The rect read forces layout, so it — and the writes that
                   depend on it — are throttled to once per frame rather than
                   once per raw pointer event. */
                if (e.pointerType !== "mouse") return;
                const el = e.currentTarget;
                const { clientX, clientY } = e;
                if (tiltFrame.current) return;
                tiltFrame.current = requestAnimationFrame(() => {
                  tiltFrame.current = 0;
                  const r = el.getBoundingClientRect();
                  const px = (clientX - r.left) / r.width;
                  const py = (clientY - r.top) / r.height;
                  el.style.setProperty("--tx", `${(px - 0.5) * 16}deg`);
                  el.style.setProperty("--ty", `${(0.5 - py) * 12}deg`);
                  el.style.setProperty("--gx", `${px * 100}%`);
                  el.style.setProperty("--gy", `${py * 100}%`);
                });
              }}
              onPointerLeave={(e) => {
                if (e.pointerType !== "mouse") return;
                e.currentTarget.style.setProperty("--tx", "0deg");
                e.currentTarget.style.setProperty("--ty", "0deg");
              }}
              style={{ ["--i" as string]: i - 1 }}
            >
              {/* the deck, popping out of the top-right corner */}
              <span className="lib-deck" aria-hidden>
                {s.vinyl
                  ? s.vinyl.map((tint, k) => (
                      <span key={k} className="lib-card lib-card--disc" style={{ ["--k" as string]: k }}>
                        <Vinyl tint={tint} />
                      </span>
                    ))
                  : s.art.map((src, k) => (
                      <span key={src} className="lib-card" style={{ ["--k" as string]: k }}>
                        <Image src={src} alt="" fill sizes="120px" className="object-cover" />
                      </span>
                    ))}
              </span>

              <span className="lib-face">
                <span className="lib-glare" aria-hidden />
                <span className="lib-bar" aria-hidden style={{ background: s.tint }} />
                <span className="lib-k">{s.k}</span>
                <span className="lib-v">{s.v}</span>
                <span className="lib-go">OPEN →</span>
              </span>
            </Link>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/** A pressed record, for the deck that has no artwork to show. */
function Vinyl({ tint }: { tint: string }) {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
      <circle cx="50" cy="50" r="49" fill="#0b0f0e" />
      {[42, 35, 28].map((r) => (
        <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.09)" />
      ))}
      <circle cx="50" cy="50" r="19" fill={tint} />
      <circle cx="50" cy="50" r="19" fill="none" stroke="rgba(0,0,0,0.3)" />
      <circle cx="50" cy="50" r="3.4" fill="#0b0f0e" />
      <path d="M50 6a44 44 0 0 1 31 13" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="2" />
    </svg>
  );
}
