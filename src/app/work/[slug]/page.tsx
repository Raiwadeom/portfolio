import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Overlays from "@/components/Overlays";
import Chrome from "@/components/Chrome";
import KineticCase from "@/components/KineticCase";
import { profile, projects } from "@/lib/content";
import { getCaseStudy } from "@/lib/case-studies";

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

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) notFound();
  const c = getCaseStudy(slug);

  const i = projects.findIndex((x) => x.slug === slug);
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];

  /* every project uses the full-bleed "Kinetic" layout, footer included */
  return (
    <>
      <Overlays />
      <Chrome />
      <main className="relative min-h-[100svh]">
        <KineticCase p={p} c={c} prev={prev} next={next} />
      </main>
    </>
  );
}
