import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "RateShips - Compare International Shipping Rates";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { locale: string } }) {
  const isRu = params.locale === "ru";
  return new ImageResponse(
    (
      <div style={{
        background: "#0a0a0a",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px",
      }}>
        <div style={{ fontSize: 72, fontWeight: 700, color: "white", marginBottom: 20 }}>
          RateShips
        </div>
        <div style={{ fontSize: 36, color: "#9ca3af", textAlign: "center", maxWidth: 800 }}>
          {isRu ? "Сравните тарифы от 134+ перевозчиков" : "Compare rates from 134+ carriers worldwide"}
        </div>
        <div style={{ display: "flex", gap: 40, marginTop: 40, color: "#6b7280", fontSize: 24 }}>
          <span>213 Countries</span>
          <span>•</span>
          <span>134+ Carriers</span>
          <span>•</span>
          <span>45K+ Routes</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
