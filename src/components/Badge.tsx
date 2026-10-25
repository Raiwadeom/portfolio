/**
 * The profile card in the about section: a soft-grey photo panel with the
 * social links stacked down its side, and the availability line underneath.
 */

import Image from "next/image";
import SocialLogo from "./SocialLogo";
import { hire, links, photo, profile } from "@/lib/content";

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
                  className="block transition-transform hover:scale-110"
                >
                  <SocialLogo short={l.short} />
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
