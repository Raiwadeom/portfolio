"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { projects } from "@/lib/content";
import { Section, SectionHead } from "./ui";
import { motionOn } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Work() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]");
      if (!cards.length) return;

      if (!motionOn()) {
        gsap.set(cards, { clearProps: "all" });
        return;
      }

      cards.forEach((card, i) => {
        const inner = card.querySelector<HTMLElement>("[data-card-inner]");
        const rule = card.querySelector<HTMLElement>("[data-rule]");
        const bits = gsap.utils.toArray<HTMLElement>("[data-bit]", card);

        // Card lifts and settles as it enters.
        gsap.fromTo(
          inner,
          { yPercent: 14, opacity: 0, scale: 0.985 },
          {
            yPercent: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            delay: (i % 2) * 0.08,
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              once: true,
            },
          }
        );

        // Contents stagger in just behind the card.
        gsap.fromTo(
          bits,
          { y: 18, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.07,
            delay: 0.12 + (i % 2) * 0.08,
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              once: true,
            },
          }
        );

        // The hairline under the meta row draws itself.
        gsap.fromTo(
          rule,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.1,
            ease: "power2.out",
            delay: 0.25,
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              once: true,
            },
          }
        );

        // Gentle parallax drift while the card crosses the viewport.
        gsap.fromTo(
          inner,
          { y: 26 },
          {
            y: -26,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.1,
            },
          }
        );
      });
    },
    { scope }
  );

  return (
    <Section id="work">
      <SectionHead label="SELECTED WORK" index="03" />

      <div
        ref={scope}
        className="mt-10 sm:mt-14 grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3"
      >
        {projects.map((p) => (
          <div key={p.n} data-card>
            <article
              data-card-inner
              className="group relative h-full flex flex-col border border-[var(--color-line-soft)] bg-[rgba(8,16,34,0.5)] p-5 sm:p-7 overflow-hidden transition-colors duration-500 hover:border-[rgba(143,214,255,0.32)] will-change-transform"
            >
              {/* hover wash */}
              <span
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{
                  background:
                    "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(47,107,255,0.2), transparent 70%)",
                }}
              />

              <div
                data-bit
                className="relative flex items-start justify-between gap-4"
              >
                <span className="label !text-[var(--color-cyan)]">{p.n}</span>
                <span className="label">{p.year}</span>
              </div>

              <h3
                data-bit
                className="relative display font-bold text-[clamp(1.35rem,4.2vw,2.1rem)] mt-6 text-[var(--color-ice)] group-hover:text-[var(--color-cyan)] transition-colors duration-300"
              >
                {p.title}
              </h3>

              <p
                data-bit
                className="relative mt-3 text-[12.5px] sm:text-[13px] leading-relaxed text-[var(--color-dim)]"
              >
                {p.blurb}
              </p>

              <div data-bit className="relative mt-5 flex flex-wrap gap-2">
                {p.stack.map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>

              <div className="relative mt-auto pt-7">
                <span
                  data-rule
                  className="block h-px w-full bg-[var(--color-line-soft)] origin-left"
                />
                <div
                  data-bit
                  className="flex items-center gap-5 pt-4"
                >
                  <span className="label">{p.role}</span>
                  <span className="ml-auto flex gap-4">
                    {p.live ? (
                      <a
                        href={p.live}
                        target="_blank"
                        rel="noreferrer"
                        className="label hover:!text-[var(--color-cyan)] transition-colors"
                      >
                        LIVE ↗
                      </a>
                    ) : null}
                    {p.repo ? (
                      <a
                        href={p.repo}
                        target="_blank"
                        rel="noreferrer"
                        className="label hover:!text-[var(--color-cyan)] transition-colors"
                      >
                        CODE ↗
                      </a>
                    ) : null}
                  </span>
                </div>
              </div>
            </article>
          </div>
        ))}
      </div>
    </Section>
  );
}
