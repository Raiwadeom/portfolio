import type { ReactNode } from "react";
import Overlays from "./Overlays";

/**
 * The shell every page that isn't the desktop sits in: same room, same haze,
 * one way back. Keeps /music, /books and the project pages consistent.
 */
export default function Subpage({
  kicker,
  right,
  tint = "rgba(122,140,92,0.22)",
  children,
  max = "1100px",
}: {
  kicker: string;
  right?: string;
  tint?: string;
  children: ReactNode;
  max?: string;
}) {
  return (
    <>
      <Overlays />

      <main className="relative min-h-[100svh] overflow-hidden bg-[var(--color-deep)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[120vh]"
          style={{
            background: `radial-gradient(ellipse 80% 55% at 50% 0%, ${tint}, transparent 72%)`,
          }}
        />

        <div aria-hidden className="subpage-aurora">
          <span className="subpage-blob subpage-blob--a" style={{ background: tint }} />
          <span className="subpage-blob subpage-blob--b" />
          <span className="subpage-blob subpage-blob--c" />
        </div>

        <div
          className="subpage relative mx-auto px-[var(--gutter)] pb-[clamp(72px,12vh,140px)] pt-[clamp(48px,8vh,96px)]"
          style={{ maxWidth: max }}
        >
          <div className="flex items-center justify-end gap-4">
            <span className="label">{right ?? kicker}</span>
          </div>

          {children}
        </div>
      </main>
    </>
  );
}
