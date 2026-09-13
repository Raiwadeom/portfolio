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

export function SectionHead({
  label,
  index,
  right,
}: {
  label: string;
  index: string;
  right?: string;
}) {
  return (
    <Reveal>
      <div className="flex items-baseline justify-between border-b border-[var(--color-line-soft)] pb-3">
        <span className="label !text-[var(--color-cyan)]">/ {label}</span>
        <span className="label">{right ?? `(${index})`}</span>
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
