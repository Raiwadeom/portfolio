"use client";

/**
 * The nav bar.
 *
 * A dark rounded bar of icons with a small indicator riding the edge that
 * faces the page. The bar is at the top here, so the indicator sits along the
 * bottom — the same relationship the reference has with a bottom bar.
 *
 * One bar at every width: icons are compact enough for a phone, and the name
 * of the section under the bar does the job labels would.
 */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { nav } from "@/lib/content";
import { scrollToId, scrollToTop } from "@/lib/smooth";
import Mark from "./Mark";

/** work and contact are real pages now; about and services are still
 *  anchors on the one-page scroll. */
const ROUTED = new Set(["work", "contact"]);

export default function Chrome() {
  const pathname = usePathname();
  const router = useRouter();
  const onHome = pathname === "/";

  const [active, setActive] = useState(() => {
    const routed = pathname.split("/")[1];
    return ROUTED.has(routed) ? routed : nav[0].id;
  });
  const [hovered, setHovered] = useState<string | null>(null);
  const [lifted, setLifted] = useState(false);

  const row = useRef<HTMLDivElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  const progress = useRef<HTMLSpanElement>(null);

  /* Which section is under the reader — the routed pages only ever have
     the one section, so this just confirms what the pathname already set. */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    nav.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [pathname]);

  /* Progress goes straight to the transform — through state it would
     re-render the whole bar every frame. */
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
        if (progress.current) progress.current.style.transform = `scaleX(${p})`;
        setLifted(window.scrollY > window.innerHeight * 0.5);
        frame = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  /* The indicator follows the pointer, and falls back to the live section. */
  useLayoutEffect(() => {
    const id = hovered ?? active;
    const el = row.current?.querySelector<HTMLElement>(`[data-nav="${id}"]`);
    const bar = indicator.current;
    if (!el || !bar) return;
    bar.style.opacity = "1";
    /* the CSS breathing animation owns `transform` (it reads this custom
       property), so the position is handed over through a variable rather
       than written to transform directly, which an animation would win over
       anyway. */
    bar.style.setProperty("--x", `${el.offsetLeft + el.offsetWidth / 2}px`);
  }, [hovered, active]);

  const shown = nav.find((n) => n.id === (hovered ?? active)) ?? nav[0];

  return (
    <>
      {/* reading progress, hairline across the very top */}
      <span
        ref={progress}
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-[55] h-px origin-left"
        style={{
          transform: "scaleX(0)",
          background: "linear-gradient(90deg, rgba(255,255,255,0.2), var(--color-amber))",
        }}
      />

      {/* the mark, riding the corner the way a signature would */}
      <div className="pointer-events-auto fixed left-[var(--gutter)] top-3 sm:top-4 z-50">
        <button
          type="button"
          onClick={() => (onHome ? scrollToTop() : router.push("/"))}
          aria-label="Back to top"
          className="brand-mark"
        >
          <Mark size={28} />
          <span className="brand-mark-text">mrushikesh</span>
        </button>
      </div>

      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex flex-col items-center px-[var(--gutter)] pt-3 sm:pt-4">
        <nav
          className={`navbar pointer-events-auto ${lifted ? "is-lifted" : ""}`}
          onMouseLeave={() => setHovered(null)}
        >
          <div ref={row} className="relative flex items-center">
            {/* a soft spotlight sitting behind the icons, not a line riding
                the edge — rendered first so it stacks underneath them. The
                outer span carries the position (a smooth transition), the
                inner one just breathes in place, so the two motions never
                fight over the same transform. */}
            <span ref={indicator} aria-hidden className="navbar-indicator">
              <span className="navbar-indicator-glow" />
            </span>

            {nav.map((item) => {
              const on = active === item.id;
              return (
                <button
                  key={item.id}
                  data-nav={item.id}
                  onClick={() => {
                    if (ROUTED.has(item.id)) router.push(`/${item.id}`);
                    else if (onHome) scrollToId(item.id);
                    else router.push(`/#${item.id}`);
                  }}
                  onMouseEnter={() => setHovered(item.id)}
                  onFocus={() => setHovered(item.id)}
                  onBlur={() => setHovered(null)}
                  aria-label={item.label}
                  aria-current={on ? "true" : undefined}
                  className={`navbar-item ${on ? "is-on" : ""}`}
                >
                  <NavIcon name={item.icon} on={on} />
                </button>
              );
            })}
          </div>
        </nav>

        {/* the label the icons don't carry */}
        <span key={shown.id} className="navbar-caption pointer-events-none">
          {shown.label}
        </span>
      </header>
    </>
  );
}

/* ---------- glyphs ---------- */

function NavIcon({ name, on }: { name: string; on: boolean }) {
  const p = {
    width: 19,
    height: 19,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: on ? 1.9 : 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "user":
      return (
        <svg {...p}>
          <circle cx="12" cy="8" r="3.6" />
          <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
        </svg>
      );
    case "spark":
      return (
        <svg {...p}>
          <path d="M12 3.2 14 9.1l5.9 2-5.9 2-2 5.9-2-5.9-5.9-2 5.9-2Z" />
        </svg>
      );
    case "grid":
      return (
        <svg {...p}>
          <rect x="3.6" y="3.6" width="7" height="7" rx="1.5" />
          <rect x="13.4" y="3.6" width="7" height="7" rx="1.5" />
          <rect x="3.6" y="13.4" width="7" height="7" rx="1.5" />
          <rect x="13.4" y="13.4" width="7" height="7" rx="1.5" />
        </svg>
      );
    default:
      return (
        <svg {...p}>
          <rect x="3" y="5.5" width="18" height="13" rx="2.4" />
          <path d="m3.9 7 8.1 6 8.1-6" />
        </svg>
      );
  }
}
