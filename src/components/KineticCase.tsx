"use client";

/**
 * A project case study, set in the "Kinetic" look: a black stage with a
 * snapping row of story cards, then a pale contact stage with a white form
 * card, a giant wordmark and a column footer. Self-contained: it brings its
 * own tokens so nothing leaks into the rest of the site.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { projects } from "@/lib/content";
import type { CaseStudy } from "@/lib/case-studies";
import ProjectMedia from "./ProjectMedia";
import KineticContact from "./KineticContact";
import "@/app/kinetic.css";

type Project = (typeof projects)[number];

export default function KineticCase({
  p,
  c,
  prev,
  next,
}: {
  p: Project;
  c: CaseStudy | null;
  prev: Project;
  next: Project;
}) {
  const cards = p.highlights;

  return (
    <div className="kin">
      {/* ───────── stage one: black ───────── */}
      <section className="kin-dark">
        <div className="kin-glow" aria-hidden />

        <div className="kin-wrap kin-top">
          <Link href="/work" className="kin-back">
            ← All work
          </Link>
          <span className="kin-count">
            {p.n} / {String(projects.length).padStart(2, "0")}
          </span>
        </div>

        <header className="kin-wrap kin-hero">
          <p className="kin-eyebrow">@{p.slug.replace(/-/g, "")} · {p.kind}</p>
          <h1 className="kin-h1">{p.title}</h1>
          <p className="kin-lede">{p.blurb}</p>
          <div className="kin-actions">
            {p.live ? (
              <a className="kin-pill kin-pill-orange" href={p.live} target="_blank" rel="noreferrer">
                Visit live site ↗
              </a>
            ) : null}
            {p.repo ? (
              <a className="kin-pill kin-pill-white" href={p.repo} target="_blank" rel="noreferrer">
                Read the code ↗
              </a>
            ) : null}
          </div>
        </header>

        {c?.solution.media.image ? (
          <div className="kin-wrap kin-media">
            <ProjectMedia
              image={c.solution.media.image}
              video={c.solution.media.video || undefined}
              alt={c.solution.media.alt}
              url={p.live}
              priority
            />
          </div>
        ) : null}

        {c?.solution.summary ? (
          <div className="kin-wrap kin-summary">
            <h2 className="kin-h2">What it does</h2>
            <p>{c.solution.summary}</p>
          </div>
        ) : null}

        {/* the numbers */}
        {c?.result.length ? (
          <dl className="kin-wrap kin-stats">
            {c.result.map((r) => (
              <div key={r.label}>
                <dd>{r.value}</dd>
                <dt>{r.label}</dt>
              </div>
            ))}
          </dl>
        ) : null}

        <div className="kin-wrap kin-cols">
          <div>
            <h3 className="kin-kicker">Key features</h3>
            <ul>
              {p.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="kin-kicker">How it works</h3>
            <ol>
              {p.notes.map((n, i) => (
                <li key={i}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <p>{n}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {c?.tech.length ? (
          <ul className="kin-wrap kin-tech" aria-label="Tech used">
            {c.tech.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        ) : null}

        {/* the story carousel */}
        {cards.length ? <Stories cards={cards} kicker={p.title} /> : null}

        <nav className="kin-wrap kin-pager" aria-label="More projects">
          <Link href={`/work/${prev.slug}`}>
            <small>← Previous</small>
            {prev.title}
          </Link>
          <Link href={`/work/${next.slug}`} style={{ textAlign: "right" }}>
            <small>Next →</small>
            {next.title}
          </Link>
        </nav>
      </section>

      <KineticContact live={p.live} liveLabel={p.title} lead="Need something|like this?" />
    </div>
  );
}

/** A snapping row of cards. The one nearest the middle turns white. */
function Stories({ cards, kicker }: { cards: { title: string; body: string }[]; kicker: string }) {
  const rail = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  const measure = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    const mid = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let gap = Infinity;
    Array.from(el.children).forEach((child, i) => {
      const c = child as HTMLElement;
      const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
      if (d < gap) {
        gap = d;
        best = i;
      }
    });
    setActive(best);
  }, []);

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    el.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      el.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  function go(dir: 1 | -1) {
    const el = rail.current;
    if (!el) return;
    const target = el.children[Math.min(cards.length - 1, Math.max(0, active + dir))] as HTMLElement | undefined;
    target?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }

  return (
    <div className="kin-stories">
      <div className="kin-wrap">
        <h2 className="kin-h2 kin-center">What’s inside</h2>
        <p className="kin-sub kin-center">The parts of {kicker} that make it work.</p>
      </div>

      <ul className="kin-rail" ref={rail} aria-label="Project stories">
        {cards.map((s, i) => (
          <li key={i} className="kin-card" data-on={i === active ? "" : undefined}>
            <div className="kin-card-art" aria-hidden />
            <div className="kin-card-body">
              <p className="kin-card-k">{kicker} · {String(i + 1).padStart(2, "0")}</p>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="kin-arrows">
        <button type="button" onClick={() => go(-1)} aria-label="Previous story" className="kin-arrow">
          ‹
        </button>
        <button type="button" onClick={() => go(1)} aria-label="Next story" className="kin-arrow kin-arrow-on">
          ›
        </button>
      </div>
    </div>
  );
}
