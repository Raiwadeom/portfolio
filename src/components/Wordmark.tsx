"use client";

/**
 * The signature: the Orbit mark in front, the name set quietly beside it —
 * lowercase, two lines, lifting in once the strip scrolls into view.
 */

import { useEffect, useRef, useState } from "react";
import Mark from "./Mark";

export default function Wordmark({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // replay from scratch every time it re-enters, not just the first
          setInView(false);
          requestAnimationFrame(() => requestAnimationFrame(() => setInView(true)));
        } else {
          setInView(false);
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const words = text.toLowerCase().split(" ");

  return (
    <div ref={ref} className={`signature ${inView ? "is-in" : ""}`}>
      <Mark className="signature-mark" size={60} replay />
      <span className="signature-name">
        {words.map((w, i) => (
          <span key={w} className="signature-line" style={{ transitionDelay: `${140 + i * 90}ms` }}>
            {w}
          </span>
        ))}
      </span>
    </div>
  );
}
