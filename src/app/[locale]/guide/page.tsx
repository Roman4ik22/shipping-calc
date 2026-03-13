import { Metadata } from "next";
import { countries, getCountryName, getPopularCountries } from "@/lib/data";
import { t, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { countryFlag } from "@/lib/flags";
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
  const loc = locale as Locale;
  return {
    title:
      loc === "ru"
        ? "Гиды по доставке — Таможня и правила импорта по странам"
        : "Shipping Guides — Customs & Import Rules by Country",
    description:
      loc === "ru"
        ? "Подробные гиды по доставке для каждой страны. Таможенные правила, пошлины, лучшие перевозчики и советы."
        : "Detailed shipping guides for every country. Customs rules, duties, best carriers and tips.",
    alternates: {
      canonical: `/${locale}/guide`,
      languages: { en: "/en/guide", ru: "/ru/guide" },
    },
  };
}

export default async function GuidesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;
  const popular = getPopularCountries();

  // Group countries by continent
  const continents = new Map<string, typeof countries>();
  for (const c of countries) {
    const list = continents.get(c.continent) || [];
    list.push(c);
    continents.set(c.continent, list);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
        {loc === "ru"
          ? "Гиды по доставке"
          : "Shipping Guides"}
      </h1>
      <p className="text-gray-600 mb-8 max-w-3xl">
        {loc === "ru"
          ? "Выберите страну для получения подробной информации о таможенных правилах, пошлинах, лучших перевозчиках и советах по доставке."
          : "Select a country to get detailed information about customs rules, duties, best carriers, and shipping tips."}
      </p>

      {/* Popular guides */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {loc === "ru" ? "Популярные гиды" : "Popular Guides"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {popular.slice(0, 12).map((c) => (
            <Link
              key={c.code}
              href={`/${locale}/guide/${c.slug_en}`}
              className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <span className="text-2xl">{countryFlag(c.code)}</span>
              <div>
                <p className="font-medium text-gray-900">
                  {getCountryName(c, loc)}
                </p>
                <p className="text-xs text-gray-500">{c.continent}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* All countries by continent */}
      {[...continents.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([continent, list]) => (
          <section key={continent} className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              {continent}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {list
                .sort((a, b) =>
                  getCountryName(a, loc).localeCompare(getCountryName(b, loc))
                )
                .map((c) => (
                  <Link
                    key={c.code}
                    href={`/${locale}/guide/${c.slug_en}`}
                    className="text-sm text-gray-600 hover:text-blue-600 py-1"
                  >
                    {countryFlag(c.code)} {getCountryName(c, loc)}
                  </Link>
                ))}
            </div>
          </section>
        ))}

      {/* BreadcrumbList JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: t(loc, "home"),
                item: `${process.env.NEXT_PUBLIC_BASE_URL || "https://shipworldwide.com"}/${locale}`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: loc === "ru" ? "Гиды" : "Guides",
              },
            ],
          }),
        }}
      />
    </div>
  );
}
