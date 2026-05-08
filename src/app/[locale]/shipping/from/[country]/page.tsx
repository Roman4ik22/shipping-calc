import { Metadata } from "next";
import { countries, getCountryBySlug, getCountryName, makeCorridorSlug, getPopularCountries } from "@/lib/data";
import { t, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { countryFlag } from "@/lib/flags";
import { getCorridorLocales } from "@/lib/country-locale";
import { notFound } from "next/navigation";
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

  // Smart locale: canonical → /en + noindex when irrelevant locale.
  const validLocales = getCorridorLocales(country.code, country.code);
  const isLocaleRelevant = validLocales.includes(loc);
  const canonicalPath = isLocaleRelevant
    ? `/${locale}/shipping/from/${slug}`
    : `/en/shipping/from/${slug}`;

  return {
    title: t(loc, "meta_country_from_title", {
      country: getCountryName(country, loc),
    }),
    description:
      t(loc, "meta_country_from_desc", { country: getCountryName(country, loc) }),
    alternates: {
      canonical: canonicalPath,
      languages: {
        ...Object.fromEntries(validLocales.map((l) => [l, `/${l}/shipping/from/${slug}`])),
        "x-default": `/en/shipping/from/${slug}`,
      },
    },
    robots: isLocaleRelevant ? undefined : { index: false, follow: true },
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
  // No redirect — see generateMetadata for canonical/noindex pattern.

  const name = getCountryName(country, loc);

  const continents = new Map<string, typeof countries>();
  for (const dest of countries) {
    if (dest.code === country.code) continue;
    const existing = continents.get(dest.continent) ?? [];
    existing.push(dest);
    continents.set(dest.continent, existing);
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line" style={{
        backgroundImage: `
          radial-gradient(900px 400px at 70% -10%, rgba(26,115,232,.08), transparent 60%),
          radial-gradient(600px 300px at -5% 50%, rgba(232,92,58,.05), transparent 60%),
          linear-gradient(var(--line-2) 1px, transparent 1px),
          linear-gradient(90deg, var(--line-2) 1px, transparent 1px)`,
        backgroundSize: 'auto, auto, 48px 48px, 48px 48px',
        maskImage: 'linear-gradient(180deg, #000 60%, transparent 100%)'
      }}>
        <div aria-hidden className="hero-shape-a absolute hidden md:block" style={{top:'20%', right:'8%', width:60, height:60, borderRadius:14, background:'linear-gradient(135deg, var(--warm) 0%, #E8B43D 100%)', transform:'rotate(-8deg)', boxShadow:'0 14px 30px -8px rgba(242,201,76,.4)', opacity:0.7}} />
        <div aria-hidden className="hero-shape-b absolute hidden md:block" style={{bottom:'25%', right:'18%', width:40, height:40, borderRadius:10, background:'var(--accent)', transform:'rotate(12deg)', opacity:0.6, boxShadow:'0 10px 20px -6px rgba(232,92,58,.4)'}} />

        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <nav className="text-sm text-body mb-6">
            <Link href={`/${locale}`} className="hover:text-accent-light">
              {t(loc, "home")}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink">
              {t(loc, "ship_from", { country: name })}
            </span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-2">
            {countryFlag(country.code)} {t(loc, "country_from_h1", { country: name })}
          </h1>
          <p className="text-body max-w-2xl">
            {t(loc, "meta_country_from_desc", { country: name })}
          </p>
        </div>
      </section>

    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section className="mb-10">
        <h2 className="text-xl font-bold text-ink mb-4">
          {t(loc, "popular_destinations")}
        </h2>
        {/* Top 3 featured + rest as compact links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          {getPopularCountries()
            .filter((c) => c.code !== country.code)
            .slice(0, 3)
            .map((dest) => (
              <Link key={dest.code} href={`/${locale}/shipping/${makeCorridorSlug(country, dest, loc)}`} prefetch={false}
                className="bg-white rounded-lg p-4 hover:border-accent/50 transition-all" style={{border:'1px solid var(--line)', boxShadow:'var(--shadow-sm)'}}>
                <p className="font-medium text-ink">{countryFlag(country.code)} {name} → {getCountryName(dest, loc)} {countryFlag(dest.code)}</p>
              </Link>
            ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {getPopularCountries()
            .filter((c) => c.code !== country.code)
            .slice(3, 12)
            .map((dest) => (
              <Link key={dest.code} href={`/${locale}/shipping/${makeCorridorSlug(country, dest, loc)}`} prefetch={false}
                className="bg-white hover:bg-[#F8F5EF] card-hover rounded-lg px-3 py-2 text-sm text-body hover:text-ink transition-colors card-hover">
                {name} → {getCountryName(dest, loc)} {countryFlag(dest.code)}
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
                showMoreLabel={t(loc, "show_all")}
                showLessLabel={t(loc, "show_less")}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2"
              >
                {sorted.map((dest) => (
                  <Link
                    key={dest.code}
                    href={`/${locale}/shipping/${makeCorridorSlug(country, dest, loc)}`}
                    prefetch={false}
                    className="text-sm text-accent-light hover:text-ink py-1"
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
            dateModified: new Date().toISOString().split("T")[0],
          }),
        }}
      />
    </div>
    </div>
  );
}
