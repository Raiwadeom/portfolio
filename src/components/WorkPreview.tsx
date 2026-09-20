"use client";

/** The homepage's teaser of Work — two cards and a link to the real page,
 *  now that the full column lives at /work. */

import Link from "next/link";
import { projects } from "@/lib/content";
import { SectionHead, Reveal } from "./ui";
import { LicenceCard } from "./Licence";

const tilt = [-1.4, 1.1];

export default function WorkPreview() {
  const featured = projects.slice(0, 2);

  return (
    <section className="relative px-[var(--gutter)] py-[clamp(72px,12vh,140px)]">
      <SectionHead label="SELECTED WORK" index="03" right={`(${projects.length} LICENCES)`} />

      <div className="mx-auto mt-12 flex max-w-[880px] flex-col gap-9 sm:mt-16 sm:gap-12">
        {featured.map((p, i) => (
          <Reveal key={p.slug} delay={i * 90}>
            <div style={{ rotate: `${tilt[i % tilt.length]}deg` }}>
              <LicenceCard p={p} compact />
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={180}>
        <Link
          href="/work"
          className="group relative mx-auto mt-12 flex max-w-[880px] items-center justify-between gap-4 border-t border-[var(--color-line-soft)] pt-5 sm:mt-16"
        >
          <span className="label transition-colors group-hover:!text-[var(--color-amber)]">
            VIEW ALL {projects.length} LICENCES
          </span>
          <span className="text-[var(--color-amber)] transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </Reveal>
    </section>
  );
}
