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

import { useEffect, useState } from "react";
import { visitors } from "@/lib/content";

const SEEN = "om-visited";

export default function Visitors() {
  const [count, setCount] = useState<number | null>(null);

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

  if (count === null) return null;

  return (
    <span className="label flex items-center gap-2">
      <span className="visit-dot" aria-hidden />
      {count.toLocaleString()} VISITS
    </span>
  );
}
