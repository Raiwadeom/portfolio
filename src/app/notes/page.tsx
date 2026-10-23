import type { Metadata } from "next";
import { statSync } from "node:fs";
import path from "node:path";
import NotesList, { type NoteItem } from "@/components/notes/NotesList";
import { coverIcons } from "@/lib/covers";
import BizNav from "@/components/BizNav";
import BizSocial from "@/components/BizSocial";
import BizScroll from "@/components/BizScroll";
import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  WHATSAPP_LINK,
  YOUTUBE_HANDLE,
  YOUTUBE_URL,
  notes,
  series,
} from "@/lib/notes.config";
import styles from "./notes.module.css";

const title = "Free Notes | oruim.tech";
const description =
  "Free PDF notes on building with AI: Claude Code skills, the Vibe Coder's Playbook and more. Tap to download. By oruim.tech.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/notes" },
  openGraph: { title, description, url: "/notes", siteName: "oruim.tech", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

/** A note counts as ready only if its PDF is really in /public (checked at build). */
function sizeOf(file: string): string | null {
  if (!file.startsWith("/")) return null;
  try {
    const bytes = statSync(path.join(process.cwd(), "public", file)).size;
    return bytes >= 1_000_000 ? `${(bytes / 1_000_000).toFixed(1)} MB` : `${Math.round(bytes / 1000)} KB`;
  } catch {
    return null;
  }
}

export default function NotesPage() {
  const whatsappSet = !WHATSAPP_LINK.includes("REPLACE_ME");

  const items: NoteItem[] = notes.flatMap((n) => {
    const size = sizeOf(n.file);
    return size ? [{ ...n, size, icons: coverIcons(n.slug) }] : [];
  });

  return (
    <div className={styles.page}>
      <a href="#notes" className={styles.skip}>
        Skip to notes
      </a>

      <BizNav current="notes" />

      <header className={styles.header}>
        <p className={styles.brand}>oruim.tech</p>
        <h1 className={styles.title}>
          Free <span style={{ color: "#a9a8a0" }}>notes</span>
        </h1>
        <p className={styles.line}>{series.line}</p>
      </header>

      <main id="notes" className={styles.main}>
        <NotesList items={items} />
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
        ) : null}
      </footer>
      <BizSocial />
      <BizScroll />
    </div>
  );
}
