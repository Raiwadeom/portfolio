import { bizOg, ogSize } from "@/lib/biz-og";

export const alt = "Links, oruim.tech";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return bizOg({
    kicker: "Links",
    title: "Everything",
    soft: "in one place",
    sub: "Live projects, Instagram and YouTube.",
    dots: ["#e1306c", "#ff0000", "#2f5bff"],
  });
}
