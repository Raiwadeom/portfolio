import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { about, photo, profile, projects, stack } from "@/lib/content";
import styles from "../biz.module.css";

const title = "About oruim.tech";
const description = `oruim.tech is the business side of ${profile.name}: websites, web apps and AI tools for businesses and institutions.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/business/about" },
  openGraph: { title, description, url: "/business/about", siteName: "oruim.tech", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function AboutPage() {
  return (
    <>
      <section className={`${styles.wrap} ${styles.pageHead}`}>
        <p className={styles.kicker}>About</p>
        <h1 className={styles.h1}>
          Who is behind <em>oruim.tech</em>
        </h1>
        <p className={styles.copy}>{description}</p>
      </section>

      <section className={`${styles.wrap} ${styles.split}`}>
        <div className={styles.portrait}>
          <Image src={photo} alt={profile.name} width={560} height={700} className={styles.portraitImg} priority />
          <span className={styles.portraitCap}>
            {profile.name} · {profile.role}
          </span>
        </div>
        <div className={styles.prose}>
          {about.paras.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </section>

      <section className={`${styles.wrap} ${styles.section}`}>
        <p className={styles.kicker}>What I work with</p>
        <h2 className={styles.h2}>
          The tools <em>I build with</em>
        </h2>
        <div className={styles.stackGrid}>
          {stack.map((g) => (
            <div key={g.group} className={styles.stackCard}>
              <span className={`${styles.cardNum} ${styles.dot}`}>{g.n}</span>
              <h3>{g.group.charAt(0) + g.group.slice(1).toLowerCase()}</h3>
              <ul className={styles.chips}>
                {g.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className={`${styles.wrap} ${styles.section}`}>
        <p className={styles.kicker}>Shipped</p>
        <h2 className={styles.h2}>
          Products <em>that are live</em>
        </h2>
        <ul className={styles.grid}>
          {projects.map((p) => (
            <li key={p.slug}>
              <Link href={`/work/${p.slug}`} className={styles.card}>
                <span className={`${styles.cardNum} ${styles.dot}`}>{p.n}</span>
                <h3>{p.title}</h3>
                <p>{p.blurb}</p>
                <span className={styles.proof}>Read the case study →</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={`${styles.wrap} ${styles.section}`}>
        <div className={styles.cta}>
          <h2 className={styles.h2}>
            Have something <em>in mind?</em>
          </h2>
          <Link href="/business#contact" className={styles.pill}>
            <span className={styles.pillIcon}>→</span>
            Start a project
          </Link>
        </div>
      </section>
    </>
  );
}
