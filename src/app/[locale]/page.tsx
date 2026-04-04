import { Metadata } from "next";
import { countries, getPopularCountries, getCountryName, makeCorridorSlug } from "@/lib/data";
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
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
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
      <section className="bg-dark-900 py-24 sm:py-32 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px]" />
          <div className="absolute -bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white text-center">
            {t(loc, "compare_shipping_rates")}
          </h1>
          <p className="text-xl text-gray-500 text-center max-w-2xl mx-auto mt-6">
            {t(loc, "hero_subtitle", { count: "134" })}
          </p>

          <p className="text-center mt-8 text-sm text-gray-600 tracking-wide">
            <span className="font-mono">213</span> {t(loc, "all_countries")}
            <span className="mx-3 text-gray-700">|</span>
            <span className="font-mono">134</span> {t(loc, "carriers_page")}
            <span className="mx-3 text-gray-700">|</span>
            <span className="font-mono">45K+</span> {t(loc, "routes")}
          </p>

          <div className="max-w-4xl mx-auto mt-14 bg-card rounded-3xl p-8 pb-20 overflow-visible relative shadow-2xl">
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
        </div>
      </section>

      {/* Popular corridors */}
      <section className="mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl font-bold text-white mb-10">
            {t(loc, "popular_destinations")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {popularCorridors.slice(0, 4).map(([fromCode, toCode]) => {
              const from = countries.find((c) => c.code === fromCode);
              const to = countries.find((c) => c.code === toCode);
              if (!from || !to) return null;
              const slug = makeCorridorSlug(from, to, loc);
              return (
                <Link
                  key={`${fromCode}-${toCode}`}
                  href={`/${locale}/shipping/${slug}`}
                  prefetch={false}
                  className="bg-card hover:bg-card-hover rounded-2xl p-4 text-base text-gray-300 transition-colors"
                >
                  <span className="text-lg">{countryFlag(fromCode)}</span> {getCountryName(from, loc)} → {getCountryName(to, loc)} <span className="text-lg">{countryFlag(toCode)}</span>
                </Link>
              );
            })}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-3">
            {popularCorridors.slice(4).map(([fromCode, toCode]) => {
              const from = countries.find((c) => c.code === fromCode);
              const to = countries.find((c) => c.code === toCode);
              if (!from || !to) return null;
              const slug = makeCorridorSlug(from, to, loc);
              return (
                <Link
                  key={`${fromCode}-${toCode}`}
                  href={`/${locale}/shipping/${slug}`}
                  prefetch={false}
                  className="bg-card hover:bg-card-hover rounded-2xl p-4 text-sm text-gray-400 transition-colors"
                >
                  {countryFlag(fromCode)} {getCountryName(from, loc)} → {getCountryName(to, loc)} {countryFlag(toCode)}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ship from / Ship to */}
      <section>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">
                {t(loc, "popular_origins")}
              </h2>
              <div className="grid grid-cols-2 gap-y-2">
                {popular.slice(0, 16).map((c) => (
                  <Link
                    key={c.code}
                    href={`/${locale}/shipping/from/${c.slug_en}`}
                    prefetch={false}
                    className="text-sm text-gray-400 hover:opacity-60 transition-opacity py-1"
                  >
                    {t(loc, "ship_from", { country: getCountryName(c, loc) })}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">
                {t(loc, "popular_destinations")}
              </h2>
              <div className="grid grid-cols-2 gap-y-2">
                {popular.slice(0, 16).map((c) => (
                  <Link
                    key={c.code}
                    href={`/${locale}/shipping/to/${c.slug_en}`}
                    prefetch={false}
                    className="text-sm text-gray-400 hover:opacity-60 transition-opacity py-1"
                  >
                    {t(loc, "ship_to", { country: getCountryName(c, loc) })}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Carriers */}
      <section>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="text-sm text-gray-600 uppercase tracking-widest mb-6">
            {t(loc, "comparing_carriers")}
          </p>
          <p className="text-gray-400 leading-loose">
            {["DHL Express", "FedEx", "UPS", "EMS", "Aramex", "SF Express", "USPS", "Royal Mail", "Japan Post", "DPD"].map((name, i) => {
              const isPrimary = ["DHL Express", "FedEx", "UPS"].includes(name);
              return (
                <span key={name}>
                  {i > 0 && <span className="mx-2 text-gray-600">&middot;</span>}
                  <span className={`${isPrimary ? "text-lg font-semibold" : "text-base"} opacity-60 hover:opacity-100 transition-opacity inline-block`}>
                    {name}
                  </span>
                </span>
              );
            })}
          </p>
          <Link
            href={`/${locale}/carriers`}
            className="inline-block mt-6 text-sm text-gray-500 hover:opacity-60 transition-opacity"
          >
            {t(loc, "view_all_carriers")} →
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <h2 className="text-3xl font-bold text-white mb-16 text-center">
            {t(loc, "how_it_works")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card rounded-2xl p-6">
              <div className="flex items-end gap-3 mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent-light">
                  <circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <span className="font-mono text-2xl font-bold text-gray-600">1.</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {t(loc, "choose_route")}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {t(loc, "choose_route_desc")}
              </p>
            </div>
            <div className="bg-card rounded-2xl p-6">
              <div className="flex items-end gap-3 mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent-light">
                  <path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" />
                </svg>
                <span className="font-mono text-2xl font-bold text-gray-600">2.</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {t(loc, "compare_rates")}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {t(loc, "compare_rates_desc")}
              </p>
            </div>
            <div className="bg-card rounded-2xl p-6">
              <div className="flex items-end gap-3 mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent-light">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><path d="M3.27 6.96 12 12.01l8.73-5.05" /><path d="M12 22.08V12" />
                </svg>
                <span className="font-mono text-2xl font-bold text-gray-600">3.</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {t(loc, "ship_package")}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {t(loc, "ship_package_desc")}
              </p>
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl font-bold text-white mb-8">
            {t(loc, "all_countries")}
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-y-1 gap-x-4">
            {countries.map((c) => (
              <Link
                key={c.code}
                href={`/${locale}/shipping/from/${c.slug_en}`}
                prefetch={false}
                className="text-xs text-gray-600 hover:opacity-60 transition-all py-0.5 truncate group"
              >
                <span className="inline-block hover:scale-110 transition-transform text-sm mr-0.5">{countryFlag(c.code)}</span> {getCountryName(c, loc)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular guides */}
      <section>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl font-bold text-white mb-8">
            {t(loc, "popular_guides")}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-y-3 gap-x-8">
            {popular.slice(0, 12).map((c) => (
              <Link
                key={c.code}
                href={`/${locale}/guide/${c.slug_en}`}
                prefetch={false}
                className="text-gray-400 hover:opacity-60 transition-all text-sm py-1"
              >
                <span className="inline-block hover:scale-110 transition-transform text-base">{countryFlag(c.code)}</span> {getCountryName(c, loc)}
              </Link>
            ))}
          </div>
          <Link
            href={`/${locale}/guide`}
            className="inline-block mt-8 text-sm text-gray-500 hover:opacity-60 transition-opacity"
          >
            {t(loc, "all_guides")} →
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="flex justify-center mb-6">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
              <rect x="8" y="14" width="24" height="20" rx="2" />
              <path d="M32 24h6" /><path d="M35 20l4 4-4 4" />
              <path d="M14 20h8" /><path d="M14 26h6" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">
            {t(loc, "newsletter_title")}
          </h2>
          <p className="text-gray-500 mb-8 text-sm">
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
          <p className="text-xs text-gray-600 mt-4">
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
              <h2 className="text-3xl font-bold text-white mb-10">
                {t(loc, "faq_title")}
              </h2>
              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <details key={i} className="bg-card rounded-2xl group">
                    <summary className="py-5 px-6 font-medium text-gray-300 cursor-pointer hover:text-white transition-colors select-none">
                      {faq.q}
                    </summary>
                    <p className="pb-6 px-6 text-gray-500 text-sm leading-relaxed">
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
