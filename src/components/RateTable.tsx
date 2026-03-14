"use client";

import { useState, useMemo, useEffect } from "react";
import type { Locale } from "@/lib/types";

interface Rate {
  weight_kg: number;
  price_usd: number;
}

interface CorridorRateData {
  carrier_name: string;
  carrier_logo: string;
  carrier_type: string;
  service_name: string;
  rates: Rate[];
  estimated_days_min: number;
  estimated_days_max: number;
  tracking: boolean;
}

// Approximate exchange rates from USD (updated periodically)
const EXCHANGE_RATES: Record<string, { rate: number; symbol: string; name: string }> = {
  USD: { rate: 1, symbol: "$", name: "US Dollar" },
  EUR: { rate: 0.92, symbol: "€", name: "Euro" },
  GBP: { rate: 0.79, symbol: "£", name: "British Pound" },
  CHF: { rate: 0.88, symbol: "Fr", name: "Swiss Franc" },
  CAD: { rate: 1.36, symbol: "C$", name: "Canadian Dollar" },
  AUD: { rate: 1.53, symbol: "A$", name: "Australian Dollar" },
  NZD: { rate: 1.67, symbol: "NZ$", name: "New Zealand Dollar" },
  SGD: { rate: 1.34, symbol: "S$", name: "Singapore Dollar" },
  HKD: { rate: 7.82, symbol: "HK$", name: "Hong Kong Dollar" },
  JPY: { rate: 150, symbol: "¥", name: "Japanese Yen" },
  CNY: { rate: 7.25, symbol: "¥", name: "Chinese Yuan" },
  KRW: { rate: 1350, symbol: "₩", name: "Korean Won" },
  INR: { rate: 83, symbol: "₹", name: "Indian Rupee" },
  RUB: { rate: 92, symbol: "₽", name: "Russian Ruble" },
  UAH: { rate: 41, symbol: "₴", name: "Ukrainian Hryvnia" },
  KZT: { rate: 460, symbol: "₸", name: "Kazakh Tenge" },
  BRL: { rate: 4.95, symbol: "R$", name: "Brazilian Real" },
  MXN: { rate: 17.2, symbol: "MX$", name: "Mexican Peso" },
  ARS: { rate: 870, symbol: "AR$", name: "Argentine Peso" },
  COP: { rate: 3950, symbol: "COL$", name: "Colombian Peso" },
  CLP: { rate: 950, symbol: "CL$", name: "Chilean Peso" },
  PEN: { rate: 3.72, symbol: "S/", name: "Peruvian Sol" },
  AED: { rate: 3.67, symbol: "د.إ", name: "UAE Dirham" },
  SAR: { rate: 3.75, symbol: "﷼", name: "Saudi Riyal" },
  ILS: { rate: 3.65, symbol: "₪", name: "Israeli Shekel" },
  TRY: { rate: 32, symbol: "₺", name: "Turkish Lira" },
  PLN: { rate: 4.0, symbol: "zł", name: "Polish Zloty" },
  CZK: { rate: 23.3, symbol: "Kč", name: "Czech Koruna" },
  HUF: { rate: 365, symbol: "Ft", name: "Hungarian Forint" },
  RON: { rate: 4.6, symbol: "lei", name: "Romanian Leu" },
  SEK: { rate: 10.5, symbol: "kr", name: "Swedish Krona" },
  NOK: { rate: 10.8, symbol: "kr", name: "Norwegian Krone" },
  DKK: { rate: 6.9, symbol: "kr", name: "Danish Krone" },
  THB: { rate: 35.5, symbol: "฿", name: "Thai Baht" },
  MYR: { rate: 4.7, symbol: "RM", name: "Malaysian Ringgit" },
  IDR: { rate: 15700, symbol: "Rp", name: "Indonesian Rupiah" },
  PHP: { rate: 56, symbol: "₱", name: "Philippine Peso" },
  VND: { rate: 24500, symbol: "₫", name: "Vietnamese Dong" },
  TWD: { rate: 31.5, symbol: "NT$", name: "Taiwan Dollar" },
  ZAR: { rate: 18.5, symbol: "R", name: "South African Rand" },
  NGN: { rate: 1550, symbol: "₦", name: "Nigerian Naira" },
  EGP: { rate: 48, symbol: "E£", name: "Egyptian Pound" },
  KES: { rate: 153, symbol: "KSh", name: "Kenyan Shilling" },
  PKR: { rate: 278, symbol: "₨", name: "Pakistani Rupee" },
  BDT: { rate: 110, symbol: "৳", name: "Bangladeshi Taka" },
  GEL: { rate: 2.7, symbol: "₾", name: "Georgian Lari" },
};

// Map browser locale/timezone to default currency
function detectUserCurrency(): string {
  if (typeof window === "undefined") return "USD";
  try {
    // Try Intl.NumberFormat resolved options
    const locale = navigator.language || "en-US";
    const resolved = new Intl.NumberFormat(locale, { style: "currency", currency: "USD" }).resolvedOptions();

    // Map locale to likely currency
    const localeCurrencyMap: Record<string, string> = {
      "ru": "RUB", "uk": "UAH", "kk": "KZT", "be": "BYN",
      "ja": "JPY", "ko": "KRW", "zh": "CNY",
      "hi": "INR", "bn": "BDT", "ta": "INR", "te": "INR",
      "th": "THB", "vi": "VND", "ms": "MYR", "id": "IDR", "fil": "PHP",
      "pt-BR": "BRL", "es-MX": "MXN", "es-AR": "ARS", "es-CO": "COP", "es-CL": "CLP", "es-PE": "PEN",
      "tr": "TRY", "pl": "PLN", "cs": "CZK", "hu": "HUF", "ro": "RON",
      "sv": "SEK", "nb": "NOK", "da": "DKK",
      "he": "ILS", "ar-SA": "SAR", "ar-AE": "AED", "ar-EG": "EGP",
      "ka": "GEL", "sw": "KES",
      "en-GB": "GBP", "en-AU": "AUD", "en-NZ": "NZD", "en-CA": "CAD",
      "en-SG": "SGD", "en-HK": "HKD", "en-ZA": "ZAR", "en-NG": "NGN",
      "en-PK": "PKR", "en-PH": "PHP", "en-IN": "INR",
      "fr-CH": "CHF", "de-CH": "CHF", "it-CH": "CHF",
      "zh-TW": "TWD", "zh-HK": "HKD",
    };

    // Check full locale first, then language only
    const lang = locale.split("-").slice(0, 2).join("-");
    const langShort = locale.split("-")[0];

    if (localeCurrencyMap[lang] && EXCHANGE_RATES[localeCurrencyMap[lang]]) return localeCurrencyMap[lang];
    if (localeCurrencyMap[langShort] && EXCHANGE_RATES[localeCurrencyMap[langShort]]) return localeCurrencyMap[langShort];

    // Timezone-based fallback
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const tzCurrencyMap: Record<string, string> = {
      "Europe/Moscow": "RUB", "Europe/Kiev": "UAH", "Europe/Kyiv": "UAH",
      "Asia/Almaty": "KZT", "Asia/Tokyo": "JPY", "Asia/Seoul": "KRW",
      "Asia/Shanghai": "CNY", "Asia/Kolkata": "INR", "Asia/Bangkok": "THB",
      "Asia/Ho_Chi_Minh": "VND", "Asia/Jakarta": "IDR", "Asia/Manila": "PHP",
      "Asia/Kuala_Lumpur": "MYR", "Asia/Singapore": "SGD", "Asia/Hong_Kong": "HKD",
      "Asia/Taipei": "TWD", "Asia/Tbilisi": "GEL", "Asia/Dubai": "AED",
      "Asia/Riyadh": "SAR", "Asia/Jerusalem": "ILS", "Asia/Karachi": "PKR",
      "Asia/Dhaka": "BDT", "Asia/Istanbul": "TRY",
      "America/Sao_Paulo": "BRL", "America/Mexico_City": "MXN", "America/Argentina/Buenos_Aires": "ARS",
      "America/Bogota": "COP", "America/Santiago": "CLP", "America/Lima": "PEN",
      "America/Toronto": "CAD", "America/Vancouver": "CAD",
      "Europe/London": "GBP", "Europe/Zurich": "CHF",
      "Europe/Warsaw": "PLN", "Europe/Prague": "CZK", "Europe/Budapest": "HUF",
      "Europe/Bucharest": "RON", "Europe/Stockholm": "SEK", "Europe/Oslo": "NOK",
      "Europe/Copenhagen": "DKK",
      "Australia/Sydney": "AUD", "Pacific/Auckland": "NZD",
      "Africa/Johannesburg": "ZAR", "Africa/Lagos": "NGN", "Africa/Cairo": "EGP",
      "Africa/Nairobi": "KES",
    };

    if (tzCurrencyMap[tz] && EXCHANGE_RATES[tzCurrencyMap[tz]]) return tzCurrencyMap[tz];

    // If in Europe and no specific match, default EUR
    if (tz.startsWith("Europe/")) return "EUR";
  } catch {
    // ignore
  }
  return "USD";
}

function convertPrice(usd: number, currency: string): string {
  const info = EXCHANGE_RATES[currency];
  if (!info || currency === "USD") return "";
  const converted = usd * info.rate;
  // Format based on magnitude
  if (converted >= 1000) return `${info.symbol}${Math.round(converted).toLocaleString()}`;
  if (converted >= 100) return `${info.symbol}${Math.round(converted)}`;
  return `${info.symbol}${converted.toFixed(2)}`;
}

function calcVolumetricWeight(l: number, w: number, h: number): number {
  return (l * w * h) / 5000;
}

function findClosestWeight(weight: number, availableWeights: number[]): number {
  // Find the smallest available weight that is >= the target
  const sorted = [...availableWeights].sort((a, b) => a - b);
  for (const w of sorted) {
    if (w >= weight) return w;
  }
  return sorted[sorted.length - 1]; // fallback to max
}

export default function RateTable({
  corridorRates,
  locale,
  labels,
}: {
  corridorRates: CorridorRateData[];
  locale: Locale;
  labels: {
    carrier: string;
    service: string;
    price: string;
    delivery_time: string;
    tracking: string;
    days: string;
    yes: string;
    no: string;
    cheapest: string;
    fastest: string;
    select_weight: string;
    kg: string;
    no_rates: string;
    disclaimer: string;
  };
}) {
  const weightPresets = [0.5, 1, 2, 5, 10, 20, 30, 50, 70];
  const [selectedPreset, setSelectedPreset] = useState<number | null>(1);
  const [customWeight, setCustomWeight] = useState("");
  const [dimensions, setDimensions] = useState({ l: "", w: "", h: "" });
  const [showDimensions, setShowDimensions] = useState(false);
  const [sortBy, setSortBy] = useState<"price" | "speed">("price");
  const [filterType, setFilterType] = useState<"all" | "international" | "regional" | "postal">("all");
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set());
  const [showCompare, setShowCompare] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [currencyAutoDetected, setCurrencyAutoDetected] = useState(false);

  // Auto-detect user currency on mount
  useEffect(() => {
    const detected = detectUserCurrency();
    if (detected !== "USD") {
      setCurrency(detected);
      setCurrencyAutoDetected(true);
    }
  }, []);

  // Calculate volumetric weight
  const volumetricWeight = useMemo(() => {
    const l = parseFloat(dimensions.l);
    const w = parseFloat(dimensions.w);
    const h = parseFloat(dimensions.h);
    if (l > 0 && w > 0 && h > 0) {
      return calcVolumetricWeight(l, w, h);
    }
    return 0;
  }, [dimensions]);

  // Determine effective weight (max of actual and volumetric)
  const effectiveWeight = useMemo(() => {
    const actual = (selectedPreset ?? parseFloat(customWeight)) || 0;
    if (volumetricWeight > 0 && actual > 0) {
      return Math.max(actual, volumetricWeight);
    }
    return actual;
  }, [selectedPreset, customWeight, volumetricWeight]);

  // Available weight steps from rate data
  const availableWeights = useMemo(() => {
    const weights = new Set<number>();
    for (const cr of corridorRates) {
      for (const r of cr.rates) {
        weights.add(r.weight_kg);
      }
    }
    return [...weights].sort((a, b) => a - b);
  }, [corridorRates]);

  const billingWeight = effectiveWeight > 0
    ? findClosestWeight(effectiveWeight, availableWeights)
    : findClosestWeight(1, availableWeights);

  if (corridorRates.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">{labels.no_rates}</p>
      </div>
    );
  }

  // Get rates for billing weight
  const ratesAtWeight = corridorRates
    .map((cr) => {
      const rate = cr.rates.find((r) => r.weight_kg === billingWeight);
      return { ...cr, price: rate?.price_usd ?? null, id: `${cr.carrier_name}-${cr.service_name}` };
    })
    .filter((r) => r.price !== null)
    .filter((r) => filterType === "all" || r.carrier_type === filterType)
    .sort((a, b) => {
      if (sortBy === "speed") {
        return a.estimated_days_min - b.estimated_days_min || (a.price ?? 999) - (b.price ?? 999);
      }
      return (a.price ?? 999) - (b.price ?? 999);
    });

  const cheapest = ratesAtWeight[0];
  const fastest = [...ratesAtWeight].sort(
    (a, b) => a.estimated_days_min - b.estimated_days_min
  )[0];

  const typeOptions = [
    { value: "all" as const, label: locale === "ru" ? "Все" : "All" },
    { value: "international" as const, label: locale === "ru" ? "Экспресс" : "Express" },
    { value: "regional" as const, label: locale === "ru" ? "Региональные" : "Regional" },
    { value: "postal" as const, label: locale === "ru" ? "Почтовые" : "Postal" },
  ];

  const comparedRates = ratesAtWeight.filter((r) => compareIds.has(r.id));

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div>
      {/* Weight input section */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        {/* Presets */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {labels.select_weight}
          </label>
          <div className="flex flex-wrap gap-2">
            {weightPresets.map((w) => (
              <button
                key={w}
                onClick={() => { setSelectedPreset(w); setCustomWeight(""); }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedPreset === w && !customWeight
                    ? "bg-blue-600 text-white"
                    : "bg-gray-50 border border-gray-300 text-gray-700 hover:border-blue-400"
                }`}
              >
                {w} {labels.kg}
              </button>
            ))}
          </div>
        </div>

        {/* Custom weight input */}
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              {locale === "ru" ? "Или введите вес вручную" : "Or enter weight manually"}
            </label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={customWeight}
                onChange={(e) => { setCustomWeight(e.target.value); setSelectedPreset(null); }}
                placeholder="0.0"
                min="0.1"
                max="70"
                step="0.1"
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-500">{labels.kg}</span>
            </div>
          </div>

          {/* Dimensions toggle */}
          <button
            onClick={() => setShowDimensions(!showDimensions)}
            className="px-3 py-2 text-sm text-blue-600 hover:text-blue-800 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
          >
            {showDimensions
              ? (locale === "ru" ? "Скрыть габариты" : "Hide dimensions")
              : (locale === "ru" ? "Указать габариты (Д×Ш×В)" : "Enter dimensions (L×W×H)")}
          </button>
        </div>

        {/* Dimensions input */}
        {showDimensions && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <label className="block text-xs text-gray-500 mb-2">
              {locale === "ru" ? "Габариты посылки (см)" : "Package dimensions (cm)"}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={dimensions.l}
                onChange={(e) => setDimensions({ ...dimensions, l: e.target.value })}
                placeholder={locale === "ru" ? "Длина" : "Length"}
                min="1"
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-gray-400">×</span>
              <input
                type="number"
                value={dimensions.w}
                onChange={(e) => setDimensions({ ...dimensions, w: e.target.value })}
                placeholder={locale === "ru" ? "Ширина" : "Width"}
                min="1"
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-gray-400">×</span>
              <input
                type="number"
                value={dimensions.h}
                onChange={(e) => setDimensions({ ...dimensions, h: e.target.value })}
                placeholder={locale === "ru" ? "Высота" : "Height"}
                min="1"
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-500">{locale === "ru" ? "см" : "cm"}</span>
            </div>
            {volumetricWeight > 0 && (
              <div className="mt-2 text-sm">
                <span className="text-gray-500">
                  {locale === "ru" ? "Объёмный вес:" : "Volumetric weight:"}{" "}
                </span>
                <span className="font-semibold text-gray-900">{volumetricWeight.toFixed(1)} {labels.kg}</span>
                {effectiveWeight > ((selectedPreset ?? parseFloat(customWeight)) || 0) && (
                  <span className="ml-2 text-orange-600 text-xs">
                    {locale === "ru"
                      ? "⚠ Объёмный вес больше фактического — расчёт по объёмному"
                      : "⚠ Volumetric weight exceeds actual — charged by volumetric"}
                  </span>
                )}
              </div>
            )}
            <p className="text-xs text-gray-400 mt-1">
              {locale === "ru"
                ? "Формула: Д × Ш × В / 5000 = объёмный вес (кг)"
                : "Formula: L × W × H / 5000 = volumetric weight (kg)"}
            </p>
          </div>
        )}

        {/* Effective weight display */}
        {effectiveWeight > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100 text-sm">
            <span className="text-gray-500">{locale === "ru" ? "Тарификация по:" : "Billed at:"} </span>
            <span className="font-semibold text-gray-900">{billingWeight} {labels.kg}</span>
            {billingWeight !== effectiveWeight && (
              <span className="text-xs text-gray-400 ml-1">
                ({locale === "ru" ? "ближайший тарифный вес" : "nearest rate bracket"})
              </span>
            )}
          </div>
        )}
      </div>

      {/* Currency selector */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-gray-500">{locale === "ru" ? "Валюта:" : "Currency:"}</span>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="px-3 py-1.5 rounded border border-gray-300 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {Object.entries(EXCHANGE_RATES).map(([code, info]) => (
            <option key={code} value={code}>
              {info.symbol} {code}
            </option>
          ))}
        </select>
        {currency !== "USD" && (
          <span className="text-xs text-gray-400">
            (1 USD = {EXCHANGE_RATES[currency].rate} {currency})
            {currencyAutoDetected && (
              <span className="ml-1">
                — {locale === "ru" ? "определено автоматически" : "auto-detected"}
              </span>
            )}
          </span>
        )}
      </div>

      {/* Sort & filter controls */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{locale === "ru" ? "Сортировка:" : "Sort:"}</span>
          <button
            onClick={() => setSortBy("price")}
            className={`px-3 py-1.5 rounded text-sm ${
              sortBy === "price" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {labels.price}
          </button>
          <button
            onClick={() => setSortBy("speed")}
            className={`px-3 py-1.5 rounded text-sm ${
              sortBy === "speed" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {labels.delivery_time}
          </button>
        </div>
        <div className="h-4 w-px bg-gray-300 hidden sm:block" />
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{locale === "ru" ? "Тип:" : "Type:"}</span>
          {typeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilterType(opt.value)}
              className={`px-3 py-1.5 rounded text-sm ${
                filterType === opt.value ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count + compare button */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-500">
          {ratesAtWeight.length} {locale === "ru" ? "результатов" : "results"}
        </p>
        {compareIds.size >= 2 && (
          <button
            onClick={() => setShowCompare(!showCompare)}
            className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
          >
            {locale === "ru" ? `Сравнить (${compareIds.size})` : `Compare (${compareIds.size})`}
          </button>
        )}
      </div>

      {/* Comparison table */}
      {showCompare && comparedRates.length >= 2 && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 overflow-x-auto">
          <h3 className="font-semibold text-gray-900 mb-3">
            {locale === "ru" ? "Сравнение" : "Comparison"}
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="pb-2">{labels.carrier}</th>
                <th className="pb-2">{labels.service}</th>
                <th className="pb-2">{labels.price}</th>
                <th className="pb-2">{labels.delivery_time}</th>
                <th className="pb-2">{labels.tracking}</th>
              </tr>
            </thead>
            <tbody>
              {comparedRates.map((rate) => (
                <tr key={rate.id} className="border-t border-blue-200">
                  <td className="py-2 font-medium">{rate.carrier_name}</td>
                  <td className="py-2">{rate.service_name}</td>
                  <td className="py-2 font-bold">${rate.price}{currency !== "USD" && rate.price ? ` (${convertPrice(rate.price, currency)})` : ""}</td>
                  <td className="py-2">{rate.estimated_days_min}–{rate.estimated_days_max} {labels.days}</td>
                  <td className="py-2">{rate.tracking ? labels.yes : labels.no}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={() => setShowCompare(false)}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800"
          >
            {locale === "ru" ? "Закрыть" : "Close"}
          </button>
        </div>
      )}

      {/* Rate cards */}
      <div className="space-y-3">
        {ratesAtWeight.map((rate) => {
          const isCheapest = rate === cheapest;
          const isFastest = rate === fastest && !isCheapest;
          const isCompared = compareIds.has(rate.id);

          return (
            <div
              key={rate.id}
              className={`bg-white rounded-lg border p-4 sm:p-5 ${
                isCheapest
                  ? "border-green-300 ring-1 ring-green-200"
                  : isFastest
                  ? "border-blue-300 ring-1 ring-blue-200"
                  : isCompared
                  ? "border-purple-300 ring-1 ring-purple-200"
                  : "border-gray-200"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {/* Compare checkbox */}
                    <input
                      type="checkbox"
                      checked={isCompared}
                      onChange={() => toggleCompare(rate.id)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      title={locale === "ru" ? "Сравнить" : "Compare"}
                    />
                    <span className="font-semibold text-gray-900">
                      {rate.carrier_name}
                    </span>
                    {isCheapest && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        {labels.cheapest}
                      </span>
                    )}
                    {isFastest && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                        {labels.fastest}
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        rate.carrier_type === "international"
                          ? "bg-purple-100 text-purple-700"
                          : rate.carrier_type === "postal"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-teal-100 text-teal-700"
                      }`}
                    >
                      {rate.carrier_type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 ml-6">{rate.service_name}</p>
                </div>

                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 uppercase">
                      {labels.delivery_time}
                    </p>
                    <p className="font-medium">
                      {rate.estimated_days_min}–{rate.estimated_days_max}{" "}
                      <span className="text-sm text-gray-500">
                        {labels.days}
                      </span>
                    </p>
                  </div>
                  <div className="text-center hidden sm:block">
                    <p className="text-xs text-gray-500 uppercase">
                      {labels.tracking}
                    </p>
                    <p className="font-medium">
                      {rate.tracking ? labels.yes : labels.no}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase">
                      {labels.price}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${rate.price}
                    </p>
                    {currency !== "USD" && rate.price && (
                      <p className="text-xs text-gray-400">
                        {convertPrice(rate.price, currency)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {/* Mobile tracking info */}
              <div className="sm:hidden mt-2 text-xs text-gray-500 ml-6">
                {labels.tracking}: {rate.tracking ? labels.yes : labels.no}
              </div>
            </div>
          );
        })}
      </div>

      {ratesAtWeight.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>{locale === "ru" ? "Нет результатов для выбранного фильтра" : "No results for selected filter"}</p>
        </div>
      )}

      {/* Disclaimer */}
      <p className="mt-6 text-xs text-gray-400 leading-relaxed">
        {labels.disclaimer}
      </p>
    </div>
  );
}
