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
      ? "Источники данных — все источники тарифов и таможенных данных"
      : "Data Sources — All Rate & Customs Data Sources",
    description: isRu
      ? "Полный список источников данных RateShips: ссылки на официальные тарифы 40+ перевозчиков, таможенные органы 40+ стран, курсы валют и отзывы."
      : "Complete list of RateShips data sources: links to official rates from 40+ carriers, customs authorities for 40+ countries, exchange rates, and reviews.",
    alternates: {
      canonical: `/${locale}/sources`,
      languages: {
        ...Object.fromEntries(
          locales.map((l) => [l, `/${l}/sources`])
        ),
        "x-default": "/en/sources",
      },
    },
  };
}

interface CarrierSource {
  name: string;
  url: string;
  lastVerified: string;
  status: "Verified" | "Estimated";
}

const CARRIER_SOURCES: CarrierSource[] = [
  { name: "DHL Express", url: "https://www.dhl.com/en/express/shipping/shipping_rates.html", lastVerified: "March 2026", status: "Verified" },
  { name: "FedEx", url: "https://www.fedex.com/en-us/shipping/rate-changes.html", lastVerified: "March 2026", status: "Verified" },
  { name: "UPS", url: "https://www.ups.com/us/en/support/shipping-support/shipping-costs.page", lastVerified: "March 2026", status: "Verified" },
  { name: "USPS", url: "https://www.usps.com/international/priority-mail-international.htm", lastVerified: "January 2026", status: "Verified" },
  { name: "Royal Mail", url: "https://www.royalmail.com/prices2026", lastVerified: "April 2026", status: "Verified" },
  { name: "Japan Post", url: "https://www.post.japanpost.jp/int/charge/list/ems_all_en.html", lastVerified: "January 2026", status: "Verified" },
  { name: "Australia Post", url: "https://auspost.com.au/parcels-mail/calculate-postage-delivery-times", lastVerified: "July 2025", status: "Verified" },
  { name: "Canada Post", url: "https://www.canadapost-postescanada.ca/tools/find-a-rate.page", lastVerified: "June 2025", status: "Verified" },
  { name: "Deutsche Post / DHL Paket", url: "https://www.dhl.de/en/privatkunden/pakete-versenden/weltweit-versenden/preise-international.html", lastVerified: "July 2025", status: "Verified" },
  { name: "China Post", url: "https://www.chinapostaltracking.com/service/rate", lastVerified: "2025", status: "Verified" },
  { name: "Korea Post", url: "https://www.koreanbro.com/pages/shipping-rates", lastVerified: "2026", status: "Verified" },
  { name: "SF Express", url: "https://www.sf-international.com/cn/en/support/querySupport/fee_rate", lastVerified: "February 2025", status: "Verified" },
  { name: "Colissimo (La Poste)", url: "https://www.tarif-lettre.com/tarif-colissimo-2026", lastVerified: "January 2026", status: "Verified" },
  { name: "Correos (Spain)", url: "https://www.correos.es/tarifas", lastVerified: "2025", status: "Verified" },
  { name: "Poczta Polska", url: "https://cennik.poczta-polska.pl", lastVerified: "2026", status: "Verified" },
  { name: "Nova Poshta", url: "https://novaposhta.ua/tariffs", lastVerified: "2025", status: "Verified" },
  { name: "CDEK", url: "https://www.cdek.ru/calculate", lastVerified: "2026", status: "Verified" },
  { name: "India Post", url: "https://www.indiapost.gov.in", lastVerified: "2026", status: "Verified" },
  { name: "Aramex", url: "https://www.aramex.com/rate-calculator", lastVerified: "2025", status: "Verified" },
  { name: "TNT (FedEx)", url: "https://www.tnt.com/express/en_gc/site/shipping-tools/rate-transit-times.html", lastVerified: "March 2026", status: "Verified" },
  { name: "PostNL", url: "https://www.postnl.nl/en/mail-and-parcels/parcels/international-parcels/", lastVerified: "2025", status: "Verified" },
  { name: "Swiss Post", url: "https://www.post.ch/en/sending-letters/international-letters", lastVerified: "2025", status: "Verified" },
  { name: "Poste Italiane", url: "https://www.poste.it/prodotti/pacco-ordinario-internazionale.html", lastVerified: "2025", status: "Verified" },
  { name: "CTT (Portugal)", url: "https://www.ctt.pt/encomendas/enviar/para-o-estrangeiro", lastVerified: "2025", status: "Verified" },
  { name: "bpost (Belgium)", url: "https://www.bpost.be/en/parcels-abroad", lastVerified: "2025", status: "Verified" },
  { name: "PostNord (Scandinavia)", url: "https://www.postnord.se/en/sending/send-parcel/send-abroad", lastVerified: "2025", status: "Verified" },
  { name: "Austrian Post", url: "https://www.post.at/en/p/send-parcels/international", lastVerified: "2025", status: "Verified" },
  { name: "Singapore Post", url: "https://www.singpost.com/send-receive/send-overseas", lastVerified: "2025", status: "Verified" },
  { name: "Thailand Post", url: "https://www.thailandpost.co.th/en/index", lastVerified: "2025", status: "Verified" },
  { name: "Malaysia Post (Pos Malaysia)", url: "https://www.pos.com.my/send/international", lastVerified: "2025", status: "Verified" },
  { name: "Turkey PTT", url: "https://www.ptt.gov.tr/", lastVerified: "2025", status: "Estimated" },
  { name: "Israel Post", url: "https://www.israelpost.co.il/", lastVerified: "2025", status: "Verified" },
  { name: "South Africa Post Office", url: "https://www.postoffice.co.za/", lastVerified: "2025", status: "Estimated" },
  { name: "Correios (Brazil)", url: "https://www.correios.com.br/enviar/encomendas/sedex-mundi", lastVerified: "2025", status: "Verified" },
  { name: "Correo Argentino", url: "https://www.correoargentino.com.ar/", lastVerified: "2025", status: "Estimated" },
  { name: "New Zealand Post", url: "https://www.nzpost.co.nz/personal/sending-internationally", lastVerified: "2025", status: "Verified" },
  { name: "Emirates Post", url: "https://emiratespost.ae/", lastVerified: "2025", status: "Verified" },
  { name: "Saudi Post (SPL)", url: "https://splonline.com.sa/en/", lastVerified: "2025", status: "Estimated" },
  { name: "Boxberry", url: "https://boxberry.ru/", lastVerified: "2025", status: "Verified" },
  { name: "EMS (Global)", url: "https://www.ems.post/", lastVerified: "2026", status: "Verified" },
];

interface CustomsSource {
  country: string;
  authority: string;
  url: string;
  tradeAgreement: string;
}

const CUSTOMS_SOURCES: CustomsSource[] = [
  { country: "United States", authority: "U.S. Customs and Border Protection (CBP)", url: "https://www.cbp.gov/", tradeAgreement: "USMCA" },
  { country: "United Kingdom", authority: "HM Revenue & Customs (HMRC)", url: "https://www.trade-tariff.service.gov.uk/", tradeAgreement: "UK-EU TCA" },
  { country: "Germany", authority: "Zoll (German Customs)", url: "https://www.zoll.de/EN/", tradeAgreement: "EU Single Market" },
  { country: "France", authority: "Douane Francaise", url: "https://www.douane.gouv.fr/", tradeAgreement: "EU Single Market" },
  { country: "Italy", authority: "Agenzia delle Dogane e dei Monopoli", url: "https://www.adm.gov.it/", tradeAgreement: "EU Single Market" },
  { country: "Spain", authority: "Agencia Tributaria (Aduanas)", url: "https://www.agenciatributaria.es/", tradeAgreement: "EU Single Market" },
  { country: "Netherlands", authority: "Douane (Dutch Customs)", url: "https://www.belastingdienst.nl/wps/wcm/connect/nl/douane/", tradeAgreement: "EU Single Market" },
  { country: "Belgium", authority: "Belgian Customs & Excise", url: "https://financien.belgium.be/en/customs_excise", tradeAgreement: "EU Single Market" },
  { country: "Poland", authority: "Krajowa Administracja Skarbowa", url: "https://www.gov.pl/web/kas", tradeAgreement: "EU Single Market" },
  { country: "Austria", authority: "Austrian Customs (BMF)", url: "https://www.bmf.gv.at/en/topics/customs.html", tradeAgreement: "EU Single Market" },
  { country: "Switzerland", authority: "Federal Office for Customs and Border Security (FOCBS)", url: "https://www.bazg.admin.ch/bazg/en/home.html", tradeAgreement: "EFTA" },
  { country: "Sweden", authority: "Swedish Customs (Tullverket)", url: "https://www.tullverket.se/en", tradeAgreement: "EU Single Market" },
  { country: "Norway", authority: "Norwegian Customs (Tolletaten)", url: "https://www.toll.no/en/", tradeAgreement: "EEA / EFTA" },
  { country: "Denmark", authority: "Danish Customs (Toldstyrelsen)", url: "https://www.toldst.dk/", tradeAgreement: "EU Single Market" },
  { country: "Finland", authority: "Finnish Customs (Tulli)", url: "https://tulli.fi/en/", tradeAgreement: "EU Single Market" },
  { country: "Portugal", authority: "Autoridade Tributaria e Aduaneira", url: "https://www.portaldasfinancas.gov.pt/", tradeAgreement: "EU Single Market" },
  { country: "Czech Republic", authority: "Czech Customs Administration", url: "https://www.celnisprava.cz/en", tradeAgreement: "EU Single Market" },
  { country: "Canada", authority: "Canada Border Services Agency (CBSA)", url: "https://www.cbsa-asfc.gc.ca/", tradeAgreement: "USMCA, CPTPP" },
  { country: "Australia", authority: "Australian Border Force (ABF)", url: "https://www.abf.gov.au/", tradeAgreement: "AUKUS, CPTPP" },
  { country: "New Zealand", authority: "NZ Customs Service", url: "https://www.customs.govt.nz/", tradeAgreement: "CPTPP" },
  { country: "Japan", authority: "Japan Customs", url: "https://www.customs.go.jp/english/", tradeAgreement: "RCEP, CPTPP" },
  { country: "South Korea", authority: "Korea Customs Service (KCS)", url: "https://www.customs.go.kr/english/", tradeAgreement: "RCEP, KORUS FTA" },
  { country: "China", authority: "General Administration of Customs (GACC)", url: "http://english.customs.gov.cn/", tradeAgreement: "RCEP" },
  { country: "India", authority: "Central Board of Indirect Taxes and Customs (CBIC)", url: "https://www.cbic.gov.in/", tradeAgreement: "Bilateral FTAs" },
  { country: "Singapore", authority: "Singapore Customs", url: "https://www.customs.gov.sg/", tradeAgreement: "RCEP, CPTPP" },
  { country: "Thailand", authority: "Thai Customs Department", url: "http://www.customs.go.th/", tradeAgreement: "RCEP, ASEAN" },
  { country: "Malaysia", authority: "Royal Malaysian Customs Department", url: "http://www.customs.gov.my/", tradeAgreement: "RCEP, CPTPP" },
  { country: "Indonesia", authority: "Directorate General of Customs and Excise", url: "https://www.beacukai.go.id/", tradeAgreement: "RCEP, ASEAN" },
  { country: "Turkey", authority: "Turkish Revenue Administration (GIB)", url: "https://www.gib.gov.tr/", tradeAgreement: "EU Customs Union" },
  { country: "Russia", authority: "Federal Customs Service (FCS)", url: "https://customs.gov.ru/", tradeAgreement: "EAEU" },
  { country: "Brazil", authority: "Receita Federal", url: "https://www.gov.br/receitafederal/", tradeAgreement: "Mercosur" },
  { country: "Mexico", authority: "SAT (Servicio de Administracion Tributaria)", url: "https://www.sat.gob.mx/", tradeAgreement: "USMCA" },
  { country: "Israel", authority: "Israel Tax Authority (Customs)", url: "https://www.gov.il/en/departments/israel_tax_authority", tradeAgreement: "US-Israel FTA, EU Association" },
  { country: "UAE", authority: "Federal Customs Authority", url: "https://www.fca.gov.ae/en/", tradeAgreement: "GCC" },
  { country: "Saudi Arabia", authority: "Saudi Customs (ZATCA)", url: "https://zatca.gov.sa/en/", tradeAgreement: "GCC" },
  { country: "South Africa", authority: "South African Revenue Service (SARS)", url: "https://www.sars.gov.za/", tradeAgreement: "SACU, AfCFTA" },
  { country: "Nigeria", authority: "Nigeria Customs Service", url: "https://www.customs.gov.ng/", tradeAgreement: "AfCFTA, ECOWAS" },
  { country: "Egypt", authority: "Egyptian Customs Authority", url: "https://www.customs.gov.eg/", tradeAgreement: "GAFTA" },
  { country: "Argentina", authority: "AFIP (Administracion Federal)", url: "https://www.afip.gob.ar/", tradeAgreement: "Mercosur" },
  { country: "Philippines", authority: "Bureau of Customs", url: "https://customs.gov.ph/", tradeAgreement: "RCEP, ASEAN" },
];

export default async function SourcesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isRu = locale === "ru";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* BreadcrumbList JSON-LD */}
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
                name: isRu ? "Главная" : "Home",
                item: `https://rateships.com/${locale}`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: isRu ? "Источники данных" : "Data Sources",
              },
            ],
          }),
        }}
      />

      <nav className="text-sm text-gray-400 mb-6">
        <Link href={`/${locale}`} className="hover:text-accent-light">
          {isRu ? "Главная" : "Home"}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-white">
          {isRu ? "Источники данных" : "Data Sources"}
        </span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
        {isRu ? "Источники данных" : "Data Sources"}
      </h1>
      <p className="text-gray-400 mb-8 text-lg">
        {isRu
          ? "Полный перечень источников, на которых основаны наши данные о тарифах, таможенных пошлинах и курсах валют. Все ссылки ведут на официальные сайты."
          : "Complete list of sources behind our shipping rate, customs duty, and exchange rate data. All links point to official websites."}
      </p>

      <div className="space-y-12 text-gray-300 leading-relaxed">
        {/* ── Carrier Rate Sources ── */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">
            {isRu ? "Источники тарифов перевозчиков" : "Carrier Rate Sources"}
          </h2>
          <p className="mb-4 text-sm text-gray-400">
            {isRu
              ? `${CARRIER_SOURCES.length} перевозчиков с прямыми ссылками на официальные страницы тарифов.`
              : `${CARRIER_SOURCES.length} carriers with direct links to official rate pages.`}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-white/10 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-white/5">
                  <th className="text-left p-3 text-gray-400 font-medium">
                    {isRu ? "Перевозчик" : "Carrier"}
                  </th>
                  <th className="text-left p-3 text-gray-400 font-medium">
                    {isRu ? "Источник" : "Source URL"}
                  </th>
                  <th className="text-left p-3 text-gray-400 font-medium">
                    {isRu ? "Проверено" : "Last Verified"}
                  </th>
                  <th className="text-left p-3 text-gray-400 font-medium">
                    {isRu ? "Статус" : "Status"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {CARRIER_SOURCES.map((c) => (
                  <tr key={c.name} className="border-t border-white/5">
                    <td className="p-3 text-white font-medium whitespace-nowrap">
                      {c.name}
                    </td>
                    <td className="p-3">
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="text-accent-light hover:underline break-all text-xs"
                      >
                        {c.url
                          .replace("https://www.", "")
                          .replace("https://", "")
                          .replace("http://", "")}
                      </a>
                    </td>
                    <td className="p-3 text-gray-400 whitespace-nowrap text-xs">
                      {c.lastVerified}
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                          c.status === "Verified"
                            ? "text-green-400"
                            : "text-yellow-400"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            c.status === "Verified"
                              ? "bg-green-500"
                              : "bg-yellow-500"
                          }`}
                        />
                        {isRu
                          ? c.status === "Verified"
                            ? "Проверено"
                            : "Оценка"
                          : c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Customs & Trade Data Sources ── */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">
            {isRu
              ? "Источники таможенных и торговых данных"
              : "Customs & Trade Data Sources"}
          </h2>
          <p className="mb-4 text-sm text-gray-400">
            {isRu
              ? `Таможенные данные для ${CUSTOMS_SOURCES.length} стран, включая ставки пошлин, НДС, пороги de minimis и торговые соглашения.`
              : `Customs data for ${CUSTOMS_SOURCES.length} countries, including duty rates, VAT, de minimis thresholds, and trade agreements.`}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-white/10 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-white/5">
                  <th className="text-left p-3 text-gray-400 font-medium">
                    {isRu ? "Страна" : "Country"}
                  </th>
                  <th className="text-left p-3 text-gray-400 font-medium">
                    {isRu ? "Таможенный орган" : "Customs Authority"}
                  </th>
                  <th className="text-left p-3 text-gray-400 font-medium">
                    {isRu ? "Сайт" : "URL"}
                  </th>
                  <th className="text-left p-3 text-gray-400 font-medium">
                    {isRu ? "Торговые соглашения" : "Trade Agreements"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {CUSTOMS_SOURCES.map((c) => (
                  <tr key={c.country} className="border-t border-white/5">
                    <td className="p-3 text-white font-medium whitespace-nowrap">
                      {c.country}
                    </td>
                    <td className="p-3 text-gray-400 text-xs">{c.authority}</td>
                    <td className="p-3">
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="text-accent-light hover:underline break-all text-xs"
                      >
                        {c.url
                          .replace("https://www.", "")
                          .replace("https://", "")
                          .replace("http://", "")}
                      </a>
                    </td>
                    <td className="p-3 text-gray-500 text-xs whitespace-nowrap">
                      {c.tradeAgreement}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Exchange Rate Source ── */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">
            {isRu ? "Источник курсов валют" : "Exchange Rate Source"}
          </h2>
          <div className="bg-surface border border-white/10 rounded-lg p-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <p className="text-white font-semibold">
                  {isRu
                    ? "Европейский Центральный Банк (ECB)"
                    : "European Central Bank (ECB)"}
                </p>
                <a
                  href="https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="text-accent-light hover:underline text-sm"
                >
                  ecb.europa.eu/stats/exchange/eurofxref
                </a>
              </div>
              <div className="text-sm text-gray-400">
                <p>
                  {isRu ? "Частота обновления:" : "Update frequency:"}{" "}
                  <span className="text-white">
                    {isRu ? "ежедневно" : "Daily"}
                  </span>
                </p>
                <p>
                  {isRu ? "Валюты:" : "Currencies:"}{" "}
                  <span className="text-white">
                    {isRu ? "30+ основных валют" : "30+ major currencies"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Review Data Sources ── */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">
            {isRu ? "Источники отзывов" : "Review Data Sources"}
          </h2>
          <div className="bg-surface border border-white/10 rounded-lg p-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <p className="text-white font-semibold">Trustpilot</p>
                <a
                  href="https://www.trustpilot.com"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="text-accent-light hover:underline text-sm"
                >
                  trustpilot.com
                </a>
              </div>
              <div className="text-sm text-gray-400">
                <p>
                  {isRu
                    ? "Рейтинги перевозчиков со ссылками на профили Trustpilot"
                    : "Carrier ratings linked to individual Trustpilot profiles"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Methodology Link ── */}
        <section className="bg-surface border border-white/10 rounded-lg p-6">
          <p className="text-gray-400">
            {isRu
              ? "Подробнее о нашей методологии сбора и проверки данных читайте на странице "
              : "For more details on how we collect and verify this data, see our "}
            <Link
              href={`/${locale}/data-methodology`}
              className="text-accent-light hover:underline"
            >
              {isRu ? "Методология данных" : "Data Methodology"}
            </Link>
            .
          </p>
        </section>

        <p className="text-sm text-gray-500 pt-4 border-t border-white/10">
          {isRu
            ? "Последнее обновление: март 2026"
            : "Last updated: March 2026"}
        </p>
      </div>
    </div>
  );
}
