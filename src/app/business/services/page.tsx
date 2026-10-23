import type { Metadata } from "next";
import Link from "next/link";
import { hire } from "@/lib/content";
import { steps } from "@/lib/biz-data";
import styles from "../biz.module.css";

const title = "Services — oruim.tech";
const description =
  "Business websites, library and archive sites, web apps and student platforms, built from first conversation to launch.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/business/services" },
  openGraph: { title, description, url: "/business/services", siteName: "oruim.tech", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function ServicesPage() {
  return (
    <>
      <section className={`${styles.wrap} ${styles.pageHead}`}>
        <p className={styles.kicker}>Services</p>
        <h1 className={styles.h1}>
          What I can <em>build for you</em>
        </h1>
        <p className={styles.copy}>{hire.intro}</p>
      </section>

      <section className={styles.wrap}>
        <ul className={styles.grid}>
          {hire.services.map((s, i) => (
            <li key={s.title}>
              <Link href={s.proof?.href ?? "/contact"} className={styles.card}>
                <span className={`${styles.cardNum} ${styles.dot}`}>{String(i + 1).padStart(2, "0")}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                {s.proof ? <span className={styles.proof}>Proof: {s.proof.label} →</span> : null}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={`${styles.wrap} ${styles.section}`}>
        <p className={styles.kicker}>Process</p>
        <h2 className={styles.h2}>
          How a project <em>works</em>
        </h2>
        <ol className={styles.steps}>
          {steps.map((g, i) => (
            <li key={g.title} className={styles.step}>
              <span className={`${styles.stepNum} ${styles.dot}`}>{String(i + 1).padStart(2, "0")}</span>
              <strong>{g.title}</strong>
              <p>{g.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={`${styles.wrap} ${styles.section}`}>
        <div className={styles.cta}>
          <h2 className={styles.h2}>
            Ready <em>to start?</em>
          </h2>
          <Link href="/business#contact" className={styles.pill}>
            <span className={styles.pillIcon}>→</span>
            Tell me what you need
          </Link>
        </div>
      </section>
    </>
  );
}
