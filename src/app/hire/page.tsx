import type { Metadata } from "next";
import SmoothScroll from "@/components/SmoothScroll";
import Overlays from "@/components/Overlays";
import Chrome from "@/components/Chrome";
import Hire from "@/components/Hire";
import { profile } from "@/lib/content";

const title = `Services — ${profile.name}`;
const description =
  "Business websites, library and archive sites, web apps and student platforms, from first conversation to launch. Each service comes with a real project as proof.";

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

      <main className="relative min-h-[100svh] bg-[#050505]">
        <Hire />
      </main>
    </>
  );
}
