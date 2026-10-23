import { bizOg, ogSize } from "@/lib/biz-og";

export const alt = "Services, oruim.tech";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return bizOg({
    kicker: "Services",
    title: "What I can",
    soft: "build for you",
    sub: "Business websites, archive sites, web apps and student platforms.",
    dots: ["#2f5bff", "#1f8a5b", "#c9a227"],
  });
}
