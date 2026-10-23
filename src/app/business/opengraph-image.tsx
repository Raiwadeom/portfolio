import { bizOg, ogSize } from "@/lib/biz-og";

export const alt = "oruim.tech, web apps and websites for business";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return bizOg({
    kicker: "Web apps and websites",
    title: "Business",
    soft: "That Ships.",
    sub: "Websites, web apps and AI tools for businesses, plus free PDF guides.",
    dots: ["#e0603a", "#2f5bff", "#1f8a5b"],
  });
}
