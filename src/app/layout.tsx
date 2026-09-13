import type { Metadata, Viewport } from "next";
import { Orbitron, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { profile } from "@/lib/content";

const display = Orbitron({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.role}`,
  description:
    "Web developer and AI engineer from Udgir, Maharashtra. Full-stack interfaces, Python tooling and the details nobody is paid to notice.",
  openGraph: {
    title: `${profile.name} — ${profile.role}`,
    description: "Web developer and AI engineer. Full-stack interfaces and Python tooling.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#03060f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${mono.variable}`}
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
