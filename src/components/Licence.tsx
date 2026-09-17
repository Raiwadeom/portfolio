import Link from "next/link";
import type { projects } from "@/lib/content";

type Project = (typeof projects)[number];

/**
 * A project, printed as a licence card.
 *
 * Same object in two places: dealt out in the WORK section (`compact`), and
 * pinned to the top of its own page at /work/<slug>.
 */
export function LicenceCard({
  p,
  compact = false,
}: {
  p: Project;
  compact?: boolean;
}) {
  return (
    <article className="paper rounded-[14px] p-2.5 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.95)]">
      <div className="paper-dash rounded-[10px] px-4 py-5 sm:px-6 sm:py-6">
        {/* ── top rule ── */}
        <div className="flex items-start justify-between gap-4">
          <span className="flex gap-1.5 text-[var(--accent)]">
            <Star />
            <Star />
            <Star className="hidden sm:block" />
          </span>
          <span className="text-right">
            <span className="paper-field block">#of licence</span>
            <span className="display block text-[clamp(1rem,3vw,1.5rem)] leading-none tracking-[0.18em] text-[#b3352f]">
              {p.licence}
            </span>
          </span>
        </div>

        <div className="mt-4 grid gap-5 sm:grid-cols-[minmax(0,118px)_minmax(0,1fr)] sm:gap-6">
          {/* ── left column: the "photo" and the barcode ──
               Side by side on a phone, stacked once there's a column for it. */}
          <div className="flex items-stretch gap-3.5 sm:block">
            <div
              className="paper-box relative aspect-[3/4] w-[96px] shrink-0 overflow-hidden rounded-[3px] sm:w-full"
              style={{
                background: `linear-gradient(155deg, ${p.tint}, ${p.tint}77 55%, #2a2a30)`,
              }}
            >
              <span className="absolute inset-0 flex items-end p-2">
                <span className="display text-[15px] leading-[0.95] text-white/95">
                  {p.title}
                </span>
              </span>
              <span
                aria-hidden
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)",
                  backgroundSize: "5px 5px",
                }}
              />
            </div>

            <div className="flex min-w-0 flex-1 flex-col justify-between sm:block">
              <span className="inline-block self-start text-[9px] font-bold tracking-tight sm:mt-2">
                <span className="marker">{p.status}</span>
              </span>

              <div>
                <div className="barcode mt-2.5 rounded-[1px]" aria-hidden />
                <div className="mt-1 truncate text-[8px] tracking-[0.12em] text-[var(--ink-soft)]">
                  OM-{p.slug.toUpperCase()}-{p.licence}
                </div>
              </div>
            </div>
          </div>

          {/* ── right column: the form ── */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-3">
              <h3 className="display m-0 text-[clamp(1.5rem,6vw,2.6rem)] leading-[0.86] text-[var(--ink)]">
                Project
              </h3>
              <span className="display text-[clamp(1rem,3.4vw,1.5rem)] leading-none text-[var(--ink-soft)]">
                Licence
              </span>
            </div>

            <p className="licence-fine mt-2 max-w-[46ch] text-[9px] leading-[1.55] text-[var(--ink-soft)]">
              This licence certifies the holder shipped the work described below,
              start to finish, and remains answerable for every decision in it.
            </p>

            <div className="mt-3.5 grid grid-cols-2 border-l border-t border-[rgba(22,22,28,0.55)] text-[var(--ink)]">
              <Field k="Project name" v={p.title} wide />
              <Field k="Year" v={p.year} />
              <Field k="Type" v={p.kind} />
              <Field k="Role" v={p.role} />
              <Field k="Status" v={p.status} />
            </div>

            <div className="mt-3 border border-[rgba(22,22,28,0.55)] px-2.5 py-2">
              <span className="paper-field block">Expertise</span>
              <span className="mt-0.5 block text-[10.5px] font-medium tracking-[0.04em]">
                {p.stack.join("  ·  ")}
              </span>
            </div>
          </div>
        </div>

        {/* ── bottom rule ── */}
        <div className="mt-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-t border-dashed border-[rgba(22,22,28,0.4)] pt-3">
          <span className="text-[9px] leading-[1.5] tracking-[0.14em] uppercase text-[var(--ink-soft)]">
            Valid until
            <span className="block text-[var(--ink)]">it stops being useful</span>
          </span>

          <span className="stamp hidden h-[62px] w-[62px] shrink-0 items-center justify-center text-center sm:flex">
            CERTI
            <br />
            FIED
          </span>

          <span className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] font-bold tracking-[0.14em] uppercase">
            {compact ? (
              <Link
                href={`/work/${p.slug}`}
                className="border-b-2 border-[var(--accent)] pb-0.5 text-[var(--accent)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
              >
                Open case →
              </Link>
            ) : null}
            {p.live ? (
              <a href={p.live} target="_blank" rel="noreferrer" className="hover:text-[var(--accent)]">
                Live ↗
              </a>
            ) : null}
            {p.repo ? (
              <a href={p.repo} target="_blank" rel="noreferrer" className="hover:text-[var(--accent)]">
                Code ↗
              </a>
            ) : null}
          </span>
        </div>
      </div>
    </article>
  );
}

function Field({ k, v, wide = false }: { k: string; v: string; wide?: boolean }) {
  return (
    <div
      className={`border-b border-r border-[rgba(22,22,28,0.55)] px-2.5 py-1.5 ${wide ? "col-span-2" : ""}`}
    >
      <span className="paper-field block">{k}</span>
      <span className="mt-0.5 block truncate text-[12px] font-medium tracking-[0.02em]">{v}</span>
    </div>
  );
}

function Star({ className = "" }: { className?: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="m12 2.5 2.7 6.6 7.1.5-5.4 4.6 1.7 6.9L12 17.4 5.9 21.1l1.7-6.9L2.2 9.6l7.1-.5Z" />
    </svg>
  );
}
