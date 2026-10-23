import type { Metadata } from "next";
import Link from "next/link";
import TileSearch from "@/components/TileSearch";
import { coverIcons } from "@/lib/covers";
import { guides, tints } from "@/lib/biz-data";
import styles from "../biz.module.css";

const title = "Guides — oruim.tech";
const description =
  "Free PDF guides for building and shipping a real product: tech stack, payments, Claude Code prompts, Git and hosting.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/business/guide" },
  openGraph: { title, description, url: "/business/guide", siteName: "oruim.tech", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function GuidePage() {
  return (
    <>
      <section className={`${styles.wrap} ${styles.pageHead}`}>
        <p className={styles.kicker}>Guide</p>
        <h1 className={styles.h1}>
          Guides to <em>download</em>
        </h1>
        <p className={styles.copy}>{description} Tap any guide to download the PDF.</p>
      </section>

      <section className={styles.wrap}>
        <TileSearch
          label="Guides"
          placeholder="Search guides…"
          items={guides.map((g, i) => ({
            key: g.file,
            href: g.file,
            kind: "download" as const,
            title: g.title,
            sub: g.blurb,
            meta: "Download",
            label: g.label,
            icons: coverIcons(g.cover),
            tint: tints[(i + 1) % tints.length],
          }))}
        />
      </section>

      <section className={`${styles.wrap} ${styles.section}`}>
        <div className={styles.cta}>
          <h2 className={styles.h2}>
            Want more <em>notes?</em>
          </h2>
          <Link href="/notes" className={styles.pill}>
            <span className={styles.pillIcon}>→</span>
            Free notes library
          </Link>
        </div>
      </section>
    </>
  );
}
