import { Metadata } from "next";
import { countries, getCountryName, getPopularCountries } from "@/lib/data";
import { t, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { countryFlag } from "@/lib/flags";
import Link from "next/link";
import ExpandableGrid from "@/components/ExpandableGrid";

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
    title: t(loc, "guides_title"),
    description: t(loc, "guides_desc"),
    alternates: {
      canonical: `/${locale}/guide`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}/guide`])),
        "x-default": "/en/guide",
      },
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
      <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-4">
        {t(loc, "guides_heading")}
      </h1>
      <p className="text-body mb-8 max-w-3xl">
        {t(loc, "guides_subtitle")}
      </p>

      {/* Popular guides — mixed layout: 3 featured + rest compact */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-ink mb-4">
          {t(loc, "popular_guides")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          {popular.slice(0, 3).map((c) => (
            <Link
              key={c.code}
              href={`/${locale}/guide/${c.slug_en}`}
              prefetch={false}
              className="bg-surface border border-line rounded-lg p-5 hover:border-accent/50 transition-all"
            >
              <span className="text-3xl">{countryFlag(c.code)}</span>
              <p className="font-medium text-ink mt-2">{getCountryName(c, loc)}</p>
              <p className="text-xs text-muted">{c.continent}</p>
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {popular.slice(3, 12).map((c) => (
            <Link
              key={c.code}
              href={`/${locale}/guide/${c.slug_en}`}
              prefetch={false}
              className="flex items-center gap-2 bg-card hover:bg-card-hover rounded-lg px-3 py-2 transition-colors text-sm"
            >
              <span className="text-lg">{countryFlag(c.code)}</span>
              <span className="text-body">{getCountryName(c, loc)}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* All countries by continent */}
      {[...continents.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([continent, list]) => {
          const sorted = list.sort((a, b) =>
            getCountryName(a, loc).localeCompare(getCountryName(b, loc))
          );
          return (
            <section key={continent} className="mb-8">
              <h2 className="text-lg font-bold text-ink mb-3 flex items-center gap-2">
                <span className="inline-block w-8 h-0.5 bg-accent/40 rounded-full" />
                {continent}
              </h2>
              <ExpandableGrid
                visibleCount={12}
                showMoreLabel={t(loc, "show_all")}
                showLessLabel={t(loc, "show_less")}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2"
              >
                {sorted.map((c) => (
                  <Link
                    key={c.code}
                    href={`/${locale}/guide/${c.slug_en}`}
                    prefetch={false}
                    className="text-sm text-body hover:text-accent-light hover:translate-x-1 transition-all duration-150 py-1"
                  >
                    <span className="text-2xl mr-1">{countryFlag(c.code)}</span> {getCountryName(c, loc)}
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
                name: t(loc, "guides_heading"),
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
            "@type": "CollectionPage",
            name: t(loc, "guides_title"),
            description: t(loc, "guides_desc"),
            url: `https://rateships.com/${locale}/guide`,
            inLanguage: locale,
            isPartOf: { "@type": "WebSite", name: "RateShips", url: "https://rateships.com" },
            dateModified: "2026-04-03",
          }),
        }}
      />
    </div>
  );
}
