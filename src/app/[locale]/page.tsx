import { Metadata } from "next";
import { countries, getPopularCountries, getCountryName, makeCorridorSlug, getCorridorData } from "@/lib/data";
import { t, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { countryFlag } from "@/lib/flags";
import ShippingForm from "@/components/ShippingForm";
import NewsletterForm from "@/components/NewsletterForm";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  return {
    title: t(loc, "compare_shipping_rates"),
    description: t(loc, "hero_subtitle", { count: "134" }),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}`])),
        "x-default": "/en",
      },
    },
    openGraph: {
      title: t(loc, "compare_shipping_rates"),
      description: t(loc, "hero_subtitle", { count: "134" }),
      type: "website",
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;
  const popular = getPopularCountries();

  const popularCorridors = [
    ["US", "GB"], ["US", "DE"], ["CN", "US"], ["GB", "DE"],
    ["US", "JP"], ["US", "AU"], ["CN", "GB"], ["DE", "FR"],
    ["US", "CA"], ["CN", "JP"], ["RU", "DE"], ["US", "KR"],
    ["MY", "SG"], ["TH", "JP"], ["AE", "IN"], ["BR", "US"],
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-bg py-20 sm:py-28 relative">
        <div className="absolute inset-0 overflow-hidden">
          <img src="/img/routes-map.svg" alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-ink text-center">
            {t(loc, "compare_shipping_rates")}
          </h1>
          <p className="text-xl text-body text-center max-w-2xl mx-auto mt-6">
            {t(loc, "hero_subtitle", { count: "134" })}
          </p>

          <p className="text-center mt-8 text-sm text-body tracking-wide">
            <span className="font-mono text-ink">213</span> {t(loc, "all_countries")}
            <span className="mx-3 text-muted">|</span>
            <span className="font-mono text-ink">134</span> {t(loc, "carriers_page")}
            <span className="mx-3 text-muted">|</span>
            <span className="font-mono text-ink">45K+</span> {t(loc, "routes")}
          </p>
          <p className="text-center mt-3 text-xs text-muted">
            {t(loc, "open_carrier_data")}
          </p>

          <div className="max-w-4xl mx-auto mt-14 bg-card rounded-3xl border border-line p-8 pb-20 overflow-visible relative shadow-lg border border-line">
            <ShippingForm
              countries={countries.map((c) => ({
                code: c.code,
                name: getCountryName(c, loc),
                slug: loc === "ru" ? c.slug_ru : c.slug_en,
                slug_en: c.slug_en,
                slug_ru: c.slug_ru,
                continent: c.continent,
              }))}
              locale={loc}
              corridorSep={loc === "ru" ? "-v-" : "-to-"}
              labels={{
                from: t(loc, "from"),
                to: t(loc, "to"),
                submit: t(loc, "get_rates"),
                swap: t(loc, "swap_countries"),
              }}
            />
          </div>
          <p className="text-center text-xs text-muted mt-4">
            {t(loc, "rates_updated")}
          </p>
        </div>
      </section>

      {/* Popular corridors — featured 4 + compact rest */}
      <section className="mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          <h2 className="text-3xl font-bold text-ink mb-8">
            {t(loc, "popular_destinations")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {popularCorridors.slice(0, 2).map(([fromCode, toCode]) => {
              const from = countries.find((c) => c.code === fromCode);
              const to = countries.find((c) => c.code === toCode);
              if (!from || !to) return null;
              const slug = makeCorridorSlug(from, to, loc);
              const data = getCorridorData(fromCode, toCode);
              const cheapest = data?.carriers.length
                ? Math.min(...data.carriers.map(c => c.rates.find(r => r.weight_kg === 1)?.price_usd ?? 999))
                : null;
              return (
                <Link
                  key={`${fromCode}-${toCode}`}
                  href={`/${locale}/shipping/${slug}`}
                  prefetch={false}
                  className="bg-card hover:bg-card-hover rounded-2xl p-6 transition-colors"
                >
                  <p className="text-base text-body">
                    <span className="text-xl mr-1">{countryFlag(fromCode)}</span> {getCountryName(from, loc)} → {getCountryName(to, loc)} <span className="text-xl ml-1">{countryFlag(toCode)}</span>
                  </p>
                  {cheapest && cheapest < 999 && (
                    <p className="text-sm text-muted mt-2">{t(loc, "from_price")} <span className="text-ink font-medium">${cheapest}/kg</span></p>
                  )}
                </Link>
              );
            })}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {popularCorridors.slice(2).map(([fromCode, toCode]) => {
              const from = countries.find((c) => c.code === fromCode);
              const to = countries.find((c) => c.code === toCode);
              if (!from || !to) return null;
              const slug = makeCorridorSlug(from, to, loc);
              return (
                <Link
                  key={`${fromCode}-${toCode}`}
                  href={`/${locale}/shipping/${slug}`}
                  prefetch={false}
                  className="bg-card hover:bg-card-hover rounded-xl px-3 py-3 text-sm text-body transition-colors"
                >
                  {countryFlag(fromCode)} {getCountryName(from, loc)} → {getCountryName(to, loc)}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sample prices — asymmetric: 3 featured + 5 compact */}
      <section>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <h2 className="text-2xl font-bold text-ink mb-2">
            {t(loc, "shipping_cost_examples")}
          </h2>
          <p className="text-muted mb-6 text-sm">
            {t(loc, "sample_prices_subtitle")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
            {[["US", "GB"], ["CN", "US"], ["DE", "FR"]].map(([fromCode, toCode]) => {
              const from = countries.find((c) => c.code === fromCode);
              const to = countries.find((c) => c.code === toCode);
              if (!from || !to) return null;
              const data = getCorridorData(fromCode, toCode);
              const cheapest = data?.carriers.length
                ? Math.min(...data.carriers.map(c => c.rates.find(r => r.weight_kg === 1)?.price_usd ?? 999))
                : null;
              const fastest = data?.carriers.length
                ? Math.min(...data.carriers.map(c => c.estimated_days_min))
                : null;
              const slug = makeCorridorSlug(from, to, loc);
              return (
                <Link key={`${fromCode}-${toCode}`} href={`/${locale}/shipping/${slug}`} prefetch={false}
                  className="bg-card hover:bg-card-hover rounded-2xl p-6 transition-colors">
                  <p className="text-sm text-body mb-3">
                    {countryFlag(fromCode)} {getCountryName(from, loc)} → {getCountryName(to, loc)} {countryFlag(toCode)}
                  </p>
                  {cheapest && cheapest < 999 ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-light text-ink">${cheapest}</span>
                      <span className="text-sm text-muted">/kg</span>
                      {fastest && <span className="text-xs text-muted ml-auto">{fastest}+ {t(loc, "days_short")}</span>}
                    </div>
                  ) : (
                    <span className="text-sm text-muted">{t(loc, "compare_rates_cta")} →</span>
                  )}
                </Link>
              );
            })}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[["US", "JP"], ["GB", "AU"], ["KR", "US"], ["FR", "IT"], ["US", "CA"]].map(([fromCode, toCode]) => {
              const from = countries.find((c) => c.code === fromCode);
              const to = countries.find((c) => c.code === toCode);
              if (!from || !to) return null;
              const data = getCorridorData(fromCode, toCode);
              const cheapest = data?.carriers.length
                ? Math.min(...data.carriers.map(c => c.rates.find(r => r.weight_kg === 1)?.price_usd ?? 999))
                : null;
              const slug = makeCorridorSlug(from, to, loc);
              return (
                <Link key={`${fromCode}-${toCode}`} href={`/${locale}/shipping/${slug}`} prefetch={false}
                  className="bg-surface hover:bg-card rounded-lg px-3 py-3 transition-colors text-center">
                  <p className="text-xs text-muted">{countryFlag(fromCode)} → {countryFlag(toCode)}</p>
                  {cheapest && cheapest < 999 && (
                    <p className="text-lg font-light text-ink mt-1">${cheapest}<span className="text-xs text-muted">/kg</span></p>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tools — horizontal layout, not card grid */}
      <section>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch">
            <Link href={`/${locale}/tools/duty-calculator`}
              className="flex-1 flex items-center gap-4 bg-surface border border-line rounded-xl p-5 hover:border-accent/30 transition-colors">
              <span className="text-lg text-muted">/</span>
              <div>
                <h3 className="font-semibold text-ink text-sm">{t(loc, "duty_calculator_link")}</h3>
                <p className="text-xs text-muted mt-0.5">{t(loc, "vat_duties_cost")}</p>
              </div>
            </Link>
            <Link href={`/${locale}/tools/delivery-estimator`}
              className="flex-1 flex items-center gap-4 bg-surface border border-line rounded-xl p-5 hover:border-accent/30 transition-colors">
              <span className="text-lg text-muted">/</span>
              <div>
                <h3 className="font-semibold text-ink text-sm">{t(loc, "delivery_estimator")}</h3>
                <p className="text-xs text-muted mt-0.5">{t(loc, "delivery_weekends")}</p>
              </div>
            </Link>
            <Link href={`/${locale}/tools`}
              className="flex items-center gap-3 text-sm text-muted hover:text-ink transition-colors px-4">
              {t(loc, "all_tools_link")} →
            </Link>
          </div>
        </div>
      </section>

      {/* Ship from / Ship to — asymmetric: destinations bigger */}
      <section>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
            <div className="md:col-span-3">
              <h2 className="text-2xl font-bold text-ink mb-5">
                {t(loc, "popular_destinations")}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2">
                {popular.slice(0, 18).map((c) => (
                  <Link
                    key={c.code}
                    href={`/${locale}/shipping/to/${c.slug_en}`}
                    prefetch={false}
                    className="text-sm text-body hover:text-ink transition-colors py-1"
                  >
                    {t(loc, "ship_to", { country: getCountryName(c, loc) })}
                  </Link>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <h2 className="text-xl font-bold text-ink mb-5">
                {t(loc, "popular_origins")}
              </h2>
              <div className="grid grid-cols-1 gap-y-2">
                {popular.slice(0, 10).map((c) => (
                  <Link
                    key={c.code}
                    href={`/${locale}/shipping/from/${c.slug_en}`}
                    prefetch={false}
                    className="text-sm text-body hover:text-ink transition-colors py-1"
                  >
                    {t(loc, "ship_from", { country: getCountryName(c, loc) })}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Carriers — text flow, not centered block */}
      <section>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-sm text-muted uppercase tracking-widest mb-6">
            {t(loc, "comparing_carriers")}
          </p>
          <p className="text-body leading-loose">
            {["DHL Express", "FedEx", "UPS", "EMS", "Aramex", "SF Express", "USPS", "Royal Mail", "Japan Post", "DPD"].map((name, i) => {
              const isPrimary = ["DHL Express", "FedEx", "UPS"].includes(name);
              return (
                <span key={name}>
                  {i > 0 && <span className="mx-2 text-muted">&middot;</span>}
                  <span className={`${isPrimary ? "text-lg font-semibold" : "text-base"} opacity-60 hover:opacity-100 transition-opacity inline-block`}>
                    {name}
                  </span>
                </span>
              );
            })}
          </p>
          <Link
            href={`/${locale}/carriers`}
            className="inline-block mt-6 text-sm text-muted hover:opacity-60 transition-opacity"
          >
            {t(loc, "view_all_carriers")} →
          </Link>
        </div>
      </section>

      {/* How it works — horizontal numbered list, not 3 identical cards */}
      <section>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          <img src="/img/package-journey.svg" alt="" aria-hidden="true" className="w-full max-w-lg mx-auto mb-8 opacity-60" />
          <h2 className="text-2xl font-bold text-ink mb-10">
            {t(loc, "how_it_works")}
          </h2>
          <div className="space-y-6">
            <div className="flex gap-5 items-start">
              <span className="shrink-0 w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-sm">1</span>
              <div>
                <h3 className="font-semibold text-ink">{t(loc, "choose_route")}</h3>
                <p className="text-sm text-muted mt-1">{t(loc, "choose_route_desc")}</p>
              </div>
            </div>
            <div className="flex gap-5 items-start">
              <span className="shrink-0 w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-sm">2</span>
              <div>
                <h3 className="font-semibold text-ink">{t(loc, "compare_rates")}</h3>
                <p className="text-sm text-muted mt-1">{t(loc, "compare_rates_desc")}</p>
              </div>
            </div>
            <div className="flex gap-5 items-start">
              <span className="shrink-0 w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-sm">3</span>
              <div>
                <h3 className="font-semibold text-ink">{t(loc, "ship_package")}</h3>
                <p className="text-sm text-muted mt-1">{t(loc, "ship_package_desc")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HowTo JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: t(loc, "how_it_works"),
            step: [
              {
                "@type": "HowToStep",
                position: 1,
                name: t(loc, "choose_route"),
                text: t(loc, "choose_route_desc"),
              },
              {
                "@type": "HowToStep",
                position: 2,
                name: t(loc, "compare_rates"),
                text: t(loc, "compare_rates_desc"),
              },
              {
                "@type": "HowToStep",
                position: 3,
                name: t(loc, "ship_package"),
                text: t(loc, "ship_package_desc"),
              },
            ],
          }),
        }}
      />

      {/* All countries */}
      <section>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
          <h2 className="text-xl font-bold text-ink mb-6">
            {t(loc, "all_countries")}
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-y-1 gap-x-4">
            {countries.slice(0, 50).map((c) => (
              <Link
                key={c.code}
                href={`/${locale}/shipping/from/${c.slug_en}`}
                prefetch={false}
                className="text-xs text-muted hover:text-body transition-colors py-0.5 truncate"
              >
                {countryFlag(c.code)} {getCountryName(c, loc)}
              </Link>
            ))}
          </div>
          <Link
            href={`/${locale}/guide`}
            className="inline-block mt-4 text-sm text-muted hover:text-ink transition-colors"
          >
            {t(loc, "all_countries_link")} →
          </Link>
        </div>
      </section>

      {/* Popular guides */}
      <section>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
          <h2 className="text-2xl font-bold text-ink mb-6">
            {t(loc, "popular_guides")}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-2 gap-x-4">
            {popular.slice(0, 12).map((c) => (
              <Link
                key={c.code}
                href={`/${locale}/guide/${c.slug_en}`}
                prefetch={false}
                className="text-body hover:opacity-60 transition-all text-sm py-1"
              >
                <span className="inline-block hover:scale-110 transition-transform text-base">{countryFlag(c.code)}</span> {getCountryName(c, loc)}
              </Link>
            ))}
          </div>
          <Link
            href={`/${locale}/guide`}
            className="inline-block mt-8 text-sm text-muted hover:opacity-60 transition-opacity"
          >
            {t(loc, "all_guides")} →
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center">
          <h2 className="text-2xl font-bold text-ink mb-3">
            {t(loc, "newsletter_title")}
          </h2>
          <p className="text-muted mb-8 text-sm">
            {t(loc, "newsletter_subtitle")}
          </p>
          <NewsletterForm
            locale={locale}
            labels={{
              thanks: t(loc, "newsletter_thanks"),
              placeholder: t(loc, "newsletter_placeholder"),
              subscribe: t(loc, "newsletter_subscribe"),
            }}
          />
          <p className="text-xs text-muted mt-4">
            {t(loc, "newsletter_privacy")}
          </p>
        </div>
      </section>

      {/* FAQ */}
      {(() => {
        const faqs = [
          { q: t(loc, "home_faq_1_q"), a: t(loc, "home_faq_1_a") },
          { q: t(loc, "home_faq_2_q"), a: t(loc, "home_faq_2_a") },
          { q: t(loc, "home_faq_3_q"), a: t(loc, "home_faq_3_a") },
          { q: t(loc, "home_faq_4_q"), a: t(loc, "home_faq_4_a") },
          { q: t(loc, "home_faq_5_q"), a: t(loc, "home_faq_5_a") },
        ];

        return (
          <section>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
              <h2 className="text-3xl font-bold text-ink mb-10">
                {t(loc, "faq_title")}
              </h2>
              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <details key={i} className="bg-card rounded-2xl group">
                    <summary className="py-5 px-6 font-medium text-body cursor-pointer hover:text-ink transition-colors">
                      {faq.q}
                    </summary>
                    <p className="pb-6 px-6 text-muted text-sm leading-relaxed">
                      {faq.a}
                    </p>
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
            </div>
          </section>
        );
      })()}
    </div>
  );
}
