import { Metadata } from "next";
import { countries, getCountryBySlug, getCountryName, makeCorridorSlug, getPopularCountries } from "@/lib/data";
import { t, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
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
    title: t(loc, "meta_country_from_title", {
      country: getCountryName(country, loc),
    }),
  };
}

export default async function FromCountryPage({
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
  for (const dest of countries) {
    if (dest.code === country.code) continue;
    const existing = continents.get(dest.continent) ?? [];
    existing.push(dest);
    continents.set(dest.continent, existing);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-blue-600">
          {t(loc, "home")}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">
          {t(loc, "ship_from", { country: name })}
        </span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {t(loc, "ship_from", { country: name })}
      </h1>
      <p className="text-gray-600 mb-8">
        {loc === "ru"
          ? `Сравните тарифы доставки из ${name} в любую страну мира`
          : `Compare shipping rates from ${name} to any country worldwide`}
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {t(loc, "popular_destinations")}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {getPopularCountries()
            .filter((c) => c.code !== country.code)
            .slice(0, 12)
            .map((dest) => (
              <Link
                key={dest.code}
                href={`/${locale}/shipping/${makeCorridorSlug(country, dest, loc)}`}
                className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm"
              >
                <p className="font-medium">
                  {name} → {getCountryName(dest, loc)}
                </p>
              </Link>
            ))}
        </div>
      </section>

      {Array.from(continents.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([continent, dests]) => (
          <section key={continent} className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
              {continent}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {dests
                .sort((a, b) =>
                  getCountryName(a, loc).localeCompare(getCountryName(b, loc))
                )
                .map((dest) => (
                  <Link
                    key={dest.code}
                    href={`/${locale}/shipping/${makeCorridorSlug(country, dest, loc)}`}
                    className="text-sm text-blue-600 hover:text-blue-800 py-1"
                  >
                    {getCountryName(dest, loc)}
                  </Link>
                ))}
            </div>
          </section>
        ))}
    </div>
  );
}
