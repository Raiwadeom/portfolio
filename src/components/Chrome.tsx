"use client";

/**
 * The nav bar.
 *
 * A liquid-glass pill of icons standing on the left edge, vertically centred.
 * The section you are on is a white pill, and its name appears in a
 * bracketed label beside the bar. The signature sits top-left and a
 * "Get in touch" button top-right.
 *
 * One bar at every width: icons are compact enough for a phone.
 */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { nav } from "@/lib/content";
import { scrollToId, scrollToTop } from "@/lib/smooth";
import Mark from "./Mark";

/** Every section except About is its own page; About is the anchor on
 *  the short home page. */
const ROUTED = new Set(["work", "hire", "contact"]);

export default function Chrome() {
  const pathname = usePathname();
  const router = useRouter();
  const onHome = pathname === "/";

  /* null on the home page's hero: no icon is lit until a section is reached */
  const [active, setActive] = useState<string | null>(() => {
    const routed = pathname.split("/")[1];
    return ROUTED.has(routed) ? routed : null;
  });
  const [hovered, setHovered] = useState<string | null>(null);
  const [lifted, setLifted] = useState(false);

  const row = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const progress = useRef<HTMLSpanElement>(null);

  /* Which section is under the reader — the routed pages only ever have
     the one section, so this just confirms what the pathname already set. */
  useEffect(() => {
    /* only the home page has several sections to follow; elsewhere the footer
       would otherwise light up "Contact" on a page that isn't Contact */
    if (!onHome) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
          /* About scrolled back below the reader: they are on the hero again */
          else if (e.target.id === nav[0].id && e.boundingClientRect.top > 0) setActive(null);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    nav.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [pathname, onHome]);

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

  /* The label rides beside whichever icon is hovered, else the live one. */
  useLayoutEffect(() => {
    const id = hovered ?? active;
    const el = id ? row.current?.querySelector<HTMLElement>(`[data-nav="${id}"]`) : null;
    const tag = label.current;
    if (!tag) return;
    if (!el) {
      tag.style.opacity = "0";
      return;
    }
    tag.style.opacity = "1";
    tag.style.setProperty("--y", `${el.offsetTop + el.offsetHeight / 2}px`);
  }, [hovered, active]);

  const shown = nav.find((n) => n.id === (hovered ?? active));

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

      <div className="pointer-events-auto fixed right-[var(--gutter)] top-3 sm:top-4 z-50">
        <button type="button" onClick={() => router.push("/contact")} className="touch-btn">
          Get in touch
          <span aria-hidden>↗</span>
        </button>
      </div>

      <nav
        aria-label="Sections"
        className={`vnav pointer-events-auto ${lifted ? "is-lifted" : ""}`}
        onMouseLeave={() => setHovered(null)}
      >
        <div ref={row} className="vnav-row">
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
                className={`vnav-item ${on ? "is-on" : ""}`}
              >
                <NavIcon name={item.icon} on={on} />
              </button>
            );
          })}

          <span ref={label} key={shown?.id ?? "none"} aria-hidden className="vnav-label">
            {shown?.label}
          </span>
        </div>
      </nav>
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
    case "case":
      return (
        <svg {...p}>
          <rect x="3" y="7.5" width="18" height="12" rx="2.2" />
          <path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5" />
          <path d="M3 13h18" />
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
