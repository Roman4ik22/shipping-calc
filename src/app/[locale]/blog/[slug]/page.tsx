import type { Metadata } from "next";
import Link from "next/link";
import { locales, t } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { blogPosts, getPostBySlug, getRelatedPosts } from "@/data/blog-posts";
import { countries, makeCorridorSlug, getCountryName } from "@/lib/data";

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
  for (const locale of locales) {
    for (const post of blogPosts) {
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
  const isRu = loc === "ru";
  const post = getPostBySlug(slug);
  const BASE_URL = "https://rateships.com";

  if (!post) {
    return { title: "Not Found" };
  }

  const title = isRu ? post.title_ru : post.title_en;
  const description = isRu ? post.excerpt_ru : post.excerpt_en;

  return {
    title,
    description,
    alternates: {
      languages: Object.fromEntries(
        locales.map((l) => [l, `/${l}/blog/${slug}`])
      ),
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
  const isRu = loc === "ru";
  const post = getPostBySlug(slug);
  const BASE_URL = "https://rateships.com";

  if (!post) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <p className="text-white text-xl">Post not found</p>
      </div>
    );
  }

  const title = isRu ? post.title_ru : post.title_en;
  const content = isRu ? post.content_ru : post.content_en;
  const relatedPosts = getRelatedPosts(slug, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: isRu ? post.excerpt_ru : post.excerpt_en,
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
            isRu ? "ru-RU" : "en-US",
            { year: "numeric", month: "long", day: "numeric" }
          )}
        </time>

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
                    {isRu ? related.title_ru : related.title_en}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                    {isRu ? related.excerpt_ru : related.excerpt_en}
                  </p>
                  <time
                    className="text-xs text-gray-500"
                    dateTime={related.date}
                  >
                    {new Date(related.date).toLocaleDateString(
                      isRu ? "ru-RU" : "en-US",
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
                {isRu ? "Сравните тарифы доставки" : "Compare Shipping Rates"}
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
                        {isRu ? "Сравнить перевозчиков и цены" : "Compare carriers & prices"}
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
