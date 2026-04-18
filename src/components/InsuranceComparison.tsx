"use client";

import { useState } from "react";

interface InsuranceOption {
  carrier: string;
  included: boolean;
  maxCoverage: number;
  premiumPercent: number;
  note: string;
}

const insuranceData: InsuranceOption[] = [
  { carrier: "DHL Express", included: true, maxCoverage: 100, premiumPercent: 2.5, note: "Basic coverage included. Extended up to $50,000" },
  { carrier: "FedEx", included: true, maxCoverage: 100, premiumPercent: 2.8, note: "Declared value coverage. Max $50,000 per package" },
  { carrier: "UPS", included: true, maxCoverage: 100, premiumPercent: 2.7, note: "Declared value. Max $50,000. High-value surcharge above $5,000" },
  { carrier: "EMS", included: true, maxCoverage: 50, premiumPercent: 0, note: "Basic SDR-based compensation only. No premium option" },
  { carrier: "USPS", included: true, maxCoverage: 5, premiumPercent: 3.0, note: "Priority Mail Express includes $100. Extra insurance up to $5,000" },
  { carrier: "Royal Mail", included: true, maxCoverage: 50, premiumPercent: 2.5, note: "Consequential loss cover. Max £2,500 for international" },
  { carrier: "Aramex", included: false, maxCoverage: 0, premiumPercent: 3.0, note: "Optional insurance. Covers damage and loss" },
  { carrier: "SF Express", included: true, maxCoverage: 30, premiumPercent: 2.0, note: "Basic coverage included for declared value" },
  { carrier: "DPD", included: true, maxCoverage: 520, premiumPercent: 0, note: "Standard liability €520. No premium insurance option" },
  { carrier: "Japan Post", included: true, maxCoverage: 200, premiumPercent: 0, note: "Registered mail includes coverage up to 200 SDR" },
];

export default function InsuranceComparison({
  labels,
}: {
  labels: {
    title: string;
    item_value: string;
    calculate: string;
    carrier: string;
    included: string;
    premium: string;
    payout: string;
    yes: string;
    no: string;
    note: string;
  };
}) {
  const [itemValue, setItemValue] = useState("");

  const value = parseFloat(itemValue) || 0;

  return (
    <div className="bg-surface border border-line rounded-xl p-6">
      <h3 className="text-lg font-bold text-ink mb-4">{labels.title}</h3>

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-body">$</span>
          <input
            type="number"
            value={itemValue}
            onChange={(e) => setItemValue(e.target.value)}
            placeholder="0"
            min="0"
            className="w-full pl-7 pr-3 py-2.5 bg-dark-700 border border-line rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-accent/50"
          />
        </div>
        <span className="text-body self-center text-sm">{labels.item_value}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-body border-b border-line">
              <th className="pb-2 pr-4">{labels.carrier}</th>
              <th className="pb-2 pr-4">{labels.included}</th>
              <th className="pb-2 pr-4">{labels.premium}</th>
              {value > 0 && <th className="pb-2 pr-4">{labels.payout}</th>}
              <th className="pb-2">{labels.note}</th>
            </tr>
          </thead>
          <tbody>
            {insuranceData.map((ins) => {
              const premium = value > 0 && ins.premiumPercent > 0
                ? (value * ins.premiumPercent / 100)
                : 0;
              const payout = value > 0
                ? Math.min(value, ins.maxCoverage > 0 ? ins.maxCoverage + (ins.premiumPercent > 0 ? value : 0) : 0)
                : 0;

              return (
                <tr key={ins.carrier} className="border-b border-line">
                  <td className="py-2.5 pr-4 font-medium text-gray-200">{ins.carrier}</td>
                  <td className="py-2.5 pr-4">
                    <span className={ins.included ? "text-green-400" : "text-muted"}>
                      {ins.included ? `${labels.yes} ($${ins.maxCoverage})` : labels.no}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4 text-body">
                    {ins.premiumPercent > 0 ? `${ins.premiumPercent}%` : "—"}
                    {premium > 0 && <span className="text-muted ml-1">(${premium.toFixed(2)})</span>}
                  </td>
                  {value > 0 && (
                    <td className="py-2.5 pr-4 text-ink font-medium">
                      {payout > 0 ? `$${Math.min(value, payout).toFixed(0)}` : "—"}
                    </td>
                  )}
                  <td className="py-2.5 text-muted text-xs">{ins.note}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
