"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { nav, links } from "@/lib/content";
import { scrollToId } from "@/lib/smooth";

export default function Chrome() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const [hovered, setHovered] = useState<string | null>(null);
  const [lifted, setLifted] = useState(false);

  const navRow = useRef<HTMLDivElement>(null);
  const pill = useRef<HTMLSpanElement>(null);
  const progress = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Which section is under the reader.
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
  }, []);

  /* Scroll progress is written straight to the element's transform inside the
     rAF callback — putting it through React state would re-render the whole
     bar every frame. */
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
        if (progress.current) progress.current.style.transform = `scaleX(${p})`;
        setLifted(window.scrollY > window.innerHeight * 0.55);
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

  /* The highlight follows the pointer, and falls back to the active section. */
  useLayoutEffect(() => {
    const id = hovered ?? active;
    const el = navRow.current?.querySelector<HTMLElement>(`[data-nav="${id}"]`);
    if (!el || !pill.current) {
      if (pill.current) pill.current.style.opacity = "0";
      return;
    }
    pill.current.style.opacity = "1";
    pill.current.style.transform = `translateX(${el.offsetLeft}px)`;
    pill.current.style.width = `${el.offsetWidth}px`;
  }, [hovered, active]);

  // Lock the page behind the mobile sheet.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    setTimeout(() => scrollToId(id), open ? 260 : 0);
  };

  return (
    <>
      {/* reading progress, hairline across the very top */}
      <span
        ref={progress}
        aria-hidden
        className="fixed top-0 left-0 right-0 h-px z-[55] origin-left pointer-events-none"
        style={{
          transform: "scaleX(0)",
          background:
            "linear-gradient(90deg, rgba(143,214,255,0.25), var(--color-cyan))",
        }}
      />

      <header className="fixed top-0 inset-x-0 z-50 flex justify-center px-[var(--gutter)] pt-3 sm:pt-4 pointer-events-none">
        <div
          className={`pointer-events-auto relative flex items-center rounded-full border px-1.5 py-1.5 transition-[background-color,border-color,box-shadow] duration-500 ${
            lifted
              ? "bg-[rgba(7,15,32,0.82)] border-[rgba(143,214,255,0.28)] shadow-[0_10px_40px_-12px_rgba(31,79,255,0.55)]"
              : "bg-[rgba(7,15,32,0.42)] border-[rgba(143,214,255,0.14)]"
          }`}
          style={{
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
          }}
        >
          {/* light catching the top edge of the capsule */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-6 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(143,214,255,0.55), transparent)",
            }}
          />

          {/* desktop nav */}
          <div
            ref={navRow}
            className="relative hidden lg:flex items-center"
            onMouseLeave={() => setHovered(null)}
          >
            {/* highlight that slides between items */}
            <span
              ref={pill}
              aria-hidden
              className="absolute left-0 top-0 bottom-0 rounded-full bg-[rgba(31,79,255,0.3)] border border-[rgba(143,214,255,0.34)] opacity-0 transition-[transform,width,opacity] duration-[450ms] ease-out"
            />

            {nav.map((item) => {
              const on = active === item.id || hovered === item.id;
              return (
                <button
                  key={item.id}
                  data-nav={item.id}
                  onClick={() => go(item.id)}
                  onMouseEnter={() => setHovered(item.id)}
                  onFocus={() => setHovered(item.id)}
                  onBlur={() => setHovered(null)}
                  className={`relative z-10 px-4 py-1.5 rounded-full text-[10px] tracking-[0.18em] uppercase whitespace-nowrap transition-colors duration-300 ${
                    on ? "text-[var(--color-ice)]" : "text-[var(--color-dim)]"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* phone / tablet toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Menu"
            className="lg:hidden flex items-center gap-2.5 px-3.5 py-1 rounded-full active:scale-95 transition-transform"
          >
            <span className="flex flex-col gap-[3px] w-3.5">
              <span
                className={`h-px bg-[var(--color-cyan)] transition-transform duration-300 ${open ? "translate-y-[4px] rotate-45" : ""}`}
              />
              <span
                className={`h-px bg-[var(--color-cyan)] transition-opacity duration-300 ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`h-px bg-[var(--color-cyan)] transition-transform duration-300 ${open ? "-translate-y-[4px] -rotate-45" : ""}`}
              />
            </span>
            <span className="label !text-[9px] !text-[var(--color-ice)]">
              {open ? "CLOSE" : "MENU"}
            </span>
          </button>
        </div>
      </header>

      {/* mobile sheet */}
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-[var(--color-void)] transition-opacity duration-400 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="h-full overflow-y-auto flex flex-col justify-center px-[var(--gutter)] pt-24 pb-12">
          <nav className="border-t border-[var(--color-line-soft)]">
            {nav.map((item, i) => (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                style={{ transitionDelay: open ? `${90 + i * 40}ms` : "0ms" }}
                className={`group w-full flex items-baseline gap-4 border-b border-[var(--color-line-soft)] py-3 text-left transition-all duration-500 ${
                  open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                }`}
              >
                <span className="label w-7 shrink-0">{item.n}</span>
                <span className="display text-[clamp(1.5rem,7vw,3rem)] font-medium text-[var(--color-ice)]">
                  {item.label}
                </span>
              </button>
            ))}
          </nav>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="label hover:!text-[var(--color-cyan)] transition-colors"
              >
                {l.label} ↗
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
