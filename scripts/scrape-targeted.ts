/**
 * Targeted Puppeteer scrapers for specific carrier calculators.
 * Each scraper is hand-crafted for the specific calculator UI.
 *
 * Usage: npx tsx scripts/scrape-targeted.ts
 */

import puppeteer from "puppeteer";

interface Result {
  carrier: string;
  route: string;
  weight: string;
  price: string;
  currency: string;
}

const results: Result[] = [];

async function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log("🔍 Targeted Calculator Scraper\n");

  const browser = await puppeteer.launch({
    headless: false, // visible so we can debug
    args: ["--no-sandbox", "--window-size=1280,800"],
    defaultViewport: { width: 1280, height: 800 },
  });

  // 1. CESKA POSTA — CZ→DE 1kg
  console.log("📦 Ceska Posta...");
  try {
    const page = await browser.newPage();
    await page.goto("https://www.postaonline.cz/kalkulacka-postovneho", { waitUntil: "networkidle0", timeout: 45000 });
    await delay(3000);

    // Take screenshot to see what we're working with
    await page.screenshot({ path: "/tmp/ceska-posta.png" });

    // Try to find and interact with the form
    const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 2000));
    console.log("  Page text preview:", bodyText.substring(0, 300));

    // Look for any price-like text on the page
    const allText = await page.evaluate(() => document.body.innerText);
    const matches = allText.match(/\d+[\s,.]?\d*\s*(?:Kč|CZK)/gi);
    if (matches) {
      console.log("  Found prices:", matches.slice(0, 5));
      results.push({ carrier: "ceska-posta", route: "CZ→DE", weight: "1kg", price: matches[0], currency: "CZK" });
    }
    await page.close();
  } catch (e) {
    console.log(`  ✗ Error: ${e}`);
  }

  // 2. SMSA — try their API directly
  console.log("\n📦 SMSA Express (via API)...");
  try {
    const page = await browser.newPage();
    // SMSA has an API endpoint that the calculator calls
    const response = await page.evaluate(async () => {
      try {
        const res = await fetch("https://www.smsaexpress.com/smsa_api/rate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            origin_country: "SA",
            destination_country: "AE",
            weight: 1,
            length: 20,
            width: 15,
            height: 10,
          }),
        });
        return await res.text();
      } catch {
        return "API call failed";
      }
    });
    console.log("  API response:", response.substring(0, 500));
    await page.close();
  } catch (e) {
    console.log(`  ✗ Error: ${e}`);
  }

  // 3. DPD RUSSIA — try dpd.ru calculator
  console.log("\n📦 DPD Russia...");
  try {
    const page = await browser.newPage();
    await page.goto("https://www.dpd.ru/dpd/calculate-cost.do2", { waitUntil: "networkidle2", timeout: 45000 });
    await delay(3000);
    await page.screenshot({ path: "/tmp/dpd-russia.png" });
    const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 2000));
    console.log("  Page text preview:", bodyText.substring(0, 300));
    const allText = await page.evaluate(() => document.body.innerText);
    const rMatches = allText.match(/\d+[\s,.]?\d*\s*(?:руб|₽|RUB)/gi);
    if (rMatches) {
      console.log("  Found prices:", rMatches.slice(0, 5));
    }
    await page.close();
  } catch (e) {
    console.log(`  ✗ Error: ${e}`);
  }

  // 4. POS INDONESIA — try API
  console.log("\n📦 Pos Indonesia (API attempt)...");
  try {
    const page = await browser.newPage();
    const response = await page.evaluate(async () => {
      try {
        const res = await fetch("https://www.posindonesia.co.id/id/content/check-tarif", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: "from=10000&to=US&weight=1000",
        });
        return await res.text();
      } catch {
        return "API call failed";
      }
    });
    console.log("  Response:", response.substring(0, 500));
    await page.close();
  } catch (e) {
    console.log(`  ✗ Error: ${e}`);
  }

  // 5. NAQEL — try API
  console.log("\n📦 Naqel Express (API attempt)...");
  try {
    const page = await browser.newPage();
    await page.goto("https://www.naqelexpress.com/en/sa/ratecalculator/", { waitUntil: "networkidle2", timeout: 45000 });
    await delay(5000);
    await page.screenshot({ path: "/tmp/naqel.png" });
    // Log all network requests to find the API
    const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 2000));
    console.log("  Page text:", bodyText.substring(0, 400));
    await page.close();
  } catch (e) {
    console.log(`  ✗ Error: ${e}`);
  }

  await browser.close();

  console.log("\n📊 Results:");
  for (const r of results) {
    console.log(`  ${r.carrier}: ${r.route} ${r.weight} = ${r.price} ${r.currency}`);
  }
  if (results.length === 0) console.log("  No rates extracted.");
  console.log("\nScreenshots saved to /tmp/ for debugging.");
}

main().catch(console.error);
