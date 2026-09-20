import type { Metadata } from "next";
import Link from "next/link";
import SmoothScroll from "@/components/SmoothScroll";
import Overlays from "@/components/Overlays";
import Chrome from "@/components/Chrome";
import Work from "@/components/Work";
import Footer from "@/components/Footer";
import { profile } from "@/lib/content";

export const metadata: Metadata = {
  title: `Work — ${profile.name}`,
  description: "Selected projects, printed as licences.",
};

export default function WorkPage() {
  return (
    <>
      <SmoothScroll />
      <Overlays />
      <Chrome />

      <main className="relative min-h-[100svh] overflow-hidden bg-[var(--color-deep)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[120vh]"
          style={{
            background:
              "radial-gradient(ellipse 75% 55% at 50% 0%, rgba(122,140,92,0.22), transparent 70%)",
          }}
        />
        <div className="relative px-[var(--gutter)] pt-[clamp(88px,13vh,130px)]">
          <Link href="/" className="label transition-colors hover:!text-[var(--color-amber)]">
            ← BACK TO THE DESKTOP
          </Link>
        </div>

        <div className="relative">
          <Work />
        </div>
        <Footer />
      </main>
    </>
  );
}
