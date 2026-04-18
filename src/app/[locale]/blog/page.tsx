import type { Metadata } from "next";
import Link from "next/link";
import { locales, t } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { blogPosts } from "@/data/blog-posts";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  const BASE_URL = "https://rateships.com";

  return {
    title: t(loc, "blog_title"),
    description: t(loc, "blog_description"),
    alternates: {
      canonical: `/${locale}/blog`,
      languages: {
        ...Object.fromEntries(
          locales.map((l) => [l, `/${l}/blog`])
        ),
        "x-default": "/en/blog",
      },
    },
    openGraph: {
      title: t(loc, "blog_title"),
      description: t(loc, "blog_description"),
      url: `${BASE_URL}/${locale}/blog`,
      type: "website",
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;
  const sortedPosts = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="min-h-screen bg-bg">
      {/* BreadcrumbList JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: t(loc, "home"), item: `https://rateships.com/${locale}` },
              { "@type": "ListItem", position: 2, name: t(loc, "blog") },
            ],
          }),
        }}
      />

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <nav className="flex items-center gap-2 text-sm text-body">
          <Link
            href={`/${locale}`}
            className="hover:text-ink transition-colors"
          >
            {t(loc, "home")}
          </Link>
          <span>/</span>
          <span className="text-ink">{t(loc, "blog")}</span>
        </nav>
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-3">
          {t(loc, "blog_title")}
        </h1>
        <p className="text-lg text-body max-w-2xl">
          {t(loc, "blog_description")}
        </p>
      </div>

      {/* Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPosts.map((post, index) => {
            const tagColors = [
              "bg-blue-500/10 text-blue-300 border-blue-500/20",
              "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
              "bg-amber-500/10 text-amber-300 border-amber-500/20",
              "bg-purple-500/10 text-purple-300 border-purple-500/20",
            ];
            return (
              <Link
                key={post.id}
                href={`/${locale}/blog/${post.id}`}
                className={`group bg-surface rounded-xl border border-line p-6 hover:border-accent-light/30 hover:translate-y-[-2px] transition-all duration-200 ${
                  index === 0 ? "md:col-span-2 lg:col-span-2" : ""
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <time
                    className={`font-medium tabular-nums ${index === 0 ? "text-sm text-accent" : "text-xs text-muted"}`}
                    dateTime={post.date}
                  >
                    {new Date(post.date).toLocaleDateString(
                      loc === "ru" ? "ru-RU" : "en-US",
                      { year: "numeric", month: "long", day: "numeric" }
                    )}
                  </time>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.slice(0, 3).map((tag, tagIdx) => (
                    <span
                      key={tag}
                      className={`text-xs px-2 py-1 rounded-full border ${tagColors[tagIdx % tagColors.length]}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className={`font-semibold text-ink mb-2 group-hover:text-accent transition-colors ${
                  index === 0 ? "text-xl" : "text-lg"
                }`}>
                  {loc === "ru" ? post.title_ru : post.title_en}
                </h2>
                <p className={`text-sm text-body mb-4 ${index === 0 ? "line-clamp-4" : "line-clamp-3"}`}>
                  {loc === "ru" ? post.excerpt_ru : post.excerpt_en}
                </p>
                <div className="flex items-center justify-end">
                  <span className="text-sm text-accent group-hover:text-ink transition-colors">
                    {t(loc, "read_more")} &rarr;
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* CollectionPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: t(loc, "blog_title"),
            description: t(loc, "blog_description"),
            url: `https://rateships.com/${locale}/blog`,
            inLanguage: locale,
            isPartOf: { "@type": "WebSite", name: "RateShips", url: "https://rateships.com" },
            dateModified: "2026-04-03",
          }),
        }}
      />
    </div>
  );
}
