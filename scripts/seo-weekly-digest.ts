/**
 * Weekly SEO digest for rateships.com.
 *
 *   npm run seo:weekly
 *
 * Runs the full GSC pull, computes deltas vs the prior week's snapshot,
 * writes a human-readable markdown digest to docs/reports/weekly/{date}.md,
 * and updates .seo-snapshots.json with the latest numbers for next week's
 * comparison.
 *
 * Designed to run weekly via cron / launchd. See docs/cron-setup.md.
 */

import { google } from "googleapis";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import path from "path";

const SITE = "https://rateships.com/";
const ROOT = path.resolve(__dirname, "..");
const SNAPSHOT_FILE = path.join(ROOT, ".seo-snapshots.json");
const REPORTS_DIR = path.join(ROOT, "docs/reports/weekly");

function ago(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0];
}

interface PageMetrics {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface Snapshot {
  date: string;
  totals: { clicks: number; impressions: number; ctr: number; position: number };
  topPages: PageMetrics[];
  topQueries: { query: string; clicks: number; impressions: number; position: number }[];
  countries: { code: string; clicks: number; impressions: number }[];
  hubIndexStatus: Record<string, string>;
}

async function getAuth() {
  const credentials = JSON.parse(readFileSync(path.join(ROOT, "scripts/gsc-credentials.json"), "utf-8"));
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
  });
}

async function buildSnapshot(): Promise<Snapshot> {
  const auth = await getAuth();
  const sc = google.searchconsole({ version: "v1", auth });

  // 7-day window (last full week, excluding today's partial)
  const startDate = ago(8);
  const endDate = ago(1);

  const totalsRes = await sc.searchanalytics.query({
    siteUrl: SITE,
    requestBody: { startDate, endDate, rowLimit: 1, dataState: "final" },
  });
  const t = totalsRes.data.rows?.[0] ?? {};

  const pagesRes = await sc.searchanalytics.query({
    siteUrl: SITE,
    requestBody: { startDate, endDate, dimensions: ["page"], rowLimit: 100, dataState: "final" },
  });
  const topPages = (pagesRes.data.rows ?? [])
    .sort((a, b) => (b.clicks ?? 0) - (a.clicks ?? 0))
    .slice(0, 25)
    .map((r) => ({
      page: r.keys?.[0] ?? "",
      clicks: r.clicks ?? 0,
      impressions: r.impressions ?? 0,
      ctr: r.ctr ?? 0,
      position: r.position ?? 0,
    }));

  const queriesRes = await sc.searchanalytics.query({
    siteUrl: SITE,
    requestBody: { startDate, endDate, dimensions: ["query"], rowLimit: 25, dataState: "final" },
  });
  const topQueries = (queriesRes.data.rows ?? [])
    .sort((a, b) => (b.clicks ?? 0) - (a.clicks ?? 0))
    .slice(0, 15)
    .map((r) => ({
      query: r.keys?.[0] ?? "",
      clicks: r.clicks ?? 0,
      impressions: r.impressions ?? 0,
      position: r.position ?? 0,
    }));

  const countriesRes = await sc.searchanalytics.query({
    siteUrl: SITE,
    requestBody: { startDate, endDate, dimensions: ["country"], rowLimit: 10, dataState: "final" },
  });
  const countries = (countriesRes.data.rows ?? []).map((r) => ({
    code: (r.keys?.[0] ?? "").toUpperCase(),
    clicks: r.clicks ?? 0,
    impressions: r.impressions ?? 0,
  }));

  // Index status of the critical hub pages
  const hubs = [
    "https://rateships.com/en",
    "https://rateships.com/en/carriers",
    "https://rateships.com/en/customs",
    "https://rateships.com/en/blog",
    "https://rateships.com/en/guide",
    "https://rateships.com/en/tools/duty-calculator",
    "https://rateships.com/en/about",
  ];
  const hubIndexStatus: Record<string, string> = {};
  for (const u of hubs) {
    try {
      const r = await sc.urlInspection.index.inspect({
        requestBody: { inspectionUrl: u, siteUrl: SITE },
      });
      hubIndexStatus[u.replace("https://rateships.com", "")] =
        r.data.inspectionResult?.indexStatusResult?.coverageState ?? "unknown";
    } catch (e: any) {
      hubIndexStatus[u.replace("https://rateships.com", "")] = `error: ${e.message?.substring(0, 40)}`;
    }
  }

  return {
    date: endDate,
    totals: {
      clicks: t.clicks ?? 0,
      impressions: t.impressions ?? 0,
      ctr: t.ctr ?? 0,
      position: t.position ?? 0,
    },
    topPages,
    topQueries,
    countries,
    hubIndexStatus,
  };
}

function loadPriorSnapshots(): Snapshot[] {
  if (!existsSync(SNAPSHOT_FILE)) return [];
  try {
    return JSON.parse(readFileSync(SNAPSHOT_FILE, "utf-8")) as Snapshot[];
  } catch {
    return [];
  }
}

function fmtPct(n: number, decimals = 2) {
  return `${(n * 100).toFixed(decimals)}%`;
}

function delta(curr: number, prev: number | undefined, type: "abs" | "pct" = "pct"): string {
  if (prev === undefined || prev === 0) return curr > 0 ? "🆕" : "—";
  const diff = curr - prev;
  if (Math.abs(diff) < (type === "pct" ? 0.005 : 0.5)) return "—";
  const pct = ((curr - prev) / prev) * 100;
  const arrow = diff > 0 ? "↑" : "↓";
  const colorEmoji = diff > 0 ? "🟢" : "🔴";
  if (type === "abs") return `${colorEmoji} ${arrow}${diff > 0 ? "+" : ""}${diff.toFixed(diff % 1 === 0 ? 0 : 1)}`;
  return `${colorEmoji} ${arrow}${diff > 0 ? "+" : ""}${pct.toFixed(1)}%`;
}

function buildDigest(curr: Snapshot, prior?: Snapshot): string {
  const lines: string[] = [];
  lines.push(`# RateShips weekly SEO digest`);
  lines.push("");
  lines.push(`**Window**: ${curr.date} (last 7 days). Compared against ${prior ? prior.date : "no prior snapshot"}.`);
  lines.push("");

  // Headline numbers
  lines.push("## Headline");
  lines.push("");
  lines.push("| Metric | Current | Δ vs prior week |");
  lines.push("|---|---:|---:|");
  lines.push(`| Clicks | ${curr.totals.clicks} | ${delta(curr.totals.clicks, prior?.totals.clicks)} |`);
  lines.push(`| Impressions | ${curr.totals.impressions.toLocaleString()} | ${delta(curr.totals.impressions, prior?.totals.impressions)} |`);
  lines.push(`| CTR | ${fmtPct(curr.totals.ctr)} | ${delta(curr.totals.ctr, prior?.totals.ctr)} |`);
  lines.push(`| Avg position | ${curr.totals.position.toFixed(1)} | ${delta(curr.totals.position, prior?.totals.position, "abs")} (lower is better) |`);
  lines.push("");

  // Hub indexing status
  lines.push("## Hub indexing status");
  lines.push("");
  for (const [path, status] of Object.entries(curr.hubIndexStatus)) {
    const priorStatus = prior?.hubIndexStatus?.[path];
    const changed = priorStatus && priorStatus !== status ? `  *(was: ${priorStatus})*` : "";
    const emoji = status === "Submitted and indexed" ? "✅" : status.startsWith("Discovered") ? "⏳" : "⚠️";
    lines.push(`- ${emoji} **${path}**: ${status}${changed}`);
  }
  lines.push("");

  // Top pages by clicks
  lines.push("## Top 10 pages by clicks");
  lines.push("");
  lines.push("| URL | Clicks | Impr | CTR | Pos |");
  lines.push("|---|---:|---:|---:|---:|");
  for (const p of curr.topPages.slice(0, 10)) {
    const u = p.page.replace("https://rateships.com", "");
    const priorRow = prior?.topPages.find((pp) => pp.page === p.page);
    const clickDelta = priorRow ? delta(p.clicks, priorRow.clicks, "abs") : "🆕";
    lines.push(`| ${u} | ${p.clicks} ${clickDelta} | ${p.impressions} | ${fmtPct(p.ctr)} | ${p.position.toFixed(1)} |`);
  }
  lines.push("");

  // Quick wins: high impressions, low CTR
  lines.push("## Quick-win candidates (high impressions, CTR <1%)");
  lines.push("");
  const quickWins = curr.topPages
    .filter((p) => p.impressions > 50 && p.ctr < 0.01 && p.position <= 20)
    .slice(0, 10);
  if (quickWins.length === 0) {
    lines.push("*No high-impression low-CTR pages this week — nice.*");
  } else {
    lines.push("| URL | Impr | CTR | Pos | Action |");
    lines.push("|---|---:|---:|---:|---|");
    for (const p of quickWins) {
      const u = p.page.replace("https://rateships.com", "");
      const action = p.position <= 10 ? "Rewrite title — pos is fine, CTR is the leak" : "Improve content + earn links to push to page 1";
      lines.push(`| ${u} | ${p.impressions} | ${fmtPct(p.ctr, 2)} | ${p.position.toFixed(1)} | ${action} |`);
    }
  }
  lines.push("");

  // Top queries
  lines.push("## Top 10 queries");
  lines.push("");
  lines.push("| Query | Clicks | Impr | Pos |");
  lines.push("|---|---:|---:|---:|");
  for (const q of curr.topQueries.slice(0, 10)) {
    lines.push(`| \`${q.query}\` | ${q.clicks} | ${q.impressions} | ${q.position.toFixed(1)} |`);
  }
  lines.push("");

  // Country distribution
  lines.push("## Top 5 countries by impressions");
  lines.push("");
  lines.push("| Country | Impr | Clicks |");
  lines.push("|---|---:|---:|");
  for (const c of curr.countries.slice(0, 5)) {
    lines.push(`| ${c.code} | ${c.impressions.toLocaleString()} | ${c.clicks} |`);
  }
  lines.push("");

  // New pages this week (in current top, not in prior)
  if (prior) {
    const priorPaths = new Set(prior.topPages.map((p) => p.page));
    const newOnes = curr.topPages.filter((p) => !priorPaths.has(p.page) && p.clicks > 0);
    if (newOnes.length > 0) {
      lines.push("## New pages getting clicks this week");
      lines.push("");
      for (const p of newOnes.slice(0, 5)) {
        const u = p.page.replace("https://rateships.com", "");
        lines.push(`- **${u}**: ${p.clicks} clicks, ${p.impressions} impr, pos ${p.position.toFixed(1)}`);
      }
      lines.push("");
    }
  }

  // Footer
  lines.push("---");
  lines.push("");
  lines.push("*Generated automatically. Re-run with `npm run seo:weekly`. Schedule weekly via cron — see `docs/cron-setup.md`.*");

  return lines.join("\n");
}

async function main() {
  console.log("=== RateShips weekly SEO digest ===\n");
  console.log("Fetching current snapshot from GSC...");
  const curr = await buildSnapshot();
  const prior = loadPriorSnapshots();
  const lastSnapshot = prior[prior.length - 1];

  console.log(`Current totals: ${curr.totals.clicks} clicks, ${curr.totals.impressions} imp\n`);

  const digest = buildDigest(curr, lastSnapshot);

  // Write timestamped digest
  if (!existsSync(REPORTS_DIR)) mkdirSync(REPORTS_DIR, { recursive: true });
  const outPath = path.join(REPORTS_DIR, `${curr.date}.md`);
  writeFileSync(outPath, digest);
  console.log(`Digest written to: ${path.relative(ROOT, outPath)}\n`);

  // Update snapshot file (keep last 12 weeks)
  prior.push(curr);
  const trimmed = prior.slice(-12);
  writeFileSync(SNAPSHOT_FILE, JSON.stringify(trimmed, null, 2));
  console.log(`Snapshot saved (history: ${trimmed.length} weeks).\n`);

  // Echo the digest
  console.log("─".repeat(70));
  console.log(digest);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
