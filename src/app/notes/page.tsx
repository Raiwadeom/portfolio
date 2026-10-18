import type { Metadata } from "next";
import { Anton } from "next/font/google";
import { existsSync } from "node:fs";
import path from "node:path";
import DownloadLink from "@/components/notes/DownloadLink";
import BizNav from "@/components/BizNav";
import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  WHATSAPP_LINK,
  YOUTUBE_HANDLE,
  YOUTUBE_URL,
  episodes,
  series,
} from "@/lib/notes.config";
import styles from "./notes.module.css";

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const title = "Episode Notes | oruim.tech";
const description =
  "Free PDF notes for every episode of Full Stack, explained simply — cheat sheets on URLs, HTML/CSS/JS, React, APIs, databases and sign-in. By oruim.tech.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/notes" },
  openGraph: { title, description, url: "/notes", siteName: "oruim.tech", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

/** A file counts as ready only if it is really in /public (checked at build). */
function isReady(file: string) {
  if (!file || !file.startsWith("/")) return false;
  return existsSync(path.join(process.cwd(), "public", file));
}

export default function NotesPage() {
  const whatsappSet = !WHATSAPP_LINK.includes("REPLACE_ME");

  return (
    <div className={`${styles.page} ${anton.variable}`}>
      <a href="#episodes" className={styles.skip}>
        Skip to episodes
      </a>

      <BizNav current="notes" />

      <header className={styles.header}>
        <p className={styles.brand}>oruim.tech</p>
        <h1 className={styles.title}>{series.title}</h1>
        <p className={styles.line}>{series.line}</p>
      </header>

      <main id="episodes" className={styles.main}>
        <ol className={styles.list}>
          {episodes.map((e, i) => {
            const ready = isReady(e.file);
            return (
              <li
                key={e.ep}
                className={styles.item}
                style={{ ["--i" as string]: i, ["--tilt" as string]: `${i % 2 ? 1.1 : -1.1}deg` }}
              >
                <article className={`${styles.card} ${ready ? "" : styles.soon}`}>
                  <span className={styles.tape} aria-hidden />
                  <span className={styles.num}>
                    <span className={styles.numLabel}>EP</span>
                    {String(e.ep).padStart(2, "0")}
                  </span>
                  <h2 className={styles.cardTitle}>{e.title}</h2>
                  {ready ? (
                    <DownloadLink
                      ep={e.ep}
                      title={e.title}
                      file={e.file}
                      className={styles.btn}
                    />
                  ) : (
                    <span className={`${styles.btn} ${styles.btnOff}`} aria-disabled="true">
                      Coming soon
                    </span>
                  )}
                </article>
              </li>
            );
          })}
        </ol>
      </main>

      <footer className={styles.footer}>
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener" className={styles.follow}>
          Follow {INSTAGRAM_HANDLE} on Instagram
        </a>
        {YOUTUBE_URL ? (
          <a href={YOUTUBE_URL} target="_blank" rel="noopener" className={styles.follow}>
            Subscribe {YOUTUBE_HANDLE} on YouTube
          </a>
        ) : null}
        {whatsappSet ? (
          <a href={WHATSAPP_LINK} target="_blank" rel="noopener" className={styles.join}>
            Join the Student Developers Hub
          </a>
        ) : (
          <span className={`${styles.join} ${styles.btnOff}`} aria-disabled="true">
            Student Developers Hub — link coming soon
          </span>
        )}
      </footer>
    </div>
  );
}
