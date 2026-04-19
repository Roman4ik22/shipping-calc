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

const cardStyle: React.CSSProperties = {
  background: "white",
  border: "1px solid var(--line)",
  borderRadius: 16,
  padding: 24,
};

const thStyle: React.CSSProperties = {
  textAlign: "left" as const,
  padding: "12px 16px",
  color: "var(--body)",
  fontWeight: 500,
  fontSize: 13,
  borderBottom: "1px solid var(--line)",
  background: "var(--bg)",
};

const tdStyle: React.CSSProperties = {
  padding: "12px 16px",
  borderBottom: "1px solid var(--line)",
  fontSize: 14,
};

export default async function SourcesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
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

      {/* Hero Section */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(140deg, #fef3c7 0%, #fefce8 35%, #ecfccb 100%)",
          backgroundImage: `linear-gradient(140deg, #fef3c7 0%, #fefce8 35%, #ecfccb 100%),
            linear-gradient(rgba(217,119,6,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(217,119,6,0.04) 1px, transparent 1px)`,
          backgroundSize: "100% 100%, 30px 30px, 30px 30px",
          padding: "80px 24px 60px",
        }}
      >
        {/* Floating link/chain icon */}
        <div
          style={{
            position: "absolute",
            top: 38,
            right: "14%",
            animation: "floatSources 7s ease-in-out infinite",
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: "3px solid rgba(217,119,6,0.2)",
              background: "transparent",
              position: "relative",
            }}
          />
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: "3px solid rgba(217,119,6,0.15)",
              background: "transparent",
              position: "relative",
              top: -14,
              left: 18,
            }}
          />
        </div>

        {/* Small globe */}
        <div
          style={{
            position: "absolute",
            bottom: 46,
            left: "9%",
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(34,197,94,0.08)",
            border: "2px solid rgba(34,197,94,0.15)",
          }}
        >
          <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 2, background: "rgba(34,197,94,0.12)" }} />
          <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 2, background: "rgba(34,197,94,0.12)" }} />
        </div>

        {/* Accent square */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: "5%",
            width: 20,
            height: 20,
            borderRadius: 4,
            background: "rgba(59,130,246,0.10)",
            border: "2px solid rgba(59,130,246,0.14)",
            transform: "rotate(45deg)",
          }}
        />

        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <nav style={{ fontSize: 14, color: "var(--muted)", marginBottom: 24 }}>
            <Link href={`/${locale}`} style={{ color: "var(--blue)", textDecoration: "none" }}>
              {t(loc, "home")}
            </Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "var(--ink)" }}>
              {t(loc, "sources_breadcrumb")}
            </span>
          </nav>

          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 800,
              color: "var(--ink)",
              margin: "0 0 12px",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
            }}
          >
            {t(loc, "sources_h1")}
          </h1>
          <p style={{ fontSize: 18, color: "var(--body)", margin: 0, maxWidth: 640 }}>
            {t(loc, "sources_intro")}
          </p>
        </div>
      </section>

      {/* Content */}
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "48px 24px 80px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          {/* Carrier Rate Sources */}
          <section className="fade-in" style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(59,130,246,0.05))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5a2 2 0 0 1-2 2h-1"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: 0 }}>
                {t(loc, "sources_carrier_title")}
              </h2>
            </div>
            <p style={{ fontSize: 14, color: "var(--body)", marginBottom: 20 }}>
              {`${CARRIER_SOURCES.length} `}{loc === "ru" ? "перевозчиков с прямыми ссылками на официальные страницы тарифов." : "carriers with direct links to official rate pages."}
            </p>
            <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid var(--line)" }}>
              <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={thStyle}>{t(loc, "sources_carrier_col")}</th>
                    <th style={thStyle}>{t(loc, "sources_url_col")}</th>
                    <th style={thStyle}>{t(loc, "sources_verified_col")}</th>
                    <th style={thStyle}>{t(loc, "sources_status_col")}</th>
                  </tr>
                </thead>
                <tbody>
                  {CARRIER_SOURCES.map((c) => (
                    <tr key={c.name}>
                      <td style={{ ...tdStyle, color: "var(--ink)", fontWeight: 500, whiteSpace: "nowrap" as const }}>
                        {c.name}
                      </td>
                      <td style={tdStyle}>
                        <a
                          href={c.url}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          style={{ color: "var(--blue)", textDecoration: "none", fontSize: 12, wordBreak: "break-all" as const }}
                        >
                          {c.url.replace("https://www.", "").replace("https://", "").replace("http://", "")}
                        </a>
                      </td>
                      <td style={{ ...tdStyle, color: "var(--body)", whiteSpace: "nowrap" as const, fontSize: 12 }}>
                        {c.lastVerified}
                      </td>
                      <td style={tdStyle}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            fontSize: 12,
                            fontWeight: 500,
                            color: c.status === "Verified" ? "#16a34a" : "#ca8a04",
                          }}
                        >
                          <span
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              background: c.status === "Verified" ? "#22c55e" : "#eab308",
                            }}
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
          <section className="fade-in" style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(245,158,11,0.05))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: 0 }}>
                {t(loc, "sources_customs_title")}
              </h2>
            </div>
            <p style={{ fontSize: 14, color: "var(--body)", marginBottom: 20 }}>
              {loc === "ru"
                ? `Таможенные данные для ${CUSTOMS_SOURCES.length} стран, включая ставки пошлин, НДС, пороги de minimis и торговые соглашения.`
                : `Customs data for ${CUSTOMS_SOURCES.length} countries, including duty rates, VAT, de minimis thresholds, and trade agreements.`}
            </p>
            <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid var(--line)" }}>
              <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={thStyle}>{t(loc, "sources_country_col")}</th>
                    <th style={thStyle}>{t(loc, "sources_authority_col")}</th>
                    <th style={thStyle}>{t(loc, "sources_url_col2")}</th>
                    <th style={thStyle}>{t(loc, "sources_trade_col")}</th>
                  </tr>
                </thead>
                <tbody>
                  {CUSTOMS_SOURCES.map((c) => (
                    <tr key={c.country}>
                      <td style={{ ...tdStyle, color: "var(--ink)", fontWeight: 500, whiteSpace: "nowrap" as const }}>
                        {c.country}
                      </td>
                      <td style={{ ...tdStyle, color: "var(--body)", fontSize: 12 }}>{c.authority}</td>
                      <td style={tdStyle}>
                        <a
                          href={c.url}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          style={{ color: "var(--blue)", textDecoration: "none", fontSize: 12, wordBreak: "break-all" as const }}
                        >
                          {c.url.replace("https://www.", "").replace("https://", "").replace("http://", "")}
                        </a>
                      </td>
                      <td style={{ ...tdStyle, color: "var(--muted)", fontSize: 12, whiteSpace: "nowrap" as const }}>
                        {c.tradeAgreement}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Exchange Rate Source */}
          <section className="fade-in" style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.05))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: 0 }}>
                {t(loc, "sources_exchange_title")}
              </h2>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", flexWrap: "wrap" as const, alignItems: "center", gap: 24 }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <p style={{ color: "var(--ink)", fontWeight: 600, margin: "0 0 4px" }}>
                    {t(loc, "sources_ecb")}
                  </p>
                  <a
                    href="https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html"
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    style={{ color: "var(--blue)", textDecoration: "none", fontSize: 14 }}
                  >
                    ecb.europa.eu/stats/exchange/eurofxref
                  </a>
                </div>
                <div style={{ fontSize: 14, color: "var(--body)" }}>
                  <p style={{ margin: "0 0 4px" }}>
                    {t(loc, "sources_update_freq")}{" "}
                    <span style={{ color: "var(--ink)", fontWeight: 500 }}>{t(loc, "sources_daily")}</span>
                  </p>
                  <p style={{ margin: 0 }}>
                    {t(loc, "sources_currencies")}{" "}
                    <span style={{ color: "var(--ink)", fontWeight: 500 }}>{t(loc, "sources_currencies_val")}</span>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Review Data Sources */}
          <section className="fade-in" style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(139,92,246,0.05))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: 0 }}>
                {t(loc, "sources_reviews_title")}
              </h2>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap" as const, alignItems: "center", gap: 24 }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <p style={{ color: "var(--ink)", fontWeight: 600, margin: "0 0 4px" }}>Trustpilot</p>
                <a
                  href="https://www.trustpilot.com"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  style={{ color: "var(--blue)", textDecoration: "none", fontSize: 14 }}
                >
                  trustpilot.com
                </a>
              </div>
              <div style={{ fontSize: 14, color: "var(--body)" }}>
                <p style={{ margin: 0 }}>{t(loc, "sources_reviews_desc")}</p>
              </div>
            </div>
          </section>

          {/* Methodology Link */}
          <section
            className="fade-in"
            style={{
              ...cardStyle,
              background: "linear-gradient(135deg, rgba(59,130,246,0.04), rgba(139,92,246,0.04))",
              borderColor: "var(--blue)",
              borderWidth: 1,
            }}
          >
            <p style={{ color: "var(--body)", margin: 0, fontSize: 15 }}>
              {t(loc, "sources_methodology_pre")}
              <Link
                href={`/${locale}/data-methodology`}
                style={{ color: "var(--blue)", textDecoration: "none", fontWeight: 500 }}
              >
                {t(loc, "sources_methodology_link")}
              </Link>
              .
            </p>
          </section>
        </div>

        <div
          style={{
            marginTop: 48,
            paddingTop: 20,
            borderTop: "1px solid var(--line)",
            fontSize: 13,
            color: "var(--muted)",
          }}
        >
          {t(loc, "last_updated_march")}
        </div>
      </div>

      <style>{`
        @keyframes floatSources {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
}
