import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Caveat, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "./landing.css";
import "./services.css";
import { profile, photo, links } from "@/lib/content";
import { YOUTUBE_URL } from "@/lib/notes.config";

/* Poster type for anything that shouts, a plain grotesque for anything that
   has to be read, and a mono for labels, forms and printed card stock. */
const display = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

/* The hand the name is signed in on the cover. */
const script = Caveat({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

/* The www address is the real one: the bare domain redirects to it, so every
   canonical, sitemap and social link has to name www or search engines see a
   loop. */
const SITE_URL = "https://www.omrushikeshraiwade.space";
const DESCRIPTION =
  "Omrushikesh Raiwade is a freelance web developer in India who builds fast, mobile-first websites, web apps and AI tools for businesses and organisations, end to end from first conversation to launch.";

/* Tells Google who this site is about and which profiles are the same person,
   so a search for the name can show the right site, links and card. */
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: profile.name,
      alternateName: ["Om Raiwade", "Omrushikesh", "oruim"],
      description: DESCRIPTION,
      inLanguage: "en",
      publisher: { "@id": `${SITE_URL}/#person` },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: profile.name,
      alternateName: ["Om Raiwade", "oruim"],
      url: SITE_URL,
      image: `${SITE_URL}${photo}`,
      jobTitle: "Web developer",
      description: DESCRIPTION,
      nationality: "Indian",
      email: `mailto:${profile.email}`,
      knowsAbout: ["Web development", "Next.js", "React", "AI tools", "Mobile apps"],
      sameAs: [...links.map((l) => l.href), YOUTUBE_URL].filter(Boolean),
    },
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#service`,
      name: `${profile.name} — Web development`,
      url: SITE_URL,
      image: `${SITE_URL}${photo}`,
      areaServed: "Worldwide",
      founder: { "@id": `${SITE_URL}/#person` },
      description: DESCRIPTION,
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${profile.name} — Web Developer | ${profile.role}`,
  description: DESCRIPTION,
  keywords: ["Omrushikesh Raiwade", "Om Raiwade", "web developer India", "freelance web developer", "Next.js developer", "web apps", "AI tools for business"],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: `${profile.name} — ${profile.role}`,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: profile.name,
    type: "website",
    images: [{ url: photo }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.role}`,
    description: DESCRIPTION,
    images: [photo],
  },
};

export const viewport: Viewport = {
  themeColor: "#050807",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${script.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Resolve the motion preference before first paint so CSS and GSAP agree. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{document.documentElement.setAttribute('data-motion',localStorage.getItem('motion')==='off'?'off':'on');}catch(e){document.documentElement.setAttribute('data-motion','on');}})();`,
          }}
        />
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
        {children}
      </body>
    </html>
  );
}
