"use client";

/**
 * Work with me: what I build (each with a project as proof), how a
 * project runs, and the enquiry form. All text is `hire` in content.ts.
 */

import Link from "next/link";
import { hire, profile } from "@/lib/content";
import { Reveal, Section, SectionHead } from "./ui";
import ContactForm from "./ContactForm";

export function Availability() {
  return (
    <span className="inline-flex items-center gap-2.5 rounded-full border border-[var(--color-line)] bg-[var(--color-void)] px-3.5 py-1.5">
      <span className="relative flex h-2 w-2" aria-hidden>
        {hire.open ? (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#5f8a3c] opacity-60 motion-reduce:animate-none" />
        ) : null}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${hire.open ? "bg-[#5f8a3c]" : "bg-[var(--color-dim)]"}`} />
      </span>
      <span className="label !text-[var(--color-ice)]">{hire.open ? hire.openText : hire.closedText}</span>
    </span>
  );
}

export default function Hire() {
  return (
    <>
      {/* ── intro ── */}
      <section className="relative px-[var(--gutter)] pt-[clamp(110px,16vh,180px)]">
        <Reveal>
          <Availability />
        </Reveal>
        <Reveal delay={80}>
          <h1 className="display mt-8 text-[clamp(2.8rem,13vw,9rem)] leading-[0.88] text-[var(--color-ice)]">
            Work
            <br />
            <span className="outline-text">with</span> me
          </h1>
        </Reveal>
        <Reveal delay={140}>
          <p className="mt-8 max-w-[52ch] text-[15px] leading-relaxed text-[var(--color-dim)] sm:text-[17px]">
            {hire.intro}
          </p>
        </Reveal>
      </section>

      {/* ── services ── */}
      <Section id="services">
        <SectionHead label="WHAT I BUILD" index="01" right={`(${hire.services.length} SERVICES)`} />
        <ul className="mt-10 grid border-l border-t border-[var(--color-line-soft)] sm:mt-14 sm:grid-cols-2">
          {hire.services.map((s, i) => (
            <li key={s.title} className="border-b border-r border-[var(--color-line-soft)]">
              <Reveal delay={i * 70} className="flex h-full flex-col p-5 sm:p-8">
                <span className="label !text-[var(--color-amber)]">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="display mt-4 text-[clamp(1.7rem,5vw,2.6rem)] leading-none text-[var(--color-ice)]">{s.title}</h2>
                <p className="mt-4 flex-1 text-[14.5px] leading-relaxed text-[var(--color-dim)]">{s.body}</p>
                {s.proof ? (
                  <Link
                    href={s.proof.href}
                    className="group mt-6 inline-flex items-center gap-2 self-start border-b border-[var(--color-line)] pb-1 transition-colors hover:border-[var(--color-amber)]"
                  >
                    <span className="label">Proof:</span>
                    <span className="label !text-[var(--color-ice)] group-hover:!text-[var(--color-amber)]">{s.proof.label} →</span>
                  </Link>
                ) : null}
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── process ── */}
      <Section id="process" className="!pt-0">
        <SectionHead label="HOW IT WORKS" index="02" right="FOUR STEPS" />
        <ol className="mt-10 grid gap-px overflow-hidden border border-[var(--color-line-soft)] bg-[var(--color-line-soft)] sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
          {hire.process.map((p, i) => (
            <li key={p.step} className="bg-[var(--color-deep)]">
              <Reveal delay={i * 90} className="h-full p-5 sm:p-7">
                <span className="label">STEP {i + 1}</span>
                <h3 className="display mt-3 flex items-center gap-3 text-[clamp(1.8rem,4vw,2.4rem)] leading-none text-[var(--color-ice)]">
                  {p.step}
                  {i < hire.process.length - 1 ? (
                    <span aria-hidden className="text-[0.6em] text-[var(--color-amber)]">→</span>
                  ) : null}
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-dim)]">{p.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Section>

      {/* ── contact ── */}
      <Section id="enquire" className="!pt-0">
        <SectionHead label="START A PROJECT" index="03" right="REPLY BY EMAIL" />
        <div className="mt-10 grid gap-12 sm:mt-14 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:gap-16">
          <Reveal>
            <p className="m-0 text-[15px] leading-relaxed text-[var(--color-dim)]">
              Tell me about the project, or email me directly:
            </p>
            <a
              href={`mailto:${profile.email}`}
              className="mt-3 inline-block break-all border-b border-[var(--color-line)] pb-1 text-[16px] text-[var(--color-ice)] transition-colors hover:border-[var(--color-amber)] hover:text-[var(--color-amber)]"
            >
              {profile.email} ↗
            </a>
          </Reveal>
          <Reveal delay={80}>
            <ContactForm />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
