"use client";

/**
 * The lanyard badge — the photo, hung rather than pasted.
 *
 * It swings on its own in CSS, and tips towards the pointer while you're on
 * it. The whole thing is drawn: strap, D-ring, swivel clip, slot punch.
 */

import { useRef, useState } from "react";
import Image from "next/image";
import { about, photo, profile } from "@/lib/content";

export default function Badge() {
  const wrap = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState(0);

  const track = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTilt(((e.clientX - (r.left + r.width / 2)) / r.width) * 9);
  };

  return (
    <div
      ref={wrap}
      onMouseMove={track}
      onMouseLeave={() => setTilt(0)}
      className="badge-wrap relative mx-auto flex w-full max-w-[268px] flex-col items-center"
    >
      {/* strap */}
      <div
        className="badge-strap h-[52px] w-[26px] shrink-0 rounded-b-[3px] sm:h-[68px]"
        style={{
          background:
            "linear-gradient(90deg, #cfd3ce 0%, #f2f4f0 22%, #e2e5df 55%, #b9bdb7 100%)",
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(0,0,0,0.07) 0 1px, transparent 1px 3px), linear-gradient(90deg, #c8ccc6, #f4f6f2 30%, #d7dbd4 70%, #b2b6b0)",
          boxShadow: "0 2px 10px rgba(0,0,0,0.35)",
        }}
      />

      {/* D-ring and swivel clip */}
      <svg width="46" height="52" viewBox="0 0 46 52" className="badge-ring -mt-1 drop-shadow" aria-hidden>
        <defs>
          <linearGradient id="steel" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#7e8590" />
            <stop offset="0.35" stopColor="#e8ecf1" />
            <stop offset="0.62" stopColor="#9aa1ab" />
            <stop offset="1" stopColor="#666c76" />
          </linearGradient>
        </defs>
        <path
          d="M14 2h18a10 10 0 0 1 0 20H14A10 10 0 0 1 14 2Z"
          fill="none"
          stroke="url(#steel)"
          strokeWidth="3.2"
        />
        <path
          d="M23 18c4 0 6 2.6 6 6v16c0 5-2.6 8-6 8s-6-3-6-8"
          fill="none"
          stroke="url(#steel)"
          strokeWidth="3.4"
          strokeLinecap="round"
        />
        <circle cx="23" cy="24" r="3" fill="url(#steel)" />
      </svg>

      {/* the card */}
      <div
        className="badge-hang lanyard-swing -mt-[26px] w-full"
        style={{ transform: `rotate(${tilt}deg)`, transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)" }}
      >
        <div className="badge-card paper relative w-full rounded-[16px] p-3 shadow-[0_38px_70px_-30px_rgba(0,0,0,0.95)]">
          {/* slot punch */}
          <span
            aria-hidden
            className="badge-slot absolute left-1/2 top-3 h-[9px] w-[54px] -translate-x-1/2 rounded-full"
            style={{ background: "#0c100f", boxShadow: "inset 0 1px 2px rgba(255,255,255,0.25)" }}
          />

          <div className="badge-inner mt-6 px-2">
            <div className="badge-top flex items-start justify-between">
              <span className="paper-field">Staff</span>
              <span className="paper-field">{profile.nationality}</span>
            </div>

            <div className="badge-photo paper-box relative mt-2 aspect-[3/4] w-full overflow-hidden rounded-[3px]">
              <Image
                src={photo}
                alt={profile.name}
                fill
                sizes="(max-width: 640px) 70vw, 280px"
                className="object-cover"
              />
            </div>

            <div className="badge-text">
              <h3 className="display mt-3 text-[clamp(1.05rem,4.4vw,1.5rem)] leading-[0.95] text-[var(--ink)]">
                {profile.name}
              </h3>
              <p className="mt-1 text-[9.5px] uppercase tracking-[0.16em] text-[var(--ink-soft)]">
                {profile.role}
              </p>

              <div className="mt-3 grid grid-cols-2 border-l border-t border-[rgba(22,22,28,0.55)]">
                {about.meta.map((m) => (
                  <Cell key={m.k} k={m.k} v={m.v} />
                ))}
              </div>

              <div className="badge-code">
                <div className="barcode mt-3" aria-hidden />
                <div className="mb-1 mt-1 flex items-center justify-between text-[8px] tracking-[0.12em] text-[var(--ink-soft)]">
                  <span>{profile.badgeNo}</span>
                  <span>{profile.handle}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Cell({ k, v }: { k: string; v: string }) {
  return (
    <div className="border-b border-r border-[rgba(22,22,28,0.55)] px-2 py-1.5">
      <span className="paper-field block">{k}</span>
      {/* Wraps rather than truncates — a badge you can't read the truth off
          of is worse than one that runs to two lines. */}
      <span className="mt-0.5 block text-[10px] font-medium leading-snug">{v}</span>
    </div>
  );
}
