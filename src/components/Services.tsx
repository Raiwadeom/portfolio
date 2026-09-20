"use client";

import { useState } from "react";
import { services } from "@/lib/content";
import { Section, SectionHead, Reveal } from "./ui";

export default function Services() {
  const [open, setOpen] = useState(0);

  return (
    <Section id="services">
      <SectionHead label="WHAT I DO" index="02" right="THE OFFER" />

      <div className="mt-10 sm:mt-14 border-t border-[var(--color-line-soft)]">
        {services.map((s, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={s.n} delay={i * 60}>
              <div
                onMouseEnter={() => setOpen(i)}
                onClick={() => setOpen(i)}
                className="group border-b border-[var(--color-line-soft)] py-5 sm:py-7 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-4 sm:gap-8">
                  <span
                    className={`label shrink-0 transition-colors ${
                      isOpen ? "!text-[var(--color-amber)]" : ""
                    }`}
                  >
                    {s.n}
                  </span>

                  <h3
                    className="display font-black text-[clamp(2.1rem,9.5vw,7.5rem)] transition-all duration-500"
                    style={{
                      color: isOpen ? "var(--color-ice)" : "transparent",
                      WebkitTextStroke: isOpen
                        ? "0px transparent"
                        : "1px rgba(177,80,47,0.5)",
                      textShadow: isOpen ? "0 0 50px rgba(177,80,47,0.3)" : "none",
                    }}
                  >
                    {s.word}
                  </h3>

                  <span
                    className={`ml-auto shrink-0 text-[var(--color-amber)] text-lg transition-transform duration-500 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </div>

                <div
                  className="grid transition-all duration-500 ease-out"
                  style={{
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <div className="overflow-hidden">
                    <div className="pt-4 sm:pt-6 sm:pl-[calc(2rem+32px)] max-w-[62ch]">
                      <p className="text-[13px] sm:text-[14px] leading-relaxed text-[var(--color-dim)]">
                        {s.body}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {s.tags.map((t) => (
                          <span key={t} className="chip">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
