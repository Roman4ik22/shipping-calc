import { Metadata } from "next";
import { countries, getCountryBySlug, getCountryName, makeCorridorSlug, getPopularCountries } from "@/lib/data";
import { t, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { countryFlag } from "@/lib/flags";
import Link from "next/link";

export function generateStaticParams() {
  const params: { locale: string; country: string }[] = [];
  for (const locale of locales) {
    for (const c of countries) {
      params.push({ locale, country: c.slug_en });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; country: string }>;
}): Promise<Metadata> {
  const { locale, country: slug } = await params;
  const loc = locale as Locale;
  const country = getCountryBySlug(slug, "en");
  if (!country) return { title: "Not Found" };

  return {
    title: t(loc, "meta_country_to_title", {
      country: getCountryName(country, loc),
    }),
    description:
      loc === "ru"
        ? `Сравните тарифы доставки в ${getCountryName(country, loc)} из любой страны мира. Цены от DHL, FedEx, UPS, EMS и 100+ перевозчиков.`
        : `Compare shipping rates to ${getCountryName(country, loc)} from any country worldwide. Prices from DHL, FedEx, UPS, EMS and 100+ carriers.`,
    alternates: {
      canonical: `/${locale}/shipping/to/${slug}`,
      languages: {
        en: `/en/shipping/to/${slug}`,
        ru: `/ru/shipping/to/${slug}`,
      },
    },
  };
}

export default async function ToCountryPage({
  params,
}: {
  params: Promise<{ locale: string; country: string }>;
}) {
  const { locale, country: slug } = await params;
  const loc = locale as Locale;
  const country = getCountryBySlug(slug, "en");

  if (!country) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Country not found</h1>
      </div>
    );
  }

  const name = getCountryName(country, loc);

  const continents = new Map<string, typeof countries>();
  for (const orig of countries) {
    if (orig.code === country.code) continue;
    const existing = continents.get(orig.continent) ?? [];
    existing.push(orig);
    continents.set(orig.continent, existing);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-blue-600">
          {t(loc, "home")}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">
          {t(loc, "ship_to", { country: name })}
        </span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {countryFlag(country.code)} {t(loc, "ship_to", { country: name })}
      </h1>
      <p className="text-gray-600 mb-8">
        {loc === "ru"
          ? `Сравните тарифы доставки в ${name} из любой страны мира`
          : `Compare shipping rates to ${name} from any country worldwide`}
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {t(loc, "popular_origins")}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {getPopularCountries()
            .filter((c) => c.code !== country.code)
            .slice(0, 12)
            .map((orig) => (
              <Link
                key={orig.code}
                href={`/${locale}/shipping/${makeCorridorSlug(orig, country, loc)}`}
                className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm"
              >
                <p className="font-medium">
                  {countryFlag(orig.code)} {getCountryName(orig, loc)} → {name} {countryFlag(country.code)}
                </p>
              </Link>
            ))}
        </div>
      </section>

      {Array.from(continents.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([continent, origs]) => (
          <section key={continent} className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
              {continent}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {origs
                .sort((a, b) =>
                  getCountryName(a, loc).localeCompare(getCountryName(b, loc))
                )
                .map((orig) => (
                  <Link
                    key={orig.code}
                    href={`/${locale}/shipping/${makeCorridorSlug(orig, country, loc)}`}
                    className="text-sm text-blue-600 hover:text-blue-800 py-1"
                  >
                    {getCountryName(orig, loc)}
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
                name: t(loc, "ship_to", { country: name }),
              },
            ],
          }),
        }}
      />
    </div>
  );
}
