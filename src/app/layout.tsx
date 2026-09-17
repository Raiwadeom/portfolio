import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Caveat, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { profile, photo } from "@/lib/content";

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

const SITE_URL = "https://omrushikeshraiwade.space";
const DESCRIPTION =
  "Web developer and AI engineer from Udgir, Maharashtra. Full-stack interfaces, Python tooling and the details nobody is paid to notice.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${profile.name} — ${profile.role}`,
  description: DESCRIPTION,
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
      <body>{children}</body>
    </html>
  );
}
