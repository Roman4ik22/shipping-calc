import { Metadata } from "next";
import { locales, t } from "@/lib/i18n";
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
  const loc = locale as Locale;
  return {
    title: t(loc, "sources_meta_title"),
    description: t(loc, "sources_meta_desc"),
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
  const loc = locale as Locale;

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
                name: t(loc, "home"),
                item: `https://rateships.com/${locale}`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: t(loc, "sources_breadcrumb"),
              },
            ],
          }),
        }}
      />

      <nav className="text-sm text-body mb-6">
        <Link href={`/${locale}`} className="hover:text-accent-light">
          {t(loc, "home")}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">
          {t(loc, "sources_breadcrumb")}
        </span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-4">
        {t(loc, "sources_h1")}
      </h1>
      <p className="text-body mb-8 text-lg">
        {t(loc, "sources_intro")}
      </p>

      <div className="space-y-12 text-body leading-relaxed">
        {/* Carrier Rate Sources */}
        <section>
          <h2 className="text-2xl font-bold text-ink mb-4">
            {t(loc, "sources_carrier_title")}
          </h2>
          <p className="mb-4 text-sm text-body">
            {`${CARRIER_SOURCES.length} `}{loc === "ru" ? "перевозчиков с прямыми ссылками на официальные страницы тарифов." : "carriers with direct links to official rate pages."}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-line rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-white/5">
                  <th className="text-left p-3 text-body font-medium">
                    {t(loc, "sources_carrier_col")}
                  </th>
                  <th className="text-left p-3 text-body font-medium">
                    {t(loc, "sources_url_col")}
                  </th>
                  <th className="text-left p-3 text-body font-medium">
                    {t(loc, "sources_verified_col")}
                  </th>
                  <th className="text-left p-3 text-body font-medium">
                    {t(loc, "sources_status_col")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {CARRIER_SOURCES.map((c) => (
                  <tr key={c.name} className="border-t border-line">
                    <td className="p-3 text-ink font-medium whitespace-nowrap">
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
                    <td className="p-3 text-body whitespace-nowrap text-xs">
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
                        {c.status === "Verified"
                          ? t(loc, "sources_verified")
                          : t(loc, "sources_estimated")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Customs & Trade Data Sources */}
        <section>
          <h2 className="text-2xl font-bold text-ink mb-4">
            {t(loc, "sources_customs_title")}
          </h2>
          <p className="mb-4 text-sm text-body">
            {loc === "ru"
              ? `Таможенные данные для ${CUSTOMS_SOURCES.length} стран, включая ставки пошлин, НДС, пороги de minimis и торговые соглашения.`
              : `Customs data for ${CUSTOMS_SOURCES.length} countries, including duty rates, VAT, de minimis thresholds, and trade agreements.`}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-line rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-white/5">
                  <th className="text-left p-3 text-body font-medium">
                    {t(loc, "sources_country_col")}
                  </th>
                  <th className="text-left p-3 text-body font-medium">
                    {t(loc, "sources_authority_col")}
                  </th>
                  <th className="text-left p-3 text-body font-medium">
                    {t(loc, "sources_url_col2")}
                  </th>
                  <th className="text-left p-3 text-body font-medium">
                    {t(loc, "sources_trade_col")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {CUSTOMS_SOURCES.map((c) => (
                  <tr key={c.country} className="border-t border-line">
                    <td className="p-3 text-ink font-medium whitespace-nowrap">
                      {c.country}
                    </td>
                    <td className="p-3 text-body text-xs">{c.authority}</td>
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
                    <td className="p-3 text-muted text-xs whitespace-nowrap">
                      {c.tradeAgreement}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Exchange Rate Source */}
        <section>
          <h2 className="text-2xl font-bold text-ink mb-4">
            {t(loc, "sources_exchange_title")}
          </h2>
          <div className="bg-surface border border-line rounded-lg p-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <p className="text-ink font-semibold">
                  {t(loc, "sources_ecb")}
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
              <div className="text-sm text-body">
                <p>
                  {t(loc, "sources_update_freq")}{" "}
                  <span className="text-ink">
                    {t(loc, "sources_daily")}
                  </span>
                </p>
                <p>
                  {t(loc, "sources_currencies")}{" "}
                  <span className="text-ink">
                    {t(loc, "sources_currencies_val")}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Review Data Sources */}
        <section>
          <h2 className="text-2xl font-bold text-ink mb-4">
            {t(loc, "sources_reviews_title")}
          </h2>
          <div className="bg-surface border border-line rounded-lg p-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <p className="text-ink font-semibold">Trustpilot</p>
                <a
                  href="https://www.trustpilot.com"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="text-accent-light hover:underline text-sm"
                >
                  trustpilot.com
                </a>
              </div>
              <div className="text-sm text-body">
                <p>{t(loc, "sources_reviews_desc")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Methodology Link */}
        <section className="bg-surface border border-line rounded-lg p-6">
          <p className="text-body">
            {t(loc, "sources_methodology_pre")}
            <Link
              href={`/${locale}/data-methodology`}
              className="text-accent-light hover:underline"
            >
              {t(loc, "sources_methodology_link")}
            </Link>
            .
          </p>
        </section>

        <p className="text-sm text-muted pt-4 border-t border-line">
          {t(loc, "last_updated_march")}
        </p>
      </div>
    </div>
  );
}
