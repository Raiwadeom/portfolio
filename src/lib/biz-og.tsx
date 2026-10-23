import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

type Og = { kicker: string; title: string; soft: string; sub: string; dots: string[] };

/** The share card for every /business page: warm grey, big two-tone title, floating colour tiles. */
export function bizOg({ kicker, title, soft, sub, dots }: Og) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#efeeea",
          color: "#0e0e0e",
          fontFamily: "sans-serif",
          padding: 72,
        }}
      >
        {/* soft glow */}
        <div
          style={{
            position: "absolute",
            right: -120,
            top: -80,
            width: 640,
            height: 640,
            borderRadius: 640,
            background: "radial-gradient(circle, rgba(167,139,250,0.35), rgba(239,238,234,0))",
            display: "flex",
          }}
        />
        {/* floating tiles */}
        {dots.map((c, i) => (
          <div
            key={c + i}
            style={{
              position: "absolute",
              right: 90 + (i % 2) * 150,
              top: 90 + i * 128,
              width: 150,
              height: 150,
              borderRadius: 40,
              background: "#fff",
              border: "2px solid rgba(14,14,14,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `rotate(${i % 2 ? 8 : -8}deg)`,
              boxShadow: "0 24px 50px rgba(14,14,14,0.14)",
            }}
          >
            <div style={{ width: 62, height: 62, borderRadius: 18, background: c, display: "flex" }} />
          </div>
        ))}

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 700 }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                fontSize: 30,
                fontWeight: 700,
                background: "linear-gradient(180deg,#4b4b49,#111)",
                color: "#fff",
                padding: "10px 26px",
                borderRadius: 99,
              }}
            >
              oruim.tech
            </div>
            <div style={{ display: "flex", fontSize: 28, marginLeft: 22, color: "#8c8b84" }}>{kicker}</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 112, fontWeight: 800, lineHeight: 0.98, letterSpacing: -4 }}>{title}</div>
            <div style={{ display: "flex", fontSize: 112, fontWeight: 800, lineHeight: 0.98, letterSpacing: -4, color: "#a9a8a0" }}>
              {soft}
            </div>
          </div>

          <div style={{ display: "flex", fontSize: 32, color: "#6b6a64", maxWidth: 640 }}>{sub}</div>
        </div>
      </div>
    ),
    ogSize
  );
}
