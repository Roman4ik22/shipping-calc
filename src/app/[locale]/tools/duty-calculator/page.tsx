import { Metadata } from "next";
import { t, tf } from "@/lib/i18n";
import { countries, getCountryName } from "@/lib/data";
import type { Locale } from "@/lib/types";
import Link from "next/link";
import DutyCalculatorStandalone from "@/components/DutyCalculatorStandalone";

export const dynamicParams = true;

export function generateStaticParams() {
  return [{ locale: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  return {
    title: t(loc, "duty_calc_meta_title"),
    description: t(loc, "duty_calc_meta_desc"),
    alternates: {
      canonical: `/${locale}/tools/duty-calculator`,
      languages: {
        ...Object.fromEntries(
          ["en", "ru", "es", "de", "fr", "pt", "zh", "ja", "ko", "ar", "tr", "it"].map((l) => [l, `/${l}/tools/duty-calculator`])
        ),
        "x-default": "/en/tools/duty-calculator",
      },
    },
    keywords: t(loc, "duty_calc_kw").split(","),
  };
}

const COUNTRY_SAMPLE: { code: string; flag: string; name: string; duty: string; vat: string; dm: string; tone: "blue" | "warm" | "accent" | "good" }[] = [
  { code: "US", flag: "🇺🇸", name: "United States", duty: "0–37.5%", vat: "—", dm: "$800", tone: "blue" },
  { code: "DE", flag: "🇩🇪", name: "Germany", duty: "0–17%", vat: "19%", dm: "€150", tone: "warm" },
  { code: "GB", flag: "🇬🇧", name: "United Kingdom", duty: "0–25%", vat: "20%", dm: "£135", tone: "blue" },
  { code: "CA", flag: "🇨🇦", name: "Canada", duty: "0–18%", vat: "5–15%", dm: "CAD 40", tone: "accent" },
  { code: "AU", flag: "🇦🇺", name: "Australia", duty: "0–10%", vat: "10%", dm: "AUD 1,000", tone: "good" },
  { code: "FR", flag: "🇫🇷", name: "France", duty: "0–17%", vat: "20%", dm: "€150", tone: "warm" },
  { code: "IT", flag: "🇮🇹", name: "Italy", duty: "0–17%", vat: "22%", dm: "€150", tone: "warm" },
  { code: "ES", flag: "🇪🇸", name: "Spain", duty: "0–17%", vat: "21%", dm: "€150", tone: "warm" },
  { code: "NL", flag: "🇳🇱", name: "Netherlands", duty: "0–17%", vat: "21%", dm: "€150", tone: "warm" },
  { code: "JP", flag: "🇯🇵", name: "Japan", duty: "0–30%", vat: "10%", dm: "¥10,000", tone: "accent" },
  { code: "BR", flag: "🇧🇷", name: "Brazil", duty: "0–35%", vat: "17–25%", dm: "$50", tone: "good" },
  { code: "MX", flag: "🇲🇽", name: "Mexico", duty: "0–35%", vat: "16%", dm: "$50", tone: "good" },
  { code: "CN", flag: "🇨🇳", name: "China", duty: "0–50%", vat: "13%", dm: "¥50", tone: "accent" },
  { code: "EU", flag: "🇪🇺", name: "EU (27 members)", duty: "0–17%", vat: "17–27%", dm: "€150", tone: "warm" },
];

const TONE_MAP: Record<string, { bg: string; fg: string }> = {
  blue: { bg: "var(--blue-50)", fg: "var(--blue)" },
  warm: { bg: "var(--warm-50)", fg: "#A37A00" },
  accent: { bg: "var(--accent-50)", fg: "var(--accent)" },
  good: { bg: "var(--good-50)", fg: "var(--good)" },
};

export default async function DutyCalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: t(loc, "duty_calc_name"),
        description: t(loc, "duty_calc_page_desc"),
        url: `https://rateships.com/${locale}/tools/duty-calculator`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: t(loc, "home"), item: `https://rateships.com/${locale}` },
          { "@type": "ListItem", position: 2, name: t(loc, "tools_label"), item: `https://rateships.com/${locale}/tools` },
          { "@type": "ListItem", position: 3, name: t(loc, "duty_calc_breadcrumb") },
        ],
      },
    ],
  };

  const features: { icon: React.ReactNode; color: string; tintBg: string; title: string; tag: string; body: string; stat: string }[] = [
    {
      icon: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5z" /></svg>,
      color: "var(--blue)", tintBg: "var(--blue-50)",
      title: tf(loc, "feat_hs_title", "Full duty + VAT breakdown"),
      tag: tf(loc, "feat_hs_tag", "Not just the duty rate"),
      body: tf(loc, "feat_hs_body", "Declared value → customs duty → import VAT → broker handling → total landed cost. Every line itemized so you can explain the invoice to finance."),
      stat: tf(loc, "feat_hs_stat", "4 line items per result"),
    },
    {
      icon: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0115-6.7L21 8M21 3v5h-5" /><path d="M21 12a9 9 0 01-15 6.7L3 16M3 21v-5h5" /></svg>,
      color: "var(--good)", tintBg: "var(--good-50)",
      title: tf(loc, "feat_refresh_title", "Published tariffs, updated weekly"),
      tag: tf(loc, "feat_refresh_tag", "Sourced directly"),
      body: tf(loc, "feat_refresh_body", "Rates come from each country's published tariff schedule — HTSUS, TARIC, UK Integrated Online Tariff, CBSA. No scraping, no guesswork, updated on a weekly cadence."),
      stat: tf(loc, "feat_refresh_stat", "Weekly refresh, 213 authorities"),
    },
    {
      icon: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18M5 8h14M3 14l3-7 3 7M15 14l3-7 3 7" /><path d="M3 14a3 3 0 006 0M15 14a3 3 0 006 0" /></svg>,
      color: "#A37A00", tintBg: "var(--warm-50)",
      title: tf(loc, "feat_dm_title", "De minimis thresholds"),
      tag: tf(loc, "feat_dm_tag", "Low-value exemptions"),
      body: tf(loc, "feat_dm_body", "$800 US · €150 EU · £135 UK · CAD 40 · AUD 1,000. We track the threshold and the conditions — your shipment only qualifies when the full set of rules is met."),
      stat: tf(loc, "feat_dm_stat", "213 thresholds tracked"),
    },
    {
      icon: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l8 3v7c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V5l8-3z" /><path d="M9 12l2 2 4-4" /></svg>,
      color: "var(--accent)", tintBg: "var(--accent-50)",
      title: tf(loc, "feat_honest_title", "Free and honest"),
      tag: tf(loc, "feat_honest_tag", "No signup, no upsell"),
      body: tf(loc, "feat_honest_body", "The calculator is and stays free. No carrier commissions means the answer we give you is the one our data actually says — not the one that pays us most."),
      stat: tf(loc, "feat_honest_stat", "Zero paywalled features"),
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* === V2 HERO === */}
      <section style={{ position: "relative", overflow: "hidden", paddingTop: 72, paddingBottom: 64, borderBottom: "1px solid var(--line)" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(1000px 500px at 85% 10%, rgba(26,115,232,.12), transparent 60%), radial-gradient(600px 400px at 10% 80%, rgba(232,92,58,.06), transparent 60%)" }} />
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(var(--line-2) 1px, transparent 1px), linear-gradient(90deg, var(--line-2) 1px, transparent 1px)", backgroundSize: "48px 48px", maskImage: "linear-gradient(180deg, #000 40%, transparent 100%)", WebkitMaskImage: "linear-gradient(180deg, #000 40%, transparent 100%)" }} />
        </div>
        <div style={{ position: "relative", maxWidth: 1240, margin: "0 auto", padding: "0 32px" }}>
          <nav style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>
            <Link href={`/${locale}`} style={{ color: "var(--muted)", textDecoration: "none" }}>{t(loc, "home")}</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <Link href={`/${locale}/tools`} style={{ color: "var(--muted)", textDecoration: "none" }}>{t(loc, "tools_label")}</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "var(--ink)" }}>{t(loc, "duty_calc_breadcrumb")}</span>
          </nav>
          <div style={{ maxWidth: 820, marginBottom: 44 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 12px 6px 8px", borderRadius: 999, background: "#fff", border: "1px solid var(--line)", fontSize: 12, fontWeight: 600, color: "var(--ink-2)", boxShadow: "var(--shadow-sm)" }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--good)", boxShadow: "0 0 0 3px rgba(17,138,84,.2)" }} />
              {tf(loc, "duty_hero_pill", "213 countries · free · updated weekly")}
            </div>
            <h1 style={{ margin: "22px 0 18px", fontSize: "clamp(40px,5.5vw,72px)", lineHeight: 1.02, letterSpacing: "-.03em", fontWeight: 800, color: "var(--ink)" }}>
              {tf(loc, "duty_hero_h1_pre", "Know exact duties")}<br />
              <span style={{ color: "var(--accent)" }}>{tf(loc, "duty_hero_h1_accent", "before")}</span> {tf(loc, "duty_hero_h1_post", "you ship — not after.")}
            </h1>
            <p style={{ fontSize: 19, color: "var(--body)", lineHeight: 1.55, maxWidth: 640, margin: 0 }}>
              {tf(loc, "duty_hero_desc", "Landed-cost math in seconds. Duty, VAT/GST, broker fees, de minimis thresholds — applied to your destination country and declared value, for every territory we cover.")}
            </p>
          </div>
        </div>
      </section>

      {/* === REAL CALCULATOR (existing component) === */}
      <section style={{ padding: "48px 32px 72px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <DutyCalculatorStandalone locale={locale} />
        </div>
      </section>

      {/* === FEATURES — 4 cards === */}
      <section style={{ padding: "96px 32px", background: "#fff", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ marginBottom: 40, maxWidth: 720 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--blue)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 12 }}>{tf(loc, "features_eyebrow", "What's inside")}</div>
            <h2 style={{ margin: 0, fontSize: "clamp(28px,3.2vw,40px)", fontWeight: 800, letterSpacing: "-.02em", lineHeight: 1.1, color: "var(--ink)" }}>
              {tf(loc, "features_title", "Four things the generic calculators miss.")}
            </h2>
            <p style={{ margin: "14px 0 0", fontSize: 17, color: "var(--body)", maxWidth: 620 }}>
              {tf(loc, "features_desc", "Most duty calculators online are a single-country lookup bolted to a currency converter. We cover the full landed-cost stack, for every market.")}
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }} className="tools-grid">
            {features.map((c, i) => (
              <div key={c.title} style={{ background: "var(--bg)", borderRadius: 20, border: "1px solid var(--line)", padding: 28, display: "flex", flexDirection: "column", gap: 18, boxShadow: "var(--shadow-sm)", position: "relative" }} className="team-card">
                <div style={{ position: "absolute", top: 28, right: 28, fontSize: 11, fontWeight: 800, letterSpacing: ".08em", color: "var(--muted)" }}>{String(i + 1).padStart(2, "0")}</div>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: c.tintBg, color: c.color, display: "grid", placeItems: "center" }}>{c.icon}</div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: c.color, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 6 }}>{c.tag}</div>
                  <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: "-.02em", color: "var(--ink)" }}>{c.title}</h3>
                </div>
                <p style={{ margin: 0, fontSize: 14.5, color: "var(--body)", lineHeight: 1.6 }}>{c.body}</p>
                <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px dashed var(--line)", display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 700, color: c.color }}>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                  {c.stat}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === COVERAGE MAP === */}
      <section style={{ padding: "96px 32px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }} className="two-col">
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 12 }}>{tf(loc, "coverage_eyebrow", "213 countries & territories")}</div>
              <h2 style={{ margin: 0, fontSize: "clamp(28px,3.2vw,40px)", fontWeight: 800, letterSpacing: "-.02em", lineHeight: 1.1, color: "var(--ink)" }}>
                {tf(loc, "coverage_title", "Every destination your customers actually ship to.")}
              </h2>
              <p style={{ fontSize: 17, color: "var(--body)", lineHeight: 1.55, margin: "18px 0 28px", maxWidth: 500 }}>
                {tf(loc, "coverage_desc", "Not just the G7. From Andorra to Zimbabwe — duty rates, VAT/GST, de minimis thresholds and customs formalities indexed directly from each authority's published tariff schedule.")}
              </p>

              <div style={{ background: "var(--bg)", borderRadius: 18, border: "1px solid var(--line)", padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <span style={{ fontSize: 28 }}>🇩🇪</span>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: "-.01em", color: "var(--ink)" }}>
                      {(() => { const c = countries.find((x) => x.code === "DE"); return c ? getCountryName(c, loc) : "Germany"; })()}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{tf(loc, "sample_profile", "Sample country profile · weekly update")}</div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }} className="tools-grid">
                  {[
                    [tf(loc, "duty_range", "Duty range"), "0–17%", tf(loc, "ad_valorem", "Ad valorem")],
                    [tf(loc, "vat_gst", "VAT / GST"), "19%", tf(loc, "on_dutiable_base", "On dutiable base")],
                    [tf(loc, "de_minimis", "De minimis"), "€150", tf(loc, "value_threshold", "Value threshold")],
                  ].map(([l, v, s]) => (
                    <div key={l} style={{ background: "#fff", borderRadius: 10, padding: "14px 14px", border: "1px solid var(--line-2)" }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".08em" }}>{l}</div>
                      <div style={{ fontSize: 18, fontWeight: 800, margin: "4px 0 2px", letterSpacing: "-.01em", color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>{v}</div>
                      <div style={{ fontSize: 10.5, color: "var(--muted)" }}>{s}</div>
                    </div>
                  ))}
                </div>
              </div>

              <Link href={`/${locale}/customs/united-states`} style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 24, fontSize: 14, fontWeight: 700, color: "var(--blue)", textDecoration: "none" }}>
                {tf(loc, "browse_all_profiles", "Browse all country profiles")}
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </Link>
            </div>

            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }} className="tools-grid">
                {COUNTRY_SAMPLE.map((c) => {
                  const tone = TONE_MAP[c.tone];
                  return (
                    <Link key={c.code} href={c.code === "EU" ? `/${locale}/customs/germany` : `/${locale}/customs/${c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`} style={{ textAlign: "left", padding: 14, borderRadius: 12, background: "#fff", color: "var(--ink)", border: "1px solid var(--line)", boxShadow: "var(--shadow-sm)", textDecoration: "none", display: "block" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <span style={{ fontSize: 16 }}>{c.flag}</span>
                        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".06em" }}>{c.code}</span>
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.9, marginBottom: 8, lineHeight: 1.25 }}>{c.name}</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: tone.fg, background: tone.bg, padding: "3px 6px", borderRadius: 6, display: "inline-block", fontVariantNumeric: "tabular-nums" }}>
                        {c.duty}
                      </div>
                    </Link>
                  );
                })}
                <Link href={`/${locale}/guide`} style={{ padding: 14, borderRadius: 12, background: "var(--bg)", border: "1px dashed var(--line)", display: "grid", placeItems: "center", color: "var(--muted)", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
                  +199 more
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === COMPARISON TABLE === */}
      <section style={{ padding: "96px 32px", background: "#fff", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--good)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 12 }}>{tf(loc, "comparison_eyebrow", "Side by side")}</div>
            <h2 style={{ margin: 0, fontSize: "clamp(28px,3.2vw,40px)", fontWeight: 800, letterSpacing: "-.02em", color: "var(--ink)" }}>
              {tf(loc, "comparison_title", "Built for commerce. Not for filling out a textbook exercise.")}
            </h2>
          </div>
          <div style={{ background: "var(--bg)", borderRadius: 20, border: "1px solid var(--line)", overflow: "hidden", boxShadow: "var(--shadow-md)" }} className="compare-table">
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", background: "var(--ink)", color: "#fff" }} className="compare-row compare-header">
              <div style={{ padding: "22px 24px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "rgba(255,255,255,.5)" }}>{tf(loc, "capability", "Capability")}</div>
              <div style={{ padding: "22px 20px", textAlign: "center", fontSize: 14, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <div style={{ width: 20, height: 20, borderRadius: 6, background: "linear-gradient(135deg, var(--blue), #2F88FF)", display: "grid", placeItems: "center" }}>
                  <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#fff" }}><path d="M2 20s2 1 4 1 3-1 4-1 2 1 4 1 3-1 4-1 4-1 4-1" /><path d="M4 18L3 12h18l-1 6" /><path d="M12 4v8M8 8h8" /></svg>
                </div>
                RateShips
              </div>
              <div style={{ padding: "22px 20px", textAlign: "center", fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,.6)" }}>{tf(loc, "carrier_builtins", "Carrier built-ins")}</div>
              <div style={{ padding: "22px 20px", textAlign: "center", fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,.6)" }}>{tf(loc, "generic_calculators", "Generic calculators")}</div>
            </div>
            {(() => {
              const rows: [string, boolean | string, boolean | string, boolean | string][] = [
                [tf(loc, "cmp_row_duty_vat", "Duty + VAT + broker fees"), true, "Partial", "Duty only"],
                [tf(loc, "cmp_row_213", "213 countries covered"), true, "Partial", false],
                [tf(loc, "cmp_row_dm", "De minimis threshold logic"), true, false, false],
                [tf(loc, "cmp_row_weekly", "Weekly refresh"), true, "Monthly", "Unknown"],
                [tf(loc, "cmp_row_landed", "Full landed-cost breakdown"), true, false, false],
                [tf(loc, "cmp_row_12lang", "12 languages"), true, false, "English only"],
                [tf(loc, "cmp_row_signup", "No signup required"), true, false, true],
                [tf(loc, "cmp_row_price", "Price"), tf(loc, "cmp_free", "Free"), tf(loc, "cmp_bundled", "Bundled with label"), tf(loc, "cmp_free", "Free")],
              ];
              const renderCell = (v: boolean | string, isPrimary: boolean) => {
                if (v === true) return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={isPrimary ? "var(--good)" : "var(--muted)"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>;
                if (v === false) return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--muted)" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>;
                return <span style={{ fontSize: 13, fontWeight: 700, color: isPrimary ? "var(--ink)" : "var(--muted)" }}>{v}</span>;
              };
              return rows.map(([label, a, b, c], i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", alignItems: "center", borderTop: i === 0 ? "none" : "1px solid var(--line-2)", background: i % 2 ? "transparent" : "var(--bg)" }} className="compare-row">
                  <div style={{ padding: "16px 24px", fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{label}</div>
                  <div style={{ padding: "16px 20px", textAlign: "center", background: "rgba(26,115,232,.03)", display: "flex", justifyContent: "center" }}>{renderCell(a, true)}</div>
                  <div style={{ padding: "16px 20px", textAlign: "center", display: "flex", justifyContent: "center" }}>{renderCell(b, false)}</div>
                  <div style={{ padding: "16px 20px", textAlign: "center", display: "flex", justifyContent: "center" }}>{renderCell(c, false)}</div>
                </div>
              ));
            })()}
          </div>
        </div>
      </section>

      {/* === STATS STRIP (dark) === */}
      <section style={{ padding: "64px 32px", background: "var(--ink)", color: "#fff" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 }} className="stats-grid">
            {[
              ["213", tf(loc, "stat_countries_label", "Countries covered")],
              ["12", tf(loc, "stat_langs_label", "Languages")],
              [tf(loc, "stat_weekly_v", "Weekly"), tf(loc, "stat_weekly_l", "Data refresh cadence")],
              [tf(loc, "stat_free_v", "Free"), tf(loc, "stat_free_l", "Forever · no signup")],
            ].map(([v, l]) => (
              <div key={l} style={{ padding: "12px 0" }}>
                <div style={{ fontSize: "clamp(28px,3vw,42px)", fontWeight: 800, letterSpacing: "-.02em", color: "var(--warm)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{v}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,.65)", marginTop: 10, fontWeight: 500 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === DISCLAIMER === */}
      <section style={{ padding: "48px 32px", background: "var(--warm-50)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "auto 1fr", gap: 28, alignItems: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "#fff", color: "#A37A00", display: "grid", placeItems: "center", boxShadow: "var(--shadow-sm)", flex: "0 0 56px" }}>
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#A37A00", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 6 }}>
              {tf(loc, "disclaimer_eyebrow", "Good-faith estimate — not a binding determination")}
            </div>
            <p style={{ margin: 0, fontSize: 14, color: "var(--ink-2)", lineHeight: 1.55, maxWidth: 900 }}>
              {tf(loc, "disclaimer_body", "Final duty is assessed by the destination customs authority at time of clearance and may differ based on inspection, valuation method, or origin documentation. Our numbers aim to be close to what you'll actually pay — but this is not legal or customs advice. For shipments above $25,000 or regulated goods, consult a licensed customs broker.")}
            </p>
          </div>
        </div>
      </section>

      {/* === FAQ === */}
      <section style={{ padding: "96px 32px", background: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--blue)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 12 }}>{tf(loc, "faq_eyebrow", "Questions we get weekly")}</div>
            <h2 style={{ margin: 0, fontSize: "clamp(28px,3.2vw,40px)", fontWeight: 800, letterSpacing: "-.02em", color: "var(--ink)" }}>
              {tf(loc, "faq_title", "How the math actually works.")}
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              {
                q: tf(loc, "duty_faq_1_q", "Where do your duty rates come from?"),
                a: tf(loc, "duty_faq_1_a", "Directly from each country's published tariff schedule — the US HTSUS, the EU TARIC database, the UK Integrated Online Tariff, Canada's CBSA tariff, and equivalents for all other markets. We do not scrape carrier quote engines."),
              },
              {
                q: tf(loc, "duty_faq_2_q", "How often is the data updated?"),
                a: tf(loc, "duty_faq_2_a", "Weekly. Major tariff changes (e.g. new US/EU sanctions) are pulled through out-of-band, but the normal cadence is a weekly refresh from each authority's published feed."),
              },
              {
                q: tf(loc, "duty_faq_3_q", "Does the calculator account for trade agreements?"),
                a: tf(loc, "duty_faq_3_a", "For the major agreements (USMCA, EU-UK TCA, CPTPP, Mercosur) we apply the preferential rate in the country profile where your origin qualifies. Rule-of-origin documentation is your responsibility — we do not generate certificates of origin."),
              },
              {
                q: tf(loc, "duty_faq_4_q", "What if the customs authority charges something different than your estimate?"),
                a: tf(loc, "duty_faq_4_a", "Final assessment is always the customs authority's call. Our number is a good-faith estimate based on the published tariff schedule. Differences most often come from valuation method, HS classification disputes, or unexpected regulatory findings (licensing, restricted goods). For shipments above $25,000 or regulated categories, please use a licensed broker."),
              },
              {
                q: tf(loc, "duty_faq_5_q", "Do you handle regulated goods?"),
                a: tf(loc, "duty_faq_5_a", "We flag general restrictions for lithium batteries, cosmetics, alcohol, pharmaceuticals and other regulated categories in the country profiles. Actual licensing and permits are handled outside the calculator — typically through a destination-country customs broker."),
              },
              {
                q: tf(loc, "duty_faq_6_q", "Is the calculator really free?"),
                a: tf(loc, "duty_faq_6_a", "Yes. No signup, no paywall, no rate-limit on lookups. We're a small team in Hungary (Global Supply KFT) and the calculator will stay free."),
              },
            ].map((it, i) => (
              <details key={i} style={{ background: "var(--bg)", borderRadius: 14, border: "1px solid var(--line)", padding: 0, overflow: "hidden" }}>
                <summary style={{ width: "100%", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, cursor: "pointer", listStyle: "none" }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)" }}>{it.q}</span>
                  <span style={{ width: 28, height: 28, borderRadius: 999, background: "var(--line-2)", color: "var(--muted)", display: "grid", placeItems: "center", flex: "0 0 28px" }}>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
                  </span>
                </summary>
                <div style={{ padding: "0 24px 22px", fontSize: 14.5, color: "var(--body)", lineHeight: 1.65 }}>{it.a}</div>
              </details>
            ))}
          </div>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: [
                  { "@type": "Question", name: tf(loc, "duty_faq_1_q", "Where do your duty rates come from?"), acceptedAnswer: { "@type": "Answer", text: tf(loc, "duty_faq_1_a", "Directly from each country's published tariff schedule.") } },
                  { "@type": "Question", name: tf(loc, "duty_faq_2_q", "How often is the data updated?"), acceptedAnswer: { "@type": "Answer", text: tf(loc, "duty_faq_2_a", "Weekly.") } },
                ],
              }),
            }}
          />
        </div>
      </section>

      {/* === CTA === */}
      <section style={{ padding: "96px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", borderRadius: 28, background: "var(--ink)", color: "#fff", padding: "72px 48px", position: "relative", overflow: "hidden" }}>
          <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(600px 400px at 85% 15%, rgba(26,115,232,.25), transparent 60%), radial-gradient(500px 300px at 15% 85%, rgba(232,92,58,.15), transparent 60%)" }} />
          <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)", backgroundSize: "40px 40px", maskImage: "linear-gradient(180deg, #000, transparent)", WebkitMaskImage: "linear-gradient(180deg, #000, transparent)" }} />
          <div style={{ position: "relative", maxWidth: 720 }}>
            <h2 style={{ margin: 0, fontSize: "clamp(32px,4vw,52px)", fontWeight: 800, letterSpacing: "-.025em", lineHeight: 1.05 }}>
              {tf(loc, "duty_cta_pre", "Your customers shouldn't learn about customs at their")}{" "}
              <span style={{ color: "var(--warm)" }}>{tf(loc, "duty_cta_accent", "front door.")}</span>
            </h2>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,.7)", lineHeight: 1.55, margin: "20px 0 32px", maxWidth: 520 }}>
              {tf(loc, "duty_cta_desc", "Estimate the all-in price before you ship. No sign-up. No payment. No surprise invoices when the parcel clears customs.")}
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="#" style={{ padding: "14px 22px", borderRadius: 12, background: "var(--warm)", color: "var(--ink)", fontSize: 15, fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
                {tf(loc, "duty_cta_primary", "Run another quote")}
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </a>
              <Link href={`/${locale}/guide`} style={{ padding: "14px 22px", borderRadius: 12, background: "rgba(255,255,255,.08)", color: "#fff", fontSize: 15, fontWeight: 700, border: "1px solid rgba(255,255,255,.14)", textDecoration: "none" }}>
                {tf(loc, "duty_cta_secondary", "Browse country guides")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
