import type { Metadata } from "next";
import Link from "next/link";
import { Anton } from "next/font/google";
import BizNav from "@/components/BizNav";
import ContactForm from "@/components/ContactForm";
import { hire, profile } from "@/lib/content";
import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  YOUTUBE_HANDLE,
  YOUTUBE_URL,
  episodes,
  series,
} from "@/lib/notes.config";
import styles from "./biz.module.css";

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const title = "oruim.tech — Web apps and websites for business";
const description =
  "oruim.tech builds web apps, websites and AI tools for businesses and institutions, and teaches full stack in plain language with free episode notes.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/business" },
  openGraph: { title, description, url: "/business", siteName: "oruim.tech", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function BusinessPage() {
  const youtubeSet = YOUTUBE_URL.length > 0;
  const latest = [...episodes].reverse().slice(0, 4);

  return (
    <div className={`${styles.page} ${anton.variable}`}>
      <BizNav current="home" />

      <main>
        {/* ── hero ── */}
        <section className={`${styles.wrap} ${styles.hero}`}>
          <p className={styles.tag}>oruim.tech</p>
          <h1 className={styles.h1}>
            Web apps <mark>built</mark> for your business.
          </h1>
          <p className={styles.lead}>{hire.intro}</p>
          <div className={styles.actions}>
            <a href="#contact" className={styles.btn}>
              Start a project →
            </a>
            <Link href="/notes" className={`${styles.btn} ${styles.btnGhost}`}>
              Free episode notes
            </Link>
          </div>
        </section>

        {/* ── about the business ── */}
        <section id="about" className={`${styles.wrap} ${styles.section}`}>
          <p className={styles.kicker}>About</p>
          <h2 className={styles.h2}>What oruim.tech is</h2>
          <p className={styles.copy}>
            oruim.tech is the business side of {profile.name}. It builds websites, web apps and AI tools for
            businesses, institutions and small teams, from the first conversation to the day it goes live. It
            also runs &ldquo;{series.title}&rdquo;, a series that explains how the web works, with a free PDF
            note for every episode.
          </p>
        </section>

        {/* ── services ── */}
        <section id="services" className={`${styles.wrap} ${styles.section}`}>
          <p className={styles.kicker}>Services</p>
          <h2 className={styles.h2}>What I can build for you</h2>
          <ul className={styles.grid}>
            {hire.services.map((s) => (
              <li key={s.title}>
                <Link href={s.proof?.href ?? "/contact"} className={styles.card}>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                  {s.proof ? <span className={styles.proof}>Proof: {s.proof.label} →</span> : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* ── follow ── */}
        <section id="follow" className={`${styles.wrap} ${styles.section}`}>
          <p className={styles.kicker}>Follow</p>
          <h2 className={styles.h2}>Watch, follow, learn</h2>
          <div className={styles.follow}>
            {youtubeSet ? (
              <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" className={styles.followCard}>
                <small>YouTube</small>
                <strong>Subscribe</strong>
                <span>{YOUTUBE_HANDLE}</span>
              </a>
            ) : (
              <span className={`${styles.followCard} ${styles.followOff}`} aria-disabled="true">
                <small>YouTube</small>
                <strong>Subscribe</strong>
                <span>Channel link coming soon</span>
              </span>
            )}
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={styles.followCard}>
              <small>Instagram</small>
              <strong>Follow</strong>
              <span>{INSTAGRAM_HANDLE}</span>
            </a>
          </div>
        </section>

        {/* ── episode notes ── */}
        <section id="episodes" className={`${styles.wrap} ${styles.section}`}>
          <p className={styles.kicker}>Episode notes</p>
          <h2 className={styles.h2}>{series.title}</h2>
          <p className={styles.copy}>{series.line}</p>
          <ol className={styles.eps}>
            {latest.map((e) => (
              <li key={e.ep} className={styles.ep}>
                <span className={styles.epNum}>EP {String(e.ep).padStart(2, "0")}</span>
                <span className={styles.epTitle}>{e.title}</span>
              </li>
            ))}
          </ol>
          <div className={styles.actions}>
            <Link href="/notes" className={styles.btn}>
              All episodes and downloads →
            </Link>
          </div>
        </section>

        {/* ── contact ── */}
        <section id="contact" className={`${styles.wrap} ${styles.section}`}>
          <p className={styles.kicker}>Contact</p>
          <h2 className={styles.h2}>Tell me what you need</h2>
          <a className={styles.mail} href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <div className={styles.formBox}>
            <ContactForm />
          </div>
        </section>
      </main>

      <footer className={`${styles.wrap} ${styles.footer}`}>
        <span>© oruim.tech 2026</span>
        <Link href="/">← Back to portfolio</Link>
      </footer>
    </div>
  );
}
