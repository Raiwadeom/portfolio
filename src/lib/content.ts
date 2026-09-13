/**
 * ─────────────────────────────────────────────────────────────
 *  ALL SITE CONTENT LIVES HERE. Edit this file, nothing else.
 * ─────────────────────────────────────────────────────────────
 */

export const profile = {
  name: "Omrushikesh Raiwade",
  handle: "oruim",
  logo: "OM/RW",
  role: "Web Developer · AI Engineer",
  tagline: "Project & Team Management",
  location: "Udgir, Maharashtra, India",
  openTo: "Pune City — On-site / Hybrid / Remote",
  email: "raiwadeomrushikesh2@gmail.com",
  status: "OPEN TO WORK",
};

/**
 * Optional looping clip behind the room in the hero.
 *
 * Drop your own file in /public (e.g. /public/hero.mp4) and set `src`
 * to "/hero.mp4". Leave `src` empty and the CSS-drawn room is used
 * instead — no video, no extra download. `poster` is the still shown
 * before the clip has buffered.
 *
 * Use footage you own or are licensed to use.
 */
export const heroVideo = {
  src: "",
  poster: "",
  /* How much of the room's own lighting to keep over the clip (0–1). */
  scrim: 0.55,
};

/** The line that sits in the room, under the TV. Swap freely. */
export const heroQuote = {
  text: "We suffer more in imagination than in reality.",
  author: "Seneca",
};

export const about = {
  // Big scroll-revealed statement. Keep it short and punchy.
  statement:
    "Omrushikesh Raiwade builds web interfaces and AI systems out of Udgir, Maharashtra — full-stack by training, obsessive about the details nobody is paid to notice.",
  meta: [
    { k: "BASED", v: "Udgir, MH, India" },
    { k: "STUDYING", v: "BSc Computer Science" },
    { k: "FOCUS", v: "Web · AI · Python" },
    { k: "STATUS", v: "Open to work" },
  ],
};

export const services = [
  {
    n: "01",
    word: "BUILD",
    body: "Full-stack web applications end to end — Next.js and React on the front, Python and Node underneath. Trained through a complete full-stack bootcamp and sharpened on competitive programming.",
    tags: ["Next.js", "React", "Node", "Python"],
  },
  {
    n: "02",
    word: "DESIGN",
    body: "Interfaces that have a point of view. Layout, type, motion and the small interactions that make a product feel deliberate instead of assembled.",
    tags: ["UI", "Motion", "Figma", "Design systems"],
  },
  {
    n: "03",
    word: "AUTOMATE",
    body: "AI engineering and Python tooling — scripts, pipelines and model-backed features that remove the repetitive work from a process.",
    tags: ["AI", "Python", "APIs", "Tooling"],
  },
  {
    n: "04",
    word: "LEAD",
    body: "Ran the technical side of a competitive programming club for eight months: sessions, contests, judging and the people logistics around all of it.",
    tags: ["Team lead", "Mentoring", "Events"],
  },
];

/** Pulled from the repo descriptions on github.com/Raiwadeom. */
export const projects = [
  {
    n: "01",
    title: "RaktSetu",
    blurb:
      "A blood donor network, shipped on Google Play. Matches urgent requests to verified volunteer donors by real red-cell compatibility rather than exact blood group.",
    stack: ["React Native", "Expo", "Firebase", "TypeScript"],
    year: "2026",
    role: "Mobile & Backend",
    live: "",
    repo: "https://github.com/Raiwadeom/raktsetu",
  },
  {
    n: "02",
    title: "Dyan Setu",
    blurb:
      "A quiz-based learning platform — Vite on the front, Firebase for data and auth, with Vercel serverless routes handling the API.",
    stack: ["Vite", "Firebase", "Serverless", "JavaScript"],
    year: "2026",
    role: "Full Stack",
    live: "https://dyansetu.vercel.app",
    repo: "https://github.com/Raiwadeom/dyansetu",
  },
  {
    n: "03",
    title: "CSM News Desk",
    blurb:
      "A Pinterest-style public archive of a college's newspaper cuttings — open browsing with no sign-in, plus an admin area for uploads and collections.",
    stack: ["Next.js", "Firebase", "Cloudinary"],
    year: "2026",
    role: "Design & Build",
    live: "https://csm-news-desk.vercel.app",
    repo: "https://github.com/Raiwadeom/csm-news-desk",
  },
];

/** Grouped for the stack rows. Add or reorder freely. */
export const stack = [
  {
    n: "01",
    group: "FRONTEND",
    items: ["NEXT.JS", "REACT", "REACT NATIVE", "TYPESCRIPT", "TAILWIND"],
  },
  {
    n: "02",
    group: "BACKEND",
    items: ["FIREBASE", "NODE.JS", "PYTHON", "SERVERLESS", "CLOUDINARY"],
  },
  {
    n: "03",
    group: "TOOLING",
    items: ["EXPO", "VITE", "GIT", "VERCEL", "GSAP"],
  },
];

/**
 * The cinema section renders as a CRT channel switcher — one "channel"
 * per film. Posters live in /public/posters; swap a file to change a pick.
 */
export const cinema = {
  heading: "FAVOURITES",
  favorites: [
    {
      title: "The Lord of the Rings: The Fellowship of the Ring",
      short: "The Fellowship of the Ring",
      year: "2001",
      dir: "Peter Jackson",
      note: "Worldbuilding that never once explains itself.",
      poster: "/posters/fellowship.jpg",
    },
    {
      title: "The Batman",
      short: "The Batman",
      year: "2022",
      dir: "Matt Reeves",
      note: "Gotham has never felt this atmospheric.",
      poster: "/posters/the-batman.jpg",
    },
    {
      title: "Nightcrawler",
      short: "Nightcrawler",
      year: "2014",
      dir: "Dan Gilroy",
      note: "Ambition with the lights turned all the way up.",
      poster: "/posters/nightcrawler.jpg",
    },
    {
      title: "Drive",
      short: "Drive",
      year: "2011",
      dir: "Nicolas Winding Refn",
      note: "Says more in silence than most films do in dialogue.",
      poster: "/posters/drive.jpg",
    },
  ],
};

export const links = [
  {
    label: "GITHUB",
    short: "GH",
    handle: "@Raiwadeom",
    href: "https://github.com/Raiwadeom",
  },
  {
    label: "LINKEDIN",
    short: "IN",
    handle: "in/om-raiwade",
    href: "https://www.linkedin.com/in/om-raiwade/",
  },
  {
    label: "LETTERBOXD",
    short: "LB",
    handle: "@oruim",
    href: "https://letterboxd.com/oruim/",
  },
];

export const nav = [
  { n: "01", label: "ABOUT", id: "about" },
  { n: "02", label: "WHAT I DO", id: "services" },
  { n: "03", label: "WORK", id: "work" },
  { n: "04", label: "CONTACT", id: "contact" },
];
