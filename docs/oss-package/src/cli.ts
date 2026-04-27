#!/usr/bin/env node
/**
 * CLI for @rateships/customs.
 *
 *   $ npx @rateships/customs DE
 *   $ npx @rateships/customs DE --calc 200 --shipping 25 --category electronics
 *   $ npx @rateships/customs --list
 */

import { getCustoms, calculateLandedCost, listCountries, hasCountry, type ProductCategory } from "./index.js";

const args = process.argv.slice(2);

if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
  console.log(`@rateships/customs — international customs data + landed-cost calculator

Usage:
  rateships-customs <COUNTRY_CODE>
    Show customs metadata for a country (VAT, de minimis, etc.)

  rateships-customs <COUNTRY_CODE> --calc <USD> [--shipping <USD>] [--category <name>]
    Calculate landed cost for a parcel.
    Categories: general, electronics, clothing, food, machinery, footwear, books, cosmetics

  rateships-customs --list
    List all 213 supported countries.

Data: https://rateships.com — quarterly refresh.
`);
  process.exit(args.length === 0 ? 1 : 0);
}

if (args[0] === "--list") {
  for (const c of listCountries()) {
    console.log(`${c.code}\t${c.vat_rate}% VAT\t$${c.de_minimis_usd} de minimis\t${c.name}`);
  }
  process.exit(0);
}

const code = args[0].toUpperCase();
if (!hasCountry(code)) {
  console.error(`Unknown country code: ${code}\nRun with --list to see all supported codes.`);
  process.exit(1);
}

const c = getCustoms(code);

const calcIdx = args.indexOf("--calc");
if (calcIdx === -1) {
  // Just show the metadata
  console.log(`${c.name} (${c.code})`);
  console.log(`  VAT rate:           ${c.vat_rate}%`);
  console.log(`  De minimis (USD):   $${c.de_minimis_usd}`);
  console.log(`  Avg duty rate:      ${c.avg_duty_rate}%`);
  console.log(`  Local currency:     ${c.currency}`);
  console.log(`  Customs authority:  ${c.customs_authority_url}`);
  if (c.prohibited_categories?.length) {
    console.log(`  Prohibited:         ${c.prohibited_categories.join(", ")}`);
  }
  process.exit(0);
}

// Calculator mode
const itemValue = Number(args[calcIdx + 1]);
if (!Number.isFinite(itemValue)) {
  console.error("--calc requires a numeric USD value");
  process.exit(1);
}

const shippingIdx = args.indexOf("--shipping");
const shipping = shippingIdx !== -1 ? Number(args[shippingIdx + 1]) : 0;

const categoryIdx = args.indexOf("--category");
const category = (categoryIdx !== -1 ? args[categoryIdx + 1] : "general") as ProductCategory;

const result = calculateLandedCost({
  itemValueUsd: itemValue,
  destination: code,
  shippingCostUsd: shipping,
  category,
});

console.log(`Landed cost into ${c.name} (${c.code})`);
console.log(`  Item value:         $${result.itemValue.toFixed(2)}`);
console.log(`  Shipping:           $${result.shipping.toFixed(2)}`);
console.log(`  Duty amount:        $${result.dutyAmount.toFixed(2)}`);
console.log(`  VAT (${c.vat_rate}%):${" ".repeat(Math.max(0, 13 - String(c.vat_rate).length))}$${result.vatAmount.toFixed(2)}`);
console.log(`  ────────────────────`);
console.log(`  Total landed cost:  $${result.totalLandedCost.toFixed(2)}`);
if (result.exemptions.length) {
  console.log("\n  Exemptions:");
  for (const e of result.exemptions) console.log(`    • ${e}`);
}
if (result.notes.length) {
  console.log("\n  Notes:");
  for (const n of result.notes) console.log(`    • ${n}`);
}
