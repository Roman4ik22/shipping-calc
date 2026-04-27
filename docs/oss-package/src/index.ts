/**
 * @rateships/customs — International customs duty + VAT data
 *
 * Free, MIT-licensed customs metadata for 213 countries with a built-in
 * landed-cost calculator. Sourced from each destination country's customs
 * authority. Quarterly refresh.
 *
 * https://rateships.com
 */

import customsData from "../data/customs.json";

// ── Types ────────────────────────────────────────────────────────────

export type ProductCategory =
  | "general"
  | "electronics"
  | "clothing"
  | "food"
  | "machinery"
  | "footwear"
  | "books"
  | "cosmetics";

export interface CustomsInfo {
  code: string;
  name: string;
  vat_rate: number;
  de_minimis_usd: number;
  avg_duty_rate: number;
  currency: string;
  customs_authority_url: string;
  prohibited_categories: string[];
  duty_rates_by_category?: Partial<Record<ProductCategory, number>>;
}

export interface LandedCostOpts {
  /** Item value in USD (excluding shipping). */
  itemValueUsd: number;
  /** Destination country, ISO 3166-1 alpha-2. */
  destination: string;
  /** Shipping cost in USD. Most countries include shipping in dutiable value. */
  shippingCostUsd?: number;
  /** Product category — affects duty rate. Defaults to "general". */
  category?: ProductCategory;
  /** Insurance cost in USD. Sometimes included in dutiable value. */
  insuranceUsd?: number;
}

export interface LandedCostBreakdown {
  itemValue: number;
  shipping: number;
  insurance: number;
  dutyAmount: number;
  vatBase: number;
  vatAmount: number;
  totalLandedCost: number;
  exemptions: string[];
  notes: string[];
}

export class CountryNotFoundError extends Error {
  constructor(public readonly code: string) {
    super(`Country not found: ${code}. Use hasCountry(code) to check first.`);
    this.name = "CountryNotFoundError";
  }
}

// ── Data lookup ──────────────────────────────────────────────────────

const data: Record<string, CustomsInfo> = customsData as Record<string, CustomsInfo>;

/** Whether the package has data for a country code. */
export function hasCountry(code: string): boolean {
  return code.toUpperCase() in data;
}

/** Returns customs metadata for a country. Throws if unknown. */
export function getCustoms(code: string): CustomsInfo {
  const c = data[code.toUpperCase()];
  if (!c) throw new CountryNotFoundError(code);
  return c;
}

/** Returns all 213 country records. */
export function listCountries(): CustomsInfo[] {
  return Object.values(data).slice().sort((a, b) => a.name.localeCompare(b.name));
}

/** Returns the duty rate (in percent) for a country + category. Falls back to avg. */
export function getDutyRate(code: string, category: ProductCategory = "general"): number {
  const c = getCustoms(code);
  const cat = c.duty_rates_by_category?.[category];
  if (typeof cat === "number") return cat;
  return c.avg_duty_rate;
}

// ── Landed cost calculator ───────────────────────────────────────────

/**
 * Calculate landed cost (item + duty + VAT) for an international parcel.
 *
 * Formula varies by country, but the typical model is:
 *   1. dutyBase = item + shipping + insurance (CIF)
 *   2. duty = dutyBase × dutyRate (only if dutyBase > de_minimis)
 *   3. vatBase = dutyBase + duty
 *   4. vat = vatBase × vatRate
 *   5. landed = item + shipping + duty + vat
 *
 * The de_minimis threshold zeros out duty (and sometimes VAT) for low-value
 * shipments. We model the common rule: below threshold, no duty AND no VAT.
 * Some countries (e.g., the EU post-2021) charge VAT but no duty below the
 * threshold. The breakdown.notes will mention this where applicable.
 */
export function calculateLandedCost(opts: LandedCostOpts): LandedCostBreakdown {
  const c = getCustoms(opts.destination);
  const itemValue = Math.max(0, opts.itemValueUsd);
  const shipping = Math.max(0, opts.shippingCostUsd ?? 0);
  const insurance = Math.max(0, opts.insuranceUsd ?? 0);

  const dutyBase = itemValue + shipping + insurance;
  const exemptions: string[] = [];
  const notes: string[] = [];

  let dutyAmount = 0;
  let vatBase = 0;
  let vatAmount = 0;

  const dutyRate = getDutyRate(c.code, opts.category ?? "general");
  const vatRate = c.vat_rate;

  if (c.de_minimis_usd > 0 && dutyBase < c.de_minimis_usd) {
    // Below de minimis — no duty
    exemptions.push(
      `No duty: parcel value ${dutyBase.toFixed(2)} USD is below ${c.code} de minimis ($${c.de_minimis_usd})`,
    );
    // EU policy: VAT still applies even below de minimis (post-2021 IOSS rules).
    // For non-EU we conservatively skip VAT; users can override via category.
    const isEU = ["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE"].includes(c.code);
    if (isEU) {
      vatBase = dutyBase;
      vatAmount = (vatBase * vatRate) / 100;
      notes.push("EU IOSS rule: VAT applies on parcels below €150 de minimis");
    } else {
      exemptions.push(`No VAT: below de minimis (${c.code} convention)`);
    }
  } else {
    // Above de minimis — full duty + VAT
    dutyAmount = (dutyBase * dutyRate) / 100;
    vatBase = dutyBase + dutyAmount;
    vatAmount = (vatBase * vatRate) / 100;
    if (dutyRate === 0) notes.push(`Zero duty for "${opts.category ?? "general"}" category in ${c.code}`);
  }

  const totalLandedCost = itemValue + shipping + insurance + dutyAmount + vatAmount;

  return {
    itemValue,
    shipping,
    insurance,
    dutyAmount: round2(dutyAmount),
    vatBase: round2(vatBase),
    vatAmount: round2(vatAmount),
    totalLandedCost: round2(totalLandedCost),
    exemptions,
    notes,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

// ── Default export ───────────────────────────────────────────────────

export default {
  getCustoms,
  hasCountry,
  listCountries,
  getDutyRate,
  calculateLandedCost,
};
