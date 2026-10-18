"use client";

/**
 * Work with me: what I build (each with a project as proof), how a
 * project runs, and the enquiry form. All text is `hire` in content.ts.
 */

import Link from "next/link";
import { hire } from "@/lib/content";
import KineticContact from "./KineticContact";
import ServicesBoard from "./ServicesBoard";
import "@/app/kinetic.css";

export function Availability({ dark = false }: { dark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 rounded-full border px-3.5 py-1.5 ${
        dark ? "border-white/20 bg-white/5" : "border-[var(--color-line)] bg-[var(--color-void)]"
      }`}
    >
      <span className="relative flex h-2 w-2" aria-hidden>
        {hire.open ? (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#5f8a3c] opacity-60 motion-reduce:animate-none" />
        ) : null}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${hire.open ? "bg-[#5f8a3c]" : "bg-[var(--color-dim)]"}`} />
      </span>
      <span className={`label ${dark ? "!text-white" : "!text-[var(--color-ice)]"}`}>{hire.open ? hire.openText : hire.closedText}</span>
    </span>
  );
}

export default function Hire() {
  return (
    <>
      <ServicesBoard availability={<Availability dark />} />

      {/* ── process, in the Kinetic look ── */}
      <section id="process" className="kin kin-dark kin-process">
        <div className="kin-glow" aria-hidden />
        <div className="kin-wrap">
          <p className="kin-eyebrow">How it works</p>
          <h2 className="kin-h2">Four steps, no surprises</h2>
          <ol className="kin-steps">
            {hire.process.map((p, i) => (
              <li key={p.step}>
                <span>Step {i + 1}</span>
                <h3>
                  {p.step}
                  {i < hire.process.length - 1 ? <b aria-hidden>→</b> : null}
                </h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── free notes, just above contact ── */}
      <section className="kin kin-dark kin-notes">
        <div className="kin-wrap">
          <Link href="/notes" className="kin-notes-card">
            <span>
              <small>Free for students</small>
              <strong>Episode notes</strong>
              <em>PDF cheat sheets for every Full Stack episode, explained simply.</em>
            </span>
            <b aria-hidden>→</b>
          </Link>
        </div>
      </section>

      {/* ── contact, in the Kinetic look ── */}
      <div className="kin">
        <KineticContact lead="Ready to build|something bold?" />
      </div>
    </>
  );
}
