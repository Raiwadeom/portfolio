"use client";

/**
 * How many people have been here.
 *
 * The count lives on a free, keyless hit counter (Abacus), so the site stays
 * a static export with no backend of its own. One hit per browser session —
 * sessionStorage stops a refresh from inflating the number — and every
 * subsequent view just reads the total.
 *
 * If the service is unreachable the row simply doesn't render; a portfolio
 * should never show a broken counter.
 */

import { useEffect, useRef, useState } from "react";
import { visitors } from "@/lib/content";
import { motionOn } from "@/lib/motion";

const SEEN = "om-visited";

export default function Visitors() {
  const [count, setCount] = useState<number | null>(null);
  const [shown, setShown] = useState(0);
  const raf = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!visitors.namespace || !visitors.key) return;

    let counted = false;
    try {
      counted = sessionStorage.getItem(SEEN) === "1";
    } catch {
      /* private mode — count the visit, it is the honest default */
    }

    const base = `https://abacus.jasoncameron.dev/${counted ? "get" : "hit"}/${visitors.namespace}/${visitors.key}`;

    fetch(base)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (typeof d?.value !== "number") return;
        setCount(d.value);
        try {
          sessionStorage.setItem(SEEN, "1");
        } catch {
          /* nothing to do — the count is already shown */
        }
      })
      .catch(() => {
        /* leave the row out rather than show a broken number */
      });
  }, []);

  /* count up to the real number rather than just popping it in */
  useEffect(() => {
    if (count === null) return;
    if (!motionOn()) {
      setShown(count);
      return;
    }
    const duration = 1200;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(Math.round(count * eased));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [count]);

  if (count === null) return null;

  return (
    <span className="visit-counter">
      <span className="visit-dot" aria-hidden />
      <span className="visit-counter-num">{shown.toLocaleString()}</span>
      <span className="visit-counter-label">visits, and counting</span>
    </span>
  );
}
