"use client";

/**
 * The stack, on three wheels.
 *
 * Each group turns on its own cylinder: the item in the middle is sharp and
 * marked with an arrow, the ones above and below tilt away and blur out. The
 * wheels turn by themselves and hold still while you hover one.
 *
 * The wheels step rather than scroll — a step every couple of seconds, eased
 * — so the blur is recomputed a handful of times a minute instead of every
 * frame. The timers stop entirely while the section is off screen.
 */

import { useEffect, useRef, useState } from "react";
import { stack } from "@/lib/content";
import { motionOn } from "@/lib/motion";
import { Section, SectionHead } from "./ui";

const STEP_MS = 2200;

/** Each column gets its own accent, rather than every wheel sharing the
 *  one site accent — frontend rust, backend sage, tooling dusty blue. */
const TINTS = ["#b1502f", "#7a8a5a", "#5b7690"];

export default function Stack() {
  const scope = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState<number[]>(() => stack.map((_, i) => i));
  const [held, setHeld] = useState<number | null>(null);
  const [live, setLive] = useState(false);

  /* Nothing turns while the section is off screen. */
  useEffect(() => {
    const el = scope.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), {
      rootMargin: "10% 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!live || !motionOn()) return;

    const id = setInterval(() => {
      setAt((prev) => prev.map((n, g) => (held === g ? n : n + 1)));
    }, STEP_MS);

    return () => clearInterval(id);
  }, [live, held]);

  return (
    <Section id="stack" className="overflow-hidden">
      <SectionHead label="STACK" index="04" right="(04)" />

      <div ref={scope} className="wheels">
        {stack.map((group, g) => {
          const n = group.items.length;
          const cursor = ((at[g] % n) + n) % n;

          return (
            <div
              key={group.group}
              className="wheel-col"
              style={{ ["--tint" as string]: TINTS[g % TINTS.length] }}
              onPointerEnter={() => setHeld(g)}
              onPointerLeave={() => setHeld(null)}
            >
              <div className="wheel-tag">
                <span className="label" style={{ color: "var(--tint)" }}>
                  {group.n}
                </span>
                <span className="label">{group.group}</span>
              </div>

              <div className="wheel" role="list" aria-label={group.group}>
                {group.items.map((item, i) => {
                  /* shortest way round the wheel */
                  let o = (i - cursor) % n;
                  if (o > n / 2) o -= n;
                  if (o < -n / 2) o += n;
                  if (Math.abs(o) > 2) return null;

                  const far = Math.abs(o);
                  return (
                    <span
                      key={item}
                      role="listitem"
                      className="wheel-item"
                      data-on={o === 0 ? "" : undefined}
                      aria-hidden={o !== 0}
                      style={{
                        transform: `translate(-50%, -50%) translateY(calc(${o} * var(--rise))) translateZ(${-far * 34}px) rotateX(${o * -26}deg)`,
                        opacity: o === 0 ? 1 : 0.42 - far * 0.11,
                        filter: o === 0 ? "none" : `blur(${far * 1.7}px)`,
                      }}
                    >
                      <svg className="wheel-arrow" viewBox="0 0 24 24" aria-hidden>
                        <path
                          d="M3 12h17M14 6l6 6-6 6"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="wheel-word">{item}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
