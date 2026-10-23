import type { CSSProperties } from "react";
import type { CoverIcon } from "@/lib/covers";
import styles from "./biz-cover.module.css";

/** Brand logos floating on a soft glow, filling its (relatively positioned) parent. */
export default function BizCover({ icons }: { icons: CoverIcon[] }) {
  if (icons.length === 0) return null;
  return (
    <span
      className={`${styles.cover} ${icons.length === 1 ? styles.solo : ""}`}
      style={{ "--brand": `#${icons[0].hex}` } as CSSProperties}
      aria-hidden
    >
      {icons.map((i) => (
        <span key={i.title} className={styles.icon}>
          <svg viewBox="0 0 24 24" role="img" aria-label={i.title}>
            <path d={i.path} fill={`#${i.hex}`} />
          </svg>
        </span>
      ))}
    </span>
  );
}
