"use client";

/** The download button. Fires a `notes:download` event so any analytics
    script can listen for it; nothing is sent anywhere by default. */
export default function DownloadLink({
  slug,
  title,
  file,
  className,
}: {
  slug: string;
  title: string;
  file: string;
  className: string;
}) {
  return (
    <a
      href={file}
      download
      className={className}
      aria-label={`Download PDF: ${title}`}
      onClick={() =>
        window.dispatchEvent(new CustomEvent("notes:download", { detail: { slug, file } }))
      }
    >
      Download PDF
      <svg viewBox="0 0 24 24" aria-hidden width="18" height="18">
        <path
          d="M12 4v11M7.6 11.2 12 15.6l4.4-4.4M5 19.5h14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}
