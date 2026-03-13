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
import { getCustomsInfo, hasCustomsData } from "@/lib/customs";
import { t, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import RateTable from "@/components/RateTable";
import { countryFlag } from "@/lib/flags";
import Link from "next/link";

// Generate all corridor pages at build time
// For ISR mode, this can be limited to popular corridors
export function generateStaticParams() {
  const params: { locale: string; corridor: string }[] = [];

  // For build performance, only pre-generate popular corridors
  // Other pages will be generated on-demand with ISR
  const popularCodes = [
    "US", "GB", "DE", "FR", "CN", "JP", "KR", "AU", "CA", "RU",
    "IN", "AE", "SG", "TH", "MY", "BR", "IT", "ES", "NL", "TR",
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
      languages: {
        en: `/en/shipping/${makeCorridorSlug(parsed.origin, parsed.destination, "en")}`,
        ru: `/ru/shipping/${makeCorridorSlug(parsed.origin, parsed.destination, "ru")}`,
      },
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
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-blue-600">
          {t(loc, "home")}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/${locale}/shipping/from/${origin.slug_en}`}
          className="hover:text-blue-600"
        >
          {originName}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{destName}</span>
      </nav>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
        <span className="inline-block mr-2">{countryFlag(origin.code)}</span>
        {t(loc, "shipping_from_to", {
          origin: originName,
          destination: destName,
        })}
        <span className="inline-block ml-2">{countryFlag(destination.code)}</span>
      </h1>

      {/* Quick stats */}
      {corridorData && corridorData.carriers.length > 0 && (
        <div className="flex flex-wrap gap-4 mb-8 text-sm text-gray-600">
          <span>
            {corridorData.carriers.length}{" "}
            {loc === "ru" ? "вариантов доставки" : "shipping options"}
          </span>
          <span>
            {loc === "ru" ? "от" : "from"} $
            {Math.min(
              ...corridorData.carriers
                .map((c) => c.rates.find((r) => r.weight_kg === 1)?.price_usd ?? 999)
            )}{" "}
            {loc === "ru" ? "за 1 кг" : "for 1 kg"}
          </span>
          <span>
            {loc === "ru" ? "от" : "from"}{" "}
            {Math.min(...corridorData.carriers.map((c) => c.estimated_days_min))}{" "}
            {t(loc, "days")}
          </span>
        </div>
      )}

      {/* Rate comparison table */}
      <RateTable
        corridorRates={
          corridorData?.carriers.map((cr) => ({
            carrier_name: cr.carrier.name,
            carrier_logo: cr.carrier.logo,
            carrier_type: cr.carrier.type,
            service_name: cr.service.name,
            rates: cr.rates,
            estimated_days_min: cr.estimated_days_min,
            estimated_days_max: cr.estimated_days_max,
            tracking: cr.service.tracking,
          })) ?? []
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
        }}
      />

      {/* Related corridors */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {t(loc, "also_ships_to", { origin: originName })}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {relatedFrom.map((c) => (
            <Link
              key={c.code}
              href={`/${locale}/shipping/${makeCorridorSlug(origin, c, loc)}`}
              className="block bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-300 text-sm"
            >
              {getCountryName(c, loc)}
            </Link>
          ))}
        </div>
      </section>

      {/* Ships to destination from other origins */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
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
                className="block bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-300 text-sm"
              >
                {getCountryName(c, loc)}
              </Link>
            ))}
        </div>
      </section>

      {/* Carrier links */}
      {corridorData && corridorData.carriers.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
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
                  className="text-sm bg-white border border-gray-200 rounded-full px-4 py-2 hover:border-blue-300 hover:text-blue-600"
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
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {t(loc, "customs_for", { country: destName })}
            </h2>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">{t(loc, "de_minimis")}</p>
                  <p className="text-lg font-semibold">
                    {customs.de_minimis_usd > 0 ? `$${customs.de_minimis_usd}` : (loc === "ru" ? "Нет (пошлина с $0)" : "None (duty from $0)")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t(loc, "vat_rate")}</p>
                  <p className="text-lg font-semibold">{customs.vat_rate}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t(loc, "avg_duty")}</p>
                  <p className="text-lg font-semibold">{customs.avg_duty_rate}%</p>
                </div>
              </div>
              {(loc === "ru" ? customs.notes_ru : customs.notes_en) && (
                <p className="text-sm text-gray-600 mb-3">
                  <span className="font-medium">{t(loc, "customs_note")}:</span>{" "}
                  {loc === "ru" ? customs.notes_ru : customs.notes_en}
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
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {t(loc, "faq_title")}
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <details key={i} className="bg-white border border-gray-200 rounded-lg">
                  <summary className="p-4 font-medium text-gray-900 cursor-pointer hover:text-blue-600">
                    {faq.q}
                  </summary>
                  <p className="px-4 pb-4 text-gray-600 text-sm">{faq.a}</p>
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

      {/* Reverse corridor link */}
      <section className="mt-6">
        <Link
          href={`/${locale}/shipping/${makeCorridorSlug(destination, origin, loc)}`}
          className="text-blue-600 hover:text-blue-800 text-sm"
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
    </div>
  );
}
