import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import { hire, profile } from "@/lib/content";
import { notes } from "@/lib/notes.config";
import BizRow from "@/components/BizRow";
import BizCover from "@/components/BizCover";
import { coverIcons } from "@/lib/covers";
import { guides, links, tints } from "@/lib/biz-data";
import styles from "./biz.module.css";

const title = "oruim.tech — Web apps and websites for business";
const description =
  "oruim.tech builds web apps, websites and AI tools for businesses and institutions, and shares free PDF notes on building with AI.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/business" },
  openGraph: { title, description, url: "/business", siteName: "oruim.tech", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

/** The three live products, shown as tilted screenshot cards in the hero. */
const showcase = [
  { name: "RaktSetu", src: "/work/raktsetu.webp", href: "/work/raktsetu", cls: "cardL" },
  { name: "DnyanSetu", src: "/work/dnyansetu.webp", href: "/work/dyan-setu", cls: "cardC" },
  { name: "CSM News Desk", src: "/work/csmnewsdesk.webp", href: "/work/csm-news-desk", cls: "cardR" },
] as const;

const tint = (i: number) => ({ "--tint": tints[i % tints.length] }) as CSSProperties;

export default function BusinessPage() {
  const latest = notes.slice(0, 6);
  const pdfCount = notes.length + 3;

  return (
    <>
        {/* ── hero ── */}
        <section className={`${styles.wrap} ${styles.hero}`}>
          <h1 className={styles.sr}>Web apps built for your business · oruim.tech</h1>
          <p className={styles.heroKicker} aria-hidden>
            Web apps and websites for
          </p>
          <p className={styles.heroTitle} aria-hidden>
            <span>Business</span>
            <span className={styles.heroTitleSoft}>That Ships.</span>
          </p>
          <span className={styles.tag} aria-hidden>
            Live in weeks
          </span>
          <p className={styles.heroLead}>{hire.intro}</p>
          <div className={styles.heroActions}>
            <a href="#contact" className={styles.pill}>
              <span className={styles.pillIcon}>→</span>
              Start a project
            </a>
            <Link href="/notes" className={`${styles.pill} ${styles.pillLight}`}>
              <span className={styles.pillIcon}>↓</span>
              Free notes
            </Link>
          </div>

          <div className={styles.stage} aria-label="Live products">
            <span className={styles.glow} aria-hidden />
            {showcase.map((s) => (
              <Link key={s.name} href={s.href} className={`${styles.shot} ${styles[s.cls]}`}>
                <span className={styles.shotBar}>
                  <i />
                  <i />
                  <i />
                  <b>{s.name}</b>
                </span>
                <Image
                  src={s.src}
                  alt={`${s.name} screenshot`}
                  width={640}
                  height={400}
                  sizes="(max-width: 700px) 70vw, 340px"
                  className={styles.shotImg}
                  priority={s.cls === "cardC"}
                />
              </Link>
            ))}
          </div>
        </section>

        {/* ── stat panel ── */}
        <section className={styles.wrap} aria-label="At a glance">
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Live products</span>
              <span className={`${styles.statNum} ${styles.dot}`}>3</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Free PDF notes and guides</span>
              <span className={`${styles.statNum} ${styles.dot}`}>{pdfCount}</span>
            </div>
            <div className={styles.stat}>
              <p className={styles.statCopy}>
                Tell me what you need. You get a clear plan and a price before any code is written.
              </p>
              <a href="#contact" className={`${styles.pill} ${styles.pillLight}`} style={{ alignSelf: "flex-start" }}>
                <span className={styles.pillIcon}>→</span>
                Get in touch
              </a>
            </div>
          </div>
        </section>

        {/* ── tag line ── */}
        <section className={`${styles.wrap} ${styles.section} ${styles.tagSection}`} aria-label="oruim.tech">
          <span className={styles.tag}>oruim.tech</span>
          <p className={styles.tagLine}>
            Web apps <em>built</em> for your business.
          </p>
        </section>

        {/* ── about ── */}
        <section id="about" className={`${styles.wrap} ${styles.section} ${styles.about}`}>
          <span className={styles.blob} aria-hidden />
          <p className={styles.kicker}>About</p>
          <h2 className={styles.h2}>
            Introducing oruim.tech. <em>Websites, web apps and AI tools,</em> built for real businesses.
          </h2>
          <p className={styles.copy}>
            oruim.tech is the business side of {profile.name}. It builds for businesses, institutions and small
            teams, from the first conversation to the day it goes live. It also shares free PDF notes on building
            with AI, ready to download.
          </p>
          <Link href="/business/about" className={`${styles.pill} ${styles.pillLight} ${styles.seeAll}`}>
            <span className={styles.pillIcon}>→</span>
            Read more about us
          </Link>
        </section>

        {/* ── services ── */}
        <section id="services" className={`${styles.wrap} ${styles.section}`}>
          <p className={styles.kicker}>Services</p>
          <h2 className={styles.h2}>
            What I can <em>build for you</em>
          </h2>
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
          <Link href="/business/services" className={`${styles.pill} ${styles.pillLight} ${styles.seeAll}`}>
            <span className={styles.pillIcon}>→</span>
            All services and how I work
          </Link>
        </section>

        {/* ── free notes ── */}
        <section id="notes" className={`${styles.wrap} ${styles.section}`}>
          <div className={styles.head}>
            <div>
              <p className={styles.kicker}>Free notes</p>
              <h2 className={styles.h2}>
                Short PDFs on <em>building with AI</em>
              </h2>
            </div>
            <Link href="/notes" className={`${styles.pill} ${styles.pillLight}`}>
              <span className={styles.pillIcon}>→</span>
              All notes
            </Link>
          </div>
          <BizRow label="Free notes">
            {latest.map((n, i) => (
              <li key={n.slug} className={styles.tile}>
                <a href={n.file} download className={styles.tileLink}>
                  <span className={styles.tileArt} style={tint(i)}>
                    <span className={`${styles.tileNum} ${styles.dot}`}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={styles.tileBadge}>PDF</span>
                    {coverIcons(n.slug).length ? <BizCover icons={coverIcons(n.slug)} /> : <span className={`${styles.tileBig} ${styles.dot}`}>{n.tag}</span>}
                  </span>
                  <strong className={styles.tileTitle}>{n.title}</strong>
                  <span className={styles.tileSub}>{n.blurb}</span>
                  <span className={styles.tileMeta}>Free download</span>
                </a>
              </li>
            ))}
          </BizRow>
        </section>

        {/* ── guide ── */}
        <section id="guide" className={`${styles.wrap} ${styles.section}`}>
          <p className={styles.kicker}>Guide</p>
          <h2 className={styles.h2}>
            Guides to <em>download</em>
          </h2>
          <p className={styles.copy}>Free PDF guides for building and shipping a real product. Tap to download.</p>
          <Link href="/business/guide" className={`${styles.pill} ${styles.pillLight} ${styles.seeAll}`}>
            <span className={styles.pillIcon}>→</span>
            Open the guide page
          </Link>

          <BizRow label="Guides">
            {guides.map((g, i) => (
              <li key={g.file} className={styles.tile}>
                <a href={g.file} download className={styles.tileLink}>
                  <span className={styles.tileArt} style={tint(i + 1)}>
                    <span className={`${styles.tileNum} ${styles.dot}`}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={styles.tileBadge}>PDF</span>
                    {coverIcons(g.cover).length ? <BizCover icons={coverIcons(g.cover)} /> : <span className={`${styles.tileBig} ${styles.dot}`}>{g.label}</span>}
                  </span>
                  <strong className={styles.tileTitle}>{g.title}</strong>
                  <span className={styles.tileMeta}>Download</span>
                </a>
              </li>
            ))}
          </BizRow>
        </section>

        {/* ── links ── */}
        <section id="links" className={`${styles.wrap} ${styles.section}`}>
          <p className={styles.kicker}>Links</p>
          <h2 className={styles.h2}>
            Everything <em>in one place</em>
          </h2>
          <Link href="/business/links" className={`${styles.pill} ${styles.pillLight} ${styles.seeAll}`}>
            <span className={styles.pillIcon}>→</span>
            Open the links page
          </Link>

          <BizRow label="Links">
            {links.map((l, i) => (
              <li key={l.href} className={styles.tile}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className={styles.tileLink}>
                  <span className={styles.tileArt} style={tint(i + 2)}>
                    <span className={`${styles.tileNum} ${styles.dot}`}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={styles.tileBadge}>↗</span>
                    {l.image ? (
                      <Image src={l.image} alt="" fill sizes="250px" className={styles.tileImg} />
                    ) : coverIcons(l.cover ?? "").length ? (
                      <BizCover icons={coverIcons(l.cover ?? "")} />
                    ) : (
                      <span className={`${styles.tileBig} ${styles.dot}`}>{l.title}</span>
                    )}
                  </span>
                  <strong className={styles.tileTitle}>{l.label === "Project" ? l.title : l.label}</strong>
                  <span className={styles.tileMeta}>{l.note}</span>
                </a>
              </li>
            ))}
          </BizRow>
        </section>

        {/* ── contact ── */}
        <section id="contact" className={`${styles.wrap} ${styles.section}`}>
          <div className={styles.contactBox}>
            <p className={styles.kicker}>Contact</p>
            <h2 className={styles.h2}>
              Tell me <em>what you need</em>
            </h2>
            <a className={styles.mail} href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            <div className={styles.formBox}>
              <ContactForm variant="biz" />
            </div>
          </div>
        </section>
    </>
  );
}
