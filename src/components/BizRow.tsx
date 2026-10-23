"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./biz-row.module.css";

/** A sideways-scrolling row with back/forward arrows and a visible scrollbar. */
export default function BizRow({
  children,
  label,
  gridOnDesktop = false,
  className,
}: {
  children: React.ReactNode;
  label: string;
  /** Keep a wrapping grid on wide screens; the arrows and scrollbar only show on phones. */
  gridOnDesktop?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const go = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * Math.max(240, el.clientWidth * 0.8), behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div className={`${styles.wrap} ${gridOnDesktop ? styles.gridDesktop : ""}`}>
      <div className={styles.arrows}>
        <button type="button" onClick={() => go(-1)} disabled={edge.start} aria-label={`${label}: scroll back`}>
          ←
        </button>
        <button type="button" onClick={() => go(1)} disabled={edge.end} aria-label={`${label}: scroll forward`}>
          →
        </button>
      </div>
      <ul ref={ref} className={`${styles.row} ${className ?? ""}`} onScroll={measure} aria-label={label} tabIndex={0}>
        {children}
      </ul>
    </div>
  );
}
