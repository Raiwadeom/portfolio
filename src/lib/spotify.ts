/**
 * Spotify, with no backend and no API keys.
 *
 * Two public endpoints do all the work:
 *
 *  • oEmbed  — https://open.spotify.com/oembed?url=…  returns the real title
 *    and cover art for any track/album/playlist. CORS-open, no auth.
 *  • the IFrame API — a script Spotify hosts that hands back a controller for
 *    a hidden embed, so our own transport bar can drive real playback.
 *
 * What a visitor actually hears: a 30-second preview if they are signed out,
 * and the full track if they are signed into Spotify in the same browser.
 * Full playback for signed-out visitors is not something any site can do.
 */

/** Accepts a full link, a spotify: URI, or a bare id, and returns a URI. */
export function toUri(input: string, kind: "track" | "playlist" | "album" = "track") {
  const v = input.trim();
  if (!v) return "";
  if (v.startsWith("spotify:")) return v;

  const m = v.match(/open\.spotify\.com\/(?:intl-[a-z]+\/)?(track|playlist|album|episode)\/([A-Za-z0-9]+)/);
  if (m) return `spotify:${m[1]}:${m[2]}`;

  if (/^[A-Za-z0-9]{22}$/.test(v)) return `spotify:${kind}:${v}`;
  return "";
}

/** The open.spotify.com link for a URI, for the "open in Spotify" fallbacks. */
export function toLink(uri: string) {
  const [, kind, id] = uri.split(":");
  return kind && id ? `https://open.spotify.com/${kind}/${id}` : "";
}

/** The player URL for a uri. `theme=0` is Spotify's dark player. */
export function toEmbed(uri: string) {
  const [, kind, id] = uri.split(":");
  return kind && id ? `https://open.spotify.com/embed/${kind}/${id}?theme=0` : "";
}

export type OEmbed = { title: string; thumbnail: string };

const cache = new Map<string, Promise<OEmbed | null>>();

/** Real title + cover art for a URI. Cached per page load. */
export function oembed(uri: string): Promise<OEmbed | null> {
  const link = toLink(uri);
  if (!link) return Promise.resolve(null);

  const hit = cache.get(link);
  if (hit) return hit;

  const req = fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(link)}`)
    .then((r) => (r.ok ? r.json() : null))
    .then((j) =>
      j?.thumbnail_url ? { title: j.title as string, thumbnail: j.thumbnail_url as string } : null
    )
    .catch(() => null);

  cache.set(link, req);
  return req;
}

/* ---------- the IFrame API ---------- */

export type SpotifyController = {
  loadUri: (uri: string) => void;
  play: () => void;
  pause: () => void;
  resume: () => void;
  togglePlay: () => void;
  seek: (seconds: number) => void;
  destroy: () => void;
  addListener: (event: string, cb: (e: { data: PlaybackData }) => void) => void;
};

export type PlaybackData = {
  isPaused: boolean;
  isBuffering: boolean;
  duration: number;
  position: number;
};

type IFrameApi = {
  createController: (
    el: HTMLElement,
    opts: { uri: string; width: string | number; height: string | number },
    cb: (c: SpotifyController) => void
  ) => void;
};

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: IFrameApi) => void;
  }
}

const SRC = "https://open.spotify.com/embed/iframe-api/v1";
let apiPromise: Promise<IFrameApi> | null = null;

/** Loads the API script once per page and resolves with the API object. */
export function loadIframeApi(): Promise<IFrameApi> {
  if (apiPromise) return apiPromise;

  apiPromise = new Promise<IFrameApi>((resolve, reject) => {
    if (typeof document === "undefined") return reject(new Error("server"));

    window.onSpotifyIframeApiReady = (api) => resolve(api);

    if (document.querySelector(`script[src="${SRC}"]`)) return;

    const s = document.createElement("script");
    s.src = SRC;
    s.async = true;
    s.onerror = () => reject(new Error("Spotify iframe API blocked"));
    document.head.appendChild(s);
  });

  return apiPromise;
}
