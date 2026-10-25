"use client";

/**
 * The pale closing stage of the Kinetic look: a call to action beside a white
 * enquiry card, a giant wordmark, and a column footer. Used under every
 * project case study and on the Services page.
 */

import { useState, type FormEvent, type MouseEvent, type ReactNode } from "react";
import Link from "next/link";
import { links, profile, hire } from "@/lib/content";
import SocialLogo from "./SocialLogo";
import "@/app/kinetic.css";

/**
 * "Email me" opens a new message addressed to me. Phones hand the mailto link
 * to their mail app. A desktop browser often has no mail app set up, so there
 * it opens Gmail's compose window with the same address filled in.
 */
function openMail(e: MouseEvent<HTMLAnchorElement>) {
  if (window.matchMedia("(pointer: coarse)").matches) return;
  e.preventDefault();
  const to = encodeURIComponent(profile.email);
  const win = window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${to}`, "_blank", "noopener");
  /* a blocked pop-up returns null: fall back to the plain mailto link */
  if (!win) window.location.href = `mailto:${profile.email}`;
}

export default function KineticContact({
  lead,
  live,
  liveLabel,
  extra,
}: {
  lead: string;
  live?: string;
  liveLabel?: string;
  extra?: ReactNode;
}) {
  const lines = lead.split("|");
  return (
      <section className="kin-light" id="contact">
        <div className="kin-wrap kin-cta">
          <div className="kin-cta-copy">
            <span className="kin-mark" aria-hidden>
              {profile.logo.split("/")[0]}
            </span>
            <h2>
              {lines[0]}
              <br />
              {lines[1]}
            </h2>
            <p>I build the whole thing, from the first sketch to the live site. Tell me what you need.</p>
            <a className="kin-pill kin-pill-line" href="#kin-form">
              Get started
              <span className="kin-dot" aria-hidden />
            </a>
          </div>

          <KineticForm />
        </div>

        <div className="kin-word" data-long aria-hidden>
          {profile.name.split(" ")[0]}
        </div>

        <footer className="kin-wrap kin-foot">
          <div className="kin-foot-lead">
            <h2>
              We&rsquo;ll be glad to
              <br />
              collaborate with you.
            </h2>
            <a className="kin-pill kin-pill-line" href={`mailto:${profile.email}`} onClick={openMail}>
              Email me
            </a>
            <p className="kin-copy">© {profile.name} 2026</p>
            {extra ? <div className="kin-extra">{extra}</div> : null}
          </div>

          <nav className="kin-foot-col" aria-label="Pages">
            <h3>Pages</h3>
            <Link href="/work">Work</Link>
            <Link href="/hire">Services</Link>
            <Link href="/notes">Free notes</Link>
            <Link href="/library">Library</Link>
            <Link href="/contact">Contact</Link>
          </nav>

          <div className="kin-foot-col">
            <h3>Contact</h3>
            <a href={`mailto:${profile.email}`} onClick={openMail}>
              {profile.email}
            </a>
            <p>Taking new projects</p>
            <p>Remote or on-site</p>
          </div>

          <div className="kin-foot-col">
            <h3>Elsewhere</h3>
            {links.map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="kin-foot-social">
                <SocialLogo short={l.short} className="h-6 w-6" />
                {l.label.charAt(0) + l.label.slice(1).toLowerCase()}
              </a>
            ))}
            {live ? (
              <a href={live} target="_blank" rel="noreferrer">
                {liveLabel}
              </a>
            ) : null}
          </div>
        </footer>
      </section>
  );
}

type State = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; msg: string };

/** The same enquiry as the Contact page, posted to /api/contact. */
function KineticForm() {
  const [state, setState] = useState<State>({ kind: "idle" });
  const [startedAt, setStartedAt] = useState(() => Date.now());

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, startedAt }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        setState({ kind: "sent" });
        form.reset();
      } else {
        setState({ kind: "error", msg: json.error || `Something went wrong. Please email ${profile.email}.` });
      }
    } catch {
      setState({ kind: "error", msg: `No connection. Please email ${profile.email}.` });
    }
  }

  if (state.kind === "sent") {
    return (
      <div className="kin-form" id="kin-form" role="status">
        <h2>
          <em>Message sent</em>
        </h2>
        <p className="kin-form-note">Thanks. I&rsquo;ll reply to your email soon.</p>
        <button type="button" className="kin-submit" onClick={() => {
            setStartedAt(Date.now());
            setState({ kind: "idle" });
          }}>
          Send another
        </button>
      </div>
    );
  }

  return (
    <form className="kin-form" id="kin-form" onSubmit={onSubmit}>
      <h2>
        <em>Let&rsquo;s build</em>
        <br />
        something bold
      </h2>
      <input name="name" required minLength={2} maxLength={80} autoComplete="name" placeholder="Your name" aria-label="Your name" />
      <input
        name="email"
        type="email"
        required
        maxLength={120}
        autoComplete="email"
        inputMode="email"
        placeholder="Contact email"
        aria-label="Contact email"
      />
      <select name="type" required defaultValue="" aria-label="Project type">
        <option value="" disabled>
          Project type
        </option>
        {hire.projectTypes.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      <textarea
        name="message"
        required
        minLength={10}
        maxLength={2000}
        rows={3}
        placeholder="What do you need, and by when?"
        aria-label="Message"
      />

      {/* a field people never see; bots fill it in */}
      <label aria-hidden className="kin-trap">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>

      <button type="submit" className="kin-submit" disabled={state.kind === "sending"}>
        {state.kind === "sending" ? "Sending…" : "Start now"}
      </button>
      <p className="kin-form-note" aria-live="polite" style={{ color: "#ff4a14" }}>
        {state.kind === "error" ? state.msg : ""}
      </p>
    </form>
  );
}
