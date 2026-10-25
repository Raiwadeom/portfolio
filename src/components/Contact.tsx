"use client";

import { links, profile, hire } from "@/lib/content";
import SocialLogo from "./SocialLogo";
import "@/app/kinetic.css";

const tags = ["Code", "Network", "Social", "Films"];

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
              <SocialLogo short={l.short} className="h-[72px] w-[72px]" />
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
