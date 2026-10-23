/**
 * The contact form's inbox. Checks the message, then emails it to you
 * through Resend (https://resend.com).
 *
 * Environment variables (set them in Vercel → Settings → Environment
 * Variables, never in code):
 *   RESEND_API_KEY      required, from resend.com → API Keys
 *   CONTACT_TO_EMAIL    where messages go (defaults to the email in content.ts)
 *   CONTACT_FROM_EMAIL  a sender on a domain you verified in Resend; without
 *                       one, Resend's test sender only delivers to your own
 *                       Resend account email
 */

import { hire, profile } from "@/lib/content";

const LIMIT = { name: 80, email: 120, message: 2000 };
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;

/* Best effort: serverless instances don't share memory, so this slows a
   spammer down rather than stopping one completely. */
const recent = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (hits.length >= MAX_PER_WINDOW) return true;
  hits.push(now);
  recent.set(ip, hits);
  if (recent.size > 5000) recent.clear();
  return false;
}

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const bad = (error: string, status = 400) => Response.json({ ok: false, error }, { status });

export async function POST(request: Request) {
  /* only accept posts that come from this site's own pages */
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin) {
    let sameSite = false;
    try {
      sameSite = new URL(origin).host === host;
    } catch {}
    if (!sameSite) return bad("Not allowed.", 403);
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return bad("That didn't come through. Please try again.");
  }

  const str = (k: string) => (typeof body[k] === "string" ? (body[k] as string).trim() : "");
  const name = str("name");
  const email = str("email");
  const type = str("type");
  const message = str("message");

  /* bots fill the hidden field, or submit faster than a person can type */
  const startedAt = Number(body.startedAt);
  if (str("website") || !startedAt || Date.now() - startedAt < 3000) {
    return Response.json({ ok: true });
  }

  if (name.length < 2 || name.length > LIMIT.name) return bad("Please enter your name.");
  if (email.length > LIMIT.email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
    return bad("Please enter a valid email address.");
  if (!hire.projectTypes.includes(type)) return bad("Please pick a project type.");
  if (message.length < 10) return bad("Please tell me a little more (at least 10 characters).");
  if (message.length > LIMIT.message) return bad(`Please keep it under ${LIMIT.message} characters.`);

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) return bad("Too many messages. Please try again in a few minutes.", 429);

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return bad(`The form isn't set up yet. Please email me at ${profile.email}.`, 503);
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO_EMAIL || profile.email],
      reply_to: email,
      subject: `New enquiry: ${type} from ${name}`.slice(0, 150),
      text: `Name: ${name}\nEmail: ${email}\nProject: ${type}\n\n${message}`,
      html: `<p><b>Name:</b> ${escape(name)}<br><b>Email:</b> ${escape(email)}<br><b>Project:</b> ${escape(type)}</p><p style="white-space:pre-wrap">${escape(message)}</p>`,
    }),
  }).catch(() => null);

  if (!res?.ok) {
    return bad(`Sending failed. Please email me at ${profile.email}.`, 502);
  }
  return Response.json({ ok: true });
}
