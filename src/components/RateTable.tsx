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
    <div className="flex items-center gap-2 mb-4">
      <span className="text-sm text-gray-400">{labels.currency}:</span>
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/20 bg-dark-700 text-gray-200 hover:bg-dark-600 hover:border-white/30 transition-colors text-sm"
        >
          <span className="font-medium">{current?.symbol}</span>
          <span>{currency}</span>
          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {open && (
          <div className="absolute left-0 mt-1 w-64 bg-dark-700 border border-white/20 rounded-lg shadow-xl z-50 overflow-hidden">
            <div className="p-2 border-b border-white/10">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search currency..."
                className="w-full px-3 py-1.5 text-sm bg-dark-600 border border-white/10 rounded text-gray-100 placeholder-gray-500 focus:outline-none focus:border-accent/50"
                autoFocus
              />
            </div>
            <div className="max-h-60 overflow-y-auto">
              {filtered.map(([code, info]) => (
                <button
                  key={code}
                  onClick={() => { setCurrency(code); setOpen(false); setSearch(""); }}
                  className={`w-full px-3 py-2 text-left text-sm flex items-center justify-between transition-colors ${
                    code === currency ? "bg-accent/20 text-accent-light" : "text-gray-300 hover:bg-dark-600"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="font-medium w-6">{info.symbol}</span>
                    <span>{code}</span>
                  </span>
                  <span className="text-xs text-gray-500">{info.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {currency !== "USD" && (
        <span className="text-xs text-gray-500">
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
      <div className="text-center py-12 text-gray-500">
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
      <div className="bg-surface border border-white/10 rounded-lg p-4 mb-6">
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {labels.select_weight}
          </label>
          <div className="flex flex-wrap gap-2">
            {weightPresets.map((w) => (
              <button
                key={w}
                onClick={() => { setSelectedPreset(w); setCustomWeight(""); }}
                aria-label={`${w} ${labels.kg}`}
                aria-pressed={selectedPreset === w && !customWeight}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedPreset === w && !customWeight
                    ? "bg-accent text-white"
                    : "bg-dark-700 border border-white/20 text-gray-300 hover:border-accent/50"
                }`}
              >
                {w} {labels.kg}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">
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
                className="w-20 px-3 py-2 border border-white/20 rounded-lg text-sm bg-dark-700 text-gray-100 focus:outline-none focus:ring-1 focus:ring-accent placeholder-gray-500"
              />
              <span className="text-sm text-gray-500">{labels.kg}</span>
            </div>
          </div>

          <button
            onClick={() => setShowDimensions(!showDimensions)}
            className="px-3 py-2 text-sm text-accent-light hover:text-white border border-accent/30 rounded-lg hover:bg-accent/10 transition-colors"
          >
            {showDimensions ? labels.hide_dimensions : labels.enter_dimensions}
          </button>
        </div>

        {showDimensions && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <label className="block text-xs text-gray-500 mb-2">
              {labels.package_dimensions}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={dimensions.l}
                onChange={(e) => setDimensions({ ...dimensions, l: e.target.value })}
                placeholder="L"
                min="1"
                className="w-20 px-3 py-2 border border-white/20 rounded-lg text-sm bg-dark-700 text-gray-100 focus:outline-none focus:ring-1 focus:ring-accent placeholder-gray-500"
              />
              <span className="text-gray-500">×</span>
              <input
                type="number"
                value={dimensions.w}
                onChange={(e) => setDimensions({ ...dimensions, w: e.target.value })}
                placeholder="W"
                min="1"
                className="w-20 px-3 py-2 border border-white/20 rounded-lg text-sm bg-dark-700 text-gray-100 focus:outline-none focus:ring-1 focus:ring-accent placeholder-gray-500"
              />
              <span className="text-gray-500">×</span>
              <input
                type="number"
                value={dimensions.h}
                onChange={(e) => setDimensions({ ...dimensions, h: e.target.value })}
                placeholder="H"
                min="1"
                className="w-20 px-3 py-2 border border-white/20 rounded-lg text-sm bg-dark-700 text-gray-100 focus:outline-none focus:ring-1 focus:ring-accent placeholder-gray-500"
              />
              <span className="text-sm text-gray-500">cm</span>
            </div>
            {volumetricWeight > 0 && (
              <div className="mt-2 text-sm">
                <span className="text-gray-400">
                  {labels.volumetric_weight}:{" "}
                </span>
                <span className="font-semibold text-white">{volumetricWeight.toFixed(1)} {labels.kg}</span>
                {effectiveWeight > ((selectedPreset ?? parseFloat(customWeight)) || 0) && (
                  <span className="ml-2 text-orange-400 text-xs">
                    ⚠ {labels.volumetric_exceeds}
                  </span>
                )}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {labels.volumetric_formula}
            </p>
          </div>
        )}

        {effectiveWeight > 0 && (
          <div className="mt-3 pt-3 border-t border-white/10 text-sm">
            <span className="text-gray-400">{labels.billed_at}: </span>
            <span className="font-semibold text-white">{billingWeight} {labels.kg}</span>
            {billingWeight !== effectiveWeight && (
              <span className="text-xs text-gray-500 ml-1">
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
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2" role="group" aria-label={labels.sort}>
          <span className="text-sm text-gray-400">{labels.sort}:</span>
          <button
            onClick={() => setSortBy("price")}
            aria-pressed={sortBy === "price"}
            aria-sort={sortBy === "price" ? "ascending" : undefined}
            className={`px-3 py-1.5 rounded text-sm transition-colors ${
              sortBy === "price" ? "bg-accent text-white" : "bg-dark-700 text-gray-300 hover:bg-dark-600"
            }`}
          >
            {labels.price}
          </button>
          <button
            onClick={() => setSortBy("speed")}
            aria-pressed={sortBy === "speed"}
            aria-sort={sortBy === "speed" ? "ascending" : undefined}
            className={`px-3 py-1.5 rounded text-sm transition-colors ${
              sortBy === "speed" ? "bg-accent text-white" : "bg-dark-700 text-gray-300 hover:bg-dark-600"
            }`}
          >
            {labels.delivery_time}
          </button>
          <button
            onClick={() => setSortBy("reliability")}
            aria-pressed={sortBy === "reliability"}
            className={`px-3 py-1.5 rounded text-sm transition-colors ${
              sortBy === "reliability" ? "bg-accent text-white" : "bg-dark-700 text-gray-300 hover:bg-dark-600"
            }`}
          >
            {labels.route_reliability || "Route ★"}
          </button>
        </div>
        <div className="h-4 w-px bg-white/10 hidden sm:block" />
        <div className="flex items-center gap-2" role="group" aria-label={labels.type_label}>
          <span className="text-sm text-gray-400">{labels.type_label}:</span>
          {typeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilterType(opt.value)}
              aria-pressed={filterType === opt.value}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                filterType === opt.value ? "bg-accent text-white" : "bg-dark-700 text-gray-300 hover:bg-dark-600"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count + compare button */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-400">
          {ratesAtWeight.length} {labels.results}
        </p>
        {compareIds.size >= 2 && (
          <button
            onClick={() => setShowCompare(!showCompare)}
            className="px-4 py-1.5 bg-accent text-white text-sm rounded-lg hover:bg-accent-dark transition-colors"
          >
            {labels.compare} ({compareIds.size})
          </button>
        )}
      </div>

      {/* Comparison table */}
      {showCompare && comparedRates.length >= 2 && (
        <div className="mb-6 bg-accent/10 border border-accent/30 rounded-lg p-4 overflow-x-auto">
          <h3 className="font-semibold text-white mb-3">
            {labels.comparison}
          </h3>
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="text-left text-gray-400">
                <th className="pb-2" scope="col">{labels.carrier}</th>
                <th className="pb-2" scope="col">{labels.service}</th>
                <th className="pb-2" scope="col">{labels.price}</th>
                <th className="pb-2" scope="col">{labels.delivery_time}</th>
                <th className="pb-2" scope="col">{labels.tracking}</th>
              </tr>
            </thead>
            <tbody>
              {comparedRates.map((rate) => (
                <tr key={rate.id} className="border-t border-accent/20">
                  <td className="py-2 font-medium text-gray-200">{rate.carrier_name}</td>
                  <td className="py-2 text-gray-300">{rate.service_name}</td>
                  <td className="py-2 font-bold text-white">${rate.price}{currency !== "USD" && rate.price ? ` (${convertPrice(rate.price, currency)})` : ""}</td>
                  <td className="py-2 text-gray-300">{rate.estimated_days_min}–{rate.estimated_days_max} {labels.days}</td>
                  <td className="py-2 text-gray-300">{rate.tracking ? labels.yes : labels.no}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={() => setShowCompare(false)}
            className="mt-2 text-sm text-accent-light hover:text-white transition-colors"
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
          const isCompared = compareIds.has(rate.id);

          return (
            <div
              key={rate.id}
              className={`bg-surface rounded-lg border p-4 sm:p-5 transition-colors ${
                isCheapest
                  ? "border-green-500/50 ring-1 ring-green-500/30"
                  : isFastest
                  ? "border-accent/50 ring-1 ring-accent/30"
                  : isCompared
                  ? "border-purple-500/50 ring-1 ring-purple-500/30"
                  : "border-white/10"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <input
                      type="checkbox"
                      checked={isCompared}
                      onChange={() => toggleCompare(rate.id)}
                      className="w-4 h-4 text-accent rounded border-white/30 bg-dark-700 focus:ring-accent"
                      aria-label={`${labels.compare} ${rate.carrier_name} ${rate.service_name}`}
                      title={labels.compare}
                    />
                    <span className="font-semibold text-white">
                      {rate.carrier_name}
                    </span>
                    {isCheapest && (
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                        {labels.cheapest}
                      </span>
                    )}
                    {isFastest && (
                      <span className="px-2 py-0.5 bg-accent/20 text-accent-light text-xs font-medium rounded-full">
                        {labels.fastest}
                      </span>
                    )}
                    {rate.route_score && (
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          rate.route_score >= 4.0 ? "bg-green-500/20 text-green-400" :
                          rate.route_score >= 3.0 ? "bg-yellow-500/20 text-yellow-400" :
                          rate.route_score >= 2.0 ? "bg-orange-500/20 text-orange-400" :
                          "bg-red-500/20 text-red-400"
                        }`}
                        title={rate.route_score_label}
                      >
                        {rate.route_score.toFixed(1)} ★
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        rate.carrier_type === "international"
                          ? "bg-purple-500/20 text-purple-400"
                          : rate.carrier_type === "postal"
                          ? "bg-orange-500/20 text-orange-400"
                          : "bg-teal-500/20 text-teal-400"
                      }`}
                    >
                      {rate.carrier_type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 ml-6">
                    <p className="text-sm text-gray-400">{rate.service_name}</p>
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
                        <span className="text-gray-500">({rate.review.reviews >= 1000 ? `${(rate.review.reviews / 1000).toFixed(1)}K` : rate.review.reviews})</span>
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 uppercase">
                      {labels.delivery_time}
                    </p>
                    <p className="font-medium text-gray-200">
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
                    <p className="font-medium text-gray-200">
                      {rate.tracking ? labels.yes : labels.no}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase">
                      {labels.price}
                    </p>
                    <p className="text-2xl font-bold text-white">
                      ${rate.price}
                    </p>
                    {currency !== "USD" && rate.price && (
                      <p className="text-xs text-gray-500">
                        {convertPrice(rate.price, currency)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-3 ml-6 flex-wrap">
                {rate.carrier_website && (
                  <a
                    href={rate.carrier_website}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="px-4 py-1.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-dark transition-colors"
                  >
                    {labels.ship_now || "Ship Now →"}
                  </a>
                )}
                {rate.tracking && rate.tracking_url && (
                  <a
                    href={rate.tracking_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 border border-white/20 text-gray-300 text-sm rounded-lg hover:border-accent/50 hover:text-white transition-colors"
                  >
                    {labels.track_package || "Track Package"}
                  </a>
                )}
              </div>
              <div className="sm:hidden mt-2 text-xs text-gray-500 ml-6">
                {labels.tracking}: {rate.tracking ? labels.yes : labels.no}
              </div>
            </div>
          );
        })}
      </div>

      {ratesAtWeight.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>{labels.no_filter_results}</p>
        </div>
      )}

      <p className="mt-6 text-xs text-gray-500 leading-relaxed">
        {labels.disclaimer}
      </p>
    </div>
  );
}
