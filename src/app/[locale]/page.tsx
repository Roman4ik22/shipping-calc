import { countries, getPopularCountries, getCountryName, makeCorridorSlug } from "@/lib/data";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { countryFlag } from "@/lib/flags";
import ShippingForm from "@/components/ShippingForm";
import Link from "next/link";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;
  const popular = getPopularCountries();

  // Popular corridors for display
  const popularCorridors = [
    ["US", "GB"], ["US", "DE"], ["CN", "US"], ["GB", "DE"],
    ["US", "JP"], ["US", "AU"], ["CN", "GB"], ["DE", "FR"],
    ["US", "CA"], ["CN", "JP"], ["RU", "DE"], ["US", "KR"],
    ["MY", "SG"], ["TH", "JP"], ["AE", "IN"], ["BR", "US"],
  ];

  return (
    <div>
      {/* Hero section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-4">
            {t(loc, "compare_shipping_rates")}
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 text-center max-w-3xl mx-auto mb-10">
            {t(loc, "hero_subtitle", { count: "30" })}
          </p>

          {/* Shipping form */}
          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <ShippingForm
              countries={countries.map((c) => ({
                code: c.code,
                name_en: c.name_en,
                name_ru: c.name_ru,
                slug_en: c.slug_en,
                slug_ru: c.slug_ru,
                continent: c.continent,
              }))}
              locale={loc}
              labels={{
                from: t(loc, "from"),
                to: t(loc, "to"),
                submit: t(loc, "get_rates"),
              }}
            />
          </div>
        </div>
      </section>

      {/* Popular corridors */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {t(loc, "popular_destinations")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {popularCorridors.map(([fromCode, toCode]) => {
            const from = countries.find((c) => c.code === fromCode);
            const to = countries.find((c) => c.code === toCode);
            if (!from || !to) return null;
            const slug = makeCorridorSlug(from, to, loc);
            return (
              <Link
                key={`${fromCode}-${toCode}`}
                href={`/${locale}/shipping/${slug}`}
                className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <p className="font-medium text-gray-900">
                  {countryFlag(fromCode)} {getCountryName(from, loc)} → {getCountryName(to, loc)} {countryFlag(toCode)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {t(loc, "compare_rates")}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Ship from / Ship to sections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t(loc, "popular_origins")}
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {popular.slice(0, 16).map((c) => (
                <Link
                  key={c.code}
                  href={`/${locale}/shipping/from/${c.slug_en}`}
                  className="text-sm text-blue-600 hover:text-blue-800 py-1"
                >
                  {t(loc, "ship_from", { country: getCountryName(c, loc) })}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t(loc, "popular_destinations")}
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {popular.slice(0, 16).map((c) => (
                <Link
                  key={c.code}
                  href={`/${locale}/shipping/to/${c.slug_en}`}
                  className="text-sm text-blue-600 hover:text-blue-800 py-1"
                >
                  {t(loc, "ship_to", { country: getCountryName(c, loc) })}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* All countries */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {t(loc, "all_countries")}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {countries.map((c) => (
            <Link
              key={c.code}
              href={`/${locale}/shipping/from/${c.slug_en}`}
              className="text-sm text-gray-600 hover:text-blue-600 py-1"
            >
              {getCountryName(c, loc)}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
