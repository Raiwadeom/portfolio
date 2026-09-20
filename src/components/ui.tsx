"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${delay}ms`;
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}

/** Splits text into one span per character, each with its own reveal delay
    baked in as a custom property — the cascade a plain fade can't give. */
function Chars({ text, startDelay = 0 }: { text: string; startDelay?: number }) {
  return (
    <>
      {text.split("").map((ch, i) => (
        <span
          key={i}
          className="sectionhead-char"
          style={{ ["--d" as string]: `${startDelay + i * 26}ms` }}
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </>
  );
}

export function SectionHead({
  label,
  index,
  right,
}: {
  label: string;
  index: string;
  right?: string;
}) {
  const rightText = right ?? `(${index})`;
  return (
    <Reveal>
      <div className="sectionhead relative flex items-baseline justify-between border-b border-[var(--color-line-soft)] pb-3">
        <span className="label sectionhead-name">
          <span className="sectionhead-dot" aria-hidden />/{" "}
          <Chars text={label} />
        </span>
        <span className="label sectionhead-name sectionhead-name--right">
          <Chars text={rightText} startDelay={label.length * 26 + 100} />
        </span>
        <span className="sectionhead-sweep" aria-hidden />
      </div>
    </Reveal>
  );
}

export function Section({
  id,
  children,
  className = "",
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`relative px-[var(--gutter)] py-[clamp(72px,12vh,140px)] ${className}`}
    >
      {children}
    </section>
  );
}
