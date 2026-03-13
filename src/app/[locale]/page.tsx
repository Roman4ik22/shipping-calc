import { Metadata } from "next";
import { countries, getPopularCountries, getCountryName, makeCorridorSlug } from "@/lib/data";
import { t, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { countryFlag } from "@/lib/flags";
import ShippingForm from "@/components/ShippingForm";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  return {
    title: t(loc, "compare_shipping_rates") + " | ShipWorldwide",
    description: t(loc, "hero_subtitle", { count: "109" }),
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/en", ru: "/ru" },
    },
    openGraph: {
      title: t(loc, "compare_shipping_rates"),
      description: t(loc, "hero_subtitle", { count: "109" }),
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
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-4">
            {t(loc, "compare_shipping_rates")}
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 text-center max-w-3xl mx-auto mb-8">
            {t(loc, "hero_subtitle", { count: "109" })}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-10">
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold">213</p>
              <p className="text-sm text-blue-200">{t(loc, "all_countries")}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold">109</p>
              <p className="text-sm text-blue-200">{t(loc, "carriers_page")}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold">45K+</p>
              <p className="text-sm text-blue-200">{loc === "ru" ? "Маршрутов" : "Routes"}</p>
            </div>
          </div>

          {/* Shipping form */}
          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <ShippingForm
              countries={countries.map((c) => ({
                code: c.code,
                name_en: c.name_en,
                name_ru: c.name_ru,
                slug_en: c.slug_en,
                slug_ru: c.slug_ru,
                continent: c.continent,
              }))}
              locale={loc}
              labels={{
                from: t(loc, "from"),
                to: t(loc, "to"),
                submit: t(loc, "get_rates"),
              }}
            />
          </div>
        </div>
      </section>

      {/* Popular corridors */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
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
                className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <p className="font-medium text-gray-900">
                  {countryFlag(fromCode)} {getCountryName(from, loc)} → {getCountryName(to, loc)} {countryFlag(toCode)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t(loc, "popular_origins")}
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {popular.slice(0, 16).map((c) => (
                <Link
                  key={c.code}
                  href={`/${locale}/shipping/from/${c.slug_en}`}
                  className="text-sm text-blue-600 hover:text-blue-800 py-1"
                >
                  {t(loc, "ship_from", { country: getCountryName(c, loc) })}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t(loc, "popular_destinations")}
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {popular.slice(0, 16).map((c) => (
                <Link
                  key={c.code}
                  href={`/${locale}/shipping/to/${c.slug_en}`}
                  className="text-sm text-blue-600 hover:text-blue-800 py-1"
                >
                  {t(loc, "ship_to", { country: getCountryName(c, loc) })}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trusted carriers */}
      <section className="bg-white py-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 mb-6">
            {loc === "ru" ? "Сравниваем тарифы 109+ перевозчиков, включая:" : "Comparing rates from 109+ carriers, including:"}
          </p>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10 items-center">
            {["DHL Express", "FedEx", "UPS", "EMS", "Aramex", "SF Express", "USPS", "Royal Mail", "Japan Post", "DPD"].map((name) => (
              <span key={name} className="text-gray-400 font-semibold text-sm sm:text-base whitespace-nowrap">
                {name}
              </span>
            ))}
          </div>
          <div className="text-center mt-4">
            <Link href={`/${locale}/carriers`} className="text-sm text-blue-600 hover:text-blue-800">
              {loc === "ru" ? "Все перевозчики →" : "View all carriers →"}
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            {t(loc, "how_it_works")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {loc === "ru" ? "Выберите маршрут" : "Choose your route"}
              </h3>
              <p className="text-sm text-gray-600">
                {loc === "ru"
                  ? "Укажите страну отправления и назначения. Мы поддерживаем 213 стран и территорий."
                  : "Select your origin and destination countries. We support 213 countries and territories."}
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {loc === "ru" ? "Сравните тарифы" : "Compare rates"}
              </h3>
              <p className="text-sm text-gray-600">
                {loc === "ru"
                  ? "Увидьте цены от 109+ перевозчиков включая DHL, FedEx, UPS, EMS и почтовые службы."
                  : "See prices from 109+ carriers including DHL, FedEx, UPS, EMS, and postal services."}
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {loc === "ru" ? "Отправьте посылку" : "Ship your package"}
              </h3>
              <p className="text-sm text-gray-600">
                {loc === "ru"
                  ? "Выберите лучший вариант по цене и скорости, и оформите отправку через сайт перевозчика."
                  : "Pick the best option by price and speed, then book directly through the carrier's website."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* All countries */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {t(loc, "all_countries")}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {countries.map((c) => (
            <Link
              key={c.code}
              href={`/${locale}/shipping/from/${c.slug_en}`}
              className="text-sm text-gray-600 hover:text-blue-600 py-1"
            >
              {getCountryName(c, loc)}
            </Link>
          ))}
        </div>
      </section>

      {/* Popular shipping guides */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {loc === "ru" ? "Популярные гиды по доставке" : "Popular Shipping Guides"}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {popular.slice(0, 12).map((c) => (
            <Link
              key={c.code}
              href={`/${locale}/guide/${c.slug_en}`}
              className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-300 hover:shadow-sm transition-all text-sm"
            >
              <span>{countryFlag(c.code)}</span>
              <span className="text-gray-700">{getCountryName(c, loc)}</span>
            </Link>
          ))}
        </div>
        <div className="text-center mt-4">
          <Link href={`/${locale}/guide`} className="text-sm text-blue-600 hover:text-blue-800">
            {loc === "ru" ? "Все гиды →" : "All shipping guides →"}
          </Link>
        </div>
      </section>

      {/* Homepage FAQ */}
      {(() => {
        const faqs = loc === "ru" ? [
          { q: "Как работает ShipWorldwide?", a: "ShipWorldwide сравнивает тарифы международной доставки от 109+ перевозчиков по всему миру. Выберите страну отправления и назначения, и мы покажем все доступные варианты с ценами, сроками и возможностью отслеживания." },
          { q: "Это бесплатно?", a: "Да, сравнение тарифов на ShipWorldwide полностью бесплатно. Мы показываем ориентировочные цены на основе опубликованных тарифов перевозчиков." },
          { q: "Какие перевозчики поддерживаются?", a: "Мы поддерживаем 109+ перевозчиков, включая DHL Express, FedEx, UPS, EMS, Почту России, CDEK, Aramex, SF Express, и десятки региональных и почтовых служб по всему миру." },
          { q: "Насколько точны цены?", a: "Цены являются оценочными на основе опубликованных прайс-листов. Фактическая стоимость может отличаться в зависимости от габаритов посылки, топливных сборов, страховки и типа аккаунта у перевозчика." },
          { q: "Нужно ли платить таможенные пошлины?", a: "Таможенные пошлины и налоги зависят от страны назначения, стоимости и типа товара. Мы показываем информацию о таможенных правилах для каждого направления, включая беспошлинные пороги и ставки НДС." },
        ] : [
          { q: "How does ShipWorldwide work?", a: "ShipWorldwide compares international shipping rates from 109+ carriers worldwide. Select your origin and destination countries, and we'll show all available options with prices, delivery times, and tracking availability." },
          { q: "Is it free to use?", a: "Yes, comparing shipping rates on ShipWorldwide is completely free. We display estimated prices based on carriers' published tariffs." },
          { q: "Which carriers are supported?", a: "We support 109+ carriers including DHL Express, FedEx, UPS, EMS, USPS, Royal Mail, Aramex, SF Express, and dozens of regional and postal services worldwide." },
          { q: "How accurate are the prices?", a: "Prices are estimates based on published rate cards. Actual costs may vary depending on package dimensions, fuel surcharges, insurance, and your account type with the carrier." },
          { q: "Do I need to pay customs duties?", a: "Customs duties and taxes depend on the destination country, declared value, and type of goods. We display customs information for each route, including duty-free thresholds and VAT rates." },
        ];

        return (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {loc === "ru" ? "Часто задаваемые вопросы" : "Frequently Asked Questions"}
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
    </div>
  );
}
