"use client";

import { profile, links } from "@/lib/content";
import { Reveal } from "./ui";

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative px-[var(--gutter)] pt-[clamp(72px,12vh,140px)] pb-20 sm:pb-28 overflow-hidden"
    >
      {/* screen glow from below */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%]"
        style={{
          background:
            "radial-gradient(ellipse 70% 100% at 50% 100%, rgba(31,79,255,0.24), transparent 70%)",
        }}
      />

      <Reveal>
        <div className="relative flex items-baseline justify-between border-b border-[var(--color-line-soft)] pb-3">
          <span className="label !text-[var(--color-cyan)]">/ CONTACT</span>
          <span className="label">(06)</span>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <h2 className="relative mt-12 sm:mt-20 display font-black text-[clamp(2.4rem,12vw,10rem)] leading-[0.88] text-[var(--color-ice)]">
          LET&rsquo;S
          <br />
          <span className="outline-text">BUILD</span> IT
        </h2>
      </Reveal>

      <Reveal delay={140}>
        <a
          href={`mailto:${profile.email}`}
          className="relative group inline-flex items-center gap-3 mt-10 sm:mt-14 border-b border-[var(--color-line)] pb-2 hover:border-[var(--color-cyan)] transition-colors"
        >
          <span className="text-[clamp(0.95rem,3vw,1.7rem)] tracking-[0.06em] text-[var(--color-ice)] group-hover:text-[var(--color-cyan)] transition-colors">
            {profile.email}
          </span>
          <span className="text-[var(--color-cyan)] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
            ↗
          </span>
        </a>
      </Reveal>

      {/* compact link cards — label, handle, and somewhere to click */}
      <div className="relative mt-14 sm:mt-20 grid sm:grid-cols-3 border-t border-l border-[var(--color-line-soft)]">
        {links.map((l, i) => (
          <Reveal key={l.label} delay={i * 70}>
            <a
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="group relative h-full flex flex-col justify-between gap-3 sm:gap-6 border-b border-r border-[var(--color-line-soft)] px-4 sm:px-5 py-3.5 sm:py-5 overflow-hidden hover:bg-[rgba(20,50,120,0.14)] transition-colors duration-400"
            >
              <span className="flex items-center justify-between gap-3">
                <span className="label group-hover:!text-[var(--color-cyan)] transition-colors">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[13px] text-[var(--color-dim)] group-hover:text-[var(--color-cyan)] transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  ↗
                </span>
              </span>

              <span>
                <span className="block font-display font-bold text-[13px] sm:text-[15px] tracking-[0.1em] text-[var(--color-ice)] group-hover:text-[var(--color-cyan)] transition-colors">
                  {l.label}
                </span>
                <span className="block mt-1 text-[11px] tracking-[0.06em] text-[var(--color-dim)]">
                  {l.handle}
                </span>
              </span>

              {/* hairline that draws in on hover */}
              <span className="pointer-events-none absolute left-0 bottom-0 h-px w-full origin-left scale-x-0 group-hover:scale-x-100 bg-[var(--color-cyan)] transition-transform duration-500 ease-out" />
            </a>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <footer className="relative mt-16 sm:mt-24 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-line-soft)] pt-5">
          <span className="label">
            © {new Date().getFullYear()} {profile.name.toUpperCase()}
          </span>
          <span className="label">{profile.location.toUpperCase()}</span>
        </footer>
      </Reveal>
    </section>
  );
}
