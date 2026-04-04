import { Metadata } from "next";
import { locales } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import Link from "next/link";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isRu = locale === "ru";
  return {
    title: isRu
      ? "Команда RateShips — о платформе и процессах"
      : "About the RateShips Team",
    description: isRu
      ? "RateShips — независимая платформа данных о доставке. Узнайте о нашей команде, процессах сбора данных и обязательствах по качеству."
      : "RateShips is an independent shipping data platform. Learn about our team, data collection processes, and quality commitments.",
    alternates: {
      canonical: `/${locale}/team`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}/team`])),
        "x-default": "/en/team",
      },
    },
  };
}

export default async function TeamPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isRu = locale === "ru";

  const teams = [
    {
      title: isRu ? "Аналитики тарифов" : "Rate Analysts",
      description: isRu
        ? "Еженедельно проверяют опубликованные тарифы перевозчиков, отслеживают повышения тарифов (GRI) и обновляют нашу базу данных из 143 перевозчиков."
        : "Verify published carrier tariffs weekly, track General Rate Increases (GRI), and update our database of 143 carriers.",
      icon: (
        <svg
          className="w-8 h-8 text-accent-light"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
          />
        </svg>
      ),
    },
    {
      title: isRu ? "Специалисты по таможне" : "Customs Specialists",
      description: isRu
        ? "Отслеживают изменения в таможенном законодательстве 213 стран, обновляют пороги de minimis, ставки пошлин и НДС/GST."
        : "Monitor regulatory changes across 213 countries, update de minimis thresholds, duty rates, and VAT/GST information.",
      icon: (
        <svg
          className="w-8 h-8 text-accent-light"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
          />
        </svg>
      ),
    },
    {
      title: isRu ? "Инженерия" : "Engineering",
      description: isRu
        ? "Поддерживают конвейеры обработки данных, инфраструктуру платформы и системы автоматизированного сбора тарифов."
        : "Maintain data pipelines, platform infrastructure, and automated rate collection systems.",
      icon: (
        <svg
          className="w-8 h-8 text-accent-light"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
          />
        </svg>
      ),
    },
    {
      title: isRu ? "Контент" : "Content",
      description: isRu
        ? "Создают путеводители по доставке, образовательные ресурсы и страновые обзоры для помощи пользователям."
        : "Produce shipping guides, educational resources, and country-specific overviews to help users ship internationally.",
      icon: (
        <svg
          className="w-8 h-8 text-accent-light"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Organization + BreadcrumbList JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: isRu ? "Главная" : "Home",
                  item: `https://rateships.com/${locale}`,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: isRu ? "Команда" : "Team",
                },
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "RateShips",
              url: "https://rateships.com",
              logo: "https://rateships.com/favicon.svg",
              description: isRu
                ? "Независимая платформа данных о международной доставке"
                : "Independent international shipping data platform",
              foundingDate: "2026",
              knowsAbout: [
                "International shipping rates",
                "Customs duties and taxes",
                "Carrier comparison",
                "Cross-border logistics",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer support",
                url: "https://rateships.com/en/about",
                availableLanguage: [
                  "English",
                  "Russian",
                  "Spanish",
                  "German",
                  "French",
                  "Portuguese",
                  "Chinese",
                  "Japanese",
                  "Korean",
                  "Arabic",
                  "Turkish",
                  "Italian",
                ],
              },
            },
          ]),
        }}
      />

      <nav className="text-sm text-gray-400 mb-6">
        <Link href={`/${locale}`} className="hover:text-accent-light">
          {isRu ? "Главная" : "Home"}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-white">
          {isRu ? "Команда" : "Team"}
        </span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
        {isRu ? "О команде RateShips" : "About the RateShips Team"}
      </h1>

      <div className="space-y-8 text-gray-300 leading-relaxed">
        {/* ── Mission Statement ── */}
        <section className="bg-surface border border-white/10 rounded-lg p-6">
          <p className="text-lg">
            {isRu
              ? "RateShips — это независимая платформа данных о доставке. Мы используем комбинацию автоматизированного сбора данных, ручной проверки и анализа с помощью ИИ для поддержания наиболее полной базы данных тарифов на международную доставку."
              : "RateShips is an independent shipping data platform. We use a combination of automated data collection, manual verification, and AI-assisted analysis to maintain the most comprehensive international shipping rate database available."}
          </p>
        </section>

        {/* ── Our Data Team ── */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">
            {isRu ? "Наша команда" : "Our Data Team"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {teams.map((team) => (
              <div
                key={team.title}
                className="bg-surface border border-white/10 rounded-lg p-6"
              >
                <div className="mb-4">{team.icon}</div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  {team.title}
                </h3>
                <p className="text-sm text-gray-400">{team.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── What We Do ── */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">
            {isRu ? "Что мы делаем" : "What We Do"}
          </h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent-light/10 flex items-center justify-center text-accent-light font-bold">
                1
              </div>
              <div>
                <p className="text-white font-semibold">
                  {isRu ? "Собираем" : "Collect"}
                </p>
                <p className="text-sm text-gray-400">
                  {isRu
                    ? "Ежедневно собираем данные с сайтов 143 перевозчиков и 40+ таможенных органов."
                    : "Gather data daily from 143 carrier websites and 40+ customs authority sites."}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent-light/10 flex items-center justify-center text-accent-light font-bold">
                2
              </div>
              <div>
                <p className="text-white font-semibold">
                  {isRu ? "Проверяем" : "Verify"}
                </p>
                <p className="text-sm text-gray-400">
                  {isRu
                    ? "Сверяем данные с официальными тарифными таблицами и прайс-листами."
                    : "Cross-reference data against official tariff schedules and published price lists."}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent-light/10 flex items-center justify-center text-accent-light font-bold">
                3
              </div>
              <div>
                <p className="text-white font-semibold">
                  {isRu ? "Нормализуем" : "Normalize"}
                </p>
                <p className="text-sm text-gray-400">
                  {isRu
                    ? "Приводим все тарифы к единому формату: USD, килограммы, стандартные зоны доставки."
                    : "Convert all rates to a unified format: USD, kilograms, standardized delivery zones."}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent-light/10 flex items-center justify-center text-accent-light font-bold">
                4
              </div>
              <div>
                <p className="text-white font-semibold">
                  {isRu ? "Публикуем" : "Publish"}
                </p>
                <p className="text-sm text-gray-400">
                  {isRu
                    ? "Предоставляем сравнительные данные с прозрачной маркировкой верифицированных и оценочных тарифов."
                    : "Present comparative data with transparent labeling of verified vs. estimated rates."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Our Commitment ── */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">
            {isRu
              ? "Наши обязательства"
              : "Our Commitment to Accuracy"}
          </h2>
          <div className="bg-surface border border-white/10 rounded-lg p-6 space-y-3">
            <p className="text-gray-300">
              {isRu
                ? "Мы стремимся к точности и прозрачности. Каждый тариф в нашей базе данных имеет маркировку: проверенный из официального источника или оценочный."
                : "We are committed to accuracy and transparency. Every rate in our database is labeled as either verified from an official source or estimated."}
            </p>
            <p className="text-gray-300">
              {isRu
                ? "Если вы обнаружили неточность в наших данных, пожалуйста, сообщите нам через "
                : "If you find any inaccuracy in our data, please contact us through our "}
              <Link
                href={`/${locale}/about`}
                className="text-accent-light hover:underline"
              >
                {isRu ? "страницу контактов" : "contact page"}
              </Link>
              {isRu
                ? ". Мы исправим информацию в кратчайшие сроки."
                : ". We will correct the information as quickly as possible."}
            </p>
          </div>
        </section>

        {/* ── Related Pages ── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href={`/${locale}/data-methodology`}
            className="bg-surface border border-white/10 rounded-lg p-5 hover:border-accent-light/30 transition-colors"
          >
            <p className="text-white font-semibold mb-1">
              {isRu ? "Методология данных" : "Data Methodology"}
            </p>
            <p className="text-sm text-gray-400">
              {isRu
                ? "Как мы собираем и проверяем данные"
                : "How we collect and verify our data"}
            </p>
          </Link>
          <Link
            href={`/${locale}/sources`}
            className="bg-surface border border-white/10 rounded-lg p-5 hover:border-accent-light/30 transition-colors"
          >
            <p className="text-white font-semibold mb-1">
              {isRu ? "Источники данных" : "Data Sources"}
            </p>
            <p className="text-sm text-gray-400">
              {isRu
                ? "Полный перечень всех наших источников"
                : "Complete list of all our data sources"}
            </p>
          </Link>
        </section>

        <p className="text-sm text-gray-500 pt-4 border-t border-white/10">
          {isRu
            ? "Последнее обновление: март 2026"
            : "Last updated: March 2026"}
        </p>
      </div>
    </div>
  );
}
