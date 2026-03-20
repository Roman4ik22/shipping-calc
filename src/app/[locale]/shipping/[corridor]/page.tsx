import { Metadata } from "next";
import {
  countries,
  parseCorridorSlug,
  getCorridorData,
  getCountryName,
  makeCorridorSlug,
  getPopularCountries,
  getCarrierDescription,
} from "@/lib/data";
import { getCustomsInfo, getCustomsNotes, hasCustomsData } from "@/lib/customs";
import { getCarrierReview } from "@/lib/reviews";
import { getRouteScore, getScoreLabel } from "@/lib/route-scoring";
import { t, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import RateTable from "@/components/RateTable";
import DutyCalculator from "@/components/DutyCalculator";
import ShareRoute from "@/components/ShareRoute";
import SaveRoute from "@/components/SaveRoute";
import InsuranceComparison from "@/components/InsuranceComparison";
import PriceHistory from "@/components/PriceHistory";
import { countryFlag } from "@/lib/flags";
import Link from "next/link";
import LocaleSuggestion from "@/components/LocaleSuggestion";

// Pre-generate popular corridors; rest generated on-demand via ISR
export const dynamicParams = true;

export function generateStaticParams() {
  const params: { locale: string; corridor: string }[] = [];

  const popularCodes = [
    "US", "GB", "DE", "CN", "JP", "AU", "CA", "RU", "FR", "KR",
  ];

  for (const locale of locales) {
    const loc = locale as Locale;
    for (const fromCode of popularCodes) {
      for (const toCode of popularCodes) {
        if (fromCode === toCode) continue;
        const from = countries.find((c) => c.code === fromCode);
        const to = countries.find((c) => c.code === toCode);
        if (!from || !to) continue;
        params.push({
          locale,
          corridor: makeCorridorSlug(from, to, loc),
        });
      }
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; corridor: string }>;
}): Promise<Metadata> {
  const { locale, corridor } = await params;
  const loc = locale as Locale;
  const parsed = parseCorridorSlug(corridor, loc);

  if (!parsed) {
    return { title: "Not Found" };
  }

  const originName = getCountryName(parsed.origin, loc);
  const destName = getCountryName(parsed.destination, loc);
  const corridorData = getCorridorData(parsed.origin.code, parsed.destination.code);

  return {
    title: t(loc, "meta_corridor_title", {
      origin: originName,
      destination: destName,
    }),
    description: t(loc, "meta_corridor_description", {
      origin: originName,
      destination: destName,
      count: String(corridorData?.carriers.length ?? 30),
    }),
    alternates: {
      canonical: `/${locale}/shipping/${corridor}`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `/${l}/shipping/${makeCorridorSlug(parsed.origin, parsed.destination, l as Locale)}`])
      ),
    },
    openGraph: {
      title: t(loc, "meta_corridor_title", { origin: originName, destination: destName }),
      description: t(loc, "meta_corridor_description", {
        origin: originName,
        destination: destName,
        count: String(corridorData?.carriers.length ?? 30),
      }),
      type: "website",
    },
  };
}

export default async function CorridorPage({
  params,
}: {
  params: Promise<{ locale: string; corridor: string }>;
}) {
  const { locale, corridor } = await params;
  const loc = locale as Locale;
  const parsed = parseCorridorSlug(corridor, loc);

  if (!parsed) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Route not found</h1>
      </div>
    );
  }

  const { origin, destination } = parsed;
  const corridorData = getCorridorData(origin.code, destination.code);
  const originName = getCountryName(origin, loc);
  const destName = getCountryName(destination, loc);

  // Related corridors
  const popular = getPopularCountries();
  const relatedFrom = popular
    .filter((c) => c.code !== origin.code && c.code !== destination.code)
    .slice(0, 6);

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: t(loc, "shipping_from_to", { origin: originName, destination: destName }),
    description: t(loc, "meta_corridor_description", {
      origin: originName,
      destination: destName,
      count: String(corridorData?.carriers.length ?? 0),
    }),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: corridorData?.carriers.length ?? 0,
      itemListElement:
        corridorData?.carriers.slice(0, 10).map((cr, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          item: {
            "@type": "Offer",
            name: `${cr.carrier.name} — ${cr.service.name}`,
            priceCurrency: "USD",
            price: cr.rates.find((r) => r.weight_kg === 1)?.price_usd ?? 0,
          },
        })) ?? [],
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-400 mb-6">
        <Link href={`/${locale}`} className="hover:text-accent-light">
          {t(loc, "home")}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/${locale}/shipping/from/${origin.slug_en}`}
          className="hover:text-accent-light"
        >
          {originName}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-white">{destName}</span>
      </nav>

      {/* Language suggestion based on corridor countries */}
      <LocaleSuggestion
        currentLocale={locale}
        originCode={origin.code}
        destCode={destination.code}
        viewInLabel={t(loc, "view_in")}
      />

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
        <span className="inline-block mr-2">{countryFlag(origin.code)}</span>
        {t(loc, "shipping_from_to", {
          origin: originName,
          destination: destName,
        })}
        <span className="inline-block ml-2">{countryFlag(destination.code)}</span>
      </h1>

      {/* Share & Save */}
      <div className="flex items-center gap-3 mb-4">
        <ShareRoute originName={originName} destName={destName} locale={locale} />
        <SaveRoute corridorSlug={corridor} originName={originName} destName={destName} locale={locale} />
      </div>

      {/* Quick stats */}
      {corridorData && corridorData.carriers.length > 0 && (
        <div className="flex flex-wrap gap-4 mb-8 text-sm text-gray-300">
          <span>
            {corridorData.carriers.length}{" "}
            {t(loc, "shipping_options")}
          </span>
          <span>
            {t(loc, "from_price")} $
            {Math.min(
              ...corridorData.carriers
                .map((c) => c.rates.find((r) => r.weight_kg === 1)?.price_usd ?? 999)
            )}{" "}
            {t(loc, "for_1_kg")}
          </span>
          <span>
            {t(loc, "from_price")}{" "}
            {Math.min(...corridorData.carriers.map((c) => c.estimated_days_min))}{" "}
            {t(loc, "days")}
          </span>
        </div>
      )}

      {/* Rate comparison table */}
      <RateTable
        corridorRates={
          corridorData?.carriers.map((cr) => {
            const review = getCarrierReview(cr.carrier.id);
            const routeScore = getRouteScore(cr.carrier.id, origin.code, destination.code);
            return {
              carrier_name: cr.carrier.name,
              carrier_logo: cr.carrier.logo,
              carrier_type: cr.carrier.type,
              carrier_id: cr.carrier.id,
              service_name: cr.service.name,
              rates: cr.rates,
              estimated_days_min: cr.estimated_days_min,
              estimated_days_max: cr.estimated_days_max,
              tracking: cr.service.tracking,
              review: review ? review.trustpilot : null,
              route_score: routeScore,
              route_score_label: getScoreLabel(routeScore, locale),
              carrier_website: cr.carrier.website,
              tracking_url: cr.carrier.tracking_url,
            };
          }) ?? []
        }
        locale={loc}
        labels={{
          carrier: t(loc, "carrier"),
          service: t(loc, "service"),
          price: t(loc, "price"),
          delivery_time: t(loc, "delivery_time"),
          tracking: t(loc, "tracking"),
          days: t(loc, "days"),
          yes: t(loc, "yes"),
          no: t(loc, "no"),
          cheapest: t(loc, "cheapest"),
          fastest: t(loc, "fastest"),
          select_weight: t(loc, "select_weight"),
          kg: t(loc, "kg"),
          no_rates: t(loc, "no_rates"),
          disclaimer: t(loc, "disclaimer"),
          or_enter_weight: t(loc, "or_enter_weight"),
          hide_dimensions: t(loc, "hide_dimensions"),
          enter_dimensions: t(loc, "enter_dimensions"),
          package_dimensions: t(loc, "package_dimensions"),
          volumetric_weight: t(loc, "volumetric_weight"),
          volumetric_exceeds: t(loc, "volumetric_exceeds"),
          volumetric_formula: t(loc, "volumetric_formula"),
          billed_at: t(loc, "billed_at"),
          nearest_bracket: t(loc, "nearest_bracket"),
          currency: t(loc, "currency"),
          auto_detected: t(loc, "auto_detected"),
          sort: t(loc, "sort"),
          type_label: t(loc, "type_label"),
          all: t(loc, "all"),
          express: t(loc, "express"),
          regional: t(loc, "regional"),
          postal: t(loc, "postal"),
          results: t(loc, "results"),
          compare: t(loc, "compare"),
          comparison: t(loc, "comparison"),
          close: t(loc, "close"),
          no_filter_results: t(loc, "no_filter_results"),
          route_reliability: t(loc, "route_reliability"),
          ship_now: t(loc, "ship_now"),
          track_package: t(loc, "track_package"),
        }}
      />

      {/* Duty Calculator */}
      <div className="mt-8">
        <DutyCalculator
          destCode={destination.code}
          locale={loc}
          labels={{
            title: t(loc, "duty_calc_title"),
            item_value: t(loc, "duty_calc_value"),
            calculate: t(loc, "duty_calc_calculate"),
            duty: t(loc, "duty_calc_duty"),
            vat: t(loc, "duty_calc_vat"),
            total_import_cost: t(loc, "duty_calc_total"),
            de_minimis_note: t(loc, "duty_calc_below"),
            below_threshold: t(loc, "duty_calc_below"),
            currency_label: t(loc, "currency"),
            result_title: t(loc, "duty_calc_result"),
          }}
        />
      </div>

      {/* Insurance Comparison */}
      <div className="mt-8">
        <InsuranceComparison
          labels={{
            title: locale === "ru" ? "Сравнение страхования посылок" : "Shipping Insurance Comparison",
            item_value: locale === "ru" ? "Стоимость товара" : "Item value",
            calculate: t(loc, "duty_calc_calculate"),
            carrier: t(loc, "carrier"),
            included: locale === "ru" ? "Включено" : "Included",
            premium: locale === "ru" ? "Премия" : "Premium",
            payout: locale === "ru" ? "Выплата" : "Payout",
            yes: t(loc, "yes"),
            no: t(loc, "no"),
            note: locale === "ru" ? "Примечание" : "Note",
          }}
        />
      </div>

      {/* Price History */}
      {corridorData && corridorData.carriers.length > 0 && (
        <div className="mt-8">
          <PriceHistory
            carriers={corridorData.carriers.map((cr) => ({
              name: cr.carrier.name,
              service: cr.service.name,
              price: cr.rates.find((r) => r.weight_kg === 1)?.price_usd ?? 0,
            }))}
            labels={{
              title: locale === "ru" ? "Изменение цен за 30 дней" : "Price Changes (30 days)",
              carrier: t(loc, "carrier"),
              current: locale === "ru" ? "Сейчас" : "Current",
              previous: locale === "ru" ? "Было" : "Previous",
              change: locale === "ru" ? "Изменение" : "Change",
              no_changes: locale === "ru" ? "Нет данных об изменениях" : "No price change data available",
            }}
          />
        </div>
      )}

      {/* SEO summary text */}
      {corridorData && corridorData.carriers.length > 0 && (() => {
        const cheapestRate = corridorData.carriers[0];
        const cheapestPrice = cheapestRate.rates.find((r) => r.weight_kg === 1)?.price_usd ?? 0;
        const fastestCarrier = [...corridorData.carriers].sort((a, b) => a.estimated_days_min - b.estimated_days_min)[0];
        return (
          <section className="mt-8 bg-surface-light rounded-lg p-6">
            <h2 className="text-lg font-bold text-white mb-3">
              {t(loc, "shipping_from_to", { origin: originName, destination: destName })}: {t(loc, "overview")}
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              {t(loc, "corridor_overview", {
                count: String(corridorData.carriers.length),
                origin: originName,
                destination: destName,
                cheapest_carrier: cheapestRate.carrier.name,
                cheapest_service: cheapestRate.service.name,
                cheapest_price: String(cheapestPrice),
                fastest_carrier: fastestCarrier.carrier.name,
                fastest_min: String(fastestCarrier.estimated_days_min),
                fastest_max: String(fastestCarrier.estimated_days_max),
              })}
            </p>
          </section>
        );
      })()}

      {/* Related corridors */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-white mb-4">
          {t(loc, "also_ships_to", { origin: originName })}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {relatedFrom.map((c) => (
            <Link
              key={c.code}
              href={`/${locale}/shipping/${makeCorridorSlug(origin, c, loc)}`}
              className="block bg-surface border border-white/10 rounded-lg p-3 hover:border-accent/50 text-sm"
            >
              {getCountryName(c, loc)}
            </Link>
          ))}
        </div>
      </section>

      {/* Ships to destination from other origins */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-white mb-4">
          {t(loc, "ship_to", { country: destName })}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {popular
            .filter((c) => c.code !== origin.code && c.code !== destination.code)
            .slice(0, 6)
            .map((c) => (
              <Link
                key={c.code}
                href={`/${locale}/shipping/${makeCorridorSlug(c, destination, loc)}`}
                className="block bg-surface border border-white/10 rounded-lg p-3 hover:border-accent/50 text-sm"
              >
                {getCountryName(c, loc)}
              </Link>
            ))}
        </div>
      </section>

      {/* Carrier links */}
      {corridorData && corridorData.carriers.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-bold text-white mb-4">
            {t(loc, "carriers_page")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {[...new Set(corridorData.carriers.map((cr) => cr.carrier.id))].slice(0, 12).map((carrierId) => {
              const carrier = corridorData.carriers.find((cr) => cr.carrier.id === carrierId)?.carrier;
              if (!carrier) return null;
              return (
                <Link
                  key={carrierId}
                  href={`/${locale}/carriers/${carrierId}`}
                  className="text-sm bg-surface border border-white/10 rounded-full px-4 py-2 hover:border-accent/50 hover:text-accent-light"
                >
                  {carrier.name}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Customs info for destination */}
      {hasCustomsData(destination.code) && (() => {
        const customs = getCustomsInfo(destination.code);
        return (
          <section className="mt-12">
            <h2 className="text-xl font-bold text-white mb-4">
              {t(loc, "customs_for", { country: destName })}
            </h2>
            <div className="bg-surface border border-white/10 rounded-lg p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-400">{t(loc, "de_minimis")}</p>
                  <p className="text-lg font-semibold">
                    {customs.de_minimis_usd > 0 ? `$${customs.de_minimis_usd}` : t(loc, "duty_from_zero")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">{t(loc, "vat_rate")}</p>
                  <p className="text-lg font-semibold">{customs.vat_rate}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">{t(loc, "avg_duty")}</p>
                  <p className="text-lg font-semibold">{customs.avg_duty_rate}%</p>
                </div>
              </div>
              {getCustomsNotes(customs, loc) && (
                <p className="text-sm text-gray-400 mb-3">
                  <span className="font-medium">{t(loc, "customs_note")}:</span>{" "}
                  {getCustomsNotes(customs, loc)}
                </p>
              )}
              <p className="text-xs text-gray-400">{t(loc, "customs_disclaimer")}</p>
            </div>
          </section>
        );
      })()}

      {/* FAQ Section */}
      {corridorData && corridorData.carriers.length > 0 && (() => {
        const cheapest = corridorData.carriers[0];
        const cheapestPrice = cheapest.rates.find((r) => r.weight_kg === 1)?.price_usd ?? 0;
        const allDaysMin = Math.min(...corridorData.carriers.map((c) => c.estimated_days_min));
        const allDaysMax = Math.max(...corridorData.carriers.map((c) => c.estimated_days_max));
        const expressDays = Math.min(...corridorData.carriers.filter((c) => c.carrier.type === "international").map((c) => c.estimated_days_max).concat([7]));
        const economyDays = Math.max(...corridorData.carriers.filter((c) => c.carrier.type === "postal").map((c) => c.estimated_days_min).concat([10]));
        const customs = getCustomsInfo(destination.code);

        const faqs = [
          {
            q: t(loc, "faq_cheapest_q", { origin: originName, destination: destName }),
            a: t(loc, "faq_cheapest_a", { origin: originName, destination: destName, carrier: cheapest.carrier.name, service: cheapest.service.name, price: String(cheapestPrice) }),
          },
          {
            q: t(loc, "faq_time_q", { origin: originName, destination: destName }),
            a: t(loc, "faq_time_a", { origin: originName, destination: destName, min_days: String(allDaysMin), max_days: String(allDaysMax), express_days: String(expressDays), economy_days: String(economyDays) }),
          },
          {
            q: t(loc, "faq_tracking_q", { origin: originName, destination: destName }),
            a: t(loc, "faq_tracking_a", { origin: originName, destination: destName }),
          },
          {
            q: t(loc, "faq_customs_q", { destination: destName }),
            a: t(loc, "faq_customs_a", { destination: destName, de_minimis: String(customs.de_minimis_usd), vat: String(customs.vat_rate), duty: String(customs.avg_duty_rate) }),
          },
        ];

        const faqJsonLd = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.a,
            },
          })),
        };

        return (
          <section className="mt-12">
            <h2 className="text-xl font-bold text-white mb-4">
              {t(loc, "faq_title")}
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <details key={i} className="bg-surface border border-white/10 rounded-lg">
                  <summary className="p-4 font-medium text-white cursor-pointer hover:text-accent-light">
                    {faq.q}
                  </summary>
                  <p className="px-4 pb-4 text-gray-400 text-sm">{faq.a}</p>
                </details>
              ))}
            </div>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
          </section>
        );
      })()}

      {/* Shipping guide links */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-white mb-4">
          {t(loc, "learn_more_shipping")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href={`/${locale}/guide/${destination.slug_en}`}
            className="flex items-center gap-3 bg-surface border border-white/10 rounded-lg p-4 hover:border-accent/50 transition-all"
          >
            <span className="text-2xl">{countryFlag(destination.code)}</span>
            <div>
              <p className="font-medium text-white text-sm">
                {t(loc, "guide_title", { country: destName })}
              </p>
              <p className="text-xs text-gray-500">
                {t(loc, "customs_duties_tips")}
              </p>
            </div>
          </Link>
          <Link
            href={`/${locale}/guide/${origin.slug_en}`}
            className="flex items-center gap-3 bg-surface border border-white/10 rounded-lg p-4 hover:border-accent/50 transition-all"
          >
            <span className="text-2xl">{countryFlag(origin.code)}</span>
            <div>
              <p className="font-medium text-white text-sm">
                {t(loc, "guide_title", { country: originName })}
              </p>
              <p className="text-xs text-gray-500">
                {t(loc, "customs_duties_tips")}
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* Reverse corridor link */}
      <section className="mt-6">
        <Link
          href={`/${locale}/shipping/${makeCorridorSlug(destination, origin, loc)}`}
          className="text-accent-light hover:text-white text-sm"
        >
          {t(loc, "shipping_from_to", {
            origin: destName,
            destination: originName,
          })}{" "}
          →
        </Link>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Product JSON-LD for rich snippets */}
      {corridorData && corridorData.carriers.length > 0 && (() => {
        const prices = corridorData.carriers.map(
          (cr) => cr.rates.find((r) => r.weight_kg === 1)?.price_usd ?? 0
        ).filter((p) => p > 0);
        if (prices.length === 0) return null;
        const productJsonLd = {
          "@context": "https://schema.org",
          "@type": "Product",
          name: `Shipping from ${originName} to ${destName}`,
          description: `Compare ${corridorData.carriers.length} carrier rates for shipping from ${originName} to ${destName}`,
          offers: {
            "@type": "AggregateOffer",
            lowPrice: Math.min(...prices),
            highPrice: Math.max(...prices),
            priceCurrency: "USD",
            offerCount: corridorData.carriers.length,
          },
        };
        return (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
          />
        );
      })()}
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
                item: `${process.env.NEXT_PUBLIC_BASE_URL || "https://rateships.com"}/${locale}`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: t(loc, "ship_from", { country: originName }),
                item: `${process.env.NEXT_PUBLIC_BASE_URL || "https://rateships.com"}/${locale}/shipping/from/${origin.slug_en}`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: destName,
              },
            ],
          }),
        }}
      />
    </div>
  );
}
