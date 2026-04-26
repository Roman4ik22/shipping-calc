/**
 * Google Search Console — SEO link audit
 *
 * Pulls crawl errors, index coverage, and link stats from GSC API.
 *
 * Setup:
 * 1. Place service account JSON at scripts/gsc-credentials.json
 * 2. Add the service account email as a user in GSC with Full access
 * 3. Run: npx tsx scripts/gsc-audit.ts
 */

import { google } from "googleapis";
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const SITE_URL = "https://rateships.com/";
const CREDENTIALS_PATH = path.join(__dirname, "gsc-credentials.json");

async function getAuth() {
  const credentials = JSON.parse(readFileSync(CREDENTIALS_PATH, "utf-8"));
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
  });
  return auth;
}

async function main() {
  const auth = await getAuth();
  const searchconsole = google.searchconsole({ version: "v1", auth });

  console.log("=== Google Search Console Audit ===\n");
  console.log(`Site: ${SITE_URL}\n`);

  // 1. URL Inspection — index coverage sampling
  console.log("--- Index Coverage (sampling popular corridors) ---");
  const sampleUrls = [
    "/en/shipping/united-states-to-united-kingdom",
    "/en/shipping/china-to-united-states",
    "/en/shipping/germany-to-france",
    "/en/platforms",
    "/en/carriers",
    "/en/guide",
  ];

  for (const urlPath of sampleUrls) {
    try {
      const res = await searchconsole.urlInspection.index.inspect({
        requestBody: {
          inspectionUrl: `${SITE_URL}${urlPath}`,
          siteUrl: SITE_URL,
        },
      });
      const result = res.data.inspectionResult;
      const indexStatus = result?.indexStatusResult;
      console.log(
        `  ${urlPath}: ${indexStatus?.coverageState ?? "unknown"} | ` +
          `verdict: ${indexStatus?.verdict ?? "?"} | ` +
          `crawled: ${indexStatus?.lastCrawlTime ?? "never"}`
      );
      if (indexStatus?.pageFetchState && indexStatus.pageFetchState !== "SUCCESSFUL") {
        console.log(`    ⚠ Fetch issue: ${indexStatus.pageFetchState}`);
      }
      if (indexStatus?.robotsTxtState && indexStatus.robotsTxtState !== "ALLOWED") {
        console.log(`    ⚠ Robots.txt: ${indexStatus.robotsTxtState}`);
      }
    } catch (e: any) {
      console.log(`  ${urlPath}: ERROR — ${e.message}`);
    }
  }

  // 2. Search Analytics — pages with low CTR (potential link/title issues)
  console.log("\n--- Pages with Impressions but Low CTR (potential SEO issues) ---");
  try {
    const analytics = await searchconsole.searchanalytics.query({
      siteUrl: SITE_URL,
      requestBody: {
        startDate: getDateDaysAgo(28),
        endDate: getDateDaysAgo(1),
        dimensions: ["page"],
        rowLimit: 1000,
        dataState: "final",
      },
    });

    const lowCtr = (analytics.data.rows ?? [])
      .filter((r) => (r.impressions ?? 0) > 50 && (r.ctr ?? 0) < 0.01)
      .sort((a, b) => (b.impressions ?? 0) - (a.impressions ?? 0))
      .slice(0, 20);

    if (lowCtr.length === 0) {
      console.log("  No pages with >50 impressions and <1% CTR");
    } else {
      for (const row of lowCtr) {
        const url = (row.keys?.[0] ?? "").replace(SITE_URL, "");
        console.log(
          `  ${url}: ${row.impressions} imp, ${((row.ctr ?? 0) * 100).toFixed(2)}% CTR, pos ${(row.position ?? 0).toFixed(1)}`
        );
      }
    }
  } catch (e: any) {
    console.log(`  ERROR: ${e.message}`);
  }

  // 3. Search Analytics — queries driving traffic
  console.log("\n--- Top Queries (last 28 days) ---");
  try {
    const queries = await searchconsole.searchanalytics.query({
      siteUrl: SITE_URL,
      requestBody: {
        startDate: getDateDaysAgo(28),
        endDate: getDateDaysAgo(1),
        dimensions: ["query"],
        rowLimit: 20,
        dataState: "final",
      },
    });

    for (const row of queries.data.rows ?? []) {
      console.log(
        `  "${row.keys?.[0]}": ${row.clicks} clicks, ${row.impressions} imp, pos ${(row.position ?? 0).toFixed(1)}`
      );
    }
  } catch (e: any) {
    console.log(`  ERROR: ${e.message}`);
  }

  // 4. Sitemaps status
  console.log("\n--- Sitemaps ---");
  try {
    const sitemaps = await searchconsole.sitemaps.list({ siteUrl: SITE_URL });
    for (const sm of sitemaps.data.sitemap ?? []) {
      console.log(
        `  ${sm.path}: ${sm.isPending ? "PENDING" : "OK"} | ` +
          `submitted: ${sm.contents?.[0]?.submitted ?? "?"} | ` +
          `indexed: ${sm.contents?.[0]?.indexed ?? "?"}`
      );
    }
  } catch (e: any) {
    console.log(`  ERROR: ${e.message}`);
  }

  // 5. Corridor pages performance — are the fixed pages getting indexed?
  console.log("\n--- Corridor Pages Performance (shipping/*-to-*) ---");
  try {
    const corridors = await searchconsole.searchanalytics.query({
      siteUrl: SITE_URL,
      requestBody: {
        startDate: getDateDaysAgo(28),
        endDate: getDateDaysAgo(1),
        dimensions: ["page"],
        dimensionFilterGroups: [
          {
            filters: [
              {
                dimension: "page",
                operator: "includingRegex",
                expression: "/shipping/[a-z]+-to-[a-z]+",
              },
            ],
          },
        ],
        rowLimit: 5000,
        dataState: "final",
      },
    });

    const rows = corridors.data.rows ?? [];
    const totalClicks = rows.reduce((s, r) => s + (r.clicks ?? 0), 0);
    const totalImpressions = rows.reduce((s, r) => s + (r.impressions ?? 0), 0);
    const avgPosition =
      rows.length > 0
        ? rows.reduce((s, r) => s + (r.position ?? 0), 0) / rows.length
        : 0;

    console.log(`  Total corridor pages with data: ${rows.length}`);
    console.log(`  Total clicks: ${totalClicks}`);
    console.log(`  Total impressions: ${totalImpressions}`);
    console.log(`  Average position: ${avgPosition.toFixed(1)}`);

    // Top 10 corridor pages
    const topCorridors = [...rows]
      .sort((a, b) => (b.clicks ?? 0) - (a.clicks ?? 0))
      .slice(0, 10);

    console.log("\n  Top 10 corridors by clicks:");
    for (const row of topCorridors) {
      const url = (row.keys?.[0] ?? "").replace(SITE_URL, "");
      console.log(
        `    ${url}: ${row.clicks} clicks, ${row.impressions} imp, pos ${(row.position ?? 0).toFixed(1)}`
      );
    }
  } catch (e: any) {
    console.log(`  ERROR: ${e.message}`);
  }

  // 6. Export full report
  console.log("\n--- Exporting full report ---");
  try {
    const allPages = await searchconsole.searchanalytics.query({
      siteUrl: SITE_URL,
      requestBody: {
        startDate: getDateDaysAgo(28),
        endDate: getDateDaysAgo(1),
        dimensions: ["page"],
        rowLimit: 5000,
        dataState: "final",
      },
    });

    const report = (allPages.data.rows ?? []).map((r) => ({
      page: r.keys?.[0] ?? "",
      clicks: r.clicks ?? 0,
      impressions: r.impressions ?? 0,
      ctr: ((r.ctr ?? 0) * 100).toFixed(2) + "%",
      position: (r.position ?? 0).toFixed(1),
    }));

    const outPath = path.join(__dirname, "..", "gsc-report.json");
    writeFileSync(outPath, JSON.stringify(report, null, 2));
    console.log(`  Saved ${report.length} pages to gsc-report.json`);
  } catch (e: any) {
    console.log(`  ERROR: ${e.message}`);
  }
}

function getDateDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0];
}

main().catch(console.error);
