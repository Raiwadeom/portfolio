/**
 * ─────────────────────────────────────────────────────────────
 *  /notes — episode notes for "Full Stack, explained simply".
 *  To add an episode: drop the PDF in public/notes/ and add one
 *  object to `episodes`. Redeploy. That's it.
 * ─────────────────────────────────────────────────────────────
 */

/** Paste your WhatsApp community invite link here (https://chat.whatsapp.com/...). */
export const WHATSAPP_LINK = "https://chat.whatsapp.com/REPLACE_ME";

export const INSTAGRAM_URL = "https://instagram.com/oruim.tech";
export const INSTAGRAM_HANDLE = "@oruim.tech";

export const series = {
  channel: "oruim.tech",
  title: "Full Stack, explained simply",
  line: "Free notes for every episode. Tap to download.",
};

export type Episode = {
  ep: number;
  title: string;
  /** Path under /public, e.g. "/notes/ep01-url.pdf". Empty = "Coming soon". */
  file: string;
};

export const episodes: Episode[] = [
  { ep: 0, title: "Series overview: the full stack map", file: "/notes/ep00-series-overview.pdf" },
  { ep: 1, title: "What happens when you type a URL", file: "/notes/ep01-url.pdf" },
  { ep: 2, title: "HTML, CSS & JavaScript", file: "/notes/ep02-html-css-js.pdf" },
  { ep: 3, title: "Why everyone uses React", file: "/notes/ep03-react.pdf" },
  { ep: 4, title: "What is an API?", file: "/notes/ep04-api.pdf" },
  { ep: 5, title: "Frontend vs Backend vs Database", file: "/notes/ep05-frontend-backend-db.pdf" },
  { ep: 6, title: "SQL vs NoSQL", file: "/notes/ep06-sql-nosql.pdf" },
  { ep: 7, title: 'How "Sign in with Google" works', file: "/notes/ep07-oauth.pdf" },
  { ep: 8, title: "How cookies work", file: "/notes/ep08-cookies.pdf" },
  { ep: 9, title: "Why you see 404 errors", file: "/notes/ep09-404-errors.pdf" },
  { ep: 10, title: "Git & GitHub", file: "/notes/ep10-git-github.pdf" },
  { ep: 11, title: "Hosting & deployment", file: "/notes/ep11-hosting-deployment.pdf" },
  { ep: 12, title: "How LLMs work", file: "/notes/ep12-llm.pdf" },
  { ep: 13, title: "What is Docker?", file: "/notes/ep13-docker.pdf" },
  { ep: 14, title: "What is MCP?", file: "/notes/ep14-mcp.pdf" },
];
