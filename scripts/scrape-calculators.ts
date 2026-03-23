/**
 * Puppeteer scraper for carrier calculators that require JavaScript.
 *
 * Usage:
 *   npx tsx scripts/scrape-calculators.ts              # scrape all
 *   npx tsx scripts/scrape-calculators.ts --carrier ceska-posta  # single
 *   npx tsx scripts/scrape-calculators.ts --dry-run    # print only
 *
 * Each scraper fills in the calculator form, clicks calculate, and extracts the price.
 * Results are saved to src/data/rates/*.json
 */

import puppeteer, { type Page } from "puppeteer";
import fs from "fs";
import path from "path";

const RATES_DIR = path.join(__dirname, "../src/data/rates");
const DRY_RUN = process.argv.includes("--dry-run");
const CARRIER_FILTER = process.argv.includes("--carrier")
  ? process.argv[process.argv.indexOf("--carrier") + 1]
  : null;
const TIMEOUT = 30000;

interface ScrapedRate {
  carrier: string;
  route: string;
  weight_kg: number;
  price: number;
  currency: string;
  source: string;
}

const results: ScrapedRate[] = [];

async function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// ============================================================
// SCRAPER FUNCTIONS — one per carrier calculator
// ============================================================

async function scrapeCeskaPosta(page: Page): Promise<ScrapedRate[]> {
  const rates: ScrapedRate[] = [];
  try {
    await page.goto("https://www.postaonline.cz/kalkulacka-postovneho", { waitUntil: "networkidle2", timeout: TIMEOUT });
    await delay(2000);
    // Select "Balík do zahraničí" (parcel abroad)
    await page.click('input[value="zahranici"]').catch(() => {});
    await delay(1000);
    // Fill weight
    const weightInput = await page.$('input[name="hmotnost"]');
    if (weightInput) {
      await weightInput.click({ clickCount: 3 });
      await weightInput.type("1");
    }
    // Select Germany
    const countrySelect = await page.$('select[name="zeme"]');
    if (countrySelect) await page.select('select[name="zeme"]', "DE");
    await delay(500);
    // Click calculate
    await page.click('button[type="submit"], input[type="submit"]').catch(() => {});
    await delay(3000);
    // Extract price
    const priceText = await page.$eval('.cena, .price, .vysledek, .result', (el) => el.textContent?.trim() || "").catch(() => "");
    const match = priceText.match(/(\d[\d\s,.]*)/);
    if (match) {
      const price = parseFloat(match[1].replace(/\s/g, "").replace(",", "."));
      rates.push({ carrier: "ceska-posta", route: "CZ→DE", weight_kg: 1, price, currency: "CZK", source: "postaonline.cz" });
    }
  } catch (e) {
    console.log(`  ✗ Ceska Posta error: ${e}`);
  }
  return rates;
}

async function scrapeMagyarPosta(page: Page): Promise<ScrapedRate[]> {
  const rates: ScrapedRate[] = [];
  try {
    await page.goto("https://net.posta.hu/dashboard/public/dashboard-ui/calculator/foreignpackage", { waitUntil: "networkidle2", timeout: TIMEOUT });
    await delay(3000);
    // Fill weight 1kg
    const weightInput = await page.$('input[type="number"], input[name*="weight"]');
    if (weightInput) {
      await weightInput.click({ clickCount: 3 });
      await weightInput.type("1");
    }
    // Select Germany
    const selects = await page.$$("select");
    for (const sel of selects) {
      const opts = await sel.$$("option");
      for (const opt of opts) {
        const text = await opt.evaluate((el) => el.textContent || "");
        if (text.includes("Germany") || text.includes("Németország")) {
          await opt.evaluate((el) => (el as HTMLOptionElement).selected = true);
          await sel.evaluate((el) => el.dispatchEvent(new Event("change")));
          break;
        }
      }
    }
    await delay(1000);
    // Click calculate
    const buttons = await page.$$("button");
    for (const btn of buttons) {
      const text = await btn.evaluate((el) => el.textContent || "");
      if (text.match(/Számít|Calculat|Kiszámít/i)) {
        await btn.click();
        break;
      }
    }
    await delay(3000);
    // Extract price
    const allText = await page.evaluate(() => document.body.innerText);
    const hufMatch = allText.match(/(\d[\d\s,.]*)\s*(?:Ft|HUF)/i);
    if (hufMatch) {
      const price = parseFloat(hufMatch[1].replace(/\s/g, "").replace(",", "."));
      rates.push({ carrier: "magyar-posta", route: "HU→DE", weight_kg: 1, price, currency: "HUF", source: "net.posta.hu" });
    }
  } catch (e) {
    console.log(`  ✗ Magyar Posta error: ${e}`);
  }
  return rates;
}

async function scrapeSaudiPost(page: Page): Promise<ScrapedRate[]> {
  const rates: ScrapedRate[] = [];
  try {
    await page.goto("https://splonline.com.sa/en/mobile-price-calculator/", { waitUntil: "networkidle2", timeout: TIMEOUT });
    await delay(3000);
    // Fill weight
    const weightInputs = await page.$$('input[type="number"]');
    for (const inp of weightInputs) {
      const placeholder = await inp.evaluate((el) => el.getAttribute("placeholder") || "");
      if (placeholder.toLowerCase().includes("weight") || placeholder.includes("وزن")) {
        await inp.click({ clickCount: 3 });
        await inp.type("1");
        break;
      }
    }
    // Select US destination
    const selects = await page.$$("select");
    for (const sel of selects) {
      const options = await sel.$$eval("option", (opts) => opts.map((o) => ({ value: o.value, text: o.textContent })));
      const usOpt = options.find((o) => o.text?.includes("United States") || o.text?.includes("أمريكا"));
      if (usOpt) {
        await page.select(`select`, usOpt.value || "");
        break;
      }
    }
    await delay(1000);
    const buttons = await page.$$("button");
    for (const btn of buttons) {
      const text = await btn.evaluate((el) => el.textContent || "");
      if (text.match(/calculat|حساب|احسب/i)) {
        await btn.click();
        break;
      }
    }
    await delay(3000);
    const allText = await page.evaluate(() => document.body.innerText);
    const sarMatch = allText.match(/(\d[\d\s,.]*)\s*(?:SAR|sar|ر\.س)/);
    if (sarMatch) {
      const price = parseFloat(sarMatch[1].replace(/\s/g, "").replace(",", "."));
      rates.push({ carrier: "saudi-post", route: "SA→US", weight_kg: 1, price, currency: "SAR", source: "splonline.com.sa" });
    }
  } catch (e) {
    console.log(`  ✗ Saudi Post error: ${e}`);
  }
  return rates;
}

async function scrapeNaqel(page: Page): Promise<ScrapedRate[]> {
  const rates: ScrapedRate[] = [];
  try {
    await page.goto("https://www.naqelexpress.com/en/sa/ratecalculator/", { waitUntil: "networkidle2", timeout: TIMEOUT });
    await delay(3000);
    const weightInput = await page.$('input[name*="weight"], input[type="number"]');
    if (weightInput) {
      await weightInput.click({ clickCount: 3 });
      await weightInput.type("1");
    }
    const buttons = await page.$$("button");
    for (const btn of buttons) {
      const text = await btn.evaluate((el) => el.textContent || "");
      if (text.match(/calculat|حساب/i)) {
        await btn.click();
        break;
      }
    }
    await delay(3000);
    const allText = await page.evaluate(() => document.body.innerText);
    const sarMatch = allText.match(/(\d[\d\s,.]*)\s*(?:SAR|sar)/);
    if (sarMatch) {
      const price = parseFloat(sarMatch[1].replace(/\s/g, "").replace(",", "."));
      rates.push({ carrier: "naqel-express", route: "SA→SA", weight_kg: 1, price, currency: "SAR", source: "naqelexpress.com" });
    }
  } catch (e) {
    console.log(`  ✗ Naqel error: ${e}`);
  }
  return rates;
}

async function scrapeSMSA(page: Page): Promise<ScrapedRate[]> {
  const rates: ScrapedRate[] = [];
  try {
    await page.goto("https://www.smsaexpress.com/shipping-rate", { waitUntil: "networkidle2", timeout: TIMEOUT });
    await delay(3000);
    const weightInput = await page.$('input[name*="weight"], input[placeholder*="Weight"]');
    if (weightInput) {
      await weightInput.click({ clickCount: 3 });
      await weightInput.type("1");
    }
    const buttons = await page.$$("button");
    for (const btn of buttons) {
      const text = await btn.evaluate((el) => el.textContent || "");
      if (text.match(/calculat|rate|حساب/i)) {
        await btn.click();
        break;
      }
    }
    await delay(3000);
    const allText = await page.evaluate(() => document.body.innerText);
    const sarMatch = allText.match(/(\d[\d\s,.]*)\s*(?:SAR|sar)/);
    if (sarMatch) {
      const price = parseFloat(sarMatch[1].replace(/\s/g, "").replace(",", "."));
      rates.push({ carrier: "smsa-express", route: "SA→SA", weight_kg: 1, price, currency: "SAR", source: "smsaexpress.com" });
    }
  } catch (e) {
    console.log(`  ✗ SMSA error: ${e}`);
  }
  return rates;
}

async function scrapeSkynet(page: Page): Promise<ScrapedRate[]> {
  const rates: ScrapedRate[] = [];
  try {
    await page.goto("https://www.skynet.com.my/tariff-calculator", { waitUntil: "networkidle2", timeout: TIMEOUT });
    await delay(3000);
    // Fill weight 1kg
    const inputs = await page.$$('input[type="text"], input[type="number"]');
    for (const inp of inputs) {
      const name = await inp.evaluate((el) => el.getAttribute("name") || el.getAttribute("placeholder") || "");
      if (name.match(/weight|berat/i)) {
        await inp.click({ clickCount: 3 });
        await inp.type("1");
        break;
      }
    }
    const buttons = await page.$$("button, input[type='submit']");
    for (const btn of buttons) {
      const text = await btn.evaluate((el) => el.textContent || el.getAttribute("value") || "");
      if (text.match(/calculat|kira/i)) {
        await btn.click();
        break;
      }
    }
    await delay(3000);
    const allText = await page.evaluate(() => document.body.innerText);
    const rmMatch = allText.match(/RM\s*(\d[\d\s,.]*)/);
    if (rmMatch) {
      const price = parseFloat(rmMatch[1].replace(/\s/g, "").replace(",", "."));
      rates.push({ carrier: "skynet-worldwide-express", route: "MY domestic", weight_kg: 1, price, currency: "MYR", source: "skynet.com.my" });
    }
  } catch (e) {
    console.log(`  ✗ Skynet error: ${e}`);
  }
  return rates;
}

// Generic scraper for calculators that might reveal something
async function scrapeGeneric(page: Page, url: string, carrierId: string, route: string): Promise<ScrapedRate[]> {
  const rates: ScrapedRate[] = [];
  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: TIMEOUT });
    await delay(3000);
    const allText = await page.evaluate(() => document.body.innerText);
    // Try to find any price pattern
    const pricePatterns = [
      /(\d[\d,.]*)\s*(?:USD|\$)/gi,
      /(\d[\d,.]*)\s*(?:EUR|€)/gi,
      /(\d[\d,.]*)\s*(?:GBP|£)/gi,
      /RM\s*(\d[\d,.]*)/gi,
      /IDR\s*([\d,.]*)/gi,
      /(\d[\d,.]*)\s*(?:SAR)/gi,
      /₱\s*(\d[\d,.]*)/gi,
      /(\d[\d,.]*)\s*(?:CZK|Kč)/gi,
      /(\d[\d,.]*)\s*(?:HUF|Ft)/gi,
    ];
    for (const pattern of pricePatterns) {
      const match = pattern.exec(allText);
      if (match) {
        const price = parseFloat(match[1].replace(/\s/g, "").replace(",", "."));
        if (price > 0 && price < 100000) {
          const curr = pattern.source.match(/USD|EUR|GBP|RM|IDR|SAR|₱|CZK|HUF/)?.[0] || "USD";
          rates.push({ carrier: carrierId, route, weight_kg: 1, price, currency: curr, source: url });
          break;
        }
      }
    }
  } catch (e) {
    console.log(`  ✗ ${carrierId} error: ${e}`);
  }
  return rates;
}

// ============================================================
// MAIN
// ============================================================

const SCRAPERS: { id: string; fn: (page: Page) => Promise<ScrapedRate[]> }[] = [
  { id: "ceska-posta", fn: scrapeCeskaPosta },
  { id: "magyar-posta", fn: scrapeMagyarPosta },
  { id: "saudi-post", fn: scrapeSaudiPost },
  { id: "naqel-express", fn: scrapeNaqel },
  { id: "smsa-express", fn: scrapeSMSA },
  { id: "skynet-worldwide-express", fn: scrapeSkynet },
  // Generic scrapers for remaining calculators
  { id: "omniva", fn: (p) => scrapeGeneric(p, "https://www.omniva.ee/en/sending-parcels-international/", "omniva", "EE→EU") },
  { id: "pos-indonesia", fn: (p) => scrapeGeneric(p, "https://www.posindonesia.co.id/id/check-tarif", "pos-indonesia", "ID→US") },
  { id: "bangladesh-post", fn: (p) => scrapeGeneric(p, "https://ipsbd.bdpost.gov.bd/app_mail_rate/index.php", "bangladesh-post", "BD→US") },
  { id: "aramex-australia-formerly-fastway", fn: (p) => scrapeGeneric(p, "https://www.aramex.com.au/tools/our-rates/", "aramex-australia-formerly-fastway", "AU→NZ") },
  { id: "dpd-russia", fn: (p) => scrapeGeneric(p, "https://www.dpd.ru/dpd/uslugi-i-tarify/", "dpd-russia", "RU→DE") },
  { id: "boxberry", fn: (p) => scrapeGeneric(p, "https://bxb.delivery/ru/b2b/export", "boxberry", "RU→DE") },
  { id: "pony-express", fn: (p) => scrapeGeneric(p, "https://www.ponyexpress.ru/en/delivery/international/", "pony-express", "RU→DE") },
  { id: "servientrega", fn: (p) => scrapeGeneric(p, "https://www.servientrega.com/", "servientrega", "CO→US") },
  { id: "chilexpress", fn: (p) => scrapeGeneric(p, "https://www.chilexpress.cl/tarifas-economicas-envios-internacionales", "chilexpress", "CL→US") },
  { id: "andreani", fn: (p) => scrapeGeneric(p, "https://www.andreani.com/precios-productos", "andreani", "AR→US") },
  { id: "philpost", fn: (p) => scrapeGeneric(p, "https://phlpost.gov.ph/", "philpost", "PH→US") },
  { id: "sri-lanka-post", fn: (p) => scrapeGeneric(p, "https://slpost.gov.lk/tariff/", "sri-lanka-post", "LK→US") },
  { id: "fiji-post", fn: (p) => scrapeGeneric(p, "https://www.postfiji.com.fj/", "fiji-post", "FJ→AU") },
  { id: "posta-kenya", fn: (p) => scrapeGeneric(p, "https://posta.co.ke/", "posta-kenya", "KE→US") },
  { id: "sa-post", fn: (p) => scrapeGeneric(p, "https://www.postoffice.co.za/", "sa-post", "ZA→UK") },
  { id: "tiki-titipan-kilat", fn: (p) => scrapeGeneric(p, "https://www.tiki.id/en/tariff", "tiki-titipan-kilat", "ID→MY") },
];

async function main() {
  console.log(`\n🔍 Calculator Scraper — ${new Date().toISOString()}`);
  console.log(`Mode: ${DRY_RUN ? "DRY RUN" : "LIVE"}`);
  if (CARRIER_FILTER) console.log(`Filter: ${CARRIER_FILTER}\n`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });

  for (const scraper of SCRAPERS) {
    if (CARRIER_FILTER && scraper.id !== CARRIER_FILTER) continue;

    console.log(`📦 ${scraper.id}...`);
    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
    await page.setViewport({ width: 1280, height: 800 });

    try {
      const scraped = await scraper.fn(page);
      if (scraped.length > 0) {
        for (const r of scraped) {
          console.log(`  ✓ ${r.route} ${r.weight_kg}kg = ${r.price} ${r.currency}`);
          results.push(r);
        }
      } else {
        console.log(`  ⚠ No rates extracted`);
      }
    } catch (e) {
      console.log(`  ✗ Error: ${e}`);
    }

    await page.close();
  }

  await browser.close();

  // Save results
  console.log(`\n📊 Results: ${results.length} rates scraped\n`);
  for (const r of results) {
    console.log(`  ${r.carrier}: ${r.route} ${r.weight_kg}kg = ${r.price} ${r.currency} (${r.source})`);
  }

  if (!DRY_RUN && results.length > 0) {
    const outPath = path.join(__dirname, "scraped-rates.json");
    fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
    console.log(`\nSaved to ${outPath}`);
    console.log("Run: npx tsx scripts/apply-scraped-rates.ts to update rate files");
  }
}

main().catch(console.error);
