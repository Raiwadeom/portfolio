/**
 * The profile card in the about section: a soft-grey photo panel with the
 * social links stacked down its side, and the availability line underneath.
 */

import Image from "next/image";
import { siGithub, siInstagram, siLetterboxd } from "simple-icons";
import { hire, links, photo, profile } from "@/lib/content";

/** simple-icons dropped the LinkedIn logo, so it is drawn here. */
const linkedinPath =
  "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM2.5 9.75h4.96V21.5H2.5V9.75Zm7.9 0h4.75v1.6h.07c.66-1.25 2.27-2.57 4.68-2.57 5 0 5.9 3.29 5.9 7.57v5.15h-4.95v-4.57c0-1.09-.02-2.49-1.52-2.49-1.52 0-1.75 1.19-1.75 2.41v4.65H10.4V9.75Z";

const iconPaths: Record<string, string> = {
  GH: siGithub.path,
  IN: linkedinPath,
  IG: siInstagram.path,
  LB: siLetterboxd.path,
};

export default function Badge() {
  return (
    <div className="badge-wrap mx-auto w-full max-w-[300px]">
      <div className="rounded-[26px] bg-white p-3 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.55)]">
        <div className="badge-photo relative aspect-[4/5] w-full overflow-hidden rounded-[18px] bg-[#d9dde3]">
          <Image
            src={photo}
            alt={profile.name}
            fill
            sizes="(max-width: 640px) 70vw, 300px"
            className="object-cover"
          />

          <ul className="absolute right-3 top-3 flex flex-col gap-2.5">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${l.label} — ${l.handle}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#6f7379] text-white backdrop-blur-sm transition-colors hover:bg-[var(--ink)]"
                >
                  <svg
                    viewBox={l.short === "IN" ? "0 0 26 26" : "0 0 24 24"}
                    aria-hidden
                    className="h-[18px] w-[18px] fill-current"
                  >
                    <path d={iconPaths[l.short]} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="px-2 pb-1 pt-3 text-center">
          <h3 className="display text-[clamp(1.05rem,4.4vw,1.4rem)] leading-[1] text-[var(--ink)]">
            {profile.name}
          </h3>
          <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-[var(--ink-soft)]">
            {profile.role}
          </p>
          <p className="mt-3 flex items-center justify-center gap-2 whitespace-nowrap text-[12px] font-medium text-[var(--ink)]">
            <span
              aria-hidden
              className={`h-2 w-2 rounded-full ${hire.open ? "bg-[#34c759]" : "bg-[#9a9a9a]"}`}
            />
            {hire.open ? "Available for new projects" : hire.closedText}
          </p>
        </div>
      </div>
    </div>
  );
}
