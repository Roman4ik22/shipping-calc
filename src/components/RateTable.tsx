"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import type { Locale } from "@/lib/types";

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
      <span className="text-sm text-gray-500">{labels.currency}:</span>
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-3 py-1.5 text-gray-400 hover:text-white transition-colors text-sm"
        >
          <span className="font-medium">{current?.symbol}</span>
          <span>{currency}</span>
          <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {open && (
          <div className="absolute left-0 mt-1 w-64 bg-[#1a1a1a] rounded-xl shadow-2xl z-50 overflow-hidden">
            <div className="p-3">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search currency..."
                className="w-full px-3 py-1.5 text-sm bg-transparent border-b border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-white/30"
                autoFocus
              />
            </div>
            <div className="max-h-60 overflow-y-auto">
              {filtered.map(([code, info]) => (
                <button
                  key={code}
                  onClick={() => { setCurrency(code); setOpen(false); setSearch(""); }}
                  className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between transition-colors hover:bg-white/5 ${
                    code === currency ? "text-white font-medium" : "text-gray-400"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="font-medium w-6">{info.symbol}</span>
                    <span>{code}</span>
                  </span>
                  <span className="text-xs text-gray-600">{info.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {currency !== "USD" && (
        <span className="text-xs text-gray-600">
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
      <div className="text-center py-12 text-gray-600">
        <p className="text-lg">{labels.no_rates}</p>
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
      <div className="mb-8">
        <div className="mb-4">
          <label className="block text-xs text-gray-500 mb-3 uppercase tracking-wide">
            {labels.select_weight}
          </label>
          <div className="flex flex-wrap gap-1">
            {weightPresets.map((w) => (
              <button
                key={w}
                onClick={() => { setSelectedPreset(w); setCustomWeight(""); }}
                aria-label={`${w} ${labels.kg}`}
                aria-pressed={selectedPreset === w && !customWeight}
                className={`px-3 py-2 text-sm transition-colors ${
                  selectedPreset === w && !customWeight
                    ? "text-white font-medium border-b-2 border-white"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {w} {labels.kg}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              {labels.or_enter_weight}
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
                className="w-20 px-3 py-2 bg-transparent border-b border-white/10 text-sm text-white focus:outline-none focus:border-white/30 placeholder-gray-600"
              />
              <span className="text-sm text-gray-600">{labels.kg}</span>
            </div>
          </div>

          <button
            onClick={() => setShowDimensions(!showDimensions)}
            className="px-3 py-2 text-sm text-gray-500 hover:text-white transition-colors"
          >
            {showDimensions ? labels.hide_dimensions : labels.enter_dimensions}
          </button>
        </div>

        {showDimensions && (
          <div className="mt-4 pt-4 border-t border-white/5">
            <label className="block text-xs text-gray-600 mb-2">
              {labels.package_dimensions}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={dimensions.l}
                onChange={(e) => setDimensions({ ...dimensions, l: e.target.value })}
                placeholder="L"
                min="1"
                className="w-20 px-3 py-2 bg-transparent border-b border-white/10 text-sm text-white focus:outline-none focus:border-white/30 placeholder-gray-600"
              />
              <span className="text-gray-600">\u00d7</span>
              <input
                type="number"
                value={dimensions.w}
                onChange={(e) => setDimensions({ ...dimensions, w: e.target.value })}
                placeholder="W"
                min="1"
                className="w-20 px-3 py-2 bg-transparent border-b border-white/10 text-sm text-white focus:outline-none focus:border-white/30 placeholder-gray-600"
              />
              <span className="text-gray-600">\u00d7</span>
              <input
                type="number"
                value={dimensions.h}
                onChange={(e) => setDimensions({ ...dimensions, h: e.target.value })}
                placeholder="H"
                min="1"
                className="w-20 px-3 py-2 bg-transparent border-b border-white/10 text-sm text-white focus:outline-none focus:border-white/30 placeholder-gray-600"
              />
              <span className="text-sm text-gray-600">cm</span>
            </div>
            {volumetricWeight > 0 && (
              <div className="mt-2 text-sm">
                <span className="text-gray-500">
                  {labels.volumetric_weight}:{" "}
                </span>
                <span className="font-medium text-white">{volumetricWeight.toFixed(1)} {labels.kg}</span>
                {effectiveWeight > ((selectedPreset ?? parseFloat(customWeight)) || 0) && (
                  <span className="ml-2 text-orange-400 text-xs">
                    {labels.volumetric_exceeds}
                  </span>
                )}
              </div>
            )}
            <p className="text-xs text-gray-600 mt-1">
              {labels.volumetric_formula}
            </p>
          </div>
        )}

        {effectiveWeight > 0 && (
          <div className="mt-4 pt-4 border-t border-white/5 text-sm">
            <span className="text-gray-500">{labels.billed_at}: </span>
            <span className="font-medium text-white">{billingWeight} {labels.kg}</span>
            {billingWeight !== effectiveWeight && (
              <span className="text-xs text-gray-600 ml-1">
                ({labels.nearest_bracket})
              </span>
            )}
          </div>
        )}
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
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-1" role="group" aria-label={labels.sort}>
          <span className="text-sm text-gray-600 mr-1">{labels.sort}:</span>
          <button
            onClick={() => setSortBy("price")}
            aria-pressed={sortBy === "price"}
            aria-sort={sortBy === "price" ? "ascending" : undefined}
            className={`px-3 py-1.5 text-sm transition-colors ${
              sortBy === "price" ? "text-white border-b border-white" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {labels.price}
          </button>
          <button
            onClick={() => setSortBy("speed")}
            aria-pressed={sortBy === "speed"}
            aria-sort={sortBy === "speed" ? "ascending" : undefined}
            className={`px-3 py-1.5 text-sm transition-colors ${
              sortBy === "speed" ? "text-white border-b border-white" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {labels.delivery_time}
          </button>
          <button
            onClick={() => setSortBy("reliability")}
            aria-pressed={sortBy === "reliability"}
            className={`px-3 py-1.5 text-sm transition-colors ${
              sortBy === "reliability" ? "text-white border-b border-white" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {labels.route_reliability || "Route"}
          </button>
        </div>
        <div className="h-4 w-px bg-white/5 hidden sm:block" />
        <div className="flex items-center gap-1" role="group" aria-label={labels.type_label}>
          <span className="text-sm text-gray-600 mr-1">{labels.type_label}:</span>
          {typeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilterType(opt.value)}
              aria-pressed={filterType === opt.value}
              className={`px-3 py-1.5 text-sm transition-colors ${
                filterType === opt.value ? "text-white border-b border-white" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          {ratesAtWeight.length} {labels.results}
        </p>
      </div>

      {/* Comparison table */}
      {showCompare && comparedRates.length >= 2 && (
        <div className="mb-6 border-b border-white/5 pb-6 overflow-x-auto">
          <h3 className="font-medium text-white mb-3 text-sm">
            {labels.comparison}
          </h3>
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="pb-2 font-normal" scope="col">{labels.carrier}</th>
                <th className="pb-2 font-normal" scope="col">{labels.service}</th>
                <th className="pb-2 font-normal" scope="col">{labels.price}</th>
                <th className="pb-2 font-normal" scope="col">{labels.delivery_time}</th>
                <th className="pb-2 font-normal" scope="col">{labels.tracking}</th>
              </tr>
            </thead>
            <tbody>
              {comparedRates.map((rate) => (
                <tr key={rate.id} className="border-t border-white/5">
                  <td className="py-2 font-medium text-white">{rate.carrier_name}</td>
                  <td className="py-2 text-gray-400">{rate.service_name}</td>
                  <td className="py-2 font-light text-white">${rate.price}{currency !== "USD" && rate.price ? ` (${convertPrice(rate.price, currency)})` : ""}</td>
                  <td className="py-2 text-gray-400">{rate.estimated_days_min}–{rate.estimated_days_max} {labels.days}</td>
                  <td className="py-2 text-gray-400">{rate.tracking ? labels.yes : labels.no}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={() => setShowCompare(false)}
            className="mt-2 text-sm text-gray-500 hover:text-white transition-colors"
          >
            {labels.close}
          </button>
        </div>
      )}

      {/* Rate cards */}
      <div className="divide-y divide-white/5">
        {ratesAtWeight.map((rate) => {
          const isCheapest = rate === cheapest;
          const isFastest = rate === fastest && !isCheapest;

          return (
            <div
              key={rate.id}
              className="py-5 sm:py-6 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <span className="font-medium text-white">
                      {rate.carrier_name}
                    </span>
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
                    <span className="text-xs text-gray-600">
                      {rate.carrier_type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-500">{rate.service_name}</p>
                    {rate.review && (
                      <a
                        href={rate.review.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-xs flex items-center gap-1 ${
                          rate.review.rating >= 3.5 ? "text-green-400" :
                          rate.review.rating >= 2.5 ? "text-yellow-400" :
                          rate.review.rating >= 1.5 ? "text-orange-400" : "text-red-400"
                        } hover:underline`}
                        title="Trustpilot"
                      >
                        <span>★ {rate.review.rating.toFixed(1)}</span>
                        <span className="text-gray-600">({rate.review.reviews >= 1000 ? `${(rate.review.reviews / 1000).toFixed(1)}K` : rate.review.reviews})</span>
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-6 sm:gap-8">
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">
                      {labels.delivery_time}
                    </p>
                    <p className="text-gray-300">
                      {rate.estimated_days_min}–{rate.estimated_days_max}{" "}
                      <span className="text-sm text-gray-600">
                        {labels.days}
                      </span>
                    </p>
                  </div>
                  <div className="text-center hidden sm:block">
                    <p className="text-xs text-gray-600 mb-1">
                      {labels.tracking}
                    </p>
                    <p className="text-gray-300">
                      {rate.tracking ? labels.yes : labels.no}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600 mb-1">
                      {labels.price}
                    </p>
                    <p className="text-3xl font-light text-white">
                      ${rate.price}
                    </p>
                    {currency !== "USD" && rate.price && (
                      <p className="text-xs text-gray-600">
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
                    rel="noopener noreferrer sponsored"
                    className="px-5 py-2 bg-white text-black text-sm font-medium rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {labels.ship_now || "Ship Now"}
                  </a>
                )}
                {rate.tracking && rate.tracking_url && (
                  <a
                    href={rate.tracking_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-gray-500 text-sm hover:text-white transition-colors"
                  >
                    {labels.track_package || "Track Package"}
                  </a>
                )}
              </div>
              <div className="sm:hidden mt-2 text-xs text-gray-600">
                {labels.tracking}: {rate.tracking ? labels.yes : labels.no}
              </div>
            </div>
          );
        })}
      </div>

      {ratesAtWeight.length === 0 && (
        <div className="text-center py-8 text-gray-600">
          <p>{labels.no_filter_results}</p>
        </div>
      )}

      <p className="mt-8 text-xs text-gray-600 leading-relaxed">
        {labels.disclaimer}
      </p>
    </div>
  );
}
