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
      <section className="bg-dark-900 py-24 sm:py-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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

          <div className="max-w-4xl mx-auto mt-14 bg-dark-800 rounded-2xl p-8 pb-20 overflow-visible relative">
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
      <section className="border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl font-bold text-white mb-10">
            {t(loc, "popular_destinations")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-8">
            {popularCorridors.map(([fromCode, toCode]) => {
              const from = countries.find((c) => c.code === fromCode);
              const to = countries.find((c) => c.code === toCode);
              if (!from || !to) return null;
              const slug = makeCorridorSlug(from, to, loc);
              return (
                <Link
                  key={`${fromCode}-${toCode}`}
                  href={`/${locale}/shipping/${slug}`}
                  prefetch={false}
                  className="text-gray-300 hover:opacity-60 transition-opacity py-1"
                >
                  {countryFlag(fromCode)} {getCountryName(from, loc)} → {getCountryName(to, loc)} {countryFlag(toCode)}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ship from / Ship to */}
      <section className="border-t border-white/5">
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
      <section className="border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="text-sm text-gray-600 uppercase tracking-widest mb-6">
            {t(loc, "comparing_carriers")}
          </p>
          <p className="text-gray-400 text-lg leading-loose">
            {["DHL Express", "FedEx", "UPS", "EMS", "Aramex", "SF Express", "USPS", "Royal Mail", "Japan Post", "DPD"].join(" · ")}
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
      <section className="border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <h2 className="text-3xl font-bold text-white mb-16 text-center">
            {t(loc, "how_it_works")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div>
              <p className="font-mono text-5xl font-bold text-gray-700 mb-4">1.</p>
              <h3 className="text-lg font-semibold text-white mb-2">
                {t(loc, "choose_route")}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {t(loc, "choose_route_desc")}
              </p>
            </div>
            <div>
              <p className="font-mono text-5xl font-bold text-gray-700 mb-4">2.</p>
              <h3 className="text-lg font-semibold text-white mb-2">
                {t(loc, "compare_rates")}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {t(loc, "compare_rates_desc")}
              </p>
            </div>
            <div>
              <p className="font-mono text-5xl font-bold text-gray-700 mb-4">3.</p>
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
      <section className="border-t border-white/5">
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
                className="text-xs text-gray-600 hover:opacity-60 transition-opacity py-0.5 truncate"
              >
                {getCountryName(c, loc)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular guides */}
      <section className="border-t border-white/5">
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
                className="text-gray-400 hover:opacity-60 transition-opacity text-sm py-1"
              >
                {countryFlag(c.code)} {getCountryName(c, loc)}
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
      <section className="border-t border-white/5">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
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
          <section className="border-t border-white/5">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
              <h2 className="text-3xl font-bold text-white mb-10">
                {t(loc, "faq_title")}
              </h2>
              <div>
                {faqs.map((faq, i) => (
                  <details key={i} className="border-b border-white/5 group">
                    <summary className="py-5 font-medium text-gray-300 cursor-pointer hover:opacity-60 transition-opacity select-none">
                      {faq.q}
                    </summary>
                    <p className="pb-6 text-gray-500 text-sm leading-relaxed">
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
