/**
 * The services, as four pinned cards under a spotlight. Text is `hire` in
 * content.ts; each card links to the project that proves it.
 */

import Link from "next/link";
import { hire } from "@/lib/content";

export default function ServicesBoard({ availability }: { availability: React.ReactNode }) {
  return (
    <section id="services" className="sv">
      <span aria-hidden className="sv-beam" />
      <span aria-hidden className="sv-grain" />

      <h1 className="sv-ghost">
        <span>Let&apos;s improve</span>
        <span>your business</span>
        <span>with our services</span>
      </h1>

      <p className="sv-note sv-note--top">
        <span aria-hidden className="sv-x">
          ×××
        </span>
        {hire.intro}
        <em>[ Services ]</em>
      </p>

      <ul className="sv-cards">
        {hire.services.map((svc, i) => (
          <li key={svc.title} className="sv-slot" style={{ ["--i" as string]: i }}>
            <Link href={svc.proof?.href ?? "/contact"} className="sv-card">
              <span aria-hidden className="sv-pin" />
              <span className="sv-card-body">{svc.body}</span>
              <span className="sv-card-n">[{i + 1}]</span>
              <span className="sv-card-title">{svc.title}</span>
              {svc.proof ? <span className="sv-card-proof">Proof: {svc.proof.label} →</span> : null}
            </Link>
          </li>
        ))}
      </ul>

      <div className="sv-note sv-note--bottom">
        <span aria-hidden className="sv-x">
          ×××
        </span>
        {availability}
        <a href="#kin-form" className="sv-cta">
          Start a project ↓
        </a>
        <em>[ 2 ]</em>
      </div>
    </section>
  );
}
