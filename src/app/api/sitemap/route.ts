import { NextRequest, NextResponse } from "next/server";
import { countries, carriers, makeCorridorSlug } from "@/lib/data";
import { locales } from "@/lib/i18n";
import { blogPosts } from "@/data/blog-posts";
import type { Locale } from "@/lib/types";

const BASE_URL = "https://rateships.com";

function getStaticUrls(): string[] {
  const urls: string[] = [];
  for (const locale of locales) {
    urls.push(`${BASE_URL}/${locale}`);
    urls.push(`${BASE_URL}/${locale}/about`);
    urls.push(`${BASE_URL}/${locale}/carriers`);
    urls.push(`${BASE_URL}/${locale}/guide`);
    urls.push(`${BASE_URL}/${locale}/blog`);
    for (const post of blogPosts) {
      urls.push(`${BASE_URL}/${locale}/blog/${post.id}`);
    }
    for (const carrier of carriers) {
      urls.push(`${BASE_URL}/${locale}/carriers/${carrier.id}`);
    }
    for (const country of countries) {
      urls.push(`${BASE_URL}/${locale}/guide/${country.slug_en}`);
      urls.push(`${BASE_URL}/${locale}/shipping/from/${country.slug_en}`);
      urls.push(`${BASE_URL}/${locale}/shipping/to/${country.slug_en}`);
    }
  }
  return urls;
}

function getCorridorUrls(): string[] {
  const urls: string[] = [];
  const popularCodes = [
    "US", "GB", "DE", "FR", "CN", "JP", "KR", "AU", "CA", "RU",
    "IN", "AE", "SG", "TH", "MY", "BR", "IT", "ES", "NL", "TR",
  ];
  const popular = countries.filter((c) => popularCodes.includes(c.code));
  for (const locale of locales) {
    const loc = locale as Locale;
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

function buildSitemapIndex(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${BASE_URL}/api/sitemap?part=pages</loc></sitemap>
  <sitemap><loc>${BASE_URL}/api/sitemap?part=corridors</loc></sitemap>
</sitemapindex>`;
}

export async function GET(req: NextRequest) {
  const part = req.nextUrl.searchParams.get("part");

  let xml: string;
  if (part === "pages") {
    xml = buildUrlset(getStaticUrls());
  } else if (part === "corridors") {
    xml = buildUrlset(getCorridorUrls());
  } else {
    xml = buildSitemapIndex();
  }

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
