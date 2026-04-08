import { Metadata } from "next";
import { countries, getCountryBySlug, getCountryName, makeCorridorSlug, getPopularCountries } from "@/lib/data";
import { t, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { countryFlag } from "@/lib/flags";
import { getCorridorLocales } from "@/lib/country-locale";
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import Link from "next/link";
import ExpandableGrid from "@/components/ExpandableGrid";

export const dynamicParams = true;

export function generateStaticParams() {
  const params: { locale: string; country: string }[] = [];
  const popularCodes = new Set(["US","GB","DE","CN","JP","AU","CA","RU","FR","KR","IN","AE","SG","BR","IT","ES"]);
  for (const c of countries) {
    if (!popularCodes.has(c.code)) continue;
    // Only en + country's own language
    params.push({ locale: "en", country: c.slug_en });
    const countryLocales = getCorridorLocales(c.code, c.code);
    for (const locale of countryLocales) {
      if (locale !== "en") params.push({ locale, country: c.slug_en });
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
    description:
      t(loc, "meta_country_from_desc", { country: getCountryName(country, loc) }),
    alternates: {
      canonical: `/${locale}/shipping/from/${slug}`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}/shipping/from/${slug}`])),
        "x-default": `/en/shipping/from/${slug}`,
      },
    },
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
    notFound();
  }

  const validLocales = getCorridorLocales(country.code, country.code);
  if (!validLocales.includes(loc)) {
    redirect(`/en/shipping/from/${country.slug_en}`);
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
      <nav className="text-sm text-gray-400 mb-6">
        <Link href={`/${locale}`} className="hover:text-accent-light">
          {t(loc, "home")}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-white">
          {t(loc, "ship_from", { country: name })}
        </span>
      </nav>

      <h1 className="text-3xl font-bold text-white mb-2">
        {countryFlag(country.code)} {t(loc, "ship_from", { country: name })}
      </h1>
      <p className="text-gray-400 mb-8">
        {t(loc, "meta_country_from_desc", { country: name })}
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">
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
                prefetch={false}
                className="block bg-surface border border-white/10 rounded-lg p-4 hover:border-accent/50"
              >
                <p className="font-medium">
                  {countryFlag(country.code)} {name} → {getCountryName(dest, loc)} {countryFlag(dest.code)}
                </p>
              </Link>
            ))}
        </div>
      </section>

      {Array.from(continents.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([continent, dests]) => {
          const sorted = dests.sort((a, b) =>
            getCountryName(a, loc).localeCompare(getCountryName(b, loc))
          );
          return (
            <section key={continent} className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
                {continent}
              </h2>
              <ExpandableGrid
                visibleCount={12}
                showMoreLabel={locale === "ru" ? "Показать все" : "Show all"}
                showLessLabel={locale === "ru" ? "Свернуть" : "Show less"}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2"
              >
                {sorted.map((dest) => (
                  <Link
                    key={dest.code}
                    href={`/${locale}/shipping/${makeCorridorSlug(country, dest, loc)}`}
                    prefetch={false}
                    className="text-sm text-accent-light hover:text-white py-1"
                  >
                    {getCountryName(dest, loc)}
                  </Link>
                ))}
              </ExpandableGrid>
            </section>
          );
        })}
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
                item: `${"https://rateships.com"}/${locale}`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: t(loc, "ship_from", { country: name }),
              },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: t(loc, "meta_country_from_title", { country: name }),
            description: t(loc, "meta_country_from_desc", { country: name }),
            url: `https://rateships.com/${locale}/shipping/from/${slug}`,
            inLanguage: locale,
            isPartOf: { "@type": "WebSite", name: "RateShips", url: "https://rateships.com" },
            dateModified: "2026-04-03",
          }),
        }}
      />
    </div>
  );
}
