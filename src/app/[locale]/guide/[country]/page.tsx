import { Metadata } from "next";
import {
  countries,
  getCountryBySlug,
  getCountryName,
  getPopularCountries,
  makeCorridorSlug,
  carriers,
} from "@/lib/data";
import { getCustomsInfo, getCustomsNotes, hasCustomsData } from "@/lib/customs";
import { t, locales } from "@/lib/i18n";
import type { Locale, Country } from "@/lib/types";
import { countryFlag } from "@/lib/flags";
import { getCorridorLocales } from "@/lib/country-locale";
import { notFound, permanentRedirect } from "next/navigation";
import Link from "next/link";

export const dynamicParams = true;

export function generateStaticParams() {
  const params: { locale: string; country: string }[] = [];
  const popularCodes = new Set(["US","GB","DE","CN","JP","AU","CA","RU","FR","KR","IN","AE","SG","BR","IT","ES"]);
  // Only generate in en + the country's own language
  for (const c of countries) {
    if (!popularCodes.has(c.code)) continue;
    const countryLocales = getCorridorLocales(c.code, c.code);
    for (const locale of countryLocales) {
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
    title: t(loc, "guide_title", { country: name }) + " — " + t(loc, "customs_info"),
    description: t(loc, "guide_meta_description", { country: name }),
    alternates: {
      canonical: `/${locale}/guide/${slug}`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}/guide/${slug}`])),
        "x-default": `/en/guide/${slug}`,
      },
    },
    openGraph: {
      title: t(loc, "guide_title", { country: name }),
      description: t(loc, "guide_meta_description", { country: name }),
      type: "article",
    },
  };
}

const h2Style: React.CSSProperties = {
  margin: "0 0 16px",
  fontSize: 28,
  fontWeight: 800,
  letterSpacing: "-.02em",
  color: "var(--ink)",
};

const cardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid var(--line)",
  borderRadius: 16,
  padding: 24,
};

export default async function GuidePage({
  params,
}: {
  params: Promise<{ locale: string; country: string }>;
}) {
  const { locale, country: slug } = await params;
  const loc = locale as Locale;
  const country = getCountryBySlug(slug, "en");

  if (!country) {
    notFound();
  }

  const validLocales = getCorridorLocales(country.code, country.code);
  if (!validLocales.includes(loc)) {
    permanentRedirect(`/en/guide/${country.slug_en}`);
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
    <>
      <section style={{ padding: "72px 32px 48px", borderBottom: "1px solid var(--line)", position: "relative" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(800px 400px at 40% -10%, rgba(26,115,232,.08), transparent 60%)" }} />
        <div style={{ position: "relative", maxWidth: 1240, margin: "0 auto" }}>
          <nav style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>
            <Link href={`/${locale}`} style={{ color: "var(--muted)", textDecoration: "none" }}>{t(loc, "home")}</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <Link href={`/${locale}/guide`} style={{ color: "var(--muted)", textDecoration: "none" }}>{t(loc, "guides")}</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "var(--ink)" }}>{name}</span>
          </nav>
          <h1 style={{ margin: "0 0 20px", fontSize: "clamp(40px,5vw,64px)", lineHeight: 1.02, letterSpacing: "-.03em", fontWeight: 800, color: "var(--ink)" }}>
            {countryFlag(country.code)}{" "}
            {t(loc, "guide_title", { country: name })}
          </h1>

          {/* Quick links */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <Link
              href={`/${locale}/shipping/to/${country.slug_en}`}
              style={{
                padding: "10px 18px",
                background: "var(--ink)",
                color: "#fff",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              {t(loc, "ship_to", { country: name })}
            </Link>
            <Link
              href={`/${locale}/shipping/from/${country.slug_en}`}
              style={{
                padding: "10px 18px",
                background: "#fff",
                color: "var(--ink)",
                border: "1px solid var(--line)",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              {t(loc, "ship_from", { country: name })}
            </Link>
          </div>
        </div>
      </section>

      <section style={{ padding: "48px 32px 96px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gap: 48 }}>
          {/* Overview */}
          <section>
            <h2 style={h2Style}>{t(loc, "overview")}</h2>
            <p style={{ color: "var(--body)", lineHeight: 1.65, fontSize: 16, margin: 0 }}>
              {t(loc, "guide_overview", {
                country: name,
                region: country.region,
                continent: country.continent,
                carrier_count: String(carrierCount),
                international_count: String(internationalCarriers.length),
                postal_count: String(postalCarriers.length),
              })}
            </p>
          </section>

          {/* Customs */}
          {hasCustoms && (
            <section>
              <h2 style={h2Style}>{t(loc, "customs_info")}</h2>
              <div style={cardStyle}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 16 }}>
                  <div style={{ textAlign: "center", padding: 20, background: "var(--bg)", borderRadius: 12, border: "1px solid var(--line)" }}>
                    <p style={{ margin: "0 0 4px", fontSize: 13, color: "var(--muted)" }}>{t(loc, "de_minimis")}</p>
                    <p style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "var(--ink)", letterSpacing: "-.02em" }}>
                      ${customs.de_minimis_usd}
                    </p>
                    <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--muted)" }}>
                      {customs.de_minimis_usd > 0
                        ? t(loc, "duty_free_below", { threshold: String(customs.de_minimis_usd) })
                        : t(loc, "duty_from_zero")}
                    </p>
                  </div>
                  <div style={{ textAlign: "center", padding: 20, background: "var(--bg)", borderRadius: 12, border: "1px solid var(--line)" }}>
                    <p style={{ margin: "0 0 4px", fontSize: 13, color: "var(--muted)" }}>{t(loc, "vat_rate")}</p>
                    <p style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "var(--ink)", letterSpacing: "-.02em" }}>{customs.vat_rate}%</p>
                    <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--muted)" }}>{customs.currency}</p>
                  </div>
                  <div style={{ textAlign: "center", padding: 20, background: "var(--bg)", borderRadius: 12, border: "1px solid var(--line)" }}>
                    <p style={{ margin: "0 0 4px", fontSize: 13, color: "var(--muted)" }}>{t(loc, "avg_duty")}</p>
                    <p style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "var(--ink)", letterSpacing: "-.02em" }}>{customs.avg_duty_rate}%</p>
                    <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--muted)" }}>{t(loc, "average")}</p>
                  </div>
                </div>
                {getCustomsNotes(customs, loc) && (
                  <div style={{ background: "var(--blue-50)", border: "1px solid rgba(26,115,232,.3)", borderRadius: 12, padding: 16 }}>
                    <p style={{ margin: 0, fontSize: 14, color: "var(--ink)", lineHeight: 1.55 }}>
                      <span style={{ fontWeight: 700 }}>{t(loc, "customs_note")}:</span>{" "}
                      {getCustomsNotes(customs, loc)}
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Required Documents */}
          <section>
            <h2 style={h2Style}>{t(loc, "required_documents")}</h2>
            <div style={cardStyle}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
                {[
                  { doc: t(loc, "doc_invoice"), desc: t(loc, "doc_invoice_desc") },
                  { doc: t(loc, "doc_packing"), desc: t(loc, "doc_packing_desc") },
                  { doc: t(loc, "doc_customs"), desc: t(loc, "doc_customs_desc") },
                  { doc: t(loc, "doc_awb"), desc: t(loc, "doc_awb_desc") },
                  { doc: t(loc, "doc_origin"), desc: t(loc, "doc_origin_desc") },
                  { doc: t(loc, "doc_license"), desc: t(loc, "doc_license_desc") },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: 12, background: "var(--bg)", borderRadius: 10, border: "1px solid var(--line)" }}>
                    <span style={{
                      flexShrink: 0,
                      width: 32,
                      height: 32,
                      background: "var(--blue-50)",
                      color: "var(--blue)",
                      borderRadius: 10,
                      display: "grid",
                      placeItems: "center",
                      fontSize: 13,
                      fontWeight: 700,
                    }}>
                      {i + 1}
                    </span>
                    <div>
                      <p style={{ margin: "0 0 2px", fontWeight: 600, color: "var(--ink)", fontSize: 14 }}>{item.doc}</p>
                      <p style={{ margin: 0, fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Import Duty Estimator */}
          {hasCustoms && (
            <section>
              <h2 style={h2Style}>{t(loc, "duty_tax_estimate")}</h2>
              <div style={cardStyle}>
                <p style={{ margin: "0 0 16px", fontSize: 14, color: "var(--body)", lineHeight: 1.55 }}>
                  {t(loc, "duty_estimate_intro", { country: name })}
                </p>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ textAlign: "left", color: "var(--muted)", borderBottom: "1px solid var(--line)" }}>
                        <th style={{ padding: "8px 16px 8px 0", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em" }}>{t(loc, "goods_value")}</th>
                        <th style={{ padding: "8px 16px 8px 0", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em" }}>{t(loc, "duty")}</th>
                        <th style={{ padding: "8px 16px 8px 0", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em" }}>{t(loc, "vat_tax")}</th>
                        <th style={{ padding: "8px 0", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em" }}>{t(loc, "total_charges")}</th>
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
                          <tr key={value} style={{ borderBottom: "1px solid var(--line)" }}>
                            <td style={{ padding: "10px 16px 10px 0", fontWeight: 600, color: "var(--ink)" }}>${value}</td>
                            <td style={{ padding: "10px 16px 10px 0", color: "var(--body)" }}>${duty.toFixed(0)}</td>
                            <td style={{ padding: "10px 16px 10px 0", color: "var(--body)" }}>${vat.toFixed(0)}</td>
                            <td style={{ padding: "10px 0", fontWeight: 700, color: "var(--ink)" }}>
                              {total > 0 ? `$${total.toFixed(0)}` : t(loc, "free")}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <p style={{ margin: "12px 0 0", fontSize: 12, color: "var(--muted)" }}>
                  {t(loc, "duty_estimate_note")}
                </p>
              </div>
            </section>
          )}

          {/* Tips */}
          <section>
            <h2 style={h2Style}>{t(loc, "shipping_tips")}</h2>
            <div style={{ display: "grid", gap: 12 }}>
              {[
                t(loc, "tip_1"),
                t(loc, "tip_2"),
                t(loc, "tip_3", { threshold: String(customs.de_minimis_usd), country: name }),
                t(loc, "tip_4"),
                t(loc, "tip_5"),
                t(loc, "tip_6"),
              ].map((tip, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{
                    flexShrink: 0,
                    width: 26,
                    height: 26,
                    background: "var(--blue-50)",
                    color: "var(--blue)",
                    borderRadius: 99,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 13,
                    fontWeight: 700,
                  }}>
                    {i + 1}
                  </span>
                  <p style={{ margin: 0, color: "var(--body)", fontSize: 15, lineHeight: 1.6 }}>{tip}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Prohibited & Restricted Items */}
          <section>
            <h2 style={h2Style}>{t(loc, "prohibited_items")}</h2>
            <div style={cardStyle}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
                <div>
                  <h3 style={{ margin: "0 0 10px", color: "#b91c1c", fontWeight: 700, fontSize: 14 }}>
                    {t(loc, "prohibited")}
                  </h3>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 6 }}>
                    {[
                      t(loc, "prohibited_1"),
                      t(loc, "prohibited_2"),
                      t(loc, "prohibited_3"),
                      t(loc, "prohibited_4"),
                      t(loc, "prohibited_5"),
                    ].map((item, i) => (
                      <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 14, color: "var(--body)", lineHeight: 1.55 }}>
                        <span style={{ color: "#ef4444", flexShrink: 0 }}>X</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 style={{ margin: "0 0 10px", color: "#b45309", fontWeight: 700, fontSize: 14 }}>
                    {t(loc, "restricted")}
                  </h3>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 6 }}>
                    {[
                      t(loc, "restricted_1"),
                      t(loc, "restricted_2"),
                      t(loc, "restricted_3"),
                      t(loc, "restricted_4"),
                      t(loc, "restricted_5"),
                    ].map((item, i) => (
                      <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 14, color: "var(--body)", lineHeight: 1.55 }}>
                        <span style={{ color: "#f59e0b", flexShrink: 0 }}>!</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Useful tools */}
          <section>
            <h2 style={{ ...h2Style, fontSize: 24 }}>{t(loc, "useful_tools")}</h2>
            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
              <Link
                href={`/${locale}/tools/duty-calculator`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "#fff",
                  border: "1px solid var(--line)",
                  borderRadius: 12,
                  padding: "14px 18px",
                  flex: 1,
                  minWidth: 240,
                  textDecoration: "none",
                  transition: "all .2s",
                }}
              >
                <span style={{ fontSize: 14, color: "var(--muted)" }}>/</span>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, color: "var(--ink)", fontSize: 14 }}>{t(loc, "duty_calculator_link")}</p>
                  <p style={{ margin: 0, fontSize: 13, color: "var(--muted)" }}>{t(loc, "duties_for", { country: name })}</p>
                </div>
              </Link>
              <Link
                href={`/${locale}/tools/delivery-estimator`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "#fff",
                  border: "1px solid var(--line)",
                  borderRadius: 12,
                  padding: "14px 18px",
                  flex: 1,
                  minWidth: 240,
                  textDecoration: "none",
                  transition: "all .2s",
                }}
              >
                <span style={{ fontSize: 14, color: "var(--muted)" }}>/</span>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, color: "var(--ink)", fontSize: 14 }}>{t(loc, "delivery_estimator_link")}</p>
                  <p style={{ margin: 0, fontSize: 13, color: "var(--muted)" }}>{t(loc, "delivery_date")}</p>
                </div>
              </Link>
              {hasCustoms && (
                <Link
                  href={`/${locale}/customs/${country.slug_en}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: 14,
                    color: "var(--blue)",
                    fontWeight: 600,
                    textDecoration: "none",
                    padding: "0 8px",
                  }}
                >
                  {t(loc, "customs_link", { country: name })} →
                </Link>
              )}
            </div>
          </section>

          {/* Popular routes */}
          <section>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 40 }}>
              <div>
                <h2 style={{ ...h2Style, fontSize: 24 }}>
                  {t(loc, "popular_routes_to", { country: name })}
                </h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {popular.slice(0, 10).map((from) => (
                    <Link
                      key={from.code}
                      href={`/${locale}/shipping/${makeCorridorSlug(from, country, loc)}`}
                      prefetch={false}
                      style={{
                        background: "#fff",
                        border: "1px solid var(--line)",
                        borderRadius: 10,
                        padding: "8px 12px",
                        fontSize: 13,
                        color: "var(--body)",
                        textDecoration: "none",
                        transition: "all .2s",
                      }}
                    >
                      {countryFlag(from.code)} {getCountryName(from, loc)} → {name}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <h2 style={{ ...h2Style, fontSize: 20 }}>
                  {t(loc, "popular_routes_from", { country: name })}
                </h2>
                <div style={{ display: "grid", gap: 4 }}>
                  {popular.slice(0, 6).map((to) => (
                    <Link
                      key={to.code}
                      href={`/${locale}/shipping/${makeCorridorSlug(country, to, loc)}`}
                      prefetch={false}
                      style={{
                        display: "block",
                        fontSize: 14,
                        color: "var(--body)",
                        textDecoration: "none",
                        padding: "4px 0",
                      }}
                    >
                      {name} → {getCountryName(to, loc)} {countryFlag(to.code)}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Guide FAQ */}
          {(() => {
            const faqs = [
              {
                q: t(loc, "guide_faq_cost_q", { country: name }),
                a: t(loc, "guide_faq_cost_a", { country: name }),
              },
              {
                q: t(loc, "guide_faq_threshold_q", { country: name }),
                a: t(loc, "guide_faq_threshold_a", {
                  country: name,
                  threshold: String(customs.de_minimis_usd),
                  duty: String(customs.avg_duty_rate),
                  vat: String(customs.vat_rate),
                }),
              },
              {
                q: t(loc, "guide_faq_carriers_q", { country: name }),
                a: t(loc, "guide_faq_carriers_a", { country: name, count: String(carrierCount) }),
              },
            ];

            return (
              <section>
                <h2 style={h2Style}>{t(loc, "faq_title")}</h2>
                <div style={{ display: "grid", gap: 12 }}>
                  {faqs.map((faq, i) => (
                    <details key={i} style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 12 }}>
                      <summary style={{ padding: 16, fontWeight: 600, color: "var(--ink)", cursor: "pointer", fontSize: 15 }}>
                        {faq.q}
                      </summary>
                      <p style={{ margin: 0, padding: "0 16px 16px", color: "var(--body)", fontSize: 14, lineHeight: 1.6 }}>{faq.a}</p>
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

          {/* Compare rates CTA */}
          <section style={{ background: "var(--ink)", borderRadius: 20, padding: "40px 32px", textAlign: "center" }}>
            <h2 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-.02em" }}>
              {t(loc, "compare_shipping_to", { country: name })}
            </h2>
            <p style={{ margin: "0 0 20px", fontSize: 14, color: "rgba(255,255,255,.7)" }}>
              {t(loc, "carriers_realtime")}
            </p>
            <Link
              href={`/${locale}`}
              style={{
                display: "inline-block",
                padding: "12px 28px",
                background: "#fff",
                color: "var(--ink)",
                fontSize: 14,
                fontWeight: 700,
                borderRadius: 99,
                textDecoration: "none",
              }}
            >
              {t(loc, "compare_rates_cta")}
            </Link>
          </section>
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: t(loc, "guide_title", { country: name }),
            description: t(loc, "guide_meta_description", { country: name }),
            author: { "@type": "Organization", name: "RateShips" },
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
                item: `${"https://rateships.com"}/${locale}`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: t(loc, "guides"),
                item: `${"https://rateships.com"}/${locale}/guide`,
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: t(loc, "guide_title", { country: name }) + " — " + t(loc, "customs_info"),
            description: t(loc, "guide_meta_description", { country: name }),
            url: `https://rateships.com/${locale}/guide/${slug}`,
            inLanguage: locale,
            isPartOf: { "@type": "WebSite", name: "RateShips", url: "https://rateships.com" },
            dateModified: new Date().toISOString().split("T")[0],
          }),
        }}
      />
    </>
  );
}
