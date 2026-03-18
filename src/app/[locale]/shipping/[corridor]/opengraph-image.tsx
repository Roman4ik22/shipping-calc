import { ImageResponse } from "next/og";
import { parseCorridorSlug, getCorridorData, getCountryName } from "@/lib/data";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/i18n";

export const runtime = "edge";
export const alt = "Shipping rates comparison";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; corridor: string }>;
}) {
  const { locale, corridor } = await params;
  const loc = locale as Locale;
  const parsed = parseCorridorSlug(corridor, loc);
  if (!parsed) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0a0e17",
            color: "white",
            fontSize: 48,
            fontWeight: 700,
          }}
        >
          RateShips
        </div>
      ),
      { ...size }
    );
  }

  const { origin, destination } = parsed;
  const originName = getCountryName(origin, loc);
  const destName = getCountryName(destination, loc);
  const corridorData = getCorridorData(origin.code, destination.code);
  const carrierCount = corridorData?.carriers.length ?? 0;
  const cheapest = corridorData?.carriers[0]?.rates.find(
    (r) => r.weight_kg === 1
  )?.price_usd;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 80px",
          backgroundColor: "#0a0e17",
          backgroundImage:
            "radial-gradient(ellipse at top left, rgba(59,130,246,0.15), transparent 60%)",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            fontSize: 28,
            fontWeight: 700,
            color: "#60a5fa",
            marginBottom: 30,
          }}
        >
          RateShips
        </div>

        {/* Route */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 20,
          }}
        >
          <span style={{ fontSize: 52, fontWeight: 700, color: "white" }}>
            {originName}
          </span>
          <span style={{ fontSize: 40, color: "#60a5fa" }}>→</span>
          <span style={{ fontSize: 52, fontWeight: 700, color: "white" }}>
            {destName}
          </span>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            gap: 40,
            fontSize: 22,
            color: "#9ca3af",
          }}
        >
          {carrierCount > 0 && (
            <span>
              {carrierCount} {t(loc, "shipping_options")}
            </span>
          )}
          {cheapest && <span>{t(loc, "from_price")} ${cheapest}</span>}
        </div>

        {/* Bottom tagline */}
        <div
          style={{
            marginTop: "auto",
            fontSize: 20,
            color: "#6b7280",
          }}
        >
          {t(loc, "compare_shipping_rates")} — rateships.com
        </div>
      </div>
    ),
    { ...size }
  );
}
