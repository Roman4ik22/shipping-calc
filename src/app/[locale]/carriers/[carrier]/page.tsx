import { Metadata } from "next";
import { carriers, getCarrierById, getCarrierDescription, getPopularCountries, getCountryName, makeCorridorSlug } from "@/lib/data";
import { getCarrierReview } from "@/lib/reviews";
import { t, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { countryFlag } from "@/lib/flags";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamicParams = true;

export function generateStaticParams() {
  const params: { locale: string; carrier: string }[] = [];
  const topIds = new Set(["dhl-express","fedex","ups","ems","usps","royal-mail","japan-post","dpd","aramex","sf-express"]);
  for (const locale of locales) {
    for (const c of carriers) {
      if (topIds.has(c.id)) params.push({ locale, carrier: c.id });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; carrier: string }>;
}): Promise<Metadata> {
  const { locale, carrier: carrierId } = await params;
  const carrier = getCarrierById(carrierId);
  if (!carrier) return { title: "Not Found" };

  const desc = getCarrierDescription(carrier, locale as Locale);
  return {
    title: `${carrier.name} — ${t(locale as Locale, "shipping")}`,
    description: desc,
    alternates: {
      canonical: `/${locale}/carriers/${carrierId}`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}/carriers/${carrierId}`])),
        "x-default": `/en/carriers/${carrierId}`,
      },
    },
    openGraph: {
      title: `${carrier.name} — International Shipping Rates`,
      description: desc,
      type: "website",
    },
  };
}

export default async function CarrierPage({
  params,
}: {
  params: Promise<{ locale: string; carrier: string }>;
}) {
  const { locale, carrier: carrierId } = await params;
  const loc = locale as Locale;
  const carrier = getCarrierById(carrierId);

  if (!carrier) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-gray-400 mb-6">
        <Link href={`/${locale}`} className="hover:text-accent-light">
          {t(loc, "home")}
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/carriers`} className="hover:text-accent-light">
          {t(loc, "carriers_page")}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-white">{carrier.name}</span>
      </nav>

      <div className="bg-surface rounded-xl border border-white/10 p-6 sm:p-8 mb-8">
        <div className="flex items-start gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {carrier.name}
            </h1>
            <span
              className={`inline-block mt-2 px-3 py-1 text-sm rounded-full ${
                carrier.type === "international"
                  ? "bg-purple-500/20 text-purple-400"
                  : carrier.type === "postal"
                  ? "bg-orange-500/20 text-orange-400"
                  : "bg-teal-500/20 text-teal-400"
              }`}
            >
              {carrier.type}
            </span>
          </div>
        </div>

        <p className="text-gray-400 text-lg mb-6">
          {getCarrierDescription(carrier, loc)}
        </p>

        {/* Trustpilot Review */}
        {(() => {
          const review = getCarrierReview(carrierId);
          if (!review) return null;
          const { rating, reviews, url } = review.trustpilot;
          const ratingColor = rating >= 3.5 ? "text-green-400" :
            rating >= 2.5 ? "text-yellow-400" :
            rating >= 1.5 ? "text-orange-400" : "text-red-400";
          const barWidth = (rating / 5) * 100;
          return (
            <div className="mb-6 p-4 bg-dark-700 rounded-lg border border-white/10">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Trustpilot</span>
                  <span className={`text-lg font-bold ${ratingColor}`}>★ {rating.toFixed(1)}</span>
                  <span className="text-sm text-gray-500">/ 5.0</span>
                </div>
                <div className="flex-1 min-w-[120px] max-w-[200px]">
                  <div className="h-2 bg-dark-600 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${rating >= 3.5 ? "bg-green-500" : rating >= 2.5 ? "bg-yellow-500" : rating >= 1.5 ? "bg-orange-500" : "bg-red-500"}`} style={{ width: `${barWidth}%` }} />
                  </div>
                </div>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-accent-light hover:text-white transition-colors"
                >
                  {reviews >= 1000 ? `${(reviews / 1000).toFixed(1)}K` : reviews} reviews →
                </a>
              </div>
            </div>
          );
        })()}

        <div className="flex gap-4">
          <a
            href={carrier.website}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-accent text-white rounded-lg text-sm hover:bg-accent-dark transition-colors"
          >
            {t(loc, "official_website")}
          </a>
        </div>
      </div>

      <h2 className="text-xl font-bold text-white mb-4">
        {t(loc, "available_services")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {carrier.services.map((service) => (
          <div
            key={service.id}
            className="bg-surface border border-white/10 rounded-lg p-5"
          >
            <h3 className="font-semibold text-white mb-2">
              {service.name}
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-400">
                  {t(loc, "delivery_time")}:
                </span>
                <p className="font-medium">
                  {service.speed_days_min}–{service.speed_days_max}{" "}
                  {t(loc, "days")}
                </p>
              </div>
              <div>
                <span className="text-gray-400">
                  {t(loc, "max_weight")}:
                </span>
                <p className="font-medium">{service.max_weight_kg} {t(loc, "kg")}</p>
              </div>
              <div>
                <span className="text-gray-400">{t(loc, "tracking")}:</span>
                <p className="font-medium">
                  {service.tracking ? t(loc, "yes") : t(loc, "no")}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Popular corridors for this carrier */}
      <h2 className="text-xl font-bold text-white mb-4">
        {t(loc, "popular_routes_carrier", { carrier: carrier.name })}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {(() => {
          const popular = getPopularCountries().slice(0, 10);
          const corridors: { from: typeof popular[0]; to: typeof popular[0] }[] = [];
          for (let i = 0; i < popular.length && corridors.length < 9; i++) {
            for (let j = 0; j < popular.length && corridors.length < 9; j++) {
              if (i !== j) corridors.push({ from: popular[i], to: popular[j] });
            }
          }
          return corridors.map(({ from, to }) => (
            <Link
              key={`${from.code}-${to.code}`}
              href={`/${locale}/shipping/${makeCorridorSlug(from, to, loc)}`}
              className="block bg-surface border border-white/10 rounded-lg p-3 hover:border-accent/50 transition-all text-sm"
            >
              {countryFlag(from.code)} {getCountryName(from, loc)} → {getCountryName(to, loc)} {countryFlag(to.code)}
            </Link>
          ));
        })()}
      </div>

      {/* Shipping guides */}
      <h2 className="text-xl font-bold text-white mb-4">
        {t(loc, "guides_heading")}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-8">
        {getPopularCountries().slice(0, 8).map((c) => (
          <Link
            key={c.code}
            href={`/${locale}/guide/${c.slug_en}`}
            className="text-sm text-accent-light hover:text-white py-1"
          >
            {countryFlag(c.code)} {getCountryName(c, loc)}
          </Link>
        ))}
      </div>

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
                name: t(loc, "carriers_page"),
                item: `${"https://rateships.com"}/${locale}/carriers`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: carrier.name,
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
            name: `${carrier.name} — ${t(loc, "shipping")}`,
            description: getCarrierDescription(carrier, loc),
            url: `https://rateships.com/${locale}/carriers/${carrierId}`,
            inLanguage: locale,
            isPartOf: { "@type": "WebSite", name: "RateShips", url: "https://rateships.com" },
            dateModified: "2026-04-03",
          }),
        }}
      />

      {/* Back to carriers */}
      <Link
        href={`/${locale}/carriers`}
        className="text-accent-light hover:text-white text-sm"
      >
        ← {t(loc, "all_carriers")}
      </Link>
    </div>
  );
}
