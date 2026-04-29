import { ImageResponse } from "next/og";
import { getCarrierById } from "@/lib/data";
import { getCarrierReview } from "@/lib/reviews";

export const runtime = "edge";
export const alt = "Carrier overview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; carrier: string }>;
}) {
  const { carrier: carrierId } = await params;
  const carrier = getCarrierById(carrierId);

  if (!carrier) {
    return new ImageResponse(
      (
        <div style={{
          width: "100%", height: "100%",
          display: "flex", alignItems: "center", justifyContent: "center",
          backgroundColor: "#0F172A", color: "white", fontSize: 56, fontWeight: 700,
        }}>
          RateShips
        </div>
      ),
      { ...size }
    );
  }

  const review = getCarrierReview(carrier.id);
  const rating = review?.trustpilot.rating;
  const reviewCount = review?.trustpilot.reviews;

  return new ImageResponse(
    (
      <div style={{
        width: "100%", height: "100%",
        display: "flex", flexDirection: "column",
        padding: "70px 80px",
        backgroundColor: "#0F172A",
        backgroundImage:
          "radial-gradient(ellipse at top right, rgba(26,115,232,.18), transparent 65%), radial-gradient(ellipse at bottom left, rgba(242,201,76,.10), transparent 60%)",
      }}>
        {/* Top brand row */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 50 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #1A73E8, #2F88FF)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontSize: 22, fontWeight: 800,
          }}>R</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#E8F0FE", display: "flex" }}>RateShips</div>
        </div>

        {/* Carrier name */}
        <div style={{
          fontSize: 96, fontWeight: 800, color: "white",
          letterSpacing: "-0.025em", lineHeight: 1, display: "flex",
        }}>
          {carrier.name}
        </div>

        {/* Type badge */}
        <div style={{
          display: "flex", marginTop: 28, alignSelf: "flex-start",
          padding: "10px 20px", borderRadius: 999,
          backgroundColor: "rgba(255,255,255,.08)",
          border: "1px solid rgba(255,255,255,.14)",
          color: "#9CA3AF", fontSize: 22, fontWeight: 600, textTransform: "capitalize",
        }}>
          {carrier.type === "international" ? "Express courier" :
           carrier.type === "regional" ? "Regional carrier" : "Postal service"}
        </div>

        {/* Bottom stats row */}
        <div style={{
          marginTop: "auto", display: "flex", gap: 50,
          fontSize: 26, color: "#D1D5DB", alignItems: "center",
        }}>
          {rating && (
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span style={{ color: "#F2C94C", fontSize: 30 }}>★</span>
              <span style={{ color: "white", fontWeight: 700, fontSize: 32 }}>{rating.toFixed(1)}</span>
              {reviewCount && <span style={{ color: "#6B7280" }}>({reviewCount.toLocaleString()})</span>}
            </div>
          )}
          <div style={{ display: "flex" }}>
            {carrier.services.length} services
          </div>
          <div style={{ display: "flex", marginLeft: "auto", color: "#6B7280" }}>
            rateships.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
