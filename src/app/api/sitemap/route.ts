import { NextRequest, NextResponse } from "next/server";
import { countries, carriers, makeCorridorSlug } from "@/lib/data";
import { locales } from "@/lib/i18n";
import { blogPosts } from "@/data/blog-posts";
import type { Locale } from "@/lib/types";

const BASE_URL = "https://rateships.com";

// Site launched: 2026-03-18
const LAUNCH_DATE = new Date("2026-03-18");
const NOW = new Date();
const DAYS_SINCE_LAUNCH = Math.floor((NOW.getTime() - LAUNCH_DATE.getTime()) / (1000 * 60 * 60 * 24));
const WEEKS_SINCE_LAUNCH = Math.floor(DAYS_SINCE_LAUNCH / 7);

// Priority tiers for gradual indexing
// Tier 0 (Week 0+): Homepages, about, blog, carriers index, guide index — ~400 pages
// Tier 1 (Week 1+): Blog posts, top 10 carrier pages, top 20 country guides — ~600 pages
// Tier 2 (Week 2+): All carrier pages, all country guides — ~5000 pages
// Tier 3 (Week 3+): Country hub pages (from/to) — ~5000 pages
// Tier 4 (Week 4+): Top 50 corridors (en only first) — ~50 pages
// Tier 5 (Week 5+): Top 50 corridors all locales — ~600 pages
// Tier 6 (Week 6+): Top 100 corridors all locales — ~1200 pages
// Tier 7 (Week 8+): Top 200 corridors all locales — ~2400 pages
// Tier 8 (Week 12+): All 20x19 corridors all locales — ~4560 pages
// Full sitemap always available at ?part=full for manual scanning

const primaryLocales = ["en", "ru"];
const allLocales = locales;

const tier0Codes = ["US", "GB", "DE", "CN", "JP", "AU", "CA", "RU", "FR", "KR"];
const tier1Codes = [...tier0Codes, "IN", "AE", "SG", "TH", "MY", "BR", "IT", "ES", "NL", "TR"];
const tier2Codes = tier1Codes;

// Top corridors by search volume (prioritized)
const topCorridors = [
  ["US", "GB"], ["US", "DE"], ["CN", "US"], ["US", "CA"], ["US", "AU"],
  ["US", "JP"], ["GB", "DE"], ["CN", "GB"], ["US", "FR"], ["US", "KR"],
  ["DE", "FR"], ["CN", "JP"], ["US", "IN"], ["RU", "DE"], ["US", "BR"],
  ["AE", "IN"], ["US", "IT"], ["GB", "AU"], ["CN", "AU"], ["US", "NL"],
  ["MY", "SG"], ["TH", "JP"], ["CN", "KR"], ["DE", "US"], ["GB", "US"],
  ["JP", "US"], ["AU", "US"], ["CA", "US"], ["IN", "US"], ["KR", "US"],
  ["US", "MX"], ["CN", "DE"], ["CN", "FR"], ["RU", "CN"], ["TR", "DE"],
  ["US", "SG"], ["US", "AE"], ["GB", "FR"], ["DE", "IT"], ["FR", "US"],
  ["JP", "CN"], ["BR", "US"], ["IN", "AE"], ["US", "ES"], ["CN", "SG"],
  ["DE", "GB"], ["IT", "US"], ["ES", "US"], ["NL", "US"], ["AU", "GB"],
];

function getGradualUrls(): string[] {
  const urls: string[] = [];

  // --- TIER 0: Always (core pages, primary locales) ---
  for (const locale of primaryLocales) {
    urls.push(`${BASE_URL}/${locale}`);
    urls.push(`${BASE_URL}/${locale}/about`);
    urls.push(`${BASE_URL}/${locale}/carriers`);
    urls.push(`${BASE_URL}/${locale}/guide`);
    urls.push(`${BASE_URL}/${locale}/blog`);
    urls.push(`${BASE_URL}/${locale}/platforms`);
  }
  // Core pages for all locales
  for (const locale of allLocales) {
    if (!primaryLocales.includes(locale)) {
      urls.push(`${BASE_URL}/${locale}`);
    }
  }

  // --- TIER 1 (Week 1+): Blog + top carriers + top guides ---
  if (WEEKS_SINCE_LAUNCH >= 1) {
    for (const locale of primaryLocales) {
      for (const post of blogPosts) {
        urls.push(`${BASE_URL}/${locale}/blog/${post.id}`);
      }
      for (const carrier of carriers.slice(0, 20)) {
        urls.push(`${BASE_URL}/${locale}/carriers/${carrier.id}`);
      }
      const topCountries = countries.filter((c) => tier0Codes.includes(c.code));
      for (const c of topCountries) {
        urls.push(`${BASE_URL}/${locale}/guide/${c.slug_en}`);
      }
    }
  }

  // --- TIER 2 (Week 2+): All carriers + all guides (primary locales) ---
  if (WEEKS_SINCE_LAUNCH >= 2) {
    for (const locale of primaryLocales) {
      for (const carrier of carriers.slice(20)) {
        urls.push(`${BASE_URL}/${locale}/carriers/${carrier.id}`);
      }
      const remaining = countries.filter((c) => !tier0Codes.includes(c.code));
      for (const c of remaining) {
        urls.push(`${BASE_URL}/${locale}/guide/${c.slug_en}`);
      }
    }
    // Blog for all locales
    for (const locale of allLocales) {
      if (!primaryLocales.includes(locale)) {
        for (const post of blogPosts.slice(0, 10)) {
          urls.push(`${BASE_URL}/${locale}/blog/${post.id}`);
        }
      }
    }
  }

  // --- TIER 3 (Week 3+): Country hub pages ---
  if (WEEKS_SINCE_LAUNCH >= 3) {
    const hubCountries = countries.filter((c) => tier1Codes.includes(c.code));
    for (const locale of primaryLocales) {
      for (const c of hubCountries) {
        urls.push(`${BASE_URL}/${locale}/shipping/from/${c.slug_en}`);
        urls.push(`${BASE_URL}/${locale}/shipping/to/${c.slug_en}`);
      }
    }
  }

  // --- TIER 4 (Week 4+): Top 50 corridors (en only) ---
  if (WEEKS_SINCE_LAUNCH >= 4) {
    for (const [from, to] of topCorridors) {
      const origin = countries.find((c) => c.code === from);
      const dest = countries.find((c) => c.code === to);
      if (origin && dest) {
        urls.push(`${BASE_URL}/en/shipping/${makeCorridorSlug(origin, dest, "en")}`);
      }
    }
  }

  // --- TIER 5 (Week 5+): Top 50 corridors all locales ---
  if (WEEKS_SINCE_LAUNCH >= 5) {
    for (const locale of allLocales) {
      if (locale === "en") continue;
      const loc = locale as Locale;
      for (const [from, to] of topCorridors) {
        const origin = countries.find((c) => c.code === from);
        const dest = countries.find((c) => c.code === to);
        if (origin && dest) {
          urls.push(`${BASE_URL}/${locale}/shipping/${makeCorridorSlug(origin, dest, loc)}`);
        }
      }
    }
  }

  // --- TIER 6 (Week 6+): All carriers/guides all locales ---
  if (WEEKS_SINCE_LAUNCH >= 6) {
    for (const locale of allLocales) {
      if (primaryLocales.includes(locale)) continue;
      for (const carrier of carriers) {
        urls.push(`${BASE_URL}/${locale}/carriers/${carrier.id}`);
      }
      for (const c of countries) {
        urls.push(`${BASE_URL}/${locale}/guide/${c.slug_en}`);
      }
    }
  }

  // --- TIER 7 (Week 8+): All country hubs all locales + more corridors ---
  if (WEEKS_SINCE_LAUNCH >= 8) {
    for (const locale of allLocales) {
      if (primaryLocales.includes(locale)) continue;
      const hubCountries = countries.filter((c) => tier1Codes.includes(c.code));
      for (const c of hubCountries) {
        urls.push(`${BASE_URL}/${locale}/shipping/from/${c.slug_en}`);
        urls.push(`${BASE_URL}/${locale}/shipping/to/${c.slug_en}`);
      }
    }
    // All remaining country hubs for primary locales
    for (const locale of primaryLocales) {
      const remaining = countries.filter((c) => !tier1Codes.includes(c.code));
      for (const c of remaining) {
        urls.push(`${BASE_URL}/${locale}/shipping/from/${c.slug_en}`);
        urls.push(`${BASE_URL}/${locale}/shipping/to/${c.slug_en}`);
      }
    }
  }

  // --- TIER 8 (Week 12+): Full 20x19 corridors all locales ---
  if (WEEKS_SINCE_LAUNCH >= 12) {
    const popular = countries.filter((c) => tier1Codes.includes(c.code));
    for (const locale of allLocales) {
      const loc = locale as Locale;
      for (const from of popular) {
        for (const to of popular) {
          if (from.code === to.code) continue;
          const url = `${BASE_URL}/${locale}/shipping/${makeCorridorSlug(from, to, loc)}`;
          if (!urls.includes(url)) urls.push(url);
        }
      }
    }
  }

  return [...new Set(urls)]; // deduplicate
}

// Full sitemap with everything (for manual scanning)
function getFullUrls(): string[] {
  const urls: string[] = [];
  for (const locale of allLocales) {
    const loc = locale as Locale;
    urls.push(`${BASE_URL}/${locale}`);
    urls.push(`${BASE_URL}/${locale}/about`);
    urls.push(`${BASE_URL}/${locale}/carriers`);
    urls.push(`${BASE_URL}/${locale}/guide`);
    urls.push(`${BASE_URL}/${locale}/blog`);
    urls.push(`${BASE_URL}/${locale}/platforms`);
    for (const post of blogPosts) {
      urls.push(`${BASE_URL}/${locale}/blog/${post.id}`);
    }
    for (const carrier of carriers) {
      urls.push(`${BASE_URL}/${locale}/carriers/${carrier.id}`);
    }
    for (const c of countries) {
      urls.push(`${BASE_URL}/${locale}/guide/${c.slug_en}`);
      urls.push(`${BASE_URL}/${locale}/shipping/from/${c.slug_en}`);
      urls.push(`${BASE_URL}/${locale}/shipping/to/${c.slug_en}`);
    }
    const popular = countries.filter((c) => tier1Codes.includes(c.code));
    for (const from of popular) {
      for (const to of popular) {
        if (from.code === to.code) continue;
        urls.push(`${BASE_URL}/${locale}/shipping/${makeCorridorSlug(from, to, loc)}`);
      }
    }
  }
  return urls;
}

function buildUrlset(urls: string[]): string {
  const entries = urls.map(
    (u) => `  <url><loc>${u}</loc></url>`
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

  let xml: string;
  if (part === "gradual") {
    xml = buildUrlset(getGradualUrls());
  } else if (part === "full") {
    xml = buildUrlset(getFullUrls());
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
