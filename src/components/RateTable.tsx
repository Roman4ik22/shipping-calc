"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import type { Locale } from "@/lib/types";
import { CarrierTypePill } from "./CarrierTypeIcon";

interface Rate {
  weight_kg: number;
  price_usd: number;
}

interface CarrierReviewData {
  rating: number;
  reviews: number;
  url: string;
}

interface CorridorRateData {
  carrier_name: string;
  carrier_logo: string;
  carrier_type: string;
  carrier_id: string;
  service_name: string;
  rates: Rate[];
  estimated_days_min: number;
  estimated_days_max: number;
  tracking: boolean;
  review?: CarrierReviewData | null;
  route_score?: number;
  route_score_label?: string;
  carrier_website?: string;
  rate_verified?: boolean;
  tracking_url?: string;
}

// Approximate exchange rates from USD (updated periodically)
const EXCHANGE_RATES: Record<string, { rate: number; symbol: string; name: string }> = {
  USD: { rate: 1, symbol: "$", name: "US Dollar" },
  EUR: { rate: 0.92, symbol: "\u20ac", name: "Euro" },
  GBP: { rate: 0.79, symbol: "\u00a3", name: "British Pound" },
  CHF: { rate: 0.88, symbol: "Fr", name: "Swiss Franc" },
  CAD: { rate: 1.36, symbol: "C$", name: "Canadian Dollar" },
  AUD: { rate: 1.53, symbol: "A$", name: "Australian Dollar" },
  NZD: { rate: 1.67, symbol: "NZ$", name: "New Zealand Dollar" },
  SGD: { rate: 1.34, symbol: "S$", name: "Singapore Dollar" },
  HKD: { rate: 7.82, symbol: "HK$", name: "Hong Kong Dollar" },
  JPY: { rate: 150, symbol: "\u00a5", name: "Japanese Yen" },
  CNY: { rate: 7.25, symbol: "\u00a5", name: "Chinese Yuan" },
  KRW: { rate: 1350, symbol: "\u20a9", name: "Korean Won" },
  INR: { rate: 83, symbol: "\u20b9", name: "Indian Rupee" },
  RUB: { rate: 92, symbol: "\u20bd", name: "Russian Ruble" },
  UAH: { rate: 41, symbol: "\u20b4", name: "Ukrainian Hryvnia" },
  KZT: { rate: 460, symbol: "\u20b8", name: "Kazakh Tenge" },
  BRL: { rate: 4.95, symbol: "R$", name: "Brazilian Real" },
  MXN: { rate: 17.2, symbol: "MX$", name: "Mexican Peso" },
  ARS: { rate: 870, symbol: "AR$", name: "Argentine Peso" },
  COP: { rate: 3950, symbol: "COL$", name: "Colombian Peso" },
  CLP: { rate: 950, symbol: "CL$", name: "Chilean Peso" },
  PEN: { rate: 3.72, symbol: "S/", name: "Peruvian Sol" },
  AED: { rate: 3.67, symbol: "\u062f.\u0625", name: "UAE Dirham" },
  SAR: { rate: 3.75, symbol: "\ufdfc", name: "Saudi Riyal" },
  ILS: { rate: 3.65, symbol: "\u20aa", name: "Israeli Shekel" },
  TRY: { rate: 32, symbol: "\u20ba", name: "Turkish Lira" },
  PLN: { rate: 4.0, symbol: "z\u0142", name: "Polish Zloty" },
  CZK: { rate: 23.3, symbol: "K\u010d", name: "Czech Koruna" },
  HUF: { rate: 365, symbol: "Ft", name: "Hungarian Forint" },
  RON: { rate: 4.6, symbol: "lei", name: "Romanian Leu" },
  SEK: { rate: 10.5, symbol: "kr", name: "Swedish Krona" },
  NOK: { rate: 10.8, symbol: "kr", name: "Norwegian Krone" },
  DKK: { rate: 6.9, symbol: "kr", name: "Danish Krone" },
  THB: { rate: 35.5, symbol: "\u0e3f", name: "Thai Baht" },
  MYR: { rate: 4.7, symbol: "RM", name: "Malaysian Ringgit" },
  IDR: { rate: 15700, symbol: "Rp", name: "Indonesian Rupiah" },
  PHP: { rate: 56, symbol: "\u20b1", name: "Philippine Peso" },
  VND: { rate: 24500, symbol: "\u20ab", name: "Vietnamese Dong" },
  TWD: { rate: 31.5, symbol: "NT$", name: "Taiwan Dollar" },
  ZAR: { rate: 18.5, symbol: "R", name: "South African Rand" },
  NGN: { rate: 1550, symbol: "\u20a6", name: "Nigerian Naira" },
  EGP: { rate: 48, symbol: "E\u00a3", name: "Egyptian Pound" },
  KES: { rate: 153, symbol: "KSh", name: "Kenyan Shilling" },
  PKR: { rate: 278, symbol: "\u20a8", name: "Pakistani Rupee" },
  BDT: { rate: 110, symbol: "\u09f3", name: "Bangladeshi Taka" },
  GEL: { rate: 2.7, symbol: "\u20be", name: "Georgian Lari" },
};

// Map browser locale/timezone to default currency
function detectUserCurrency(): string {
  if (typeof window === "undefined") return "USD";
  try {
    const locale = navigator.language || "en-US";

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

    const lang = locale.split("-").slice(0, 2).join("-");
    const langShort = locale.split("-")[0];

    if (localeCurrencyMap[lang] && EXCHANGE_RATES[localeCurrencyMap[lang]]) return localeCurrencyMap[lang];
    if (localeCurrencyMap[langShort] && EXCHANGE_RATES[localeCurrencyMap[langShort]]) return localeCurrencyMap[langShort];

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
  if (converted >= 1000) return `${info.symbol}${Math.round(converted).toLocaleString()}`;
  if (converted >= 100) return `${info.symbol}${Math.round(converted)}`;
  return `${info.symbol}${converted.toFixed(2)}`;
}

function calcVolumetricWeight(l: number, w: number, h: number): number {
  return (l * w * h) / 5000;
}

function findClosestWeight(weight: number, availableWeights: number[]): number {
  const sorted = [...availableWeights].sort((a, b) => a - b);
  for (const w of sorted) {
    if (w >= weight) return w;
  }
  return sorted[sorted.length - 1];
}

function CurrencySelector({
  currency,
  setCurrency,
  exchangeRates,
  labels,
  currencyAutoDetected,
}: {
  currency: string;
  setCurrency: (c: string) => void;
  exchangeRates: Record<string, { rate: number; symbol: string; name: string }>;
  labels: { currency: string; auto_detected: string };
  currencyAutoDetected: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const filtered = Object.entries(exchangeRates).filter(([code, info]) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return code.toLowerCase().includes(q) || info.name.toLowerCase().includes(q) || info.symbol.includes(q);
  });

  const current = exchangeRates[currency];

  return (
    <div className="flex items-center gap-2 mb-6">
      <span className="text-sm text-body">{labels.currency}:</span>
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-3 py-1.5 text-body hover:text-ink transition-colors text-sm"
        >
          <span className="font-medium">{current?.symbol}</span>
          <span>{currency}</span>
          <svg className="w-3 h-3 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {open && (
          <div className="absolute left-0 mt-1 w-64 bg-white rounded-2xl shadow-lg z-50 overflow-hidden">
            <div className="p-3">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search currency..."
                className="w-full px-3 py-2 text-sm bg-white border border-line rounded-xl text-ink placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/50"
                autoFocus
              />
            </div>
            <div className="max-h-60 overflow-y-auto">
              {filtered.map(([code, info]) => (
                <button
                  key={code}
                  onClick={() => { setCurrency(code); setOpen(false); setSearch(""); }}
                  className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between transition-colors hover:bg-gray-50 ${
                    code === currency ? "text-ink font-medium" : "text-body"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="font-medium w-6">{info.symbol}</span>
                    <span>{code}</span>
                  </span>
                  <span className="text-xs text-muted">{info.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {currency !== "USD" && (
        <span className="text-xs text-muted">
          1 USD = {current?.rate} {currency}
          {currencyAutoDetected && <span className="ml-1">— {labels.auto_detected}</span>}
        </span>
      )}
    </div>
  );
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
    no_rates_hint?: string;
    pick_another_country?: string;
    browse_carriers_btn?: string;
    reset_filter?: string;
    disclaimer: string;
    or_enter_weight: string;
    hide_dimensions: string;
    enter_dimensions: string;
    package_dimensions: string;
    volumetric_weight: string;
    volumetric_exceeds: string;
    volumetric_formula: string;
    billed_at: string;
    nearest_bracket: string;
    currency: string;
    auto_detected: string;
    sort: string;
    type_label: string;
    all: string;
    express: string;
    regional: string;
    postal: string;
    results: string;
    compare: string;
    comparison: string;
    close: string;
    no_filter_results: string;
    route_reliability?: string;
    ship_now?: string;
    track_package?: string;
  };
}) {
  const weightPresets = [0.5, 1, 2, 5, 10, 20, 30, 50, 70];
  const [selectedPreset, setSelectedPreset] = useState<number | null>(1);
  const [customWeight, setCustomWeight] = useState("");
  const [dimensions, setDimensions] = useState({ l: "", w: "", h: "" });
  const [showDimensions, setShowDimensions] = useState(false);
  const [sortBy, setSortBy] = useState<"price" | "speed" | "reliability">("price");
  const [filterType, setFilterType] = useState<"all" | "international" | "regional" | "postal">("all");
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set());
  const [showCompare, setShowCompare] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [currencyAutoDetected, setCurrencyAutoDetected] = useState(false);

  useEffect(() => {
    const detected = detectUserCurrency();
    if (detected !== "USD") {
      setCurrency(detected);
      setCurrencyAutoDetected(true);
    }
  }, []);

  const volumetricWeight = useMemo(() => {
    const l = parseFloat(dimensions.l);
    const w = parseFloat(dimensions.w);
    const h = parseFloat(dimensions.h);
    if (l > 0 && w > 0 && h > 0) {
      return calcVolumetricWeight(l, w, h);
    }
    return 0;
  }, [dimensions]);

  const effectiveWeight = useMemo(() => {
    const actual = (selectedPreset ?? parseFloat(customWeight)) || 0;
    if (volumetricWeight > 0 && actual > 0) {
      return Math.max(actual, volumetricWeight);
    }
    return actual;
  }, [selectedPreset, customWeight, volumetricWeight]);

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
      <div className="text-center py-16 px-6">
        <div className="mx-auto w-20 h-20 rounded-2xl bg-warm-50 flex items-center justify-center mb-5">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            className="text-warm" aria-hidden="true">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
        </div>
        <p className="text-xl font-semibold text-ink mb-2">{labels.no_rates}</p>
        {labels.no_rates_hint && (
          <p className="text-sm text-muted max-w-md mx-auto mb-6">
            {labels.no_rates_hint}
          </p>
        )}
        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href={`/${locale}`}
            className="px-5 py-2.5 bg-accent text-white text-sm font-semibold rounded-full hover:opacity-90 btn-press transition"
          >
            {labels.pick_another_country ?? "← Pick another country"}
          </a>
          <a
            href={`/${locale}/carriers`}
            className="px-5 py-2.5 bg-white border border-line text-ink text-sm font-semibold rounded-full hover:bg-card-hover btn-press transition"
          >
            {labels.browse_carriers_btn ?? "Browse carriers"}
          </a>
        </div>
      </div>
    );
  }

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
      if (sortBy === "reliability") {
        return (b.route_score ?? 0) - (a.route_score ?? 0) || (a.price ?? 999) - (b.price ?? 999);
      }
      return (a.price ?? 999) - (b.price ?? 999);
    });

  const cheapest = ratesAtWeight[0];
  const fastest = [...ratesAtWeight].sort(
    (a, b) => a.estimated_days_min - b.estimated_days_min
  )[0];

  const typeOptions = [
    { value: "all" as const, label: labels.all },
    { value: "international" as const, label: labels.express },
    { value: "regional" as const, label: labels.regional },
    { value: "postal" as const, label: labels.postal },
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
      <div className="mb-6">
        <label className="block text-xs text-gray-200 mb-3 uppercase tracking-wide">
          {labels.select_weight}
        </label>
        <div className="bg-white rounded-2xl p-5">
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {weightPresets.map((w) => (
              <button
                key={w}
                onClick={() => { setSelectedPreset(w); setCustomWeight(""); }}
                aria-label={`${w} ${labels.kg}`}
                aria-pressed={selectedPreset === w && !customWeight}
                className={`px-4 py-2.5 text-sm rounded-xl transition-colors ${
                  selectedPreset === w && !customWeight
                    ? "bg-accent text-white btn-press font-medium"
                    : "bg-white border border-line text-body hover:bg-[#F8F5EF] hover:text-body"
                }`}
              >
                {w} {labels.kg}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-xs text-body mb-1">
              {labels.or_enter_weight}
            </label>
            <div className="flex items-center gap-1">
              <input
                type="text"
                inputMode="decimal"
                value={customWeight}
                onChange={(e) => {
                  // Auto-format: accept European comma as decimal separator
                  // (e.g. "2,5" → "2.5"), strip non-digits/dots, cap at one dot.
                  const raw = e.target.value.replace(",", ".");
                  const cleaned = raw.replace(/[^0-9.]/g, "");
                  const firstDot = cleaned.indexOf(".");
                  const normalized = firstDot === -1
                    ? cleaned
                    : cleaned.slice(0, firstDot + 1) +
                      cleaned.slice(firstDot + 1).replace(/\./g, "");
                  setCustomWeight(normalized);
                  setSelectedPreset(null);
                }}
                placeholder="0.0"
                aria-label={labels.or_enter_weight}
                className="w-24 px-4 py-3 bg-white border border-line rounded-xl text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/50 placeholder-muted"
              />
              <span className="text-sm text-body">{labels.kg}</span>
            </div>
          </div>

          <button
            onClick={() => setShowDimensions(!showDimensions)}
            className="px-3 py-2 text-sm text-body hover:text-ink transition-colors"
          >
            {showDimensions ? labels.hide_dimensions : labels.enter_dimensions}
          </button>
        </div>

        {showDimensions && (
          <div className="mt-4 pt-4 border-t border-line">
            <label className="block text-xs text-muted mb-2">
              {labels.package_dimensions}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={dimensions.l}
                onChange={(e) => setDimensions({ ...dimensions, l: e.target.value })}
                placeholder="L"
                min="1"
                aria-label="Length (cm)"
                className="w-20 px-3 py-3 bg-white border border-line rounded-xl text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/50 placeholder-gray-400"
              />
              <span className="text-muted" aria-hidden="true">\u00d7</span>
              <input
                type="number"
                value={dimensions.w}
                onChange={(e) => setDimensions({ ...dimensions, w: e.target.value })}
                placeholder="W"
                min="1"
                aria-label="Width (cm)"
                className="w-20 px-3 py-3 bg-white border border-line rounded-xl text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/50 placeholder-gray-400"
              />
              <span className="text-muted" aria-hidden="true">\u00d7</span>
              <input
                type="number"
                value={dimensions.h}
                onChange={(e) => setDimensions({ ...dimensions, h: e.target.value })}
                placeholder="H"
                min="1"
                aria-label="Height (cm)"
                className="w-20 px-3 py-3 bg-white border border-line rounded-xl text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/50 placeholder-gray-400"
              />
              <span className="text-sm text-muted">cm</span>
            </div>
            {volumetricWeight > 0 && (
              <div className="mt-2 text-sm">
                <span className="text-muted">
                  {labels.volumetric_weight}:{" "}
                </span>
                <span className="font-medium text-ink">{volumetricWeight.toFixed(1)} {labels.kg}</span>
                {effectiveWeight > ((selectedPreset ?? parseFloat(customWeight)) || 0) && (
                  <span className="ml-2 text-orange-400 text-xs">
                    {labels.volumetric_exceeds}
                  </span>
                )}
              </div>
            )}
            <p className="text-xs text-muted mt-1">
              {labels.volumetric_formula}
            </p>
          </div>
        )}

        {effectiveWeight > 0 && (
          <div className="mt-4 pt-4 border-t border-line text-sm">
            <span className="text-body">{labels.billed_at}: </span>
            <span className="font-bold text-ink">{billingWeight} {labels.kg}</span>
            {billingWeight !== effectiveWeight && (
              <span className="text-xs text-muted ml-1">
                ({labels.nearest_bracket})
              </span>
            )}
          </div>
        )}
        </div>
      </div>

      {/* Currency selector */}
      <CurrencySelector
        currency={currency}
        setCurrency={setCurrency}
        exchangeRates={EXCHANGE_RATES}
        labels={labels}
        currencyAutoDetected={currencyAutoDetected}
      />
      {/* Sort & filter controls */}
      <div className="bg-white rounded-2xl p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2" role="group" aria-label={labels.sort}>
          <span className="text-sm text-body mr-1">{labels.sort}:</span>
          <button
            onClick={() => setSortBy("price")}
            aria-pressed={sortBy === "price"}
            aria-sort={sortBy === "price" ? "ascending" : undefined}
            className={`px-3 py-1.5 text-sm rounded-xl transition-colors ${
              sortBy === "price" ? "bg-accent text-white btn-press" : "bg-white border border-line text-body hover:bg-[#F8F5EF] hover:text-body"
            }`}
          >
            {labels.price}
          </button>
          <button
            onClick={() => setSortBy("speed")}
            aria-pressed={sortBy === "speed"}
            aria-sort={sortBy === "speed" ? "ascending" : undefined}
            className={`px-3 py-1.5 text-sm rounded-xl transition-colors ${
              sortBy === "speed" ? "bg-accent text-white btn-press" : "bg-white border border-line text-body hover:bg-[#F8F5EF] hover:text-body"
            }`}
          >
            {labels.delivery_time}
          </button>
          <button
            onClick={() => setSortBy("reliability")}
            aria-pressed={sortBy === "reliability"}
            className={`px-3 py-1.5 text-sm rounded-xl transition-colors ${
              sortBy === "reliability" ? "bg-accent text-white btn-press" : "bg-white border border-line text-body hover:bg-[#F8F5EF] hover:text-body"
            }`}
          >
            {labels.route_reliability || "Route"}
          </button>
        </div>
        <div className="h-4 w-px bg-white/10 hidden sm:block" />
        <div className="flex items-center gap-2" role="group" aria-label={labels.type_label}>
          <span className="text-sm text-body mr-1">{labels.type_label}:</span>
          {typeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilterType(opt.value)}
              aria-pressed={filterType === opt.value}
              className={`px-3 py-1.5 text-sm rounded-xl transition-colors ${
                filterType === opt.value ? "bg-accent text-white btn-press" : "bg-white border border-line text-body hover:bg-[#F8F5EF] hover:text-body"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm font-medium text-body">
          {ratesAtWeight.length} {labels.results}
        </p>
      </div>

      {/* Comparison table */}
      {showCompare && comparedRates.length >= 2 && (
        <div className="mb-6 border-b border-line pb-6 overflow-x-auto">
          <h3 className="font-medium text-ink mb-3 text-sm">
            {labels.comparison}
          </h3>
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="text-left text-muted">
                <th className="pb-2 font-normal" scope="col">{labels.carrier}</th>
                <th className="pb-2 font-normal" scope="col">{labels.service}</th>
                <th className="pb-2 font-normal" scope="col">{labels.price}</th>
                <th className="pb-2 font-normal" scope="col">{labels.delivery_time}</th>
                <th className="pb-2 font-normal" scope="col">{labels.tracking}</th>
              </tr>
            </thead>
            <tbody>
              {comparedRates.map((rate) => (
                <tr key={rate.id} className="border-t border-line">
                  <td className="py-2 font-medium text-ink">{rate.carrier_name}</td>
                  <td className="py-2 text-body">{rate.service_name}</td>
                  <td className="py-2 font-light text-ink">${rate.price}{currency !== "USD" && rate.price ? ` (${convertPrice(rate.price, currency)})` : ""}</td>
                  <td className="py-2 text-body">{rate.estimated_days_min}–{rate.estimated_days_max} {labels.days}</td>
                  <td className="py-2 text-body">{rate.tracking ? labels.yes : labels.no}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={() => setShowCompare(false)}
            className="mt-2 text-sm text-muted hover:text-ink transition-colors"
          >
            {labels.close}
          </button>
        </div>
      )}

      {/* Rate cards */}
      <div className="space-y-3">
        {ratesAtWeight.map((rate) => {
          const isCheapest = rate === cheapest;
          const isFastest = rate === fastest && !isCheapest;

          return (
            <div
              key={rate.id}
              className="bg-white hover:bg-[#F8F5EF] rounded-2xl p-5 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <span className="font-semibold text-ink">
                      {rate.carrier_name}
                    </span>
                    {rate.rate_verified ? (
                      <span className="text-xs text-green-500" title="Verified from official carrier rates">&#10003; Verified</span>
                    ) : (
                      <span className="text-xs text-body" title="Estimated based on carrier type and region">~ Estimated</span>
                    )}
                    {isCheapest && (
                      <span className="text-xs text-green-400">
                        {labels.cheapest}
                      </span>
                    )}
                    {isFastest && (
                      <span className="text-xs text-blue-400">
                        {labels.fastest}
                      </span>
                    )}
                    {rate.route_score && (
                      <span
                        className={`text-xs ${
                          rate.route_score >= 4.0 ? "text-green-400" :
                          rate.route_score >= 3.0 ? "text-yellow-400" :
                          rate.route_score >= 2.0 ? "text-orange-400" :
                          "text-red-400"
                        }`}
                        title={rate.route_score_label}
                      >
                        {rate.route_score.toFixed(1)} ★
                      </span>
                    )}
                    <CarrierTypePill type={rate.carrier_type} size="xs" />

                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-body">{rate.service_name}</p>
                    {rate.review && (
                      <a
                        href={rate.review.url}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className={`text-xs flex items-center gap-1 ${
                          rate.review.rating >= 3.5 ? "text-green-400" :
                          rate.review.rating >= 2.5 ? "text-yellow-400" :
                          rate.review.rating >= 1.5 ? "text-orange-400" : "text-red-400"
                        } hover:underline`}
                        title="Trustpilot"
                      >
                        <span>★ {rate.review.rating.toFixed(1)}</span>
                        <span className="text-muted">({rate.review.reviews >= 1000 ? `${(rate.review.reviews / 1000).toFixed(1)}K` : rate.review.reviews})</span>
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-6 sm:gap-8">
                  <div className="text-center">
                    <p className="text-xs text-body mb-1">
                      {labels.delivery_time}
                    </p>
                    <p className="text-body">
                      {rate.estimated_days_min}–{rate.estimated_days_max}{" "}
                      <span className="text-sm text-muted">
                        {labels.days}
                      </span>
                    </p>
                  </div>
                  <div className="text-center hidden sm:block">
                    <p className="text-xs text-body mb-1">
                      {labels.tracking}
                    </p>
                    <p className="text-body">
                      {rate.tracking ? labels.yes : labels.no}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-body mb-1">
                      {labels.price}
                    </p>
                    <p className="text-3xl font-light text-ink">
                      ${rate.price}
                    </p>
                    {currency !== "USD" && rate.price && (
                      <p className="text-xs text-muted">
                        {convertPrice(rate.price, currency)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                {rate.carrier_website && (
                  <a
                    href={rate.carrier_website}
                    target="_blank"
                    rel="noopener noreferrer nofollow sponsored"
                    className="px-6 py-2.5 bg-accent text-white btn-press text-sm font-medium rounded-full hover:bg-[#1558B8] transition-colors"
                  >
                    {labels.ship_now || "Ship Now"}
                  </a>
                )}
                {rate.tracking && rate.tracking_url && !rate.tracking_url.includes("{tracking}") && (
                  <a
                    href={rate.tracking_url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="px-4 py-2 text-muted text-sm hover:text-ink transition-colors"
                  >
                    {labels.track_package || "Track Package"}
                  </a>
                )}
                <button
                  onClick={() => toggleCompare(rate.id)}
                  aria-pressed={compareIds.has(rate.id)}
                  className={`ml-auto px-4 py-2 text-sm font-medium rounded-full transition-colors flex items-center gap-2 ${
                    compareIds.has(rate.id)
                      ? "bg-accent-50 text-accent border border-accent/30"
                      : "text-muted hover:text-ink border border-transparent hover:border-line"
                  }`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    strokeLinejoin="round" aria-hidden="true">
                    {compareIds.has(rate.id) ? (
                      <polyline points="20 6 9 17 4 12" />
                    ) : (
                      <>
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      </>
                    )}
                  </svg>
                  {labels.compare}
                </button>
              </div>
              <div className="sm:hidden mt-2 text-xs text-body">
                {labels.tracking}: {rate.tracking ? labels.yes : labels.no}
              </div>
            </div>
          );
        })}
      </div>

      {ratesAtWeight.length === 0 && (
        <div className="text-center py-12 px-6 bg-warm-50 rounded-2xl border border-warm/30">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            className="text-warm mx-auto mb-3" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
          <p className="text-base font-semibold text-ink mb-3">{labels.no_filter_results}</p>
          <button
            onClick={() => setFilterType("all")}
            className="px-4 py-2 bg-white border border-line text-ink text-sm font-semibold rounded-full hover:bg-bg-alt btn-press transition"
          >
            {labels.reset_filter ?? labels.all}
          </button>
        </div>
      )}

      <p className="mt-8 text-xs text-muted leading-relaxed">
        {labels.disclaimer}
      </p>

      {/* Sticky compare bar — appears at the bottom of the viewport when the
          user has selected one or more rates. Slides up via CSS transform.
          On click "Compare" it scrolls to the comparison table at top. */}
      {compareIds.size > 0 && !showCompare && (
        <div
          className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pointer-events-none"
          role="region"
          aria-label="Comparison selection"
        >
          <div
            className="max-w-3xl mx-auto pointer-events-auto bg-[#0F172A] text-white rounded-2xl shadow-[0_24px_60px_-15px_rgba(15,23,42,.45)] px-5 py-3.5 flex items-center justify-between gap-4 animate-[slideUp_.25s_ease-out_both]"
            style={{
              // The slideUp keyframe lives in globals.css scope; fall back to
              // an inline style so we don't depend on a Tailwind plugin.
              transform: "translateY(0)",
            }}
          >
            <style>{`
              @keyframes slideUp {
                from { transform: translateY(120%); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
              }
              @media (prefers-reduced-motion: reduce) {
                [data-compare-bar] { animation: none !important; }
              }
            `}</style>
            <div data-compare-bar className="flex items-center gap-3 min-w-0">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent text-white text-sm font-bold shrink-0">
                {compareIds.size}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">
                  {compareIds.size === 1
                    ? `1 ${labels.compare.toLowerCase()}`
                    : `${compareIds.size} ${labels.compare.toLowerCase()}`}
                </p>
                <p className="text-xs text-white/60 truncate">
                  {comparedRates.map((r) => r.carrier_name).join(" · ")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setCompareIds(new Set())}
                className="px-3 py-2 text-xs text-white/70 hover:text-white transition-colors"
                aria-label={labels.close}
              >
                {labels.close}
              </button>
              <button
                onClick={() => {
                  setShowCompare(true);
                  // Scroll to the top so the comparison table is in view.
                  if (typeof window !== "undefined") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                disabled={compareIds.size < 2}
                className="px-5 py-2.5 bg-accent text-white text-sm font-semibold rounded-full hover:bg-[#1558B8] disabled:bg-white/15 disabled:cursor-not-allowed transition-colors btn-press"
              >
                {labels.comparison} →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
