import { bizOg, ogSize } from "@/lib/biz-og";

export const alt = "Guides, oruim.tech";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return bizOg({
    kicker: "Guide",
    title: "Guides to",
    soft: "download",
    sub: "Free PDF guides: tech stack, payments, Claude Code, Git and hosting.",
    dots: ["#e0603a", "#8a3ffc", "#1f8a5b"],
  });
}
