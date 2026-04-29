import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import Link from "next/link";
import { localeNames, t, pickLocalized } from "@/lib/i18n";
import { StaggerWords } from "@/components/HeroMotion";
import type { Locale } from "@/lib/types";
import { blogPosts, getPostBySlug, getRelatedPosts } from "@/data/blog-posts";
import { countries, makeCorridorSlug, getCountryName } from "@/lib/data";
import { getBlogLocales, isBlogLocaleValid } from "@/lib/blog-locales";

/** Map blog post tags to relevant shipping corridors (origin code, dest code). */
function getRelatedCorridors(tags: string[]): { from: string; to: string }[] {
  const tagToCorridors: Record<string, { from: string; to: string }[]> = {
    china: [
      { from: "CN", to: "US" },
      { from: "CN", to: "GB" },
      { from: "CN", to: "DE" },
    ],
    usa: [
      { from: "US", to: "GB" },
      { from: "US", to: "DE" },
      { from: "US", to: "CA" },
    ],
    uk: [
      { from: "GB", to: "US" },
      { from: "US", to: "GB" },
      { from: "GB", to: "DE" },
    ],
    europe: [
      { from: "US", to: "DE" },
      { from: "US", to: "FR" },
      { from: "CN", to: "DE" },
    ],
    eu: [
      { from: "US", to: "DE" },
      { from: "CN", to: "FR" },
      { from: "GB", to: "DE" },
    ],
    japan: [
      { from: "JP", to: "US" },
      { from: "JP", to: "GB" },
      { from: "JP", to: "AU" },
    ],
    korea: [
      { from: "KR", to: "US" },
      { from: "KR", to: "JP" },
      { from: "KR", to: "GB" },
    ],
    turkey: [
      { from: "TR", to: "US" },
      { from: "TR", to: "DE" },
      { from: "TR", to: "GB" },
    ],
    russia: [
      { from: "DE", to: "RU" },
      { from: "CN", to: "RU" },
      { from: "TR", to: "RU" },
    ],
    australia: [
      { from: "US", to: "AU" },
      { from: "CN", to: "AU" },
      { from: "GB", to: "AU" },
    ],
    "middle-east": [
      { from: "CN", to: "AE" },
      { from: "US", to: "AE" },
      { from: "GB", to: "AE" },
    ],
  };

  const seen = new Set<string>();
  const result: { from: string; to: string }[] = [];

  for (const tag of tags) {
    const corridors = tagToCorridors[tag];
    if (!corridors) continue;
    for (const c of corridors) {
      const key = `${c.from}-${c.to}`;
      if (!seen.has(key)) {
        seen.add(key);
        result.push(c);
      }
      if (result.length >= 3) return result;
    }
  }

  // Fallback: popular corridors
  const fallback = [
    { from: "US", to: "GB" },
    { from: "CN", to: "US" },
    { from: "US", to: "DE" },
  ];
  for (const c of fallback) {
    const key = `${c.from}-${c.to}`;
    if (!seen.has(key)) {
      seen.add(key);
      result.push(c);
    }
    if (result.length >= 3) return result;
  }

  return result;
}

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const post of blogPosts) {
    for (const locale of getBlogLocales(post.tags)) {
      params.push({ locale, slug: post.id });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const loc = locale as Locale;
  const post = getPostBySlug(slug);
  const BASE_URL = "https://rateships.com";

  if (!post) {
    return { title: "Not Found" };
  }

  const title = pickLocalized(post as unknown as Record<string, unknown>, "title", loc);
  const description = pickLocalized(post as unknown as Record<string, unknown>, "excerpt", loc);

  return {
    title,
    description,
    alternates: {
      languages: {
        ...Object.fromEntries(
          getBlogLocales(post.tags).map((l) => [l, `/${l}/blog/${slug}`])
        ),
        "x-default": `/en/blog/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/blog/${slug}`,
      type: "article",
      publishedTime: post.date,
    },
  };
}

/**
 * Markdown renderer for blog posts. Supports:
 *   - ## H2 / ### H3
 *   - Unordered + ordered lists
 *   - Paragraphs with **bold** + `code`
 *   - Blockquotes (lines starting with "> ") render as a styled pull-quote
 *   - Callouts: paragraphs starting with [!TIP] / [!INFO] / [!WARN] /
 *     [!SUCCESS] render as colored callout boxes with leading icons.
 *
 * Note: classes use the v2 ivory tokens (text-ink, text-body, border-line)
 * — earlier version of this file was stuck on the abandoned dark v1 theme,
 * which made body text near-invisible on the new ivory background.
 */

const CALLOUT_TYPES: Record<
  string,
  { color: string; bg: string; border: string; icon: React.ReactNode; label: string }
> = {
  TIP: {
    color: "var(--blue)",
    bg: "var(--blue-50)",
    border: "rgba(26,115,232,.25)",
    label: "Tip",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
      </svg>
    ),
  },
  INFO: {
    color: "var(--blue)",
    bg: "var(--blue-50)",
    border: "rgba(26,115,232,.25)",
    label: "Info",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  },
  WARN: {
    color: "#A37A00",
    bg: "var(--warm-50)",
    border: "rgba(242,201,76,.45)",
    label: "Warning",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  SUCCESS: {
    color: "var(--good)",
    bg: "var(--good-50)",
    border: "rgba(17,138,84,.25)",
    label: "Verified",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
};

function renderMarkdown(content: string) {
  const blocks = content.split("\n\n");
  return blocks.map((block, i) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    // Callout — paragraph starting with [!TYPE]
    const calloutMatch = trimmed.match(/^\[!(TIP|INFO|WARN|SUCCESS)\]\s*([\s\S]*)/);
    if (calloutMatch) {
      const meta = CALLOUT_TYPES[calloutMatch[1]];
      const body = calloutMatch[2];
      return (
        <aside key={i}
          className="my-6 rounded-2xl px-5 py-4 flex items-start gap-3"
          style={{
            background: meta.bg,
            border: `1px solid ${meta.border}`,
            color: "var(--ink)",
          }}>
          <span style={{ color: meta.color, flexShrink: 0, marginTop: 2 }}>{meta.icon}</span>
          <div className="text-[15px] leading-relaxed text-body">{renderInline(body)}</div>
        </aside>
      );
    }

    // Pull-quote — lines starting with "> "
    if (trimmed.startsWith("> ")) {
      const lines = trimmed.split("\n").map((l) => l.replace(/^>\s?/, "")).join(" ");
      return (
        <blockquote key={i}
          className="my-8 pl-6 py-2 italic text-ink"
          style={{
            borderLeft: "4px solid var(--accent)",
            fontSize: "1.25rem",
            lineHeight: 1.55,
          }}>
          {renderInline(lines)}
        </blockquote>
      );
    }

    // H2
    if (trimmed.startsWith("## ")) {
      return (
        <h2 key={i} className="text-2xl font-bold text-ink mt-10 mb-4 tracking-tight">
          {trimmed.slice(3)}
        </h2>
      );
    }

    // H3
    if (trimmed.startsWith("### ")) {
      return (
        <h3 key={i} className="text-xl font-semibold text-ink mt-7 mb-3">
          {trimmed.slice(4)}
        </h3>
      );
    }

    // List
    if (trimmed.startsWith("- ")) {
      const items = trimmed.split("\n").filter((line) => line.startsWith("- "));
      return (
        <ul key={i} className="space-y-2 mb-5 text-body">
          {items.map((item, j) => (
            <li key={j} className="pl-5 relative leading-relaxed" style={{ paddingLeft: "1.5rem" }}>
              <span aria-hidden style={{
                position: "absolute", left: 0, top: "0.6em",
                width: 6, height: 6, borderRadius: 999, background: "var(--accent)",
              }} />
              {renderInline(item.slice(2))}
            </li>
          ))}
        </ul>
      );
    }

    // Ordered list
    if (/^\d+\.\s/.test(trimmed)) {
      const items = trimmed.split("\n").filter((line) => /^\d+\.\s/.test(line));
      return (
        <ol key={i} className="space-y-2 mb-5 text-body" style={{ counterReset: "ol-counter" }}>
          {items.map((item, j) => (
            <li key={j} className="pl-8 relative leading-relaxed">
              <span aria-hidden style={{
                position: "absolute", left: 0, top: "0.05em",
                width: 24, height: 24, borderRadius: 999,
                background: "var(--blue-50)", color: "var(--blue)",
                display: "grid", placeItems: "center",
                fontSize: 12, fontWeight: 700,
              }}>{j + 1}</span>
              {renderInline(item.replace(/^\d+\.\s/, ""))}
            </li>
          ))}
        </ol>
      );
    }

    // Paragraph
    return (
      <p key={i} className="text-body leading-relaxed mb-5 text-[17px]">
        {renderInline(trimmed)}
      </p>
    );
  });
}

function renderInline(text: string): React.ReactNode {
  // Handle **bold** + `inline code`. We tokenize in two passes.
  const boldParts = text.split(/(\*\*[^*]+\*\*)/g);
  return boldParts.flatMap((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`b${i}`} className="text-ink font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    // Inline code
    const codeParts = part.split(/(`[^`]+`)/g);
    return codeParts.map((cp, j) => {
      if (cp.startsWith("`") && cp.endsWith("`") && cp.length > 2) {
        return (
          <code key={`c${i}-${j}`} className="px-1.5 py-0.5 rounded text-[15px] font-mono"
            style={{ background: "var(--bg-alt)", color: "var(--ink)", border: "1px solid var(--line)" }}>
            {cp.slice(1, -1)}
          </code>
        );
      }
      return cp;
    });
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const loc = locale as Locale;
  const post = getPostBySlug(slug);
  const BASE_URL = "https://rateships.com";

  if (!post) {
    notFound();
  }
  // Smart routing: irrelevant locales 301 to the canonical /en/ version so
  // already-indexed URLs consolidate instead of returning hard 404s.
  if (!isBlogLocaleValid(post.tags, loc)) {
    permanentRedirect(`/en/blog/${slug}`);
  }

  const postRec = post as unknown as Record<string, unknown>;
  const title = pickLocalized(postRec, "title", loc);
  const content = pickLocalized(postRec, "content", loc);
  const excerpt = pickLocalized(postRec, "excerpt", loc);
  const contentIsTranslated = typeof postRec[`content_${loc}`] === "string" && (postRec[`content_${loc}`] as string).length > 0;
  const relatedPosts = getRelatedPosts(slug, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Organization",
      name: "RateShips",
    },
    publisher: {
      "@type": "Organization",
      name: "RateShips",
      logo: { "@type": "ImageObject", url: "https://rateships.com/favicon.svg" },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/${locale}/blog/${slug}`,
    },
    inLanguage: locale,
  };

  return (
    <div className="min-h-screen bg-dark-900">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* BreadcrumbList JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: t(loc, "home"), item: `${BASE_URL}/${locale}` },
              { "@type": "ListItem", position: 2, name: t(loc, "blog"), item: `${BASE_URL}/${locale}/blog` },
              { "@type": "ListItem", position: 3, name: title },
            ],
          }),
        }}
      />

      {/* Breadcrumbs */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <nav className="flex items-center gap-2 text-sm text-muted">
          <Link
            href={`/${locale}`}
            className="hover:text-ink transition-colors"
          >
            {t(loc, "home")}
          </Link>
          <span>/</span>
          <Link
            href={`/${locale}/blog`}
            className="hover:text-ink transition-colors"
          >
            {t(loc, "blog")}
          </Link>
          <span>/</span>
          <span className="text-ink truncate max-w-[200px]">{title}</span>
        </nav>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded-full bg-bg-alt text-body border border-line"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-4 tracking-tight">
          <StaggerWords text={title} />
        </h1>

        {/* Date */}
        <time
          className="block text-sm text-muted mb-8"
          dateTime={post.date}
        >
          {new Date(post.date).toLocaleDateString(
            loc === "ru" ? "ru-RU" : "en-US",
            { year: "numeric", month: "long", day: "numeric" }
          )}
        </time>

        {/* Language notice shown when content is not yet translated into current locale */}
        {!contentIsTranslated && loc !== "en" && (
          <p className="text-sm text-muted mb-6 italic">
            {t(loc, "blog_translation_coming", { lang: localeNames[loc] })}
          </p>
        )}

        {/* Content */}
        <div>{renderMarkdown(content)}</div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="border-t border-line pt-10">
            <h2 className="text-2xl font-bold text-ink mb-6">
              {t(loc, "related_posts")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <Link
                  key={related.id}
                  href={`/${locale}/blog/${related.id}`}
                  className="group bg-card rounded-xl border border-line p-5 hover:border-accent transition-all duration-200 card-hover"
                >
                  <h3 className="text-base font-semibold text-ink mb-2 group-hover:text-accent transition-colors">
                    {pickLocalized(related as unknown as Record<string, unknown>, "title", loc)}
                  </h3>
                  <p className="text-sm text-body line-clamp-2 mb-3">
                    {pickLocalized(related as unknown as Record<string, unknown>, "excerpt", loc)}
                  </p>
                  <time
                    className="text-xs text-muted"
                    dateTime={related.date}
                  >
                    {new Date(related.date).toLocaleDateString(
                      loc === "ru" ? "ru-RU" : "en-US",
                      { year: "numeric", month: "short", day: "numeric" }
                    )}
                  </time>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related shipping corridors */}
      {(() => {
        const corridors = getRelatedCorridors(post.tags);
        if (corridors.length === 0) return null;
        return (
          <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div className="border-t border-line pt-10">
              <h2 className="text-2xl font-bold text-ink mb-6">
                {t(loc, "compare_shipping_rates_cta")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {corridors.map((c) => {
                  const originCountry = countries.find((co) => co.code === c.from);
                  const destCountry = countries.find((co) => co.code === c.to);
                  if (!originCountry || !destCountry) return null;
                  const oName = getCountryName(originCountry, loc);
                  const dName = getCountryName(destCountry, loc);
                  return (
                    <Link
                      key={`${c.from}-${c.to}`}
                      href={`/${locale}/shipping/${makeCorridorSlug(originCountry, destCountry, loc)}`}
                      className="group bg-card rounded-xl border border-line p-5 hover:border-accent transition-all duration-200 card-hover"
                    >
                      <p className="text-base font-semibold text-ink group-hover:text-accent transition-colors">
                        {oName} → {dName}
                      </p>
                      <p className="text-sm text-body mt-1">
                        {t(loc, "compare_carriers_prices")}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })()}
    </div>
  );
}
