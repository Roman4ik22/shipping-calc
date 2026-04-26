import { NextRequest, NextResponse } from "next/server";
import { countries, carriers, makeCorridorSlug } from "@/lib/data";
import { locales } from "@/lib/i18n";
import { blogPosts } from "@/data/blog-posts";
import { getAllPagesByPriority } from "@/lib/page-priority";
import type { Locale } from "@/lib/types";

const BASE_URL = "https://rateships.com";

// Always reflect "today" so Google recrawls when content/metadata changes.
// (Hardcoded LASTMOD goes stale and Google treats sitemap as cold.)
const LASTMOD = new Date().toISOString().split("T")[0];

// Static pages that must ALWAYS be in sitemap regardless of gradual rollout
const STATIC_PAGE_PATHS = [
  "", // homepage
  "/about",
  "/data-methodology",
  "/sources",
  "/team",
  "/carriers",
  "/guide",
  "/blog",
  "/platforms",
  "/tools",
  "/customs",
  "/terms",
  "/privacy",
];

function getAlwaysIncludedUrls(): string[] {
  const urls: string[] = [];
  for (const locale of locales) {
    for (const path of STATIC_PAGE_PATHS) {
      urls.push(`${BASE_URL}/${locale}${path}`);
    }
  }
  return urls;
}

// Priority-based gradual rollout start date
const START_DATE = new Date("2026-03-19");

function getWeekNumber(): number {
  const now = new Date();
  const diff = now.getTime() - START_DATE.getTime();
  if (diff < 0) return 0;
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 7)) + 1;
}

/**
 * Get URLs for the gradual sitemap based on priority ordering.
 *
 * Week 1: top 200 pages (priority 1.0-0.8)
 * Week 2: add next 500 (priority 0.7-0.5)
 * Week 3: add next 1000 (priority 0.4-0.3)
 * Week 4+: add 500/week until all pages included
 */
function getGradualUrls(): string[] {
  const week = getWeekNumber();
  if (week <= 0) return getAlwaysIncludedUrls();

  const allPages = getAllPagesByPriority();

  let maxPages: number;
  if (week === 1) {
    maxPages = 200;
  } else if (week === 2) {
    maxPages = 700; // 200 + 500
  } else if (week === 3) {
    maxPages = 1700; // 200 + 500 + 1000
  } else {
    // Week 4+: add 500 per week beyond week 3
    const extraWeeks = week - 3;
    maxPages = 1700 + extraWeeks * 500;
  }

  // Cap at total pages
  maxPages = Math.min(maxPages, allPages.length);

  const gradualUrls = allPages.slice(0, maxPages).map((p) => p.url);

  // Always include static pages regardless of gradual rollout
  const alwaysUrls = getAlwaysIncludedUrls();
  const urlSet = new Set([...alwaysUrls, ...gradualUrls]);
  return Array.from(urlSet);
}

// Full sitemap with everything (for manual scanning)
function getFullUrls(): string[] {
  return getAllPagesByPriority().map((p) => p.url);
}

function buildUrlset(urls: string[]): string {
  const entries = urls.map(
    (u) => `  <url><loc>${u}</loc><lastmod>${LASTMOD}</lastmod></url>`
  );
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>`;
}

function buildSitemapIndex(parts: string[]): string {
  const entries = parts.map(
    (p) => `  <sitemap><loc>${BASE_URL}/api/sitemap?part=${p}</loc></sitemap>`
  );
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</sitemapindex>`;
}

export async function GET(req: NextRequest) {
  const part = req.nextUrl.searchParams.get("part");
  const key = req.nextUrl.searchParams.get("key");

  // Secret full sitemap: /api/sitemap?part=full&key=rs2026map
  // Not linked anywhere, not in robots.txt, Google won't find it
  const SECRET_KEY = "rs2026map";

  let xml: string;
  if (part === "full" && key === SECRET_KEY) {
    xml = buildUrlset(getFullUrls());
  } else if (part === "gradual") {
    xml = buildUrlset(getGradualUrls());
  } else if (part === "full") {
    // Without key — return 403
    return new NextResponse("Forbidden", { status: 403 });
  } else {
    // Default sitemap.xml = gradual (submitted to Google)
    xml = buildSitemapIndex(["gradual"]);
  }

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
