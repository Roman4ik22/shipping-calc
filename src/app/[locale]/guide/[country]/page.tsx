import { Metadata } from "next";
import {
  countries,
  getCountryBySlug,
  getCountryName,
  getPopularCountries,
  makeCorridorSlug,
  carriers,
} from "@/lib/data";
import { getCustomsInfo, hasCustomsData } from "@/lib/customs";
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
    title:
      loc === "ru"
        ? `Гид по доставке в ${name} — Таможня, перевозчики, советы`
        : `Shipping Guide to ${name} — Customs, Carriers & Tips`,
    description:
      loc === "ru"
        ? `Полный гид по международной доставке в ${name}. Таможенные правила, лучшие перевозчики, сроки и стоимость доставки.`
        : `Complete guide to international shipping to ${name}. Customs rules, best carriers, delivery times and rates.`,
    alternates: {
      canonical: `/${locale}/guide/${slug}`,
      languages: {
        en: `/en/guide/${slug}`,
        ru: `/ru/guide/${slug}`,
      },
    },
    openGraph: {
      title: loc === "ru" ? `Гид по доставке в ${name}` : `Shipping Guide to ${name}`,
      description: loc === "ru"
        ? `Таможенные правила, перевозчики и тарифы для ${name}`
        : `Customs rules, carriers and rates for ${name}`,
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
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-blue-600">
          {t(loc, "home")}
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guide`} className="hover:text-blue-600">
          {loc === "ru" ? "Гиды" : "Guides"}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{name}</span>
      </nav>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
        {countryFlag(country.code)}{" "}
        {loc === "ru"
          ? `Гид по доставке в ${name}`
          : `Shipping Guide to ${name}`}
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
          {loc === "ru" ? "Обзор" : "Overview"}
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {loc === "ru"
            ? `${name} находится в регионе ${country.region} (${country.continent}). На нашем сайте доступно сравнение тарифов от ${carrierCount}+ перевозчиков для доставки в ${name} и из ${name}. Среди них ${internationalCarriers.length} международных экспресс-служб (DHL, FedEx, UPS и другие) и ${postalCarriers.length} почтовых сервисов.`
            : `${name} is located in ${country.region} (${country.continent}). We compare rates from ${carrierCount}+ carriers for shipping to and from ${name}, including ${internationalCarriers.length} international express services (DHL, FedEx, UPS, and more) and ${postalCarriers.length} postal services.`}
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
                <p className="text-sm text-gray-500 mb-1">{t(loc, "de_minimis")}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {customs.de_minimis_usd > 0
                    ? `$${customs.de_minimis_usd}`
                    : loc === "ru" ? "$0" : "$0"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {customs.de_minimis_usd > 0
                    ? (loc === "ru"
                        ? `Посылки дешевле $${customs.de_minimis_usd} — без пошлины`
                        : `Packages under $${customs.de_minimis_usd} — duty free`)
                    : (loc === "ru"
                        ? "Пошлина с первого доллара"
                        : "Duty applies from $0")}
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">{t(loc, "vat_rate")}</p>
                <p className="text-2xl font-bold text-gray-900">{customs.vat_rate}%</p>
                <p className="text-xs text-gray-400 mt-1">{customs.currency}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">{t(loc, "avg_duty")}</p>
                <p className="text-2xl font-bold text-gray-900">{customs.avg_duty_rate}%</p>
                <p className="text-xs text-gray-400 mt-1">
                  {loc === "ru" ? "В среднем" : "Average"}
                </p>
              </div>
            </div>
            {(loc === "ru" ? customs.notes_ru : customs.notes_en) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">{t(loc, "customs_note")}:</span>{" "}
                  {loc === "ru" ? customs.notes_ru : customs.notes_en}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Required Documents */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {loc === "ru" ? "Необходимые документы" : "Required Documents"}
        </h2>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(loc === "ru" ? [
              { doc: "Коммерческий инвойс (Commercial Invoice)", desc: "Описание товара, количество, стоимость, данные отправителя и получателя" },
              { doc: "Упаковочный лист (Packing List)", desc: "Детальное описание содержимого каждого места" },
              { doc: "Таможенная декларация (CN22/CN23)", desc: "Обязательна для почтовых отправлений" },
              { doc: "Авианакладная (AWB)", desc: "Создаётся перевозчиком при оформлении отправки" },
              { doc: "Сертификат происхождения", desc: "Может потребоваться для снижения пошлин (FTA/преференции)" },
              { doc: "Лицензия на экспорт/импорт", desc: "Для товаров с ограничениями (электроника, лекарства, химикаты)" },
            ] : [
              { doc: "Commercial Invoice", desc: "Item description, quantity, value, sender and receiver details" },
              { doc: "Packing List", desc: "Detailed description of contents in each package" },
              { doc: "Customs Declaration (CN22/CN23)", desc: "Required for postal shipments" },
              { doc: "Air Waybill (AWB)", desc: "Generated by the carrier when booking the shipment" },
              { doc: "Certificate of Origin", desc: "May be required for reduced duties (FTA/preferential rates)" },
              { doc: "Export/Import License", desc: "For restricted goods (electronics, medicines, chemicals)" },
            ]).map((item, i) => (
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
            {loc === "ru" ? "Оценка пошлин и налогов" : "Duty & Tax Estimate"}
          </h2>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <p className="text-sm text-gray-600 mb-4">
              {loc === "ru"
                ? `Примерный расчёт импортных платежей при ввозе товара в ${name}:`
                : `Estimated import charges when shipping goods to ${name}:`}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-200">
                    <th className="pb-2 pr-4">{loc === "ru" ? "Стоимость товара" : "Goods Value"}</th>
                    <th className="pb-2 pr-4">{loc === "ru" ? "Пошлина" : "Duty"}</th>
                    <th className="pb-2 pr-4">{loc === "ru" ? "НДС/Налог" : "VAT/Tax"}</th>
                    <th className="pb-2">{loc === "ru" ? "Итого к оплате" : "Total Charges"}</th>
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
                          {total > 0 ? `$${total.toFixed(0)}` : (loc === "ru" ? "Бесплатно" : "Free")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              {loc === "ru"
                ? "* Расчёт приблизительный. Реальные пошлины зависят от категории товара и HS-кода."
                : "* Estimates only. Actual duties depend on product category and HS code."}
            </p>
          </div>
        </section>
      )}

      {/* Tips */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {loc === "ru" ? "Советы по доставке" : "Shipping Tips"}
        </h2>
        <div className="space-y-3">
          {(loc === "ru"
            ? [
                "Всегда декларируйте содержимое и стоимость посылки. Недекларирование может привести к задержке на таможне.",
                "Для ценных посылок выбирайте сервисы с отслеживанием и страховкой.",
                `Учитывайте беспошлинный порог $${customs.de_minimis_usd} при отправке в ${name}.`,
                "Сравните цены нескольких перевозчиков — разница может достигать 3-5 раз.",
                "Экспресс-доставка (DHL, FedEx, UPS) обычно включает таможенное оформление в стоимость.",
                "Почтовые сервисы дешевле, но сроки доставки менее предсказуемы.",
              ]
            : [
                "Always declare package contents and value accurately. Misdeclaration can lead to customs delays.",
                "For valuable shipments, choose services with tracking and insurance.",
                `Keep the duty-free threshold of $${customs.de_minimis_usd} in mind when shipping to ${name}.`,
                "Compare rates from multiple carriers — prices can vary 3-5x for the same route.",
                "Express services (DHL, FedEx, UPS) typically include customs clearance in the price.",
                "Postal services are cheaper but delivery times are less predictable.",
              ]
          ).map((tip, i) => (
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
          {loc === "ru" ? "Запрещённые и ограниченные товары" : "Prohibited & Restricted Items"}
        </h2>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-red-700 mb-2 text-sm">
                {loc === "ru" ? "Запрещено к пересылке" : "Prohibited"}
              </h3>
              <ul className="space-y-1 text-sm text-gray-700">
                {(loc === "ru"
                  ? ["Наркотические вещества", "Взрывчатые и легковоспламеняющиеся предметы", "Оружие и боеприпасы", "Контрафактная продукция", "Поддельные валюты и документы"]
                  : ["Narcotics and illegal drugs", "Explosives and flammable materials", "Weapons and ammunition", "Counterfeit goods", "Counterfeit currency and documents"]
                ).map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-500 flex-shrink-0">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-amber-700 mb-2 text-sm">
                {loc === "ru" ? "Ограничения (нужно разрешение)" : "Restricted (permit required)"}
              </h3>
              <ul className="space-y-1 text-sm text-gray-700">
                {(loc === "ru"
                  ? ["Лекарства и медицинские препараты", "Продукты питания и напитки", "Растения и семена", "Электроника (литиевые батареи)", "Парфюмерия и косметика (объём)"]
                  : ["Medicines and pharmaceuticals", "Food and beverages", "Plants and seeds", "Electronics (lithium batteries)", "Perfumes and cosmetics (volume limits)"]
                ).map((item, i) => (
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
          {loc === "ru"
            ? `Популярные маршруты в ${name}`
            : `Popular routes to ${name}`}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {popular.slice(0, 8).map((from) => (
            <Link
              key={from.code}
              href={`/${locale}/shipping/${makeCorridorSlug(from, country, loc)}`}
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
          {loc === "ru"
            ? `Популярные маршруты из ${name}`
            : `Popular routes from ${name}`}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {popular.slice(0, 8).map((to) => (
            <Link
              key={to.code}
              href={`/${locale}/shipping/${makeCorridorSlug(country, to, loc)}`}
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
        const faqs = loc === "ru" ? [
          { q: `Сколько стоит доставка в ${name}?`, a: `Стоимость доставки в ${name} зависит от страны отправления, веса посылки и выбранного перевозчика. Экспресс-доставка (DHL, FedEx, UPS) начинается от $20-50 за 1 кг, почтовые сервисы — от $10-25.` },
          { q: `Какой беспошлинный порог в ${name}?`, a: `Беспошлинный порог для импорта в ${name} составляет $${customs.de_minimis_usd}. Посылки стоимостью выше этого порога облагаются импортными пошлинами (в среднем ${customs.avg_duty_rate}%) и НДС (${customs.vat_rate}%).` },
          { q: `Какие перевозчики доставляют в ${name}?`, a: `В ${name} доставляют все крупные международные перевозчики: DHL Express, FedEx, UPS, EMS, Aramex и десятки других. Всего доступно ${carrierCount}+ вариантов доставки.` },
        ] : [
          { q: `How much does shipping to ${name} cost?`, a: `Shipping costs to ${name} depend on the origin country, package weight, and carrier. Express delivery (DHL, FedEx, UPS) starts from $20-50 for 1 kg, while postal services start from $10-25.` },
          { q: `What is the duty-free threshold for ${name}?`, a: `The duty-free threshold for imports to ${name} is $${customs.de_minimis_usd}. Packages valued above this threshold are subject to import duties (average ${customs.avg_duty_rate}%) and VAT (${customs.vat_rate}%).` },
          { q: `Which carriers deliver to ${name}?`, a: `All major international carriers deliver to ${name}: DHL Express, FedEx, UPS, EMS, Aramex, and dozens more. In total, ${carrierCount}+ shipping options are available.` },
        ];

        return (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {loc === "ru" ? "Часто задаваемые вопросы" : "FAQ"}
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
            headline:
              loc === "ru"
                ? `Гид по доставке в ${name}`
                : `Shipping Guide to ${name}`,
            description:
              loc === "ru"
                ? `Полный гид по международной доставке в ${name}`
                : `Complete guide to international shipping to ${name}`,
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
                name: loc === "ru" ? "Гиды" : "Guides",
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
