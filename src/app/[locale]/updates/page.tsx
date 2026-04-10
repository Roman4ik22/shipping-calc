import { Metadata } from "next";
import { t, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import Link from "next/link";

const updates = [
  {
    date: "2026-04-07",
    title_en: "Humanized all content",
    title_ru: "Улучшение текстов",
    desc_en:
      "Removed 1,133 AI writing patterns across all pages. Content now reads more naturally.",
    desc_ru:
      "Удалено 1,133 AI-паттернов из всех текстов. Контент теперь читается естественнее.",
    tags: ["content"],
  },
  {
    date: "2026-04-06",
    title_en: "SEO audit fixes",
    title_ru: "Исправления SEO",
    desc_en:
      "Fixed soft 404s, added OG images, RSS feed, proper robots.txt. Sitemap now includes all trust pages.",
    desc_ru:
      "Исправлены soft 404, добавлены OG-изображения, RSS-лента, правильный robots.txt.",
    tags: ["seo", "technical"],
  },
  {
    date: "2026-04-05",
    title_en: "Nova Poshta style redesign",
    title_ru: "Редизайн в стиле Новой Почты",
    desc_en:
      "Card-based layout with rounded corners, blue accent CTA buttons, improved mobile contrast.",
    desc_ru:
      "Карточный дизайн с закруглёнными углами, синие CTA-кнопки, улучшенный контраст на мобильных.",
    tags: ["design"],
  },
  {
    date: "2026-04-04",
    title_en: "213 countries with detailed customs data",
    title_ru: "213 стран с детальными таможенными данными",
    desc_en:
      "Every country now has hand-crafted duty rates (8 categories), de minimis thresholds, VAT rates, customs authority URLs, and honest clearance process descriptions.",
    desc_ru:
      "Каждая страна теперь имеет ручные ставки пошлин (8 категорий), де минимис, НДС, URL таможенных органов.",
    tags: ["data", "customs"],
  },
  {
    date: "2026-04-03",
    title_en: "Complete i18n: 12 languages × 243 keys",
    title_ru: "Полная локализация: 12 языков × 243 ключа",
    desc_en:
      "All UI phrases translated to English, Russian, Spanish, German, French, Portuguese, Chinese, Japanese, Korean, Arabic, Turkish, Italian.",
    desc_ru: "Все фразы интерфейса переведены на 12 языков.",
    tags: ["i18n"],
  },
  {
    date: "2026-04-03",
    title_en: "Smart locale routing",
    title_ru: "Умная маршрутизация языков",
    desc_en:
      "Pages now exist only in relevant languages. BR→PL only in Portuguese and English, not Japanese. Reduced from 14K to 6.3K pages.",
    desc_ru:
      "Страницы существуют только на релевантных языках. BR→PL только на pt и en.",
    tags: ["seo", "technical"],
  },
  {
    date: "2026-04-02",
    title_en: "Standalone customs & tools pages",
    title_ru: "Отдельные страницы таможни и инструментов",
    desc_en:
      "New /customs/{country} pages for all 213 countries. Standalone duty calculator and delivery estimator at /tools/.",
    desc_ru:
      "Новые страницы /customs/{country} для 213 стран. Калькулятор пошлин и сроков на /tools/.",
    tags: ["feature"],
  },
  {
    date: "2026-04-01",
    title_en: "Priority-based URL submission system",
    title_ru: "Система приоритетной подачи URL",
    desc_en:
      "Google Indexing API + IndexNow integration. 280 URLs submitted to Google, 5000 to Bing/Yandex. Gradual sitemap based on page priority.",
    desc_ru:
      "Google Indexing API + IndexNow. 280 URL в Google, 5000 в Bing/Yandex.",
    tags: ["seo"],
  },
  {
    date: "2026-03-31",
    title_en: "Real carrier rates: 54 carriers verified",
    title_ru: "Реальные тарифы: 54 перевозчика проверены",
    desc_en:
      "Updated rates from official sources: Royal Mail, Japan Post, Australia Post, USPS, Deutsche Post, Colissimo, Korea Post, China Post, SF Express, and 45 more.",
    desc_ru:
      "Обновлены тарифы из официальных источников: Royal Mail, Japan Post, Australia Post и ещё 45.",
    tags: ["data", "rates"],
  },
  {
    date: "2026-03-28",
    title_en: "Apple minimalist redesign",
    title_ru: "Минималистичный редизайн",
    desc_en:
      "Complete visual overhaul: pure black background, Inter font, large typography, opacity-based interactions, no card borders.",
    desc_ru:
      "Полная визуальная переработка: чёрный фон, шрифт Inter, крупная типографика.",
    tags: ["design"],
  },
  {
    date: "2026-03-25",
    title_en: "Dark theme + Trustpilot reviews",
    title_ru: "Тёмная тема + отзывы Trustpilot",
    desc_en:
      "Dark theme with accent blue. Trustpilot ratings for 30+ carriers displayed on rate cards and carrier pages.",
    desc_ru:
      "Тёмная тема с синим акцентом. Рейтинги Trustpilot для 30+ перевозчиков.",
    tags: ["design", "data"],
  },
  {
    date: "2026-03-20",
    title_en: "Launch: 134 carriers, 213 countries, 12 languages",
    title_ru: "Запуск: 134 перевозчика, 213 стран, 12 языков",
    desc_en:
      "RateShips launched with rate comparison across 134 carriers, customs data for 213 countries, and full localization in 12 languages.",
    desc_ru:
      "RateShips запущен: сравнение тарифов 134 перевозчиков, таможенные данные 213 стран, 12 языков.",
    tags: ["launch"],
  },
];

const tagColors: Record<string, string> = {
  data: "bg-green-900/50 text-green-400",
  seo: "bg-blue-900/50 text-blue-400",
  design: "bg-purple-900/50 text-purple-400",
  technical: "bg-gray-700/50 text-gray-400",
  feature: "bg-amber-900/50 text-amber-400",
  i18n: "bg-teal-900/50 text-teal-400",
  launch: "bg-red-900/50 text-red-400",
  content: "bg-orange-900/50 text-orange-400",
  rates: "bg-emerald-900/50 text-emerald-400",
  customs: "bg-yellow-900/50 text-yellow-400",
};

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
  return {
    title: t(loc, "updates_title"),
    description: t(loc, "updates_description"),
    alternates: {
      canonical: `/${locale}/updates`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}/updates`])),
        "x-default": "/en/updates",
      },
    },
  };
}

export default async function UpdatesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;
  const isRu = locale === "ru";

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t(loc, "home"),
        item: `https://rateships.com/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t(loc, "updates"),
        item: `https://rateships.com/${locale}/updates`,
      },
    ],
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: t(loc, "updates_title"),
    description: t(loc, "updates_description"),
    url: `https://rateships.com/${locale}/updates`,
    inLanguage: locale,
    isPartOf: {
      "@type": "WebSite",
      name: "RateShips",
      url: "https://rateships.com",
    },
    dateModified: updates[0]?.date,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbSchema, webPageSchema]),
        }}
      />

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-6">
        <Link href={`/${locale}`} className="hover:text-accent-light">
          {t(loc, "home")}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-white">{t(loc, "updates")}</span>
      </nav>

      {/* Header */}
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
        {t(loc, "updates_title")}
      </h1>
      <p className="text-gray-400 text-lg mb-10">
        {isRu
          ? "Мы регулярно обновляем тарифы и таможенные данные. Вот что изменилось."
          : "We update our shipping rates and customs data regularly. Here\u2019s what changed."}
      </p>

      {/* Entries */}
      <div className="space-y-4">
        {updates.map((entry, i) => (
          <article
            key={i}
            className="bg-card rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row gap-4"
          >
            {/* Date */}
            <div className="sm:w-32 shrink-0">
              <time
                dateTime={entry.date}
                className="text-sm font-medium text-gray-500"
              >
                {new Date(entry.date + "T00:00:00").toLocaleDateString(
                  locale,
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }
                )}
              </time>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h2 className="text-white font-semibold text-base mb-1">
                {isRu ? entry.title_ru : entry.title_en}
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-3">
                {isRu ? entry.desc_ru : entry.desc_en}
              </p>
              <div className="flex flex-wrap gap-2">
                {entry.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${tagColors[tag] || "bg-gray-700/50 text-gray-400"}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
