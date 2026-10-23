"use client";

import { useMemo, useState } from "react";
import DownloadLink from "./DownloadLink";
import BizCover from "@/components/BizCover";
import BizRow from "@/components/BizRow";
import type { CoverIcon } from "@/lib/covers";
import styles from "@/app/notes/notes.module.css";

export type NoteItem = {
  slug: string;
  title: string;
  blurb: string;
  tag: string;
  pages: number;
  file: string;
  size: string;
  icons: CoverIcon[];
};

/** Search + tag filter over the notes. Shows the filters only once there are enough notes to need them. */
export default function NotesList({ items }: { items: NoteItem[] }) {
  const [tag, setTag] = useState("All");
  const [q, setQ] = useState("");

  const tags = useMemo(() => ["All", ...Array.from(new Set(items.map((n) => n.tag)))], [items]);
  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter(
      (n) =>
        (tag === "All" || n.tag === tag) &&
        (!needle || `${n.title} ${n.blurb} ${n.tag}`.toLowerCase().includes(needle))
    );
  }, [items, tag, q]);

  const showFilters = items.length > 4;

  return (
    <>
      {showFilters ? (
        <div className={styles.tools}>
          <label className={styles.search}>
            <span className={styles.srOnly}>Search notes</span>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search notes…"
              autoComplete="off"
            />
          </label>
          <div className={styles.chips} role="group" aria-label="Filter by topic">
            {tags.map((t) => (
              <button
                key={t}
                type="button"
                className={`${styles.chip} ${t === tag ? styles.chipOn : ""}`}
                aria-pressed={t === tag}
                onClick={() => setTag(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <p className={styles.count} aria-live="polite">
        {shown.length} {shown.length === 1 ? "note" : "notes"}
      </p>

      <BizRow label="Free notes" gridOnDesktop className={styles.list}>
        {shown.map((n) => (
          <li key={n.slug} className={styles.row}>
            {n.icons.length ? (
              <div className={styles.cardCover}>
                <BizCover icons={n.icons} />
              </div>
            ) : null}
            <div className={styles.rowBody}>
              <span className={styles.rowTag}>{n.tag}</span>
              <h2 className={styles.rowTitle}>{n.title}</h2>
              <p className={styles.rowBlurb}>{n.blurb}</p>
              <p className={styles.rowMeta}>
                PDF · {n.pages} {n.pages === 1 ? "page" : "pages"} · {n.size}
              </p>
            </div>
            <DownloadLink slug={n.slug} title={n.title} file={n.file} className={styles.btn} />
          </li>
        ))}
      </BizRow>

      {shown.length === 0 ? <p className={styles.empty}>No notes match. Try another word.</p> : null}
    </>
  );
}
