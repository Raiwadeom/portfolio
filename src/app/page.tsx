import SmoothScroll from "@/components/SmoothScroll";
import Overlays from "@/components/Overlays";
import Chrome from "@/components/Chrome";
import Poster from "@/components/Poster";
import About from "@/components/About";
import Footer from "@/components/Footer";

/* The home page is the cover and the introduction. Work, hiring, contact
   and the library each live on their own page, reached from the nav. */
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
          {/* sage haze drifting down the page */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[120vh]"
            style={{
              background:
                "radial-gradient(ellipse 75% 55% at 50% 0%, rgba(122,140,92,0.22), transparent 70%)",
            }}
          />
          <div
            className="pointer-events-none absolute left-[-10%] top-[95vh] h-[70vw] w-[70vw] rounded-full opacity-60"
            style={{
              background: "radial-gradient(circle, rgba(122,140,92,0.18), transparent 65%)",
            }}
          />

          <div className="relative">
            <About />
          </div>

          <Footer />
        </div>
      </main>
    </>
  );
}
