"use client";

/**
 * The short enquiry form: name, email, project type, message.
 * Posts to /api/contact, which checks it and emails it on.
 */

import { useState, type FormEvent } from "react";
import { hire, profile } from "@/lib/content";

type State = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; msg: string };

const field =
  "mt-2 w-full rounded-[2px] border border-[var(--color-line)] bg-[var(--color-void)] px-3.5 py-3 text-[15px] text-[var(--color-ice)] outline-none transition-colors placeholder:text-[var(--color-dim)] focus-visible:border-[var(--color-amber)] focus-visible:ring-2 focus-visible:ring-[rgba(177,80,47,0.25)]";

export default function ContactForm() {
  const [state, setState] = useState<State>({ kind: "idle" });
  const [startedAt] = useState(() => Date.now());

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
      <div role="status" className="border border-[var(--color-line)] bg-[var(--color-void)] p-6 sm:p-8">
        <p className="display m-0 text-[clamp(1.6rem,6vw,2.4rem)] text-[var(--color-ice)]">Message sent</p>
        <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-dim)]">
          Thanks. I&rsquo;ll reply to your email soon.
        </p>
        <button type="button" onClick={() => setState({ kind: "idle" })} className="label mt-6 underline underline-offset-4 hover:!text-[var(--color-amber)]">
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate={false} className="grid gap-5 sm:grid-cols-2">
      <label className="block">
        <span className="label">Name</span>
        <input name="name" required minLength={2} maxLength={80} autoComplete="name" className={field} />
      </label>
      <label className="block">
        <span className="label">Email</span>
        <input name="email" type="email" required maxLength={120} autoComplete="email" inputMode="email" className={field} />
      </label>
      <label className="block sm:col-span-2">
        <span className="label">Project type</span>
        <select name="type" required defaultValue="" className={field}>
          <option value="" disabled>
            Choose one
          </option>
          {hire.projectTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>
      <label className="block sm:col-span-2">
        <span className="label">Message</span>
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={2000}
          rows={5}
          placeholder="What do you need, and by when?"
          className={`${field} resize-y`}
        />
      </label>

      {/* a field people never see; bots fill it in */}
      <label aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>

      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button
          type="submit"
          disabled={state.kind === "sending"}
          className="label inline-flex items-center gap-2 border border-[var(--color-amber)] bg-[var(--color-amber)] px-6 py-3.5 !text-[var(--color-void)] transition-colors hover:bg-[var(--color-amber-soft)] disabled:opacity-60"
        >
          {state.kind === "sending" ? "Sending…" : "Send message →"}
        </button>
        <p aria-live="polite" className="m-0 text-[13px] text-[var(--color-amber)]">
          {state.kind === "error" ? state.msg : ""}
        </p>
      </div>
    </form>
  );
}
