/**
 * Deep SEO audit — combines GSC + GA + sitemap inspection.
 * Run: npx tsx scripts/seo-audit-deep.ts
 */
import { google } from "googleapis";
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const SITE_URL = "https://rateships.com/";
const CREDENTIALS_PATH = path.join(__dirname, "gsc-credentials.json");

function ago(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0];
}

async function main() {
  const credentials = JSON.parse(readFileSync(CREDENTIALS_PATH, "utf-8"));
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
  });
  const sc = google.searchconsole({ version: "v1", auth });

  console.log("=== Deep SEO audit ===\n");

  // 1. Sites + property type confirmation
  const sites = await sc.sites.list();
  console.log("Permission level:", sites.data.siteEntry?.[0]?.permissionLevel);

  // 2. Sitemaps + their status
  console.log("\n--- Sitemaps ---");
  const sm = await sc.sitemaps.list({ siteUrl: SITE_URL });
  for (const s of sm.data.sitemap ?? []) {
    console.log(`  ${s.path}`);
    console.log(`    type: ${s.type}, isPending: ${s.isPending}, isSitemapsIndex: ${s.isSitemapsIndex}`);
    console.log(`    lastSubmitted: ${s.lastSubmitted}, lastDownloaded: ${s.lastDownloaded}`);
    console.log(`    warnings: ${s.warnings}, errors: ${s.errors}`);
    if (s.contents) {
      for (const c of s.contents) {
        console.log(`    contents[${c.type}]: submitted=${c.submitted}, indexed=${c.indexed}`);
      }
    }
  }

  // 3. Total clicks/impressions over time (28d window)
  console.log("\n--- Last 28 days ---");
  const totals = await sc.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: { startDate: ago(28), endDate: ago(1), rowLimit: 1, dataState: "final" },
  });
  const t = totals.data.rows?.[0];
  console.log(`  total clicks: ${t?.clicks ?? 0}, impressions: ${t?.impressions ?? 0}, CTR: ${((t?.ctr ?? 0) * 100).toFixed(2)}%, avg position: ${(t?.position ?? 0).toFixed(1)}`);

  // 4. Country breakdown
  console.log("\n--- Top 15 countries by impressions ---");
  const countries = await sc.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: { startDate: ago(28), endDate: ago(1), dimensions: ["country"], rowLimit: 15, dataState: "final" },
  });
  for (const r of countries.data.rows ?? []) {
    console.log(`  ${r.keys?.[0]?.toUpperCase()}: ${r.impressions} imp, ${r.clicks} clicks, pos ${(r.position ?? 0).toFixed(1)}, CTR ${((r.ctr ?? 0) * 100).toFixed(2)}%`);
  }

  // 5. Device split
  console.log("\n--- Device split ---");
  const dev = await sc.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: { startDate: ago(28), endDate: ago(1), dimensions: ["device"], dataState: "final" },
  });
  for (const r of dev.data.rows ?? []) {
    console.log(`  ${r.keys?.[0]}: ${r.impressions} imp, ${r.clicks} clicks, CTR ${((r.ctr ?? 0) * 100).toFixed(2)}%`);
  }

  // 6. Top performing pages (by clicks)
  console.log("\n--- Top 25 pages BY CLICKS ---");
  const topPages = await sc.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: {
      startDate: ago(28),
      endDate: ago(1),
      dimensions: ["page"],
      rowLimit: 25,
      dataState: "final",
    },
  });
  // sort by clicks desc
  const sortedTop = [...(topPages.data.rows ?? [])].sort((a, b) => (b.clicks ?? 0) - (a.clicks ?? 0));
  for (const r of sortedTop) {
    const u = (r.keys?.[0] ?? "").replace(SITE_URL, "/");
    console.log(`  ${u}: ${r.clicks} clicks, ${r.impressions} imp, CTR ${((r.ctr ?? 0) * 100).toFixed(2)}%, pos ${(r.position ?? 0).toFixed(1)}`);
  }

  // 7. Pages with HIGH impressions but LOW position (quick wins by improving content/links)
  console.log("\n--- Quick wins: high impressions, position 11-20 (page 2) ---");
  const allPages = await sc.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: {
      startDate: ago(28),
      endDate: ago(1),
      dimensions: ["page"],
      rowLimit: 5000,
      dataState: "final",
    },
  });
  const quickWins = (allPages.data.rows ?? [])
    .filter((r) => (r.impressions ?? 0) > 100 && (r.position ?? 0) >= 11 && (r.position ?? 0) <= 20)
    .sort((a, b) => (b.impressions ?? 0) - (a.impressions ?? 0))
    .slice(0, 20);
  for (const r of quickWins) {
    const u = (r.keys?.[0] ?? "").replace(SITE_URL, "/");
    console.log(`  ${u}: ${r.impressions} imp, pos ${(r.position ?? 0).toFixed(1)}, CTR ${((r.ctr ?? 0) * 100).toFixed(2)}%`);
  }

  // 8. Distribution: how many pages by position bucket
  console.log("\n--- Indexed page distribution by avg position ---");
  const all = allPages.data.rows ?? [];
  const buckets = { "1-3": 0, "4-10": 0, "11-20": 0, "21-50": 0, "51+": 0 };
  for (const r of all) {
    const p = r.position ?? 0;
    if (p <= 3) buckets["1-3"]++;
    else if (p <= 10) buckets["4-10"]++;
    else if (p <= 20) buckets["11-20"]++;
    else if (p <= 50) buckets["21-50"]++;
    else buckets["51+"]++;
  }
  for (const [k, v] of Object.entries(buckets)) console.log(`  ${k}: ${v} pages`);
  console.log(`  Total pages with impressions: ${all.length}`);

  // 9. Inspect a curated set of CRITICAL pages
  console.log("\n--- URL Inspection: critical hub pages ---");
  const critical = [
    "https://rateships.com/en",
    "https://rateships.com/en/carriers",
    "https://rateships.com/en/guide",
    "https://rateships.com/en/customs",
    "https://rateships.com/en/blog",
    "https://rateships.com/en/tools/duty-calculator",
    "https://rateships.com/en/about",
    "https://rateships.com/en/customs/ethiopia",  // known indexed
    "https://rateships.com/en/customs/united-states",
    "https://rateships.com/en/shipping/united-states-to-united-kingdom",
    "https://rateships.com/en/shipping/china-to-united-states",
    "https://rateships.com/en/shipping/germany-to-france",
    "https://rateships.com/en/carriers/dhl-express",
  ];
  for (const u of critical) {
    try {
      const r = await sc.urlInspection.index.inspect({
        requestBody: { inspectionUrl: u, siteUrl: SITE_URL },
      });
      const s = r.data.inspectionResult?.indexStatusResult;
      console.log(`  ${u.replace("https://rateships.com", "")}`);
      console.log(`    state: ${s?.coverageState ?? "?"} | verdict: ${s?.verdict ?? "?"} | last crawl: ${s?.lastCrawlTime ?? "never"}`);
      if (s?.googleCanonical && s.googleCanonical !== u) {
        console.log(`    canonical mismatch: google=${s.googleCanonical}`);
      }
    } catch (e: any) {
      console.log(`  ${u}: ERROR ${e.message?.substring(0, 80)}`);
    }
  }

  // 10. Save full pages report
  const out = (allPages.data.rows ?? []).map((r) => ({
    page: r.keys?.[0],
    clicks: r.clicks,
    impressions: r.impressions,
    ctr: ((r.ctr ?? 0) * 100).toFixed(2) + "%",
    position: (r.position ?? 0).toFixed(1),
  }));
  writeFileSync(path.join(__dirname, "..", "gsc-report.json"), JSON.stringify(out, null, 2));
  console.log(`\nSaved gsc-report.json (${out.length} pages)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
