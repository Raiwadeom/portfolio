import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Overlays from "@/components/Overlays";
import { LicenceCard } from "@/components/Licence";
import { profile, projects } from "@/lib/content";

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

  return {
    title: `${p.title} — ${profile.name}`,
    description: p.blurb,
    openGraph: { title: `${p.title} — ${profile.name}`, description: p.blurb, type: "article" },
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) notFound();

  const i = projects.findIndex((x) => x.slug === slug);
  const next = projects[(i + 1) % projects.length];

  return (
    <>
      <Overlays />

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

        <div className="relative mx-auto max-w-[880px] px-[var(--gutter)] pb-[clamp(72px,12vh,140px)] pt-[clamp(56px,9vh,110px)]">
          {/* ── back ── */}
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/#work"
              className="label transition-colors hover:!text-[var(--color-amber)]"
            >
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

          {/* ── the write-up ── */}
          <h1 className="display mt-14 text-[clamp(2rem,9vw,4.5rem)] leading-[0.9] text-[var(--color-ice)]">
            {p.title}
          </h1>
          <p className="mt-5 max-w-[58ch] text-[14px] leading-relaxed text-[var(--color-dim)] sm:text-[15.5px]">
            {p.blurb}
          </p>

          <div className="mt-14 grid gap-12 md:grid-cols-[minmax(0,1fr)_240px] md:gap-14">
            <div>
              <h2 className="label !text-[var(--color-amber)]">/ NOTES</h2>
              <ul className="mt-5 space-y-5 border-t border-[var(--color-line-soft)] pt-5">
                {p.notes.map((n, k) => (
                  <li key={k} className="flex gap-4">
                    <span className="label shrink-0 pt-1">{String(k + 1).padStart(2, "0")}</span>
                    <p className="m-0 text-[13.5px] leading-relaxed text-[var(--color-ice)]">{n}</p>
                  </li>
                ))}
              </ul>
            </div>

            <aside>
              <h2 className="label !text-[var(--color-amber)]">/ WHAT IT DOES</h2>
              <ul className="mt-5 space-y-2.5 border-t border-[var(--color-line-soft)] pt-5">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2.5 text-[12px] leading-snug text-[var(--color-dim)]">
                    <span className="text-[var(--color-amber)]">·</span>
                    {f}
                  </li>
                ))}
              </ul>

              <h2 className="label mt-10 !text-[var(--color-amber)]">/ BUILT WITH</h2>
              <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--color-line-soft)] pt-4">
                {p.stack.map((s) => (
                  <span key={s} className="chip">
                    {s}
                  </span>
                ))}
              </div>

              <div className="mt-10 flex flex-col gap-3">
                {p.live ? (
                  <a
                    href={p.live}
                    target="_blank"
                    rel="noreferrer"
                    className="label border border-[var(--color-line)] px-4 py-3 text-center transition-colors hover:!text-[var(--color-amber)] hover:border-[var(--color-amber)]"
                  >
                    VISIT LIVE ↗
                  </a>
                ) : null}
                {p.repo ? (
                  <a
                    href={p.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="label border border-[var(--color-line)] px-4 py-3 text-center transition-colors hover:!text-[var(--color-amber)] hover:border-[var(--color-amber)]"
                  >
                    READ THE CODE ↗
                  </a>
                ) : null}
              </div>
            </aside>
          </div>

          {/* ── next ── */}
          <Link
            href={`/work/${next.slug}`}
            className="group mt-20 flex items-end justify-between gap-6 border-t border-[var(--color-line-soft)] pt-6"
          >
            <span>
              <span className="label">NEXT LICENCE</span>
              <span className="display mt-2 block text-[clamp(1.4rem,6vw,2.6rem)] leading-none text-[var(--color-ice)] transition-colors group-hover:text-[var(--color-amber)]">
                {next.title}
              </span>
            </span>
            <span className="label pb-1 transition-colors group-hover:!text-[var(--color-amber)]">→</span>
          </Link>
        </div>
      </main>
    </>
  );
}
