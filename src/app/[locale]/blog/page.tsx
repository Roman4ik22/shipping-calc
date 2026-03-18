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
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://rateships.com";

  return {
    title: t(loc, "blog_title"),
    description: t(loc, "blog_description"),
    alternates: {
      languages: Object.fromEntries(
        locales.map((l) => [l, `/${l}/blog`])
      ),
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
  const isRu = loc === "ru";

  const sortedPosts = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <nav className="flex items-center gap-2 text-sm text-gray-400">
          <Link
            href={`/${locale}`}
            className="hover:text-white transition-colors"
          >
            {t(loc, "home")}
          </Link>
          <span>/</span>
          <span className="text-white">{t(loc, "blog")}</span>
        </nav>
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          {t(loc, "blog_title")}
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl">
          {t(loc, "blog_description")}
        </p>
      </div>

      {/* Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPosts.map((post) => (
            <Link
              key={post.id}
              href={`/${locale}/blog/${post.id}`}
              className="group bg-surface rounded-xl border border-white/10 p-6 hover:border-accent-light/30 transition-all duration-200"
            >
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 rounded-full bg-surface-light text-gray-300 border border-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="text-lg font-semibold text-white mb-2 group-hover:text-accent-light transition-colors">
                {isRu ? post.title_ru : post.title_en}
              </h2>
              <p className="text-sm text-gray-400 mb-4 line-clamp-3">
                {isRu ? post.excerpt_ru : post.excerpt_en}
              </p>
              <div className="flex items-center justify-between">
                <time className="text-xs text-gray-500" dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString(
                    isRu ? "ru-RU" : "en-US",
                    { year: "numeric", month: "long", day: "numeric" }
                  )}
                </time>
                <span className="text-sm text-accent-light group-hover:text-white transition-colors">
                  {t(loc, "read_more")} &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
