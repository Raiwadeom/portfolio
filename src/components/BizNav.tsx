import Link from "next/link";
import styles from "@/app/business/biz.module.css";

/**
 * The business side's own top bar, on /business and /notes. It is a plain
 * server component: links only, with a way back to the portfolio.
 */
export default function BizNav({ current }: { current?: "home" | "notes" }) {
  return (
    <header className={styles.nav}>
      <nav className={styles.navRow} aria-label="oruim.tech">
        <Link href="/business" className={styles.logo}>
          oruim.tech
        </Link>
        <ul className={styles.links}>
          <li>
            <Link href="/business#about">About</Link>
          </li>
          <li>
            <Link href="/business#services">Services</Link>
          </li>
          <li>
            <Link href="/notes" aria-current={current === "notes" ? "page" : undefined}>
              Episode notes
            </Link>
          </li>
          <li>
            <Link href="/business#follow">Follow</Link>
          </li>
          <li>
            <Link href="/business#contact">Contact</Link>
          </li>
        </ul>
        <Link href="/" className={styles.back}>
          ← Portfolio
        </Link>
      </nav>
    </header>
  );
}
