"use client";

import { links, profile, hire } from "@/lib/content";
import "@/app/kinetic.css";

/** a small line-drawn mark for each card, in the spirit of the reference */
const glyphs = [
  <path key="g" d="M16 4v24M4 16h24M9 9l14 14M23 9L9 23" />,
  <rect key="l" x="6" y="6" width="20" height="20" rx="6" />,
  <path key="b" d="M7 7l18 18M25 7L7 25" />,
];
const tags = ["Code", "Network", "Films"];

/**
 * The top of the contact page: a pale stage with frosted glass cards laid
 * over a soft stone-coloured form. The enquiry form is in the closing section
 * the Footer adds underneath.
 */
export default function Contact() {
  return (
    <section id="contact-top" className="kin kin-gm">
      <div className="kin-gm-stone" aria-hidden />

      <div className="kin-wrap kin-gm-head">
        <p className="kin-gm-status">
          <i aria-hidden />
          {hire.open ? hire.openText : hire.closedText}
        </p>
        <h1>
          Let&rsquo;s build
          <br />
          it together.
        </h1>
        <a className="kin-gm-mail" href={`mailto:${profile.email}`}>
          {profile.email} <span aria-hidden>↗</span>
        </a>
      </div>

      <ul className="kin-wrap kin-gm-cards">
        {links.map((l, i) => (
          <li key={l.label}>
            <a href={l.href} target="_blank" rel="noreferrer" className="kin-gm-card">
              <span className="kin-gm-tag">{tags[i] ?? "Link"}</span>
              <svg viewBox="0 0 32 32" aria-hidden className="kin-gm-glyph">
                {glyphs[i % glyphs.length]}
              </svg>
              <span className="kin-gm-name">
                {l.label}
                <small>{l.handle}</small>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
