/**
 * Page priority scoring system for URL submission and sitemap ordering.
 * Priority = estimated_search_volume / competition_score (normalized to 0.01-1.0)
 */

import { countries, carriers, makeCorridorSlug } from "@/lib/data";
import { locales } from "@/lib/i18n";
import { getCorridorLocales } from "@/lib/country-locale";
import { blogPosts } from "@/data/blog-posts";
import type { Country, Locale } from "@/lib/types";

export interface PagePriority {
  url: string;
  locale: string;
  type: "corridor" | "guide" | "carrier" | "from" | "to" | "blog" | "static";
  priority: number; // 0.01 to 1.0
  estimated_monthly_searches: number;
}

const BASE_URL = "https://rateships.com";

// GDP-ranked country tiers
const TOP_10_GDP = ["US", "CN", "JP", "DE", "GB", "IN", "FR", "BR", "IT", "CA"];
const TOP_20_GDP = [
  ...TOP_10_GDP,
  "RU", "KR", "AU", "ES", "MX", "ID", "NL", "SA", "TR", "CH",
];
const TOP_50_GDP = [
  ...TOP_20_GDP,
  "PL", "SE", "BE", "TH", "IE", "IL", "AT", "NO", "AE", "NG",
  "SG", "MY", "PH", "DK", "HK", "ZA", "CL", "FI", "EG", "CZ",
  "VN", "PT", "RO", "NZ", "PK", "GR", "KZ", "PE", "CO", "HU",
];

// Top 10 carriers by global volume
const TOP_10_CARRIERS = [
  "dhl-express", "fedex", "ups", "usps", "ems",
  "royal-mail", "china-post", "japan-post", "aramex", "sf-express",
];

// Locale for a country's native language
const COUNTRY_NATIVE_LOCALE: Record<string, Locale> = {
  US: "en", CN: "zh", JP: "ja", DE: "de", GB: "en", IN: "en",
  FR: "fr", BR: "pt", IT: "it", CA: "en", RU: "ru", KR: "ko",
  AU: "en", ES: "es", MX: "es", ID: "en", NL: "en", SA: "ar",
  TR: "tr", CH: "de",
};

function isTop10(code: string): boolean {
  return TOP_10_GDP.includes(code);
}

function isTop20(code: string): boolean {
  return TOP_20_GDP.includes(code);
}

function isTop50(code: string): boolean {
  return TOP_50_GDP.includes(code);
}

function getNativeLocale(code: string): Locale | null {
  return COUNTRY_NATIVE_LOCALE[code] ?? null;
}

// Estimated monthly search volume based on priority tier
function estimateSearches(priority: number): number {
  if (priority >= 1.0) return 5000;
  if (priority >= 0.8) return 3000;
  if (priority >= 0.7) return 2000;
  if (priority >= 0.6) return 1500;
  if (priority >= 0.5) return 1000;
  if (priority >= 0.4) return 800;
  if (priority >= 0.35) return 600;
  if (priority >= 0.3) return 400;
  if (priority >= 0.2) return 200;
  if (priority >= 0.15) return 100;
  if (priority >= 0.1) return 50;
  if (priority >= 0.05) return 20;
  return 10;
}

function getCorridorPriority(
  originCode: string,
  destCode: string,
  locale: Locale
): number {
  const bothTop10 = isTop10(originCode) && isTop10(destCode);
  const bothTop20 = isTop20(originCode) && isTop20(destCode);
  const bothTop50 = isTop50(originCode) && isTop50(destCode);

  if (locale === "en") {
    if (bothTop10) return 1.0;
    if (bothTop20) return 0.8;
    if (bothTop50) return 0.3;
    return 0.1;
  }

  // Native language check: locale matches origin or destination country
  const originNative = getNativeLocale(originCode);
  const destNative = getNativeLocale(destCode);
  const isNativeLocale = locale === originNative || locale === destNative;

  if (isNativeLocale && bothTop20) return 0.7;
  if (bothTop50) return 0.3;
  return 0.1;
}

export function getAllPagesByPriority(): PagePriority[] {
  const pages: PagePriority[] = [];
  const countryByCode = new Map(countries.map((c) => [c.code, c]));

  // --- Static pages ---
  for (const locale of locales) {
    pages.push({
      url: `${BASE_URL}/${locale}`,
      locale,
      type: "static",
      priority: 0.05,
      estimated_monthly_searches: estimateSearches(0.05),
    });
    for (const page of ["about", "terms", "privacy"]) {
      pages.push({
        url: `${BASE_URL}/${locale}/${page}`,
        locale,
        type: "static",
        priority: 0.05,
        estimated_monthly_searches: estimateSearches(0.05),
      });
    }
    pages.push({
      url: `${BASE_URL}/${locale}/platforms`,
      locale,
      type: "static",
      priority: 0.03,
      estimated_monthly_searches: estimateSearches(0.03),
    });
  }

  // --- Blog posts ---
  for (const locale of locales) {
    // Blog index
    pages.push({
      url: `${BASE_URL}/${locale}/blog`,
      locale,
      type: "blog",
      priority: 0.4,
      estimated_monthly_searches: estimateSearches(0.4),
    });
    for (const post of blogPosts) {
      pages.push({
        url: `${BASE_URL}/${locale}/blog/${post.id}`,
        locale,
        type: "blog",
        priority: 0.4,
        estimated_monthly_searches: estimateSearches(0.4),
      });
    }
  }

  // --- Carrier pages (top-10 all locales, rest en only) ---
  for (const locale of locales) {
    // Carrier index on all locales
    pages.push({
      url: `${BASE_URL}/${locale}/carriers`,
      locale,
      type: "carrier",
      priority: locale === "en" ? 0.35 : 0.1,
      estimated_monthly_searches: estimateSearches(locale === "en" ? 0.35 : 0.1),
    });
    for (const carrier of carriers) {
      const isTop10Carrier = TOP_10_CARRIERS.includes(carrier.id);
      // Top-10 carriers: all locales. Others: en only
      if (!isTop10Carrier && locale !== "en") continue;
      const priority =
        locale === "en" && isTop10Carrier
          ? 0.35
          : isTop10Carrier
            ? 0.15
            : 0.1;
      pages.push({
        url: `${BASE_URL}/${locale}/carriers/${carrier.id}`,
        locale,
        type: "carrier",
        priority,
        estimated_monthly_searches: estimateSearches(priority),
      });
    }
  }

  // --- Guide pages (only country's language + en) ---
  for (const locale of locales) {
    // Guide index on all locales
    pages.push({
      url: `${BASE_URL}/${locale}/guide`,
      locale,
      type: "guide",
      priority: locale === "en" ? 0.6 : 0.15,
      estimated_monthly_searches: estimateSearches(locale === "en" ? 0.6 : 0.15),
    });
  }
  for (const country of countries) {
    const validLocales = getCorridorLocales(country.code, country.code);
    const isTop20Country = isTop20(country.code);
    for (const locale of validLocales) {
      const priority =
        locale === "en" && isTop20Country
          ? 0.6
          : isTop20Country
            ? 0.3
            : 0.15;
      pages.push({
        url: `${BASE_URL}/${locale}/guide/${country.slug_en}`,
        locale,
        type: "guide",
        priority,
        estimated_monthly_searches: estimateSearches(priority),
      });
    }
  }

  // --- From/To hub pages (only country's language + en) ---
  for (const country of countries) {
    const validLocales = getCorridorLocales(country.code, country.code);
    const isTop20Country = isTop20(country.code);
    for (const locale of validLocales) {
      const priority =
        locale === "en" && isTop20Country
          ? 0.5
          : 0.2;
      pages.push({
        url: `${BASE_URL}/${locale}/shipping/from/${country.slug_en}`,
        locale,
        type: "from",
        priority,
        estimated_monthly_searches: estimateSearches(priority),
      });
      pages.push({
        url: `${BASE_URL}/${locale}/shipping/to/${country.slug_en}`,
        locale,
        type: "to",
        priority,
        estimated_monthly_searches: estimateSearches(priority),
      });
    }
  }

  // --- Corridor pages (only for valid locale combinations) ---
  // Use top-20 countries for corridor generation (matching existing sitemap logic)
  const corridorCountryCodes = TOP_50_GDP;
  const corridorCountries = corridorCountryCodes
    .map((code) => countryByCode.get(code))
    .filter((c): c is Country => c !== undefined);

  for (const origin of corridorCountries) {
    for (const dest of corridorCountries) {
      if (origin.code === dest.code) continue;
      const validLocales = getCorridorLocales(origin.code, dest.code);
      for (const locale of validLocales) {
        const priority = getCorridorPriority(origin.code, dest.code, locale);
        const slug = makeCorridorSlug(origin, dest, locale);
        pages.push({
          url: `${BASE_URL}/${locale}/shipping/${slug}`,
          locale,
          type: "corridor",
          priority,
          estimated_monthly_searches: estimateSearches(priority),
        });
      }
    }
  }

  // Sort by priority descending, then alphabetically for stable ordering
  pages.sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    return a.url.localeCompare(b.url);
  });

  return pages;
}

export function getTopPages(n: number): PagePriority[] {
  return getAllPagesByPriority().slice(0, n);
}
