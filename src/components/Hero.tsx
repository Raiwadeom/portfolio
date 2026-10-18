"use client";

/**
 * The cover.
 *
 * A red race-mode scene: the car sits on the right, its engine firing nitro
 * blasts with smoke trailing off the back, streaks rushing past behind it
 * and a halftone ghost headline sliding underneath. The copy sits on the left
 * 
 */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { profile, projects } from "@/lib/content";
import NitroCanvas from "./NitroCanvas";
import { scrollToId } from "@/lib/smooth";

/* streaks rushing past: [top %, length vw, duration s, delay s, opacity] */
const streaks: [number, number, number, number, number][] = [
  [12, 22, 2.1, 0, 0.35],
  [21, 34, 1.6, 0.7, 0.25],
  [30, 18, 2.4, 1.3, 0.3],
  [41, 28, 1.8, 0.2, 0.22],
  [52, 40, 1.5, 1.0, 0.3],
  [63, 20, 2.2, 0.5, 0.25],
  [72, 32, 1.7, 1.6, 0.35],
  [81, 24, 2.0, 0.9, 0.22],
  [89, 36, 1.4, 0.3, 0.28],
];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [off, setOff] = useState(false);

  /* the cover's animations pause once it has scrolled out of view */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOff(!e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="hero" className="hero" ref={ref} data-off={off ? "" : undefined}>
      <div className="hero-glow" aria-hidden />

      {/* halftone ghost headline, sliding slowly */}
      <div className="hero-ghost" aria-hidden>
        <span>FULL THROTTLE · FULL THROTTLE · FULL THROTTLE ·</span>
        <span>BUILT TO RACE · BUILT TO RACE · BUILT TO RACE ·</span>
      </div>

      <div className="hero-streaks" aria-hidden>
        {streaks.map(([top, len, dur, delay, o], k) => (
          <span
            key={k}
            style={{
              top: `${top}%`,
              width: `${len}vw`,
              opacity: o,
              animationDuration: `${dur}s`,
              animationDelay: `${delay}s`,
            }}
          />
        ))}
      </div>

      {/* the car and its fire */}
      <div className="hero-car">
        <div className="hero-car-shake">
          <Image
            src="/hero/f1-car-4k.webp"
            alt=""
            width={3840}
            height={1541}
            priority
            sizes="(max-width: 768px) 160vw, 80vw"
            className="hero-car-img"
          />
          <NitroCanvas />
        </div>
      </div>

      <div className="hero-copy">
        <p className="hero-kicker">
          <span aria-hidden>|</span> {profile.name} — web studio
        </p>
        <h1 className="hero-title">
          We build websites
          <br />
          that race ahead.
        </h1>
        <p className="hero-stars">
          <span aria-hidden className="text-[#ffd9a0]">
            ★★★★★
          </span>
          <span>{projects.length} products live</span>
        </p>
        <div className="hero-cta">
          <a
            href="#about"
            className="hero-btn hero-btn--dark"
            onClick={(e) => {
              e.preventDefault();
              scrollToId("about");
            }}
          >
            Portfolio
            <span aria-hidden className="hero-btn-dot">
              ↓
            </span>
          </a>
          <Link href="/business" className="hero-btn hero-btn--glass">
            Business
            <span aria-hidden> →</span>
          </Link>
        </div>
        <p className="hero-lanes">
          <span>Portfolio: about me and my work</span>
          <span>Business: what I can build for you</span>
        </p>
      </div>
    </section>
  );
}
