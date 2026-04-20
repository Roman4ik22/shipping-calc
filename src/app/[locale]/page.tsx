import { Metadata } from "next";
import { countries, getPopularCountries, getCountryName, makeCorridorSlug, getCorridorData } from "@/lib/data";
import { t, tf, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { countryFlag } from "@/lib/flags";
import ShippingForm from "@/components/ShippingForm";
import NewsletterForm from "@/components/NewsletterForm";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  return {
    title: t(loc, "compare_shipping_rates"),
    description: t(loc, "hero_subtitle", { count: "134" }),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}`])),
        "x-default": "/en",
      },
    },
    openGraph: {
      title: t(loc, "compare_shipping_rates"),
      description: t(loc, "hero_subtitle", { count: "134" }),
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

  const popularCorridors = [
    ["US", "GB"], ["US", "DE"], ["CN", "US"], ["GB", "DE"],
    ["US", "JP"], ["US", "AU"], ["CN", "GB"], ["DE", "FR"],
    ["US", "CA"], ["CN", "JP"], ["RU", "DE"], ["US", "KR"],
    ["MY", "SG"], ["TH", "JP"], ["AE", "IN"], ["BR", "US"],
  ];

  return (
    <div>
      {/* V2 Hero — two-column asymmetric matching Claude Design */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: `
            radial-gradient(1000px 400px at 80% -10%, rgba(26,115,232,.08), transparent 60%),
            radial-gradient(800px 400px at -10% 20%, rgba(232,92,58,.05), transparent 60%),
            linear-gradient(var(--line-2) 1px, transparent 1px),
            linear-gradient(90deg, var(--line-2) 1px, transparent 1px)`,
          backgroundSize: "auto, auto, 48px 48px, 48px 48px",
          maskImage: "linear-gradient(180deg, #000 60%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(180deg, #000 60%, transparent 100%)",
        }} />
        <img src="/img/routes-map.svg" alt="" aria-hidden="true" style={{ position: "absolute", top: "8%", right: "-5%", width: "70%", height: "80%", opacity: 0.18, pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1320, margin: "0 auto", padding: "56px 32px 80px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 56, alignItems: "flex-start" }} className="hero-grid">
            {/* LEFT: copy */}
            <div style={{ paddingTop: 32 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px 6px 10px", borderRadius: 999, background: "#fff", border: "1px solid var(--line)", fontSize: 12, fontWeight: 600, color: "var(--ink-2)", boxShadow: "var(--shadow-sm)" }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: "#0F8A48", boxShadow: "0 0 0 4px rgba(15,138,72,.18)" }} />
                {tf(loc, "hero_pill", `${countries.length}+ countries · 134+ carriers · live rates`)}
              </div>
              <h1 style={{ margin: "20px 0 22px", fontSize: "clamp(40px,5.4vw,68px)", lineHeight: 1.0, letterSpacing: "-.03em", fontWeight: 800, color: "var(--ink)" }}>
                {tf(loc, "hero_h1_prefix", "Compare")}{" "}
                <span style={{ color: "var(--blue)", position: "relative", display: "inline-block" }}>
                  {tf(loc, "hero_h1_blue", "134+ carriers")}
                  <svg aria-hidden viewBox="0 0 340 20" style={{ position: "absolute", left: 0, bottom: -10, width: "100%", height: 14 }}>
                    <path d="M2 12 Q 80 2, 170 10 T 338 8" stroke="var(--warm)" strokeWidth="5" fill="none" strokeLinecap="round" opacity=".85" />
                  </svg>
                </span>
                <br />
                {tf(loc, "hero_h1_suffix", "in 5 seconds.")}
              </h1>
              <p style={{ fontSize: 19, color: "var(--body)", lineHeight: 1.5, maxWidth: 520, margin: "0 0 28px" }}>
                {t(loc, "hero_subtitle", { count: "134" })}
              </p>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a href="#calc" style={{
                  padding: "14px 22px", borderRadius: 12, background: "#1A73E8", color: "#fff",
                  fontWeight: 600, fontSize: 15, display: "inline-flex", alignItems: "center", gap: 8,
                  textDecoration: "none",
                  boxShadow: "0 10px 20px -8px rgba(26,115,232,.6), inset 0 1px 0 rgba(255,255,255,.2)",
                }}>
                  {tf(loc, "get_free_quote", "Get a free quote")}
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </a>
                <Link href={`/${locale}/carriers`} style={{
                  padding: "14px 22px", borderRadius: 12, background: "#fff", color: "var(--ink)",
                  fontWeight: 600, fontSize: 15, border: "1px solid var(--line)", boxShadow: "var(--shadow-sm)",
                  textDecoration: "none",
                }}>
                  {tf(loc, "see_all_carriers", "See all 134 carriers")} →
                </Link>
              </div>

              <div style={{ marginTop: 28, display: "flex", gap: 28, flexWrap: "wrap", fontSize: 13, color: "var(--muted)" }}>
                {[
                  tf(loc, "check_no_signup", "No signup"),
                  tf(loc, "check_published_tariffs", "Published carrier tariffs"),
                  tf(loc, "check_live_rates", "Live rates, not averages"),
                ].map((label, i) => (
                  <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#0F8A48" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                    {label}
                  </span>
                ))}
              </div>

              {/* Carrier brand strip */}
              <div style={{ marginTop: 56, paddingTop: 28, borderTop: "1px solid var(--line)" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 14 }}>
                  {tf(loc, "trusted_carriers", "Rates from 134+ global & regional carriers")}
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {[
                    { name: "DHL", bg: "#FFCC00", fg: "#D40511" },
                    { name: "FedEx", bg: "#4D148C", fg: "#FF6600" },
                    { name: "UPS", bg: "#351C15", fg: "#FFB500" },
                    { name: "EMS", bg: "#0F3C8A", fg: "#FFD400" },
                    { name: "SF", bg: "#000000", fg: "#FFFFFF" },
                    { name: "Aramex", bg: "#E32219", fg: "#FFFFFF" },
                  ].map((b) => (
                    <div key={b.name} style={{
                      padding: "10px 16px", borderRadius: 10, background: b.bg, color: b.fg,
                      fontSize: 12, fontWeight: 800, letterSpacing: ".04em",
                      boxShadow: "inset 0 0 0 1px rgba(0,0,0,.06)",
                    }}>{b.name}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: form + floating decorative elements */}
            <div style={{ position: "relative", minWidth: 0 }}>
              {/* Top-right rotated container tile — pushed further out, behind calc */}
              <div aria-hidden style={{
                position: "absolute", top: -40, right: -60, width: 180, height: 124,
                borderRadius: 16, overflow: "hidden", transform: "rotate(5deg)",
                boxShadow: "var(--shadow-lg)", border: "4px solid #fff", zIndex: 0,
                background: "linear-gradient(135deg, #1A73E8 0%, #2F88FF 50%, #0F3C8A 100%)",
                display: "grid", placeItems: "center", color: "rgba(255,255,255,.75)",
                pointerEvents: "none",
              }} className="hero-float">
                <svg viewBox="0 0 24 24" width="54" height="54" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20s2 1 4 1 3-1 4-1 2 1 4 1 3-1 4-1 4-1 4-1" /><path d="M4 18L3 12h18l-1 6" /><path d="M12 4v8M8 8h8" /></svg>
              </div>

              {/* Bottom-left rotated circular parcel tile — smaller, further out, behind calc */}
              <div aria-hidden style={{
                position: "absolute", bottom: -50, left: -70, width: 140, height: 140,
                borderRadius: "50%", overflow: "hidden", transform: "rotate(-6deg)",
                boxShadow: "var(--shadow-lg)", border: "4px solid #fff", zIndex: 0,
                background: "linear-gradient(135deg, var(--warm-50) 0%, #FBE7B8 100%)",
                display: "grid", placeItems: "center", color: "#A37A00",
                pointerEvents: "none",
              }} className="hero-float hero-float-parcel">
                <svg viewBox="0 0 24 24" width="60" height="60" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8l-9-5-9 5 9 5 9-5z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" /></svg>
              </div>

              {/* Form card — raised above decorations, overflow visible so country dropdown isn't clipped */}
              <div id="calc" style={{
                position: "relative", zIndex: 2, marginTop: 40,
                background: "#fff", border: "1px solid var(--line)", borderRadius: 20,
                padding: "28px 28px 80px",
                boxShadow: "var(--shadow-lg)",
                overflow: "visible",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: "var(--blue-50)", color: "var(--blue)", display: "grid", placeItems: "center" }}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{tf(loc, "shipping_calculator", "Shipping calculator")}</div>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>{tf(loc, "live_rates_updated_weekly", "Live rates · updated weekly")}</div>
                    </div>
                  </div>
                  <span style={{ padding: "4px 10px", fontSize: 11, fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", background: "rgba(15,138,72,.12)", color: "#0F8A48", borderRadius: 999 }}>LIVE</span>
                </div>

                <ShippingForm
                  countries={countries.map((c) => ({
                    code: c.code,
                    name: getCountryName(c, loc),
                    slug: loc === "ru" ? c.slug_ru : c.slug_en,
                    slug_en: c.slug_en,
                    slug_ru: c.slug_ru,
                    continent: c.continent,
                  }))}
                  locale={loc}
                  corridorSep={loc === "ru" ? "-v-" : "-to-"}
                  labels={{
                    from: t(loc, "from"),
                    to: t(loc, "to"),
                    submit: t(loc, "get_rates"),
                    swap: t(loc, "swap_countries"),
                  }}
                />
              </div>

              {/* Floating stats badge bottom-right — below calc, won't overlap inputs */}
              <div style={{
                position: "absolute", bottom: -30, right: -20, zIndex: 3,
                background: "#fff", borderRadius: 14, border: "1px solid var(--line)",
                padding: "12px 16px", boxShadow: "var(--shadow-lg)", transform: "rotate(3deg)",
                display: "flex", alignItems: "center", gap: 10,
                pointerEvents: "none",
              }} className="hero-float">
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--accent-50)", color: "var(--accent)", display: "grid", placeItems: "center" }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" /></svg>
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-.01em", lineHeight: 1, color: "var(--ink)" }}>{countries.length}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{tf(loc, "countries_served", "countries served")}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === LIVE RATES TABLE (Claude Design ResultsTable) === */}
      <section style={{ padding: "72px 32px", borderTop: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ marginBottom: 36, maxWidth: 720 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--blue)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 12 }}>
              {tf(loc, "live_rates_eyebrow", "Live rates")}
            </div>
            <h2 style={{ margin: 0, fontSize: "clamp(28px,3.2vw,40px)", fontWeight: 800, letterSpacing: "-.02em", lineHeight: 1.1, color: "var(--ink)" }}>
              {tf(loc, "live_rates_title", "Real carrier tariffs for the top corridors.")}
            </h2>
            <p style={{ margin: "14px 0 0", fontSize: 17, color: "var(--body)", maxWidth: 620 }}>
              {tf(loc, "live_rates_desc", "No signup, no tricks. Published carrier tariffs, updated weekly.")}
            </p>
          </div>

          {(() => {
            const data = getCorridorData("US", "GB");
            const sampleCarriers = (data?.carriers ?? []).slice(0, 6);
            const cheapestPrice = sampleCarriers.length
              ? Math.min(...sampleCarriers.map(c => c.rates.find(r => r.weight_kg === 2)?.price_usd ?? 999))
              : null;
            const brandMap: Record<string, { bg: string; fg: string; letters: string }> = {
              "DHL Express": { bg: "#FFCC00", fg: "#D40511", letters: "DHL" },
              "DHL eCommerce": { bg: "#FFCC00", fg: "#D40511", letters: "DHL" },
              "FedEx": { bg: "#4D148C", fg: "#FF6600", letters: "FDX" },
              "FedEx Express": { bg: "#4D148C", fg: "#FF6600", letters: "FDX" },
              "UPS": { bg: "#351C15", fg: "#FFB500", letters: "UPS" },
              "SF Express": { bg: "#000000", fg: "#FFFFFF", letters: "SF" },
              "Aramex": { bg: "#E32219", fg: "#FFFFFF", letters: "ARX" },
              "EMS": { bg: "#0F3C8A", fg: "#FFD400", letters: "EMS" },
              "USPS": { bg: "#004B87", fg: "#FFFFFF", letters: "USPS" },
              "Royal Mail": { bg: "#E7131A", fg: "#FFFFFF", letters: "RM" },
              "DPD": { bg: "#DC0032", fg: "#FFFFFF", letters: "DPD" },
              "TNT": { bg: "#FF6600", fg: "#FFFFFF", letters: "TNT" },
            };

            return (
              <>
                {/* Route bar */}
                <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", background: "#fff", border: "1px solid var(--line)", borderRadius: 16, boxShadow: "var(--shadow-sm)", marginBottom: 14, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 20 }}>{countryFlag("US")}</span>
                    <span style={{ fontWeight: 700, color: "var(--ink)" }}>United States</span>
                  </div>
                  <div style={{ flex: "0 0 60px", height: 1, background: "var(--line)", position: "relative" }}>
                    <svg viewBox="0 0 24 24" width="14" height="14" style={{ position: "absolute", left: "50%", top: -7, transform: "translateX(-50%) rotate(90deg)", color: "var(--blue)" }} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 12l18-7-7 18-2.5-7.5L3 12z" />
                    </svg>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 20 }}>{countryFlag("GB")}</span>
                    <span style={{ fontWeight: 700, color: "var(--ink)" }}>United Kingdom</span>
                  </div>
                  <div style={{ width: 1, height: 22, background: "var(--line)" }} />
                  <div style={{ fontSize: 13, color: "var(--muted)" }}>Package · <b style={{ color: "var(--ink)" }}>2.0 kg</b></div>
                  <Link href={`/${locale}/shipping/united-states-to-united-kingdom`} style={{ marginLeft: "auto", fontSize: 13, fontWeight: 600, color: "var(--blue)", textDecoration: "none" }}>
                    {tf(loc, "see_full_comparison", "See full comparison")} →
                  </Link>
                </div>

                {/* Table */}
                <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 16, overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
                  <div className="row-grid" style={{ display: "grid", gridTemplateColumns: "2.4fr 1.4fr 1fr 1.2fr 1fr", padding: "14px 20px", fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".06em", background: "var(--bg)", borderBottom: "1px solid var(--line)" }}>
                    <div>{tf(loc, "carrier", "Carrier")}</div>
                    <div>{tf(loc, "service", "Service")}</div>
                    <div>{tf(loc, "transit", "Transit")}</div>
                    <div>{tf(loc, "tracking", "Tracking")}</div>
                    <div style={{ textAlign: "right" }}>{tf(loc, "rate", "Rate")}</div>
                  </div>
                  {sampleCarriers.map((c, i) => {
                    const rate2kg = c.rates.find(r => r.weight_kg === 2)?.price_usd ?? null;
                    const isCheapest = rate2kg === cheapestPrice;
                    const carrierName = c.carrier.name;
                    const brand = brandMap[carrierName] || { bg: "#6B7280", fg: "#FFFFFF", letters: carrierName.slice(0, 3).toUpperCase() };
                    const hasTracking = c.service.tracking;
                    return (
                      <div key={`${c.carrier.id}-${c.service.id}`} className="row-grid" style={{ display: "grid", gridTemplateColumns: "2.4fr 1.4fr 1fr 1.2fr 1fr", padding: "16px 20px", alignItems: "center", borderBottom: i === sampleCarriers.length - 1 ? "none" : "1px solid var(--line-2)", background: isCheapest ? "linear-gradient(90deg, rgba(232,92,58,.04) 0%, transparent 60%)" : "transparent" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 8, background: brand.bg, color: brand.fg, display: "grid", placeItems: "center", fontSize: 11, fontWeight: 800, letterSpacing: ".02em", boxShadow: "inset 0 0 0 1px rgba(0,0,0,.06)", flex: "0 0 36px" }}>
                            {brand.letters}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                              {carrierName}
                              {isCheapest && <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", padding: "3px 7px", borderRadius: 4, background: "var(--accent-50)", color: "var(--accent)" }}>{tf(loc, "cheapest", "Cheapest")}</span>}
                            </div>
                            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{tf(loc, "published_tariff", "Published tariff")}</div>
                          </div>
                        </div>
                        <div style={{ fontSize: 14, color: "var(--body)" }}>{c.service.name || "Standard"}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--muted)" }}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                          <span style={{ fontVariantNumeric: "tabular-nums" }}>{c.estimated_days_min}–{c.estimated_days_max}d</span>
                        </div>
                        <div style={{ fontSize: 13, color: "var(--body)", display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ width: 6, height: 6, borderRadius: 999, background: hasTracking ? "var(--good)" : "var(--warm)" }} />
                          {hasTracking ? (tf(loc, "tracked", "Tracked")) : (tf(loc, "scan_based", "Scan-based"))}
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: "-.01em", color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>
                            {rate2kg ? `$${rate2kg.toFixed(2)}` : "—"}
                          </div>
                          <div style={{ fontSize: 11, color: "var(--muted)" }}>{tf(loc, "for_2kg", "for 2 kg")}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ marginTop: 14, fontSize: 13, color: "var(--muted)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                  <span>
                    {tf(loc, "showing_carriers", "Showing")} {sampleCarriers.length} {tf(loc, "of", "of")} {data?.carriers.length ?? 0} {tf(loc, "carriers_for_route", "carriers for this route")} ·{" "}
                    <Link href={`/${locale}/carriers`} style={{ color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>{tf(loc, "see_all_134", "See all 134 →")}</Link>
                  </span>
                  <span>
                    {tf(loc, "rates_from_tariffs", "Rates from published carrier tariffs")} ·{" "}
                    <Link href={`/${locale}/data-methodology`} style={{ color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>{tf(loc, "data_methodology", "Methodology")}</Link>
                  </span>
                </div>
              </>
            );
          })()}
        </div>
      </section>

      {/* === TOOLS (3 cards) === */}
      <section style={{ padding: "72px 32px", background: "#fff", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ marginBottom: 36, maxWidth: 720 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--blue)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 12 }}>{tf(loc, "tools_eyebrow", "Tools")}</div>
            <h2 style={{ margin: 0, fontSize: "clamp(28px,3.2vw,40px)", fontWeight: 800, letterSpacing: "-.02em", lineHeight: 1.1, color: "var(--ink)" }}>
              {tf(loc, "tools_homepage_title", "More than a rate comparator.")}
            </h2>
            <p style={{ margin: "14px 0 0", fontSize: 17, color: "var(--body)", maxWidth: 620 }}>
              {tf(loc, "tools_homepage_desc", "Three focused tools for the rest of your shipping workflow.")}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="tools-grid">
            {/* Rate comparison card */}
            <Link href={`/${locale}/carriers`} style={{ background: "var(--bg)", borderRadius: 20, border: "1px solid var(--line)", padding: 24, display: "flex", flexDirection: "column", gap: 18, boxShadow: "var(--shadow-sm)", textDecoration: "none", color: "inherit" }} className="team-card">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--blue-50)", color: "var(--blue)", display: "grid", placeItems: "center" }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".08em" }}>{tf(loc, "rate_comparison_tag", "Rate comparison")}</span>
              </div>
              <div>
                <h3 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 700, letterSpacing: "-.015em", color: "var(--ink)" }}>{tf(loc, "carriers_title", "Compare 134 carriers")}</h3>
                <p style={{ margin: 0, fontSize: 14, color: "var(--body)" }}>{tf(loc, "carriers_card_desc", "Full carrier directory. Global express, national posts, regional couriers — all with rates and reliability.")}</p>
              </div>
              <div style={{ background: "#fff", borderRadius: 14, border: "1px solid var(--line)", padding: 14, flex: 1, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {[
                  { bg: "#FFCC00", fg: "#D40511", t: "DHL" },
                  { bg: "#4D148C", fg: "#FF6600", t: "FDX" },
                  { bg: "#351C15", fg: "#FFB500", t: "UPS" },
                  { bg: "#000", fg: "#fff", t: "SF" },
                  { bg: "#E32219", fg: "#fff", t: "ARX" },
                  { bg: "#0F3C8A", fg: "#FFD400", t: "EMS" },
                ].map((b) => (
                  <div key={b.t} style={{ aspectRatio: "1 / 1", borderRadius: 8, background: b.bg, color: b.fg, display: "grid", placeItems: "center", fontSize: 11, fontWeight: 800, letterSpacing: ".02em" }}>{b.t}</div>
                ))}
              </div>
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", display: "inline-flex", alignItems: "center", gap: 6 }}>
                {tf(loc, "browse_carriers", "Browse all carriers")} <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </span>
            </Link>

            {/* Customs Calculator card */}
            <Link href={`/${locale}/tools/duty-calculator`} style={{ background: "var(--bg)", borderRadius: 20, border: "1px solid var(--line)", padding: 24, display: "flex", flexDirection: "column", gap: 18, boxShadow: "var(--shadow-sm)", textDecoration: "none", color: "inherit" }} className="team-card">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--accent-50)", color: "var(--accent)", display: "grid", placeItems: "center" }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l8 3v7c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V5l8-3z" /><path d="M9 12l2 2 4-4" /></svg>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".08em" }}>{tf(loc, "customs_tag", "Customs calculator")}</span>
              </div>
              <div>
                <h3 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 700, letterSpacing: "-.015em", color: "var(--ink)" }}>{tf(loc, "customs_home_title", "Duty & tax, before you ship")}</h3>
                <p style={{ margin: 0, fontSize: 14, color: "var(--body)" }}>{tf(loc, "customs_home_desc", "HS-code lookup across 213 countries, VAT/duty and broker fees broken down.")}</p>
              </div>
              <div style={{ background: "#fff", borderRadius: 14, border: "1px solid var(--line)", padding: 14, flex: 1 }}>
                <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>Electronics · HS 8517.13 · US → Germany · $1,200</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
                  {[
                    ["Declared value", "$1,200.00"],
                    ["Import duty (0%)", "$0.00"],
                    ["German VAT (19%)", "$228.00"],
                    ["Broker handling", "$14.50"],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                      <span style={{ color: "var(--body)" }}>{k}</span>
                      <span style={{ fontWeight: 600, color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ height: 1, background: "var(--line)", margin: "6px 0" }} />
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: 700, color: "var(--ink)" }}>Landed cost</span>
                    <span style={{ fontWeight: 800, fontSize: 16, color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>$1,442.50</span>
                  </div>
                </div>
              </div>
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", display: "inline-flex", alignItems: "center", gap: 6 }}>
                {tf(loc, "calculate_duties", "Calculate duties")} <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </span>
            </Link>

            {/* Delivery Estimator card */}
            <Link href={`/${locale}/tools/delivery-estimator`} style={{ background: "var(--bg)", borderRadius: 20, border: "1px solid var(--line)", padding: 24, display: "flex", flexDirection: "column", gap: 18, boxShadow: "var(--shadow-sm)", textDecoration: "none", color: "inherit" }} className="team-card">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--warm-50)", color: "#A37A00", display: "grid", placeItems: "center" }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".08em" }}>{tf(loc, "delivery_tag", "Delivery estimator")}</span>
              </div>
              <div>
                <h3 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 700, letterSpacing: "-.015em", color: "var(--ink)" }}>{tf(loc, "delivery_home_title", "When will it actually arrive?")}</h3>
                <p style={{ margin: 0, fontSize: 14, color: "var(--body)" }}>{tf(loc, "delivery_home_desc", "Express, standard, economy transit times based on carrier transit data.")}</p>
              </div>
              <div style={{ background: "#fff", borderRadius: 14, border: "1px solid var(--line)", padding: 14, flex: 1 }}>
                <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10 }}>DHL Express · NYC → London</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 90 }}>
                  {[
                    { d: "Mon", pct: 0 },
                    { d: "Tue", pct: 18 },
                    { d: "Wed", pct: 62, label: true },
                    { d: "Thu", pct: 18 },
                    { d: "Fri", pct: 2 },
                  ].map((d) => (
                    <div key={d.d} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                      <div style={{ width: "100%", height: Math.max(d.pct * 1.1, 3), background: d.pct > 50 ? "var(--blue)" : d.pct > 10 ? "var(--blue-100)" : "var(--line)", borderRadius: "4px 4px 2px 2px", position: "relative" }}>
                        {d.label && <div style={{ position: "absolute", top: -20, left: "50%", transform: "translateX(-50%)", fontSize: 10, fontWeight: 700, color: "var(--blue)", whiteSpace: "nowrap" }}>{d.pct}%</div>}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600 }}>{d.d}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 12, padding: "8px 10px", background: "var(--blue-50)", borderRadius: 8, fontSize: 12, color: "var(--blue-700, #1558B8)", fontWeight: 600 }}>
                  {tf(loc, "avg_transit", "Most likely delivery · Wed")}
                </div>
              </div>
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", display: "inline-flex", alignItems: "center", gap: 6 }}>
                {tf(loc, "estimate_delivery", "Estimate delivery")} <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* === STATS BAR (dark) — real numbers only === */}
      <section style={{ padding: "48px 32px", background: "var(--ink, #0F172A)", color: "#fff" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 48 }} className="stats-grid">
          {[
            { v: "134+", l: tf(loc, "stat_carriers_label", "Carriers compared"), s: tf(loc, "stat_carriers_sub", "Global + regional") },
            { v: `${countries.length}`, l: tf(loc, "stat_countries_label", "Countries covered"), s: tf(loc, "stat_countries_sub", "Every UN-recognized territory") },
            { v: "45K+", l: tf(loc, "stat_routes_label", "Shipping corridors"), s: tf(loc, "stat_routes_sub", "Live rates cached + on-demand"), accent: true },
            { v: "12", l: tf(loc, "stat_langs_label", "Languages"), s: tf(loc, "stat_langs_sub", "Updated weekly · free forever") },
          ].map((it, i) => (
            <div key={i} style={{ paddingLeft: i > 0 ? 28 : 0, borderLeft: i > 0 ? "1px solid rgba(255,255,255,.12)" : "none" }}>
              <div style={{ fontSize: "clamp(36px,4vw,56px)", fontWeight: 800, letterSpacing: "-.03em", lineHeight: 1, color: it.accent ? "var(--warm)" : "#fff", fontVariantNumeric: "tabular-nums" }}>{it.v}</div>
              <div style={{ marginTop: 10, fontWeight: 600, fontSize: 15 }}>{it.l}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,.55)", marginTop: 4 }}>{it.s}</div>
            </div>
          ))}
        </div>
      </section>

      {/* === HOW IT WORKS === */}
      <section style={{ padding: "80px 32px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ marginBottom: 36, maxWidth: 720 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--blue)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 12 }}>{tf(loc, "how_eyebrow", "How it works")}</div>
            <h2 style={{ margin: 0, fontSize: "clamp(28px,3.2vw,40px)", fontWeight: 800, letterSpacing: "-.02em", lineHeight: 1.1, color: "var(--ink)" }}>
              {tf(loc, "how_title", "Four steps. Under two minutes.")}
            </h2>
            <p style={{ margin: "14px 0 0", fontSize: 17, color: "var(--body)", maxWidth: 620 }}>
              {tf(loc, "how_desc", "Search, compare, pick, ship. No signup between you and a cheaper rate.")}
            </p>
          </div>
          <div style={{ position: "relative" }}>
            <div aria-hidden className="steps-line" style={{ position: "absolute", top: 26, left: "6%", right: "6%", height: 2, background: "repeating-linear-gradient(90deg, var(--line) 0 6px, transparent 6px 12px)" }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, position: "relative" }} className="steps-grid">
              {[
                { n: 1, icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>, t: tf(loc, "step1_title", "Tell us where"), d: tf(loc, "step1_desc", "From, to, weight. Three fields, no sign-up.") },
                { n: 2, icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>, t: tf(loc, "step2_title", "We compare every carrier"), d: tf(loc, "step2_desc", "134 tariffs across 213 countries, ranked in seconds.") },
                { n: 3, icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41L13 21a2 2 0 01-2.83 0l-7-7A2 2 0 012.59 13V4a2 2 0 012-2h9a2 2 0 011.41.59l7 7a2 2 0 010 2.83z" /><circle cx="7" cy="7" r="1.2" /></svg>, t: tf(loc, "step3_title", "Pick your rate"), d: tf(loc, "step3_desc", "Sort by cheapest, fastest, best-rated. Transit and reliability are visible.") },
                { n: 4, icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20s2 1 4 1 3-1 4-1 2 1 4 1 3-1 4-1 4-1 4-1" /><path d="M4 18L3 12h18l-1 6" /><path d="M12 4v8M8 8h8" /></svg>, t: tf(loc, "step4_title", "Go direct to the carrier"), d: tf(loc, "step4_desc", "We don't upsell or book for you — you go straight to the carrier's website with the full price.") },
              ].map((s) => (
                <div key={s.n} style={{ textAlign: "left" }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: "#fff", border: "1px solid var(--line)", display: "grid", placeItems: "center", color: "var(--blue)", boxShadow: "var(--shadow-sm)", position: "relative" }}>
                    {s.icon}
                    <div style={{ position: "absolute", top: -8, right: -8, width: 22, height: 22, borderRadius: 999, background: "var(--ink)", color: "#fff", fontSize: 11, fontWeight: 700, display: "grid", placeItems: "center" }}>{s.n}</div>
                  </div>
                  <h4 style={{ margin: "18px 0 6px", fontSize: 18, fontWeight: 700, letterSpacing: "-.01em", color: "var(--ink)" }}>{s.t}</h4>
                  <p style={{ margin: 0, fontSize: 14, color: "var(--body)", lineHeight: 1.55 }}>{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* === COMPARISON === */}
      <section style={{ padding: "80px 32px", borderTop: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ marginBottom: 36, maxWidth: 720 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--blue)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 12 }}>{tf(loc, "why_eyebrow", "Why RateShips")}</div>
            <h2 style={{ margin: 0, fontSize: "clamp(28px,3.2vw,40px)", fontWeight: 800, letterSpacing: "-.02em", lineHeight: 1.1, color: "var(--ink)" }}>
              {tf(loc, "why_title", "The old way vs. RateShips.")}
            </h2>
            <p style={{ margin: "14px 0 0", fontSize: 17, color: "var(--body)", maxWidth: 620 }}>{tf(loc, "why_desc", "Side by side. No hand-waving.")}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="compare-grid">
            <div style={{ background: "#fff", borderRadius: 20, border: "1px solid var(--line)", padding: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: "#F3EDE4", color: "#7A6A55", display: "grid", placeItems: "center" }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".06em" }}>{tf(loc, "before", "Before")}</div>
                  <div style={{ fontWeight: 700, fontSize: 18, color: "var(--ink)" }}>{tf(loc, "the_old_way", "The old way")}</div>
                </div>
              </div>
              {[
                tf(loc, "old_way_1", "5–8 carrier websites, each with its own interface"),
                tf(loc, "old_way_2", "Tariffs hidden behind quote forms or account logins"),
                tf(loc, "old_way_3", "No view of customs duty or total landed cost"),
                tf(loc, "old_way_4", "Only the biggest names are visible — you miss cheaper options"),
                tf(loc, "old_way_5", "No easy way to see which routes a regional carrier even covers"),
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "12px 0", borderTop: i > 0 ? "1px solid var(--line-2)" : "none", fontSize: 14, color: "#6A6157" }}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#B8ADA0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "0 0 16px", marginTop: 3 }}><path d="M18 6L6 18M6 6l12 12" /></svg>
                  <span>{r}</span>
                </div>
              ))}
            </div>
            <div style={{ background: "linear-gradient(180deg, #F4F8FE 0%, #fff 100%)", borderRadius: 20, border: "1px solid var(--blue-100, #D2E3FC)", padding: 28, boxShadow: "0 20px 40px -20px rgba(26,115,232,.2)", position: "relative" }}>
              <div style={{ position: "absolute", top: 20, right: 20, padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: "var(--blue)", color: "#fff", letterSpacing: ".04em" }}>RATESHIPS</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: "var(--blue)", color: "#fff", display: "grid", placeItems: "center" }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--blue)", textTransform: "uppercase", letterSpacing: ".06em" }}>{tf(loc, "after", "After")}</div>
                  <div style={{ fontWeight: 700, fontSize: 18, color: "var(--ink)" }}>{tf(loc, "with_rateships", "With RateShips")}</div>
                </div>
              </div>
              {[
                tf(loc, "new_way_1", "One search. 134 carriers ranked instantly by price and speed."),
                tf(loc, "new_way_2", "All tariffs published openly — no signup, no email wall."),
                tf(loc, "new_way_3", "Customs duty + VAT + broker fees calculated before you ship."),
                tf(loc, "new_way_4", "Regional postal services surfaced alongside global express."),
                tf(loc, "new_way_5", "213 countries mapped. Click any flag, see every route."),
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "12px 0", borderTop: i > 0 ? "1px solid var(--blue-100, #D2E3FC)" : "none", fontSize: 14, color: "var(--ink-2)" }}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--blue)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "0 0 16px", marginTop: 3 }}><path d="M20 6L9 17l-5-5" /></svg>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* === POPULAR CORRIDORS (compact, kept from real data) === */}
      <section style={{ padding: "72px 32px", background: "#fff", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--blue)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 10 }}>{tf(loc, "popular_corridors_eyebrow", "Popular corridors")}</div>
              <h2 style={{ margin: 0, fontSize: "clamp(28px,3.2vw,40px)", fontWeight: 800, letterSpacing: "-.02em", lineHeight: 1.1, color: "var(--ink)" }}>{t(loc, "popular_destinations")}</h2>
            </div>
            <Link href={`/${locale}/guide`} style={{ fontSize: 14, fontWeight: 600, color: "var(--blue)", textDecoration: "none" }}>{t(loc, "all_countries_link")} →</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }} className="routes-grid">
            {popularCorridors.slice(0, 8).map(([fromCode, toCode]) => {
              const from = countries.find((c) => c.code === fromCode);
              const to = countries.find((c) => c.code === toCode);
              if (!from || !to) return null;
              const slug = makeCorridorSlug(from, to, loc);
              const data = getCorridorData(fromCode, toCode);
              const cheapest = data?.carriers.length
                ? Math.min(...data.carriers.map(c => c.rates.find(r => r.weight_kg === 1)?.price_usd ?? 999))
                : null;
              const fastest = data?.carriers.length
                ? Math.min(...data.carriers.map(c => c.estimated_days_min))
                : null;
              const topCarrier = data?.carriers[0]?.carrier.name ?? null;
              return (
                <Link key={`${fromCode}-${toCode}`} href={`/${locale}/shipping/${slug}`} prefetch={false} style={{ display: "block", padding: 18, background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 14, textDecoration: "none", color: "inherit", transition: "transform .2s, box-shadow .2s, border-color .2s" }} className="route-card">
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <span style={{ fontSize: 18 }}>{countryFlag(fromCode)}</span>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--muted)" }}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                    <span style={{ fontSize: 18 }}>{countryFlag(toCode)}</span>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", letterSpacing: "-.01em" }}>{getCountryName(from, loc)} → {getCountryName(to, loc)}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 10 }}>
                    <span style={{ fontSize: 11, color: "var(--muted)" }}>{tf(loc, "from_price", "From")}</span>
                    <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-.02em", color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>
                      {cheapest && cheapest < 999 ? `$${cheapest.toFixed(2)}` : "—"}
                    </span>
                  </div>
                  <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--line-2)", display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--muted)" }}>
                    <span>{fastest ? `${fastest}+ ${tf(loc, "days_short", "days")}` : "—"}</span>
                    {topCarrier && <span style={{ fontWeight: 600, color: "var(--ink-2)" }}>{topCarrier}</span>}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* HowTo JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: t(loc, "how_it_works"),
            step: [
              {
                "@type": "HowToStep",
                position: 1,
                name: t(loc, "choose_route"),
                text: t(loc, "choose_route_desc"),
              },
              {
                "@type": "HowToStep",
                position: 2,
                name: t(loc, "compare_rates"),
                text: t(loc, "compare_rates_desc"),
              },
              {
                "@type": "HowToStep",
                position: 3,
                name: t(loc, "ship_package"),
                text: t(loc, "ship_package_desc"),
              },
            ],
          }),
        }}
      />

      {/* All countries */}
      <section>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
          <h2 className="text-xl font-bold text-ink mb-6">
            {t(loc, "all_countries")}
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-y-1 gap-x-4">
            {countries.slice(0, 50).map((c) => (
              <Link
                key={c.code}
                href={`/${locale}/shipping/from/${c.slug_en}`}
                prefetch={false}
                className="text-xs text-muted hover:text-body transition-colors py-0.5 truncate"
              >
                {countryFlag(c.code)} {getCountryName(c, loc)}
              </Link>
            ))}
          </div>
          <Link
            href={`/${locale}/guide`}
            className="inline-block mt-4 text-sm text-muted hover:text-ink transition-colors"
          >
            {t(loc, "all_countries_link")} →
          </Link>
        </div>
      </section>

      {/* Popular guides */}
      <section>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
          <h2 className="text-2xl font-bold text-ink mb-6">
            {t(loc, "popular_guides")}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-2 gap-x-4">
            {popular.slice(0, 12).map((c) => (
              <Link
                key={c.code}
                href={`/${locale}/guide/${c.slug_en}`}
                prefetch={false}
                className="text-body hover:opacity-60 transition-all text-sm py-1"
              >
                <span className="inline-block hover:scale-110 transition-transform text-base">{countryFlag(c.code)}</span> {getCountryName(c, loc)}
              </Link>
            ))}
          </div>
          <Link
            href={`/${locale}/guide`}
            className="inline-block mt-8 text-sm text-muted hover:opacity-60 transition-opacity"
          >
            {t(loc, "all_guides")} →
          </Link>
        </div>
      </section>

      {/* === FINAL CTA === */}
      <section style={{ padding: "96px 32px", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(800px 400px at 20% 30%, rgba(26,115,232,.14), transparent 60%), radial-gradient(800px 400px at 80% 70%, rgba(232,92,58,.08), transparent 60%)" }} />
        <div style={{ position: "relative", maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 999, background: "var(--blue-50)", color: "var(--blue)", fontSize: 12, fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase" }}>
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" /></svg>
            {tf(loc, "cta_eyebrow", "Free · no signup · weekly updates")}
          </div>
          <h2 style={{ margin: "20px 0 18px", fontSize: "clamp(36px,5vw,60px)", lineHeight: 1.04, letterSpacing: "-.025em", fontWeight: 800, color: "var(--ink)" }}>
            {tf(loc, "cta_title_pre", "Your next shipment")}<br />
            {tf(loc, "cta_title_mid", "could be")} <span style={{ color: "var(--blue)" }}>{tf(loc, "cta_title_blue", "cheaper.")}</span>
          </h2>
          <p style={{ fontSize: 18, color: "var(--body)", margin: "0 auto 28px", maxWidth: 580 }}>
            {tf(loc, "cta_desc", "One search shows you every carrier's published rate. If a regional service is cheaper than DHL on your lane, you'll see it.")}
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#calc" style={{ padding: "14px 24px", borderRadius: 12, background: "var(--ink)", color: "#fff", fontWeight: 700, fontSize: 15, display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
              {tf(loc, "cta_primary", "Run a free quote")}
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </a>
            <Link href={`/${locale}/carriers`} style={{ padding: "14px 24px", borderRadius: 12, background: "#fff", color: "var(--ink)", fontWeight: 600, fontSize: 15, border: "1px solid var(--line)", textDecoration: "none" }}>
              {tf(loc, "cta_secondary", "Browse all carriers")}
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center">
          <h2 className="text-2xl font-bold text-ink mb-3">
            {t(loc, "newsletter_title")}
          </h2>
          <p className="text-muted mb-8 text-sm">
            {t(loc, "newsletter_subtitle")}
          </p>
          <NewsletterForm
            locale={locale}
            labels={{
              thanks: t(loc, "newsletter_thanks"),
              placeholder: t(loc, "newsletter_placeholder"),
              subscribe: t(loc, "newsletter_subscribe"),
            }}
          />
          <p className="text-xs text-muted mt-4">
            {t(loc, "newsletter_privacy")}
          </p>
        </div>
      </section>

      {/* FAQ */}
      {(() => {
        const faqs = [
          { q: t(loc, "home_faq_1_q"), a: t(loc, "home_faq_1_a") },
          { q: t(loc, "home_faq_2_q"), a: t(loc, "home_faq_2_a") },
          { q: t(loc, "home_faq_3_q"), a: t(loc, "home_faq_3_a") },
          { q: t(loc, "home_faq_4_q"), a: t(loc, "home_faq_4_a") },
          { q: t(loc, "home_faq_5_q"), a: t(loc, "home_faq_5_a") },
        ];

        return (
          <section>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
              <h2 className="text-3xl font-bold text-ink mb-10">
                {t(loc, "faq_title")}
              </h2>
              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <details key={i} className="bg-white border border-line rounded-2xl group">
                    <summary className="py-5 px-6 font-medium text-body cursor-pointer hover:text-ink transition-colors">
                      {faq.q}
                    </summary>
                    <p className="pb-6 px-6 text-muted text-sm leading-relaxed">
                      {faq.a}
                    </p>
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
            </div>
          </section>
        );
      })()}
    </div>
  );
}
