import { Metadata } from "next";
import {
  countries,
  getCountryBySlug,
  getCountryName,
  getPopularCountries,
  makeCorridorSlug,
  carriers,
} from "@/lib/data";
import { getCustomsInfo, getCustomsNotes, hasCustomsData } from "@/lib/customs";
import { t, locales } from "@/lib/i18n";
import type { Locale, Country } from "@/lib/types";
import { countryFlag } from "@/lib/flags";
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
  const name = getCountryName(country, loc);

  return {
    title: t(loc, "guide_title", { country: name }) + " — " + t(loc, "customs_info"),
    description: t(loc, "guide_meta_description", { country: name }),
    alternates: {
      canonical: `/${locale}/guide/${slug}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/guide/${slug}`])),
    },
    openGraph: {
      title: t(loc, "guide_title", { country: name }),
      description: t(loc, "guide_meta_description", { country: name }),
      type: "article",
    },
  };
}

export default async function GuidePage({
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
  const customs = getCustomsInfo(country.code);
  const hasCustoms = hasCustomsData(country.code);
  const popular = getPopularCountries().filter((c) => c.code !== country.code);

  // Count carriers that serve this country
  const carrierCount = carriers.length;
  const internationalCarriers = carriers.filter((c) => c.type === "international");
  const postalCarriers = carriers.filter((c) => c.type === "postal");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-600 mb-6">
        <Link href={`/${locale}`} className="hover:text-blue-600">
          {t(loc, "home")}
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guide`} className="hover:text-blue-600">
          {t(loc, "guides")}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{name}</span>
      </nav>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
        {countryFlag(country.code)}{" "}
        {t(loc, "guide_title", { country: name })}
      </h1>

      {/* Quick links */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Link
          href={`/${locale}/shipping/to/${country.slug_en}`}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
        >
          {t(loc, "ship_to", { country: name })}
        </Link>
        <Link
          href={`/${locale}/shipping/from/${country.slug_en}`}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:border-blue-300"
        >
          {t(loc, "ship_from", { country: name })}
        </Link>
      </div>

      {/* Overview */}
      <section className="prose max-w-none mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          {t(loc, "overview")}
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {t(loc, "guide_overview", {
            country: name,
            region: country.region,
            continent: country.continent,
            carrier_count: String(carrierCount),
            international_count: String(internationalCarriers.length),
            postal_count: String(postalCarriers.length),
          })}
        </p>
      </section>

      {/* Customs */}
      {hasCustoms && (
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t(loc, "customs_info")}
          </h2>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">{t(loc, "de_minimis")}</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${customs.de_minimis_usd}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {customs.de_minimis_usd > 0
                    ? t(loc, "duty_free_below", { threshold: String(customs.de_minimis_usd) })
                    : t(loc, "duty_from_zero")}
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">{t(loc, "vat_rate")}</p>
                <p className="text-2xl font-bold text-gray-900">{customs.vat_rate}%</p>
                <p className="text-xs text-gray-400 mt-1">{customs.currency}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">{t(loc, "avg_duty")}</p>
                <p className="text-2xl font-bold text-gray-900">{customs.avg_duty_rate}%</p>
                <p className="text-xs text-gray-400 mt-1">
                  {t(loc, "average")}
                </p>
              </div>
            </div>
            {getCustomsNotes(customs, loc) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">{t(loc, "customs_note")}:</span>{" "}
                  {getCustomsNotes(customs, loc)}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Required Documents */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {t(loc, "required_documents")}
        </h2>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { doc: t(loc, "doc_invoice"), desc: t(loc, "doc_invoice_desc") },
              { doc: t(loc, "doc_packing"), desc: t(loc, "doc_packing_desc") },
              { doc: t(loc, "doc_customs"), desc: t(loc, "doc_customs_desc") },
              { doc: t(loc, "doc_awb"), desc: t(loc, "doc_awb_desc") },
              { doc: t(loc, "doc_origin"), desc: t(loc, "doc_origin_desc") },
              { doc: t(loc, "doc_license"), desc: t(loc, "doc_license_desc") },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{item.doc}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Import Duty Estimator */}
      {hasCustoms && (
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t(loc, "duty_tax_estimate")}
          </h2>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <p className="text-sm text-gray-600 mb-4">
              {t(loc, "duty_estimate_intro", { country: name })}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600 border-b border-gray-200">
                    <th className="pb-2 pr-4">{t(loc, "goods_value")}</th>
                    <th className="pb-2 pr-4">{t(loc, "duty")}</th>
                    <th className="pb-2 pr-4">{t(loc, "vat_tax")}</th>
                    <th className="pb-2">{t(loc, "total_charges")}</th>
                  </tr>
                </thead>
                <tbody>
                  {[50, 100, 200, 500, 1000].map((value) => {
                    const dutiableValue = Math.max(0, value - customs.de_minimis_usd);
                    const duty = dutiableValue * customs.avg_duty_rate / 100;
                    const vatBase = value + duty;
                    const vat = customs.de_minimis_usd > 0 && value <= customs.de_minimis_usd ? 0 : vatBase * customs.vat_rate / 100;
                    const total = duty + vat;
                    return (
                      <tr key={value} className="border-b border-gray-100">
                        <td className="py-2 pr-4 font-medium">${value}</td>
                        <td className="py-2 pr-4">${duty.toFixed(0)}</td>
                        <td className="py-2 pr-4">${vat.toFixed(0)}</td>
                        <td className="py-2 font-bold text-gray-900">
                          {total > 0 ? `$${total.toFixed(0)}` : t(loc, "free")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              {t(loc, "duty_estimate_note")}
            </p>
          </div>
        </section>
      )}

      {/* Tips */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {t(loc, "shipping_tips")}
        </h2>
        <div className="space-y-3">
          {[
            t(loc, "tip_1"),
            t(loc, "tip_2"),
            t(loc, "tip_3", { threshold: String(customs.de_minimis_usd), country: name }),
            t(loc, "tip_4"),
            t(loc, "tip_5"),
            t(loc, "tip_6"),
          ].map((tip, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium">
                {i + 1}
              </span>
              <p className="text-gray-700 text-sm">{tip}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Prohibited & Restricted Items */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {t(loc, "prohibited_items")}
        </h2>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-red-700 mb-2 text-sm">
                {t(loc, "prohibited")}
              </h3>
              <ul className="space-y-1 text-sm text-gray-700">
                {[
                  t(loc, "prohibited_1"),
                  t(loc, "prohibited_2"),
                  t(loc, "prohibited_3"),
                  t(loc, "prohibited_4"),
                  t(loc, "prohibited_5"),
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-500 flex-shrink-0">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-amber-700 mb-2 text-sm">
                {t(loc, "restricted")}
              </h3>
              <ul className="space-y-1 text-sm text-gray-700">
                {[
                  t(loc, "restricted_1"),
                  t(loc, "restricted_2"),
                  t(loc, "restricted_3"),
                  t(loc, "restricted_4"),
                  t(loc, "restricted_5"),
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-500 flex-shrink-0">!</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Popular routes */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {t(loc, "popular_routes_to", { country: name })}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {popular.slice(0, 8).map((from) => (
            <Link
              key={from.code}
              href={`/${locale}/shipping/${makeCorridorSlug(from, country, loc)}`}
              prefetch={false}
              className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-300 hover:shadow-sm transition-all text-sm"
            >
              <span>{countryFlag(from.code)}</span>
              <span>
                {getCountryName(from, loc)} → {name}
              </span>
              <span>{countryFlag(country.code)}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular routes FROM this country */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {t(loc, "popular_routes_from", { country: name })}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {popular.slice(0, 8).map((to) => (
            <Link
              key={to.code}
              href={`/${locale}/shipping/${makeCorridorSlug(country, to, loc)}`}
              prefetch={false}
              className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-300 hover:shadow-sm transition-all text-sm"
            >
              <span>{countryFlag(country.code)}</span>
              <span>
                {name} → {getCountryName(to, loc)}
              </span>
              <span>{countryFlag(to.code)}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Guide FAQ */}
      {(() => {
        const faqs = [
          {
            q: t(loc, "guide_faq_cost_q", { country: name }),
            a: t(loc, "guide_faq_cost_a", { country: name }),
          },
          {
            q: t(loc, "guide_faq_threshold_q", { country: name }),
            a: t(loc, "guide_faq_threshold_a", {
              country: name,
              threshold: String(customs.de_minimis_usd),
              duty: String(customs.avg_duty_rate),
              vat: String(customs.vat_rate),
            }),
          },
          {
            q: t(loc, "guide_faq_carriers_q", { country: name }),
            a: t(loc, "guide_faq_carriers_a", { country: name, count: String(carrierCount) }),
          },
        ];

        return (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t(loc, "faq_title")}
            </h2>
            <div className="space-y-3">
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
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: faqs.map((faq) => ({
                    "@type": "Question",
                    name: faq.q,
                    acceptedAnswer: { "@type": "Answer", text: faq.a },
                  })),
                }),
              }}
            />
          </section>
        );
      })()}

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: t(loc, "guide_title", { country: name }),
            description: t(loc, "guide_meta_description", { country: name }),
            author: { "@type": "Organization", name: "ShipWorldwide" },
          }),
        }}
      />
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
                item: `${process.env.NEXT_PUBLIC_BASE_URL || "https://shipworldwide.com"}/${locale}`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: t(loc, "guides"),
                item: `${process.env.NEXT_PUBLIC_BASE_URL || "https://shipworldwide.com"}/${locale}/guide`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: name,
              },
            ],
          }),
        }}
      />
    </div>
  );
}
