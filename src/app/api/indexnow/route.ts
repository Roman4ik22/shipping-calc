import { NextRequest, NextResponse } from "next/server";
import { getTopPages } from "@/lib/page-priority";

const INDEXNOW_KEY = "382c6560e829da9c4e0fd0b8864481b3";
const HOST = "rateships.com";
const AUTH_KEY = process.env.INDEXNOW_AUTH_KEY || "secret123";

// IndexNow API accepts max 10,000 URLs per request
const MAX_URLS_PER_BATCH = 10000;

export async function POST(req: NextRequest) {
  // Auth check
  const key = req.nextUrl.searchParams.get("key");
  if (key !== AUTH_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let count = 1000;
  try {
    const body = await req.json();
    if (body.count && typeof body.count === "number") {
      count = Math.min(body.count, 50000); // Safety cap
    }
  } catch {
    // Use default count
  }

  const pages = getTopPages(count);
  const urls = pages.map((p) => p.url);

  if (urls.length === 0) {
    return NextResponse.json({ error: "No URLs to submit" }, { status: 400 });
  }

  // Submit in batches of 10,000
  const results: { batch: number; status: number; urls_count: number }[] = [];

  for (let i = 0; i < urls.length; i += MAX_URLS_PER_BATCH) {
    const batch = urls.slice(i, i + MAX_URLS_PER_BATCH);
    const batchNum = Math.floor(i / MAX_URLS_PER_BATCH) + 1;

    try {
      const response = await fetch("https://api.indexnow.org/IndexNow", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          host: HOST,
          key: INDEXNOW_KEY,
          keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
          urlList: batch,
        }),
      });

      results.push({
        batch: batchNum,
        status: response.status,
        urls_count: batch.length,
      });
    } catch (err) {
      results.push({
        batch: batchNum,
        status: 500,
        urls_count: batch.length,
      });
    }
  }

  return NextResponse.json({
    submitted: urls.length,
    batches: results,
    top_priority: pages[0]?.priority,
    lowest_priority: pages[pages.length - 1]?.priority,
  });
}
