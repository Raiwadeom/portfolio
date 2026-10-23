import { Doto } from "next/font/google";
import BizNav from "@/components/BizNav";
import BizFooter from "@/components/BizFooter";
import BizSocial from "@/components/BizSocial";
import BizScroll from "@/components/BizScroll";
import styles from "./biz.module.css";

const doto = Doto({
  variable: "--font-doto",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${styles.page} ${doto.variable}`}>
      <BizNav current="home" />
      <main>{children}</main>
      <BizFooter />
      <BizSocial />
      <BizScroll />
    </div>
  );
}
