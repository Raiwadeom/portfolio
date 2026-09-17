import SmoothScroll from "@/components/SmoothScroll";
import Overlays from "@/components/Overlays";
import Chrome from "@/components/Chrome";
import Poster from "@/components/Poster";
import About from "@/components/About";
import Services from "@/components/Services";
import Work from "@/components/Work";
import Stack from "@/components/Stack";
import Library from "@/components/Library";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Overlays />
      <Chrome />

      <main className="relative">
        <Poster />

        {/* everything below is what the sheet was covering */}
        <div className="relative overflow-hidden bg-[var(--color-deep)]">
          {/* teal haze drifting down the page, amber only where it's earned */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[120vh]"
            style={{
              background:
                "radial-gradient(ellipse 75% 55% at 50% 0%, rgba(45,110,105,0.35), transparent 70%)",
            }}
          />
          <div
            className="pointer-events-none absolute left-[-10%] top-[95vh] h-[70vw] w-[70vw] rounded-full opacity-60"
            style={{
              background: "radial-gradient(circle, rgba(29,74,72,0.3), transparent 65%)",
            }}
          />
          <div
            className="pointer-events-none absolute right-[-15%] top-[215vh] h-[80vw] w-[80vw] rounded-full opacity-45"
            style={{
              background: "radial-gradient(circle, rgba(224,160,44,0.1), transparent 65%)",
            }}
          />
          <div
            className="pointer-events-none absolute left-[-12%] top-[340vh] h-[75vw] w-[75vw] rounded-full opacity-55"
            style={{
              background: "radial-gradient(circle, rgba(29,74,72,0.26), transparent 65%)",
            }}
          />

          <div className="relative">
            <About />
            <Services />
            <Work />
            <Stack />
            <Library />
            <Contact />
          </div>
        </div>
      </main>
    </>
  );
}
