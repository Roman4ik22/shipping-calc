"use client";

import { useState } from "react";
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
  const weightSteps = [0.5, 1, 2, 5, 10, 20, 30];
  const [selectedWeight, setSelectedWeight] = useState(1);
  const [sortBy, setSortBy] = useState<"price" | "speed">("price");
  const [filterType, setFilterType] = useState<"all" | "international" | "regional" | "postal">("all");

  if (corridorRates.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">{labels.no_rates}</p>
      </div>
    );
  }

  // Get rates for selected weight
  const ratesAtWeight = corridorRates
    .map((cr) => {
      const rate = cr.rates.find((r) => r.weight_kg === selectedWeight);
      return { ...cr, price: rate?.price_usd ?? null };
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

  return (
    <div>
      {/* Weight selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {labels.select_weight}
        </label>
        <div className="flex flex-wrap gap-2">
          {weightSteps.map((w) => (
            <button
              key={w}
              onClick={() => setSelectedWeight(w)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedWeight === w
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:border-blue-400"
              }`}
            >
              {w} {labels.kg}
            </button>
          ))}
        </div>
      </div>

      {/* Sort & filter controls */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
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

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-3">
        {ratesAtWeight.length} {locale === "ru" ? "результатов" : "results"}
      </p>

      {/* Rate cards */}
      <div className="space-y-3">
        {ratesAtWeight.map((rate) => {
          const isCheapest = rate === cheapest;
          const isFastest = rate === fastest && !isCheapest;

          return (
            <div
              key={`${rate.carrier_name}-${rate.service_name}`}
              className={`bg-white rounded-lg border p-4 sm:p-5 ${
                isCheapest
                  ? "border-green-300 ring-1 ring-green-200"
                  : isFastest
                  ? "border-blue-300 ring-1 ring-blue-200"
                  : "border-gray-200"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
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
                  <p className="text-sm text-gray-500">{rate.service_name}</p>
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
                  </div>
                </div>
              </div>
              {/* Mobile tracking info */}
              <div className="sm:hidden mt-2 text-xs text-gray-500">
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
