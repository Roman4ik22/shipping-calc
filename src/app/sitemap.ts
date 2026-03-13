import type { MetadataRoute } from "next";
import { countries, carriers, makeCorridorSlug } from "@/lib/data";
import { locales } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://shipworldwide.com";
const URLS_PER_SITEMAP = 5000;

// Pre-compute all corridor pairs for both locales
function getAllCorridorEntries(): { url: string; priority: number }[] {
  const entries: { url: string; priority: number }[] = [];
  for (const locale of locales) {
    const loc = locale as Locale;
    for (const from of countries) {
      for (const to of countries) {
        if (from.code === to.code) continue;
        entries.push({
          url: `${BASE_URL}/${locale}/shipping/${makeCorridorSlug(from, to, loc)}`,
          priority: 0.5,
        });
      }
    }
  }
  return entries;
}

function getStaticEntries(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    // Homepage
    entries.push({
      url: `${BASE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    });

    // Carriers index
    entries.push({
      url: `${BASE_URL}/${locale}/carriers`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    });

    // Individual carrier pages
    for (const carrier of carriers) {
      entries.push({
        url: `${BASE_URL}/${locale}/carriers/${carrier.id}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }

    // Country hub pages
    for (const country of countries) {
      entries.push({
        url: `${BASE_URL}/${locale}/shipping/from/${country.slug_en}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
      entries.push({
        url: `${BASE_URL}/${locale}/shipping/to/${country.slug_en}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  return entries;
}

// Total URLs: static pages + all corridors
// Static: ~(2 + 2 + 218 + 852) = ~1074 per locale x 2 = ~2148
// Corridors: 213 * 212 * 2 = ~90,312
// Total: ~92,460 → need ~19 sitemaps
const staticEntries = getStaticEntries();
const corridorEntries = getAllCorridorEntries();
const totalUrls = staticEntries.length + corridorEntries.length;
const totalSitemaps = Math.ceil(totalUrls / URLS_PER_SITEMAP);

export async function generateSitemaps() {
  return Array.from({ length: totalSitemaps }, (_, i) => ({ id: i }));
}

export default function sitemap({ id }: { id: number }): MetadataRoute.Sitemap {
  const start = id * URLS_PER_SITEMAP;
  const end = start + URLS_PER_SITEMAP;

  // First sitemap(s) contain static entries, rest are corridors
  const allEntries = [
    ...staticEntries,
    ...corridorEntries.map((e) => ({
      url: e.url,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: e.priority,
    })),
  ];

  return allEntries.slice(start, end);
}
