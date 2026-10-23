import {
  siAnthropic,
  siClaude,
  siCloudflare,
  siDocker,
  siMongodb,
  siGit,
  siGithub,
  siGoogle,
  siGraphql,
  siHostinger,
  siHtml5,
  siCss,
  siElevenlabs,
  siInstagram,
  siJavascript,
  siModelcontextprotocol,
  siNextdotjs,
  siNodedotjs,
  siNumpy,
  siPandas,
  siPostgresql,
  siPostman,
  siPython,
  siPytorch,
  siRazorpay,
  siScikitlearn,
  siReact,
  siSupabase,
  siVercel,
  siYoutube,
  type SimpleIcon,
} from "simple-icons";

/** What a cover needs from a brand icon; plain data so client components can use it. */
export type CoverIcon = { title: string; path: string; hex: string };

const pick = (i: SimpleIcon): CoverIcon => ({ title: i.title, path: i.path, hex: i.hex });

/** Brand logos shown on each PDF's cover, keyed by the note's slug or a guide key. */
const covers: Record<string, SimpleIcon[]> = {
  "claude-code-skills": [siClaude],
  "vibe-coder-playbook": [siClaude, siNextdotjs, siVercel],
  "ep00-series-overview": [siReact, siNodedotjs, siPostgresql],
  "ep01-url": [siCloudflare],
  "ep02-html-css-js": [siHtml5, siCss, siJavascript],
  "ep03-react": [siReact],
  "ep04-api": [siPostman, siGraphql],
  "ep05-frontend-backend-db": [siReact, siNodedotjs, siPostgresql],
  "ep06-sql-nosql": [siPostgresql, siMongodb],
  "ep07-oauth": [siGoogle],
  "ep10-git-github": [siGit, siGithub],
  "ep11-hosting-deployment": [siVercel, siHostinger],
  "ep12-llm": [siClaude, siAnthropic],
  "ep13-docker": [siDocker],
  "ep14-mcp": [siModelcontextprotocol, siClaude],
  // guides
  "video-edits": [siClaude, siElevenlabs],
  "ai-ml-roadmap": [siPython, siPytorch, siScikitlearn],
  "analyst-vs-scientist": [siPandas, siNumpy, siPostgresql],
  "website-checklist": [siGoogle, siVercel, siCloudflare],
  "saas-stack": [siNextdotjs, siSupabase, siVercel],
  razorpay: [siRazorpay],
  "claude-workflow": [siClaude],
  // links
  instagram: [siInstagram],
  youtube: [siYoutube],
};

export function coverIcons(key: string): CoverIcon[] {
  return (covers[key] ?? []).map(pick);
}
