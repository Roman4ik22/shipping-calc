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

  // Popular corridors for display
  const popularCorridors = [
    ["US", "GB"], ["US", "DE"], ["CN", "US"], ["GB", "DE"],
    ["US", "JP"], ["US", "AU"], ["CN", "GB"], ["DE", "FR"],
    ["US", "CA"], ["CN", "JP"], ["RU", "DE"], ["US", "KR"],
    ["MY", "SG"], ["TH", "JP"], ["AE", "IN"], ["BR", "US"],
  ];

  return (
    <div>
      {/* Hero section */}
      <section className="relative overflow-visible">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-dark/30 via-dark-900 to-dark-800" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-accent)/15%,transparent_70%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-4 text-white tracking-tight">
            {t(loc, "compare_shipping_rates")}
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 text-center max-w-3xl mx-auto mb-8">
            {t(loc, "hero_subtitle", { count: "134" })}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-10">
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-white">213</p>
              <p className="text-sm text-gray-400">{t(loc, "all_countries")}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-white">134</p>
              <p className="text-sm text-gray-400">{t(loc, "carriers_page")}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-white">45K+</p>
              <p className="text-sm text-gray-400">{t(loc, "routes")}</p>
            </div>
          </div>

          {/* Shipping form */}
          <div className="max-w-4xl mx-auto bg-surface-light/80 backdrop-blur-sm border border-white/10 rounded-xl p-6 pb-20 overflow-visible relative">
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-white mb-6">
          {t(loc, "popular_destinations")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
                className="block bg-surface border border-white/10 rounded-lg p-4 hover:border-accent/50 hover:bg-surface-light transition-all"
              >
                <p className="font-medium text-white">
                  {countryFlag(fromCode)} {getCountryName(from, loc)} → {getCountryName(to, loc)} {countryFlag(toCode)}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {t(loc, "compare_rates")}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Ship from / Ship to sections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              {t(loc, "popular_origins")}
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {popular.slice(0, 16).map((c) => (
                <Link
                  key={c.code}
                  href={`/${locale}/shipping/from/${c.slug_en}`}
                  prefetch={false}
                  className="text-sm text-accent-light hover:text-white py-1 transition-colors"
                >
                  {t(loc, "ship_from", { country: getCountryName(c, loc) })}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              {t(loc, "popular_destinations")}
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {popular.slice(0, 16).map((c) => (
                <Link
                  key={c.code}
                  href={`/${locale}/shipping/to/${c.slug_en}`}
                  prefetch={false}
                  className="text-sm text-accent-light hover:text-white py-1 transition-colors"
                >
                  {t(loc, "ship_to", { country: getCountryName(c, loc) })}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trusted carriers */}
      <section className="bg-surface py-10 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-400 mb-6">
            {t(loc, "comparing_carriers")}
          </p>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10 items-center">
            {["DHL Express", "FedEx", "UPS", "EMS", "Aramex", "SF Express", "USPS", "Royal Mail", "Japan Post", "DPD"].map((name) => (
              <span key={name} className="text-gray-300 font-semibold text-sm sm:text-base whitespace-nowrap">
                {name}
              </span>
            ))}
          </div>
          <div className="text-center mt-4">
            <Link href={`/${locale}/carriers`} className="text-sm text-accent-light hover:text-white transition-colors">
              {t(loc, "view_all_carriers")} →
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            {t(loc, "how_it_works")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-accent/20 text-accent-light rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 className="font-semibold text-white mb-2">
                {t(loc, "choose_route")}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {t(loc, "choose_route_desc")}
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent/20 text-accent-light rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="font-semibold text-white mb-2">
                {t(loc, "compare_rates")}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {t(loc, "compare_rates_desc")}
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent/20 text-accent-light rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="font-semibold text-white mb-2">
                {t(loc, "ship_package")}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-white mb-6">
          {t(loc, "all_countries")}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {countries.map((c) => (
            <Link
              key={c.code}
              href={`/${locale}/shipping/from/${c.slug_en}`}
              prefetch={false}
              className="text-sm text-gray-400 hover:text-accent-light py-1 transition-colors"
            >
              {getCountryName(c, loc)}
            </Link>
          ))}
        </div>
      </section>

      {/* Popular shipping guides */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-white mb-6">
          {t(loc, "popular_guides")}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {popular.slice(0, 12).map((c) => (
            <Link
              key={c.code}
              href={`/${locale}/guide/${c.slug_en}`}
              prefetch={false}
              className="flex items-center gap-2 bg-surface border border-white/10 rounded-lg p-3 hover:border-accent/50 hover:bg-surface-light transition-all text-sm"
            >
              <span>{countryFlag(c.code)}</span>
              <span className="text-gray-300">{getCountryName(c, loc)}</span>
            </Link>
          ))}
        </div>
        <div className="text-center mt-4">
          <Link href={`/${locale}/guide`} className="text-sm text-accent-light hover:text-white transition-colors">
            {t(loc, "all_guides")} →
          </Link>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-surface-light border-y border-white/10 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            {t(loc, "newsletter_title")}
          </h2>
          <p className="text-gray-400 mb-6 text-sm">
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
          <p className="text-xs text-gray-500 mt-3">
            {t(loc, "newsletter_privacy")}
          </p>
        </div>
      </section>

      {/* Homepage FAQ */}
      {(() => {
        const faqs = [
          { q: t(loc, "home_faq_1_q"), a: t(loc, "home_faq_1_a") },
          { q: t(loc, "home_faq_2_q"), a: t(loc, "home_faq_2_a") },
          { q: t(loc, "home_faq_3_q"), a: t(loc, "home_faq_3_a") },
          { q: t(loc, "home_faq_4_q"), a: t(loc, "home_faq_4_a") },
          { q: t(loc, "home_faq_5_q"), a: t(loc, "home_faq_5_a") },
        ];

        return (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-2xl font-bold text-white mb-6">
              {t(loc, "faq_title")}
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <details key={i} className="bg-surface border border-white/10 rounded-lg">
                  <summary className="p-4 font-medium text-gray-200 cursor-pointer hover:text-accent-light transition-colors">
                    {faq.q}
                  </summary>
                  <p className="px-4 pb-4 text-gray-400 text-sm">{faq.a}</p>
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
    </div>
  );
}
