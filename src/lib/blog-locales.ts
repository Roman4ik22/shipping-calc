/**
 * Smart locale routing for blog posts.
 *
 * Rule: a blog post should only be localized into languages that match its
 * region/topic tags. A post about shipping from Korea is relevant in Korean
 * and English (maybe Japanese/Chinese for adjacent markets). It is NOT
 * relevant in Arabic or Turkish.
 *
 * Generic posts (cost-saving tips, calculation guides, comparisons) remain
 * relevant across all 12 locales.
 */

import type { Locale } from "./types";
import { locales } from "./i18n";

/**
 * Tag → locales the post targets. Keys are tags that appear in blog-posts.ts.
 */
const TAG_LOCALES: Record<string, Locale[]> = {
  // Regions / countries — constrain tightly
  china: ["zh", "en"],
  japan: ["ja", "en"],
  korea: ["ko", "en"],
  russia: ["ru", "en"],
  usa: ["en"],
  uk: ["en"],
  europe: ["en", "de", "fr", "it", "es", "pt"],
  eu: ["en", "de", "fr", "it", "es", "pt"],
  turkey: ["tr", "en"],
  australia: ["en"],
  "middle-east": ["ar", "en"],
  brazil: ["pt", "en"],
};

/**
 * Tags that imply the content is generic — applicable worldwide.
 * Presence of ANY of these widens the locale set to ALL 12.
 */
const GENERIC_TAGS = new Set<string>([
  "tips", "cost-saving", "beginners", "guide", "tracking",
  "ecommerce", "business", "small-business", "comparison",
  "carriers", "volumetric-weight", "apps", "shopify", "amazon",
  "fba", "etsy", "returns", "fragile", "packaging",
  "electronics", "batteries", "food", "clothing", "textiles",
  "duties", "customs", "tariffs", "regulations", "restrictions",
  "sanctions", "reform", "anime",
]);

/**
 * Return the set of locales a blog post should exist in.
 * Logic:
 *   1. Start with a set built from region-specific tags (e.g. china → zh, en).
 *   2. If ANY generic tag is present, widen to all 12 locales (universal topics).
 *   3. Always include English.
 *   4. If no matching tags at all, fall back to all 12 (safe default).
 */
export function getBlogLocales(tags: string[]): Locale[] {
  const regionLocales = new Set<Locale>();
  let hasGeneric = false;
  let matchedAnyRegion = false;

  for (const tag of tags) {
    if (TAG_LOCALES[tag]) {
      matchedAnyRegion = true;
      for (const loc of TAG_LOCALES[tag]) regionLocales.add(loc);
    }
    if (GENERIC_TAGS.has(tag)) hasGeneric = true;
  }

  // If there is at least one region tag, respect it strictly — don't let
  // generic tags widen a China-specific post back to all 12.
  if (matchedAnyRegion) {
    regionLocales.add("en");
    return [...regionLocales];
  }

  // No region tags + at least one generic tag → universal
  if (hasGeneric) return [...locales];

  // Nothing matched at all → safe default = all 12
  return [...locales];
}

/**
 * Is a given locale valid for this blog post?
 */
export function isBlogLocaleValid(tags: string[], locale: Locale): boolean {
  return getBlogLocales(tags).includes(locale);
}
