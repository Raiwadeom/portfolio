"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "@/app/business/biz.module.css";

/**
 * The business side's own floating top bar, on /business and /notes. It is a
 * small client component only so it can mark the current page.
 */
export default function BizNav({ current }: { current?: "home" | "notes" }) {
  const path = usePathname() ?? "";
  const on = (href: string) => (path === href || (current === "notes" && href === "/notes") ? "page" : undefined);
  return (
    <header className={styles.nav}>
      <nav className={styles.navRow} aria-label="oruim.tech">
        <Link href="/business" className={styles.logo}>
          <span className={styles.logoMark} aria-hidden>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="#fff">
              {[
                [6, 2], [9, 2], [6, 5], [9, 5], [2, 6], [5, 6], [10, 6], [13, 6],
                [2, 9], [5, 9], [10, 9], [13, 9], [6, 10], [9, 10], [6, 13], [9, 13],
              ].map(([x, y]) => (
                <circle key={`${x}-${y}`} cx={x + 0.5} cy={y + 0.5} r="1.3" />
              ))}
            </svg>
          </span>
          oruim.tech
        </Link>
        <ul className={styles.links}>
          <li>
            <Link href="/business" aria-current={on("/business")}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/business/about" aria-current={on("/business/about")}>
              About
            </Link>
          </li>
          <li>
            <Link href="/business/services" aria-current={on("/business/services")}>
              Services
            </Link>
          </li>
          <li>
            <Link href="/notes" aria-current={on("/notes")}>
              Free notes
            </Link>
          </li>
          <li>
            <Link href="/business/guide" aria-current={on("/business/guide")}>
              Guide
            </Link>
          </li>
          <li>
            <Link href="/business/links" aria-current={on("/business/links")}>
              Links
            </Link>
          </li>
        </ul>
        <div className={styles.navRight}>
          <Link href="/" className={styles.back}>
            ← Portfolio
          </Link>
          <Link href="/business#contact" className={styles.navCta}>
            Start a project
          </Link>
        </div>
      </nav>
    </header>
  );
}
