#!/usr/bin/env node
/**
 * Build the npm-shippable data/customs.json from the main RateShips data sources.
 *
 * Run from the rateships monorepo root:
 *   node docs/oss-package/scripts/build-data.mjs
 *
 * Reads:
 *   src/data/countries.json        (country names + codes)
 *   src/lib/customs.ts → customsData (per-code VAT, de minimis, etc.)
 *   src/data/customs-deep.ts → deepCustomsData (per-category duty rates)
 *
 * Writes:
 *   docs/oss-package/data/customs.json
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../../..");
const OUT = path.resolve(__dirname, "../data/customs.json");

// Read countries.json (raw JSON)
const countries = JSON.parse(await fs.readFile(path.join(ROOT, "src/data/countries.json"), "utf-8"));

// Read customs.ts as source — we'll regex-extract since it's a TS file.
// In a real build, you'd compile this as part of the monorepo. For now we read
// the JSON-like structure directly.
const customsSrc = await fs.readFile(path.join(ROOT, "src/lib/customs.ts"), "utf-8");
const deepSrc = await fs.readFile(path.join(ROOT, "src/data/customs-deep.ts"), "utf-8");

// Extract entries: code:'XX' followed by fields.
function extractCustomsRecords(src) {
  const out = {};
  const re = /['"]([A-Z]{2})['"]\s*:\s*\{([^{}]+(?:\{[^{}]*\}[^{}]*)*)\}/g;
  let m;
  while ((m = re.exec(src))) {
    const code = m[1];
    const body = m[2];
    const get = (key) => {
      const r = new RegExp(`${key}\\s*:\\s*([\\d.]+|"[^"]*"|'[^']*')`);
      const mm = r.exec(body);
      if (!mm) return null;
      return mm[1].replace(/^['"]|['"]$/g, "");
    };
    out[code] = {
      vat_rate: parseFloat(get("vat_rate")) || 0,
      de_minimis_usd: parseFloat(get("de_minimis_usd")) || 0,
      avg_duty_rate: parseFloat(get("avg_duty_rate")) || 0,
      currency: get("currency") || "USD",
      customs_authority_url: get("customs_tariff_url") || get("customs_url") || "",
    };
  }
  return out;
}

const flat = extractCustomsRecords(customsSrc);
const deep = extractCustomsRecords(deepSrc);

// Compose final shape
const out = {};
for (const c of countries) {
  const meta = flat[c.code] || {};
  const deepMeta = deep[c.code] || {};
  if (!meta && !deepMeta) continue;
  out[c.code] = {
    code: c.code,
    name: c.name_en,
    vat_rate: meta.vat_rate ?? 0,
    de_minimis_usd: meta.de_minimis_usd ?? 0,
    avg_duty_rate: meta.avg_duty_rate ?? 0,
    currency: meta.currency ?? "USD",
    customs_authority_url: meta.customs_authority_url ?? deepMeta.customs_authority_url ?? "",
    prohibited_categories: [], // TODO: extract from prohibited list when available
    duty_rates_by_category: {}, // TODO: parse duty_rates array from deepCustomsData
  };
}

await fs.mkdir(path.dirname(OUT), { recursive: true });
await fs.writeFile(OUT, JSON.stringify(out, null, 2) + "\n");

const count = Object.keys(out).length;
const size = Buffer.byteLength(await fs.readFile(OUT, "utf-8"));
console.log(`Wrote ${count} country records to ${path.relative(ROOT, OUT)}`);
console.log(`Size: ${(size / 1024).toFixed(1)} KB`);
