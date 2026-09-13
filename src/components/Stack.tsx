"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { stack } from "@/lib/content";
import { Section, SectionHead } from "./ui";
import { motionOn } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Stack() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const rows = gsap.utils.toArray<HTMLElement>("[data-row]");
      if (!rows.length || !motionOn()) return;

      rows.forEach((row) => {
        const rule = row.querySelector<HTMLElement>("[data-rule]");
        const chips = gsap.utils.toArray<HTMLElement>("[data-item]", row);
        const head = row.querySelector<HTMLElement>("[data-head]");

        const st = { trigger: row, start: "top 86%", once: true };

        gsap.fromTo(
          rule,
          { scaleX: 0 },
          { scaleX: 1, duration: 1.1, ease: "power3.out", scrollTrigger: st }
        );
        gsap.fromTo(
          head,
          { x: -18, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.7, ease: "power3.out", scrollTrigger: st }
        );
        gsap.fromTo(
          chips,
          { y: 22, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            ease: "power3.out",
            stagger: 0.055,
            delay: 0.12,
            scrollTrigger: st,
          }
        );
      });
    },
    { scope }
  );

  return (
    <Section id="stack">
      <SectionHead label="STACK" index="04" />

      <div ref={scope} className="mt-10 sm:mt-16">
        {stack.map((g) => (
          <div key={g.group} data-row className="relative pt-6 sm:pt-9 pb-7 sm:pb-11">
            {/* the rule draws itself as the row arrives */}
            <span
              data-rule
              className="absolute top-0 left-0 right-0 h-px bg-[var(--color-line)] origin-left"
            />

            <div className="grid gap-5 sm:gap-8 md:grid-cols-[minmax(0,200px)_minmax(0,1fr)] md:items-start">
              <div data-head className="flex items-baseline gap-3">
                <span className="label !text-[var(--color-cyan)]">{g.n}</span>
                <h3 className="display font-bold text-[clamp(1rem,2.2vw,1.4rem)] tracking-[0.06em] text-[var(--color-ice)]">
                  {g.group}
                </h3>
              </div>

              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 sm:gap-x-7">
                {g.items.map((item, i) => (
                  <span key={item} data-item className="flex items-baseline gap-4 sm:gap-7">
                    <span className="group relative font-display font-medium text-[clamp(1.15rem,4vw,2.35rem)] leading-none text-[var(--color-dim)] hover:text-[var(--color-ice)] transition-colors duration-300 cursor-default">
                      {item}
                      <span className="absolute -bottom-1.5 left-0 right-0 h-px bg-[var(--color-cyan)] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                    </span>
                    {i < g.items.length - 1 ? (
                      <span className="text-[var(--color-cyan)] text-[7px] opacity-45 translate-y-[-0.35em]">
                        ◆
                      </span>
                    ) : null}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
        <span className="block h-px bg-[var(--color-line)]" />
      </div>
    </Section>
  );
}
