"use client";

import { useState, useMemo } from "react";
import { countries } from "@/lib/data";
import DeliveryDateEstimator from "@/components/DeliveryDateEstimator";

const serviceProfiles = {
  express: { min: 1, max: 3, label_en: "Express", label_ru: "Экспресс" },
  standard: { min: 5, max: 10, label_en: "Standard", label_ru: "Стандарт" },
  economy: { min: 14, max: 30, label_en: "Economy", label_ru: "Эконом" },
};

function getRegion(code: string): string {
  const regions: Record<string, string[]> = {
    europe: ["GB", "DE", "FR", "IT", "ES", "NL", "BE", "AT", "CH", "SE", "NO", "DK", "FI", "PL", "CZ", "PT", "IE", "GR", "RO", "HU", "BG", "HR", "SK", "SI", "LT", "LV", "EE", "LU", "MT", "CY"],
    asia: ["CN", "JP", "KR", "IN", "SG", "TH", "MY", "VN", "ID", "PH", "TW", "HK"],
    namerica: ["US", "CA", "MX"],
    samerica: ["BR", "AR", "CL", "CO", "PE"],
    oceania: ["AU", "NZ"],
    mena: ["AE", "SA", "TR", "IL", "EG", "QA", "KW", "BH", "OM", "JO"],
    africa: ["ZA", "NG", "KE", "GH", "TZ", "ET"],
    cis: ["RU", "UA", "KZ", "BY", "UZ", "GE", "AZ", "AM"],
  };
  for (const [region, codes] of Object.entries(regions)) {
    if (codes.includes(code)) return region;
  }
  return "other";
}

function estimateDays(originCode: string, destCode: string) {
  const originRegion = getRegion(originCode);
  const destRegion = getRegion(destCode);
  const sameRegion = originRegion === destRegion;

  return {
    express: { min: sameRegion ? 1 : 2, max: sameRegion ? 3 : 5 },
    standard: { min: sameRegion ? 3 : 7, max: sameRegion ? 7 : 14 },
    economy: { min: sameRegion ? 7 : 14, max: sameRegion ? 14 : 30 },
  };
}

interface Props {
  locale: string;
}

export default function DeliveryEstimatorStandalone({ locale }: Props) {
  const isRu = locale === "ru";
  const [originCode, setOriginCode] = useState("US");
  const [destCode, setDestCode] = useState("GB");

  const sortedCountries = useMemo(() => {
    return [...countries].sort((a, b) => {
      const nameA = isRu ? a.name_ru : a.name_en;
      const nameB = isRu ? b.name_ru : b.name_en;
      return nameA.localeCompare(nameB);
    });
  }, [isRu]);

  const estimates = useMemo(
    () => estimateDays(originCode, destCode),
    [originCode, destCode]
  );

  const originName = sortedCountries.find((c) => c.code === originCode);
  const destName = sortedCountries.find((c) => c.code === destCode);

  const deliveryLabels = {
    title: isRu ? "Ожидаемая дата доставки" : "Estimated Delivery Date",
    ship_today: isRu ? "Дата отправки" : "Ship date",
    estimated_arrival: isRu ? "Ориентировочная доставка" : "Estimated arrival",
    business_days_note: isRu
      ? "Рабочие дни, выходные не учитываются"
      : "Business days, excluding weekends",
  };

  return (
    <>
      {/* Country selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="block text-sm text-body mb-2">
            {isRu ? "Страна отправления" : "Origin country"}
          </label>
          <select
            value={originCode}
            onChange={(e) => setOriginCode(e.target.value)}
            className="w-full px-4 py-2.5 bg-card-hover border border-line rounded-lg text-gray-100 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30"
          >
            {sortedCountries.map((c) => (
              <option key={c.code} value={c.code}>
                {isRu ? c.name_ru : c.name_en}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-body mb-2">
            {isRu ? "Страна назначения" : "Destination country"}
          </label>
          <select
            value={destCode}
            onChange={(e) => setDestCode(e.target.value)}
            className="w-full px-4 py-2.5 bg-card-hover border border-line rounded-lg text-gray-100 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30"
          >
            {sortedCountries.map((c) => (
              <option key={c.code} value={c.code}>
                {isRu ? c.name_ru : c.name_en}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Delivery time summary */}
      <div className="mb-10 bg-surface border border-line rounded-xl p-6">
        <h2 className="text-xl font-semibold text-ink mb-4">
          {isRu ? "Ориентировочные сроки" : "Estimated Delivery Times"}
          {originName && destName && (
            <span className="text-body font-normal text-base ml-2">
              {isRu ? originName.name_ru : originName.name_en} → {isRu ? destName.name_ru : destName.name_en}
            </span>
          )}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(["express", "standard", "economy"] as const).map((service) => {
            const est = estimates[service];
            const profile = serviceProfiles[service];
            return (
              <div key={service} className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                <p className="text-xs text-muted uppercase tracking-wider mb-1">
                  {isRu ? profile.label_ru : profile.label_en}
                </p>
                <p className="text-2xl font-light text-ink">
                  {est.min}–{est.max}
                  <span className="text-sm text-body ml-1">{isRu ? "дней" : "days"}</span>
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed date estimator */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-ink mb-4">
          {isRu ? "Рассчитать дату доставки" : "Calculate Delivery Date"}
        </h2>
        <div className="space-y-6">
          {(["express", "standard", "economy"] as const).map((service) => {
            const est = estimates[service];
            const profile = serviceProfiles[service];
            return (
              <div key={service}>
                <p className="text-sm text-body mb-2 font-medium">
                  {isRu ? profile.label_ru : profile.label_en}
                </p>
                <DeliveryDateEstimator
                  estimatedDaysMin={est.min}
                  estimatedDaysMax={est.max}
                  locale={locale}
                  labels={deliveryLabels}
                />
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-muted">
        {isRu
          ? "* Сроки являются ориентировочными и могут меняться в зависимости от перевозчика, таможенного оформления и праздников"
          : "* Times are estimates and may vary depending on carrier, customs clearance, and holidays"}
      </p>
    </>
  );
}
