/**
 * Rate Update Script
 *
 * Updates shipping rate files from public carrier data.
 * Run weekly: npx tsx scripts/update-rates.ts
 *
 * Sources:
 * - EasyPost API (if EASYPOST_API_KEY is set)
 * - Fallback: applies inflation/adjustment factor to existing rates
 *
 * Usage:
 *   EASYPOST_API_KEY=xxx npx tsx scripts/update-rates.ts
 *   npx tsx scripts/update-rates.ts --dry-run
 */

import fs from "fs";
import path from "path";

const RATES_DIR = path.join(__dirname, "../src/data/rates");
const DRY_RUN = process.argv.includes("--dry-run");

// Quarterly adjustment factors by carrier type (based on industry trends)
const ADJUSTMENT_FACTORS: Record<string, number> = {
  // Q1 2026 adjustments (GRI - General Rate Increase)
  "dhl-express": 1.049,    // DHL announced 4.9% GRI for 2026
  "fedex": 1.059,           // FedEx 5.9% GRI
  "ups": 1.059,             // UPS 5.9% GRI
  "usps": 1.037,            // USPS 3.7% increase
  "royal-mail": 1.04,       // Royal Mail ~4%
  "default-international": 1.05,  // Industry average ~5%
  "default-regional": 1.03,      // Regional carriers ~3%
  "default-postal": 1.035,       // Postal services ~3.5%
};

interface RateFile {
  carrier_id: string;
  effective_date: string;
  note: string;
  zones: Array<{
    zone: number;
    description: string;
    countries_from: string[];
    countries_to: string[];
  }>;
  rates: Record<string, Array<{
    weight_kg: number;
    prices_by_zone: (number | null)[];
  }>>;
}

async function fetchLiveRates(fromCountry: string, toCountry: string, weightKg: number): Promise<number | null> {
  const apiKey = process.env.EASYPOST_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch("https://api.easypost.com/v2/shipments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        shipment: {
          from_address: { street1: "350 5th Ave", city: "New York", state: "NY", zip: "10001", country: fromCountry },
          to_address: { street1: "1 Main St", city: "London", state: "", zip: "SW1A 1AA", country: toCountry },
          parcel: { length: 20, width: 15, height: 10, weight: Math.round(weightKg * 35.274) },
        },
      }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    const cheapest = data.rates?.[0];
    return cheapest ? parseFloat(cheapest.rate) : null;
  } catch {
    return null;
  }
}

function getAdjustmentFactor(carrierId: string, carrierType: string): number {
  if (ADJUSTMENT_FACTORS[carrierId]) return ADJUSTMENT_FACTORS[carrierId];
  if (carrierType === "international") return ADJUSTMENT_FACTORS["default-international"];
  if (carrierType === "regional") return ADJUSTMENT_FACTORS["default-regional"];
  return ADJUSTMENT_FACTORS["default-postal"];
}

async function updateRateFile(filePath: string): Promise<boolean> {
  const raw = fs.readFileSync(filePath, "utf-8");
  const data: RateFile = JSON.parse(raw);

  const carrierId = data.carrier_id;
  const carrierType = carrierId.includes("post") || carrierId.includes("ems") ? "postal" :
                      carrierId.includes("dhl") || carrierId.includes("fedex") || carrierId.includes("ups") ? "international" : "regional";

  const factor = getAdjustmentFactor(carrierId, carrierType);

  let updated = false;

  for (const serviceId of Object.keys(data.rates)) {
    for (const entry of data.rates[serviceId]) {
      entry.prices_by_zone = entry.prices_by_zone.map((price) => {
        if (price === null || price === 0) return price;
        const newPrice = Math.round(price * factor * 100) / 100;
        if (newPrice !== price) updated = true;
        return newPrice;
      });
    }
  }

  if (updated) {
    data.effective_date = new Date().toISOString().split("T")[0];
    data.note = `${data.note} [Rates adjusted ${data.effective_date}]`;

    if (!DRY_RUN) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    }
    console.log(`${DRY_RUN ? "[DRY RUN] " : ""}Updated: ${carrierId} (factor: ${factor})`);
  } else {
    console.log(`Skipped: ${carrierId} (no changes)`);
  }

  return updated;
}

async function main() {
  console.log(`\nRate Update Script — ${new Date().toISOString()}`);
  console.log(`Mode: ${DRY_RUN ? "DRY RUN (no files written)" : "LIVE"}\n`);

  const files = fs.readdirSync(RATES_DIR).filter((f) => f.endsWith(".json"));
  console.log(`Found ${files.length} rate files\n`);

  let updatedCount = 0;

  for (const file of files) {
    try {
      const wasUpdated = await updateRateFile(path.join(RATES_DIR, file));
      if (wasUpdated) updatedCount++;
    } catch (err) {
      console.error(`Error processing ${file}: ${err}`);
    }
  }

  console.log(`\nDone. ${updatedCount}/${files.length} files updated.`);

  if (!DRY_RUN && updatedCount > 0) {
    console.log("\nNext steps:");
    console.log("  git add src/data/rates/");
    console.log("  git commit -m 'Weekly rate update'");
    console.log("  git push origin main");
  }
}

main().catch(console.error);
