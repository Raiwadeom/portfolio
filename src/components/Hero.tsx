"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { heroQuote, heroVideo, profile } from "@/lib/content";
import { motionOn } from "@/lib/motion";
import { warp } from "@/lib/warp";
import SpaceBackdrop from "./SpaceBackdrop";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const [firstName, ...restName] = profile.name.split(" ");
const lastName = restName.join(" ");

export default function Hero() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const name = useRef<HTMLHeadingElement>(null);
  const meta = useRef<HTMLDivElement>(null);
  const hud = useRef<HTMLDivElement>(null);
  const fade = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const lines = gsap.utils.toArray<HTMLElement>("[data-line]");

      if (!motionOn()) {
        gsap.set(lines, { yPercent: 0, opacity: 1 });
        gsap.set(stage.current, { opacity: 1 });
        warp.value = 0;
        return;
      }

      /* Entrance — the name rises once, on load. The markup ships hidden so
         a refresh never flashes it before this runs. */
      gsap.set(lines, { yPercent: 115, opacity: 0 });
      gsap.set(stage.current, { opacity: 1 });
      gsap.to(lines, {
        yPercent: 0,
        opacity: 1,
        duration: 1.15,
        ease: "power3.out",
        stagger: 0.09,
        delay: 0.15,
      });

      /* Departure — scrolling takes the field to light speed and drives the
         name past the camera, then hands off to the page. */
      const proxy = { w: 0 };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
        },
      });

      tl.to(
        proxy,
        {
          w: 1,
          ease: "power2.in",
          duration: 0.7,
          onUpdate: () => {
            warp.value = proxy.w;
          },
        },
        0
      )
        .to(hud.current, { opacity: 0, duration: 0.12, force3D: true }, 0)
        .to(
          [meta.current, "[data-kicker]"],
          { opacity: 0, y: -30, duration: 0.3, force3D: true },
          0.05
        )
        .to(
          name.current,
          { scale: 2.1, opacity: 0, ease: "power2.in", duration: 0.55, force3D: true },
          0.08
        )
        .to(fade.current, { opacity: 1, duration: 0.25 }, 0.52);
    },
    { scope: section }
  );

  return (
    <section ref={section} id="hero" className="relative h-[260vh]">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-[var(--color-void)]">
        {/* ══════════════ backdrop ══════════════ */}
        {heroVideo.src ? (
          <>
            <video
              className="absolute inset-0 w-full h-full object-cover"
              src={heroVideo.src}
              poster={heroVideo.poster || undefined}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden
            />
            <div
              className="absolute inset-0"
              style={{ background: `rgba(3,6,15,${heroVideo.scrim})` }}
              aria-hidden
            />
          </>
        ) : (
          <SpaceBackdrop />
        )}

        {/* ══════════════ the name ══════════════ */}
        <div
          ref={stage}
          className="absolute inset-0 flex flex-col justify-center px-[var(--gutter)]"
          style={{ zIndex: 20, opacity: 0 }}
        >
          <div className="w-full max-w-[1500px] mx-auto">
            <div className="overflow-hidden">
              <p
                data-line
                data-kicker
                className="label !text-[var(--color-cyan)] flex items-start gap-2.5"
              >
                <span className="inline-block w-5 h-px shrink-0 mt-[0.62em] bg-[var(--color-cyan)]" />
                {profile.status} — {profile.location.toUpperCase()}
              </p>
            </div>

            {/* staggered and left-anchored — deliberately not centred */}
            <h1
              ref={name}
              className="mt-5 sm:mt-7 mb-0 origin-[30%_50%] will-change-transform"
            >
              <span className="block overflow-hidden">
                <span
                  data-line
                  className="block display font-black text-[clamp(1.85rem,9.2vw,9rem)] text-[var(--color-ice)]"
                >
                  {firstName}
                </span>
              </span>
              {lastName ? (
                <span className="block overflow-hidden">
                  <span
                    data-line
                    className="block display font-black text-[clamp(1.85rem,9.2vw,9rem)] text-transparent pl-[6vw] sm:pl-[14vw]"
                    style={{ WebkitTextStroke: "1px rgba(143,214,255,0.75)" }}
                  >
                    {lastName}
                  </span>
                </span>
              ) : null}
            </h1>

            {/* meta rail, tucked under the offset line */}
            <div
              ref={meta}
              className="mt-7 sm:mt-10 flex flex-wrap items-start gap-x-10 gap-y-4 sm:pl-[14vw]"
            >
              <div className="overflow-hidden">
                <p data-line className="label !text-[9px]">
                  ROLE
                  <span className="block mt-1.5 text-[11px] sm:text-[13px] tracking-[0.14em] text-[var(--color-ice)]">
                    {profile.role.toUpperCase()}
                  </span>
                </p>
              </div>
              <div className="overflow-hidden">
                <p data-line className="label !text-[9px]">
                  FOCUS
                  <span className="block mt-1.5 text-[11px] sm:text-[13px] tracking-[0.14em] text-[var(--color-ice)]">
                    FULL-STACK · PYTHON · AI
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════ HUD ══════════════ */}
        <div
          ref={hud}
          className="absolute inset-x-0 bottom-0 px-[var(--gutter)] pb-5 flex flex-col sm:flex-row items-stretch sm:items-end sm:justify-between gap-3 sm:gap-6"
          style={{ zIndex: 30 }}
        >
          <figure className="m-0 w-full sm:max-w-[min(52vw,420px)] border-l border-[rgba(143,214,255,0.35)] pl-3 sm:pl-4">
            <blockquote className="m-0 italic text-[clamp(10px,1.05vw,13px)] leading-[1.55] text-[rgba(202,228,255,0.82)]">
              &ldquo;{heroQuote.text}&rdquo;
            </blockquote>
            <figcaption className="label mt-1.5 !text-[8px] !text-[rgba(143,214,255,0.6)]">
              — {heroQuote.author}
            </figcaption>
          </figure>

          <span className="shrink-0 flex items-center justify-end gap-3 pb-0.5">
            <span className="label whitespace-nowrap">SCROLL TO ENTER</span>
            <span className="block w-8 h-px bg-gradient-to-r from-transparent to-[var(--color-cyan)]" />
          </span>
        </div>

        {/* hand-off into the page */}
        <div
          ref={fade}
          className="absolute inset-0 opacity-0 pointer-events-none"
          style={{ zIndex: 40, background: "var(--color-deep)" }}
          aria-hidden
        />
      </div>
    </section>
  );
}
