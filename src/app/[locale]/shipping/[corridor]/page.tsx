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
import { deepCustomsData } from "@/data/customs-deep";
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
import { getCorridorContent } from "@/data/corridor-content";
import { generateCorridorInfo } from "@/lib/corridor-generator";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { isCorridorLocaleValid, getCorridorLocales } from "@/lib/country-locale";
import LocaleSuggestion from "@/components/LocaleSuggestion";
import DeliveryDateEstimator from "@/components/DeliveryDateEstimator";
import { isCarrierVerified } from "@/lib/verified-carriers";
import TableOfContents from "@/components/TableOfContents";
import StickyCorridorCTA from "@/components/StickyCorridorCTA";

// Pre-generate popular corridors; rest generated on-demand via ISR
export const dynamicParams = true;

export function generateStaticParams() {
  const params: { locale: string; corridor: string }[] = [];

  const topCodes = [
    "US", "GB", "DE", "FR", "CN", "JP", "KR", "AU", "CA", "RU",
    "IN", "AE", "SG", "TH", "MY", "BR", "IT", "ES", "NL", "TR",
  ];

  // Only generate corridors in VALID locales for each pair
  for (const fromCode of topCodes) {
    for (const toCode of topCodes) {
      if (fromCode === toCode) continue;
      const from = countries.find((c) => c.code === fromCode);
      const to = countries.find((c) => c.code === toCode);
      if (!from || !to) continue;
      const validLocales = getCorridorLocales(fromCode, toCode);
      for (const locale of validLocales) {
        const loc = locale as Locale;
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

  const cheapestPrice = corridorData?.carriers.length
    ? Math.min(...corridorData.carriers.map(c => c.rates.find(r => r.weight_kg === 1)?.price_usd ?? 999))
    : 0;
  const fastestDays = corridorData?.carriers.length
    ? Math.min(...corridorData.carriers.map(c => c.estimated_days_min))
    : 0;
  const slowestDays = corridorData?.carriers.length
    ? Math.max(...corridorData.carriers.map(c => c.estimated_days_max))
    : 0;

  const metaVars = {
    origin: originName,
    destination: destName,
    count: String(corridorData?.carriers.length ?? 30),
    cheapest: String(cheapestPrice),
    days: fastestDays > 0 ? `${fastestDays}–${slowestDays}` : "5–30",
  };

  return {
    title: t(loc, "meta_corridor_title", metaVars),
    description: t(loc, "meta_corridor_description", metaVars),
    alternates: {
      canonical: `/${locale}/shipping/${corridor}`,
      languages: {
        ...Object.fromEntries(
          getCorridorLocales(parsed.origin.code, parsed.destination.code).map((l) => [l, `/${l}/shipping/${makeCorridorSlug(parsed.origin, parsed.destination, l as Locale)}`])
        ),
        "x-default": `/en/shipping/${makeCorridorSlug(parsed.origin, parsed.destination, "en")}`,
      },
    },
    openGraph: {
      title: t(loc, "meta_corridor_title", metaVars),
      description: t(loc, "meta_corridor_description", metaVars),
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
    notFound();
  }

  const { origin, destination } = parsed;

  // Redirect to English if locale is not relevant for this corridor
  if (!isCorridorLocaleValid(origin.code, destination.code, loc)) {
    const enSlug = makeCorridorSlug(origin, destination, "en");
    redirect(`/en/shipping/${enSlug}`);
  }

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
      {/* Breadcrumbs: Shipping Rates → to {dest} → from {origin} */}
      <nav className="text-sm text-body mb-6">
        <Link href={`/${locale}`} className="hover:text-accent-light">
          {t(loc, "shipping_rates")}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/${locale}/shipping/to/${destination.slug_en}`}
          className="hover:text-accent-light"
        >
          {t(loc, "ship_to", { country: destName })}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{t(loc, "ship_from", { country: originName })}</span>
      </nav>

      {/* Language suggestion based on corridor countries */}
      <LocaleSuggestion
        currentLocale={locale}
        originCode={origin.code}
        destCode={destination.code}
        viewInLabel={t(loc, "view_in")}
      />

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-2">
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

      {/* Route visual */}
      <img src="/img/route-line.svg" alt="" aria-hidden="true" className="w-full max-w-md mb-6 opacity-50" />

      {/* Quick Answer — featured snippet target */}
      {corridorData && corridorData.carriers.length > 0 && (() => {
        const cheapest = corridorData.carriers.reduce((a, b) =>
          (a.rates.find(r => r.weight_kg === 1)?.price_usd ?? 999) < (b.rates.find(r => r.weight_kg === 1)?.price_usd ?? 999) ? a : b
        );
        const fastest = corridorData.carriers.reduce((a, b) => a.estimated_days_min < b.estimated_days_min ? a : b);
        const customs = getCustomsInfo(destination.code);
        return (
          <div className="my-6 p-8 bg-white rounded-3xl">
            <p className="text-sm text-body uppercase tracking-wider mb-4">
              {t(loc, "quick_answer")}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-muted">{t(loc, "cheapest_option")}</p>
                <p className="text-ink font-medium">{cheapest.carrier.name}</p>
                <p className="text-lg text-ink font-light">${cheapest.rates.find(r => r.weight_kg === 1)?.price_usd}/{t(loc, "kg_unit")}</p>
                <p className="text-xs text-muted">{cheapest.estimated_days_min}-{cheapest.estimated_days_max} {t(loc, "days_unit")}</p>
              </div>
              <div>
                <p className="text-xs text-muted">{t(loc, "fastest_option")}</p>
                <p className="text-ink font-medium">{fastest.carrier.name}</p>
                <p className="text-lg text-ink font-light">{fastest.estimated_days_min}-{fastest.estimated_days_max} {t(loc, "days_unit")}</p>
                <p className="text-xs text-muted">${fastest.rates.find(r => r.weight_kg === 1)?.price_usd}/{t(loc, "kg_unit")}</p>
              </div>
              <div>
                <p className="text-xs text-muted">{t(loc, "duty_free_under")}</p>
                <p className="text-lg text-ink font-light">${customs.de_minimis_usd}</p>
                <p className="text-xs text-muted">{t(loc, "vat_rate")}: {customs.vat_rate}%</p>
              </div>
            </div>
            <p className="text-xs text-muted mt-3">
              {"↓ " + t(loc, "scroll_compare")}
            </p>
          </div>
        );
      })()}

      {/* Last updated */}
      <p className="text-xs text-muted mb-6">
        {t(loc, "data_as_of")}
      </p>

      {/* Common Shipment Examples */}
      {corridorData && corridorData.carriers.length > 0 && (() => {
        const getRate = (kg: number) => {
          const cheapest = corridorData.carriers.reduce((a, b) => {
            const aPrice = a.rates.find(r => r.weight_kg === kg)?.price_usd ?? 999;
            const bPrice = b.rates.find(r => r.weight_kg === kg)?.price_usd ?? 999;
            return aPrice < bPrice ? a : b;
          });
          return {
            carrier: cheapest.carrier.name,
            price: cheapest.rates.find(r => r.weight_kg === kg)?.price_usd ?? 0,
            days: `${cheapest.estimated_days_min}-${cheapest.estimated_days_max}`
          };
        };
        const r05 = getRate(0.5);
        const r2 = getRate(2);
        const r5 = getRate(5);
        const r10 = getRate(10);

        return (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-ink mb-4" id="examples">
              {t(loc, "shipping_cost_examples")}
            </h2>
            {/* Featured item + compact row — not 4 identical cards */}
            <div className="bg-white rounded-2xl p-5 mb-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-body">{t(loc, "example_phone")} <span className="text-muted">(0.5 kg)</span></p>
                  <p className="text-2xl font-light text-ink mt-1">${r05.price}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted">{r05.carrier}</p>
                  <p className="text-xs text-muted">{r05.days} {t(loc, "days_short")}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-surface rounded-xl px-4 py-3">
                <p className="text-xs text-muted">{t(loc, "example_clothing")} <span className="text-muted">2kg</span></p>
                <p className="text-lg font-light text-ink">${r2.price}</p>
                <p className="text-[10px] text-muted">{r2.carrier}</p>
              </div>
              <div className="bg-surface rounded-xl px-4 py-3">
                <p className="text-xs text-muted">{t(loc, "example_box")} <span className="text-muted">5kg</span></p>
                <p className="text-lg font-light text-ink">${r5.price}</p>
                <p className="text-[10px] text-muted">{r5.carrier}</p>
              </div>
              <div className="bg-surface rounded-xl px-4 py-3">
                <p className="text-xs text-muted">{t(loc, "example_heavy")} <span className="text-muted">10kg</span></p>
                <p className="text-lg font-light text-ink">${r10.price}</p>
                <p className="text-[10px] text-muted">{r10.carrier}</p>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Quick stats — inline, not 4 identical cards */}
      {corridorData && corridorData.carriers.length > 0 && (
        <div className="flex flex-wrap gap-x-8 gap-y-2 mb-8 text-sm">
          <span className="text-muted">
            {t(loc, "from_price")} <span className="text-ink font-medium text-base">${Math.min(...corridorData.carriers.map(c => c.rates.find(r => r.weight_kg === 1)?.price_usd ?? 999))}/kg</span>
          </span>
          <span className="text-muted">
            {t(loc, "from_price")} <span className="text-ink font-medium text-base">{Math.min(...corridorData.carriers.map(c => c.estimated_days_min))} {t(loc, "days_unit")}</span>
          </span>
          <span className="text-muted">
            <span className="text-ink font-medium text-base">{corridorData.carriers.length}</span> {t(loc, "carriers_count")}
          </span>
          <span className="text-muted">
            de minimis <span className="text-ink font-medium text-base">${getCustomsInfo(destination.code).de_minimis_usd}</span>
          </span>
        </div>
      )}

      {/* Table of Contents */}
      <TableOfContents
        locale={locale}
        customsGuideHref={`/${locale}/customs/${destination.slug_en}`}
      />

      {/* Rate comparison table */}
      <div id="rates">
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
              rate_verified: isCarrierVerified(cr.carrier.id),
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
      </div>

      {/* Delivery Date Estimator */}
      {corridorData && corridorData.carriers.length > 0 && (
        <div className="mt-8">
          <DeliveryDateEstimator
            estimatedDaysMin={Math.min(...corridorData.carriers.map(c => c.estimated_days_min))}
            estimatedDaysMax={Math.max(...corridorData.carriers.map(c => c.estimated_days_max))}
            locale={locale}
            labels={{
              title: t(loc, "delivery_estimate"),
              ship_today: t(loc, "ship_date"),
              estimated_arrival: t(loc, "estimated_arrival"),
              business_days_note: t(loc, "business_days_note"),
            }}
          />
        </div>
      )}

      {/* Source note */}
      <p className="text-xs text-muted py-3 border-t border-line">
        {t(loc, "source_note") + " "}
        <Link href={`/${locale}/data-methodology`} className="text-muted hover:text-ink transition-colors">
          {t(loc, "how_we_collect")}
        </Link>
      </p>

      {/* Related tools */}
      <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 mb-4 text-sm">
        <Link href={`/${locale}/tools/duty-calculator`} className="text-muted hover:text-ink transition-colors">
          {t(loc, "duty_calculator_link")} &rarr;
        </Link>
        <Link href={`/${locale}/tools/delivery-estimator`} className="text-muted hover:text-ink transition-colors">
          {t(loc, "delivery_estimator_link")} &rarr;
        </Link>
        <Link href={`/${locale}/customs/${destination.slug_en}`} className="text-muted hover:text-ink transition-colors">
          {t(loc, "customs_link", { country: destName })} &rarr;
        </Link>
      </div>

      {/* Sticky mobile CTA */}
      {corridorData && corridorData.carriers.length > 0 && (() => {
        const cheapest = Math.min(...corridorData.carriers.map(c => c.rates.find(r => r.weight_kg === 1)?.price_usd ?? 999));
        const fastest = Math.min(...corridorData.carriers.map(c => c.estimated_days_min));
        const cheapestCarrier = corridorData.carriers.reduce((a, b) =>
          (a.rates.find(r => r.weight_kg === 1)?.price_usd ?? 999) < (b.rates.find(r => r.weight_kg === 1)?.price_usd ?? 999) ? a : b
        );
        return (
          <StickyCorridorCTA
            cheapestPrice={cheapest}
            fastestDays={fastest}
            carrierName={cheapestCarrier.carrier.name}
            locale={locale}
          />
        );
      })()}

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
          dutyRates={deepCustomsData[destination.code]?.duty_rates.map((r) => ({
            category: loc === "ru" ? r.category_ru : r.category_en,
            rate: r.rate,
            hs: r.hs_chapter.replace("HS ", ""),
          }))}
        />
      </div>

      {/* Insurance Comparison */}
      <div className="mt-8">
        <InsuranceComparison
          labels={{
            title: t(loc, "insurance_title"),
            item_value: t(loc, "insurance_item_value"),
            calculate: t(loc, "duty_calc_calculate"),
            carrier: t(loc, "carrier"),
            included: t(loc, "insurance_included"),
            premium: t(loc, "insurance_premium"),
            payout: t(loc, "insurance_payout"),
            yes: t(loc, "yes"),
            no: t(loc, "no"),
            note: t(loc, "insurance_note"),
          }}
        />
      </div>

      {/* Track Your Shipment */}
      {corridorData && corridorData.carriers.length > 0 && (
        <div className="mt-8 py-8 border-t border-line">
          <h2 className="text-xl font-bold text-ink mb-4" id="tracking">
            {t(loc, "track_shipment")}
          </h2>
          <p className="text-sm text-body mb-4">
            {t(loc, "track_after")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {corridorData.carriers.slice(0, 5).map((cr) => (
              cr.carrier.tracking_url ? (
                <a
                  key={cr.carrier.id}
                  href={cr.carrier.tracking_url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="flex items-center gap-2 text-sm text-body hover:text-ink py-2 transition-colors"
                >
                  <span className="text-muted">↗</span>
                  {cr.carrier.name} — {t(loc, "track_link")}
                </a>
              ) : null
            ))}
          </div>
        </div>
      )}

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
              title: t(loc, "price_changes"),
              carrier: t(loc, "carrier"),
              current: t(loc, "current_price"),
              previous: t(loc, "previous_price"),
              change: t(loc, "price_change"),
              no_changes: t(loc, "no_price_data"),
            }}
          />
        </div>
      )}

      {/* Dynamic corridor info from per-country data */}
      {(() => {
        const corridorInfo = generateCorridorInfo(origin.code, destination.code, locale);
        if (!corridorInfo) return null;
        return (
          <section className="mt-12 space-y-0">

            {/* 1. Import Duty Rates */}
            {corridorInfo.duty_table.length > 0 && (
              <div id="duties" className="py-8 border-t border-line">
                <h2 className="text-2xl font-bold text-ink mb-1">
                  
                  {t(loc, "corridor_import_duties", { dest: destName })}
                </h2>
                <p className="text-sm text-muted mb-5">
                  {t(loc, "corridor_duty_indicative")}
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-muted text-xs uppercase tracking-wider">
                        <th className="pb-3 pr-4">{t(loc, "corridor_category")}</th>
                        <th className="pb-3 pr-4">{t(loc, "corridor_hs_code")}</th>
                        <th className="pb-3">{t(loc, "corridor_rate")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {corridorInfo.duty_table.map((row, i) => (
                        <tr key={i} className="text-body hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 pr-4">{row.category}</td>
                          <td className="py-3 pr-4 text-muted font-mono text-xs">{row.hs}</td>
                          <td className="py-3 font-medium text-ink">{row.rate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 text-xs text-muted">
                  {t(loc, "corridor_rates_note")}
                </p>
              </div>
            )}

            {/* 2. Customs Clearance */}
            {(corridorInfo.clearance_info || corridorInfo.customs_reality) && (
              <div id="customs" className="py-8 border-t border-line">
                <h2 className="text-2xl font-bold text-ink mb-4">
                  
                  {t(loc, "corridor_customs_clearance")}
                </h2>
                {corridorInfo.clearance_info && (
                  <p className="text-sm text-body leading-relaxed mb-4">{corridorInfo.clearance_info}</p>
                )}
                <div className="flex flex-wrap gap-x-10 gap-y-3 mt-4">
                  {corridorInfo.clearance_time && (
                    <div>
                      <span className="block text-xs text-muted uppercase tracking-wider mb-1">
                        {t(loc, "corridor_processing_time")}
                      </span>
                      <span className="text-ink font-medium">
                        {corridorInfo.clearance_time} {t(loc, "corridor_days")}
                      </span>
                    </div>
                  )}
                  {corridorInfo.de_minimis_info && (
                    <div>
                      <span className="block text-xs text-muted uppercase tracking-wider mb-1">
                        De minimis
                      </span>
                      <span className="text-ink font-medium text-sm">{corridorInfo.de_minimis_info}</span>
                    </div>
                  )}
                </div>
                {corridorInfo.customs_reality && (
                  <div className="mt-5 p-4 bg-white/[0.02] rounded-lg">
                    <span className="block text-xs text-muted uppercase tracking-wider mb-2">
                      {t(loc, "corridor_what_to_expect")}
                    </span>
                    <p className="text-sm text-body leading-relaxed">{corridorInfo.customs_reality}</p>
                  </div>
                )}
                <Link
                  href={`/${locale}/customs/${destination.slug_en}`}
                  className="inline-block mt-4 text-sm text-accent-light hover:underline"
                >
                  {t(loc, "corridor_full_customs_guide", { dest: destName })} &rarr;
                </Link>
              </div>
            )}

            {/* 3. Required Documents */}
            {corridorInfo.docs_section && (
              <div id="documents" className="py-8 border-t border-line">
                <h2 className="text-2xl font-bold text-ink mb-6">
                  
                  {t(loc, "corridor_required_docs")}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {corridorInfo.docs_section.split(/[.,;]/).filter(d => d.trim()).map((doc, i) => (
                    <div key={i} className="flex items-start gap-3 py-2">
                      <span className="text-green-400 mt-0.5">&#10003;</span>
                      <span className="text-sm text-body">{doc.trim()}</span>
                    </div>
                  ))}
                </div>
                {corridorInfo.documents_where && (
                  <div className="mt-6 p-4 bg-white/[0.02] rounded-lg">
                    <p className="text-xs text-muted uppercase tracking-wider mb-2">
                      {t(loc, "corridor_where_docs")}
                    </p>
                    <p className="text-sm text-body leading-relaxed">{corridorInfo.documents_where}</p>
                  </div>
                )}
              </div>
            )}

            {/* 4. Trade Between Countries */}
            {corridorInfo.trade_volume && (
              <div id="trade" className="py-8 border-t border-line">
                <h2 className="text-2xl font-bold text-ink mb-4">
                  
                  {t(loc, "corridor_trade_between", { origin: originName, dest: destName })}
                </h2>
                <p className="text-sm text-body leading-relaxed mb-4">{corridorInfo.trade_volume}</p>
                {corridorInfo.customs_section && (
                  <p className="text-sm text-body leading-relaxed">{corridorInfo.customs_section}</p>
                )}
              </div>
            )}

            {/* 5. Shipper Experience */}
            {corridorInfo.shipper_reviews && (
              <div className="py-8 border-t border-line">
                <h2 className="text-2xl font-bold text-ink mb-4">
                  {t(loc, "corridor_shipper_exp")}
                </h2>
                <p className="text-sm text-body leading-relaxed">{corridorInfo.shipper_reviews}</p>
              </div>
            )}

            {/* 6. Prohibited Items */}
            {corridorInfo.prohibited_section && (
              <div id="prohibited" className="py-8 border-t border-line">
                <h2 className="text-2xl font-bold text-ink mb-6">
                  
                  {t(loc, "corridor_prohibited")}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {corridorInfo.prohibited_section.split(/[.,;]/).filter(d => d.trim().length > 3).map((item, i) => (
                    <div key={i} className="flex items-start gap-3 py-2">
                      <span className="text-red-400 mt-0.5 text-xs">&#9888;</span>
                      <span className="text-sm text-body">{item.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Special Items Guide — table format, not 6 identical cards */}
            <div className="py-8 border-t border-line">
              <h2 className="text-xl font-bold text-ink mb-4" id="special-items">
                {t(loc, "special_items")}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-muted uppercase tracking-wider">
                      <th className="pb-3 pr-6">{t(loc, "category_label")}</th>
                      <th className="pb-3">{t(loc, "restrictions_label")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr><td className="py-3 pr-6 text-ink whitespace-nowrap">{t(loc, "cat_lithium")}</td><td className="py-3 text-body">{t(loc, "restriction_lithium")}</td></tr>
                    <tr><td className="py-3 pr-6 text-ink whitespace-nowrap">{t(loc, "cat_alcohol")}</td><td className="py-3 text-body">{t(loc, "restriction_alcohol")}</td></tr>
                    <tr><td className="py-3 pr-6 text-ink whitespace-nowrap">{t(loc, "cat_food")}</td><td className="py-3 text-body">{t(loc, "restriction_food")}</td></tr>
                    <tr><td className="py-3 pr-6 text-ink whitespace-nowrap">{t(loc, "cat_meds")}</td><td className="py-3 text-body">{t(loc, "restriction_meds")}</td></tr>
                    <tr><td className="py-3 pr-6 text-ink whitespace-nowrap">{t(loc, "cat_art")}</td><td className="py-3 text-body">{t(loc, "restriction_art")}</td></tr>
                    <tr><td className="py-3 pr-6 text-ink whitespace-nowrap">{t(loc, "cat_electronics")}</td><td className="py-3 text-body">{t(loc, "restriction_electronics")}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 7. Trade Agreements */}
            {corridorInfo.trade_section && (
              <div className="py-8 border-t border-line">
                <h2 className="text-2xl font-bold text-ink mb-4">
                  
                  {t(loc, "corridor_trade_agreements")}
                </h2>
                <p className="text-sm text-body leading-relaxed">{corridorInfo.trade_section}</p>
              </div>
            )}

            {/* 8. VAT/GST */}
            {corridorInfo.vat_info && (
              <div className="py-8 border-t border-line">
                <h2 className="text-2xl font-bold text-ink mb-4">
                  {t(loc, "corridor_vat_gst")}
                </h2>
                <p className="text-sm text-body leading-relaxed">{corridorInfo.vat_info}</p>
              </div>
            )}

            {/* 9. Useful Links */}
            {corridorInfo.useful_links.length > 0 && (
              <div className="py-8 border-t border-line">
                <h2 className="text-2xl font-bold text-ink mb-4">
                  {t(loc, "corridor_useful_links")}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {corridorInfo.useful_links.slice(0, 5).map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="flex items-center gap-2 text-sm text-accent-light hover:text-ink transition-colors py-2"
                    >
                      <span className="text-muted">&#8599;</span>
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Route-specific FAQ merged into main FAQ section below */}
          </section>
        );
      })()}

      {/* Corridor unique content */}
      {(() => {
        const corridorContent = getCorridorContent(origin.code, destination.code);
        if (!corridorContent) return null;
        const tradeInfo = locale === "ru" ? corridorContent.trade_info_ru : corridorContent.trade_info_en;
        const tips = locale === "ru" ? corridorContent.tips_ru : corridorContent.tips_en;
        return (
          <section className="mt-8 space-y-6">
            <div className="bg-white rounded-2xl p-6">
              <h2 className="text-lg font-bold text-ink mb-3">
                {t(loc, "corridor_trade_info")}
              </h2>
              <p className="text-sm text-body leading-relaxed">{tradeInfo}</p>
            </div>
            <div className="bg-white rounded-2xl p-6">
              <h2 className="text-lg font-bold text-ink mb-3">
                {t(loc, "corridor_shipping_tips")}
              </h2>
              <p className="text-sm text-body leading-relaxed">{tips}</p>
            </div>
            {corridorContent.reviews.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-ink mb-3">
                  {t(loc, "corridor_user_reviews")}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {corridorContent.reviews.map((review, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl p-5"
                    >
                      <p className="text-sm text-body italic leading-relaxed mb-3">
                        &ldquo;{locale === "ru" ? review.text_ru : review.text_en}&rdquo;
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted">
                        <span className="font-medium text-accent-light">{review.carrier}</span>
                        <span>
                          {review.days} {t(loc, "corridor_days")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        );
      })()}

      {/* SEO summary text */}
      {corridorData && corridorData.carriers.length > 0 && (() => {
        const cheapestRate = corridorData.carriers[0];
        const cheapestPrice = cheapestRate.rates.find((r) => r.weight_kg === 1)?.price_usd ?? 0;
        const fastestCarrier = [...corridorData.carriers].sort((a, b) => a.estimated_days_min - b.estimated_days_min)[0];
        return (
          <section className="mt-8 bg-white rounded-2xl p-8">
            <h2 className="text-lg font-bold text-ink mb-3">
              {t(loc, "shipping_from_to", { origin: originName, destination: destName })}: {t(loc, "overview")}
            </h2>
            <p className="text-sm text-body leading-relaxed">
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

      {/* Related corridors — asymmetric 2-column layout */}
      <section className="mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* From same origin — larger left column */}
          <div className="lg:col-span-3">
            <h2 className="text-xl font-bold text-ink mb-4">
              {t(loc, "also_ships_to", { origin: originName })}
            </h2>
            <div className="flex flex-wrap gap-2">
              {relatedFrom.map((c) => (
                <Link
                  key={c.code}
                  href={`/${locale}/shipping/${makeCorridorSlug(origin, c, loc)}`}
                  className="bg-white hover:bg-[#F8F5EF] rounded-lg px-3 py-2 transition-colors text-sm text-body hover:text-ink"
                >
                  {countryFlag(c.code)} {getCountryName(c, loc)}
                </Link>
              ))}
            </div>
          </div>
          {/* To same destination — smaller right column */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-ink mb-4">
              {t(loc, "ship_to", { country: destName })}
            </h2>
            <div className="flex flex-wrap gap-2">
              {popular
                .filter((c) => c.code !== origin.code && c.code !== destination.code)
                .slice(0, 6)
                .map((c) => (
                  <Link
                    key={c.code}
                    href={`/${locale}/shipping/${makeCorridorSlug(c, destination, loc)}`}
                    className="bg-surface hover:bg-white rounded-lg px-3 py-2 transition-colors text-sm text-body hover:text-ink"
                  >
                    {countryFlag(c.code)} {getCountryName(c, loc)}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Carrier links */}
      {corridorData && corridorData.carriers.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-bold text-ink mb-4">
            {t(loc, "carriers_page")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {[...new Set(corridorData.carriers.map((cr) => cr.carrier.id))].slice(0, 6).map((carrierId) => {
              const carrier = corridorData.carriers.find((cr) => cr.carrier.id === carrierId)?.carrier;
              if (!carrier) return null;
              return (
                <Link
                  key={carrierId}
                  href={`/${locale}/carriers/${carrierId}`}
                  className="text-sm bg-white hover:bg-[#F8F5EF] rounded-full px-4 py-2 hover:text-accent-light transition-colors"
                >
                  {carrier.name}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* More shipping routes — dense internal link network */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-ink mb-4">
          {t(loc, "more_routes")}
        </h2>
        <div className="space-y-6">
          {/* From same origin to other destinations */}
          <div>
            <h3 className="text-sm font-semibold text-body mb-2">
              {t(loc, "ship_from", { country: originName })}
            </h3>
            <div className="flex flex-wrap gap-2">
              {popular
                .filter((c) => c.code !== origin.code && c.code !== destination.code)
                .filter((c) => !relatedFrom.some((rf) => rf.code === c.code))
                .slice(0, 4)
                .map((c) => (
                  <Link
                    key={`from-${c.code}`}
                    href={`/${locale}/shipping/${makeCorridorSlug(origin, c, loc)}`}
                    className="text-sm text-body hover:opacity-60 transition-opacity"
                  >
                    {originName} → {getCountryName(c, loc)}
                  </Link>
                ))}
            </div>
          </div>
          {/* To same destination from other origins */}
          <div>
            <h3 className="text-sm font-semibold text-body mb-2">
              {t(loc, "ship_to", { country: destName })}
            </h3>
            <div className="flex flex-wrap gap-2">
              {popular
                .filter((c) => c.code !== origin.code && c.code !== destination.code)
                .slice(6, 10)
                .map((c) => (
                  <Link
                    key={`to-${c.code}`}
                    href={`/${locale}/shipping/${makeCorridorSlug(c, destination, loc)}`}
                    className="text-sm text-body hover:opacity-60 transition-opacity"
                  >
                    {getCountryName(c, loc)} → {destName}
                  </Link>
                ))}
            </div>
          </div>
          {/* Country guide links */}
          <div>
            <h3 className="text-sm font-semibold text-body mb-2">
              {t(loc, "country_guides")}
            </h3>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/${locale}/guide/${origin.slug_en}`}
                className="text-sm text-body hover:opacity-60 transition-opacity"
              >
                {t(loc, "guide_title", { country: originName })}
              </Link>
              <Link
                href={`/${locale}/guide/${destination.slug_en}`}
                className="text-sm text-body hover:opacity-60 transition-opacity"
              >
                {t(loc, "guide_title", { country: destName })}
              </Link>
            </div>
          </div>
          {/* Carrier page links */}
          {corridorData && corridorData.carriers.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-body mb-2">
                {t(loc, "carriers_on_route")}
              </h3>
              <div className="flex flex-wrap gap-3">
                {[...new Set(corridorData.carriers.map((cr) => cr.carrier.id))].slice(0, 4).map((carrierId) => {
                  const carrier = corridorData.carriers.find((cr) => cr.carrier.id === carrierId)?.carrier;
                  if (!carrier) return null;
                  return (
                    <Link
                      key={`more-${carrierId}`}
                      href={`/${locale}/carriers/${carrierId}`}
                      className="text-sm text-body hover:opacity-60 transition-opacity"
                    >
                      {carrier.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Customs info for destination */}
      {hasCustomsData(destination.code) && (() => {
        const customs = getCustomsInfo(destination.code);
        return (
          <section className="mt-12">
            <h2 className="text-xl font-bold text-ink mb-4">
              {t(loc, "customs_for", { country: destName })}
            </h2>
            <div className="bg-white rounded-2xl p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-body">{t(loc, "de_minimis")}</p>
                  <p className="text-lg font-semibold">
                    {customs.de_minimis_usd > 0 ? `$${customs.de_minimis_usd}` : t(loc, "duty_from_zero")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-body">{t(loc, "vat_rate")}</p>
                  <p className="text-lg font-semibold">{customs.vat_rate}%</p>
                </div>
                <div>
                  <p className="text-sm text-body">{t(loc, "avg_duty")}</p>
                  <p className="text-lg font-semibold">{customs.avg_duty_rate}%</p>
                </div>
              </div>
              {getCustomsNotes(customs, loc) && (
                <p className="text-sm text-body mb-3">
                  <span className="font-medium">{t(loc, "customs_note")}:</span>{" "}
                  {getCustomsNotes(customs, loc)}
                </p>
              )}
              <p className="text-xs text-body">{t(loc, "customs_disclaimer")}</p>
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

        const corridorInfo2 = generateCorridorInfo(origin.code, destination.code, locale);
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
          ...(corridorInfo2?.faq || []),
          {
            q: t(loc, "faq_how_rateships_q"),
            a: t(loc, "faq_how_rateships_a"),
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
          <section id="faq" className="mt-12">
            <h2 className="text-xl font-bold text-ink mb-4">
              {t(loc, "faq_title")}
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <details key={i} className="bg-surface border border-line rounded-lg">
                  <summary className="p-4 font-medium text-ink cursor-pointer hover:text-accent-light">
                    {faq.q}
                  </summary>
                  <p className="px-4 pb-4 text-body text-sm">{faq.a}</p>
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
        <h2 className="text-xl font-bold text-ink mb-4">
          {t(loc, "learn_more_shipping")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href={`/${locale}/guide/${destination.slug_en}`}
            className="flex items-center gap-3 bg-surface border border-line rounded-lg p-4 hover:border-accent/50 transition-all"
          >
            <span className="text-2xl">{countryFlag(destination.code)}</span>
            <div>
              <p className="font-medium text-ink text-sm">
                {t(loc, "guide_title", { country: destName })}
              </p>
              <p className="text-xs text-muted">
                {t(loc, "customs_duties_tips")}
              </p>
            </div>
          </Link>
          <Link
            href={`/${locale}/guide/${origin.slug_en}`}
            className="flex items-center gap-3 bg-surface border border-line rounded-lg p-4 hover:border-accent/50 transition-all"
          >
            <span className="text-2xl">{countryFlag(origin.code)}</span>
            <div>
              <p className="font-medium text-ink text-sm">
                {t(loc, "guide_title", { country: originName })}
              </p>
              <p className="text-xs text-muted">
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
          className="text-accent-light hover:text-ink text-sm"
        >
          {t(loc, "shipping_from_to", {
            origin: destName,
            destination: originName,
          })}{" "}
          →
        </Link>
      </section>

      {/* Try another route CTA */}
      <section className="mt-12 mb-8 bg-white rounded-3xl p-8 text-center">
        <h2 className="text-xl font-bold text-ink mb-2">
          {t(loc, "looking_different")}
        </h2>
        <p className="text-sm text-muted mb-5">
          {t(loc, "compare_45k")}
        </p>
        <Link
          href={`/${locale}`}
          className="inline-block px-8 py-3 bg-accent text-white text-sm font-medium rounded-full hover:bg-accent-dark transition-colors"
        >
          {t(loc, "find_route")}
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
        // Use Service schema instead of Product to avoid missing review/rating warnings
        const productJsonLd = {
          "@context": "https://schema.org",
          "@type": "Service",
          name: `Shipping from ${originName} to ${destName}`,
          description: `Compare ${corridorData.carriers.length} carrier rates for shipping from ${originName} to ${destName}`,
          provider: {
            "@type": "Organization",
            name: "RateShips",
            url: "https://rateships.com",
          },
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
                name: t(loc, "shipping_rates"),
                item: `${"https://rateships.com"}/${locale}`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: t(loc, "ship_to", { country: destName }),
                item: `${"https://rateships.com"}/${locale}/shipping/to/${destination.slug_en}`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: t(loc, "ship_from", { country: originName }),
              },
            ],
          }),
        }}
      />
    </div>
  );
}
