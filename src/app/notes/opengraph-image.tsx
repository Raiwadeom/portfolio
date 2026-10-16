import { ImageResponse } from "next/og";

export const alt = "Episode Notes | oruim.tech";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#F4F1EA",
          color: "#111",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 36, fontWeight: 700, background: "#111", color: "#F4F1EA", padding: "6px 22px", alignSelf: "flex-start" }}>
          oruim.tech
        </div>
        <div style={{ display: "flex", fontSize: 120, fontWeight: 900, lineHeight: 1, marginTop: 40, textTransform: "uppercase" }}>
          Full Stack, explained simply
        </div>
        <div style={{ display: "flex", fontSize: 40, marginTop: 36, color: "#FF4D1F", fontWeight: 700 }}>
          Free PDF notes for every episode
        </div>
      </div>
    ),
    size
  );
}
