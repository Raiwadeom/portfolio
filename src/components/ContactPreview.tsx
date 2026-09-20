"use client";

/** The homepage's teaser of Contact — the CTA and the email, with the full
 *  set of ways to reach out living at /contact. */

import Link from "next/link";
import { profile } from "@/lib/content";
import { Reveal, SectionHead } from "./ui";

export default function ContactPreview() {
  return (
    <section className="relative px-[var(--gutter)] pt-[clamp(72px,12vh,140px)] pb-20 sm:pb-28 overflow-hidden">
      {/* screen glow from below */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%]"
        style={{
          background:
            "radial-gradient(ellipse 70% 100% at 50% 100%, rgba(177,80,47,0.16), transparent 70%)",
        }}
      />

      <SectionHead label="CONTACT" index="06" right="SAY HELLO" />

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
          className="relative group inline-flex items-center gap-3 mt-10 sm:mt-14 border-b border-[var(--color-line)] pb-2 hover:border-[var(--color-amber)] transition-colors"
        >
          <span className="text-[clamp(0.95rem,3vw,1.7rem)] tracking-[0.06em] text-[var(--color-ice)] group-hover:text-[var(--color-amber)] transition-colors">
            {profile.email}
          </span>
          <span className="text-[var(--color-amber)] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
            ↗
          </span>
        </a>
      </Reveal>

      <Reveal delay={200}>
        <Link
          href="/contact"
          className="group relative mt-14 sm:mt-20 flex items-center justify-between gap-6 overflow-hidden border border-[var(--color-line-soft)] px-6 py-6 transition-colors duration-400 hover:bg-[rgba(122,140,92,0.14)] hover:border-[var(--color-amber)] sm:px-8 sm:py-8"
        >
          <span>
            <span className="label !text-[var(--color-amber)]">/ MORE WAYS</span>
            <span className="mt-2 block font-display text-[clamp(1.3rem,5vw,2.1rem)] leading-none text-[var(--color-ice)] transition-colors group-hover:text-[var(--color-amber)]">
              ALL WAYS TO REACH ME
            </span>
          </span>

          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--color-line)] text-[var(--color-amber)] transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:border-[var(--color-amber)] sm:h-14 sm:w-14 sm:text-lg">
            →
          </span>

          {/* hairline that sweeps in on hover */}
          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-[var(--color-amber)] transition-transform duration-500 ease-out group-hover:scale-x-100" />
        </Link>
      </Reveal>
    </section>
  );
}
