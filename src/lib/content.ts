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
  email: "raiwadeomrushikesh@gmail.com",
  status: "OPEN TO WORK",
  /** Printed on the lanyard badge in the about section. */
  badgeNo: "SR-VISUAL-0051",
  dob: "—",
  nationality: "Indian",
};

/** The photo used for the desktop wallpaper and the lanyard badge. */
export const photo = "/portrait.jpg";

/** The line pinned to the desktop as a sticky note. Swap freely. */
export const heroQuote = {
  text: "We suffer more in imagination than in reality.",
  author: "Seneca",
};

/** Optional hero video asset. Empty src preserves the SpaceBackdrop fallback. */
export const heroVideo = {
  src: "",
  poster: "",
  scrim: 0.45,
};

/**
 * ─────────── THE COVER (first screen) ───────────
 *
 * A flat field of colour with the photograph blown up behind it, and a
 * printed card laid on top: polaroid paper-clipped on, name signed under it.
 */
export const cover = {
  /** The flat colour the whole screen is printed on. */
  field: "#c9bb98",
  /** Micro-type running up the left edge of the card. */
  spine: "PORTFOLIO 2026 — UDGIR, MAHARASHTRA — OPEN TO WORK",
  /** The signature. Two lines, written by hand. */
  sign: ["Omrushikesh", "Raiwade"],
  /** The row along the bottom of the card. */
  foot: ["WEB DEVELOPER", "AI ENGINEER", "FULL-STACK", "2026"],
  cue: "SCROLL",
};

/**
 * The about sheet — a landscape page held under a binder clip. `paras` are
 * the short blocks of copy on the left, `meta` fills the ID card beside it.
 */
export const about = {
  hello: "Hello!",
  paras: [
    "My name is Omrushikesh, and I build web interfaces and AI systems out of Udgir, Maharashtra. Full-stack by training — a complete bootcamp end to end, then competitive programming to sharpen the parts a bootcamp doesn't reach.",
    "I care about the details nobody is paid to notice: how a layout breathes, how a transition lands, how fast the thing actually is on a bad connection. I ran the technical side of a competitive programming club for eight months, so I have learned to care about the people around the code too.",
    "Currently open to work — Pune, on-site, hybrid or remote. Some of what I have shipped is further down the page. Thanks for reading.",
  ],
  skillsHeading: "What I work with",
  skills: [
    "Next.js / React",
    "React Native / Expo",
    "TypeScript",
    "Python",
    "Firebase",
    "Tailwind CSS",
  ],
  /** The two circled notes at the bottom of the sheet. */
  rings: [
    { n: "(1)", label: "Team lead" },
    { n: "(2)", label: "Competitive programming" },
  ],
  /** Printed on the ID card clipped to the sheet. */
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

/**
 * Pulled from the repo descriptions on github.com/Raiwadeom.
 *
 * Each project renders twice: as a licence card in the WORK section, and as
 * its own page at /work/<slug>. `notes` and `features` only appear on the
 * project page — add or trim rows freely.
 */
export const projects = [
  {
    n: "01",
    slug: "raktsetu",
    licence: "0001",
    title: "RaktSetu",
    kind: "Mobile App",
    blurb:
      "A blood donor network, shipped on Google Play. Matches urgent requests to verified volunteer donors by real red-cell compatibility rather than exact blood group.",
    stack: ["React Native", "Expo", "Firebase", "TypeScript"],
    year: "2026",
    role: "Mobile & Backend",
    status: "SHIPPED",
    tint: "#c2413c",
    live: "",
    repo: "https://github.com/Raiwadeom/raktsetu",
    notes: [
      "Matching runs on red-cell compatibility, not on an exact group string — the pool of usable donors for a request is wider than a naive match would return.",
      "Donors verify once and then answer requests; the app's job is to get a shortlist in front of a requester quickly rather than to run a social network.",
      "Built with Expo so one codebase covers both stores, with Firebase handling auth, data and notifications.",
    ],
    features: [
      "Compatibility-aware donor matching",
      "Verified volunteer donor profiles",
      "Urgent request broadcast",
      "Firebase auth and realtime data",
      "Published on Google Play",
    ],
  },
  {
    n: "02",
    slug: "dyan-setu",
    licence: "0002",
    title: "Dyan Setu",
    kind: "Web Platform",
    blurb:
      "A quiz-based learning platform — Vite on the front, Firebase for data and auth, with Vercel serverless routes handling the API.",
    stack: ["Vite", "Firebase", "Serverless", "JavaScript"],
    year: "2026",
    role: "Full Stack",
    status: "LIVE",
    tint: "#3b6ad4",
    live: "https://dyansetu.vercel.app",
    repo: "https://github.com/Raiwadeom/dyansetu",
    notes: [
      "Quizzes are the whole product surface: authoring, taking, scoring and reviewing, with nothing in between the learner and the next question.",
      "Vercel serverless routes sit between the client and Firebase so scoring logic never ships to the browser.",
      "Vite keeps the dev loop instant, which matters when most of the work is small interaction tuning.",
    ],
    features: [
      "Quiz authoring and delivery",
      "Firebase auth and data",
      "Serverless API routes on Vercel",
      "Scoring kept server-side",
    ],
  },
  {
    n: "03",
    slug: "csm-news-desk",
    licence: "0003",
    title: "CSM News Desk",
    kind: "Archive",
    blurb:
      "A Pinterest-style public archive of a college's newspaper cuttings — open browsing with no sign-in, plus an admin area for uploads and collections.",
    stack: ["Next.js", "Firebase", "Cloudinary"],
    year: "2026",
    role: "Design & Build",
    status: "LIVE",
    tint: "#c98a2b",
    live: "https://csmnewsdesk.com",
    repo: "https://github.com/Raiwadeom/csm-news-desk",
    notes: [
      "Reading is the default: the archive is fully public and needs no account, because an archive nobody can open is not an archive.",
      "A separate admin area handles uploads and grouping cuttings into collections.",
      "Cloudinary carries the image pipeline so scans stay sharp on a phone without shipping full-size files.",
    ],
    features: [
      "Masonry browsing, no sign-in",
      "Admin uploads and collections",
      "Cloudinary image pipeline",
      "Next.js App Router",
    ],
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
    {
      title: "The Social Network",
      short: "The Social Network",
      year: "2010",
      dir: "David Fincher",
      note: "A founding story told entirely through the friendships it burned.",
      poster: "/posters/social-network.png",
    },
    {
      title: "Suits",
      short: "Suits",
      year: "2011",
      dir: "Aaron Korsh",
      note: "The one show that made a closing argument feel like a heist.",
      poster: "/posters/suits.jpg",
    },
  ],
};

/**
 * ─────────── MUSIC ───────────
 *
 * Playback is real: each track's `uri` is handed to a hidden Spotify embed
 * that our own transport bar drives. Cover art and the canonical title are
 * pulled from Spotify's public oEmbed endpoint at runtime, so a link is the
 * only thing you ever have to paste.
 *
 * ➜ TO ADD A TRACK: in Spotify, right-click the song → Share → Copy Song Link,
 *   and drop it in `uri`. A full link, a spotify:track:… URI or a bare id all
 *   work. A track with an empty `uri` still shows — it just gets a drawn cover
 *   and no play button.
 *
 * `tint` colours the ambient glow behind the carousel while that track is up.
 * `playlist` is the whole-playlist link for the button under the player.
 */
export const music = {
  heading: "ON REPEAT",
  profile: "https://open.spotify.com/user/31uy4y7eeqzxoau2qymzfv36idje",
  playlist: "",
  tracks: [
    {
      title: "Blinding Lights",
      artist: "The Weeknd",
      tint: "#c8791f",
      uri: "https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b",
    },
    {
      title: "Sweater Weather",
      artist: "The Neighbourhood",
      tint: "#2f6f7d",
      uri: "https://open.spotify.com/track/2QjOHCTQ1Jl3zawyYOpxh6",
    },
    {
      title: "Peaches",
      artist: "Justin Bieber, Daniel Caesar, Giveon",
      tint: "#d1834f",
      uri: "https://open.spotify.com/track/4iJyoBOLtHqaGxP12qzhQI",
    },
    {
      title: "Treat You Better",
      artist: "Shawn Mendes",
      tint: "#456a99",
      uri: "https://open.spotify.com/track/3QGsuHI8jO1Rx4JWLUh9jd",
    },
    {
      title: "Nights",
      artist: "Frank Ocean",
      tint: "#6b5b8a",
      uri: "https://open.spotify.com/track/7eqoqGkKwgOaWNNHx90uEZ",
    },
    {
      title: "Kabhi Kabhi Aditi",
      artist: "Rashid Ali",
      tint: "#c2413c",
      uri: "https://open.spotify.com/track/3APdIdF8H0jsxSuGOqXedS",
    },
    {
      title: "Chaiyya Chaiyya",
      artist: "Sukhwinder Singh",
      tint: "#c98a2b",
      uri: "https://open.spotify.com/track/5H4rKylLnO8KrmdXTRhj5s",
    },
  ],
};

/**
 * ─────────── BOOKS ───────────
 *
 * A shelf of spines. Click one and the book swings out of the shelf to show
 * its cover. `tint` paints the spine, `cover` is the artwork in /public/books
 * (pulled from Open Library — replace any file to change a cover).
 * state: "READING" | "READ" | "NEXT"
 */
export const books = {
  heading: "FAVOURITE BOOKS",
  list: [
    {
      title: "Harry Potter",
      author: "J. K. Rowling",
      series: "The complete seven",
      state: "READ",
      tint: "#6b2f8a",
      cover: "/books/harry-potter.jpg",
      note: "Read it young enough that the castle still feels like a real address.",
    },
    {
      title: "Dune",
      author: "Frank Herbert",
      series: "Book one",
      state: "READING",
      tint: "#b3702a",
      cover: "/books/dune.jpg",
      note: "Politics, ecology and religion doing more worldbuilding than any map could.",
    },
    {
      title: "Marvel Comics",
      author: "Various",
      series: "Runs & collected editions",
      state: "READ",
      tint: "#c2413c",
      cover: "/books/marvel.jpg",
      note: "Where the habit of reading a story in panels started.",
    },
    {
      title: "Batman",
      author: "DC Comics",
      series: "The Gotham shelf",
      state: "READING",
      tint: "#2b3140",
      cover: "/books/batman.jpg",
      note: "The detective issues over the punching ones, every time.",
    },
    {
      title: "Pride and Prejudice",
      author: "Jane Austen",
      series: "The original rom-com",
      state: "READ",
      tint: "#a8455f",
      cover: "/books/pride-and-prejudice.jpg",
      note: "Two centuries on and nobody has improved on the formula.",
    },
    {
      title: "Bridget Jones's Diary",
      author: "Helen Fielding",
      series: "Rom-com",
      state: "READ",
      tint: "#c25b8a",
      cover: "/books/bridget-jones.jpg",
      note: "Pride and Prejudice with a cigarette count.",
    },
    {
      title: "The Hating Game",
      author: "Sally Thorne",
      series: "Rom-com",
      state: "NEXT",
      tint: "#8a4bb8",
      cover: "/books/the-hating-game.jpg",
      note: "Enemies to lovers, executed without apology.",
    },
    {
      title: "The Mountain Is You",
      author: "Brianna Wiest",
      series: "Self-development",
      state: "READ",
      tint: "#2f5d8a",
      cover: "/books/mountain-is-you.jpg",
      note: "Self-sabotage explained clearly enough to actually stop doing it.",
    },
    {
      title: "Shoe Dog",
      author: "Phil Knight",
      series: "Memoir — Nike",
      state: "READ",
      tint: "#c98a2b",
      cover: "/books/shoe-dog.jpg",
      note: "The founder memoir every other founder memoir is compared to.",
    },
  ],
};

/**
 * The visit counter in the footer.
 *
 * Counting happens on Abacus (abacus.jasoncameron.dev) — free, no key, no
 * account — so the site needs no backend. The pair below is the bucket the
 * count lives in; change it and the count starts again from zero. Clear
 * `namespace` to take the counter off the page entirely.
 */
/** The CV, linked from the cover. Clicking it downloads — no landing page,
    no viewer. Drop a new file in /public under the same name to update it. */
export const resume = {
  file: "/Om_Raiwade_Resume.pdf",
  label: "Résumé",
};

export const visitors = {
  namespace: "omraiwade-portfolio",
  key: "visits",
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

/** The nav bar. `icon` picks the glyph in Chrome.tsx. */
export const nav = [
  { n: "01", label: "ABOUT", id: "about", icon: "user" },
  { n: "02", label: "WHAT I DO", id: "services", icon: "spark" },
  { n: "03", label: "WORK", id: "work", icon: "grid" },
  { n: "04", label: "CONTACT", id: "contact", icon: "mail" },
];
