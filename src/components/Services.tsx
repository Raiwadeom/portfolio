"use client";

/**
 * What I do, as a ring of cards turning in 3D. Drag or swipe, use the arrows
 * or the left and right keys, or leave it: it turns on its own while it is on
 * screen. Only transforms animate, so it stays smooth.
 */

import { useEffect, useRef, useState } from "react";
import { services } from "@/lib/content";
import { motionOn } from "@/lib/motion";
import { Section, SectionHead } from "./ui";

export default function Services() {
  /* the four are repeated round the ring so the neighbours show at an angle */
  const slots = [...services, ...services];
  const n = slots.length;
  const count = services.length;
  const [turn, setTurn] = useState(0); // whole steps, can go negative
  const [paused, setPaused] = useState(false);
  const [seen, setSeen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const drag = useRef<number | null>(null);
  const active = ((turn % n) + n) % n;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* turns by itself while in view, unless the visitor is holding it */
  useEffect(() => {
    if (!seen || paused || !motionOn()) return;
    const t = setInterval(() => setTurn((v) => v + 1), 4200);
    return () => clearInterval(t);
  }, [seen, paused]);

  const go = (d: number) => setTurn((v) => v + d);

  return (
    <Section id="services">
      <SectionHead label="WHAT I DO" index="02" right="THE SKILLS" />

      <div
        ref={root}
        className="orbit"
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label="What I do"
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") go(-1);
          if (e.key === "ArrowRight") go(1);
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onPointerDown={(e) => {
          drag.current = e.clientX;
        }}
        onPointerUp={(e) => {
          const from = drag.current;
          drag.current = null;
          if (from !== null && Math.abs(e.clientX - from) > 40) go(e.clientX < from ? 1 : -1);
        }}
      >
        <div className="orbit-stage">
          <ol className="orbit-spin" style={{ transform: `translateZ(calc(var(--r) * -1)) rotateY(${-turn * (360 / n)}deg)` }}>
            {slots.map((s, i) => {
              const on = i === active;
              return (
                <li
                  key={`${s.n}-${i}`}
                  className="orbit-card"
                  data-on={on ? "" : undefined}
                  aria-hidden={on ? undefined : true}
                  style={{ transform: `rotateY(${i * (360 / n)}deg) translateZ(var(--r))` }}
                >
                  <span className="orbit-n">{s.n}</span>
                  <h3>{s.word}</h3>
                  <p>{s.body}</p>
                  <ul>
                    {s.tags.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="orbit-ctrl">
          <button type="button" onClick={() => go(-1)} aria-label="Previous">
            ‹
          </button>
          <span aria-live="polite">
            {String((active % count) + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </span>
          <button type="button" onClick={() => go(1)} aria-label="Next">
            ›
          </button>
        </div>
      </div>
    </Section>
  );
}
