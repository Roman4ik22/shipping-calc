import { ImageResponse } from "next/og";
import { getCountryBySlug, getCountryName } from "@/lib/data";
import { getCustomsInfo } from "@/lib/customs";
import { countryFlag } from "@/lib/flags";
import type { Locale } from "@/lib/types";

export const runtime = "edge";
export const alt = "Customs information";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; country: string }>;
}) {
  const { locale, country: slug } = await params;
  const loc = locale as Locale;
  const country = getCountryBySlug(slug, "en");

  if (!country) {
    return new ImageResponse(
      (
        <div style={{
          width: "100%", height: "100%",
          display: "flex", alignItems: "center", justifyContent: "center",
          backgroundColor: "#FAF7F2", color: "#0F172A", fontSize: 56, fontWeight: 700,
        }}>
          RateShips Customs
        </div>
      ),
      { ...size }
    );
  }

  const name = getCountryName(country, loc);
  const customs = getCustomsInfo(country.code);
  const flag = countryFlag(country.code);

  return new ImageResponse(
    (
      <div style={{
        width: "100%", height: "100%",
        display: "flex", flexDirection: "column",
        padding: "70px 80px",
        backgroundColor: "#FAF7F2",
        backgroundImage:
          "radial-gradient(ellipse at top right, rgba(26,115,232,.08), transparent 60%)",
      }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #1A73E8, #2F88FF)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontSize: 22, fontWeight: 800,
          }}>R</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#1E293B", display: "flex" }}>RateShips</div>
          <div style={{
            display: "flex", marginLeft: 16,
            padding: "5px 14px", borderRadius: 999,
            background: "#FDF6DF", color: "#92520C",
            fontSize: 18, fontWeight: 600,
          }}>
            Customs guide
          </div>
        </div>

        {/* Country headline */}
        <div style={{ display: "flex", alignItems: "center", gap: 28, marginTop: 20 }}>
          <div style={{ fontSize: 140, display: "flex", lineHeight: 1 }}>{flag}</div>
          <div style={{
            fontSize: 88, fontWeight: 800, color: "#0F172A",
            letterSpacing: "-0.025em", lineHeight: 1, display: "flex",
          }}>
            {name}
          </div>
        </div>

        {/* Bottom stats: VAT, de minimis */}
        <div style={{
          marginTop: "auto", display: "flex", gap: 40,
          fontSize: 28, color: "#3F4A5C", alignItems: "baseline",
        }}>
          {customs && (
            <>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 18, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  VAT
                </span>
                <span style={{ fontSize: 44, color: "#0F172A", fontWeight: 800, marginTop: 4 }}>
                  {customs.vat_rate}%
                </span>
              </div>
              {customs.de_minimis_usd > 0 && (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: 18, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    De minimis
                  </span>
                  <span style={{ fontSize: 44, color: "#0F172A", fontWeight: 800, marginTop: 4 }}>
                    ${customs.de_minimis_usd}
                  </span>
                </div>
              )}
            </>
          )}
          <div style={{
            display: "flex", marginLeft: "auto",
            color: "#6B7280", fontSize: 22, alignSelf: "flex-end",
          }}>
            rateships.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
