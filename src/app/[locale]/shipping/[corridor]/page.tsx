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
      <nav className="text-sm text-gray-400 mb-6">
        <Link href={`/${locale}`} className="hover:text-accent-light">
          {locale === "ru" ? "Тарифы доставки" : "Shipping Rates"}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/${locale}/shipping/to/${destination.slug_en}`}
          className="hover:text-accent-light"
        >
          {t(loc, "ship_to", { country: destName })}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-white">{t(loc, "ship_from", { country: originName })}</span>
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

      {/* Quick Answer — featured snippet target */}
      {corridorData && corridorData.carriers.length > 0 && (() => {
        const cheapest = corridorData.carriers.reduce((a, b) =>
          (a.rates.find(r => r.weight_kg === 1)?.price_usd ?? 999) < (b.rates.find(r => r.weight_kg === 1)?.price_usd ?? 999) ? a : b
        );
        const fastest = corridorData.carriers.reduce((a, b) => a.estimated_days_min < b.estimated_days_min ? a : b);
        const customs = getCustomsInfo(destination.code);
        return (
          <div className="my-6 p-8 bg-card rounded-3xl">
            <p className="text-sm text-gray-400 uppercase tracking-wider mb-4">
              {locale === "ru" ? "Быстрый ответ" : "Quick Answer"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-gray-500">{locale === "ru" ? "Самый дешёвый" : "Cheapest option"}</p>
                <p className="text-white font-medium">{cheapest.carrier.name}</p>
                <p className="text-lg text-white font-light">${cheapest.rates.find(r => r.weight_kg === 1)?.price_usd}/{locale === "ru" ? "кг" : "kg"}</p>
                <p className="text-xs text-gray-500">{cheapest.estimated_days_min}-{cheapest.estimated_days_max} {locale === "ru" ? "дней" : "days"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">{locale === "ru" ? "Самый быстрый" : "Fastest option"}</p>
                <p className="text-white font-medium">{fastest.carrier.name}</p>
                <p className="text-lg text-white font-light">{fastest.estimated_days_min}-{fastest.estimated_days_max} {locale === "ru" ? "дней" : "days"}</p>
                <p className="text-xs text-gray-500">${fastest.rates.find(r => r.weight_kg === 1)?.price_usd}/{locale === "ru" ? "кг" : "kg"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">{locale === "ru" ? "Без пошлин до" : "Duty-free under"}</p>
                <p className="text-lg text-white font-light">${customs.de_minimis_usd}</p>
                <p className="text-xs text-gray-500">{locale === "ru" ? "НДС" : "VAT"}: {customs.vat_rate}%</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              {locale === "ru" ? "↓ Прокрутите вниз для полного сравнения всех перевозчиков" : "↓ Scroll down for full carrier comparison"}
            </p>
          </div>
        );
      })()}

      {/* Last updated */}
      <p className="text-xs text-gray-600 mb-6">
        {locale === "ru" ? "Тарифы проверены:" : "Rates last checked:"} March 2026
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
        const isRu = locale === "ru";

        return (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4" id="examples">
              {isRu ? "💡 Примеры стоимости доставки" : "💡 Shipping Cost Examples"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 bg-card rounded-2xl">
                <p className="text-sm text-white">{isRu ? "📱 Телефон / документы" : "📱 Phone / documents"} <span className="text-gray-500">(0.5 kg)</span></p>
                <p className="text-lg font-light text-white mt-1">${r05.price} <span className="text-xs text-gray-500">via {r05.carrier}, {r05.days} {isRu ? "дней" : "days"}</span></p>
              </div>
              <div className="p-4 bg-card rounded-2xl">
                <p className="text-sm text-white">{isRu ? "👟 Обувь / одежда" : "👟 Shoes / clothing"} <span className="text-gray-500">(2 kg)</span></p>
                <p className="text-lg font-light text-white mt-1">${r2.price} <span className="text-xs text-gray-500">via {r2.carrier}, {r2.days} {isRu ? "дней" : "days"}</span></p>
              </div>
              <div className="p-4 bg-card rounded-2xl">
                <p className="text-sm text-white">{isRu ? "📦 Средняя коробка" : "📦 Medium box"} <span className="text-gray-500">(5 kg)</span></p>
                <p className="text-lg font-light text-white mt-1">${r5.price} <span className="text-xs text-gray-500">via {r5.carrier}, {r5.days} {isRu ? "дней" : "days"}</span></p>
              </div>
              <div className="p-4 bg-card rounded-2xl">
                <p className="text-sm text-white">{isRu ? "🖥 Электроника / тяжёлое" : "🖥 Electronics / heavy"} <span className="text-gray-500">(10 kg)</span></p>
                <p className="text-lg font-light text-white mt-1">${r10.price} <span className="text-xs text-gray-500">via {r10.carrier}, {r10.days} {isRu ? "дней" : "days"}</span></p>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Quick stats */}
      {corridorData && corridorData.carriers.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <div className="bg-card rounded-2xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              {locale === "ru" ? "Минимальная цена" : "Cheapest rate"}
            </p>
            <p className="text-2xl font-light text-white mt-1">
              ${Math.min(...corridorData.carriers.map(c => c.rates.find(r => r.weight_kg === 1)?.price_usd ?? 999))}
              <span className="text-sm text-gray-500 ml-1">/kg</span>
            </p>
          </div>
          <div className="bg-card rounded-2xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              {locale === "ru" ? "Быстрая доставка" : "Fastest delivery"}
            </p>
            <p className="text-2xl font-light text-white mt-1">
              {Math.min(...corridorData.carriers.map(c => c.estimated_days_min))}
              <span className="text-sm text-gray-500 ml-1">{locale === "ru" ? "дней" : "days"}</span>
            </p>
          </div>
          <div className="bg-card rounded-2xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              {locale === "ru" ? "Перевозчиков" : "Carriers available"}
            </p>
            <p className="text-2xl font-light text-white mt-1">{corridorData.carriers.length}</p>
          </div>
          <div className="bg-card rounded-2xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              {locale === "ru" ? "Порог de minimis" : "De minimis threshold"}
            </p>
            <p className="text-2xl font-light text-white mt-1">
              ${getCustomsInfo(destination.code).de_minimis_usd}
            </p>
          </div>
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

      {/* Trust bar */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 py-4 border-t border-white/5">
        <span>{locale === "ru" ? "✓ 134+ перевозчика" : "✓ 134+ carriers compared"}</span>
        <span>{locale === "ru" ? "✓ Обновлено еженедельно" : "✓ Updated weekly"}</span>
        <span>{locale === "ru" ? "✓ Источники данных проверены" : "✓ Data sources verified"}</span>
        <Link href={`/${locale}/data-methodology`} className="text-accent-light hover:text-white">
          {locale === "ru" ? "Наша методология →" : "Our methodology →"}
        </Link>
      </div>

      {/* Shipping Tools — cross-link */}
      <div className="flex flex-wrap gap-3 mt-4 mb-4">
        <Link
          href={`/${locale}/tools/duty-calculator`}
          className="flex items-center gap-2 text-sm bg-card hover:bg-card-hover rounded-full px-4 py-2 text-gray-400 hover:text-white transition-colors"
        >
          <span>🧮</span> {locale === "ru" ? "Калькулятор пошлин" : "Duty Calculator"}
        </Link>
        <Link
          href={`/${locale}/tools/delivery-estimator`}
          className="flex items-center gap-2 text-sm bg-card hover:bg-card-hover rounded-full px-4 py-2 text-gray-400 hover:text-white transition-colors"
        >
          <span>📅</span> {locale === "ru" ? "Калькулятор сроков" : "Delivery Estimator"}
        </Link>
        <Link
          href={`/${locale}/customs/${destination.slug_en}`}
          className="flex items-center gap-2 text-sm bg-card hover:bg-card-hover rounded-full px-4 py-2 text-gray-400 hover:text-white transition-colors"
        >
          <span>📋</span> {locale === "ru" ? `Таможня: ${destName}` : `${destName} Customs`}
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

      {/* Track Your Shipment */}
      {corridorData && corridorData.carriers.length > 0 && (
        <div className="mt-8 py-8 border-t border-white/5">
          <h2 className="text-xl font-bold text-white mb-4" id="tracking">
            {locale === "ru" ? "📍 Отслеживание посылки" : "📍 Track Your Shipment"}
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            {locale === "ru"
              ? "После отправки используйте номер отслеживания на сайте перевозчика:"
              : "After shipping, use your tracking number on the carrier's website:"}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {corridorData.carriers.slice(0, 5).map((cr) => (
              cr.carrier.tracking_url ? (
                <a
                  key={cr.carrier.id}
                  href={cr.carrier.tracking_url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="flex items-center gap-2 text-sm text-gray-300 hover:text-white py-2 transition-colors"
                >
                  <span className="text-gray-600">↗</span>
                  {cr.carrier.name} — {locale === "ru" ? "отследить" : "track"}
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

      {/* Dynamic corridor info from per-country data */}
      {(() => {
        const corridorInfo = generateCorridorInfo(origin.code, destination.code, locale);
        if (!corridorInfo) return null;
        const isRu = locale === "ru";
        return (
          <section className="mt-12 space-y-0">

            {/* 1. Import Duty Rates */}
            {corridorInfo.duty_table.length > 0 && (
              <div id="duties" className="py-8 border-t border-white/5">
                <h2 className="text-2xl font-bold text-white mb-1">
                  <span className="mr-2 opacity-60">&#x1F4CA;</span>
                  {isRu ? `Импортные пошлины: ${destName}` : `Import Duty Rates: ${destName}`}
                </h2>
                <p className="text-sm text-gray-500 mb-5">
                  {isRu ? "Ориентировочные ставки по основным категориям товаров" : "Indicative rates for common product categories"}
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 text-xs uppercase tracking-wider">
                        <th className="pb-3 pr-4">{isRu ? "Категория" : "Category"}</th>
                        <th className="pb-3 pr-4">{isRu ? "Код HS" : "HS Code"}</th>
                        <th className="pb-3">{isRu ? "Ставка" : "Rate"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {corridorInfo.duty_table.map((row, i) => (
                        <tr key={i} className="text-gray-300 hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 pr-4">{row.category}</td>
                          <td className="py-3 pr-4 text-gray-500 font-mono text-xs">{row.hs}</td>
                          <td className="py-3 font-medium text-white">{row.rate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 text-xs text-gray-500">
                  {isRu
                    ? "Ставки указаны для стандартных товаров. Точная ставка зависит от HS-кода товара. Используйте калькулятор ниже для расчёта."
                    : "Rates shown are for standard goods. Exact rate depends on HS code. Use the calculator below for your specific item."}
                </p>
              </div>
            )}

            {/* 2. Customs Clearance */}
            {(corridorInfo.clearance_info || corridorInfo.customs_reality) && (
              <div id="customs" className="py-8 border-t border-white/5">
                <h2 className="text-2xl font-bold text-white mb-4">
                  <span className="mr-2 opacity-60">&#x1F6C3;</span>
                  {isRu ? "Таможенное оформление" : "Customs Clearance"}
                </h2>
                {corridorInfo.clearance_info && (
                  <p className="text-sm text-gray-300 leading-relaxed mb-4">{corridorInfo.clearance_info}</p>
                )}
                <div className="flex flex-wrap gap-x-10 gap-y-3 mt-4">
                  {corridorInfo.clearance_time && (
                    <div>
                      <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">
                        {isRu ? "Время оформления" : "Processing time"}
                      </span>
                      <span className="text-white font-medium">
                        {corridorInfo.clearance_time} {isRu ? "дней" : "days"}
                      </span>
                    </div>
                  )}
                  {corridorInfo.de_minimis_info && (
                    <div>
                      <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">
                        De minimis
                      </span>
                      <span className="text-white font-medium text-sm">{corridorInfo.de_minimis_info}</span>
                    </div>
                  )}
                </div>
                {corridorInfo.customs_reality && (
                  <div className="mt-5 p-4 bg-white/[0.02] rounded-lg">
                    <span className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
                      {isRu ? "Как это работает на практике" : "What to actually expect"}
                    </span>
                    <p className="text-sm text-gray-300 leading-relaxed">{corridorInfo.customs_reality}</p>
                  </div>
                )}
                <Link
                  href={`/${locale}/customs/${destination.slug_en}`}
                  className="inline-block mt-4 text-sm text-accent-light hover:underline"
                >
                  {isRu
                    ? `Полный таможенный гид: ${destName}`
                    : `Full customs guide for ${destName}`} &rarr;
                </Link>
              </div>
            )}

            {/* 3. Required Documents */}
            {corridorInfo.docs_section && (
              <div id="documents" className="py-8 border-t border-white/5">
                <h2 className="text-2xl font-bold text-white mb-6">
                  <span className="mr-2 opacity-60">&#x1F4CB;</span>
                  {isRu ? "Необходимые документы" : "Required Documents"}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {corridorInfo.docs_section.split(/[.,;]/).filter(d => d.trim()).map((doc, i) => (
                    <div key={i} className="flex items-start gap-3 py-2">
                      <span className="text-green-400 mt-0.5">&#10003;</span>
                      <span className="text-sm text-gray-300">{doc.trim()}</span>
                    </div>
                  ))}
                </div>
                {corridorInfo.documents_where && (
                  <div className="mt-6 p-4 bg-white/[0.02] rounded-lg">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                      {isRu ? "Где получить документы" : "Where to obtain documents"}
                    </p>
                    <p className="text-sm text-gray-300 leading-relaxed">{corridorInfo.documents_where}</p>
                  </div>
                )}
              </div>
            )}

            {/* 4. Trade Between Countries */}
            {corridorInfo.trade_volume && (
              <div id="trade" className="py-8 border-t border-white/5">
                <h2 className="text-2xl font-bold text-white mb-4">
                  <span className="mr-2 opacity-60">&#x1F91D;</span>
                  {isRu
                    ? `Торговля: ${originName} и ${destName}`
                    : `Trade: ${originName} & ${destName}`}
                </h2>
                <p className="text-sm text-gray-300 leading-relaxed mb-4">{corridorInfo.trade_volume}</p>
                {corridorInfo.customs_section && (
                  <p className="text-sm text-gray-400 leading-relaxed">{corridorInfo.customs_section}</p>
                )}
              </div>
            )}

            {/* 5. Shipper Experience */}
            {corridorInfo.shipper_reviews && (
              <div className="py-8 border-t border-white/5">
                <h2 className="text-2xl font-bold text-white mb-4">
                  {isRu ? "Опыт отправителей" : "Shipper Experience"}
                </h2>
                <p className="text-sm text-gray-300 leading-relaxed">{corridorInfo.shipper_reviews}</p>
              </div>
            )}

            {/* 6. Prohibited Items */}
            {corridorInfo.prohibited_section && (
              <div id="prohibited" className="py-8 border-t border-white/5">
                <h2 className="text-2xl font-bold text-white mb-6">
                  <span className="mr-2 opacity-60">&#x26D4;</span>
                  {isRu ? "Запрещённые и ограниченные товары" : "Prohibited & Restricted Items"}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {corridorInfo.prohibited_section.split(/[.,;]/).filter(d => d.trim().length > 3).map((item, i) => (
                    <div key={i} className="flex items-start gap-3 py-2">
                      <span className="text-red-400 mt-0.5 text-xs">&#9888;</span>
                      <span className="text-sm text-gray-300">{item.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Special Items Guide */}
            <div className="py-8 border-t border-white/5">
              <h2 className="text-xl font-bold text-white mb-4" id="special-items">
                {isRu ? "📋 Особые категории товаров" : "📋 Special Items Guide"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-white font-medium mb-1">{isRu ? "🔋 Литиевые батареи" : "🔋 Lithium Batteries"}</p>
                  <p className="text-gray-400">{isRu ? "Только встроенные в устройство. Отдельные батареи запрещены большинством авиаперевозчиков." : "Only when installed in device. Standalone batteries prohibited by most air carriers."}</p>
                </div>
                <div>
                  <p className="text-white font-medium mb-1">{isRu ? "🍷 Алкоголь" : "🍷 Alcohol"}</p>
                  <p className="text-gray-400">{isRu ? "Ограничен или запрещён в большинстве стран. Требуется лицензия импортёра." : "Restricted or prohibited in most countries. Import license typically required."}</p>
                </div>
                <div>
                  <p className="text-white font-medium mb-1">{isRu ? "🍫 Продукты питания" : "🍫 Food Products"}</p>
                  <p className="text-gray-400">{isRu ? "Требуется фитосанитарный сертификат. Скоропортящиеся товары — только экспресс-доставка." : "Phytosanitary certificate may be required. Perishables require express shipping only."}</p>
                </div>
                <div>
                  <p className="text-white font-medium mb-1">{isRu ? "💊 Лекарства" : "💊 Medications"}</p>
                  <p className="text-gray-400">{isRu ? "Личное использование — до 3 месяцев запаса с рецептом. Коммерческий импорт требует лицензию." : "Personal use: up to 3-month supply with prescription. Commercial import requires license."}</p>
                </div>
                <div>
                  <p className="text-white font-medium mb-1">{isRu ? "🎨 Предметы искусства" : "🎨 Art & Antiques"}</p>
                  <p className="text-gray-400">{isRu ? "Может потребоваться экспортное разрешение. Страхование настоятельно рекомендуется." : "Export permit may be required. Insurance strongly recommended."}</p>
                </div>
                <div>
                  <p className="text-white font-medium mb-1">{isRu ? "💻 Электроника" : "💻 Electronics"}</p>
                  <p className="text-gray-400">{isRu ? "Проверьте совместимость напряжения. Некоторые страны требуют сертификацию (CE, FCC)." : "Check voltage compatibility. Some countries require certification (CE, FCC, etc.)."}</p>
                </div>
              </div>
            </div>

            {/* 7. Trade Agreements */}
            {corridorInfo.trade_section && (
              <div className="py-8 border-t border-white/5">
                <h2 className="text-2xl font-bold text-white mb-4">
                  <span className="mr-2 opacity-60">&#x1F91D;</span>
                  {isRu ? "Торговые соглашения" : "Trade Agreements"}
                </h2>
                <p className="text-sm text-gray-300 leading-relaxed">{corridorInfo.trade_section}</p>
              </div>
            )}

            {/* 8. VAT/GST */}
            {corridorInfo.vat_info && (
              <div className="py-8 border-t border-white/5">
                <h2 className="text-2xl font-bold text-white mb-4">
                  {isRu ? "НДС / GST" : "VAT / GST"}
                </h2>
                <p className="text-sm text-gray-300 leading-relaxed">{corridorInfo.vat_info}</p>
              </div>
            )}

            {/* 9. Useful Links */}
            {corridorInfo.useful_links.length > 0 && (
              <div className="py-8 border-t border-white/5">
                <h2 className="text-2xl font-bold text-white mb-4">
                  {isRu ? "Полезные ссылки" : "Useful Links"}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {corridorInfo.useful_links.slice(0, 5).map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="flex items-center gap-2 text-sm text-accent-light hover:text-white transition-colors py-2"
                    >
                      <span className="text-gray-600">&#8599;</span>
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
        const isRu = locale === "ru";
        const tradeInfo = isRu ? corridorContent.trade_info_ru : corridorContent.trade_info_en;
        const tips = isRu ? corridorContent.tips_ru : corridorContent.tips_en;
        return (
          <section className="mt-8 space-y-6">
            <div className="bg-card rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-3">
                {isRu ? "Торговая информация" : "Trade Information"}
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed">{tradeInfo}</p>
            </div>
            <div className="bg-card rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-3">
                {isRu ? "Советы по доставке" : "Shipping Tips"}
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed">{tips}</p>
            </div>
            {corridorContent.reviews.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-white mb-3">
                  {isRu ? "Отзывы пользователей" : "User Reviews"}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {corridorContent.reviews.map((review, i) => (
                    <div
                      key={i}
                      className="bg-card rounded-2xl p-5"
                    >
                      <p className="text-sm text-gray-300 italic leading-relaxed mb-3">
                        &ldquo;{isRu ? review.text_ru : review.text_en}&rdquo;
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="font-medium text-accent-light">{review.carrier}</span>
                        <span>
                          {review.days} {isRu ? "дней" : "days"}
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
          <section className="mt-8 bg-card rounded-2xl p-8">
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

      {/* Related corridors — asymmetric 2-column layout */}
      <section className="mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* From same origin — larger left column */}
          <div className="lg:col-span-3">
            <h2 className="text-xl font-bold text-white mb-4">
              {t(loc, "also_ships_to", { origin: originName })}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {relatedFrom.map((c) => (
                <Link
                  key={c.code}
                  href={`/${locale}/shipping/${makeCorridorSlug(origin, c, loc)}`}
                  className="block bg-card hover:bg-card-hover rounded-2xl p-4 transition-all text-sm"
                >
                  {countryFlag(c.code)} {getCountryName(c, loc)}
                </Link>
              ))}
            </div>
          </div>
          {/* To same destination — smaller right column */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-white mb-4">
              {t(loc, "ship_to", { country: destName })}
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {popular
                .filter((c) => c.code !== origin.code && c.code !== destination.code)
                .slice(0, 6)
                .map((c) => (
                  <Link
                    key={c.code}
                    href={`/${locale}/shipping/${makeCorridorSlug(c, destination, loc)}`}
                    className="block bg-card hover:bg-card-hover rounded-2xl p-4 transition-all text-sm"
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
          <h2 className="text-xl font-bold text-white mb-4">
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
                  className="text-sm bg-card hover:bg-card-hover rounded-full px-4 py-2 hover:text-accent-light transition-colors"
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
        <h2 className="text-xl font-bold text-white mb-4">
          {locale === "ru" ? "Ещё маршруты доставки" : "More Shipping Routes"}
        </h2>
        <div className="space-y-6">
          {/* From same origin to other destinations */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-2">
              {locale === "ru" ? `Доставка из ${originName}` : `Ship from ${originName}`}
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
                    className="text-sm text-gray-400 hover:opacity-60 transition-opacity"
                  >
                    {originName} → {getCountryName(c, loc)}
                  </Link>
                ))}
            </div>
          </div>
          {/* To same destination from other origins */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-2">
              {locale === "ru" ? `Доставка в ${destName}` : `Ship to ${destName}`}
            </h3>
            <div className="flex flex-wrap gap-2">
              {popular
                .filter((c) => c.code !== origin.code && c.code !== destination.code)
                .slice(6, 10)
                .map((c) => (
                  <Link
                    key={`to-${c.code}`}
                    href={`/${locale}/shipping/${makeCorridorSlug(c, destination, loc)}`}
                    className="text-sm text-gray-400 hover:opacity-60 transition-opacity"
                  >
                    {getCountryName(c, loc)} → {destName}
                  </Link>
                ))}
            </div>
          </div>
          {/* Country guide links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-2">
              {locale === "ru" ? "Руководства по странам" : "Country Guides"}
            </h3>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/${locale}/guide/${origin.slug_en}`}
                className="text-sm text-gray-400 hover:opacity-60 transition-opacity"
              >
                {locale === "ru" ? `Руководство: ${originName}` : `${originName} Shipping Guide`}
              </Link>
              <Link
                href={`/${locale}/guide/${destination.slug_en}`}
                className="text-sm text-gray-400 hover:opacity-60 transition-opacity"
              >
                {locale === "ru" ? `Руководство: ${destName}` : `${destName} Shipping Guide`}
              </Link>
            </div>
          </div>
          {/* Carrier page links */}
          {corridorData && corridorData.carriers.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-2">
                {locale === "ru" ? "Перевозчики на маршруте" : "Carriers on This Route"}
              </h3>
              <div className="flex flex-wrap gap-3">
                {[...new Set(corridorData.carriers.map((cr) => cr.carrier.id))].slice(0, 4).map((carrierId) => {
                  const carrier = corridorData.carriers.find((cr) => cr.carrier.id === carrierId)?.carrier;
                  if (!carrier) return null;
                  return (
                    <Link
                      key={`more-${carrierId}`}
                      href={`/${locale}/carriers/${carrierId}`}
                      className="text-sm text-gray-400 hover:opacity-60 transition-opacity"
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
            <h2 className="text-xl font-bold text-white mb-4">
              {t(loc, "customs_for", { country: destName })}
            </h2>
            <div className="bg-card rounded-2xl p-6">
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

      {/* Try another route CTA */}
      <section className="mt-12 mb-8 bg-card rounded-3xl p-8 text-center">
        <h2 className="text-xl font-bold text-white mb-2">
          {locale === "ru" ? "Ищете другой маршрут?" : "Looking for a different route?"}
        </h2>
        <p className="text-sm text-gray-500 mb-5">
          {locale === "ru"
            ? "Сравните тарифы для 45,000+ маршрутов между 213 странами"
            : "Compare rates for 45,000+ routes between 213 countries"}
        </p>
        <Link
          href={`/${locale}`}
          className="inline-block px-8 py-3 bg-accent text-white text-sm font-medium rounded-full hover:bg-accent-dark transition-colors"
        >
          {locale === "ru" ? "Найти маршрут" : "Find a Route"}
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
                name: locale === "ru" ? "Тарифы доставки" : "Shipping Rates",
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
