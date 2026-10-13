/**
 * Case-study text, one JSON file per project in src/content/case-studies.
 * See the README there for how to edit it.
 *
 * Anything starting with "TODO:" is a placeholder for a fact still missing.
 * It shows on localhost so the gaps are easy to spot, and is stripped from
 * the production build so the live site never shows a placeholder.
 */

import dyanSetu from "@/content/case-studies/dyan-setu.json";
import raktsetu from "@/content/case-studies/raktsetu.json";
import csmNewsDesk from "@/content/case-studies/csm-news-desk.json";

export type CaseStudy = {
  problem: string;
  why: string;
  solution: {
    summary: string;
    media: { video: string; image: string; alt: string };
  };
  tech: string[];
  wentWrong: { title: string; body: string }[];
  learned: string[];
  result: { value: string; label: string }[];
};

const files: Record<string, CaseStudy> = {
  "dyan-setu": dyanSetu,
  raktsetu,
  "csm-news-desk": csmNewsDesk,
};

/** Placeholders are visible while developing, never in production. */
export const SHOW_TODO = process.env.NODE_ENV !== "production";

export const isTodo = (s: string) => /TODO/.test(s);

/** Production: cut a string at its first "TODO" (or drop it if that's all). */
function clean(s: string) {
  if (SHOW_TODO) return s;
  return s.split(/\s*TODO\b/)[0].trim();
}

export function getCaseStudy(slug: string): CaseStudy | null {
  const c = files[slug];
  if (!c) return null;

  return {
    problem: clean(c.problem),
    why: clean(c.why),
    solution: { summary: clean(c.solution.summary), media: c.solution.media },
    tech: c.tech.map(clean).filter(Boolean),
    wentWrong: c.wentWrong
      .map((w) => ({ title: clean(w.title), body: clean(w.body) }))
      .filter((w) => w.title && w.body),
    learned: c.learned.map(clean).filter(Boolean),
    result: c.result.filter((r) => SHOW_TODO || (!isTodo(r.value) && !isTodo(r.label))),
  };
}
