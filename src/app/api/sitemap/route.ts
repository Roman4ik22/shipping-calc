import { NextResponse } from "next/server";
import { countries, carriers, makeCorridorSlug } from "@/lib/data";
import { locales } from "@/lib/i18n";
import { blogPosts } from "@/data/blog-posts";
import type { Locale } from "@/lib/types";

const BASE_URL = "https://rateships.com";

function buildSitemapXml(): string {
  const urls: string[] = [];

  function addUrl(loc: string, priority: string, changefreq: string) {
    urls.push(
      `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
    );
  }

  for (const locale of locales) {
    const loc = locale as Locale;

    // Homepage
    addUrl(`${BASE_URL}/${locale}`, "1.0", "weekly");

    // Static pages
    addUrl(`${BASE_URL}/${locale}/about`, "0.5", "monthly");
    addUrl(`${BASE_URL}/${locale}/carriers`, "0.8", "monthly");
    addUrl(`${BASE_URL}/${locale}/guide`, "0.8", "monthly");
    addUrl(`${BASE_URL}/${locale}/blog`, "0.7", "weekly");

    // Blog posts
    for (const post of blogPosts) {
      addUrl(`${BASE_URL}/${locale}/blog/${post.id}`, "0.6", "monthly");
    }

    // Carrier pages
    for (const carrier of carriers) {
      addUrl(`${BASE_URL}/${locale}/carriers/${carrier.id}`, "0.6", "monthly");
    }

    // Country guide pages
    for (const country of countries) {
      addUrl(`${BASE_URL}/${locale}/guide/${country.slug_en}`, "0.7", "monthly");
    }

    // Country hub pages (from / to)
    for (const country of countries) {
      addUrl(`${BASE_URL}/${locale}/shipping/from/${country.slug_en}`, "0.7", "monthly");
      addUrl(`${BASE_URL}/${locale}/shipping/to/${country.slug_en}`, "0.7", "monthly");
    }

    // Popular corridors (top 20 countries)
    const popularCodes = [
      "US", "GB", "DE", "FR", "CN", "JP", "KR", "AU", "CA", "RU",
      "IN", "AE", "SG", "TH", "MY", "BR", "IT", "ES", "NL", "TR",
    ];
    const popularCountries = countries.filter((c) => popularCodes.includes(c.code));
    for (const from of popularCountries) {
      for (const to of popularCountries) {
        if (from.code === to.code) continue;
        addUrl(
          `${BASE_URL}/${locale}/shipping/${makeCorridorSlug(from, to, loc)}`,
          "0.5",
          "monthly"
        );
      }
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;
}

export async function GET() {
  const xml = buildSitemapXml();
  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
