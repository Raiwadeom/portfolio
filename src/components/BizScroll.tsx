"use client";

import { useEffect, useState } from "react";
import styles from "./biz-scroll.module.css";

/** A thin reading-progress bar at the top and a back-to-top arrow that appears after scrolling. */
export default function BizScroll() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const show = progress > 0.04;

  return (
    <>
      <div className={styles.bar} aria-hidden>
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>
      <button
        type="button"
        className={`${styles.top} ${show ? styles.topOn : ""}`}
        aria-label="Back to top"
        tabIndex={show ? 0 : -1}
        onClick={() =>
          window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })
        }
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
    </>
  );
}
