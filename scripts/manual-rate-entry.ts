/**
 * Manual Rate Entry Tool
 *
 * After manually checking carrier calculators, paste rates here.
 * Run: npx tsx scripts/manual-rate-entry.ts
 *
 * HOW TO USE:
 * 1. Open each calculator URL below in browser
 * 2. Enter: 1kg parcel, 20x15x10cm, from capital to US/Germany
 * 3. Write down the price
 * 4. Add it to the MANUAL_RATES array below
 * 5. Run this script to update rate files
 */

import fs from "fs";
import path from "path";

const RATES_DIR = path.join(__dirname, "../src/data/rates");

interface ManualRate {
  carrier_id: string;
  calculator_url: string;
  rates: {
    from: string;
    to: string;
    weight_kg: number;
    price: number;
    currency: string;
    date_checked: string;
  }[];
}

// ============================================================
// ADD YOUR RATES HERE after checking each calculator
// ============================================================

const MANUAL_RATES: ManualRate[] = [
  // Example:
  // {
  //   carrier_id: "ceska-posta",
  //   calculator_url: "https://www.postaonline.cz/kalkulacka-postovneho",
  //   rates: [
  //     { from: "CZ", to: "DE", weight_kg: 1, price: 395, currency: "CZK", date_checked: "2026-03-23" },
  //     { from: "CZ", to: "US", weight_kg: 1, price: 850, currency: "CZK", date_checked: "2026-03-23" },
  //   ]
  // },
];

// Exchange rates for conversion to USD
const FX: Record<string, number> = {
  USD: 1, EUR: 1.09, GBP: 1.27, CZK: 0.043, HUF: 0.0027,
  PLN: 0.25, SAR: 0.267, AED: 0.272, MYR: 0.213, IDR: 0.000064,
  PHP: 0.018, LKR: 0.003, FJD: 0.44, BDT: 0.0091, KES: 0.0065,
  ZAR: 0.054, COP: 0.00025, CLP: 0.00105, ARS: 0.00115,
  RUB: 0.011, TRY: 0.031,
};

function toUSD(price: number, currency: string): number {
  const rate = FX[currency] || 1;
  return Math.round(price * rate * 100) / 100;
}

// Calculators to check manually:
const CALCULATORS = [
  { id: "ceska-posta", url: "https://www.postaonline.cz/kalkulacka-postovneho", note: "Select 'Balík do zahraničí', country: Germany, weight: 1kg" },
  { id: "magyar-posta", url: "https://net.posta.hu/dashboard/public/dashboard-ui/calculator/foreignpackage", note: "Country: Germany, weight: 1kg" },
  { id: "omniva", url: "https://www.omniva.ee/en/sending-parcels-international/", note: "Check price lists or use calculator" },
  { id: "pos-indonesia", url: "https://www.posindonesia.co.id/id/check-tarif", note: "From: Jakarta(10000), To: US, Weight: 1000g, Service: EMS" },
  { id: "saudi-post", url: "https://splonline.com.sa/en/mobile-price-calculator/", note: "Weight: 1kg, Destination: US" },
  { id: "bangladesh-post", url: "https://ipsbd.bdpost.gov.bd/app_mail_rate/index.php", note: "Select EMS, destination: US, weight: 1kg" },
  { id: "aramex-australia-formerly-fastway", url: "https://www.aramex.com.au/tools/our-rates/", note: "Download Sydney PDF, find international rates" },
  { id: "dpd-russia", url: "https://www.dpd.ru/", note: "Use calculator for Moscow→Berlin 1kg" },
  { id: "boxberry", url: "https://bxb.delivery/ru/b2b/export/calculate", note: "Export from Russia, 1kg, to Germany" },
  { id: "pony-express", url: "https://www.ponyexpress.ru/support/servisy-samoobsluzhivaniya/tariff/", note: "Moscow→Berlin 1kg" },
  { id: "naqel-express", url: "https://www.naqelexpress.com/en/sa/ratecalculator/", note: "From: Riyadh, To: Dubai, 1kg" },
  { id: "smsa-express", url: "https://www.smsaexpress.com/shipping-rate", note: "From: Riyadh, To: Dubai, 1kg" },
  { id: "servientrega", url: "https://www.servientrega.com/wps/portal/cotizador", note: "From: Bogota, To: Miami, 1kg" },
  { id: "chilexpress", url: "https://chilexpress.cl/cotizar-tarifas-envios-chile-extranjero", note: "From: Santiago, To: US, 1kg" },
  { id: "andreani", url: "https://pymes.andreani.com/cotizador", note: "From: Buenos Aires, To: US, 1kg" },
  { id: "philpost", url: "https://phlpost.gov.ph/", note: "Check EMS rates page" },
  { id: "sri-lanka-post", url: "https://slpost.gov.lk/tariff/", note: "Download EMS PDF, find Zone C (US) rate for 1kg" },
  { id: "fiji-post", url: "https://www.postfiji.com.fj/postfiji/ParcelRates", note: "Check international parcel rates" },
  { id: "posta-kenya", url: "https://posta.co.ke/", note: "Check EMS international rates" },
  { id: "sa-post", url: "https://www.postoffice.co.za/", note: "Download rates PDF, find international 1kg rate" },
  { id: "tiki-titipan-kilat", url: "https://tiki.id/en/tariff", note: "Jakarta to Malaysia, 1kg" },
  { id: "skynet-worldwide-express", url: "https://www.skynet.com.my/tariff-calculator", note: "KL→Singapore 1kg" },
];

function main() {
  if (MANUAL_RATES.length === 0) {
    console.log("📋 No rates entered yet. Check these calculators manually:\n");
    for (const c of CALCULATORS) {
      console.log(`  ${c.id}`);
      console.log(`    URL: ${c.url}`);
      console.log(`    Instructions: ${c.note}`);
      console.log();
    }
    console.log("After checking, add rates to the MANUAL_RATES array in this file and run again.");
    return;
  }

  console.log(`📊 Processing ${MANUAL_RATES.length} carriers...\n`);

  for (const entry of MANUAL_RATES) {
    const filePath = path.join(RATES_DIR, `${entry.carrier_id}.json`);
    if (!fs.existsSync(filePath)) {
      console.log(`  ⚠ File not found: ${entry.carrier_id}.json`);
      continue;
    }

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    for (const rate of entry.rates) {
      const usdPrice = toUSD(rate.price, rate.currency);
      console.log(`  ${entry.carrier_id}: ${rate.from}→${rate.to} ${rate.weight_kg}kg = ${rate.price} ${rate.currency} ($${usdPrice})`);
    }

    data.effective_date = "2026-03-23";
    data.note = `[Updated from manual calculator check ${entry.rates[0]?.date_checked || "2026-03-23"}] ${data.note || ""}`;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`  ✓ Updated ${entry.carrier_id}.json\n`);
  }
}

main();
