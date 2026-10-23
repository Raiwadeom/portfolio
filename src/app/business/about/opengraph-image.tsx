import { bizOg, ogSize } from "@/lib/biz-og";

export const alt = "About oruim.tech";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return bizOg({
    kicker: "About",
    title: "Who is behind",
    soft: "oruim.tech",
    sub: "Websites, web apps and AI tools by Omrushikesh Raiwade.",
    dots: ["#0e0e0e", "#e0603a"],
  });
}
