/**
 * Motion preference.
 *
 * Animation is ON by default for everyone — the scroll choreography is the
 * point of the site, and the on-screen toggle was removed by request.
 *
 * A visitor who has explicitly asked their OS for reduced motion AND wants
 * it respected here can still set `localStorage.motion = "off"`. The value
 * is mirrored onto <html data-motion> by an inline script in layout.tsx so
 * CSS and GSAP agree before the first paint.
 */

export const MOTION_KEY = "motion";

export function motionOn(): boolean {
  if (typeof document === "undefined") return true;
  return document.documentElement.getAttribute("data-motion") !== "off";
}

export function setMotion(on: boolean) {
  try {
    localStorage.setItem(MOTION_KEY, on ? "on" : "off");
  } catch {
    /* private mode — the attribute below still applies for this page view */
  }
  document.documentElement.setAttribute("data-motion", on ? "on" : "off");
  window.location.reload();
}
