/**
 * Comprehensive GSC errors export — pulls every category of issue Google
 * Search Console exposes via API and writes a single markdown report.
 *
 * Sections:
 *   1. Sitemap submissions — failed/warned sitemaps + per-sitemap counts
 *   2. URL Inspection — top 50 priority URLs with their indexing state,
 *      coverage state, crawl status, robots.txt state, AMP/canonical
 *      mismatches
 *   3. Search Analytics — pages with impressions but zero clicks (signal
 *      of SERP-level display issues / weak titles)
 *   4. Mobile usability — N/A via API in 2025+ (deprecated)
 *
 * Run: npx tsx scripts/gsc-errors-export.ts
 *
 * Output: docs/reports/gsc-errors-{YYYY-MM-DD}.md
 */
import { google } from "googleapis";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import path from "path";

const SITE_URL = "https://rateships.com/";
const CREDENTIALS_PATH = path.join(__dirname, "gsc-credentials.json");

const today = new Date().toISOString().split("T")[0];
const ago = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0];
};

// Priority URLs to inspect — hubs + top-traffic pages from latest digest.
const PRIORITY_URLS: string[] = [
  // Roots / hubs
  "/en",
  "/en/carriers",
  "/en/customs",
  "/en/blog",
  "/en/guide",
  "/en/about",
  "/en/tools",
  "/en/tools/duty-calculator",
  "/en/tools/delivery-estimator",
  "/en/platforms",
  "/en/team",
  "/en/data-methodology",
  // Russian hubs (where we have organic interest)
  "/ru",
  "/ru/carriers",
  "/ru/customs",
  "/ru/blog",
  "/ru/about",
  // Top corridor pages (from weekly digest top-clicks)
  "/en/shipping/germany-to-israel",
  "/en/shipping/afghanistan-to-united-states",
  "/en/shipping/belgium-to-zimbabwe",
  "/en/shipping/eswatini-to-zambia",
  "/en/shipping/ghana-to-germany",
  "/en/shipping/ghana-to-zimbabwe",
  "/en/shipping/greece-to-denmark",
  "/en/shipping/italy-to-laos",
  "/en/shipping/italy-to-tanzania",
  "/en/shipping/japan-to-norway",
  "/en/shipping/united-states-to-united-kingdom",
  "/en/shipping/china-to-united-states",
  "/en/shipping/germany-to-france",
  "/en/shipping/united-states-to-germany",
  "/en/shipping/united-states-to-japan",
  // Carriers (top brands with reviews)
  "/en/carriers/dhl-express",
  "/en/carriers/fedex",
  "/en/carriers/ups",
  "/en/carriers/usps",
  "/en/carriers/royal-mail",
  // Customs (hub-favorited)
  "/en/customs/germany",
  "/en/customs/united-states",
  "/en/customs/united-kingdom",
  "/en/customs/china",
  "/en/customs/japan",
  // Blog flagship posts
  "/en/blog/cheapest-way-to-ship-internationally",
  "/en/blog/customs-clearance-guide",
];

interface InspectionResult {
  url: string;
  verdict: string | null;
  coverageState: string | null;
  indexingState: string | null;
  lastCrawlTime: string | null;
  pageFetchState: string | null;
  robotsTxtState: string | null;
  googleCanonical: string | null;
  userCanonical: string | null;
  referringUrls: number;
  crawledAs: string | null;
  ampVerdict: string | null;
  mobileVerdict: string | null;
  richResultsVerdict: string | null;
  error?: string;
}

async function main() {
  const credentials = JSON.parse(readFileSync(CREDENTIALS_PATH, "utf-8"));
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
  });
  const searchconsole = google.searchconsole({ version: "v1", auth });

  const lines: string[] = [];
  lines.push(`# GSC Errors Export — ${today}`);
  lines.push("");
  lines.push(`**Site:** ${SITE_URL}`);
  lines.push(`**Service account:** ${credentials.client_email}`);
  lines.push(`**Window:** ${PRIORITY_URLS.length} priority URLs inspected`);
  lines.push("");
  lines.push("---");
  lines.push("");

  // 1. SITEMAPS
  console.log("[1/3] Pulling sitemaps…");
  lines.push("## 1. Sitemap submissions");
  lines.push("");
  try {
    const sitemapsRes = await searchconsole.sitemaps.list({ siteUrl: SITE_URL });
    const sitemaps = sitemapsRes.data.sitemap ?? [];

    if (sitemaps.length === 0) {
      lines.push("⚠️ **No sitemaps submitted.** Submit `https://rateships.com/sitemap.xml` in Search Console.");
    } else {
      lines.push("| Path | Type | Submitted | Last downloaded | Errors | Warnings | Indexed | Pending |");
      lines.push("|---|---|---|---|---:|---:|---:|---:|");
      for (const sm of sitemaps) {
        const errors = (sm.contents ?? []).reduce((a, c) => a + parseInt(c.indexed ?? "0", 10) - parseInt(c.submitted ?? "0", 10), 0);
        lines.push(
          `| \`${sm.path?.replace(SITE_URL, "/") ?? "?"}\` ` +
            `| ${sm.type ?? "?"} ` +
            `| ${sm.lastSubmitted ?? "?"} ` +
            `| ${sm.lastDownloaded ?? "?"} ` +
            `| ${sm.errors ?? 0} ` +
            `| ${sm.warnings ?? 0} ` +
            `| ${sm.contents?.[0]?.indexed ?? "?"} ` +
            `| ${sm.contents?.[0]?.submitted ?? "?"} |`
        );
      }
    }
  } catch (e) {
    lines.push(`❌ Error reading sitemaps: ${(e as Error).message}`);
  }
  lines.push("");
  lines.push("---");
  lines.push("");

  // 2. URL INSPECTION
  console.log(`[2/3] URL inspection — ${PRIORITY_URLS.length} URLs (this takes ~${PRIORITY_URLS.length * 2}s)…`);
  lines.push("## 2. URL Inspection — indexing + coverage");
  lines.push("");
  lines.push("**Verdict legend:** `PASS` indexable; `NEUTRAL` neither pass nor fail; `PARTIAL` partial issues; `FAIL` not indexable.");
  lines.push("");

  const results: InspectionResult[] = [];
  for (const urlPath of PRIORITY_URLS) {
    const fullUrl = `${SITE_URL.replace(/\/$/, "")}${urlPath}`;
    try {
      const res = await searchconsole.urlInspection.index.inspect({
        requestBody: { inspectionUrl: fullUrl, siteUrl: SITE_URL },
      });
      const idx = res.data.inspectionResult?.indexStatusResult;
      const amp = res.data.inspectionResult?.ampResult;
      const mob = res.data.inspectionResult?.mobileUsabilityResult;
      const rr = res.data.inspectionResult?.richResultsResult;
      results.push({
        url: urlPath,
        verdict: idx?.verdict ?? null,
        coverageState: idx?.coverageState ?? null,
        indexingState: idx?.indexingState ?? null,
        lastCrawlTime: idx?.lastCrawlTime ?? null,
        pageFetchState: idx?.pageFetchState ?? null,
        robotsTxtState: idx?.robotsTxtState ?? null,
        googleCanonical: idx?.googleCanonical ?? null,
        userCanonical: idx?.userCanonical ?? null,
        referringUrls: idx?.referringUrls?.length ?? 0,
        crawledAs: idx?.crawledAs ?? null,
        ampVerdict: amp?.verdict ?? null,
        mobileVerdict: mob?.verdict ?? null,
        richResultsVerdict: rr?.verdict ?? null,
      });
      console.log(`  ${urlPath}: ${idx?.verdict ?? "?"} / ${idx?.coverageState ?? "?"}`);
    } catch (e) {
      const err = (e as Error).message;
      results.push({
        url: urlPath,
        verdict: null, coverageState: null, indexingState: null,
        lastCrawlTime: null, pageFetchState: null, robotsTxtState: null,
        googleCanonical: null, userCanonical: null, referringUrls: 0,
        crawledAs: null, ampVerdict: null, mobileVerdict: null, richResultsVerdict: null,
        error: err,
      });
      console.log(`  ${urlPath}: ERROR ${err.slice(0, 60)}`);
    }
    // Rate limit: GSC allows ~600 inspections/day. Sleep 1s between calls.
    await new Promise((r) => setTimeout(r, 1000));
  }

  // 2a. Group by verdict
  const byVerdict: Record<string, InspectionResult[]> = {};
  for (const r of results) {
    const k = r.error ? "ERROR" : r.verdict ?? "UNKNOWN";
    (byVerdict[k] = byVerdict[k] ?? []).push(r);
  }

  lines.push("### 2.1 Summary by verdict");
  lines.push("");
  lines.push("| Verdict | Count |");
  lines.push("|---|---:|");
  for (const [verdict, items] of Object.entries(byVerdict).sort((a, b) => b[1].length - a[1].length)) {
    lines.push(`| ${verdict} | ${items.length} |`);
  }
  lines.push("");

  // 2b. Problem URLs (anything not PASS)
  lines.push("### 2.2 Problem URLs (verdict ≠ PASS)");
  lines.push("");
  const problems = results.filter((r) => r.verdict !== "PASS");
  if (problems.length === 0) {
    lines.push("✅ All inspected URLs are indexable. No problems found.");
  } else {
    lines.push("| URL | Verdict | Coverage | Indexing | Robots | Canonical mismatch | Last crawl |");
    lines.push("|---|---|---|---|---|---|---|");
    for (const r of problems) {
      const canonicalMismatch =
        r.userCanonical && r.googleCanonical && r.userCanonical !== r.googleCanonical
          ? `⚠️ user=${r.userCanonical?.replace(SITE_URL, "/")} → google=${r.googleCanonical?.replace(SITE_URL, "/")}`
          : "—";
      lines.push(
        `| \`${r.url}\` ` +
          `| ${r.error ? `❌ ${r.error.slice(0, 30)}` : r.verdict ?? "?"} ` +
          `| ${r.coverageState ?? "?"} ` +
          `| ${r.indexingState ?? "?"} ` +
          `| ${r.robotsTxtState ?? "?"} ` +
          `| ${canonicalMismatch} ` +
          `| ${r.lastCrawlTime ? r.lastCrawlTime.split("T")[0] : "never"} |`
      );
    }
  }
  lines.push("");

  // 2c. Coverage state breakdown
  const byCoverage: Record<string, number> = {};
  for (const r of results) {
    const k = r.coverageState ?? "(no data)";
    byCoverage[k] = (byCoverage[k] ?? 0) + 1;
  }
  lines.push("### 2.3 Coverage states");
  lines.push("");
  lines.push("| State | Count | Meaning |");
  lines.push("|---|---:|---|");
  const coverageMeanings: Record<string, string> = {
    "Submitted and indexed": "✅ Healthy — page is in Google's index",
    "Crawled - currently not indexed": "⚠️ Google saw it but chose not to index — often quality / duplicate signal",
    "Discovered - currently not indexed": "⏳ Google knows the URL exists but hasn't crawled yet — often crawl budget or low priority",
    "Page with redirect": "🔄 Page redirects to another URL — check canonical & redirect target",
    "Indexed, though blocked by robots.txt": "⚠️ Indexed but robots.txt is blocking re-crawl — fix robots or remove from index",
    "Indexed, not submitted in sitemap": "ℹ️ In index but missing from sitemap — add to sitemap",
    "Excluded by 'noindex' tag": "🚫 Has noindex meta — intentional or accidental?",
    "Soft 404": "⚠️ Returns 200 but content looks like 404 — fix content or return real 404",
    "Not found (404)": "❌ Returns 404 — remove from sitemap or fix link",
    "Server error (5xx)": "❌ Server returned 5xx during crawl — check server health",
    "Redirect error": "❌ Redirect chain broken or too long",
    "Submitted URL not found (404)": "❌ Sitemap lists URL that returns 404",
    "Blocked by robots.txt": "🚫 robots.txt prevents crawl",
    "Blocked due to other 4xx issue": "❌ 4xx response other than 404",
    "Duplicate without user-selected canonical": "⚠️ No canonical declared and Google found duplicates — set rel=canonical",
    "Duplicate, Google chose different canonical than user": "⚠️ Google ignores your canonical — usually means it's wrong",
    "Alternate page with proper canonical tag": "✅ Healthy — alternate language/region page",
  };
  for (const [state, count] of Object.entries(byCoverage).sort((a, b) => b[1] - a[1])) {
    lines.push(`| ${state} | ${count} | ${coverageMeanings[state] ?? "—"} |`);
  }
  lines.push("");
  lines.push("---");
  lines.push("");

  // 3. SEARCH ANALYTICS — pages with impressions but zero clicks (last 28 days)
  console.log("[3/3] Search Analytics — zero-click pages (last 28d)…");
  lines.push("## 3. Pages with impressions but zero clicks (last 28d)");
  lines.push("");
  lines.push("These pages are appearing in Google search results (impressions > 50) but nobody clicks (clicks = 0). Indicates SERP-level issues: weak titles, missing rich snippets, displayed for irrelevant queries, or appearing too low.");
  lines.push("");
  try {
    const sa = await searchconsole.searchanalytics.query({
      siteUrl: SITE_URL,
      requestBody: {
        startDate: ago(28),
        endDate: ago(1),
        dimensions: ["page"],
        rowLimit: 100,
      },
    });
    const rows = (sa.data.rows ?? [])
      .filter((r) => (r.impressions ?? 0) >= 50 && (r.clicks ?? 0) === 0)
      .sort((a, b) => (b.impressions ?? 0) - (a.impressions ?? 0));
    if (rows.length === 0) {
      lines.push("✅ No page has 50+ impressions with 0 clicks. SERP performance reasonable.");
    } else {
      lines.push(`Found **${rows.length}** zero-click pages with significant impressions:`);
      lines.push("");
      lines.push("| Page | Impressions | Avg Position | CTR |");
      lines.push("|---|---:|---:|---:|");
      for (const r of rows.slice(0, 30)) {
        const url = (r.keys?.[0] ?? "").replace(SITE_URL, "/");
        lines.push(
          `| \`${url}\` ` +
            `| ${r.impressions} ` +
            `| ${r.position?.toFixed(1) ?? "?"} ` +
            `| 0% |`
        );
      }
      if (rows.length > 30) lines.push(`\n*…and ${rows.length - 30} more.*`);
    }
  } catch (e) {
    lines.push(`❌ Error reading search analytics: ${(e as Error).message}`);
  }
  lines.push("");
  lines.push("---");
  lines.push("");

  // Footer
  lines.push("## Notes");
  lines.push("");
  lines.push("- Mobile usability and Core Web Vitals errors are no longer exposed via the GSC API (deprecated 2024). Check those manually in Search Console UI → Experience → Page Experience.");
  lines.push("- Manual actions and security issues require OAuth scope `siteSettings` which our service account doesn't have. Check manually in GSC UI → Security & Manual actions.");
  lines.push(`- This report covers ${PRIORITY_URLS.length} priority URLs. To inspect more, edit \`PRIORITY_URLS\` in \`scripts/gsc-errors-export.ts\`.`);
  lines.push("");
  lines.push(`*Generated ${today}*`);

  // Write report
  const outDir = path.join(__dirname, "..", "docs", "reports");
  mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `gsc-errors-${today}.md`);
  writeFileSync(outPath, lines.join("\n") + "\n");
  console.log(`\n✅ Report written to: ${path.relative(process.cwd(), outPath)}`);
  console.log(`   Lines: ${lines.length}`);
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
