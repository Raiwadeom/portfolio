import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Overlays from "@/components/Overlays";
import Chrome from "@/components/Chrome";
import Footer from "@/components/Footer";
import { LicenceCard } from "@/components/Licence";
import ProjectMedia from "@/components/ProjectMedia";
import { profile, projects } from "@/lib/content";
import { getCaseStudy, isTodo } from "@/lib/case-studies";

type Params = { slug: string };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) return { title: "Not found" };

  const c = getCaseStudy(slug);
  const title = `${p.title} case study — ${profile.name}`;
  const description = c?.problem ? `${c.problem} ${p.blurb}`.slice(0, 160) : p.blurb;
  const image = c?.solution.media.image;

  return {
    title,
    description,
    alternates: { canonical: `/work/${slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: `/work/${slug}`,
      ...(image ? { images: [{ url: image, width: 1440, height: 900, alt: c?.solution.media.alt }] } : {}),
    },
    twitter: { card: "summary_large_image", title, description, ...(image ? { images: [image] } : {}) },
  };
}

/* a placeholder still waiting for a fact: only ever rendered on localhost */
function T({ children }: { children: string }) {
  return isTodo(children) ? (
    <span className="rounded-[2px] border border-dashed border-[var(--color-amber)] bg-[rgba(177,80,47,0.06)] px-1 italic">
      {children}
    </span>
  ) : (
    <>{children}</>
  );
}

function Block({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <section className="mt-16 sm:mt-20">
      <h2 className="flex items-baseline gap-4 border-b border-[var(--color-line-soft)] pb-4">
        <span className="label !text-[var(--color-amber)]">{n}</span>
        <span className="display text-[clamp(1.6rem,6vw,2.6rem)] leading-none text-[var(--color-ice)]">{title}</span>
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

const body = "m-0 max-w-[62ch] text-[15px] leading-relaxed text-[var(--color-ice)] sm:text-[16px]";
const btn =
  "label inline-flex items-center justify-center gap-2 border px-5 py-3.5 transition-colors";

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) notFound();
  const c = getCaseStudy(slug);

  const i = projects.findIndex((x) => x.slug === slug);
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];

  /* numbered in the order they actually appear, since empty ones drop out */
  let k = 0;
  const num = () => String(++k).padStart(2, "0");

  return (
    <>
      <Overlays />
      <Chrome />

      <main className="relative min-h-[100svh] overflow-hidden bg-[var(--color-deep)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[90vh]"
          style={{
            background: `radial-gradient(ellipse 70% 60% at 50% 0%, ${p.tint}33, transparent 70%)`,
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[120vh]"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 10%, rgba(122,140,92,0.22), transparent 72%)",
          }}
        />

        <article className="relative mx-auto max-w-[880px] px-[var(--gutter)] pb-[clamp(72px,12vh,140px)] pt-[clamp(88px,13vh,140px)]">
          {/* ── back ── */}
          <div className="flex items-center justify-between gap-4">
            <Link href="/work" className="label transition-colors hover:!text-[var(--color-amber)]">
              ← ALL WORK
            </Link>
            <span className="label">
              {p.n} / {String(projects.length).padStart(2, "0")}
            </span>
          </div>

          {/* ── the licence ── */}
          <div className="mt-8 sm:mt-12">
            <LicenceCard p={p} />
          </div>

          {/* ── title ── */}
          <p className="label mt-14 !text-[var(--color-amber)]">CASE STUDY · {p.kind}</p>
          <h1 className="display mt-3 text-[clamp(2.4rem,11vw,5rem)] leading-[0.9] text-[var(--color-ice)]">
            {p.title}
          </h1>
          <p className="mt-5 max-w-[58ch] text-[14px] leading-relaxed text-[var(--color-dim)] sm:text-[15.5px]">
            {p.blurb}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {p.live ? (
              <a
                href={p.live}
                target="_blank"
                rel="noreferrer"
                className={`${btn} border-[var(--color-amber)] bg-[var(--color-amber)] !text-[var(--color-void)] hover:bg-[var(--color-amber-soft)]`}
              >
                VISIT LIVE SITE ↗
              </a>
            ) : null}
            {p.repo ? (
              <a
                href={p.repo}
                target="_blank"
                rel="noreferrer"
                className={`${btn} border-[var(--color-line)] hover:border-[var(--color-amber)] hover:!text-[var(--color-amber)]`}
              >
                READ THE CODE ↗
              </a>
            ) : null}
          </div>

          {c ? (
            <>
              {c.problem ? (
                <Block n={num()} title="The problem">
                  <p className={body}><T>{c.problem}</T></p>
                </Block>
              ) : null}

              {c.why ? (
                <Block n={num()} title="Why I built it">
                  <p className={body}><T>{c.why}</T></p>
                </Block>
              ) : null}

              <Block n={num()} title="The solution">
                {c.solution.media.image ? (
                  <ProjectMedia
                    image={c.solution.media.image}
                    video={c.solution.media.video || undefined}
                    alt={c.solution.media.alt}
                    url={p.live}
                    priority
                  />
                ) : null}
                {c.solution.summary ? (
                  <p className={`${body} mt-8`}><T>{c.solution.summary}</T></p>
                ) : null}

                <div className="mt-10 grid gap-10 md:grid-cols-[220px_minmax(0,1fr)] md:gap-12">
                  <div>
                    <h3 className="label !text-[var(--color-amber)]">/ KEY FEATURES</h3>
                    <ul className="mt-4 space-y-2.5 border-t border-[var(--color-line-soft)] pt-4">
                      {p.features.map((f) => (
                        <li key={f} className="flex gap-2.5 text-[13px] leading-snug text-[var(--color-dim)]">
                          <span className="text-[var(--color-amber)]">·</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="label !text-[var(--color-amber)]">/ HOW IT WORKS</h3>
                    <ul className="mt-4 space-y-5 border-t border-[var(--color-line-soft)] pt-4">
                      {p.notes.map((n, j) => (
                        <li key={j} className="flex gap-4">
                          <span className="label shrink-0 pt-1">{String(j + 1).padStart(2, "0")}</span>
                          <p className="m-0 text-[13.5px] leading-relaxed text-[var(--color-ice)]">{n}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Block>

              {c.tech.length ? (
                <Block n={num()} title="Tech used">
                  <ul className="flex flex-wrap gap-2">
                    {c.tech.map((t) => (
                      <li key={t} className="chip !text-[10px] !py-1.5 !px-3"><T>{t}</T></li>
                    ))}
                  </ul>
                </Block>
              ) : null}

              {c.wentWrong.length ? (
                <Block n={num()} title="What went wrong">
                  <div className="space-y-6">
                    {c.wentWrong.map((w) => (
                      <div key={w.title} className="border-l-2 border-[var(--color-amber)] pl-5">
                        <h3 className="m-0 text-[16px] font-semibold text-[var(--color-ice)]"><T>{w.title}</T></h3>
                        <p className={`${body} mt-2 !text-[14.5px]`}><T>{w.body}</T></p>
                      </div>
                    ))}
                  </div>
                </Block>
              ) : null}

              {c.learned.length ? (
                <Block n={num()} title="What I learned">
                  <ol className="space-y-4">
                    {c.learned.map((l, j) => (
                      <li key={j} className="flex gap-4">
                        <span className="label shrink-0 pt-1 !text-[var(--color-amber)]">{String(j + 1).padStart(2, "0")}</span>
                        <p className={`${body} !text-[15px]`}><T>{l}</T></p>
                      </li>
                    ))}
                  </ol>
                </Block>
              ) : null}

              {c.result.length ? (
                <Block n={num()} title="The result">
                  <dl className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-px overflow-hidden border border-[var(--color-line-soft)] bg-[var(--color-line-soft)]">
                    {c.result.map((r) => (
                      <div key={r.label} className="flex flex-col-reverse bg-[var(--color-deep)] p-5 sm:p-6">
                        <dt className="label mt-3 !normal-case !tracking-[0.06em] !text-[12px]">{r.label}</dt>
                        <dd className="display m-0 text-[clamp(2rem,8vw,3.2rem)] leading-none text-[var(--color-amber)]">
                          <T>{r.value}</T>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </Block>
              ) : null}
            </>
          ) : null}

          {/* ── previous / next ── */}
          <nav aria-label="More projects" className="mt-24 grid grid-cols-2 gap-4 border-t border-[var(--color-line-soft)] pt-6">
            <Link href={`/work/${prev.slug}`} className="group">
              <span className="label">← PREVIOUS</span>
              <span className="display mt-2 block text-[clamp(1.2rem,5vw,2.2rem)] leading-none text-[var(--color-ice)] transition-colors group-hover:text-[var(--color-amber)]">
                {prev.title}
              </span>
            </Link>
            <Link href={`/work/${next.slug}`} className="group text-right">
              <span className="label">NEXT →</span>
              <span className="display mt-2 block text-[clamp(1.2rem,5vw,2.2rem)] leading-none text-[var(--color-ice)] transition-colors group-hover:text-[var(--color-amber)]">
                {next.title}
              </span>
            </Link>
          </nav>
        </article>

        <Footer />
      </main>
    </>
  );
}
