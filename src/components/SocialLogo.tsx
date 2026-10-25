import type { ReactNode } from "react";
import { siGithub, siInstagram } from "simple-icons";

/** simple-icons dropped the LinkedIn logo, so its "in" is drawn here. */
const linkedinPath =
  "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM2.5 9.75h4.96V21.5H2.5V9.75Zm7.9 0h4.75v1.6h.07c.66-1.25 2.27-2.57 4.68-2.57 5 0 5.9 3.29 5.9 7.57v5.15h-4.95v-4.57c0-1.09-.02-2.49-1.52-2.49-1.52 0-1.75 1.19-1.75 2.41v4.65H10.4V9.75Z";

/** Each button is the brand's own tile: its shape, background and mark. */
const tiles: Record<string, { tile: string; glyph: ReactNode }> = {
  GH: {
    tile: "rounded-full bg-[#181717]",
    glyph: <path d={siGithub.path} fill="#fff" />,
  },
  IN: {
    tile: "rounded-[9px] bg-[#0A66C2]",
    glyph: <path d={linkedinPath} fill="#fff" transform="translate(-1 -1)" />,
  },
  IG: {
    tile: "rounded-[10px] bg-[radial-gradient(circle_at_30%_107%,#fdf497_0%,#fdf497_5%,#fd5949_45%,#d6249f_60%,#285AEB_90%)]",
    glyph: <path d={siInstagram.path} fill="#fff" />,
  },
  LB: {
    tile: "rounded-full bg-[#14181C]",
    glyph: (
      <>
        <circle cx="5.2" cy="12" r="3.6" fill="#FF8000" />
        <circle cx="12" cy="12" r="3.6" fill="#00E054" />
        <circle cx="18.8" cy="12" r="3.6" fill="#40BCF4" />
      </>
    ),
  },
};

/**
 * A brand's own logo tile (shape, background and mark), keyed by the short
 * code in `links`. Size comes from `className`, e.g. "h-9 w-9".
 */
export default function SocialLogo({ short, className = "h-9 w-9" }: { short: string; className?: string }) {
  const t = tiles[short];
  if (!t) return null;
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center shadow-[0_2px_8px_-2px_rgba(0,0,0,0.4)] ${t.tile} ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-[56%] w-[56%]">
        {t.glyph}
      </svg>
    </span>
  );
}
