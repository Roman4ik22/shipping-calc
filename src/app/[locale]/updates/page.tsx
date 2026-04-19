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

const tagColors: Record<string, { bg: string; text: string }> = {
  data: { bg: "rgba(34,197,94,0.10)", text: "#16a34a" },
  seo: { bg: "rgba(59,130,246,0.10)", text: "#2563eb" },
  design: { bg: "rgba(139,92,246,0.10)", text: "#7c3aed" },
  technical: { bg: "rgba(107,114,128,0.10)", text: "#6b7280" },
  feature: { bg: "rgba(245,158,11,0.10)", text: "#d97706" },
  i18n: { bg: "rgba(20,184,166,0.10)", text: "#0d9488" },
  launch: { bg: "rgba(239,68,68,0.10)", text: "#dc2626" },
  content: { bg: "rgba(249,115,22,0.10)", text: "#ea580c" },
  rates: { bg: "rgba(16,185,129,0.10)", text: "#059669" },
  customs: { bg: "rgba(234,179,8,0.10)", text: "#ca8a04" },
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
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbSchema, webPageSchema]),
        }}
      />

      {/* Hero Section */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(155deg, #fce7f3 0%, #fdf2f8 30%, #ede9fe 100%)",
          backgroundImage: `linear-gradient(155deg, #fce7f3 0%, #fdf2f8 30%, #ede9fe 100%),
            linear-gradient(rgba(168,85,247,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168,85,247,0.04) 1px, transparent 1px)`,
          backgroundSize: "100% 100%, 34px 34px, 34px 34px",
          padding: "80px 24px 60px",
        }}
      >
        {/* Floating rocket icon */}
        <div
          style={{
            position: "absolute",
            top: 30,
            right: "13%",
            animation: "floatUpdates 5s ease-in-out infinite",
          }}
        >
          <div
            style={{
              width: 32,
              height: 56,
              borderRadius: "16px 16px 6px 6px",
              background: "rgba(139,92,246,0.10)",
              border: "2px solid rgba(139,92,246,0.18)",
              position: "relative",
              transform: "rotate(-20deg)",
            }}
          >
            <div
              style={{
                position: "absolute",
                bottom: -6,
                left: "50%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderTop: "10px solid rgba(239,68,68,0.15)",
              }}
            />
          </div>
        </div>

        {/* Small star */}
        <div
          style={{
            position: "absolute",
            bottom: 50,
            left: "10%",
            width: 24,
            height: 24,
            background: "rgba(245,158,11,0.12)",
            clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
          }}
        />

        {/* Warm circle */}
        <div
          style={{
            position: "absolute",
            top: "55%",
            right: "6%",
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: "rgba(251,146,60,0.12)",
            border: "2px solid rgba(251,146,60,0.18)",
          }}
        />

        {/* Extra floating dot */}
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "5%",
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "rgba(139,92,246,0.08)",
          }}
        />

        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <nav style={{ fontSize: 14, color: "var(--muted)", marginBottom: 24 }}>
            <Link href={`/${locale}`} style={{ color: "var(--blue)", textDecoration: "none" }}>
              {t(loc, "home")}
            </Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "var(--ink)" }}>{t(loc, "updates")}</span>
          </nav>

          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 800,
              color: "var(--ink)",
              margin: "0 0 12px",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
            }}
          >
            {t(loc, "updates_title")}
          </h1>
          <p style={{ fontSize: 18, color: "var(--body)", margin: 0, maxWidth: 640 }}>
            {t(loc, "updates_subtitle")}
          </p>
        </div>
      </section>

      {/* Timeline Content */}
      <div
        style={{
          maxWidth: 800,
          margin: "0 auto",
          padding: "48px 24px 80px",
        }}
      >
        <div style={{ position: "relative" }}>
          {/* Timeline vertical line */}
          <div
            style={{
              position: "absolute",
              left: 19,
              top: 0,
              bottom: 0,
              width: 2,
              background: "var(--line)",
            }}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {updates.map((entry, i) => (
              <article
                key={i}
                className="fade-in"
                style={{
                  position: "relative",
                  paddingLeft: 52,
                }}
              >
                {/* Timeline dot */}
                <div
                  style={{
                    position: "absolute",
                    left: 12,
                    top: 24,
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: i === 0 ? "var(--blue)" : "white",
                    border: `2px solid ${i === 0 ? "var(--blue)" : "var(--line)"}`,
                    zIndex: 1,
                  }}
                />

                <div
                  style={{
                    background: "white",
                    border: "1px solid var(--line)",
                    borderRadius: 16,
                    padding: "20px 24px",
                  }}
                >
                  {/* Date */}
                  <time
                    dateTime={entry.date}
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: "var(--muted)",
                      display: "block",
                      marginBottom: 6,
                    }}
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

                  {/* Title */}
                  <h2
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: "var(--ink)",
                      margin: "0 0 8px",
                    }}
                  >
                    {loc === "ru" ? entry.title_ru : entry.title_en}
                  </h2>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: 14,
                      color: "var(--body)",
                      lineHeight: 1.65,
                      margin: "0 0 12px",
                    }}
                  >
                    {loc === "ru" ? entry.desc_ru : entry.desc_en}
                  </p>

                  {/* Tags */}
                  <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
                    {entry.tags.map((tag) => {
                      const colors = tagColors[tag] || { bg: "rgba(107,114,128,0.10)", text: "#6b7280" };
                      return (
                        <span
                          key={tag}
                          style={{
                            fontSize: 11,
                            fontWeight: 500,
                            padding: "3px 10px",
                            borderRadius: 20,
                            background: colors.bg,
                            color: colors.text,
                          }}
                        >
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatUpdates {
          0%, 100% { transform: translateY(0) rotate(-20deg); }
          50% { transform: translateY(-14px) rotate(-15deg); }
        }
      `}</style>
    </div>
  );
}
