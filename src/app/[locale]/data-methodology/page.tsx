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

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "12px",
  fontSize: 12,
  fontWeight: 700,
  color: "var(--muted)",
  textTransform: "uppercase",
  letterSpacing: ".05em",
};

const tdStyle: React.CSSProperties = {
  padding: "12px",
  fontSize: 14,
  color: "var(--body)",
  borderTop: "1px solid var(--line)",
};

const h2Style: React.CSSProperties = {
  margin: "0 0 16px",
  fontSize: 28,
  fontWeight: 800,
  letterSpacing: "-.02em",
  color: "var(--ink)",
};

const h3Style: React.CSSProperties = {
  margin: "24px 0 12px",
  fontSize: 17,
  fontWeight: 700,
  color: "var(--ink)",
};

const cardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid var(--line)",
  borderRadius: 16,
  padding: 24,
};

const bodyStyle: React.CSSProperties = {
  color: "var(--body)",
  lineHeight: 1.65,
  fontSize: 15,
  margin: "0 0 12px",
};

export default async function DataMethodologyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;

  return (
    <>
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

      <section style={{ padding: "72px 32px 48px", borderBottom: "1px solid var(--line)", position: "relative" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(800px 400px at 40% -10%, rgba(26,115,232,.08), transparent 60%)" }} />
        <div style={{ position: "relative", maxWidth: 1240, margin: "0 auto" }}>
          <nav style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>
            <Link href={`/${locale}`} style={{ color: "var(--muted)", textDecoration: "none" }}>{t(loc, "home")}</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "var(--ink)" }}>{t(loc, "data_method_breadcrumb")}</span>
          </nav>
          <h1 style={{ margin: "0 0 18px", fontSize: "clamp(40px,5vw,64px)", lineHeight: 1.02, letterSpacing: "-.03em", fontWeight: 800, color: "var(--ink)" }}>
            {t(loc, "data_method_h1")}
          </h1>
          <p style={{ fontSize: 19, color: "var(--body)", maxWidth: 720, margin: 0 }}>
            {t(loc, "data_method_intro")}
          </p>
        </div>
      </section>

      <section style={{ padding: "48px 32px 96px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gap: 40 }}>
          {/* Section 1: Carrier Rate Data */}
          <section>
            <h2 style={h2Style}>{t(loc, "data_method_s1_title")}</h2>
            <p style={bodyStyle}>{t(loc, "data_method_s1_body")}</p>

            <h3 style={h3Style}>{t(loc, "data_method_top10")}</h3>
            <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead style={{ background: "var(--bg)" }}>
                    <tr>
                      <th style={thStyle}>{t(loc, "data_method_carrier_col")}</th>
                      <th style={thStyle}>{t(loc, "data_method_source_col")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TOP_CARRIERS.map((c) => (
                      <tr key={c.name}>
                        <td style={{ ...tdStyle, color: "var(--ink)", fontWeight: 600 }}>{c.name}</td>
                        <td style={tdStyle}>
                          <a
                            href={c.url}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            style={{ color: "var(--blue)", fontWeight: 600, textDecoration: "none", fontSize: 13, wordBreak: "break-all" }}
                          >
                            {c.url.replace("https://www.", "").replace("https://", "")}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 12 }}>
              {t(loc, "data_method_full_list_pre")}
              <Link href={`/${locale}/sources`} style={{ color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>
                {t(loc, "data_method_full_list_link")}
              </Link>
              {t(loc, "data_method_full_list_post")}
            </p>

            <h3 style={h3Style}>{t(loc, "data_method_currency_title")}</h3>
            <p style={bodyStyle}>{t(loc, "data_method_currency_body")}</p>

            <h3 style={h3Style}>{t(loc, "data_method_gri_title")}</h3>
            <p style={bodyStyle}>{t(loc, "data_method_gri_body")}</p>
            <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead style={{ background: "var(--bg)" }}>
                    <tr>
                      <th style={thStyle}>{t(loc, "data_method_carrier_col")}</th>
                      <th style={thStyle}>{t(loc, "data_method_increase_col")}</th>
                      <th style={thStyle}>{t(loc, "data_method_effective_col")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {GRI_2026.map((g) => (
                      <tr key={g.carrier}>
                        <td style={{ ...tdStyle, color: "var(--ink)", fontWeight: 600 }}>{g.carrier}</td>
                        <td style={{ ...tdStyle, color: "var(--blue)", fontWeight: 700 }}>+{g.increase}</td>
                        <td style={{ ...tdStyle, color: "var(--muted)" }}>{g.effective}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <h3 style={h3Style}>{t(loc, "data_method_verified_title")}</h3>
            <div style={cardStyle}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 99, background: "#10b981" }} />
                    <span style={{ color: "var(--ink)", fontWeight: 700, fontSize: 15 }}>
                      {t(loc, "data_method_verified_label")}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 14, color: "var(--body)", lineHeight: 1.55 }}>
                    {t(loc, "data_method_verified_desc")}
                  </p>
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 99, background: "#f59e0b" }} />
                    <span style={{ color: "var(--ink)", fontWeight: 700, fontSize: 15 }}>
                      {t(loc, "data_method_estimated_label")}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 14, color: "var(--body)", lineHeight: 1.55 }}>
                    {t(loc, "data_method_estimated_desc")}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Customs Data */}
          <section>
            <h2 style={h2Style}>{t(loc, "data_method_s2_title")}</h2>
            <p style={bodyStyle}>{t(loc, "data_method_s2_body")}</p>

            <h3 style={h3Style}>{t(loc, "data_method_what_track")}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 24 }}>
              {[
                { title: t(loc, "data_method_deminimis_title"), desc: t(loc, "data_method_deminimis_desc") },
                { title: t(loc, "data_method_duty_title"), desc: t(loc, "data_method_duty_desc") },
                { title: t(loc, "data_method_vat_title"), desc: t(loc, "data_method_vat_desc") },
                { title: t(loc, "data_method_prohibited_title"), desc: t(loc, "data_method_prohibited_desc") },
              ].map((item) => (
                <div key={item.title} style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 12, padding: 18 }}>
                  <p style={{ margin: "0 0 4px", color: "var(--ink)", fontWeight: 700, fontSize: 15 }}>{item.title}</p>
                  <p style={{ margin: 0, fontSize: 14, color: "var(--body)", lineHeight: 1.55 }}>{item.desc}</p>
                </div>
              ))}
            </div>

            <h3 style={h3Style}>{t(loc, "data_method_customs_sources")}</h3>
            <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead style={{ background: "var(--bg)" }}>
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
                            style={{ color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}
                          >
                            {s.name}
                          </a>
                        </td>
                        <td style={{ ...tdStyle, color: "var(--muted)" }}>{s.purpose}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Section 3: Update Frequency */}
          <section>
            <h2 style={h2Style}>{t(loc, "data_method_s3_title")}</h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
              {[
                { val: t(loc, "data_method_weekly"), desc: t(loc, "data_method_weekly_desc") },
                { val: t(loc, "data_method_monthly"), desc: t(loc, "data_method_monthly_desc") },
                { val: t(loc, "data_method_daily"), desc: t(loc, "data_method_daily_desc") },
              ].map((item, i) => (
                <div key={i} style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 16, padding: 24, textAlign: "center" }}>
                  <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "var(--blue)", letterSpacing: "-.02em" }}>{item.val}</p>
                  <p style={{ margin: "6px 0 0", fontSize: 13, color: "var(--muted)" }}>{item.desc}</p>
                </div>
              ))}
            </div>

            <h3 style={h3Style}>{t(loc, "data_method_recent_updates")}</h3>
            <div style={{ display: "grid", gap: 8 }}>
              {RECENT_UPDATES.map((u, i) => (
                <div
                  key={i}
                  style={{ display: "flex", gap: 16, alignItems: "flex-start", borderLeft: "2px solid var(--blue-50)", paddingLeft: 16, paddingTop: 4, paddingBottom: 4 }}
                >
                  <span style={{ fontSize: 14, color: "var(--blue)", fontWeight: 700, whiteSpace: "nowrap", minWidth: 110 }}>
                    {u.date}
                  </span>
                  <span style={{ fontSize: 14, color: "var(--body)" }}>{u.description}</span>
                </div>
              ))}
            </div>

            <div style={{ ...cardStyle, marginTop: 24 }}>
              <p style={{ margin: "0 0 4px", color: "var(--ink)", fontWeight: 700, fontSize: 15 }}>
                {t(loc, "data_method_last_audit_title")}
              </p>
              <p style={{ margin: 0, fontSize: 14, color: "var(--body)", lineHeight: 1.55 }}>
                {t(loc, "data_method_last_audit_body")}
              </p>
            </div>
          </section>

          {/* Section 4: Coverage */}
          <section>
            <h2 style={h2Style}>{t(loc, "data_method_s4_title")}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
              {[
                { val: "143", label: t(loc, "data_method_carriers_label") },
                { val: "213", label: t(loc, "data_method_countries_label") },
                { val: "80+", label: t(loc, "data_method_verified_count") },
                { val: "40+", label: t(loc, "data_method_customs_count") },
              ].map((s) => (
                <div key={s.val} style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 16, padding: 24, textAlign: "center" }}>
                  <p style={{ margin: 0, fontSize: 32, fontWeight: 800, color: "var(--blue)", letterSpacing: "-.03em" }}>{s.val}</p>
                  <p style={{ margin: "6px 0 0", fontSize: 14, color: "var(--muted)" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 5: Accuracy Commitment */}
          <section>
            <h2 style={h2Style}>{t(loc, "data_method_s5_title")}</h2>

            <div style={{ display: "grid", gap: 16 }}>
              <div style={{ background: "#fff", border: "1px solid rgba(16,185,129,.3)", borderRadius: 16, padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 99, background: "#10b981" }} />
                  <span style={{ color: "var(--ink)", fontWeight: 700, fontSize: 15 }}>
                    {t(loc, "data_method_verified_accuracy")}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 14, color: "var(--body)", lineHeight: 1.55 }}>
                  {t(loc, "data_method_verified_acc_desc")}
                </p>
              </div>

              <div style={{ background: "#fff", border: "1px solid rgba(245,158,11,.3)", borderRadius: 16, padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 99, background: "#f59e0b" }} />
                  <span style={{ color: "var(--ink)", fontWeight: 700, fontSize: 15 }}>
                    {t(loc, "data_method_estimated_accuracy")}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 14, color: "var(--body)", lineHeight: 1.55 }}>
                  {t(loc, "data_method_estimated_acc_desc")}
                </p>
              </div>
            </div>

            <div style={{ ...cardStyle, marginTop: 16 }}>
              <h3 style={{ margin: "0 0 10px", color: "var(--ink)", fontWeight: 700, fontSize: 16 }}>
                {t(loc, "data_method_disclaimer_title")}
              </h3>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: "var(--body)", lineHeight: 1.65, display: "grid", gap: 6 }}>
                <li>{t(loc, "data_method_disclaimer_1")}</li>
                <li>{t(loc, "data_method_disclaimer_2")}</li>
                <li>{t(loc, "data_method_disclaimer_3")}</li>
                <li>{t(loc, "data_method_disclaimer_4")}</li>
              </ul>
            </div>
          </section>

          {/* Section 6: Report Inaccuracies */}
          <section>
            <h2 style={h2Style}>{t(loc, "data_method_s6_title")}</h2>
            <p style={bodyStyle}>{t(loc, "data_method_s6_body")}</p>
            <div style={cardStyle}>
              <p style={{ margin: 0, color: "var(--body)", fontSize: 14, lineHeight: 1.65 }}>
                {t(loc, "data_method_s6_contact_pre")}
                <Link href={`/${locale}/about`} style={{ color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>
                  {t(loc, "data_method_s6_contact_link")}
                </Link>
                {t(loc, "data_method_s6_contact_post")}
              </p>
            </div>
          </section>

          <p style={{ marginTop: 16, paddingTop: 20, borderTop: "1px solid var(--line)", fontSize: 13, color: "var(--muted)" }}>
            {t(loc, "last_updated_march")}
          </p>
        </div>
      </section>
    </>
  );
}
