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
import { getCorridorLocales } from "@/lib/country-locale";
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamicParams = true;

export function generateStaticParams() {
  const params: { locale: string; country: string }[] = [];
  const popularCodes = new Set(["US","GB","DE","CN","JP","AU","CA","RU","FR","KR","IN","AE","SG","BR","IT","ES"]);
  // Only generate in en + the country's own language
  for (const c of countries) {
    if (!popularCodes.has(c.code)) continue;
    const countryLocales = getCorridorLocales(c.code, c.code);
    for (const locale of countryLocales) {
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
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}/guide/${slug}`])),
        "x-default": `/en/guide/${slug}`,
      },
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
    notFound();
  }

  const validLocales = getCorridorLocales(country.code, country.code);
  if (!validLocales.includes(loc)) {
    redirect(`/en/guide/${country.slug_en}`);
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
            <Link href={`/${locale}/guide`} className="hover:text-accent-light">
              {t(loc, "guides")}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink">{name}</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-6">
            {countryFlag(country.code)}{" "}
            {t(loc, "guide_title", { country: name })}
          </h1>

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/${locale}/shipping/to/${country.slug_en}`}
              className="px-4 py-2 bg-[#1A73E8] text-white rounded-lg text-sm hover:brightness-110"
            >
              {t(loc, "ship_to", { country: name })}
            </Link>
            <Link
              href={`/${locale}/shipping/from/${country.slug_en}`}
              className="px-4 py-2 bg-white border border-[var(--line)] rounded-lg text-sm hover:border-accent/50"
            >
              {t(loc, "ship_from", { country: name })}
            </Link>
          </div>
        </div>
      </section>

    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Overview */}
      <section className="prose max-w-none mb-10">
        <h2 className="text-2xl font-bold text-ink mb-3">
          {t(loc, "overview")}
        </h2>
        <p className="text-body leading-relaxed">
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
          <h2 className="text-2xl font-bold text-ink mb-4">
            {t(loc, "customs_info")}
          </h2>
          <div className="bg-surface border border-line rounded-xl p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-4">
              <div className="text-center p-4 bg-white rounded-lg" style={{border:'1px solid var(--line)', boxShadow:'var(--shadow-sm)'}}>
                <p className="text-sm text-body mb-1">{t(loc, "de_minimis")}</p>
                <p className="text-2xl font-bold text-ink">
                  ${customs.de_minimis_usd}
                </p>
                <p className="text-xs text-body mt-1">
                  {customs.de_minimis_usd > 0
                    ? t(loc, "duty_free_below", { threshold: String(customs.de_minimis_usd) })
                    : t(loc, "duty_from_zero")}
                </p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg" style={{border:'1px solid var(--line)', boxShadow:'var(--shadow-sm)'}}>
                <p className="text-sm text-body mb-1">{t(loc, "vat_rate")}</p>
                <p className="text-2xl font-bold text-ink">{customs.vat_rate}%</p>
                <p className="text-xs text-body mt-1">{customs.currency}</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg" style={{border:'1px solid var(--line)', boxShadow:'var(--shadow-sm)'}}>
                <p className="text-sm text-body mb-1">{t(loc, "avg_duty")}</p>
                <p className="text-2xl font-bold text-ink">{customs.avg_duty_rate}%</p>
                <p className="text-xs text-body mt-1">
                  {t(loc, "average")}
                </p>
              </div>
            </div>
            {getCustomsNotes(customs, loc) && (
              <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 mt-4">
                <p className="text-sm text-accent-light">
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
        <h2 className="text-2xl font-bold text-ink mb-4">
          {t(loc, "required_documents")}
        </h2>
        <div className="bg-surface border border-line rounded-xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { doc: t(loc, "doc_invoice"), desc: t(loc, "doc_invoice_desc") },
              { doc: t(loc, "doc_packing"), desc: t(loc, "doc_packing_desc") },
              { doc: t(loc, "doc_customs"), desc: t(loc, "doc_customs_desc") },
              { doc: t(loc, "doc_awb"), desc: t(loc, "doc_awb_desc") },
              { doc: t(loc, "doc_origin"), desc: t(loc, "doc_origin_desc") },
              { doc: t(loc, "doc_license"), desc: t(loc, "doc_license_desc") },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 items-start p-3 bg-surface-light rounded-lg">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-accent-light rounded-lg flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium text-ink text-sm">{item.doc}</p>
                  <p className="text-xs text-muted mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Import Duty Estimator */}
      {hasCustoms && (
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-ink mb-4">
            {t(loc, "duty_tax_estimate")}
          </h2>
          <div className="bg-surface border border-line rounded-xl p-6">
            <p className="text-sm text-body mb-4">
              {t(loc, "duty_estimate_intro", { country: name })}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-body border-b border-line">
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
                      <tr key={value} className="border-b border-line">
                        <td className="py-2 pr-4 font-medium">${value}</td>
                        <td className="py-2 pr-4">${duty.toFixed(0)}</td>
                        <td className="py-2 pr-4">${vat.toFixed(0)}</td>
                        <td className="py-2 font-bold text-ink">
                          {total > 0 ? `$${total.toFixed(0)}` : t(loc, "free")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-body mt-3">
              {t(loc, "duty_estimate_note")}
            </p>
          </div>
        </section>
      )}

      {/* Tips */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-ink mb-4">
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
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-accent-light rounded-full flex items-center justify-center text-sm font-medium">
                {i + 1}
              </span>
              <p className="text-body text-sm">{tip}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Prohibited & Restricted Items */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-ink mb-4">
          {t(loc, "prohibited_items")}
        </h2>
        <div className="bg-surface border border-line rounded-xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-red-700 mb-2 text-sm">
                {t(loc, "prohibited")}
              </h3>
              <ul className="space-y-1 text-sm text-body">
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
              <ul className="space-y-1 text-sm text-body">
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

      {/* Useful tools — horizontal list, not 3 identical cards */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-ink mb-4">
          {t(loc, "useful_tools")}
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href={`/${locale}/tools/duty-calculator`}
            className="flex items-center gap-3 bg-surface border border-line rounded-lg px-4 py-3 hover:border-accent/30 transition-colors flex-1">
            <span className="text-sm text-muted">/</span>
            <div>
              <p className="font-medium text-ink text-sm">{t(loc, "duty_calculator_link")}</p>
              <p className="text-xs text-muted">{t(loc, "duties_for", { country: name })}</p>
            </div>
          </Link>
          <Link href={`/${locale}/tools/delivery-estimator`}
            className="flex items-center gap-3 bg-surface border border-line rounded-lg px-4 py-3 hover:border-accent/30 transition-colors flex-1">
            <span className="text-sm text-muted">/</span>
            <div>
              <p className="font-medium text-ink text-sm">{t(loc, "delivery_estimator_link")}</p>
              <p className="text-xs text-muted">{t(loc, "delivery_date")}</p>
            </div>
          </Link>
          {hasCustoms && (
            <Link href={`/${locale}/customs/${country.slug_en}`}
              className="flex items-center gap-3 text-sm text-body hover:text-ink transition-colors px-2">
              {t(loc, "customs_link", { country: name })} →
            </Link>
          )}
        </div>
      </section>

      {/* Popular routes — combined, asymmetric layout */}
      <section className="mb-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-3">
            <h2 className="text-xl font-bold text-ink mb-4">
              {t(loc, "popular_routes_to", { country: name })}
            </h2>
            <div className="flex flex-wrap gap-2">
              {popular.slice(0, 10).map((from) => (
                <Link
                  key={from.code}
                  href={`/${locale}/shipping/${makeCorridorSlug(from, country, loc)}`}
                  prefetch={false}
                  className="bg-surface hover:bg-white rounded-lg px-3 py-2 text-sm text-body hover:text-ink transition-colors"
                >
                  {countryFlag(from.code)} {getCountryName(from, loc)} → {name}
                </Link>
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <h2 className="text-lg font-bold text-ink mb-4">
              {t(loc, "popular_routes_from", { country: name })}
            </h2>
            <div className="space-y-1">
              {popular.slice(0, 6).map((to) => (
                <Link
                  key={to.code}
                  href={`/${locale}/shipping/${makeCorridorSlug(country, to, loc)}`}
                  prefetch={false}
                  className="block text-sm text-body hover:text-ink transition-colors py-1"
                >
                  {name} → {getCountryName(to, loc)} {countryFlag(to.code)}
                </Link>
              ))}
            </div>
          </div>
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
            <h2 className="text-2xl font-bold text-ink mb-4">
              {t(loc, "faq_title")}
            </h2>
            <div className="space-y-3">
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

      {/* Compare rates CTA */}
      <section className="mb-10 bg-white rounded-3xl p-8 text-center">
        <h2 className="text-xl font-bold text-ink mb-2">
          {t(loc, "compare_shipping_to", { country: name })}
        </h2>
        <p className="text-sm text-muted mb-5">
          {t(loc, "carriers_realtime")}
        </p>
        <Link
          href={`/${locale}`}
          className="inline-block px-8 py-3 bg-accent text-white text-sm font-medium rounded-full hover:bg-accent-dark transition-colors"
        >
          {t(loc, "compare_rates_cta")}
        </Link>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: t(loc, "guide_title", { country: name }),
            description: t(loc, "guide_meta_description", { country: name }),
            author: { "@type": "Organization", name: "RateShips" },
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
                item: `${"https://rateships.com"}/${locale}`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: t(loc, "guides"),
                item: `${"https://rateships.com"}/${locale}/guide`,
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: t(loc, "guide_title", { country: name }) + " — " + t(loc, "customs_info"),
            description: t(loc, "guide_meta_description", { country: name }),
            url: `https://rateships.com/${locale}/guide/${slug}`,
            inLanguage: locale,
            isPartOf: { "@type": "WebSite", name: "RateShips", url: "https://rateships.com" },
            dateModified: "2026-04-03",
          }),
        }}
      />
    </div>
    </div>
  );
}
