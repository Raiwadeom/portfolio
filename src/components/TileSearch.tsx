"use client";

import { useMemo, useState, type CSSProperties } from "react";
import Image from "next/image";
import BizCover from "@/components/BizCover";
import BizRow from "@/components/BizRow";
import type { CoverIcon } from "@/lib/covers";
import styles from "@/app/business/biz.module.css";

export type TileItem = {
  key: string;
  href: string;
  /** "download" saves the PDF, "external" opens a new tab. */
  kind: "download" | "external";
  title: string;
  sub?: string;
  meta: string;
  /** Short word used when there is no logo or image. */
  label: string;
  icons: CoverIcon[];
  image?: string;
  tint: string;
};

/** A search box over a sideways row of cover tiles. */
export default function TileSearch({ items, label, placeholder }: { items: TileItem[]; label: string; placeholder: string }) {
  const [q, setQ] = useState("");
  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return needle ? items.filter((i) => `${i.title} ${i.sub ?? ""} ${i.meta} ${i.label}`.toLowerCase().includes(needle)) : items;
  }, [items, q]);

  return (
    <>
      <label className={styles.search}>
        <span className={styles.sr}>{placeholder}</span>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
        />
      </label>
      <p className={styles.searchCount} aria-live="polite">
        {shown.length} {shown.length === 1 ? "result" : "results"}
      </p>

      {shown.length === 0 ? (
        <p className={styles.searchEmpty}>Nothing matches. Try another word.</p>
      ) : (
        <BizRow label={label} key={q}>
          {shown.map((t, i) => (
            <li key={t.key}>
              <a
                href={t.href}
                className={styles.tileLink}
                {...(t.kind === "download" ? { download: true } : { target: "_blank", rel: "noopener noreferrer" })}
              >
                <span className={styles.tileArt} style={{ "--tint": t.tint } as CSSProperties}>
                  <span className={`${styles.tileNum} ${styles.dot}`}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={styles.tileBadge}>{t.kind === "download" ? "PDF" : "↗"}</span>
                  {t.image ? (
                    <Image src={t.image} alt="" fill sizes="250px" className={styles.tileImg} />
                  ) : t.icons.length ? (
                    <BizCover icons={t.icons} />
                  ) : (
                    <span className={`${styles.tileBig} ${styles.dot}`}>{t.label}</span>
                  )}
                </span>
                <strong className={styles.tileTitle}>{t.title}</strong>
                {t.sub ? <span className={styles.tileSub}>{t.sub}</span> : null}
                <span className={styles.tileMeta}>{t.meta}</span>
              </a>
            </li>
          ))}
        </BizRow>
      )}
    </>
  );
}
