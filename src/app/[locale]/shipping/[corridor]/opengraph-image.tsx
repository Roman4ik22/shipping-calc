import { ImageResponse } from "next/og";
import { parseCorridorSlug, getCorridorData, getCountryName } from "@/lib/data";
import type { Locale } from "@/lib/types";

export const runtime = "edge";
export const alt = "Shipping rates comparison";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Tiny inline dictionary for the 3 short labels used here. Importing the full
 * i18n.ts (~9000 lines, thousands of translations) into the edge runtime
 * blew the bundle past its limit and produced a 502 on every corridor OG
 * route. Carriers/customs/blog OGs avoid the import for the same reason.
 *
 * If a locale isn't listed, we fall back to English — OG images are scraped
 * once and cached by social platforms, so the cost of a non-localized
 * preview for rare locales is acceptable.
 */
const LABELS: Record<string, { options: string; from: string; tagline: string }> = {
  en: { options: "shipping options", from: "from", tagline: "Compare shipping rates" },
  ru: { options: "вариантов доставки", from: "от", tagline: "Сравните тарифы доставки" },
  es: { options: "opciones de envío", from: "desde", tagline: "Compara tarifas de envío" },
  de: { options: "Versandoptionen", from: "ab", tagline: "Versandtarife vergleichen" },
  fr: { options: "options d'expédition", from: "à partir de", tagline: "Comparez les tarifs d'expédition" },
  pt: { options: "opções de envio", from: "a partir de", tagline: "Compare tarifas de envio" },
  zh: { options: "种发货选项", from: "起", tagline: "比较发货费率" },
  ja: { options: "の配送オプション", from: "から", tagline: "配送料金を比較" },
  ko: { options: "개의 배송 옵션", from: "부터", tagline: "배송 요금 비교" },
  ar: { options: "خيارات الشحن", from: "من", tagline: "قارن أسعار الشحن" },
  tr: { options: "kargo seçeneği", from: "başlangıç", tagline: "Kargo ücretlerini karşılaştır" },
  it: { options: "opzioni di spedizione", from: "da", tagline: "Confronta le tariffe di spedizione" },
};

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; corridor: string }>;
}) {
  const { locale, corridor } = await params;
  const loc = locale as Locale;
  const labels = LABELS[locale] ?? LABELS.en;
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
              {carrierCount} {labels.options}
            </span>
          )}
          {cheapest && <span>{labels.from} ${cheapest}</span>}
        </div>

        {/* Bottom tagline */}
        <div
          style={{
            marginTop: "auto",
            fontSize: 20,
            color: "#6b7280",
          }}
        >
          {labels.tagline} — rateships.com
        </div>
      </div>
    ),
    { ...size }
  );
}
