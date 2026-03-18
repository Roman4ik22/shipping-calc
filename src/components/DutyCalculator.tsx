"use client";

import { useState } from "react";
import { getCustomsInfo, getCustomsNotes } from "@/lib/customs";
import type { Locale } from "@/lib/types";

interface DutyCalculatorProps {
  destCode: string;
  locale: Locale;
  labels: {
    title: string;
    item_value: string;
    calculate: string;
    duty: string;
    vat: string;
    total_import_cost: string;
    de_minimis_note: string;
    below_threshold: string;
    currency_label: string;
    result_title: string;
  };
}

interface CalcResult {
  itemValue: number;
  belowThreshold: boolean;
  duty: number;
  vat: number;
  totalImportCost: number;
}

export default function DutyCalculator({
  destCode,
  locale,
  labels,
}: DutyCalculatorProps) {
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState<CalcResult | null>(null);

  const customs = getCustomsInfo(destCode);
  const notes = getCustomsNotes(customs, locale);

  function handleCalculate() {
    const value = parseFloat(inputValue);
    if (isNaN(value) || value <= 0) return;

    const belowThreshold =
      customs.de_minimis_usd > 0 && value <= customs.de_minimis_usd;

    let duty: number;
    let vat: number;

    if (belowThreshold) {
      duty = 0;
      vat = 0;
    } else {
      const dutiableValue =
        customs.de_minimis_usd > 0
          ? Math.max(0, value - customs.de_minimis_usd)
          : value;
      duty = (dutiableValue * customs.avg_duty_rate) / 100;
      vat = ((value + duty) * customs.vat_rate) / 100;
    }

    const totalImportCost = value + duty + vat;

    setResult({
      itemValue: value,
      belowThreshold,
      duty,
      vat,
      totalImportCost,
    });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleCalculate();
  }

  return (
    <div className="bg-surface border border-white/10 rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4">{labels.title}</h3>

      {/* Input row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1">
          <label className="block text-sm text-gray-400 mb-1">
            {labels.item_value} ({labels.currency_label}: USD)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              $
            </span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="0.00"
              className="w-full pl-7 pr-3 py-2.5 bg-dark-700 border border-white/10 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30"
            />
          </div>
        </div>
        <div className="flex items-end">
          <button
            onClick={handleCalculate}
            className="w-full sm:w-auto px-6 py-2.5 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 transition-colors"
          >
            {labels.calculate}
          </button>
        </div>
      </div>

      {/* De minimis info */}
      {customs.de_minimis_usd > 0 && (
        <p className="text-xs text-gray-400 mb-4">
          {labels.de_minimis_note}: ${customs.de_minimis_usd} USD
        </p>
      )}

      {/* Results */}
      {result && (
        <div className="mt-4 bg-accent/10 border border-accent/30 rounded-lg p-5">
          <h4 className="text-sm font-semibold text-accent-light mb-3">
            {labels.result_title}
          </h4>

          {result.belowThreshold && (
            <div className="mb-3 px-3 py-2 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-sm text-green-400 font-medium">
                {labels.below_threshold}
              </p>
            </div>
          )}

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">{labels.item_value}</span>
              <span className="text-gray-100 font-medium">
                ${result.itemValue.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">
                {labels.duty} ({customs.avg_duty_rate}%)
              </span>
              <span className="text-gray-100 font-medium">
                ${result.duty.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">
                {labels.vat} ({customs.vat_rate}%)
              </span>
              <span className="text-gray-100 font-medium">
                ${result.vat.toFixed(2)}
              </span>
            </div>
            <div className="border-t border-white/10 pt-2 flex justify-between">
              <span className="text-white font-semibold">
                {labels.total_import_cost}
              </span>
              <span className="text-white font-bold text-base">
                ${result.totalImportCost.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Country-specific notes */}
          {notes && (
            <p className="mt-3 text-xs text-gray-400 italic">{notes}</p>
          )}
        </div>
      )}
    </div>
  );
}
