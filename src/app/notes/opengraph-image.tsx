import { bizOg, ogSize } from "@/lib/biz-og";

export const alt = "Free Notes | oruim.tech";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return bizOg({
    kicker: "Free notes",
    title: "Free",
    soft: "notes",
    sub: "Short PDF guides on building with AI. Tap to download.",
    dots: ["#e0603a", "#2f5bff", "#8a3ffc"],
  });
}
