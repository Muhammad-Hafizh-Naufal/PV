import { ImageResponse } from "next/og";
export const alt = "Muhammad Hafizh Naufal — Full-Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#f7f7f3",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 76,
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", fontSize: 32, fontWeight: 700 }}>
        hafizh<span style={{ color: "#315cff" }}>.</span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 84,
          letterSpacing: -5,
          lineHeight: 1.05,
        }}
      >
        <span>Thoughtful code.</span>
        <span style={{ color: "#737373" }}>Useful things.</span>
      </div>
      <div style={{ display: "flex", fontSize: 21, color: "#555" }}>
        MUHAMMAD HAFIZH NAUFAL · WEB / AI / IT SYSTEMS
      </div>
    </div>,
    size,
  );
}
