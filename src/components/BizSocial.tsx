import styles from "@/app/business/biz.module.css";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, YOUTUBE_HANDLE, YOUTUBE_URL } from "@/lib/notes.config";

/** Floating tilted icon tiles fixed bottom-right on every /business page. Each opens the channel in a new tab. */
export default function BizSocial() {
  return (
    <div className={styles.social}>
        {YOUTUBE_URL ? (
          <a
            href={YOUTUBE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialItem}
            aria-label={`YouTube ${YOUTUBE_HANDLE}`}
          >
            <span className={`${styles.socialTile} ${styles.socialYt}`}>
              <svg viewBox="0 0 24 24" width="44" height="44" aria-hidden>
                <rect x="1.5" y="5" width="21" height="14" rx="4" fill="#ff0000" />
                <path d="M10 9l5.5 3-5.5 3z" fill="#fff" />
              </svg>
            </span>
          </a>
        ) : null}
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialItem}
          aria-label={`Instagram ${INSTAGRAM_HANDLE}`}
        >
          <span className={`${styles.socialTile} ${styles.socialIg}`}>
            <svg viewBox="0 0 24 24" width="44" height="44" aria-hidden>
              <defs>
                <linearGradient id="ig" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0" stopColor="#fdc468" />
                  <stop offset="0.45" stopColor="#e1306c" />
                  <stop offset="1" stopColor="#833ab4" />
                </linearGradient>
              </defs>
              <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" fill="none" stroke="url(#ig)" strokeWidth="2" />
              <circle cx="12" cy="12" r="4.2" fill="none" stroke="url(#ig)" strokeWidth="2" />
              <circle cx="17.3" cy="6.7" r="1.3" fill="url(#ig)" />
            </svg>
          </span>
        </a>
    </div>
  );
}
