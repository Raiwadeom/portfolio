import type { Metadata } from "next";
import TileSearch from "@/components/TileSearch";
import { coverIcons } from "@/lib/covers";
import { links, tints } from "@/lib/biz-data";
import styles from "../biz.module.css";

const title = "Links — oruim.tech";
const description = "Live projects and where to follow oruim.tech on Instagram and YouTube.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/business/links" },
  openGraph: { title, description, url: "/business/links", siteName: "oruim.tech", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function LinksPage() {
  return (
    <>
      <section className={`${styles.wrap} ${styles.pageHead}`}>
        <p className={styles.kicker}>Links</p>
        <h1 className={styles.h1}>
          Everything <em>in one place</em>
        </h1>
        <p className={styles.copy}>{description}</p>
      </section>

      <section className={styles.wrap}>
        <TileSearch
          label="Links"
          placeholder="Search links…"
          items={links.map((l, i) => ({
            key: l.href,
            href: l.href,
            kind: "external" as const,
            title: l.label === "Project" ? l.title : l.label,
            meta: l.note,
            label: l.title,
            icons: coverIcons(l.cover ?? ""),
            image: l.image,
            tint: tints[(i + 2) % tints.length],
          }))}
        />
      </section>
    </>
  );
}
