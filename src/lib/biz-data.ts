import { INSTAGRAM_HANDLE, INSTAGRAM_URL, YOUTUBE_HANDLE, YOUTUBE_URL } from "./notes.config";

/** Shared by the /business home preview and its detail pages. */

export const tints = ["#e0603a", "#2f5bff", "#1f8a5b", "#0e0e0e", "#c9a227", "#8a3ffc"];

export const steps = [
  { title: "Talk", body: "Tell me what you need and who it is for." },
  { title: "Plan", body: "We agree the pages, features and price before any code." },
  { title: "Build", body: "You see a working preview early and can ask for changes." },
  { title: "Launch", body: "Domain, hosting and security set up, then it goes live." },
  { title: "Support", body: "Fixes and updates after launch." },
];

/** Newest first: add a new guide at the TOP of this list. */
export const guides = [
  { label: "AI / ML", title: "AI & ML Roadmap", blurb: "A step-by-step path to learn AI and machine learning.", file: "/guides/Oruim-AI-ML-Roadmap-Guide.pdf", cover: "ai-ml-roadmap" },
  { label: "Data", title: "Data Analyst vs Data Scientist", blurb: "How the two careers differ and which one to pick.", file: "/guides/Oruim-Analyst-vs-Scientist-Guide.pdf", cover: "analyst-vs-scientist" },
  { label: "Checklist", title: "Website Checklist", blurb: "Everything to check before your website goes live.", file: "/guides/Oruim-Website-Checklist-Guide.pdf", cover: "website-checklist" },
  { label: "Stack", title: "SaaS Tech Stack", blurb: "Which tools to pick to build a SaaS product.", file: "/guides/Oruim-SaaS-Tech-Stack-Guide.pdf", cover: "saas-stack" },
  { label: "Pay", title: "Razorpay Payments", blurb: "Take payments on your site with Razorpay.", file: "/guides/Oruim-Razorpay-Payment-Guide.pdf", cover: "razorpay" },
  { label: "Prompts", title: "Claude Code Workflow Prompts", blurb: "Copy-paste prompts for a smooth Claude Code workflow.", file: "/guides/Oruim-Claude-Code-Workflow-Prompts.pdf", cover: "claude-workflow" },
  { label: "Vibe", title: "The Vibe Coder's Playbook", blurb: "Plan, design, build, test, secure and ship, step by step.", file: "/notes/vibe-coder-playbook.pdf", cover: "vibe-coder-playbook" },
  { label: "Git", title: "Git & GitHub", blurb: "Save versions of your code and share it with others.", file: "/notes/ep10-git-github.pdf", cover: "ep10-git-github" },
  { label: "Host", title: "Hosting & Deployment (Vercel, Hostinger)", blurb: "How code on your laptop ends up on a live website.", file: "/notes/ep11-hosting-deployment.pdf", cover: "ep11-hosting-deployment" },
];

/** Newest first: add a new link at the TOP of this list. */
export const links: { label: string; title: string; note: string; href: string; image?: string; cover?: string }[] = [
  { label: "Project", title: "DnyanSetu", note: "dnyansetu.online", href: "https://dnyansetu.online", image: "/work/dnyansetu.webp" },
  { label: "Project", title: "CSM News Desk", note: "csmnewsdesk.com", href: "https://csmnewsdesk.com", image: "/work/csmnewsdesk.webp" },
  { label: "Instagram", title: "Follow", note: INSTAGRAM_HANDLE, href: INSTAGRAM_URL, cover: "instagram" },
  ...(YOUTUBE_URL ? [{ label: "YouTube", title: "Subscribe", note: YOUTUBE_HANDLE, href: YOUTUBE_URL, cover: "youtube" }] : []),
];
