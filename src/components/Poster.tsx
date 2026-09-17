"use client";

/**
 * The cover.
 *
 * A flat field of colour, the photograph blown up and thrown out of focus
 * behind it, and laid over that a printed card with a polaroid paper-clipped
 * to the top and the name signed underneath.
 *
 * Every measurement on the card is a multiple of `--w`, the card's own width,
 * so the whole composition scales as one object and needs no breakpoints.
 */

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cover, photo, profile, resume } from "@/lib/content";
import { motionOn } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Poster() {
  const section = useRef<HTMLElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const back = useRef<HTMLDivElement>(null);
  const fade = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const rows = gsap.utils.toArray<HTMLElement>("[data-row]");

      if (!motionOn()) {
        gsap.set([rows, card.current, back.current], { clearProps: "all" });
        return;
      }

      /* The card is laid down, then the ink comes up. */
      gsap.from(back.current, { scale: 1.12, opacity: 0, duration: 1.6, ease: "power2.out" });
      gsap.from(card.current, {
        y: 54,
        rotate: -3,
        opacity: 0,
        duration: 1.15,
        ease: "power3.out",
        delay: 0.1,
      });
      gsap.from(rows, {
        y: 18,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.45,
      });

      /* Scrolling lifts it off and hands over to the page. */
      gsap
        .timeline({
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            invalidateOnRefresh: true,
            fastScrollEnd: true,
          },
        })
        .to(card.current, { y: -90, scale: 1.08, duration: 1, ease: "power2.in" }, 0)
        .to(back.current, { scale: 1.16, duration: 1, ease: "power2.in" }, 0)
        .to(fade.current, { opacity: 1, duration: 0.5, ease: "power2.in" }, 0.42);
    },
    { scope: section }
  );

  return (
    <section ref={section} id="hero" className="relative h-[200vh]">
      <div
        className="cover-screen sticky top-0 flex h-[100svh] w-full items-center justify-center overflow-hidden"
        style={{ background: cover.field }}
      >
        {/* ── the photograph, blown up behind everything ── */}
        <div ref={back} className="cover-back" aria-hidden>
          <Image src={photo} alt="" fill priority sizes="120vh" className="object-cover" />
        </div>
        <span aria-hidden className="cover-wash" />

        {/* ── the printed card ── */}
        <div ref={card} className="cover-card">
          {/* micro-type running up the left edge */}
          <span data-row className="cover-spine">
            {cover.spine}
          </span>

          {/* the polaroid, clipped on */}
          <figure data-row className="polaroid-plate">
            <Clip />
            <span className="polaroid-window">
              <Image
                src={photo}
                alt={`${profile.name}, photographed straight on`}
                fill
                priority
                sizes="(max-width: 640px) 78vw, 420px"
                className="object-cover"
              />
            </span>
          </figure>

          {/* the name, signed */}
          <h1 data-row className="cover-sign">
            {cover.sign.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          {/* the CV, on a tab out of the card's edge */}
          <a href={resume.file} download className="cv-tab" data-row>
            <span>{resume.label}</span>
            <svg viewBox="0 0 24 24" aria-hidden>
              <path
                d="M12 4v11M7.6 11.2 12 15.6l4.4-4.4M5 19.5h14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>

          {/* the footer row */}
          <div data-row className="cover-foot">
            {cover.foot.map((f) => (
              <span key={f}>{f}</span>
            ))}
          </div>
        </div>

        <span className="cover-cue">{cover.cue}</span>

        {/* hand-off into the page */}
        <div
          ref={fade}
          className="pointer-events-none absolute inset-0 z-40 opacity-0"
          style={{ background: "var(--color-deep)" }}
          aria-hidden
        />
      </div>
    </section>
  );
}

/** The paperclip holding the polaroid to the card. */
function Clip() {
  return (
    <svg className="clip" viewBox="0 0 40 96" aria-hidden>
      <defs>
        <linearGradient id="clipSteel" x1="0" y1="0" x2="1" y2="0.2">
          <stop offset="0" stopColor="#7c828a" />
          <stop offset="0.3" stopColor="#eef1f4" />
          <stop offset="0.6" stopColor="#a4abb2" />
          <stop offset="1" stopColor="#5f656c" />
        </linearGradient>
      </defs>
      <path
        d="M13 82V22a9 9 0 0 1 18 0v56a15 15 0 0 1-30 0V30"
        fill="none"
        stroke="url(#clipSteel)"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
