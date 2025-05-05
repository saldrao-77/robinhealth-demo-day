import { ImageResponse } from "next/og"

// Route segment config
export const runtime = "edge"

// Image metadata
export const alt = "Robin Health - Affordable Medical Imaging"
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

// Image generation
export default async function Image() {
  return new ImageResponse(
    // ImageResponse JSX element
    <div
      style={{
        fontSize: 128,
        background: "white",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: 48,
        backgroundImage: "linear-gradient(to bottom right, #f0f9ff, #e0f2fe)",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
        <div
          style={{
            width: 120,
            height: 120,
            background: "#3b82f6",
            borderRadius: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 80,
            fontWeight: "bold",
            marginRight: 24,
          }}
        >
          +
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 64, fontWeight: "bold", color: "#ef4444" }}>Robin</div>
          <div style={{ fontSize: 64, fontWeight: "bold", color: "#3b82f6" }}>Health</div>
        </div>
      </div>
      <div style={{ fontSize: 48, fontWeight: "bold", color: "#1e40af", textAlign: "center" }}>
        Affordable Medical Imaging
      </div>
      <div style={{ fontSize: 32, color: "#334155", marginTop: 24, textAlign: "center" }}>
        Save up to 90% on MRIs, CTs, and more
      </div>
    </div>,
    // ImageResponse options
    {
      ...size,
    },
  )
}
