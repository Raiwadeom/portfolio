"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { about } from "@/lib/content";
import { motionOn } from "@/lib/motion";
import { Section, SectionHead, Reveal } from "./ui";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function About() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!motionOn()) {
        gsap.set(".reveal-word", { opacity: 1 });
        return;
      }
      gsap.to(".reveal-word", {
        opacity: 1,
        stagger: 0.05,
        ease: "none",
        scrollTrigger: {
          trigger: scope.current,
          start: "top 72%",
          end: "bottom 62%",
          scrub: 0.5,
        },
      });
    },
    { scope }
  );

  const words = about.statement.split(" ");

  return (
    <Section id="about">
      <SectionHead label="ABOUT" index="01" />

      <div ref={scope} className="mt-12 sm:mt-16">
        <p className="display font-medium text-[clamp(1.1rem,3.6vw,2.9rem)] leading-[1.22] tracking-[0.005em] max-w-[22ch] sm:max-w-[26ch]">
          {words.map((w, i) => (
            <span key={i} className="reveal-word text-[var(--color-cyan)]">
              {w}
              {" "}
            </span>
          ))}
        </p>
      </div>

      <div className="mt-14 sm:mt-20 grid grid-cols-2 lg:grid-cols-4 border-t border-l border-[var(--color-line-soft)]">
        {about.meta.map((m, i) => (
          <Reveal key={m.k} delay={i * 70}>
            <div className="border-b border-r border-[var(--color-line-soft)] p-4 sm:p-6 h-full">
              <div className="label mb-2">{m.k}</div>
              <div className="text-[13px] sm:text-[15px] text-[var(--color-ice)] leading-snug">
                {m.v}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
