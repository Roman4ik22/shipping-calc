/**
 * Google Indexing API — push problem URLs for re-crawl.
 *
 * Different from IndexNow (which serves Bing/Yandex). Google has its own
 * Indexing API at https://indexing.googleapis.com/v3/urlNotifications:publish
 *
 * Setup:
 *  1. Enable "Indexing API" in Google Cloud Console for project rateships-new
 *     (https://console.cloud.google.com/apis/library/indexing.googleapis.com)
 *  2. The service account rateships@rateships-new.iam.gserviceaccount.com must
 *     be added as "Owner" (not just user) in GSC for rateships.com property
 *  3. Run: npx tsx scripts/google-indexing-api-submit.ts
 *
 * Quota: 200 publish requests/day per project (default), 600/day for verified.
 *
 * Note on official policy: Google says the Indexing API is officially for
 * JobPosting and BroadcastEvent only. In practice it triggers re-crawl for
 * any URL submitted, and many SEO ops use it for general re-indexing. Use
 * judiciously — don't spam.
 */
import { google } from "googleapis";
import { readFileSync } from "fs";
import path from "path";

const CREDENTIALS_PATH = path.join(__dirname, "gsc-credentials.json");

// URLs identified as problem cases in docs/reports/gsc-errors-2026-05-05.md.
// Hubs first (highest authority), then deep pages.
const PROBLEM_URLS: string[] = [
  // Top-priority hubs (Crawled - currently not indexed)
  "https://rateships.com/en",
  "https://rateships.com/ru",
  "https://rateships.com/en/customs",   // Unknown to Google
  "https://rateships.com/ru/customs",   // Discovered, not crawled
  "https://rateships.com/en/blog",
  "https://rateships.com/en/guide",
  "https://rateships.com/en/tools",
  "https://rateships.com/en/platforms",
  "https://rateships.com/ru/carriers",
  "https://rateships.com/ru/blog",
  "https://rateships.com/ru/about",

  // Top corridor pages (real organic interest, currently not indexed)
  "https://rateships.com/en/shipping/united-states-to-united-kingdom",
  "https://rateships.com/en/shipping/china-to-united-states",
  "https://rateships.com/en/shipping/germany-to-france",
  "https://rateships.com/en/shipping/united-states-to-germany",
  "https://rateships.com/en/shipping/united-states-to-japan",

  // Blog flagship — needs re-crawl after canonical fix
  "https://rateships.com/en/blog/cheapest-way-to-ship-internationally",
  "https://rateships.com/en/blog/dhl-vs-fedex-vs-ups-comparison",
  "https://rateships.com/en/blog/how-customs-duties-work",
  "https://rateships.com/en/blog/how-to-track-international-packages",
];

interface PublishResponse {
  urlNotificationMetadata?: {
    url: string;
    latestUpdate?: { url: string; type: string; notifyTime: string };
  };
}

async function publishOne(
  indexing: ReturnType<typeof google.indexing>,
  url: string
): Promise<{ url: string; ok: boolean; error?: string; notifyTime?: string }> {
  try {
    const res = (await indexing.urlNotifications.publish({
      requestBody: { url, type: "URL_UPDATED" },
    })) as { data: PublishResponse };
    return {
      url,
      ok: true,
      notifyTime: res.data.urlNotificationMetadata?.latestUpdate?.notifyTime,
    };
  } catch (e) {
    return { url, ok: false, error: (e as Error).message };
  }
}

async function main() {
  const credentials = JSON.parse(readFileSync(CREDENTIALS_PATH, "utf-8"));
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/indexing"],
  });
  const indexing = google.indexing({ version: "v3", auth });

  console.log(`Submitting ${PROBLEM_URLS.length} URLs to Google Indexing API…\n`);
  console.log(`Service account: ${credentials.client_email}\n`);

  const results = [];
  for (const url of PROBLEM_URLS) {
    const r = await publishOne(indexing, url);
    if (r.ok) {
      console.log(`  ✅ ${url}  (notified ${r.notifyTime ?? "?"})`);
    } else {
      const short = r.error ? r.error.slice(0, 100).replace(/\n/g, " ") : "unknown";
      console.log(`  ❌ ${url}\n     ${short}`);
    }
    results.push(r);
    // Rate limit ourselves — be polite. Google quota is 200/day default.
    await new Promise((r) => setTimeout(r, 500));
  }

  const ok = results.filter((r) => r.ok).length;
  const fail = results.length - ok;
  console.log(`\n=== Summary ===`);
  console.log(`✅ Submitted: ${ok}`);
  console.log(`❌ Failed:    ${fail}`);

  if (fail > 0) {
    console.log(`\nCommon causes of failure:`);
    console.log(`  - "Indexing API has not been used in project rateships-new" → enable at`);
    console.log(`    https://console.cloud.google.com/apis/library/indexing.googleapis.com?project=rateships-new`);
    console.log(`  - "Permission denied. Failed to verify the URL ownership." → service account needs to be`);
    console.log(`    added as "Owner" (not just user) in GSC for rateships.com property.`);
    console.log(`    https://search.google.com/search-console/users?resource_id=sc-domain%3Arateships.com`);
    console.log(`  - "Quota exceeded" → wait 24h or request quota increase.`);
  }
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
