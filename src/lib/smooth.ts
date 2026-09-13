import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const offset = -(window.innerWidth < 640 ? 56 : 64);
  if (instance) instance.scrollTo(el, { duration: 1.4, offset });
  else el.scrollIntoView({ behavior: "smooth" });
}
