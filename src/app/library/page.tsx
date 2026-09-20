import type { Metadata } from "next";
import Subpage from "@/components/Subpage";
import Music from "@/components/Music";
import Books from "@/components/Books";
import Cinema from "@/components/Cinema";
import { profile } from "@/lib/content";

export const metadata: Metadata = {
  title: `Library — ${profile.name}`,
  description: "What's on repeat, what's on the shelf, and what's on the screen.",
};

/** Everything that isn't work: the music, the books and the films, one room. */
export default function LibraryPage() {
  return (
    <Subpage kicker="LIBRARY" right="OFF THE CLOCK" tint="rgba(122,140,92,0.25)" max="1100px">
      <header className="mt-10 sm:mt-14">
        <h1 className="display text-[clamp(2.6rem,13vw,7rem)] leading-[0.86] text-[var(--color-ice)]">
          The Library
        </h1>
        <p className="mt-4 max-w-[52ch] text-[13.5px] leading-relaxed text-[var(--color-dim)] sm:text-[15px]">
          What&rsquo;s on repeat, what&rsquo;s on the shelf and what&rsquo;s on the screen —
          the three shelves that aren&rsquo;t on a CV.
        </p>

        <nav className="mt-7 flex flex-wrap gap-2.5">
          {[
            { id: "music", label: "MUSIC" },
            { id: "books", label: "BOOKS" },
            { id: "cinema", label: "FILMS" },
          ].map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="label border border-[var(--color-line)] px-4 py-2 transition-colors hover:!text-[var(--color-amber)] hover:border-[var(--color-amber)]"
            >
              {s.label}
            </a>
          ))}
        </nav>
      </header>

      <Music />
      <Books />
      <Cinema />
    </Subpage>
  );
}
