"use client";

/**
 * The Orbit mark: a ring with a comet swinging around it. The ring draws
 * itself in once, the first time it enters view; the comet then fades in
 * and keeps orbiting forever, slow and quiet, so the mark stays alive
 * without shouting. Resting state (no JS, or `data-motion="off"`) is the
 * ring plus a static comet — nothing spins, nothing is missing.
 */

import { useEffect, useRef, useState } from "react";
import { motionOn } from "@/lib/motion";

export default function Mark({
  size = 64,
  className = "",
  replay = false,
}: {
  size?: number;
  className?: string;
  /** Redraw every time it re-enters view, not just the first. For a mark
   *  that's always on screen (e.g. fixed in a header) this would just
   *  fight itself, so it's opt-in — the footer signature turns it on. */
  replay?: boolean;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const [armed, setArmed] = useState(false);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    if (!motionOn()) return;
    setArmed(true);

    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // replay from scratch every time it re-enters, not just the first
          setDrawing(false);
          requestAnimationFrame(() => requestAnimationFrame(() => setDrawing(true)));
          if (!replay) io.disconnect();
        } else if (replay) {
          setDrawing(false);
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [replay]);

  const cls = `mark ${armed ? "mark-armed" : ""} ${drawing ? "is-drawing" : ""} ${className}`;

  return (
    <svg
      ref={ref}
      className={cls}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden
    >
      <circle className="mark-ring" cx="50" cy="50" r="27" pathLength={1} />

      <g className="mark-orbit">
        <ellipse
          className="mark-orbit-path"
          cx="50"
          cy="50"
          rx="47"
          ry="18"
          transform="rotate(-28 50 50)"
          pathLength={1}
        />
        <circle className="mark-orbit-head" cx="91.5" cy="27.9" r="4.6" />
      </g>
    </svg>
  );
}
