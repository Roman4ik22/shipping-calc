import { Metadata } from "next";
import { t, tf, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { HeroH1, FloatingShape } from "@/components/HeroMotion";
import { AboutIllustration } from "@/components/PageIllustrations";
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
    title: t(loc, "about_title"),
    description: t(loc, "about_desc"),
    alternates: {
      canonical: `/${locale}/about`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}/about`])),
        "x-default": "/en/about",
      },
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;

  const team = [
    {
      name: "Dmytro Kolosovskiy",
      role: loc === "ru" ? "Менеджер проекта" : "Project Manager",
      bio: loc === "ru"
        ? "Ведёт проект от идеи до запуска. Координирует разработку, сбор данных и интеграции с перевозчиками."
        : "Manages the project from vision to execution. Coordinates development, data collection, and carrier integrations.",
      bg: "var(--blue-50)",
      seed: "Dmytro-PM-2026",
      loc: "Hungary",
    },
    {
      name: "Roman Kolosovskiy",
      role: loc === "ru" ? "Руководитель инженерии" : "Head of Engineering",
      bio: loc === "ru"
        ? "Отвечает за инженерию и разработку. Построил движок агрегации тарифов, калькулятор таможни и оценщик доставки с нуля."
        : "Leads all engineering and development. Built the rate aggregation engine, customs calculator, and delivery estimator from the ground up.",
      bg: "var(--accent-50)",
      seed: "Roman-Engineer-Dev",
      loc: "Hungary",
    },
    {
      name: "Zhenya Yakovenko",
      role: loc === "ru" ? "Руководитель маркетинга" : "Marketing Lead",
      bio: loc === "ru"
        ? "Отвечает за рост, контент-стратегию и привлечение пользователей на 12 языках. Превращает данные о доставке в истории, которые хочется читать."
        : "Drives growth, content strategy, and user acquisition across 12 languages. Turns shipping data into stories people actually read.",
      bg: "var(--warm-50)",
      seed: "Zhenya-Marketing-UA",
      loc: "Ukraine",
    },
  ];

  return (
    <>
      {/* === V2 HERO — abstract shapes, accent underline === */}
      <section style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid var(--line)" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(1000px 400px at 90% 10%, rgba(26,115,232,.10), transparent 60%), radial-gradient(700px 400px at -5% 50%, rgba(232,92,58,.08), transparent 60%)" }} />
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(var(--line-2) 1px, transparent 1px), linear-gradient(90deg, var(--line-2) 1px, transparent 1px)", backgroundSize: "48px 48px", maskImage: "linear-gradient(180deg, #000 40%, transparent 100%)", WebkitMaskImage: "linear-gradient(180deg, #000 40%, transparent 100%)" }} />
          <svg viewBox="0 0 1440 600" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
            <defs>
              <linearGradient id="arcA" x1="0" x2="1">
                <stop offset="0" stopColor="#1A73E8" stopOpacity=".0" />
                <stop offset=".5" stopColor="#1A73E8" stopOpacity=".35" />
                <stop offset="1" stopColor="#1A73E8" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M -50 400 Q 400 100, 800 360 T 1500 300" stroke="url(#arcA)" strokeWidth="1.5" fill="none" strokeDasharray="4 6" />
            <path d="M -50 500 Q 500 250, 900 480 T 1500 420" stroke="url(#arcA)" strokeWidth="1" fill="none" strokeDasharray="2 5" opacity=".6" />
          </svg>
          {/* Floating abstract box shapes — parallax + slow bob */}
          <FloatingShape
            rotateDeg={-8}
            parallaxRange={70}
            bobDistance={5}
            bobDuration={6}
            style={{ position: "absolute", top: "30%", right: "8%", width: 80, height: 80, borderRadius: 16, background: "linear-gradient(135deg, var(--warm) 0%, #E8B43D 100%)", boxShadow: "0 20px 40px -10px rgba(242,201,76,.5)" }}
            className="hero-float"
          />
          <FloatingShape
            rotateDeg={12}
            parallaxRange={-50}
            bobDistance={6}
            bobDuration={5}
            style={{ position: "absolute", bottom: "18%", right: "22%", width: 56, height: 56, borderRadius: 12, background: "var(--accent)", opacity: 0.9, boxShadow: "0 14px 30px -8px rgba(232,92,58,.5)" }}
            className="hero-float"
          />
          {/* Themed illustration replacing one of the abstract floating boxes —
              gives the hero meaningful visual content (magnifying glass over
              transparent invoice) instead of pure abstraction. */}
          <FloatingShape
            rotateDeg={-2}
            parallaxRange={50}
            bobDistance={5}
            bobDuration={7}
            style={{ position: "absolute", top: "8%", right: "4%", width: 280, pointerEvents: "none" }}
            className="hero-float"
          >
            <AboutIllustration width={280} />
          </FloatingShape>
        </div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1240, margin: "0 auto", padding: "clamp(40px,8vw,96px) clamp(16px,4vw,32px) clamp(48px,9vw,112px)" }}>
          <nav style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>
            <Link href={`/${locale}`} style={{ color: "var(--muted)", textDecoration: "none" }}>{t(loc, "home")}</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "var(--ink)" }}>{t(loc, "about_breadcrumb")}</span>
          </nav>
          <div style={{ maxWidth: 820 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 12px 6px 8px", borderRadius: 999, background: "#fff", border: "1px solid var(--line)", fontSize: 12, fontWeight: 600, color: "var(--ink-2, #1E293B)", boxShadow: "var(--shadow-sm)" }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--accent)" }} />
              {tf(loc, "about_pill", "About RateShips · Founded 2026 · Hungary")}
            </div>
            <HeroH1
              prefix={tf(loc, "about_h1_pre", "We built RateShips because shipping pricing is")}
              blue={tf(loc, "about_h1_emph", "broken")}
              suffix="."
              inlineSuffix
              emphColor="var(--accent)"
              style={{ margin: "24px 0 22px", fontSize: "clamp(44px,6vw,76px)", lineHeight: 1.02, letterSpacing: "-.03em", fontWeight: 800, color: "var(--ink)" }}
              underline={
                <svg aria-hidden viewBox="0 0 180 20" style={{ position: "absolute", left: 0, bottom: -6, width: "100%", height: 12 }}>
                  <path d="M2 12 Q 50 2, 100 10 T 178 8" stroke="var(--warm)" strokeWidth="5" fill="none" strokeLinecap="round" opacity=".9" />
                </svg>
              }
            />
            <p style={{ fontSize: 20, color: "var(--body)", lineHeight: 1.55, maxWidth: 680, margin: 0 }}>
              {tf(loc, "about_hero_lead", "Fuel surcharges that change mid-week. Dim-weight formulas nobody explains. Customs bills that arrive after the package. We're rebuilding that layer — transparently, neutrally, with published data.")}
            </p>
            <div style={{ marginTop: 36, display: "flex", gap: 28, flexWrap: "wrap", fontSize: 13, color: "var(--muted)" }}>
              {[
                [tf(loc, "stat_langs_short", "Languages"), "12"],
                [tf(loc, "stat_countries_short", "Countries"), "213"],
                [tf(loc, "stat_routes_short", "Routes"), "45,000+"],
                [tf(loc, "stat_carriers_short", "Carriers"), "145+"],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "var(--ink)", letterSpacing: "-.02em", fontVariantNumeric: "tabular-nums" }}>{v}</div>
                  <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: ".08em", marginTop: 2 }}>{k}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* === ORIGIN STORY === */}
      <section style={{ padding: "96px 32px", position: "relative" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ marginBottom: 40, maxWidth: 720 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--blue)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 12 }}>{tf(loc, "origin_eyebrow", "Origin story")}</div>
            <h2 style={{ margin: 0, fontSize: "clamp(28px,3.2vw,40px)", fontWeight: 800, letterSpacing: "-.02em", lineHeight: 1.1, color: "var(--ink)" }}>{tf(loc, "origin_title", "Why we built this.")}</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr .9fr", gap: 56, alignItems: "start" }} className="two-col">
            <div>
              <p style={{ fontSize: 17, color: "var(--body)", lineHeight: 1.7, marginTop: 0 }}>
                {loc === "ru" ? (
                  <>В начале 2026 мы попытались отправить посылку из Венгрии в Великобританию. Простая задача — как нам казалось. Мы открыли <b style={{ color: "var(--ink)" }}>10 сайтов перевозчиков</b>, сравнили тарифы, по-разному оформленные на каждом, и всё равно не знали, что таможенная пошлина добавит к итоговой стоимости.</>
                ) : (
                  <>In early 2026 we tried to ship a parcel from Hungary to the UK. Simple task — or so we thought. We opened <b style={{ color: "var(--ink)" }}>10 carrier websites</b>, compared rates formatted differently on each one, and still had no idea what customs duty would add to the final cost.</>
                )}
              </p>
              <p style={{ fontSize: 17, color: "var(--body)", lineHeight: 1.7 }}>
                {loc === "ru" ? (
                  <>Ушёл <b style={{ color: "var(--accent)" }}>целый день</b> на выбор лучшего варианта для одной посылки. Топливные надбавки были спрятаны в PDF. Формулы volumetric-веса различались у разных перевозчиков. Таможенные пороги разбросаны по сайтам правительств на разных языках.</>
                ) : (
                  <>It took <b style={{ color: "var(--accent)" }}>an entire afternoon</b> to figure out the best option for a single parcel. Fuel surcharges were buried in PDFs. Dim-weight formulas differed between carriers. Customs thresholds were scattered across government sites in different languages.</>
                )}
              </p>
              <p style={{ fontSize: 17, color: "var(--body)", lineHeight: 1.7 }}>
                {loc === "ru" ? (
                  <>Тогда мы сделали инструмент, который проверяет все сразу. Собрали опубликованные тарифы от <b style={{ color: "var(--ink)" }}>145+ перевозчиков в 213 странах</b>, добавили калькулятор таможенной пошлины и сделали его бесплатным.</>
                ) : (
                  <>So we built a tool that checks all of them at once. We aggregated published tariffs from <b style={{ color: "var(--ink)" }}>145+ carriers across 213 countries</b>, added a customs duty calculator, and made it free.</>
                )}
              </p>
              <div style={{ marginTop: 32, display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 999, background: "var(--blue-50)", color: "var(--blue)", display: "grid", placeItems: "center", border: "3px solid #fff", boxShadow: "var(--shadow-md)" }}>
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20s2 1 4 1 3-1 4-1 2 1 4 1 3-1 4-1 4-1 4-1" /><path d="M4 18L3 12h18l-1 6" /><path d="M12 4v8M8 8h8" /></svg>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>RateShips Team</div>
                  <div style={{ fontSize: 13, color: "var(--muted)" }}>Global Supply KFT · Hungary · Founded 2026</div>
                </div>
              </div>
            </div>

            {/* Right: DHL invoice illustration + pullquote */}
            <div style={{ position: "relative" }}>
              <div style={{ background: "#fff", borderRadius: 20, border: "1px solid var(--line)", padding: 28, boxShadow: "var(--shadow-lg)", transform: "rotate(2deg)", maxWidth: 440, marginLeft: "auto", position: "relative" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: 16, borderBottom: "1px solid var(--line-2)" }}>
                  <div>
                    <div style={{ width: 56, height: 28, borderRadius: 4, background: "#FFCC00", display: "grid", placeItems: "center", fontSize: 14, fontWeight: 800, color: "#D40511", letterSpacing: ".04em" }}>DHL</div>
                    <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 8, fontWeight: 600 }}>IMPORT DUTY INVOICE</div>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--muted)", textAlign: "right", lineHeight: 1.5, fontFamily: "ui-monospace, monospace" }}>
                    <div>#INV-2026-01-4412</div>
                    <div>Issued 15.01.2026</div>
                    <div>Due in 14 days</div>
                  </div>
                </div>
                <div style={{ margin: "18px 0 10px", fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".08em" }}>Shipment NYC → Stuttgart</div>
                <div style={{ fontSize: 13, color: "var(--body)" }}>Watchmaking tools · HS 8203.20 · 2.4 kg</div>
                <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    ["Declared value", "€1,820.00", "muted"],
                    ["Import duty (4.7%)", "€85.54", "normal"],
                    ["German VAT (19%)", "€346.80", "normal"],
                    ["Customs processing", "€28.50", "normal"],
                    ["Broker handling fee", "€45.00", "normal"],
                    ["Late-release penalty", "€204.16", "bad"],
                  ].map(([l, v, variant]) => (
                    <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: variant === "muted" ? "var(--muted)" : variant === "bad" ? "var(--accent)" : "var(--ink-2, #1E293B)" }}>
                      <span>{l}</span>
                      <span style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 16, padding: "14px 0", borderTop: "2px solid var(--ink)", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>Amount payable by recipient</span>
                  <span style={{ fontWeight: 800, fontSize: 28, letterSpacing: "-.02em", color: "var(--accent)", fontVariantNumeric: "tabular-nums" }}>€748.00</span>
                </div>
                <div style={{ position: "absolute", transform: "rotate(-12deg)", right: 24, bottom: 60, border: "3px solid var(--accent)", color: "var(--accent)", padding: "6px 12px", borderRadius: 6, fontSize: 11, fontWeight: 800, letterSpacing: ".08em", opacity: 0.85 }}>
                  {tf(loc, "unexpected_stamp", "UNEXPECTED")}
                </div>
              </div>
              <div style={{ position: "absolute", bottom: -24, left: -24, right: 40, background: "var(--ink)", color: "#fff", borderRadius: 20, padding: "28px 30px", boxShadow: "var(--shadow-lg)", transform: "rotate(-1deg)" }}>
                <svg viewBox="0 0 24 24" width="28" height="28" fill="var(--warm)" style={{ marginBottom: 10 }}><path d="M7 9h3l-2 7H5l2-7zm9 0h3l-2 7h-3l2-7z" /></svg>
                <div style={{ fontSize: "clamp(22px,2vw,28px)", fontWeight: 700, letterSpacing: "-.015em", lineHeight: 1.25 }}>
                  {tf(loc, "pullquote", "10 websites. One afternoon. One parcel.")}
                </div>
                <div style={{ marginTop: 10, fontSize: 12, color: "rgba(255,255,255,.6)", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 700 }}>
                  {tf(loc, "pullquote_note", "2026 — the problem that started it all")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === MISSION — 3 principles === */}
      <section style={{ padding: "80px 32px", background: "#fff", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ marginBottom: 40, maxWidth: 720 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--blue)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 12 }}>{tf(loc, "mission_eyebrow", "Mission")}</div>
            <h2 style={{ margin: 0, fontSize: "clamp(28px,3.2vw,40px)", fontWeight: 800, letterSpacing: "-.02em", lineHeight: 1.1, color: "var(--ink)" }}>{tf(loc, "mission_title", "Three principles. Non-negotiable.")}</h2>
            <p style={{ margin: "14px 0 0", fontSize: 17, color: "var(--body)", maxWidth: 620 }}>
              {tf(loc, "mission_desc", "Everything we build — rate tables, customs calculator, country guides — gets measured against these three.")}
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="tools-grid">
            {[
              { icon: <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>, tint: "var(--blue)", tintBg: "var(--blue-50)", title: tf(loc, "principle_transparency", "Transparency"), tag: tf(loc, "principle_transparency_tag", "Every fee upfront"), desc: tf(loc, "principle_transparency_desc", "No hidden surcharges. Fuel, remote-area, dim-weight and customs fees shown before you ship, not when the package lands at a border.") },
              { icon: <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18M5 8h14M3 14l3-7 3 7M15 14l3-7 3 7" /></svg>, tint: "var(--accent)", tintBg: "var(--accent-50)", title: tf(loc, "principle_neutrality", "Neutrality"), tag: tf(loc, "principle_neutrality_tag", "No carrier commissions"), desc: tf(loc, "principle_neutrality_desc", "We take zero rebates from DHL, FedEx or anyone else. Ranking on the results page is the honest one — cheapest wins, not highest-kickback.") },
              { icon: <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" fill="currentColor" /></svg>, tint: "#A37A00", tintBg: "var(--warm-50)", title: tf(loc, "principle_accuracy", "Accuracy"), tag: tf(loc, "principle_accuracy_tag", "Published tariffs only"), desc: tf(loc, "principle_accuracy_desc", "Rates sourced from carrier tariff documents, updated weekly. Customs data from official authority databases across 213 countries.") },
            ].map((c, i) => (
              <div key={c.title} style={{ background: "var(--bg)", borderRadius: 20, border: "1px solid var(--line)", padding: 32, position: "relative", display: "flex", flexDirection: "column", gap: 20, overflow: "hidden" }} className="team-card">
                {/* Soft glow blob behind the icon — uses tint color */}
                <div aria-hidden style={{
                  position: "absolute", top: -40, right: -40, width: 180, height: 180,
                  borderRadius: 999, background: c.tint, opacity: 0.07,
                  filter: "blur(40px)", pointerEvents: "none"
                }} />
                <div style={{ position: "absolute", top: 28, right: 28, fontSize: 11, fontWeight: 800, letterSpacing: ".08em", color: "var(--muted)" }}>{String(i + 1).padStart(2, "0")}</div>
                <div style={{
                  width: 72, height: 72, borderRadius: 18, background: c.tintBg, color: c.tint,
                  display: "grid", placeItems: "center",
                  boxShadow: `inset 0 0 0 1px ${c.tint}22, 0 8px 24px -10px ${c.tint}33`,
                  position: "relative", zIndex: 1
                }}>{c.icon}</div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: c.tint, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 6 }}>{c.tag}</div>
                  <h3 style={{ margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: "-.02em", color: "var(--ink)" }}>{c.title}</h3>
                </div>
                <p style={{ margin: 0, fontSize: 15, color: "var(--body)", lineHeight: 1.6 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === TEAM — 3 real members === */}
      <section style={{ padding: "96px 32px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ maxWidth: 620, marginBottom: 40 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--blue)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 12 }}>{tf(loc, "team_eyebrow", "Team")}</div>
            <h2 style={{ margin: 0, fontSize: "clamp(28px,3.2vw,40px)", fontWeight: 800, letterSpacing: "-.02em", lineHeight: 1.1, color: "var(--ink)" }}>{tf(loc, "team_about_title", "A small team, moving fast.")}</h2>
            <p style={{ margin: "14px 0 0", fontSize: 17, color: "var(--body)" }}>
              {tf(loc, "team_about_desc", "We're a small team based in Hungary. No big offices — just people who think shipping pricing should be transparent.")}
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="tools-grid">
            {team.map((m) => (
              <div key={m.name} style={{ background: "#fff", borderRadius: 20, border: "1px solid var(--line)", padding: 24, display: "flex", gap: 18, alignItems: "flex-start" }} className="team-card">
                <div style={{ width: 72, height: 72, borderRadius: 999, flex: "0 0 72px", background: m.bg, overflow: "hidden", border: "3px solid #fff", boxShadow: "var(--shadow-sm)" }}>
                  <img
                    src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(m.seed)}&backgroundColor=transparent&radius=50&earringsProbability=0&hairColor=28150a,3a2212,562e14,85461e&hair=short01,short02,short03,short04,short05,short06,short07,short08,short09,short10`}
                    alt={m.name}
                    width={72}
                    height={72}
                    loading="lazy"
                    style={{ borderRadius: 999 }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700, fontSize: 16, color: "var(--ink)" }}>{m.name}</span>
                    <span style={{ fontSize: 10, color: "var(--muted)", padding: "2px 6px", background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 4, letterSpacing: ".04em", fontFamily: "ui-monospace, monospace" }}>{m.loc}</span>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--blue)", textTransform: "uppercase", letterSpacing: ".06em", marginTop: 2 }}>{m.role}</div>
                  <p style={{ margin: "10px 0 0", fontSize: 13.5, color: "var(--body)", lineHeight: 1.55 }}>{m.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === TIMELINE === */}
      <section style={{ padding: "80px 32px", background: "#fff", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ marginBottom: 40, maxWidth: 720 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--blue)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 12 }}>{tf(loc, "timeline_eyebrow", "Timeline")}</div>
            <h2 style={{ margin: 0, fontSize: "clamp(28px,3.2vw,40px)", fontWeight: 800, letterSpacing: "-.02em", lineHeight: 1.1, color: "var(--ink)" }}>{tf(loc, "timeline_title", "From idea to 145+ carriers in 3 months.")}</h2>
          </div>
          <div style={{ overflowX: "auto", paddingBottom: 24 }}>
            <div style={{ display: "flex", gap: 0, padding: "48px 0 32px", minWidth: "max-content", position: "relative" }}>
              <div aria-hidden style={{ position: "absolute", left: 0, right: 32, top: 72, height: 2, background: "repeating-linear-gradient(90deg, var(--line) 0 6px, transparent 6px 12px)" }} />
              {[
                { y: "Jan '26", t: tf(loc, "tl_jan_t", "The idea"), d: tf(loc, "tl_jan_d", "Spent an afternoon comparing 10 carrier websites for one parcel. Decided there had to be a better way."), badge: null },
                { y: "Feb '26", t: tf(loc, "tl_feb_t", "First prototype"), d: tf(loc, "tl_feb_d", "Built a working rate aggregator across 40 carriers and 50 countries. Tested with real shipments from Hungary."), badge: null },
                { y: "Mar '26", t: tf(loc, "tl_mar_t", "Public launch"), d: tf(loc, "tl_mar_d", "RateShips goes live with 145+ carriers across 213 countries. Customs duty calculator and delivery estimator included from day one."), badge: "Launch" },
                { y: "Apr '26", t: tf(loc, "tl_apr_t", "12 languages"), d: tf(loc, "tl_apr_d", "Added full translation for Russian, Spanish, German, French, Portuguese, Chinese, Japanese, Korean, Arabic, Turkish, and Italian."), badge: null },
                { y: "Q2 '26", t: tf(loc, "tl_q2_t", "45,000+ routes"), d: tf(loc, "tl_q2_d", "Expanded corridor coverage with weekly rate updates. Every major trade lane gets at least 3 carrier options."), badge: null },
                { y: "Q3 '26", t: tf(loc, "tl_q3_t", "Tools & guides"), d: tf(loc, "tl_q3_d", "Country-specific shipping guides for 195+ destinations. HS-code lookup integrated into customs calculator."), badge: "Planned" },
                { y: "Q4 '26", t: tf(loc, "tl_q4_t", "API for platforms"), d: tf(loc, "tl_q4_d", "Read-only API for e-commerce platforms. Shopify and WooCommerce plugins in development."), badge: "Planned" },
              ].map((e) => {
                const isLaunch = e.badge === "Launch";
                const isPlanned = e.badge === "Planned";
                const badgeColors: Record<string, { bg: string; fg: string }> = {
                  Launch: { bg: "var(--good-50)", fg: "var(--good)" },
                  Planned: { bg: "var(--warm-50)", fg: "#A37A00" },
                };
                return (
                  <div key={e.y} style={{ width: 280, flex: "0 0 280px", paddingRight: 24, position: "relative" }}>
                    <div style={{ width: 24, height: 24, borderRadius: 999, background: isLaunch ? "var(--good)" : isPlanned ? "var(--line)" : "#fff", border: "2px solid " + (isLaunch ? "var(--good)" : "var(--line)"), boxShadow: isLaunch ? "0 0 0 6px rgba(17,138,84,.18), var(--shadow-md)" : "var(--shadow-sm)", display: "grid", placeItems: "center", position: "relative", zIndex: 1, marginBottom: 20, opacity: isPlanned ? 0.6 : 1 }}>
                      {isLaunch && <span style={{ width: 8, height: 8, borderRadius: 999, background: "#fff" }} />}
                    </div>
                    <div style={{ background: isLaunch ? "var(--ink)" : "#fff", color: isLaunch ? "#fff" : "var(--ink)", borderRadius: 14, border: "1px solid " + (isLaunch ? "var(--ink)" : "var(--line)"), padding: 20, boxShadow: isLaunch ? "var(--shadow-lg)" : "var(--shadow-sm)", position: "relative", opacity: isPlanned ? 0.7 : 1 }}>
                      {e.badge && (
                        <span style={{ position: "absolute", top: 14, right: 14, padding: "3px 8px", borderRadius: 999, background: badgeColors[e.badge]?.bg || "var(--blue-50)", color: badgeColors[e.badge]?.fg || "var(--blue)", fontSize: 10, fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase" }}>{e.badge}</span>
                      )}
                      <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-.02em", color: isLaunch ? "var(--warm)" : "var(--blue)", fontVariantNumeric: "tabular-nums" }}>{e.y}</div>
                      <h4 style={{ margin: "4px 0 8px", fontSize: 17, fontWeight: 700, letterSpacing: "-.01em" }}>{e.t}</h4>
                      <p style={{ margin: 0, fontSize: 13, color: isLaunch ? "rgba(255,255,255,.7)" : "var(--body)", lineHeight: 1.55 }}>{e.d}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>
            {tf(loc, "timeline_hint", "← scroll horizontally to see the full timeline →")}
          </div>
        </div>
      </section>

      {/* === COMPANY STATS (dark) === */}
      <section style={{ padding: "80px 32px", background: "var(--ink)", color: "#fff", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(600px 300px at 15% 20%, rgba(26,115,232,.2), transparent 60%), radial-gradient(500px 300px at 85% 80%, rgba(232,92,58,.12), transparent 60%)" }} />
        <div style={{ position: "relative", maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--warm)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 10 }}>{tf(loc, "by_numbers", "By the numbers")}</div>
          <h2 style={{ margin: "0 0 40px", fontSize: "clamp(28px,3.2vw,40px)", fontWeight: 800, letterSpacing: "-.02em", lineHeight: 1.1, maxWidth: 720 }}>
            {tf(loc, "company_stats_title", "A small company with big receipts.")}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 }} className="stats-grid">
            {[
              { v: "2026", l: tf(loc, "founded", "Founded"), s: "Hungary", accent: false },
              { v: "145+", l: tf(loc, "stat_carriers_label", "Carriers"), s: tf(loc, "carriers_published_tariffs", "published tariffs"), accent: false },
              { v: "213", l: tf(loc, "stat_countries_label", "Countries"), s: tf(loc, "every_territory", "every territory"), accent: false },
              { v: "12", l: tf(loc, "stat_langs_label", "Languages"), s: tf(loc, "updated_weekly", "updated weekly"), accent: true },
            ].map((it, i) => (
              <div key={i} style={{ paddingLeft: i > 0 ? 28 : 0, borderLeft: i > 0 ? "1px solid rgba(255,255,255,.12)" : "none" }}>
                <div style={{ fontSize: "clamp(40px,4.2vw,60px)", fontWeight: 800, letterSpacing: "-.03em", lineHeight: 1, color: it.accent ? "var(--warm)" : "#fff", fontVariantNumeric: "tabular-nums" }}>{it.v}</div>
                <div style={{ marginTop: 10, fontWeight: 600, fontSize: 15 }}>{it.l}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,.55)", marginTop: 4 }}>{it.s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === FINAL CTA + LEGAL ENTITY (preserved real data) === */}
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "clamp(40px,7vw,80px) clamp(16px,4vw,32px) clamp(48px,8vw,96px)" }}>
        {/* Legal entity */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-ink mb-4">
            {loc === "ru" ? "Юридическая информация" : "Legal Entity"}
          </h2>
          <div className="bg-surface border border-line rounded-xl p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
              <div>
                <p className="text-muted mb-1">{loc === "ru" ? "Компания" : "Company"}</p>
                <p className="text-ink font-medium">Global Supply KFT</p>
              </div>
              <div>
                <p className="text-muted mb-1">{loc === "ru" ? "Адрес" : "Address"}</p>
                <p className="text-ink">Toldi utca 4, 3066 Kutasó, Hungary</p>
              </div>
              <div>
                <p className="text-muted mb-1">{loc === "ru" ? "Налоговый номер" : "Tax number"}</p>
                <p className="text-ink font-mono">26179030-2-12</p>
              </div>
              <div>
                <p className="text-muted mb-1">VAT</p>
                <p className="text-ink font-mono">HU26179030</p>
              </div>
              <div>
                <p className="text-muted mb-1">IBAN</p>
                <p className="text-ink font-mono">BE14 9672 5993 2983</p>
              </div>
              <div>
                <p className="text-muted mb-1">SWIFT</p>
                <p className="text-ink font-mono">TRWIBEB1XXX</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section style={{ marginTop: 48, padding: "32px 28px", background: "#fff", border: "1px solid var(--line)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--blue)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 6 }}>{tf(loc, "contact", "Contact")}</div>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "var(--ink)" }}>{tf(loc, "about_contact_heading", "Questions? We reply to everything.")}</h3>
          </div>
          <a href="mailto:info@rateships.com" style={{ padding: "12px 20px", borderRadius: 12, background: "var(--ink)", color: "#fff", fontWeight: 600, fontSize: 15, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
            info@rateships.com
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </a>
        </section>
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: t(loc, "about_title"),
            description: t(loc, "about_json_desc"),
            mainEntity: {
              "@type": "Organization",
              name: "RateShips",
              legalName: "Global Supply KFT",
              url: "https://rateships.com",
              logo: "https://rateships.com/favicon.svg",
              email: "info@rateships.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Toldi utca 4",
                addressLocality: "Kutasó",
                postalCode: "3066",
                addressCountry: "HU",
              },
              vatID: "HU26179030",
              taxID: "26179030-2-12",
              employee: [
                {
                  "@type": "Person",
                  name: "Roman Kolosovskiy",
                  jobTitle: "Head of Engineering & Development",
                },
                {
                  "@type": "Person",
                  name: "Dmytro Kolosovskiy",
                  jobTitle: "Project Manager",
                },
                {
                  "@type": "Person",
                  name: "Zhenya Yakovenko",
                  jobTitle: "Marketing Lead",
                },
              ],
            },
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
                name: t(loc, "about_breadcrumb"),
              },
            ],
          }),
        }}
      />
    </>
  );
}
