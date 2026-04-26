/**
 * One-off: submit hand-picked priority URLs to Google Indexing API.
 * Targets pages that just had metadata rewritten + the new /customs hub
 * so Google reindexes them quickly with the new titles/descriptions.
 *
 * Usage: GOOGLE_SERVICE_ACCOUNT="$(cat ~/Downloads/rateships-new-b69487f1ee45.json)" npx tsx scripts/submit-priority-urls.ts
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const TRACKING = path.join(__dirname, "..", ".url-submissions.json");
const BASE = "https://rateships.com";

// 1. Hub pages — must reindex after creation/internal-link changes
const hubs = [
  "/en/customs", "/ru/customs", "/es/customs", "/de/customs", "/fr/customs",
  "/pt/customs", "/zh/customs", "/ja/customs", "/ko/customs", "/ar/customs",
  "/tr/customs", "/it/customs",
  "/en/blog", "/en/carriers", "/en/guide", "/en", "/en/about",
  "/en/tools/duty-calculator", "/en/tools/delivery-estimator",
  "/en/data-methodology", "/en/sources", "/en/team", "/en/updates",
];

// 2. Top low-CTR customs pages (rewritten title/description) — should jump on reindex
const customsTopImp = [
  "ethiopia", "kazakhstan", "qatar", "cyprus", "panama", "malta",
  "tanzania", "sri-lanka", "south-sudan", "brunei", "cayman-islands",
  "united-states", "united-kingdom", "germany", "france", "japan",
  "south-korea", "china", "australia", "canada",
  "uzbekistan", "uzbekistan", "russia", "ukraine", "turkey",
  "italy", "spain", "netherlands", "belgium",
  "saudi-arabia", "united-arab-emirates", "egypt",
  "brazil", "argentina", "mexico", "colombia", "chile",
  "india", "pakistan", "bangladesh",
  "south-africa", "kenya", "nigeria",
];

// 3. Top low-CTR carriers (rewritten metadata)
const carriersTopImp = [
  "ems", "usps", "dhl-express", "fedex", "ups", "royal-mail",
  "j-and-t-express", "japan-post-yu-pack-ems", "pos-malaysia",
  "asendia", "evri-formerly-hermes", "japan-post", "china-post",
  "australia-post", "canada-post", "deutsche-post", "korea-post",
  "singpost", "thailand-post", "india-post", "blue-dart-dhl-group",
  "delhivery", "dpd", "tnt", "aramex", "sf-express", "cainiao",
];

// 4. Highest-impression corridors with rewritten metadata
const topCorridors = [
  "china-to-united-kingdom",
  "ireland-to-france",
  "australia-to-thailand",
  "united-kingdom-to-malta",
  "ireland-to-burkina-faso",
  "thailand-to-switzerland",
  "cambodia-to-united-kingdom",
  "south-africa-to-zambia",
  "germany-to-albania",
  "south-korea-to-singapore",
];

const urls = [
  ...hubs.map((p) => `${BASE}${p}`),
  ...customsTopImp.map((c) => `${BASE}/en/customs/${c}`),
  ...carriersTopImp.map((c) => `${BASE}/en/carriers/${c}`),
  ...topCorridors.map((c) => `${BASE}/en/shipping/${c}`),
];

// Dedupe
const uniq = Array.from(new Set(urls));
console.log(`Total unique URLs to submit: ${uniq.length}`);

interface SACreds { client_email: string; private_key: string; token_uri: string; }

async function getToken(creds: SACreds): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({
    iss: creds.client_email,
    scope: "https://www.googleapis.com/auth/indexing",
    aud: creds.token_uri,
    iat: now, exp: now + 3600,
  })).toString("base64url");
  const crypto = await import("crypto");
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(`${header}.${payload}`);
  const signature = sign.sign(creds.private_key, "base64url");
  const jwt = `${header}.${payload}.${signature}`;
  const r = await fetch(creds.token_uri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });
  if (!r.ok) throw new Error(`auth ${r.status}: ${await r.text()}`);
  return ((await r.json()) as { access_token: string }).access_token;
}

async function main() {
  const saJson = process.env.GOOGLE_SERVICE_ACCOUNT;
  if (!saJson) {
    console.error("ERROR: GOOGLE_SERVICE_ACCOUNT env var not set");
    process.exit(1);
  }
  const creds = JSON.parse(saJson) as SACreds;
  console.log(`Auth as ${creds.client_email}`);
  const token = await getToken(creds);

  let tracking: { google: Record<string, string>; indexnow: Record<string, string> };
  try { tracking = JSON.parse(readFileSync(TRACKING, "utf-8")); }
  catch { tracking = { google: {}, indexnow: {} }; }

  const toSubmit = uniq.filter((u) => !tracking.google[u]);
  console.log(`Skipping ${uniq.length - toSubmit.length} already submitted; new: ${toSubmit.length}`);

  let ok = 0, fail = 0;
  for (let i = 0; i < toSubmit.length; i++) {
    const url = toSubmit[i];
    try {
      const r = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ url, type: "URL_UPDATED" }),
      });
      if (r.ok) {
        tracking.google[url] = new Date().toISOString();
        ok++;
      } else {
        const text = await r.text();
        if (r.status === 429) {
          console.log(`  Hit quota limit at ${i}/${toSubmit.length}: ${text.substring(0, 100)}`);
          break;
        }
        fail++;
        if (fail <= 3) console.log(`  ${url} → ${r.status} ${text.substring(0, 80)}`);
      }
    } catch (e: any) {
      fail++;
    }
    if ((i + 1) % 20 === 0) console.log(`  ${i + 1}/${toSubmit.length}: ${ok} ok, ${fail} fail`);
  }

  writeFileSync(TRACKING, JSON.stringify(tracking, null, 2));
  console.log(`\nDone: ${ok} submitted, ${fail} failed`);
}

main().catch((e) => { console.error(e); process.exit(1); });
