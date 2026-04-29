import { Metadata } from "next";
import { countries, getCountryName, getPopularCountries } from "@/lib/data";
import { getCustomsInfo } from "@/lib/customs";
import { t, tf, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { countryFlag } from "@/lib/flags";
import { TiltCard, StaggerGrid, StaggerItem } from "@/components/HeroMotion";
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

  const titleByLoc: Record<Locale, string> = {
    en: `Customs Duties & Import Rules for ${countries.length} Countries (${new Date().getFullYear()})`,
    ru: `Таможенные пошлины и ввоз: ${countries.length} стран (${new Date().getFullYear()})`,
    es: `Aduanas e impuestos de importación: ${countries.length} países (${new Date().getFullYear()})`,
    de: `Zoll & Einfuhrregeln: ${countries.length} Länder (${new Date().getFullYear()})`,
    fr: `Douane et droits d'importation : ${countries.length} pays (${new Date().getFullYear()})`,
    pt: `Alfândega e direitos de importação: ${countries.length} países (${new Date().getFullYear()})`,
    zh: `${countries.length} 个国家清关与进口规则（${new Date().getFullYear()}）`,
    ja: `${countries.length}カ国の通関と関税ガイド（${new Date().getFullYear()}）`,
    ko: `${countries.length}개국 통관 및 관세 가이드 (${new Date().getFullYear()})`,
    ar: `الجمارك ورسوم الاستيراد: ${countries.length} دولة (${new Date().getFullYear()})`,
    tr: `${countries.length} ülke için gümrük ve ithalat (${new Date().getFullYear()})`,
    it: `Dogana e dazi di importazione: ${countries.length} paesi (${new Date().getFullYear()})`,
  };

  const descByLoc: Record<Locale, string> = {
    en: `Customs duty, VAT rates, de minimis thresholds, prohibited items, and clearance times for ${countries.length} countries. Free duty calculator inside.`,
    ru: `Таможенные пошлины, НДС, де минимис, запрещённые товары и сроки растаможки для ${countries.length} стран. Бесплатный калькулятор пошлин.`,
    es: `Aranceles, IVA, umbrales de minimis, artículos prohibidos y tiempos de despacho para ${countries.length} países. Calculadora de aranceles gratuita.`,
    de: `Zollsätze, MwSt., De-minimis-Grenzwerte, verbotene Waren und Abfertigungszeiten für ${countries.length} Länder. Kostenloser Zollrechner.`,
    fr: `Droits de douane, TVA, seuils de minimis, articles interdits et délais de dédouanement pour ${countries.length} pays. Calculateur de droits gratuit.`,
    pt: `Direitos aduaneiros, IVA, limites de minimis, artigos proibidos e prazos de desalfandegamento para ${countries.length} países. Calculadora grátis.`,
    zh: `${countries.length} 个国家的关税、增值税、起征免税额、违禁物品和清关时间。免费关税计算器。`,
    ja: `${countries.length}カ国の関税率・消費税・免税基準・禁制品・通関日数を網羅。無料の関税計算機を提供。`,
    ko: `${countries.length}개국의 관세, 부가세, 면세 기준, 금지 품목, 통관 기간 정보. 무료 관세 계산기 제공.`,
    ar: `رسوم الجمارك وضريبة القيمة المضافة وحدود الإعفاء الجمركي والمنتجات الممنوعة وأوقات التخليص لـ ${countries.length} دولة. حاسبة رسوم مجانية.`,
    tr: `${countries.length} ülke için gümrük vergileri, KDV, de minimis eşikleri, yasak ürünler ve gümrükleme süreleri. Ücretsiz gümrük hesaplayıcı.`,
    it: `Dazi doganali, IVA, soglie de minimis, articoli vietati e tempi di sdoganamento per ${countries.length} paesi. Calcolatore di dazi gratuito.`,
  };

  return {
    title: titleByLoc[loc] || titleByLoc.en,
    description: descByLoc[loc] || descByLoc.en,
    alternates: {
      canonical: `/${locale}/customs`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}/customs`])),
        "x-default": "/en/customs",
      },
    },
  };
}

const CONTINENT_ORDER = [
  "Europe",
  "Asia",
  "North America",
  "South America",
  "Africa",
  "Oceania",
];

const CONTINENT_FLAG: Record<string, string> = {
  Europe: "🇪🇺",
  Asia: "🌏",
  Africa: "🌍",
  "North America": "🇺🇸",
  "South America": "🇧🇷",
  Oceania: "🇦🇺",
  Antarctica: "❄️",
};

export default async function CustomsHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;
  const popular = getPopularCountries();

  const continents = new Map<string, typeof countries>();
  for (const c of countries) {
    const list = continents.get(c.continent) || [];
    list.push(c);
    continents.set(c.continent, list);
  }

  const sortedContinents = CONTINENT_ORDER
    .filter((cn) => continents.has(cn))
    .map((cn) => [cn, continents.get(cn)!] as [string, typeof countries]);

  return (
    <>
      {/* Hero */}
      <section style={{ padding: "72px 32px 48px", borderBottom: "1px solid var(--line)", position: "relative" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(800px 400px at 30% -10%, rgba(26,115,232,.08), transparent 60%)" }} />
        <div style={{ position: "relative", maxWidth: 1240, margin: "0 auto" }}>
          <nav style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>
            <Link href={`/${locale}`} style={{ color: "var(--muted)", textDecoration: "none" }}>{t(loc, "home")}</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "var(--ink)" }}>{t(loc, "customs_info")}</span>
          </nav>
          <h1 style={{ margin: "0 0 18px", fontSize: "clamp(40px,5vw,64px)", lineHeight: 1.02, letterSpacing: "-.03em", fontWeight: 800, color: "var(--ink)" }}>
            {tf(loc, "customs_hub_h1_pre", "Customs duty, VAT &")}
            <br />
            <span style={{ color: "var(--blue)" }}>{tf(loc, "customs_hub_h1_keyword", "import rules")}</span>
            {" "}{tf(loc, "customs_hub_h1_post", "for")} {countries.length} {tf(loc, "countries_label", "countries")}.
          </h1>
          <p style={{ fontSize: 19, color: "var(--body)", maxWidth: 720, margin: "0 0 24px" }}>
            {tf(loc, "customs_hub_subtitle", "De minimis thresholds, VAT rates, duty schedules, prohibited items, and real clearance times — sourced directly from each country's customs authority. Updated weekly.")}
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link
              href={`/${locale}/tools/duty-calculator`}
              className="btn-press"
              style={{
                padding: "14px 22px", borderRadius: 12,
                background: "var(--blue)", color: "#fff",
                fontSize: 15, fontWeight: 700,
                display: "inline-flex", alignItems: "center", gap: 8,
                textDecoration: "none",
              }}
            >
              {tf(loc, "open_duty_calc", "Open duty calculator")}
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
            <Link
              href={`/${locale}/data-methodology`}
              style={{
                padding: "14px 22px", borderRadius: 12,
                background: "#fff", color: "var(--ink)",
                fontSize: 15, fontWeight: 700,
                border: "1px solid var(--line)",
                textDecoration: "none",
              }}
            >
              {t(loc, "methodology_link")}
            </Link>
          </div>
        </div>
      </section>

      {/* Popular country cards with key data */}
      <section style={{ padding: "48px 32px 24px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--blue)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 16 }}>
            {tf(loc, "customs_popular_eyebrow", "Most searched destinations")}
          </div>
          <StaggerGrid
            style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}
            className="tools-grid"
            staggerDelay={0.05}
          >
            {popular.slice(0, 8).map((c) => {
              const customs = getCustomsInfo(c.code);
              return (
                <StaggerItem key={c.code}>
                  <TiltCard maxTilt={5}>
                    <Link
                      href={`/${locale}/customs/${c.slug_en}`}
                      prefetch={false}
                      style={{
                        background: "#fff",
                        border: "1px solid var(--line)",
                        borderRadius: 16,
                        padding: "20px 22px",
                        textDecoration: "none",
                        color: "var(--ink)",
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                        width: "100%",
                        height: "100%",
                      }}
                      className="team-card"
                    >
                      <span style={{ fontSize: 28 }}>{countryFlag(c.code)}</span>
                      <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: "-.01em", marginTop: 4 }}>{getCountryName(c, loc)}</span>
                      <div style={{ display: "flex", gap: 10, fontSize: 12, color: "var(--muted)", flexWrap: "wrap", marginTop: 4 }}>
                        <span><b style={{ color: "var(--ink)" }}>{customs.vat_rate}%</b> {tf(loc, "vat_short", "VAT")}</span>
                        {customs.de_minimis_usd > 0 && (
                          <span>${customs.de_minimis_usd} {tf(loc, "de_minimis_short", "de minimis")}</span>
                        )}
                      </div>
                    </Link>
                  </TiltCard>
                </StaggerItem>
              );
            })}
          </StaggerGrid>
        </div>
      </section>

      {/* By continent listing */}
      <section style={{ padding: "40px 32px 96px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          {sortedContinents.map(([continent, list]) => {
            const sorted = [...list].sort((a, b) =>
              getCountryName(a, loc).localeCompare(getCountryName(b, loc))
            );
            return (
              <div key={continent} style={{ marginBottom: 48 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <span style={{ fontSize: 24 }}>{CONTINENT_FLAG[continent] || "🌐"}</span>
                  <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: "-.02em", color: "var(--ink)" }}>{continent}</h2>
                  <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 500 }}>
                    {list.length} {tf(loc, "countries_label", "countries")}
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }} className="tools-grid">
                  {sorted.map((c) => (
                    <Link
                      key={c.code}
                      href={`/${locale}/customs/${c.slug_en}`}
                      prefetch={false}
                      style={{
                        padding: "14px 16px",
                        background: "#fff",
                        border: "1px solid var(--line)",
                        borderRadius: 12,
                        fontSize: 14,
                        fontWeight: 600,
                        color: "var(--ink)",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        textDecoration: "none",
                        transition: "all .2s",
                      }}
                      className="team-card"
                    >
                      <span style={{ fontSize: 18 }}>{countryFlag(c.code)}</span>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{getCountryName(c, loc)}</span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: t(loc, "home"), item: `https://rateships.com/${locale}` },
              { "@type": "ListItem", position: 2, name: t(loc, "customs_info") },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: tf(loc, "customs_hub_collection", "Customs duties and import rules by country"),
            description: tf(loc, "customs_hub_subtitle", "De minimis thresholds, VAT rates, duty schedules, prohibited items, and real clearance times for every country."),
            url: `https://rateships.com/${locale}/customs`,
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: countries.length,
            },
          }),
        }}
      />
    </>
  );
}
