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
    title: t(loc, "data_method_meta_title"),
    description: t(loc, "data_method_meta_desc"),
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

const cardStyle: React.CSSProperties = {
  background: "white",
  border: "1px solid var(--line)",
  borderRadius: 16,
  padding: 24,
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  fontSize: 14,
  borderCollapse: "collapse" as const,
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
};

export default async function DataMethodologyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
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
                  name: t(loc, "home"),
                  item: `https://rateships.com/${locale}`,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: t(loc, "data_method_breadcrumb"),
                },
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: t(loc, "data_method_name"),
              description: t(loc, "data_method_wp_desc"),
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

      {/* Hero Section */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(145deg, #ecfdf5 0%, #f0fdf4 30%, #e0f2fe 100%)",
          backgroundImage: `linear-gradient(145deg, #ecfdf5 0%, #f0fdf4 30%, #e0f2fe 100%),
            linear-gradient(rgba(16,185,129,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16,185,129,0.04) 1px, transparent 1px)`,
          backgroundSize: "100% 100%, 36px 36px, 36px 36px",
          padding: "80px 24px 60px",
        }}
      >
        {/* Floating database icon */}
        <div
          style={{
            position: "absolute",
            top: 32,
            right: "12%",
            width: 52,
            height: 56,
            borderRadius: "8px",
            background: "rgba(16,185,129,0.10)",
            border: "2px solid rgba(16,185,129,0.18)",
            transform: "rotate(6deg)",
            animation: "floatMethod 6s ease-in-out infinite",
          }}
        >
          {[14, 26, 38].map((top) => (
            <div
              key={top}
              style={{
                position: "absolute",
                top,
                left: 8,
                right: 8,
                height: 3,
                borderRadius: 2,
                background: "rgba(16,185,129,0.25)",
              }}
            />
          ))}
        </div>

        {/* Magnifying glass */}
        <div
          style={{
            position: "absolute",
            bottom: 50,
            left: "8%",
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "transparent",
            border: "3px solid rgba(59,130,246,0.18)",
            transform: "rotate(30deg)",
          }}
        >
          <div
            style={{
              position: "absolute",
              bottom: -12,
              right: -4,
              width: 4,
              height: 16,
              borderRadius: 3,
              background: "rgba(59,130,246,0.15)",
              transform: "rotate(45deg)",
            }}
          />
        </div>

        {/* Small chart dot */}
        <div
          style={{
            position: "absolute",
            top: "55%",
            right: "5%",
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "rgba(245,158,11,0.15)",
            border: "2px solid rgba(245,158,11,0.2)",
          }}
        />

        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <nav style={{ fontSize: 14, color: "var(--muted)", marginBottom: 24 }}>
            <Link href={`/${locale}`} style={{ color: "var(--blue)", textDecoration: "none" }}>
              {t(loc, "home")}
            </Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "var(--ink)" }}>
              {t(loc, "data_method_breadcrumb")}
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
            {t(loc, "data_method_h1")}
          </h1>
          <p style={{ fontSize: 18, color: "var(--body)", margin: 0, maxWidth: 640 }}>
            {t(loc, "data_method_intro")}
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
          {/* Section 1: Carrier Rate Data */}
          <section className="fade-in" style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(59,130,246,0.05))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5a2 2 0 0 1-2 2h-1"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: 0 }}>
                {t(loc, "data_method_s1_title")}
              </h2>
            </div>
            <p style={{ color: "var(--body)", lineHeight: 1.7, marginBottom: 24 }}>
              {t(loc, "data_method_s1_body")}
            </p>

            <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", marginBottom: 12 }}>
              {t(loc, "data_method_top10")}
            </h3>
            <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid var(--line)" }}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>{t(loc, "data_method_carrier_col")}</th>
                    <th style={thStyle}>{t(loc, "data_method_source_col")}</th>
                  </tr>
                </thead>
                <tbody>
                  {TOP_CARRIERS.map((c) => (
                    <tr key={c.name}>
                      <td style={{ ...tdStyle, color: "var(--ink)", fontWeight: 500 }}>{c.name}</td>
                      <td style={tdStyle}>
                        <a
                          href={c.url}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          style={{ color: "var(--blue)", textDecoration: "none", fontSize: 12, wordBreak: "break-all" as const }}
                        >
                          {c.url.replace("https://www.", "").replace("https://", "")}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 8 }}>
              {t(loc, "data_method_full_list_pre")}
              <Link
                href={`/${locale}/sources`}
                style={{ color: "var(--blue)", textDecoration: "none" }}
              >
                {t(loc, "data_method_full_list_link")}
              </Link>
              {t(loc, "data_method_full_list_post")}
            </p>

            <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", margin: "28px 0 12px" }}>
              {t(loc, "data_method_currency_title")}
            </h3>
            <p style={{ color: "var(--body)", lineHeight: 1.7 }}>
              {t(loc, "data_method_currency_body")}
            </p>

            <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", margin: "28px 0 12px" }}>
              {t(loc, "data_method_gri_title")}
            </h3>
            <p style={{ color: "var(--body)", lineHeight: 1.7, marginBottom: 16 }}>
              {t(loc, "data_method_gri_body")}
            </p>
            <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid var(--line)" }}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>{t(loc, "data_method_carrier_col")}</th>
                    <th style={thStyle}>{t(loc, "data_method_increase_col")}</th>
                    <th style={thStyle}>{t(loc, "data_method_effective_col")}</th>
                  </tr>
                </thead>
                <tbody>
                  {GRI_2026.map((g) => (
                    <tr key={g.carrier}>
                      <td style={{ ...tdStyle, color: "var(--ink)" }}>{g.carrier}</td>
                      <td style={{ ...tdStyle, color: "var(--blue)", fontWeight: 600 }}>+{g.increase}</td>
                      <td style={{ ...tdStyle, color: "var(--body)" }}>{g.effective}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", margin: "28px 0 12px" }}>
              {t(loc, "data_method_verified_title")}
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 16,
              }}
            >
              <div style={{ background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 12, padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: "#22c55e" }} />
                  <span style={{ color: "var(--ink)", fontWeight: 600, fontSize: 14 }}>{t(loc, "data_method_verified_label")}</span>
                </div>
                <p style={{ fontSize: 13, color: "var(--body)", margin: 0, lineHeight: 1.6 }}>{t(loc, "data_method_verified_desc")}</p>
              </div>
              <div style={{ background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 12, padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: "#eab308" }} />
                  <span style={{ color: "var(--ink)", fontWeight: 600, fontSize: 14 }}>{t(loc, "data_method_estimated_label")}</span>
                </div>
                <p style={{ fontSize: 13, color: "var(--body)", margin: 0, lineHeight: 1.6 }}>{t(loc, "data_method_estimated_desc")}</p>
              </div>
            </div>
          </section>

          {/* Section 2: Customs Data */}
          <section className="fade-in" style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
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
                {t(loc, "data_method_s2_title")}
              </h2>
            </div>
            <p style={{ color: "var(--body)", lineHeight: 1.7, marginBottom: 24 }}>
              {t(loc, "data_method_s2_body")}
            </p>

            <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", marginBottom: 16 }}>
              {t(loc, "data_method_what_track")}
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 16,
                marginBottom: 28,
              }}
            >
              {([
                { titleKey: "data_method_deminimis_title", descKey: "data_method_deminimis_desc", color: "#3b82f6" },
                { titleKey: "data_method_duty_title", descKey: "data_method_duty_desc", color: "#8b5cf6" },
                { titleKey: "data_method_vat_title", descKey: "data_method_vat_desc", color: "#10b981" },
                { titleKey: "data_method_prohibited_title", descKey: "data_method_prohibited_desc", color: "#ef4444" },
              ] as const).map((item) => (
                <div
                  key={item.titleKey}
                  style={{
                    background: "var(--bg)",
                    border: "1px solid var(--line)",
                    borderRadius: 12,
                    padding: 20,
                    borderLeft: `3px solid ${item.color}`,
                  }}
                >
                  <p style={{ color: "var(--ink)", fontWeight: 600, margin: "0 0 6px", fontSize: 14 }}>
                    {t(loc, item.titleKey as any)}
                  </p>
                  <p style={{ fontSize: 13, color: "var(--body)", margin: 0, lineHeight: 1.6 }}>
                    {t(loc, item.descKey as any)}
                  </p>
                </div>
              ))}
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", marginBottom: 12 }}>
              {t(loc, "data_method_customs_sources")}
            </h3>
            <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid var(--line)" }}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>{t(loc, "data_method_source_name")}</th>
                    <th style={thStyle}>{t(loc, "data_method_source_purpose")}</th>
                  </tr>
                </thead>
                <tbody>
                  {CUSTOMS_SOURCES.map((s) => (
                    <tr key={s.name}>
                      <td style={tdStyle}>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          style={{ color: "var(--blue)", textDecoration: "none" }}
                        >
                          {s.name}
                        </a>
                      </td>
                      <td style={{ ...tdStyle, color: "var(--body)" }}>{s.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3: Update Frequency */}
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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: 0 }}>
                {t(loc, "data_method_s3_title")}
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 16,
                marginBottom: 28,
              }}
            >
              {([
                { valKey: "data_method_weekly", descKey: "data_method_weekly_desc" },
                { valKey: "data_method_monthly", descKey: "data_method_monthly_desc" },
                { valKey: "data_method_daily", descKey: "data_method_daily_desc" },
              ] as const).map((item) => (
                <div
                  key={item.valKey}
                  style={{
                    background: "var(--bg)",
                    border: "1px solid var(--line)",
                    borderRadius: 14,
                    padding: 24,
                    textAlign: "center" as const,
                  }}
                >
                  <p style={{ fontSize: 22, fontWeight: 700, color: "var(--blue)", margin: "0 0 4px" }}>
                    {t(loc, item.valKey as any)}
                  </p>
                  <p style={{ fontSize: 12, color: "var(--body)", margin: 0 }}>
                    {t(loc, item.descKey as any)}
                  </p>
                </div>
              ))}
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", marginBottom: 16 }}>
              {t(loc, "data_method_recent_updates")}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {RECENT_UPDATES.map((u, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 16,
                    alignItems: "flex-start",
                    borderLeft: "2px solid var(--blue)",
                    paddingLeft: 16,
                    paddingTop: 4,
                    paddingBottom: 4,
                  }}
                >
                  <span style={{ fontSize: 13, color: "var(--blue)", fontWeight: 500, whiteSpace: "nowrap" as const, minWidth: 100 }}>
                    {u.date}
                  </span>
                  <span style={{ fontSize: 13, color: "var(--body)" }}>{u.description}</span>
                </div>
              ))}
            </div>

            <div
              style={{
                background: "var(--bg)",
                border: "1px solid var(--line)",
                borderRadius: 12,
                padding: 20,
                marginTop: 24,
              }}
            >
              <p style={{ color: "var(--ink)", fontWeight: 600, margin: "0 0 4px", fontSize: 14 }}>
                {t(loc, "data_method_last_audit_title")}
              </p>
              <p style={{ fontSize: 13, color: "var(--body)", margin: 0, lineHeight: 1.6 }}>
                {t(loc, "data_method_last_audit_body")}
              </p>
            </div>
          </section>

          {/* Section 4: Coverage */}
          <section className="fade-in" style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "linear-gradient(135deg, rgba(6,182,212,0.12), rgba(6,182,212,0.05))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: 0 }}>
                {t(loc, "data_method_s4_title")}
              </h2>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: 16,
              }}
            >
              {([
                { value: "143", label: "data_method_carriers_label" },
                { value: "213", label: "data_method_countries_label" },
                { value: "80+", label: "data_method_verified_count" },
                { value: "40+", label: "data_method_customs_count" },
              ] as const).map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    background: "var(--bg)",
                    border: "1px solid var(--line)",
                    borderRadius: 14,
                    padding: 24,
                    textAlign: "center" as const,
                  }}
                >
                  <p style={{ fontSize: 32, fontWeight: 800, color: "var(--blue)", margin: "0 0 4px" }}>{stat.value}</p>
                  <p style={{ fontSize: 13, color: "var(--body)", margin: 0 }}>{t(loc, stat.label as any)}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 5: Accuracy Commitment */}
          <section className="fade-in" style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "linear-gradient(135deg, rgba(34,197,94,0.12), rgba(34,197,94,0.05))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: 0 }}>
                {t(loc, "data_method_s5_title")}
              </h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
              <div style={{ background: "var(--bg)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 12, padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: "#22c55e" }} />
                  <span style={{ color: "var(--ink)", fontWeight: 600, fontSize: 14 }}>{t(loc, "data_method_verified_accuracy")}</span>
                </div>
                <p style={{ fontSize: 13, color: "var(--body)", margin: 0, lineHeight: 1.6 }}>{t(loc, "data_method_verified_acc_desc")}</p>
              </div>
              <div style={{ background: "var(--bg)", border: "1px solid rgba(234,179,8,0.2)", borderRadius: 12, padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: "#eab308" }} />
                  <span style={{ color: "var(--ink)", fontWeight: 600, fontSize: 14 }}>{t(loc, "data_method_estimated_accuracy")}</span>
                </div>
                <p style={{ fontSize: 13, color: "var(--body)", margin: 0, lineHeight: 1.6 }}>{t(loc, "data_method_estimated_acc_desc")}</p>
              </div>
            </div>

            <div style={{ background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 12, padding: 20 }}>
              <h3 style={{ color: "var(--ink)", fontWeight: 600, margin: "0 0 10px", fontSize: 14 }}>
                {t(loc, "data_method_disclaimer_title")}
              </h3>
              <ul style={{ listStyle: "disc", paddingLeft: 20, fontSize: 13, color: "var(--body)", margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                <li>{t(loc, "data_method_disclaimer_1")}</li>
                <li>{t(loc, "data_method_disclaimer_2")}</li>
                <li>{t(loc, "data_method_disclaimer_3")}</li>
                <li>{t(loc, "data_method_disclaimer_4")}</li>
              </ul>
            </div>
          </section>

          {/* Section 6: Report Inaccuracies */}
          <section className="fade-in" style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "linear-gradient(135deg, rgba(239,68,68,0.12), rgba(239,68,68,0.05))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: 0 }}>
                {t(loc, "data_method_s6_title")}
              </h2>
            </div>
            <p style={{ color: "var(--body)", lineHeight: 1.7, marginBottom: 16 }}>
              {t(loc, "data_method_s6_body")}
            </p>
            <div style={{ background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 12, padding: 20 }}>
              <p style={{ color: "var(--body)", fontSize: 14, margin: 0 }}>
                {t(loc, "data_method_s6_contact_pre")}
                <Link
                  href={`/${locale}/about`}
                  style={{ color: "var(--blue)", textDecoration: "none" }}
                >
                  {t(loc, "data_method_s6_contact_link")}
                </Link>
                {t(loc, "data_method_s6_contact_post")}
              </p>
            </div>
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
        @keyframes floatMethod {
          0%, 100% { transform: rotate(6deg) translateY(0); }
          50% { transform: rotate(6deg) translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
