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
  ...(
    [
      ["ep00-series-overview", "Full Stack Ep 0: The full stack map", "A one-page map of how every part of the web fits together."],
      ["ep01-url", "Full Stack Ep 1: What happens when you type a URL", "What happens between typing a web address and seeing the page."],
      ["ep02-html-css-js", "Full Stack Ep 2: HTML, CSS & JavaScript", "What each of the three web languages does, side by side."],
      ["ep03-react", "Full Stack Ep 3: Why everyone uses React", "Why React became the default way to build interfaces."],
      ["ep04-api", "Full Stack Ep 4: What is an API?", "How apps ask other apps for data, explained simply."],
      ["ep05-frontend-backend-db", "Full Stack Ep 5: Frontend vs Backend vs Database", "The three layers of an app and what lives where."],
      ["ep06-sql-nosql", "Full Stack Ep 6: SQL vs NoSQL", "How the two kinds of database differ and when to pick each."],
      ["ep07-oauth", "Full Stack Ep 7: How \"Sign in with Google\" works", "The steps behind signing in with another account."],
      ["ep08-cookies", "Full Stack Ep 8: How cookies work", "How websites remember you between visits."],
      ["ep09-404-errors", "Full Stack Ep 9: Why you see 404 errors", "What HTTP error codes mean and why they appear."],
      ["ep10-git-github", "Full Stack Ep 10: Git & GitHub", "Saving versions of your code and sharing it with others."],
      ["ep11-hosting-deployment", "Full Stack Ep 11: Hosting & deployment", "How code on your laptop ends up on a live website."],
      ["ep12-llm", "Full Stack Ep 12: How LLMs work", "How AI language models turn a prompt into an answer."],
      ["ep13-docker", "Full Stack Ep 13: What is Docker?", "Why containers make apps run the same everywhere."],
      ["ep14-mcp", "Full Stack Ep 14: What is MCP?", "How AI tools connect to apps and data."],
    ] as const
  ).map(([slug, title, blurb]): Note => ({
    slug,
    title,
    blurb,
    tag: "Full Stack",
    pages: 1,
    file: `/notes/${slug}.pdf`,
  })),
];

/** The YouTube channel. Leave empty to show "coming soon" instead. */
export const YOUTUBE_URL = "https://www.youtube.com/@oruimtech";
export const YOUTUBE_HANDLE = "@oruimtech";
