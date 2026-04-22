import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { localeNames, t, pickLocalized } from "@/lib/i18n";
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

function renderMarkdown(content: string) {
  const blocks = content.split("\n\n");
  return blocks.map((block, i) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    // H2
    if (trimmed.startsWith("## ")) {
      return (
        <h2
          key={i}
          className="text-2xl font-bold text-white mt-8 mb-4"
        >
          {trimmed.slice(3)}
        </h2>
      );
    }

    // H3
    if (trimmed.startsWith("### ")) {
      return (
        <h3
          key={i}
          className="text-xl font-semibold text-white mt-6 mb-3"
        >
          {trimmed.slice(4)}
        </h3>
      );
    }

    // List
    if (trimmed.startsWith("- ")) {
      const items = trimmed.split("\n").filter((line) => line.startsWith("- "));
      return (
        <ul key={i} className="list-disc list-inside space-y-2 mb-4 text-gray-300">
          {items.map((item, j) => (
            <li key={j}>{renderInline(item.slice(2))}</li>
          ))}
        </ul>
      );
    }

    // Ordered list
    if (/^\d+\.\s/.test(trimmed)) {
      const items = trimmed.split("\n").filter((line) => /^\d+\.\s/.test(line));
      return (
        <ol key={i} className="list-decimal list-inside space-y-2 mb-4 text-gray-300">
          {items.map((item, j) => (
            <li key={j}>{renderInline(item.replace(/^\d+\.\s/, ""))}</li>
          ))}
        </ol>
      );
    }

    // Paragraph
    return (
      <p key={i} className="text-gray-300 leading-relaxed mb-4">
        {renderInline(trimmed)}
      </p>
    );
  });
}

function renderInline(text: string): React.ReactNode {
  // Handle **bold** text
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="text-white font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
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
  if (!isBlogLocaleValid(post.tags, loc)) {
    notFound();
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
        <nav className="flex items-center gap-2 text-sm text-gray-400">
          <Link
            href={`/${locale}`}
            className="hover:text-white transition-colors"
          >
            {t(loc, "home")}
          </Link>
          <span>/</span>
          <Link
            href={`/${locale}/blog`}
            className="hover:text-white transition-colors"
          >
            {t(loc, "blog")}
          </Link>
          <span>/</span>
          <span className="text-white truncate max-w-[200px]">{title}</span>
        </nav>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded-full bg-surface-light text-gray-300 border border-white/10"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          {title}
        </h1>

        {/* Date */}
        <time
          className="block text-sm text-gray-500 mb-8"
          dateTime={post.date}
        >
          {new Date(post.date).toLocaleDateString(
            loc === "ru" ? "ru-RU" : "en-US",
            { year: "numeric", month: "long", day: "numeric" }
          )}
        </time>

        {/* Language notice shown when content is not yet translated into current locale */}
        {!contentIsTranslated && loc !== "en" && (
          <p className="text-sm text-gray-500 mb-6 italic">
            {t(loc, "blog_translation_coming", { lang: localeNames[loc] })}
          </p>
        )}

        {/* Content */}
        <div className="prose-dark">{renderMarkdown(content)}</div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="border-t border-white/10 pt-10">
            <h2 className="text-2xl font-bold text-white mb-6">
              {t(loc, "related_posts")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <Link
                  key={related.id}
                  href={`/${locale}/blog/${related.id}`}
                  className="group bg-surface rounded-xl border border-white/10 p-5 hover:border-accent-light/30 transition-all duration-200"
                >
                  <h3 className="text-base font-semibold text-white mb-2 group-hover:text-accent-light transition-colors">
                    {pickLocalized(related as unknown as Record<string, unknown>, "title", loc)}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                    {pickLocalized(related as unknown as Record<string, unknown>, "excerpt", loc)}
                  </p>
                  <time
                    className="text-xs text-gray-500"
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
            <div className="border-t border-white/10 pt-10">
              <h2 className="text-2xl font-bold text-white mb-6">
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
                      className="group bg-surface rounded-xl border border-white/10 p-5 hover:border-accent-light/30 transition-all duration-200"
                    >
                      <p className="text-base font-semibold text-white group-hover:text-accent-light transition-colors">
                        {oName} → {dName}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
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
