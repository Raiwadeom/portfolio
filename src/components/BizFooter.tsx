import Link from "next/link";
import styles from "@/app/business/biz.module.css";

export default function BizFooter() {
  return (
    <footer className={`${styles.wrap} ${styles.footer}`}>
      <span>© oruim.tech 2026</span>
      <nav className={styles.footerLinks} aria-label="Footer">
        <Link href="/business/about">About</Link>
        <Link href="/business/services">Services</Link>
        <Link href="/notes">Free notes</Link>
        <Link href="/business/guide">Guide</Link>
        <Link href="/business/links">Links</Link>
        <Link href="/">← Portfolio</Link>
      </nav>
    </footer>
  );
}
