"use client";

/**
 * A project's screenshot in a browser-style frame, with an optional short
 * muted clip on top that plays while it is on screen, on every device.
 *
 * The clip only loads once it is near the viewport. Anyone whose system asks
 * for reduced motion gets it on hover instead of by itself, and the site's
 * own motion switch keeps it still. With no clip, the screenshot is all
 * there is.
 */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type Props = {
  image: string;
  alt: string;
  video?: string;
  url?: string;
  priority?: boolean;
  sizes?: string;
  /** hold the clip still, e.g. for a card hidden behind another */
  paused?: boolean;
};

function motionOff() {
  return document.documentElement.getAttribute("data-motion") === "off";
}

function calmer() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function ProjectMedia({
  image,
  alt,
  video,
  url,
  priority,
  sizes = "(min-width: 900px) 880px, 100vw",
  paused = false,
}: Props) {
  const box = useRef<HTMLDivElement>(null);
  const clip = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [playing, setPlaying] = useState(false);

  /* load the clip once it is close, play it while it is visible */
  useEffect(() => {
    const el = box.current;
    if (paused) {
      clip.current?.pause();
      return;
    }
    if (!video || !el || motionOff()) return;
    const autoplay = !calmer();

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setNear(true);
        const v = clip.current;
        if (!v || !autoplay) return;
        if (e.intersectionRatio > 0.5) v.play().then(() => setPlaying(true)).catch(() => {});
        else {
          v.pause();
          setPlaying(false);
        }
      },
      { rootMargin: "300px 0px", threshold: [0, 0.5] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [video, near, paused]);

  /* reduced-motion visitors: play only while the pointer is over it */
  const onEnter = () => {
    if (!video || paused || motionOff() || !calmer()) return;
    setNear(true);
    clip.current?.play().then(() => setPlaying(true)).catch(() => {});
  };
  const onLeave = () => {
    if (!calmer() || !clip.current) return;
    clip.current.pause();
    setPlaying(false);
  };

  const host = url ? url.replace(/^https?:\/\//, "").replace(/\/$/, "") : "";

  return (
    <div
      ref={box}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="overflow-hidden rounded-[6px] border border-[var(--color-line)] bg-[var(--color-panel)] shadow-[0_18px_50px_-24px_rgba(24,20,15,0.45)]"
    >
      {/* browser chrome */}
      <div aria-hidden className="flex items-center gap-2 border-b border-[var(--color-line)] px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-[var(--color-line)]" />
        <span className="h-2 w-2 rounded-full bg-[var(--color-line)]" />
        <span className="h-2 w-2 rounded-full bg-[var(--color-line)]" />
        {host ? <span className="label ml-2 truncate !text-[9px] normal-case !tracking-[0.08em]">{host}</span> : null}
      </div>

      <div className="relative aspect-[16/10]">
        <Image src={image} alt={alt} fill sizes={sizes} priority={priority} className="object-cover object-top" />
        {video && near ? (
          <video
            ref={clip}
            src={video}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
            className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500 ${
              playing && !paused ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : null}
      </div>
    </div>
  );
}
