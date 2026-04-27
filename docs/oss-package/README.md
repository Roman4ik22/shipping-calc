# `@rateships/customs`

> International customs duty + VAT data for 213 countries. Free, MIT-licensed, embedded JSON.

[![npm](https://img.shields.io/npm/v/@rateships/customs.svg)](https://npm.im/@rateships/customs) [![license](https://img.shields.io/npm/l/@rateships/customs.svg)](LICENSE)

A lightweight library exposing per-country **VAT rates**, **de minimis thresholds**, **average duty rates**, and **prohibited item categories** for 213 countries — with a built-in calculator for **landed cost** (item + duty + VAT).

Sourced from each country's customs authority. Updated quarterly.

---

## Why

Building an e-commerce checkout, dropshipping tool, freight calculator, or international invoice generator? You need real customs data per country — VAT rates, exemption thresholds, duty calculation rules. There's no clean free dataset. Until now.

---

## Install

```bash
npm install @rateships/customs
```

```bash
# or yarn / pnpm
yarn add @rateships/customs
pnpm add @rateships/customs
```

Zero runtime dependencies. ~80 KB minified+gzipped.

---

## Quick start

```ts
import { getCustoms, calculateLandedCost } from "@rateships/customs";

// Get raw customs data for a country
const de = getCustoms("DE");
console.log(de.vat_rate);          // 19
console.log(de.de_minimis_usd);    // 150 (threshold below which no duty)
console.log(de.avg_duty_rate);     // 4.2

// Calculate landed cost for a $200 parcel into Germany
const result = calculateLandedCost({
  itemValueUsd: 200,
  destination: "DE",
  shippingCostUsd: 25,
  category: "electronics",
});

console.log(result);
// {
//   itemValue: 200,
//   shipping: 25,
//   dutyAmount: 0,           // electronics 0% duty in EU
//   vatBase: 225,
//   vatAmount: 42.75,        // 19% on item + shipping
//   totalLandedCost: 267.75,
//   exemptions: ["No duty: HS 85 electronics"],
//   notes: ["VAT applies above €150 threshold"]
// }
```

---

## API

### `getCustoms(countryCode: string): CustomsInfo`

Returns customs metadata for an ISO 3166-1 alpha-2 country code.

```ts
interface CustomsInfo {
  code: string;             // "DE"
  name: string;             // "Germany"
  vat_rate: number;         // 19 (in percent)
  de_minimis_usd: number;   // 150 (zero if no exemption)
  avg_duty_rate: number;    // 4.2 (in percent)
  currency: string;         // "EUR"
  customs_authority_url: string;
  prohibited_categories: string[];  // ["weapons","narcotics", ...]
}
```

Throws `CountryNotFoundError` for unknown codes. Use `hasCountry(code)` to check first.

### `calculateLandedCost(opts: LandedCostOpts): LandedCostBreakdown`

```ts
interface LandedCostOpts {
  itemValueUsd: number;
  destination: string;        // ISO country code
  shippingCostUsd?: number;   // optional, default 0
  category?: ProductCategory; // affects duty rate. default 'general'
  insuranceUsd?: number;      // optional, default 0
}

type ProductCategory =
  | "general" | "electronics" | "clothing" | "food"
  | "machinery" | "footwear" | "books" | "cosmetics";
```

### `listCountries(): CustomsInfo[]`

Returns all 213 country records.

### `hasCountry(code: string): boolean`

### `getDutyRate(country: string, category: ProductCategory): number`

Returns the duty rate in percent for a given country + category combination. Returns the country's average duty rate if category-specific data is not available.

---

## Data structure

The package ships a single JSON file (`data/customs.json`) of about 80 KB. Each entry:

```json
{
  "code": "DE",
  "name": "Germany",
  "vat_rate": 19,
  "de_minimis_usd": 150,
  "avg_duty_rate": 4.2,
  "currency": "EUR",
  "customs_authority_url": "https://www.zoll.de",
  "prohibited_categories": ["weapons", "narcotics", "hazmat"],
  "duty_rates_by_category": {
    "electronics": 0,
    "clothing": 12,
    "footwear": 8,
    "food": 8.5,
    "machinery": 1.7,
    "books": 0,
    "cosmetics": 6.5
  }
}
```

---

## Examples

### Shopify checkout — show landed cost

```ts
import { calculateLandedCost } from "@rateships/customs";

function showLandedCost(cart, customer) {
  const breakdown = calculateLandedCost({
    itemValueUsd: cart.subtotal,
    destination: customer.country,
    shippingCostUsd: cart.shipping,
    category: cart.category,
  });
  return `Estimated total at delivery: $${breakdown.totalLandedCost.toFixed(2)}`;
}
```

### CLI usage

```bash
npx @rateships/customs DE
# → Germany: 19% VAT, $150 de minimis, 4.2% avg duty
```

### Bulk corridor analysis

```ts
import { listCountries, calculateLandedCost } from "@rateships/customs";

const item = 100;
const top10expensive = listCountries()
  .map((c) => ({
    country: c.name,
    landedCost: calculateLandedCost({
      itemValueUsd: item,
      destination: c.code,
      shippingCostUsd: 25,
    }).totalLandedCost,
  }))
  .sort((a, b) => b.landedCost - a.landedCost)
  .slice(0, 10);

console.table(top10expensive);
```

---

## Data freshness

Updated **quarterly** (Q1, Q2, Q3, Q4). VAT rates and de minimis thresholds are re-verified against each country's customs authority website.

Latest update: **{LAST_UPDATE_DATE}**.

For a real-time calculator UI and rate-comparison data across 145 carriers, visit [rateships.com](https://rateships.com).

---

## Contributing

Found stale data? Open an issue with a link to the country's customs authority showing the current rate.

PRs welcome:
1. Edit `data/customs.json`
2. Add a citation in the issue / PR
3. Run `npm test`

---

## License

MIT. Use it for anything, just keep the credit. No warranty — for compliance-critical use, verify against the destination country's customs authority.

---

## Disclaimer

Customs duty calculations depend on:
- Tariff classification (HS code) — package uses simplified categories
- Trade agreements (FTAs may waive duty)
- Country of origin (rules-of-origin can affect rate)
- Mode of transport (postal vs commercial — different rules)

The library produces a **good-faith estimate** for typical e-commerce parcels. For commercial-scale or compliance-critical shipments, use a licensed customs broker or the destination's customs authority.

---

## Acknowledgments

Built and maintained by the team at [RateShips](https://rateships.com) — international shipping rate comparison.
