/**
 * ─────────────────────────────────────────────────────────────
 *  /notes — free PDF notes by oruim.tech.
 *  To add a note: drop the PDF in public/notes/ and add one
 *  object at the TOP of `notes` (newest first). Redeploy.
 * ─────────────────────────────────────────────────────────────
 */

/** Paste your WhatsApp community invite link here (https://chat.whatsapp.com/...). */
export const WHATSAPP_LINK = "https://chat.whatsapp.com/REPLACE_ME";

export const INSTAGRAM_URL = "https://www.instagram.com/oruim.tech";
export const INSTAGRAM_HANDLE = "@oruim.tech";

export const series = {
  channel: "oruim.tech",
  title: "Free notes",
  line: "Short PDF guides on building with AI. Tap to download.",
};

export type Note = {
  slug: string;
  title: string;
  /** One sentence: what you get from this PDF. */
  blurb: string;
  /** Group name shown as a filter chip, e.g. "Claude Code". */
  tag: string;
  pages: number;
  /** Path under /public, e.g. "/notes/claude-code-skills.pdf". */
  file: string;
};

/** Newest first. */
export const notes: Note[] = [
  {
    slug: "claude-code-skills",
    title: "Claude Code Skills",
    blurb: "Teach Claude your taste once, and get the same quality in every project.",
    tag: "Claude Code",
    pages: 1,
    file: "/notes/claude-code-skills.pdf",
  },
  {
    slug: "vibe-coder-playbook",
    title: "The Vibe Coder's Playbook",
    blurb:
      "Plan, design, build, test, secure, ship and pay for real web, mobile and AI projects, with copy-paste prompts for every step.",
    tag: "Playbook",
    pages: 19,
    file: "/notes/vibe-coder-playbook.pdf",
  },
];

/** The YouTube channel. Leave empty to show "coming soon" instead. */
export const YOUTUBE_URL = "https://www.youtube.com/@oruimtech";
export const YOUTUBE_HANDLE = "@oruimtech";
