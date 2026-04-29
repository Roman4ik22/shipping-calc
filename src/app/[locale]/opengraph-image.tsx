import { ImageResponse } from "next/og";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { countries } from "@/lib/data";

export const runtime = "edge";
export const alt = "RateShips - Compare International Shipping Rates";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc = locale as Locale;

  return new ImageResponse(
    (
      <div style={{
        width: "100%", height: "100%",
        display: "flex", flexDirection: "column",
        padding: "80px 90px",
        backgroundColor: "#FAF7F2",
        backgroundImage:
          "radial-gradient(ellipse at top right, rgba(26,115,232,.18), transparent 60%), radial-gradient(ellipse at bottom left, rgba(242,201,76,.14), transparent 65%)",
      }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 50 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: "linear-gradient(135deg, #1A73E8, #2F88FF)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontSize: 28, fontWeight: 800,
          }}>R</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#0F172A", display: "flex" }}>
            RateShips
          </div>
        </div>

        {/* Headline — localized */}
        <div style={{
          fontSize: 72, fontWeight: 800, color: "#0F172A",
          letterSpacing: "-0.025em", lineHeight: 1.05, display: "flex",
          maxWidth: 980,
        }}>
          {t(loc, "compare_rates")}
        </div>

        {/* Sub-line */}
        <div style={{
          fontSize: 28, color: "#3F4A5C", marginTop: 26,
          maxWidth: 920, display: "flex", lineHeight: 1.3,
        }}>
          {t(loc, "site_description")}
        </div>

        {/* Bottom stats row */}
        <div style={{
          marginTop: "auto", display: "flex", gap: 36,
          alignItems: "baseline",
        }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 44, color: "#0F172A", fontWeight: 800 }}>{countries.length}+</span>
            <span style={{ fontSize: 22, color: "#6B7280" }}>countries</span>
          </div>
          <div style={{ display: "flex", color: "#D4CFC6", fontSize: 22 }}>·</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 44, color: "#0F172A", fontWeight: 800 }}>145+</span>
            <span style={{ fontSize: 22, color: "#6B7280" }}>carriers</span>
          </div>
          <div style={{ display: "flex", color: "#D4CFC6", fontSize: 22 }}>·</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 44, color: "#1A73E8", fontWeight: 800 }}>live</span>
            <span style={{ fontSize: 22, color: "#6B7280" }}>rates</span>
          </div>
          <div style={{ display: "flex", marginLeft: "auto", color: "#6B7280", fontSize: 22 }}>
            rateships.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
