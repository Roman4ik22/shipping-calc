"use client";

import { useState, useMemo } from "react";

interface DeliveryDateEstimatorProps {
  estimatedDaysMin: number;
  estimatedDaysMax: number;
  locale: string;
  labels: {
    title: string;
    ship_today: string;
    estimated_arrival: string;
    business_days_note: string;
  };
}

/**
 * Add the given number of business days to a date, skipping weekends
 * (Saturday = 6, Sunday = 0).
 */
function addBusinessDays(start: Date, businessDays: number): Date {
  const result = new Date(start);
  let added = 0;
  while (added < businessDays) {
    result.setDate(result.getDate() + 1);
    const day = result.getDay();
    if (day !== 0 && day !== 6) {
      added++;
    }
  }
  return result;
}

/** Format a date using the Intl API for the given locale. */
function formatDate(date: Date, locale: string): string {
  return date.toLocaleDateString(locale, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format an arrival range. If both dates share the same month & year,
 * collapse to "March 24 — 28, 2026" style; otherwise show full dates.
 */
function formatRange(min: Date, max: Date, locale: string): string {
  if (
    min.getMonth() === max.getMonth() &&
    min.getFullYear() === max.getFullYear()
  ) {
    const monthYear = max.toLocaleDateString(locale, {
      month: "long",
      year: "numeric",
    });
    const dayMin = min.getDate();
    const dayMax = max.getDate();
    // e.g. "March 24 — 28, 2026"
    return `${max.toLocaleDateString(locale, { month: "long" })} ${dayMin} — ${dayMax}, ${max.getFullYear()}`;
  }
  return `${formatDate(min, locale)} — ${formatDate(max, locale)}`;
}

/** Convert a Date to a YYYY-MM-DD string for the <input type="date"> value. */
function toInputValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function DeliveryDateEstimator({
  estimatedDaysMin,
  estimatedDaysMax,
  locale,
  labels,
}: DeliveryDateEstimatorProps) {
  const [shipDate, setShipDate] = useState<Date>(() => new Date());

  const { arrivalMin, arrivalMax } = useMemo(() => {
    return {
      arrivalMin: addBusinessDays(shipDate, estimatedDaysMin),
      arrivalMax: addBusinessDays(shipDate, estimatedDaysMax),
    };
  }, [shipDate, estimatedDaysMin, estimatedDaysMax]);

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    if (!val) return;
    const [y, m, d] = val.split("-").map(Number);
    setShipDate(new Date(y, m - 1, d));
  }

  return (
    <div className="bg-surface border border-white/10 rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4">{labels.title}</h3>

      {/* Ship date picker */}
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1">
          {labels.ship_today}
        </label>
        <div className="flex items-center gap-3">
          <span className="text-gray-100 font-medium">
            {formatDate(shipDate, locale)}
          </span>
          <input
            type="date"
            value={toInputValue(shipDate)}
            onChange={handleDateChange}
            className="px-3 py-1.5 bg-dark-700 border border-white/10 rounded-lg text-gray-100 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 text-sm [color-scheme:dark]"
          />
        </div>
      </div>

      {/* Estimated arrival */}
      <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
        <p className="text-sm text-gray-400 mb-1">{labels.estimated_arrival}</p>
        <p className="text-lg font-semibold text-accent-light">
          {formatRange(arrivalMin, arrivalMax, locale)}
        </p>
        <p className="text-xs text-gray-400 mt-2">
          {labels.business_days_note}
        </p>
      </div>
    </div>
  );
}
