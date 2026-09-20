"use client";

import { profile } from "@/lib/content";
import Visitors from "./Visitors";
import Wordmark from "./Wordmark";
import { Reveal } from "./ui";

/** The signature every page ends on — the wordmark, then the visit count. */
export default function Footer() {
  return (
    <div className="relative px-[var(--gutter)] pb-16 sm:pb-20">
      <Wordmark text={profile.name.split(" ")[0].slice(1)} />

      <Reveal>
        <footer className="mt-14 sm:mt-20 border-t border-[var(--color-line-soft)] pt-5">
          <Visitors />
        </footer>
      </Reveal>
    </div>
  );
}
