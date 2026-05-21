import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

export function generateOgImage(
  title: string,
  description: string,
  badge: string
): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #eef2ff 0%, #ffffff 55%, #f5f3ff 100%)",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          padding: "60px 80px",
          position: "relative",
        }}
      >
        {/* Decorative blob top-right */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: "rgba(99,102,241,0.12)",
            display: "flex",
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: "flex",
            backgroundColor: "#eef2ff",
            border: "1.5px solid #c7d2fe",
            borderRadius: 100,
            padding: "8px 22px",
            marginBottom: 36,
            color: "#4f46e5",
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          {badge}
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "#111827",
            textAlign: "center",
            lineHeight: 1.1,
            maxWidth: 920,
            marginBottom: 28,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {title}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 26,
            color: "#6b7280",
            textAlign: "center",
            maxWidth: 740,
            lineHeight: 1.5,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {description}
        </div>

        {/* Bottom branding */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: "#4f46e5",
              display: "flex",
            }}
          />
          <span style={{ color: "#9ca3af", fontSize: 18, fontWeight: 500 }}>
            mi-sitio-web
          </span>
        </div>
      </div>
    ),
    { ...ogSize }
  );
}
