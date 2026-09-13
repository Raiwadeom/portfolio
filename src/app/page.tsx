import SmoothScroll from "@/components/SmoothScroll";
import Overlays from "@/components/Overlays";
import Chrome from "@/components/Chrome";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Work from "@/components/Work";
import Stack from "@/components/Stack";
import Cinema from "@/components/Cinema";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Overlays />
      <Chrome />

      <main className="relative">
        <Hero />

        {/* everything below reads as the inside of the screen */}
        <div className="relative bg-[var(--color-deep)] overflow-hidden">
          {/* soft phosphor glows drifting down the page */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[120vh]"
            style={{
              background:
                "radial-gradient(ellipse 75% 55% at 50% 0%, rgba(31,79,255,0.22), transparent 70%)",
            }}
          />
          <div
            className="pointer-events-none absolute left-[-10%] top-[95vh] w-[70vw] h-[70vw] rounded-full opacity-50"
            style={{
              background:
                "radial-gradient(circle, rgba(23,63,180,0.16), transparent 65%)",
            }}
          />
          <div
            className="pointer-events-none absolute right-[-15%] top-[210vh] w-[80vw] h-[80vw] rounded-full opacity-50"
            style={{
              background:
                "radial-gradient(circle, rgba(31,79,255,0.14), transparent 65%)",
            }}
          />

          <div className="relative">
            <About />
            <Services />
            <Work />
            <Stack />
            <Cinema />
            <Contact />
          </div>
        </div>
      </main>
    </>
  );
}
