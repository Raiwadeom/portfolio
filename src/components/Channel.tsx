import Link from "next/link";
import { notes, INSTAGRAM_URL, INSTAGRAM_HANDLE, YOUTUBE_URL, YOUTUBE_HANDLE } from "@/lib/notes.config";
import SocialLogo from "./SocialLogo";
import { Section, SectionHead, Reveal } from "./ui";

/**
 * The tech channel, on the landing page: oruim.tech. One dark slab with the
 * channel name, what it is, and the three ways in (YouTube, Instagram, free
 * PDF notes).
 */
export default function Channel() {
  const doors = [
    { short: "YT", name: "YouTube", handle: YOUTUBE_HANDLE, href: YOUTUBE_URL, cta: "SUBSCRIBE", external: true },
    { short: "IG", name: "Instagram", handle: INSTAGRAM_HANDLE, href: INSTAGRAM_URL, cta: "FOLLOW", external: true },
  ];

  return (
    <Section id="channel">
      <SectionHead label="THE CHANNEL" index="02" right="OFF-SCREEN, ON-SCREEN" />

      <Reveal className="mt-10 sm:mt-14">
        <div className="chan">
          <div className="chan-copy">
            <p className="chan-tag">
              <span className="chan-live" aria-hidden /> Tech channel
            </p>
            <h2 className="chan-name">
              oruim<span>.tech</span>
            </h2>
            <p className="chan-line">
              I build with AI in the open. Short videos on Claude Code and shipping real products, plus free PDF
              guides you can download and use today.
            </p>
            <Link href="/notes" className="chan-notes">
              <span className="chan-notes-n">{notes.length}</span>
              <span>
                free PDF notes
                <small>Open the library of guides →</small>
              </span>
            </Link>
          </div>

          <ul className="chan-doors">
            {doors.map((d) => (
              <li key={d.name}>
                <a href={d.href} target="_blank" rel="noopener" className="chan-door">
                  <SocialLogo short={d.short} className="h-12 w-12" />
                  <span className="chan-door-text">
                    <b>{d.name}</b>
                    <small>{d.handle}</small>
                  </span>
                  <span className="chan-door-go">{d.cta} ↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}
