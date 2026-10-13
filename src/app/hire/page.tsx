import type { Metadata } from "next";
import SmoothScroll from "@/components/SmoothScroll";
import Overlays from "@/components/Overlays";
import Chrome from "@/components/Chrome";
import Hire from "@/components/Hire";
import Footer from "@/components/Footer";
import { profile } from "@/lib/content";

const title = `Hire me — ${profile.name}`;
const description =
  "College websites, library and archive sites, web apps and student platforms, from first conversation to launch. Each service comes with a real project as proof.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/hire" },
  openGraph: { title, description, url: "/hire", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function HirePage() {
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
        <div className="relative">
          <Hire />
        </div>
        <Footer />
      </main>
    </>
  );
}
