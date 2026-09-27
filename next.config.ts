import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * Content Security Policy — the browser refuses anything not listed here.
 * Third parties the site actually talks to:
 *   open.spotify.com            iframe API script, the hidden player, oEmbed
 *   abacus.jasoncameron.dev     the visit counter
 *   https: images               Spotify cover art (served from rotating CDNs)
 * 'unsafe-inline' is needed because the pages are static — a per-request
 * nonce would force every page to render on the server.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://open.spotify.com${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data: https:",
  "font-src 'self'",
  "connect-src 'self' https://open.spotify.com https://abacus.jasoncameron.dev",
  "frame-src https://open.spotify.com",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // autoplay / encrypted-media are left alone so the Spotify player still works.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // RaktSetu now lives inside DnyanSetu, so its old case page points there.
  async redirects() {
    return [{ source: "/work/raktsetu", destination: "/work/dyan-setu", permanent: true }];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
