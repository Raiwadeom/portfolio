"use client";

import { useState } from "react";
import { about } from "@/lib/content";
import { Section, SectionHead, Reveal } from "./ui";
import Badge from "./Badge";

/**
 * About is a landscape page held under a binder clip, with the ID card
 * clipped to it carrying the details. Same ink-on-cream as the licences.
 */
export default function About() {
  /* A phone gets the opening paragraph and a way to ask for the rest, so the
     section arrives as one screenful instead of a column of text. Anything
     wider shows all of it and never sees the toggle. */
  const [all, setAll] = useState(false);

  return (
    <Section id="about">
      <SectionHead label="ABOUT" index="01" right="ONE PAGE" />

      <Reveal className="mt-14 sm:mt-20">
        <div className="paper clipsheet mx-auto max-w-[1240px]">
          <BinderClip />

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_252px] lg:gap-14">
            {/* ── the copy, set in two columns so the page reads landscape ── */}
            <div className="min-w-0">
              <h2 className="hello">{about.hello}</h2>

              <div
                className="clipsheet-body mt-5 gap-x-12 sm:mt-8 md:columns-2"
                data-all={all ? "" : undefined}
              >
                {about.paras.map((t, i) => (
                  <p key={i}>{t}</p>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setAll((v) => !v)}
                aria-expanded={all}
                className="clipsheet-more"
              >
                {all ? "— Less" : "+ Read the rest"}
              </button>

              <div className="hair-rule my-7 sm:my-9" />

              <h3 className="clipsheet-h2">{about.skillsHeading}</h3>

              <div className="mt-5 flex flex-wrap items-start gap-x-12 gap-y-8">
                <ul className="skill-list sm:columns-2 sm:gap-x-10">
                  {about.skills.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--ink)] underline underline-offset-4">
                    Also
                  </span>
                  <div className="mt-4 flex flex-wrap gap-4">
                    {about.rings.map((r) => (
                      <div key={r.label} className="relative">
                        <span className="absolute -top-1 right-0 font-mono text-[9px] text-[var(--ink-soft)]">
                          {r.n}
                        </span>
                        <span className="ring">
                          <span>{r.label}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── the ID card, clipped to the page ── */}
            <div className="justify-self-center lg:justify-self-end">
              <Badge />
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

/** The clip holding the page down. */
function BinderClip() {
  return (
    <svg className="binder-clip" viewBox="0 0 90 74" aria-hidden>
      <defs>
        <linearGradient id="clipWire" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6f757c" />
          <stop offset="0.4" stopColor="#e3e8ec" />
          <stop offset="0.7" stopColor="#959ba2" />
          <stop offset="1" stopColor="#5a5f66" />
        </linearGradient>
        <linearGradient id="clipBody" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor="#33373b" />
          <stop offset="0.5" stopColor="#16191c" />
          <stop offset="1" stopColor="#0b0d0f" />
        </linearGradient>
      </defs>

      {/* the two sprung wire handles */}
      <path
        d="M30 30C30 14 22 6 14 6"
        fill="none"
        stroke="url(#clipWire)"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path
        d="M60 30c0-16 8-24 16-24"
        fill="none"
        stroke="url(#clipWire)"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <circle cx="14" cy="6" r="4.6" fill="none" stroke="url(#clipWire)" strokeWidth="3" />
      <circle cx="76" cy="6" r="4.6" fill="none" stroke="url(#clipWire)" strokeWidth="3" />

      {/* the body */}
      <path d="M16 26h58l6 46H10Z" fill="url(#clipBody)" />
      <path d="M16 26h58l1.4 11H14.6Z" fill="rgba(255,255,255,0.07)" />
    </svg>
  );
}
