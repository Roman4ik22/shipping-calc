/**
 * URL submission script for Google Indexing API and IndexNow.
 *
 * Usage:
 *   npx tsx scripts/submit-urls.ts --google 200 --indexnow 5000
 *   npx tsx scripts/submit-urls.ts --indexnow 1000
 *   npx tsx scripts/submit-urls.ts --google 50
 *
 * Environment variables:
 *   GOOGLE_SERVICE_ACCOUNT — JSON string of Google service account credentials
 *   INDEXNOW_API_URL — Base URL for IndexNow endpoint (default: http://localhost:3000)
 *   INDEXNOW_AUTH_KEY — Auth key for the IndexNow API endpoint (default: secret123)
 */

import * as fs from "fs";
import * as path from "path";

// We import from the compiled lib, but since this runs with tsx it resolves TS directly
// Using relative paths since this runs as a standalone script
const TRACKING_FILE = path.join(__dirname, "..", ".url-submissions.json");

interface SubmissionRecord {
  google: Record<string, string>; // url -> ISO date of last submission
  indexnow: Record<string, string>;
}

function loadTracking(): SubmissionRecord {
  try {
    const raw = fs.readFileSync(TRACKING_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { google: {}, indexnow: {} };
  }
}

function saveTracking(record: SubmissionRecord): void {
  fs.writeFileSync(TRACKING_FILE, JSON.stringify(record, null, 2));
}

function parseArgs(): { google: number; indexnow: number } {
  const args = process.argv.slice(2);
  let google = 0;
  let indexnow = 0;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--google" && args[i + 1]) {
      google = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === "--indexnow" && args[i + 1]) {
      indexnow = parseInt(args[i + 1], 10);
      i++;
    }
  }

  return { google, indexnow };
}

interface PagePriority {
  url: string;
  locale: string;
  type: string;
  priority: number;
  estimated_monthly_searches: number;
}

async function loadPriorities(): Promise<PagePriority[]> {
  // Dynamic import of the priority module
  const mod = await import("../src/lib/page-priority");
  return mod.getAllPagesByPriority();
}

function getUnsubmittedUrls(
  allPages: PagePriority[],
  submitted: Record<string, string>,
  count: number
): string[] {
  const unsubmitted = allPages.filter((p) => !submitted[p.url]);
  return unsubmitted.slice(0, count).map((p) => p.url);
}

// --- Google Indexing API ---

interface GoogleCredentials {
  client_email: string;
  private_key: string;
  token_uri: string;
}

async function getGoogleAccessToken(creds: GoogleCredentials): Promise<string> {
  // Build JWT
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({
      iss: creds.client_email,
      scope: "https://www.googleapis.com/auth/indexing",
      aud: creds.token_uri,
      iat: now,
      exp: now + 3600,
    })
  ).toString("base64url");

  const crypto = await import("crypto");
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(`${header}.${payload}`);
  const signature = sign.sign(creds.private_key, "base64url");

  const jwt = `${header}.${payload}.${signature}`;

  const response = await fetch(creds.token_uri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  if (!response.ok) {
    throw new Error(`Google auth failed: ${response.status} ${await response.text()}`);
  }

  const data = (await response.json()) as { access_token: string };
  return data.access_token;
}

async function submitToGoogle(urls: string[]): Promise<void> {
  const saJson = process.env.GOOGLE_SERVICE_ACCOUNT;
  if (!saJson) {
    console.error("ERROR: GOOGLE_SERVICE_ACCOUNT env var not set");
    process.exit(1);
  }

  const creds: GoogleCredentials = JSON.parse(saJson);
  console.log(`Authenticating with Google as ${creds.client_email}...`);
  const token = await getGoogleAccessToken(creds);

  const tracking = loadTracking();
  let submitted = 0;
  let failed = 0;

  // Google Indexing API has a quota of 200 URLs/day
  for (const url of urls) {
    try {
      const response = await fetch(
        "https://indexing.googleapis.com/v3/urlNotifications:publish",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url,
            type: "URL_UPDATED",
          }),
        }
      );

      if (response.ok) {
        tracking.google[url] = new Date().toISOString();
        submitted++;
        if (submitted % 10 === 0) {
          console.log(`  Google: ${submitted}/${urls.length} submitted`);
        }
      } else {
        const errText = await response.text();
        console.error(`  FAIL [${response.status}]: ${url} — ${errText}`);
        failed++;

        // If rate limited, stop
        if (response.status === 429) {
          console.error("  Rate limited by Google. Stopping.");
          break;
        }
      }

      // Small delay to avoid rate limits
      await new Promise((r) => setTimeout(r, 100));
    } catch (err) {
      console.error(`  ERROR: ${url} — ${err}`);
      failed++;
    }
  }

  saveTracking(tracking);
  console.log(`Google: ${submitted} submitted, ${failed} failed`);
}

// --- IndexNow ---

async function submitToIndexNow(urls: string[], count: number): Promise<void> {
  const baseUrl = process.env.INDEXNOW_API_URL || "http://localhost:3000";
  const authKey = process.env.INDEXNOW_AUTH_KEY || "secret123";

  console.log(`Submitting ${urls.length} URLs to IndexNow via ${baseUrl}...`);

  try {
    const response = await fetch(`${baseUrl}/api/indexnow?key=${authKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ count }),
    });

    const result = await response.json();

    if (response.ok) {
      // Track all submitted URLs
      const tracking = loadTracking();
      for (const url of urls) {
        tracking.indexnow[url] = new Date().toISOString();
      }
      saveTracking(tracking);

      console.log(`IndexNow: ${result.submitted} URLs submitted`);
      console.log(`  Batches: ${JSON.stringify(result.batches)}`);
      console.log(`  Priority range: ${result.top_priority} - ${result.lowest_priority}`);
    } else {
      console.error(`IndexNow failed: ${response.status}`, result);
    }
  } catch (err) {
    console.error(`IndexNow error: ${err}`);
  }
}

// --- Main ---

async function main() {
  const { google, indexnow } = parseArgs();

  if (google === 0 && indexnow === 0) {
    console.log("Usage: npx tsx scripts/submit-urls.ts --google 200 --indexnow 5000");
    console.log("");
    console.log("Options:");
    console.log("  --google N    Submit top N unsubmitted URLs to Google Indexing API");
    console.log("  --indexnow N  Submit top N URLs to IndexNow");
    console.log("");
    console.log("Environment variables:");
    console.log("  GOOGLE_SERVICE_ACCOUNT  JSON string of service account credentials");
    console.log("  INDEXNOW_API_URL        Base URL (default: http://localhost:3000)");
    console.log("  INDEXNOW_AUTH_KEY       Auth key (default: secret123)");
    process.exit(0);
  }

  console.log("Loading page priorities...");
  const allPages = await loadPriorities();
  console.log(`Total pages: ${allPages.length}`);

  const tracking = loadTracking();

  if (google > 0) {
    const urls = getUnsubmittedUrls(allPages, tracking.google, google);
    if (urls.length === 0) {
      console.log("Google: All URLs already submitted!");
    } else {
      console.log(`Google: ${urls.length} new URLs to submit (of ${google} requested)`);
      await submitToGoogle(urls);
    }
  }

  if (indexnow > 0) {
    const urls = getUnsubmittedUrls(allPages, tracking.indexnow, indexnow);
    if (urls.length === 0) {
      console.log("IndexNow: All URLs already submitted!");
    } else {
      console.log(`IndexNow: ${urls.length} new URLs to submit`);
      await submitToIndexNow(urls, indexnow);
    }
  }

  // Summary
  const updatedTracking = loadTracking();
  console.log("");
  console.log("=== Submission Summary ===");
  console.log(`Google: ${Object.keys(updatedTracking.google).length} total URLs submitted`);
  console.log(`IndexNow: ${Object.keys(updatedTracking.indexnow).length} total URLs submitted`);
  console.log(`Tracking file: ${TRACKING_FILE}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
