"use client";

/**
 * The licences.
 *
 * On a desktop they lie in a column, dealt out on the page as you scroll —
 * the licence card is a wide printed form and it wants the room.
 *
 * A phone has no room to spare, so the same three cards become a deck: one
 * in the slot at a time, with tabs to bring another forward, and the section
 * stays one screen tall instead of three.
 */

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { projects } from "@/lib/content";
import { useMediaQuery } from "@/lib/media";
import { useSpotlight } from "@/lib/spotlight";
import { motionOn } from "@/lib/motion";
import { Section, SectionHead } from "./ui";
import { LicenceCard } from "./Licence";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Alternating tilt, so the column reads as cards dropped on a desk. */
const tilt = [-1.4, 1.1, -0.8, 1.5];

export default function Work() {
  const stacked = useMediaQuery("(max-width: 767px)");

  return (
    <Section id="work">
      <SectionHead label="SELECTED WORK" index="03" right={`(${projects.length} LICENCES)`} />
      {stacked ? <Deck /> : <Column />}
    </Section>
  );
}

/* ---------- phones: one at a time ---------- */

function Deck() {
  const { scope, index, pick, release } = useSpotlight<HTMLDivElement>(projects.length, {
    ms: 6000,
  });

  return (
    <div ref={scope} className="mx-auto mt-8 max-w-[900px]" onPointerLeave={release}>
      <div className="work-tabs">
        {projects.map((p, i) => (
          <button
            key={p.slug}
            type="button"
            className="work-tab"
            data-on={i === index ? "" : undefined}
            aria-pressed={i === index}
            {...pick(i)}
          >
            <span className="work-tab-n">{p.n}</span>
            <span className="work-tab-t">{p.title}</span>
          </button>
        ))}
      </div>

      <div className="work-deck">
        {projects.map((p, i) => {
          const o = i - index;
          return (
            <div
              key={p.slug}
              className="work-card"
              data-state={o === 0 ? "front" : "back"}
              aria-hidden={o !== 0}
              style={{ ["--o" as string]: Math.abs(o), zIndex: projects.length - Math.abs(o) }}
            >
              <LicenceCard p={p} compact />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- desktop: the column, unchanged ---------- */

function Column() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-licence]");
      if (!cards.length || !motionOn()) {
        gsap.set(cards, { clearProps: "all" });
        return;
      }

      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 70, opacity: 0, rotate: tilt[i % tilt.length] * 3, scale: 0.97 },
          {
            y: 0,
            opacity: 1,
            rotate: tilt[i % tilt.length],
            scale: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 88%", once: true },
          }
        );
      });
    },
    { scope }
  );

  return (
    <div ref={scope} className="mx-auto mt-12 flex max-w-[880px] flex-col gap-9 sm:mt-16 sm:gap-12">
      {projects.map((p, i) => (
        <div
          key={p.slug}
          data-licence
          className="will-change-transform"
          style={{ rotate: `${tilt[i % tilt.length]}deg` }}
        >
          <LicenceCard p={p} compact />
        </div>
      ))}
    </div>
  );
}
