import { Metadata } from "next";
import { locales } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import Link from "next/link";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isRu = locale === "ru";
  return {
    title: isRu
      ? "Методология данных — как мы собираем тарифы и таможенные данные"
      : "Data Methodology — How We Collect Shipping Rates & Customs Data",
    description: isRu
      ? "Подробное описание методологии сбора данных RateShips: источники тарифов перевозчиков, таможенных пошлин, курсов валют, частота обновлений и обязательства по точности."
      : "Detailed explanation of RateShips data methodology: carrier rate sources, customs duty data, exchange rates, update frequency, and our accuracy commitment.",
    alternates: {
      canonical: `/${locale}/data-methodology`,
      languages: {
        ...Object.fromEntries(
          locales.map((l) => [l, `/${l}/data-methodology`])
        ),
        "x-default": "/en/data-methodology",
      },
    },
  };
}

const TOP_CARRIERS = [
  { name: "DHL Express", url: "https://www.dhl.com/en/express/shipping/shipping_rates.html" },
  { name: "FedEx", url: "https://www.fedex.com/en-us/shipping/rate-changes.html" },
  { name: "UPS", url: "https://www.ups.com/us/en/support/shipping-support/shipping-costs.page" },
  { name: "USPS", url: "https://www.usps.com/international/priority-mail-international.htm" },
  { name: "Royal Mail", url: "https://www.royalmail.com/prices2026" },
  { name: "Japan Post", url: "https://www.post.japanpost.jp/int/charge/list/ems_all_en.html" },
  { name: "Australia Post", url: "https://auspost.com.au/parcels-mail/calculate-postage-delivery-times" },
  { name: "Canada Post", url: "https://www.canadapost-postescanada.ca/tools/find-a-rate.page" },
  { name: "Deutsche Post / DHL Paket", url: "https://www.dhl.de/en/privatkunden/pakete-versenden/weltweit-versenden/preise-international.html" },
  { name: "SF Express", url: "https://www.sf-international.com/cn/en/support/querySupport/fee_rate" },
];

const GRI_2026 = [
  { carrier: "DHL Express", increase: "4.9%", effective: "January 2026" },
  { carrier: "FedEx", increase: "5.9%", effective: "January 2026" },
  { carrier: "UPS", increase: "5.9%", effective: "December 2025" },
  { carrier: "USPS", increase: "3.6%", effective: "January 2026" },
  { carrier: "Royal Mail", increase: "7.6%", effective: "April 2026" },
  { carrier: "Canada Post", increase: "4.2%", effective: "January 2026" },
];

const CUSTOMS_SOURCES = [
  { name: "WTO Customs Valuation Database", url: "https://www.wto.org", purpose: "De minimis thresholds, trade agreements" },
  { name: "EU TARIC Database", url: "https://ec.europa.eu/taxation_customs/dds2/taric/taric_consultation.jsp", purpose: "EU duty rates and tariff classifications" },
  { name: "US International Trade Commission (USITC)", url: "https://hts.usitc.gov/", purpose: "US harmonized tariff schedule" },
  { name: "UK Trade Tariff (HMRC)", url: "https://www.trade-tariff.service.gov.uk/", purpose: "UK duty rates post-Brexit" },
  { name: "Canada Border Services Agency (CBSA)", url: "https://www.cbsa-asfc.gc.ca/trade-commerce/tariff-tarif/", purpose: "Canadian tariff schedule" },
  { name: "Australian Border Force", url: "https://www.abf.gov.au/importing-exporting-and-manufacturing/tariff-classification", purpose: "Australian tariff and duty rates" },
  { name: "Japan Customs", url: "https://www.customs.go.jp/english/tariff/", purpose: "Japanese tariff schedule" },
  { name: "Korea Customs Service", url: "https://www.customs.go.kr/english/", purpose: "Korean tariff schedule" },
  { name: "China Customs (GACC)", url: "http://english.customs.gov.cn/", purpose: "Chinese tariff schedule" },
  { name: "India Central Board of Indirect Taxes", url: "https://www.cbic.gov.in/", purpose: "Indian customs duties and GST" },
];

const RECENT_UPDATES = [
  { date: "March 2026", description: "Full audit of all 143 carrier rate databases" },
  { date: "March 2026", description: "Updated EU de minimis threshold to reflect new IOSS regulations" },
  { date: "February 2026", description: "Applied 2026 GRI for DHL, FedEx, UPS, Canada Post" },
  { date: "January 2026", description: "Updated VAT rates for 12 countries (Turkey, Nigeria, Saudi Arabia, etc.)" },
  { date: "January 2026", description: "Added Royal Mail 2026 tariff schedule" },
  { date: "December 2025", description: "Applied UPS 2026 rate adjustment (effective Dec 27, 2025)" },
  { date: "November 2025", description: "Updated Switzerland customs procedures and de minimis threshold" },
];

export default async function DataMethodologyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isRu = locale === "ru";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* BreadcrumbList + WebPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: isRu ? "Главная" : "Home",
                  item: `https://rateships.com/${locale}`,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: isRu ? "Методология данных" : "Data Methodology",
                },
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: isRu
                ? "Методология данных RateShips"
                : "RateShips Data Methodology",
              description: isRu
                ? "Как мы собираем и проверяем данные о тарифах доставки и таможенных пошлинах"
                : "How we collect and verify shipping rate and customs duty data",
              url: `https://rateships.com/${locale}/data-methodology`,
              dateModified: "2026-03-28",
              publisher: {
                "@type": "Organization",
                name: "RateShips",
                url: "https://rateships.com",
              },
            },
          ]),
        }}
      />

      <nav className="text-sm text-gray-400 mb-6">
        <Link href={`/${locale}`} className="hover:text-accent-light">
          {isRu ? "Главная" : "Home"}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-white">
          {isRu ? "Методология данных" : "Data Methodology"}
        </span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
        {isRu ? "Как мы собираем данные" : "How We Collect & Verify Our Data"}
      </h1>
      <p className="text-gray-400 mb-8 text-lg">
        {isRu
          ? "Прозрачное описание наших источников данных, процессов проверки и обязательств по точности. Последнее обновление: март 2026."
          : "A transparent look at our data sources, verification processes, and accuracy commitments. Last updated: March 2026."}
      </p>

      <div className="space-y-10 text-gray-300 leading-relaxed">
        {/* ── Section 1: Carrier Rate Data ── */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">
            {isRu
              ? "1. Как мы собираем тарифы перевозчиков"
              : "1. How We Collect Carrier Rate Data"}
          </h2>
          <p className="mb-4">
            {isRu
              ? "Мы отслеживаем опубликованные тарифные карты и прайс-листы на официальных сайтах перевозчиков. Наша база данных включает тарифы от 143 перевозчиков, из которых 80+ имеют тарифы, верифицированные из официальных опубликованных источников."
              : "We monitor published rate cards and price lists from official carrier websites. Our database includes rates from 143 carriers, of which 80+ have rates verified from official published sources."}
          </p>

          <h3 className="text-lg font-semibold text-white mb-3">
            {isRu
              ? "Топ-10 перевозчиков и их страницы тарифов"
              : "Top 10 Carriers & Their Rate Pages"}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-white/10 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-white/5">
                  <th className="text-left p-3 text-gray-400 font-medium">
                    {isRu ? "Перевозчик" : "Carrier"}
                  </th>
                  <th className="text-left p-3 text-gray-400 font-medium">
                    {isRu ? "Источник тарифов" : "Rate Source URL"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {TOP_CARRIERS.map((c) => (
                  <tr key={c.name} className="border-t border-white/5">
                    <td className="p-3 text-white font-medium">{c.name}</td>
                    <td className="p-3">
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="text-accent-light hover:underline break-all text-xs"
                      >
                        {c.url.replace("https://www.", "").replace("https://", "")}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {isRu
              ? "Полный список из 40+ проверенных перевозчиков доступен на странице "
              : "Full list of 40+ verified carriers available on our "}
            <Link
              href={`/${locale}/sources`}
              className="text-accent-light hover:underline"
            >
              {isRu ? "Источники данных" : "Data Sources"}
            </Link>
            {isRu ? "." : " page."}
          </p>

          <h3 className="text-lg font-semibold text-white mt-6 mb-3">
            {isRu ? "Конвертация валют" : "Currency Conversion"}
          </h3>
          <p>
            {isRu
              ? "Все тарифы конвертируются в доллары США с использованием ежедневных обменных курсов Европейского Центрального Банка (ECB). Курсы обновляются каждый рабочий день около 16:00 CET. Для перевозчиков, публикующих тарифы в местной валюте, мы применяем курс ECB на дату последнего обновления тарифа."
              : "All rates are converted to USD using daily exchange rates from the European Central Bank (ECB). Rates are updated every business day around 16:00 CET. For carriers that publish rates in local currencies, we apply the ECB rate as of the date the tariff was last updated."}
          </p>

          <h3 className="text-lg font-semibold text-white mt-6 mb-3">
            {isRu
              ? "Общие повышения тарифов (GRI)"
              : "General Rate Increases (GRI)"}
          </h3>
          <p className="mb-3">
            {isRu
              ? "Когда перевозчики объявляют о повышении тарифов (GRI), мы применяем их к нашей базе данных в течение одной недели после вступления в силу. Последние примененные GRI:"
              : "When carriers announce General Rate Increases, we apply them to our database within one week of their effective date. Recent GRIs applied:"}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-white/10 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-white/5">
                  <th className="text-left p-3 text-gray-400 font-medium">
                    {isRu ? "Перевозчик" : "Carrier"}
                  </th>
                  <th className="text-left p-3 text-gray-400 font-medium">
                    {isRu ? "Повышение" : "Increase"}
                  </th>
                  <th className="text-left p-3 text-gray-400 font-medium">
                    {isRu ? "Дата вступления" : "Effective Date"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {GRI_2026.map((g) => (
                  <tr key={g.carrier} className="border-t border-white/5">
                    <td className="p-3 text-white">{g.carrier}</td>
                    <td className="p-3 text-accent-light font-medium">
                      +{g.increase}
                    </td>
                    <td className="p-3 text-gray-400">{g.effective}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-semibold text-white mt-6 mb-3">
            {isRu
              ? "Верифицированные vs. оценочные тарифы"
              : "Verified vs. Estimated Rates"}
          </h3>
          <div className="bg-surface border border-white/10 rounded-lg p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-white font-semibold">
                    {isRu ? "Верифицированные (80+ перевозчиков)" : "Verified (80+ carriers)"}
                  </span>
                </div>
                <p className="text-sm text-gray-400">
                  {isRu
                    ? "Тарифы получены непосредственно из официально опубликованных прайс-листов перевозчиков. Мы сверяем данные с реальными тарифными таблицами."
                    : "Rates sourced directly from officially published carrier price lists. We cross-reference with actual tariff schedules."}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-white font-semibold">
                    {isRu ? "Оценочные (остальные перевозчики)" : "Estimated (remaining carriers)"}
                  </span>
                </div>
                <p className="text-sm text-gray-400">
                  {isRu
                    ? "Калиброванные оценки на основе типа перевозчика, региона и уровня сервиса. Используются когда официальные тарифы не опубликованы в открытом доступе."
                    : "Calibrated estimates based on carrier type, region, and service tier. Used when official tariffs are not publicly available."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 2: Customs Data ── */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">
            {isRu
              ? "2. Как мы собираем таможенные данные"
              : "2. How We Collect Customs Data"}
          </h2>
          <p className="mb-4">
            {isRu
              ? "Таможенные данные собираются из официальных правительственных источников и международных торговых баз данных. Мы проверяем данные по 40+ веб-сайтам таможенных органов."
              : "Customs data is sourced from official government sources and international trade databases. We verify data against 40+ customs authority websites."}
          </p>

          <h3 className="text-lg font-semibold text-white mb-3">
            {isRu ? "Что мы отслеживаем" : "What We Track"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-surface border border-white/10 rounded-lg p-4">
              <p className="text-white font-semibold mb-1">
                {isRu ? "Пороги de minimis" : "De Minimis Thresholds"}
              </p>
              <p className="text-sm text-gray-400">
                {isRu
                  ? "Минимальная стоимость, ниже которой таможенные пошлины не взимаются. Источник: WTO Customs Valuation Database и национальные таможенные органы."
                  : "Minimum value below which customs duties are not charged. Source: WTO Customs Valuation Database and national customs authorities."}
              </p>
            </div>
            <div className="bg-surface border border-white/10 rounded-lg p-4">
              <p className="text-white font-semibold mb-1">
                {isRu ? "Ставки таможенных пошлин" : "Duty Rates"}
              </p>
              <p className="text-sm text-gray-400">
                {isRu
                  ? "Ставки пошлин из национальных таможенных тарифных расписаний: TARIC (ЕС), USITC (США), UK Trade Tariff (Великобритания) и другие."
                  : "Duty rates from national customs tariff schedules: TARIC (EU), USITC (US), UK Trade Tariff (UK), and others."}
              </p>
            </div>
            <div className="bg-surface border border-white/10 rounded-lg p-4">
              <p className="text-white font-semibold mb-1">
                {isRu ? "Ставки НДС / GST" : "VAT / GST Rates"}
              </p>
              <p className="text-sm text-gray-400">
                {isRu
                  ? "Ставки налога на добавленную стоимость из официальных сайтов налоговых органов каждой страны."
                  : "Value-added tax rates from official government tax authority websites for each country."}
              </p>
            </div>
            <div className="bg-surface border border-white/10 rounded-lg p-4">
              <p className="text-white font-semibold mb-1">
                {isRu ? "Запрещённые товары" : "Prohibited Items"}
              </p>
              <p className="text-sm text-gray-400">
                {isRu
                  ? "Списки запрещённых и ограниченных к ввозу товаров из таможенных регламентов."
                  : "Lists of prohibited and restricted import items from customs regulations."}
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-white mb-3">
            {isRu ? "Основные источники таможенных данных" : "Key Customs Data Sources"}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-white/10 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-white/5">
                  <th className="text-left p-3 text-gray-400 font-medium">
                    {isRu ? "Источник" : "Source"}
                  </th>
                  <th className="text-left p-3 text-gray-400 font-medium">
                    {isRu ? "Назначение" : "Purpose"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {CUSTOMS_SOURCES.map((s) => (
                  <tr key={s.name} className="border-t border-white/5">
                    <td className="p-3">
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="text-accent-light hover:underline"
                      >
                        {s.name}
                      </a>
                    </td>
                    <td className="p-3 text-gray-400">{s.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Section 3: Update Frequency ── */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">
            {isRu ? "3. Частота обновлений" : "3. Update Frequency"}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-surface border border-white/10 rounded-lg p-5 text-center">
              <p className="text-2xl font-bold text-accent-light">
                {isRu ? "еженедельно" : "Weekly"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {isRu ? "тарифы перевозчиков (понедельник)" : "Carrier rates (Mondays)"}
              </p>
            </div>
            <div className="bg-surface border border-white/10 rounded-lg p-5 text-center">
              <p className="text-2xl font-bold text-accent-light">
                {isRu ? "ежемесячно" : "Monthly"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {isRu ? "таможенные данные" : "Customs data"}
              </p>
            </div>
            <div className="bg-surface border border-white/10 rounded-lg p-5 text-center">
              <p className="text-2xl font-bold text-accent-light">
                {isRu ? "ежедневно" : "Daily"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {isRu ? "курсы валют (ECB)" : "Exchange rates (ECB)"}
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-white mb-3">
            {isRu ? "Последние обновления данных" : "Recent Data Updates"}
          </h3>
          <div className="space-y-2">
            {RECENT_UPDATES.map((u, i) => (
              <div
                key={i}
                className="flex gap-4 items-start border-l-2 border-accent-light/30 pl-4 py-1"
              >
                <span className="text-sm text-accent-light font-medium whitespace-nowrap min-w-[100px]">
                  {u.date}
                </span>
                <span className="text-sm text-gray-400">{u.description}</span>
              </div>
            ))}
          </div>

          <div className="bg-surface border border-white/10 rounded-lg p-5 mt-6">
            <p className="text-white font-semibold mb-1">
              {isRu ? "Последний полный аудит" : "Last Full Audit"}
            </p>
            <p className="text-sm text-gray-400">
              {isRu
                ? "Март 2026 — полная проверка всех 143 баз данных перевозчиков, таможенных пороговых значений для 40 стран и торговых соглашений."
                : "March 2026 — complete review of all 143 carrier rate databases, customs thresholds for 40 countries, and trade agreements."}
            </p>
          </div>
        </section>

        {/* ── Section 4: Coverage ── */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">
            {isRu ? "4. Покрытие данных" : "4. Data Coverage"}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-surface border border-white/10 rounded-lg p-5 text-center">
              <p className="text-3xl font-bold text-accent-light">143</p>
              <p className="text-sm text-gray-400 mt-1">
                {isRu ? "перевозчиков" : "carriers"}
              </p>
            </div>
            <div className="bg-surface border border-white/10 rounded-lg p-5 text-center">
              <p className="text-3xl font-bold text-accent-light">213</p>
              <p className="text-sm text-gray-400 mt-1">
                {isRu ? "стран" : "countries"}
              </p>
            </div>
            <div className="bg-surface border border-white/10 rounded-lg p-5 text-center">
              <p className="text-3xl font-bold text-accent-light">80+</p>
              <p className="text-sm text-gray-400 mt-1">
                {isRu ? "верифицировано" : "verified"}
              </p>
            </div>
            <div className="bg-surface border border-white/10 rounded-lg p-5 text-center">
              <p className="text-3xl font-bold text-accent-light">40+</p>
              <p className="text-sm text-gray-400 mt-1">
                {isRu ? "таможенных источников" : "customs sources"}
              </p>
            </div>
          </div>
        </section>

        {/* ── Section 5: Accuracy Commitment ── */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">
            {isRu
              ? "5. Обязательства по точности данных"
              : "5. Data Accuracy Commitment"}
          </h2>

          <div className="space-y-4">
            <div className="bg-surface border border-green-500/20 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block w-3 h-3 rounded-full bg-green-500" />
                <span className="text-white font-semibold">
                  {isRu ? "Верифицированные тарифы: точность ±10%" : "Verified rates: ±10% accuracy"}
                </span>
              </div>
              <p className="text-sm text-gray-400">
                {isRu
                  ? "Для тарифов, полученных из официальных опубликованных источников, мы стремимся к точности ±10% от фактической стоимости. Разница может быть обусловлена топливными надбавками, сезонными доплатами и скидками по конкретным аккаунтам."
                  : "For rates sourced from official published materials, we aim for ±10% accuracy compared to actual cost. Variance may be due to fuel surcharges, seasonal adjustments, and account-specific discounts."}
              </p>
            </div>

            <div className="bg-surface border border-yellow-500/20 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-white font-semibold">
                  {isRu ? "Оценочные тарифы: точность ±20–30%" : "Estimated rates: ±20-30% accuracy"}
                </span>
              </div>
              <p className="text-sm text-gray-400">
                {isRu
                  ? "Для перевозчиков без публично доступных тарифов мы используем калиброванные оценки. Они основаны на типе перевозчика, регионе обслуживания и уровне сервиса."
                  : "For carriers without publicly available tariffs, we use calibrated estimates based on carrier type, service region, and service tier. These may vary more significantly from actual prices."}
              </p>
            </div>
          </div>

          <div className="bg-surface border border-white/10 rounded-lg p-5 mt-6">
            <h3 className="text-white font-semibold mb-2">
              {isRu ? "Важно" : "Important Disclaimer"}
            </h3>
            <ul className="list-disc list-inside text-sm text-gray-400 space-y-2">
              <li>
                {isRu
                  ? "Всегда проверяйте окончательную стоимость у перевозчика перед отправкой."
                  : "Always confirm the final price directly with the carrier before shipping."}
              </li>
              <li>
                {isRu
                  ? "Дополнительные сборы (топливные надбавки, сборы за удалённые районы, сезонные доплаты) могут не быть учтены."
                  : "Additional surcharges (fuel surcharges, remote area fees, seasonal surcharges) may not be reflected in our estimates."}
              </li>
              <li>
                {isRu
                  ? "Тарифы перевозчиков могут меняться без предварительного уведомления."
                  : "Carrier rates may change without prior notice."}
              </li>
              <li>
                {isRu
                  ? "Таможенные пошлины зависят от точной классификации товара (код HS), которая может отличаться от общей оценки."
                  : "Customs duties depend on the exact product classification (HS code), which may differ from a general estimate."}
              </li>
            </ul>
          </div>
        </section>

        {/* ── Section 6: Report Inaccuracies ── */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">
            {isRu ? "6. Сообщить о неточности" : "6. Report an Inaccuracy"}
          </h2>
          <p className="mb-4">
            {isRu
              ? "Мы стремимся к максимальной точности данных. Если вы обнаружили неточность в наших тарифах, таможенных данных или любой другой информации, пожалуйста, сообщите нам."
              : "We are committed to data accuracy. If you find any inaccuracy in our rates, customs data, or any other information, please let us know."}
          </p>
          <div className="bg-surface border border-white/10 rounded-lg p-5">
            <p className="text-gray-400 text-sm">
              {isRu
                ? "Свяжитесь с нами через нашу "
                : "Contact us through our "}
              <Link
                href={`/${locale}/about`}
                className="text-accent-light hover:underline"
              >
                {isRu ? "страницу «О нас»" : "About page"}
              </Link>
              {isRu
                ? " с описанием неточности. Укажите перевозчика, маршрут и фактическую стоимость, если она вам известна."
                : " with details of the inaccuracy. Please include the carrier, route, and actual cost if you have it."}
            </p>
          </div>
        </section>

        <p className="text-sm text-gray-500 pt-4 border-t border-white/10">
          {isRu ? "Последнее обновление: март 2026" : "Last updated: March 2026"}
        </p>
      </div>
    </div>
  );
}
