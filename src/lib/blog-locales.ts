/**
 * Smart locale routing for blog posts.
 *
 * Rule: a blog post is relevant in a locale only when an actual translation
 * exists (`title_<loc>` and `content_<loc>` fields are populated on the post
 * object). Region/topic tags can extend the eligibility set, but Google flags
 * pages as "duplicate without canonical" if /ja/blog/X serves English content
 * because no Japanese translation exists — so we no longer widen to "all 12"
 * just because tags are generic.
 *
 * The two-arg overload `getBlogLocales(post)` checks actual translation; the
 * tag-only overload `getBlogLocales(tags)` is kept for backward-compat callers
 * that don't have the post object handy (it returns the optimistic set).
 */

import type { Locale } from "./types";
import { locales } from "./i18n";

/** Minimal shape we need from a blog post to check translation completeness.
 *  We only require `tags`; per-locale fields (title_en, content_ja, …) are
 *  accessed via a cast inside the function so we don't force callers to add
 *  an index signature to their BlogPost interface. */
type BlogPostLike = { tags: string[] };

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
 * Return the set of locales a blog post is RELEVANT in based on its tags.
 * This is the optimistic / aspirational set — the locales we'd ship the post
 * to if we had translations for all of them.
 *
 * Logic:
 *   1. Start with a set built from region-specific tags (e.g. china → zh, en).
 *   2. If a region tag matched, return strictly that set (don't let generic
 *      tags widen a China-specific post back to all 12).
 *   3. Otherwise: only English, unless the post object is provided (use the
 *      `getBlogLocales(post)` overload for the actual translation set).
 */
function getRelevantLocalesByTags(tags: string[]): Locale[] {
  const regionLocales = new Set<Locale>();
  let matchedAnyRegion = false;

  for (const tag of tags) {
    if (TAG_LOCALES[tag]) {
      matchedAnyRegion = true;
      for (const loc of TAG_LOCALES[tag]) regionLocales.add(loc);
    }
  }

  if (matchedAnyRegion) {
    regionLocales.add("en");
    return [...regionLocales];
  }

  // No region tag → only English. We no longer widen generic-tag posts to
  // all 12 locales because that produces /ja/blog/X URLs that serve English
  // content (no translation) → Google flags as duplicate.
  return ["en"];
}

/**
 * Return locales a post is ACTUALLY available in: intersection of
 *   (locales the post has translations for)
 * with
 *   (locales the post is relevant for based on tags).
 *
 * This is what generates the canonical/hreflang/sitemap entries. Pages render
 * for these locales without noindex; everything else gets canonical-to-en +
 * noindex.
 */
export function getBlogLocales(postOrTags: BlogPostLike | string[]): Locale[] {
  // Tag-only path (legacy / sitemap-pre-translation expansion). Returns the
  // tag-based relevance set.
  if (Array.isArray(postOrTags)) {
    return getRelevantLocalesByTags(postOrTags);
  }

  const post = postOrTags;
  const relevantByTags = new Set(getRelevantLocalesByTags(post.tags));

  // Cast once so we can index per-locale fields (title_<loc>, content_<loc>).
  const fields = post as unknown as Record<string, unknown>;

  // Find locales where the post has an actual translation (title + content).
  const translated: Locale[] = [];
  for (const loc of locales) {
    const title = fields[`title_${loc}`];
    const content = fields[`content_${loc}`];
    const hasTitle = typeof title === "string" && title.length > 0;
    const hasContent = typeof content === "string" && content.length > 0;
    if (hasTitle && hasContent && relevantByTags.has(loc)) {
      translated.push(loc);
    }
  }
  // Always include English (base locale assumption — every post has en).
  if (!translated.includes("en")) translated.unshift("en");
  return translated;
}

/**
 * Is a given locale valid for this blog post? Pass the post for correct
 * translation-aware check; pass tags only for the tag-based optimistic check.
 */
export function isBlogLocaleValid(postOrTags: BlogPostLike | string[], locale: Locale): boolean {
  return getBlogLocales(postOrTags).includes(locale);
}
