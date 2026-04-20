import { Metadata } from "next";
import { countries, getPopularCountries, getCountryName, makeCorridorSlug, getCorridorData } from "@/lib/data";
import { t, locales } from "@/lib/i18n";
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
          <div style={{ display: "grid", gridTemplateColumns: "1.15fr .95fr", gap: 48, alignItems: "flex-start" }} className="hero-grid">
            {/* LEFT: copy */}
            <div style={{ paddingTop: 32 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px 6px 10px", borderRadius: 999, background: "#fff", border: "1px solid var(--line)", fontSize: 12, fontWeight: 600, color: "var(--ink-2)", boxShadow: "var(--shadow-sm)" }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: "#0F8A48", boxShadow: "0 0 0 4px rgba(15,138,72,.18)" }} />
                {t(loc, "hero_pill") || `${countries.length}+ countries · 134+ carriers · live rates`}
              </div>
              <h1 style={{ margin: "20px 0 22px", fontSize: "clamp(40px,5.4vw,68px)", lineHeight: 1.0, letterSpacing: "-.03em", fontWeight: 800, color: "var(--ink)" }}>
                {t(loc, "hero_h1_prefix") || "Compare"}{" "}
                <span style={{ color: "var(--blue)", position: "relative", display: "inline-block" }}>
                  {t(loc, "hero_h1_blue") || "134+ carriers"}
                  <svg aria-hidden viewBox="0 0 340 20" style={{ position: "absolute", left: 0, bottom: -10, width: "100%", height: 14 }}>
                    <path d="M2 12 Q 80 2, 170 10 T 338 8" stroke="var(--warm)" strokeWidth="5" fill="none" strokeLinecap="round" opacity=".85" />
                  </svg>
                </span>
                <br />
                {t(loc, "hero_h1_suffix") || "in 5 seconds."}
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
                  {t(loc, "get_free_quote") || "Get a free quote"}
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </a>
                <Link href={`/${locale}/carriers`} style={{
                  padding: "14px 22px", borderRadius: 12, background: "#fff", color: "var(--ink)",
                  fontWeight: 600, fontSize: 15, border: "1px solid var(--line)", boxShadow: "var(--shadow-sm)",
                  textDecoration: "none",
                }}>
                  {t(loc, "see_all_carriers") || "See all 134 carriers"} →
                </Link>
              </div>

              <div style={{ marginTop: 28, display: "flex", gap: 28, flexWrap: "wrap", fontSize: 13, color: "var(--muted)" }}>
                {[
                  t(loc, "check_no_signup") || "No signup",
                  t(loc, "check_published_tariffs") || "Published carrier tariffs",
                  t(loc, "check_live_rates") || "Live rates, not averages",
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
                  {t(loc, "trusted_carriers") || "Rates from 134+ global & regional carriers"}
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
            <div style={{ position: "relative" }}>
              {/* Top-right rotated container tile */}
              <div aria-hidden style={{
                position: "absolute", top: -20, right: -24, width: 220, height: 150,
                borderRadius: 16, overflow: "hidden", transform: "rotate(4deg)",
                boxShadow: "var(--shadow-lg)", border: "4px solid #fff", zIndex: 2,
                background: "linear-gradient(135deg, #1A73E8 0%, #2F88FF 50%, #0F3C8A 100%)",
                display: "grid", placeItems: "center", color: "rgba(255,255,255,.75)",
              }} className="hero-float">
                <svg viewBox="0 0 24 24" width="60" height="60" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20s2 1 4 1 3-1 4-1 2 1 4 1 3-1 4-1 4-1 4-1" /><path d="M4 18L3 12h18l-1 6" /><path d="M12 4v8M8 8h8" /></svg>
              </div>

              {/* Form card */}
              <div id="calc" style={{
                position: "relative", zIndex: 1, marginTop: 40,
                background: "#fff", border: "1px solid var(--line)", borderRadius: 20,
                padding: "22px 22px 60px",
                boxShadow: "var(--shadow-lg)",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: "var(--blue-50)", color: "var(--blue)", display: "grid", placeItems: "center" }}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{t(loc, "shipping_calculator") || "Shipping calculator"}</div>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>{t(loc, "live_rates_updated_weekly") || "Live rates · updated weekly"}</div>
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

              {/* Bottom-left rotated circular parcel tile */}
              <div aria-hidden style={{
                position: "absolute", bottom: -30, left: -40, width: 180, height: 180,
                borderRadius: "50%", overflow: "hidden", transform: "rotate(-6deg)",
                boxShadow: "var(--shadow-lg)", border: "4px solid #fff", zIndex: 2,
                background: "linear-gradient(135deg, var(--warm-50) 0%, #FBE7B8 100%)",
                display: "grid", placeItems: "center", color: "#A37A00",
              }} className="hero-float hero-float-parcel">
                <svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8l-9-5-9 5 9 5 9-5z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" /></svg>
              </div>

              {/* Floating stats badge bottom-right */}
              <div style={{
                position: "absolute", bottom: 40, right: -30, zIndex: 3,
                background: "#fff", borderRadius: 14, border: "1px solid var(--line)",
                padding: "12px 16px", boxShadow: "var(--shadow-lg)", transform: "rotate(3deg)",
                display: "flex", alignItems: "center", gap: 10,
              }} className="hero-float">
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--accent-50)", color: "var(--accent)", display: "grid", placeItems: "center" }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" /></svg>
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-.01em", lineHeight: 1, color: "var(--ink)" }}>{countries.length}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{t(loc, "countries_served") || "countries served"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular corridors — featured 4 + compact rest */}
      <section className="mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          <h2 className="text-3xl font-bold text-ink mb-8">
            {t(loc, "popular_destinations")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {popularCorridors.slice(0, 2).map(([fromCode, toCode]) => {
              const from = countries.find((c) => c.code === fromCode);
              const to = countries.find((c) => c.code === toCode);
              if (!from || !to) return null;
              const slug = makeCorridorSlug(from, to, loc);
              const data = getCorridorData(fromCode, toCode);
              const cheapest = data?.carriers.length
                ? Math.min(...data.carriers.map(c => c.rates.find(r => r.weight_kg === 1)?.price_usd ?? 999))
                : null;
              return (
                <Link
                  key={`${fromCode}-${toCode}`}
                  href={`/${locale}/shipping/${slug}`}
                  prefetch={false}
                  className="bg-white border border-line hover:bg-[#F8F5EF] rounded-2xl p-6 transition-colors"
                >
                  <p className="text-base text-body">
                    <span className="text-xl mr-1">{countryFlag(fromCode)}</span> {getCountryName(from, loc)} → {getCountryName(to, loc)} <span className="text-xl ml-1">{countryFlag(toCode)}</span>
                  </p>
                  {cheapest && cheapest < 999 && (
                    <p className="text-sm text-muted mt-2">{t(loc, "from_price")} <span className="text-ink font-medium">${cheapest}/kg</span></p>
                  )}
                </Link>
              );
            })}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {popularCorridors.slice(2).map(([fromCode, toCode]) => {
              const from = countries.find((c) => c.code === fromCode);
              const to = countries.find((c) => c.code === toCode);
              if (!from || !to) return null;
              const slug = makeCorridorSlug(from, to, loc);
              return (
                <Link
                  key={`${fromCode}-${toCode}`}
                  href={`/${locale}/shipping/${slug}`}
                  prefetch={false}
                  className="bg-white border border-line hover:bg-[#F8F5EF] rounded-xl px-3 py-3 text-sm text-body transition-colors"
                >
                  {countryFlag(fromCode)} {getCountryName(from, loc)} → {getCountryName(to, loc)}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sample prices — asymmetric: 3 featured + 5 compact */}
      <section>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <h2 className="text-2xl font-bold text-ink mb-2">
            {t(loc, "shipping_cost_examples")}
          </h2>
          <p className="text-muted mb-6 text-sm">
            {t(loc, "sample_prices_subtitle")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
            {[["US", "GB"], ["CN", "US"], ["DE", "FR"]].map(([fromCode, toCode]) => {
              const from = countries.find((c) => c.code === fromCode);
              const to = countries.find((c) => c.code === toCode);
              if (!from || !to) return null;
              const data = getCorridorData(fromCode, toCode);
              const cheapest = data?.carriers.length
                ? Math.min(...data.carriers.map(c => c.rates.find(r => r.weight_kg === 1)?.price_usd ?? 999))
                : null;
              const fastest = data?.carriers.length
                ? Math.min(...data.carriers.map(c => c.estimated_days_min))
                : null;
              const slug = makeCorridorSlug(from, to, loc);
              return (
                <Link key={`${fromCode}-${toCode}`} href={`/${locale}/shipping/${slug}`} prefetch={false}
                  className="bg-white border border-line hover:bg-[#F8F5EF] rounded-2xl p-6 transition-colors">
                  <p className="text-sm text-body mb-3">
                    {countryFlag(fromCode)} {getCountryName(from, loc)} → {getCountryName(to, loc)} {countryFlag(toCode)}
                  </p>
                  {cheapest && cheapest < 999 ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-light text-ink">${cheapest}</span>
                      <span className="text-sm text-muted">/kg</span>
                      {fastest && <span className="text-xs text-muted ml-auto">{fastest}+ {t(loc, "days_short")}</span>}
                    </div>
                  ) : (
                    <span className="text-sm text-muted">{t(loc, "compare_rates_cta")} →</span>
                  )}
                </Link>
              );
            })}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[["US", "JP"], ["GB", "AU"], ["KR", "US"], ["FR", "IT"], ["US", "CA"]].map(([fromCode, toCode]) => {
              const from = countries.find((c) => c.code === fromCode);
              const to = countries.find((c) => c.code === toCode);
              if (!from || !to) return null;
              const data = getCorridorData(fromCode, toCode);
              const cheapest = data?.carriers.length
                ? Math.min(...data.carriers.map(c => c.rates.find(r => r.weight_kg === 1)?.price_usd ?? 999))
                : null;
              const slug = makeCorridorSlug(from, to, loc);
              return (
                <Link key={`${fromCode}-${toCode}`} href={`/${locale}/shipping/${slug}`} prefetch={false}
                  className="bg-surface hover:bg-white border border-line rounded-lg px-3 py-3 transition-colors text-center">
                  <p className="text-xs text-muted">{countryFlag(fromCode)} → {countryFlag(toCode)}</p>
                  {cheapest && cheapest < 999 && (
                    <p className="text-lg font-light text-ink mt-1">${cheapest}<span className="text-xs text-muted">/kg</span></p>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tools — horizontal layout, not card grid */}
      <section>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch">
            <Link href={`/${locale}/tools/duty-calculator`}
              className="flex-1 flex items-center gap-4 bg-surface border border-line rounded-xl p-5 hover:border-accent/30 transition-colors">
              <span className="text-lg text-muted">/</span>
              <div>
                <h3 className="font-semibold text-ink text-sm">{t(loc, "duty_calculator_link")}</h3>
                <p className="text-xs text-muted mt-0.5">{t(loc, "vat_duties_cost")}</p>
              </div>
            </Link>
            <Link href={`/${locale}/tools/delivery-estimator`}
              className="flex-1 flex items-center gap-4 bg-surface border border-line rounded-xl p-5 hover:border-accent/30 transition-colors">
              <span className="text-lg text-muted">/</span>
              <div>
                <h3 className="font-semibold text-ink text-sm">{t(loc, "delivery_estimator")}</h3>
                <p className="text-xs text-muted mt-0.5">{t(loc, "delivery_weekends")}</p>
              </div>
            </Link>
            <Link href={`/${locale}/tools`}
              className="flex items-center gap-3 text-sm text-muted hover:text-ink transition-colors px-4">
              {t(loc, "all_tools_link")} →
            </Link>
          </div>
        </div>
      </section>

      {/* Ship from / Ship to — asymmetric: destinations bigger */}
      <section>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
            <div className="md:col-span-3">
              <h2 className="text-2xl font-bold text-ink mb-5">
                {t(loc, "popular_destinations")}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2">
                {popular.slice(0, 18).map((c) => (
                  <Link
                    key={c.code}
                    href={`/${locale}/shipping/to/${c.slug_en}`}
                    prefetch={false}
                    className="text-sm text-body hover:text-ink transition-colors py-1"
                  >
                    {t(loc, "ship_to", { country: getCountryName(c, loc) })}
                  </Link>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <h2 className="text-xl font-bold text-ink mb-5">
                {t(loc, "popular_origins")}
              </h2>
              <div className="grid grid-cols-1 gap-y-2">
                {popular.slice(0, 10).map((c) => (
                  <Link
                    key={c.code}
                    href={`/${locale}/shipping/from/${c.slug_en}`}
                    prefetch={false}
                    className="text-sm text-body hover:text-ink transition-colors py-1"
                  >
                    {t(loc, "ship_from", { country: getCountryName(c, loc) })}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Carriers — text flow, not centered block */}
      <section>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-sm text-muted uppercase tracking-widest mb-6">
            {t(loc, "comparing_carriers")}
          </p>
          <p className="text-body leading-loose">
            {["DHL Express", "FedEx", "UPS", "EMS", "Aramex", "SF Express", "USPS", "Royal Mail", "Japan Post", "DPD"].map((name, i) => {
              const isPrimary = ["DHL Express", "FedEx", "UPS"].includes(name);
              return (
                <span key={name}>
                  {i > 0 && <span className="mx-2 text-muted">&middot;</span>}
                  <span className={`${isPrimary ? "text-lg font-semibold" : "text-base"} opacity-60 hover:opacity-100 transition-opacity inline-block`}>
                    {name}
                  </span>
                </span>
              );
            })}
          </p>
          <Link
            href={`/${locale}/carriers`}
            className="inline-block mt-6 text-sm text-muted hover:opacity-60 transition-opacity"
          >
            {t(loc, "view_all_carriers")} →
          </Link>
        </div>
      </section>

      {/* How it works — horizontal numbered list, not 3 identical cards */}
      <section>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          <img src="/img/package-journey.svg" alt="" aria-hidden="true" className="w-full max-w-lg mx-auto mb-8 opacity-60" />
          <h2 className="text-2xl font-bold text-ink mb-10">
            {t(loc, "how_it_works")}
          </h2>
          <div className="space-y-6">
            <div className="flex gap-5 items-start">
              <span className="shrink-0 w-10 h-10 rounded-full bg-accent/10 text-accent-light flex items-center justify-center font-bold text-sm">1</span>
              <div>
                <h3 className="font-semibold text-ink">{t(loc, "choose_route")}</h3>
                <p className="text-sm text-muted mt-1">{t(loc, "choose_route_desc")}</p>
              </div>
            </div>
            <div className="flex gap-5 items-start">
              <span className="shrink-0 w-10 h-10 rounded-full bg-accent/10 text-accent-light flex items-center justify-center font-bold text-sm">2</span>
              <div>
                <h3 className="font-semibold text-ink">{t(loc, "compare_rates")}</h3>
                <p className="text-sm text-muted mt-1">{t(loc, "compare_rates_desc")}</p>
              </div>
            </div>
            <div className="flex gap-5 items-start">
              <span className="shrink-0 w-10 h-10 rounded-full bg-accent/10 text-accent-light flex items-center justify-center font-bold text-sm">3</span>
              <div>
                <h3 className="font-semibold text-ink">{t(loc, "ship_package")}</h3>
                <p className="text-sm text-muted mt-1">{t(loc, "ship_package_desc")}</p>
              </div>
            </div>
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
