/**
 * Google Analytics 4 — Traffic & engagement audit
 *
 * Pulls page performance, bounce rates, and traffic trends from GA4 Data API.
 *
 * Setup:
 * 1. Place service account JSON at scripts/gsc-credentials.json (same as GSC)
 * 2. Add the service account email as Viewer in GA4 property settings
 * 3. Set your GA4 property ID below
 * 4. Run: npx tsx scripts/ga-audit.ts
 */

import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { readFileSync, writeFileSync } from "fs";
import path from "path";

// ⬇️ Replace with your GA4 property ID (found in GA4 Admin → Property Settings)
const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID || "401473897";
const CREDENTIALS_PATH = path.join(__dirname, "gsc-credentials.json");

async function main() {
  if (GA4_PROPERTY_ID === "YOUR_PROPERTY_ID") {
    console.error("❌ Set GA4_PROPERTY_ID in the script or via env: GA4_PROPERTY_ID=123456 npx tsx scripts/ga-audit.ts");
    process.exit(1);
  }

  const credentials = JSON.parse(readFileSync(CREDENTIALS_PATH, "utf-8"));
  const client = new BetaAnalyticsDataClient({ credentials });

  console.log("=== Google Analytics 4 Audit ===\n");
  console.log(`Property: ${GA4_PROPERTY_ID}\n`);

  // 1. Overall traffic summary (last 28 days)
  console.log("--- Traffic Summary (last 28 days) ---");
  try {
    const [summary] = await client.runReport({
      property: `properties/${GA4_PROPERTY_ID}`,
      dateRanges: [{ startDate: "28daysAgo", endDate: "yesterday" }],
      metrics: [
        { name: "sessions" },
        { name: "totalUsers" },
        { name: "screenPageViews" },
        { name: "bounceRate" },
        { name: "averageSessionDuration" },
        { name: "engagedSessions" },
      ],
    });

    const row = summary.rows?.[0];
    if (row) {
      console.log(`  Sessions: ${row.metricValues?.[0]?.value}`);
      console.log(`  Users: ${row.metricValues?.[1]?.value}`);
      console.log(`  Page views: ${row.metricValues?.[2]?.value}`);
      console.log(`  Bounce rate: ${(Number(row.metricValues?.[3]?.value) * 100).toFixed(1)}%`);
      console.log(`  Avg session: ${Number(row.metricValues?.[4]?.value).toFixed(0)}s`);
      console.log(`  Engaged sessions: ${row.metricValues?.[5]?.value}`);
    }
  } catch (e: any) {
    console.log(`  ERROR: ${e.message}`);
  }

  // 2. Top pages by page views
  console.log("\n--- Top 20 Pages by Views ---");
  try {
    const [pages] = await client.runReport({
      property: `properties/${GA4_PROPERTY_ID}`,
      dateRanges: [{ startDate: "28daysAgo", endDate: "yesterday" }],
      dimensions: [{ name: "pagePath" }],
      metrics: [
        { name: "screenPageViews" },
        { name: "bounceRate" },
        { name: "averageSessionDuration" },
      ],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: 20,
    });

    for (const row of pages.rows ?? []) {
      const pagePath = row.dimensionValues?.[0]?.value ?? "";
      const views = row.metricValues?.[0]?.value ?? "0";
      const bounce = (Number(row.metricValues?.[1]?.value) * 100).toFixed(1);
      const duration = Number(row.metricValues?.[2]?.value).toFixed(0);
      console.log(`  ${pagePath}: ${views} views, ${bounce}% bounce, ${duration}s avg`);
    }
  } catch (e: any) {
    console.log(`  ERROR: ${e.message}`);
  }

  // 3. Corridor pages specifically
  console.log("\n--- Corridor Pages Performance ---");
  try {
    const [corridors] = await client.runReport({
      property: `properties/${GA4_PROPERTY_ID}`,
      dateRanges: [{ startDate: "28daysAgo", endDate: "yesterday" }],
      dimensions: [{ name: "pagePath" }],
      metrics: [
        { name: "screenPageViews" },
        { name: "bounceRate" },
        { name: "engagedSessions" },
      ],
      dimensionFilter: {
        filter: {
          fieldName: "pagePath",
          stringFilter: {
            matchType: "CONTAINS",
            value: "/shipping/",
          },
        },
      },
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: 20,
    });

    for (const row of corridors.rows ?? []) {
      const pagePath = row.dimensionValues?.[0]?.value ?? "";
      const views = row.metricValues?.[0]?.value ?? "0";
      const bounce = (Number(row.metricValues?.[1]?.value) * 100).toFixed(1);
      console.log(`  ${pagePath}: ${views} views, ${bounce}% bounce`);
    }
  } catch (e: any) {
    console.log(`  ERROR: ${e.message}`);
  }

  // 4. Traffic by source
  console.log("\n--- Traffic Sources ---");
  try {
    const [sources] = await client.runReport({
      property: `properties/${GA4_PROPERTY_ID}`,
      dateRanges: [{ startDate: "28daysAgo", endDate: "yesterday" }],
      dimensions: [{ name: "sessionDefaultChannelGroup" }],
      metrics: [
        { name: "sessions" },
        { name: "totalUsers" },
        { name: "bounceRate" },
      ],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
    });

    for (const row of sources.rows ?? []) {
      const channel = row.dimensionValues?.[0]?.value ?? "";
      const sessions = row.metricValues?.[0]?.value ?? "0";
      const users = row.metricValues?.[1]?.value ?? "0";
      const bounce = (Number(row.metricValues?.[2]?.value) * 100).toFixed(1);
      console.log(`  ${channel}: ${sessions} sessions, ${users} users, ${bounce}% bounce`);
    }
  } catch (e: any) {
    console.log(`  ERROR: ${e.message}`);
  }

  // 5. Pages with high bounce rate (problem pages)
  console.log("\n--- High Bounce Pages (>80%, >10 views) ---");
  try {
    const [highBounce] = await client.runReport({
      property: `properties/${GA4_PROPERTY_ID}`,
      dateRanges: [{ startDate: "28daysAgo", endDate: "yesterday" }],
      dimensions: [{ name: "pagePath" }],
      metrics: [
        { name: "screenPageViews" },
        { name: "bounceRate" },
      ],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: 500,
    });

    const problems = (highBounce.rows ?? [])
      .filter(
        (r) =>
          Number(r.metricValues?.[0]?.value) > 10 &&
          Number(r.metricValues?.[1]?.value) > 0.8
      )
      .slice(0, 20);

    for (const row of problems) {
      const pagePath = row.dimensionValues?.[0]?.value ?? "";
      const views = row.metricValues?.[0]?.value ?? "0";
      const bounce = (Number(row.metricValues?.[1]?.value) * 100).toFixed(1);
      console.log(`  ${pagePath}: ${views} views, ${bounce}% bounce`);
    }
    if (problems.length === 0) console.log("  No high-bounce pages found");
  } catch (e: any) {
    console.log(`  ERROR: ${e.message}`);
  }

  // 6. Export
  console.log("\n--- Exporting full GA report ---");
  try {
    const [allPages] = await client.runReport({
      property: `properties/${GA4_PROPERTY_ID}`,
      dateRanges: [{ startDate: "28daysAgo", endDate: "yesterday" }],
      dimensions: [{ name: "pagePath" }],
      metrics: [
        { name: "screenPageViews" },
        { name: "bounceRate" },
        { name: "averageSessionDuration" },
        { name: "engagedSessions" },
      ],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: 5000,
    });

    const report = (allPages.rows ?? []).map((r) => ({
      page: r.dimensionValues?.[0]?.value ?? "",
      views: Number(r.metricValues?.[0]?.value ?? 0),
      bounceRate: (Number(r.metricValues?.[1]?.value) * 100).toFixed(1) + "%",
      avgDuration: Number(r.metricValues?.[2]?.value).toFixed(0) + "s",
      engagedSessions: Number(r.metricValues?.[3]?.value ?? 0),
    }));

    const outPath = path.join(__dirname, "..", "ga-report.json");
    writeFileSync(outPath, JSON.stringify(report, null, 2));
    console.log(`  Saved ${report.length} pages to ga-report.json`);
  } catch (e: any) {
    console.log(`  ERROR: ${e.message}`);
  }
}

main().catch(console.error);
