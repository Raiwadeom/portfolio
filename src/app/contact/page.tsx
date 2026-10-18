import type { Metadata } from "next";
import SmoothScroll from "@/components/SmoothScroll";
import Overlays from "@/components/Overlays";
import Chrome from "@/components/Chrome";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { profile } from "@/lib/content";

export const metadata: Metadata = {
  title: `Contact — ${profile.name}`,
  description: "Every way to get in touch.",
};

export default function ContactPage() {
  return (
    <>
      <SmoothScroll />
      <Overlays />
      <Chrome />

      <main className="relative min-h-[100svh] bg-[#050505]">
        <Contact />
        <Footer />
      </main>
    </>
  );
}
