import { Metadata } from "next";
import { countries, getCountryName, getPopularCountries } from "@/lib/data";
import { t, tf, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { countryFlag } from "@/lib/flags";
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
    title: t(loc, "guides_title"),
    description: t(loc, "guides_desc"),
    alternates: {
      canonical: `/${locale}/guide`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}/guide`])),
        "x-default": "/en/guide",
      },
    },
  };
}

const CONTINENT_FLAG: Record<string, string> = {
  "Europe": "🇪🇺",
  "Asia": "🌏",
  "Africa": "🌍",
  "North America": "🇺🇸",
  "South America": "🇧🇷",
  "Oceania": "🇦🇺",
  "Antarctica": "❄️",
};

export default async function GuidesPage({
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

  const sortedContinents = [...continents.entries()].sort(([a], [b]) => a.localeCompare(b));

  return (
    <>
      {/* V2 Hero */}
      <section style={{ padding: "72px 32px 48px", borderBottom: "1px solid var(--line)", position: "relative" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(800px 400px at 30% -10%, rgba(26,115,232,.08), transparent 60%)" }} />
        <div style={{ position: "relative", maxWidth: 1240, margin: "0 auto" }}>
          <h1 style={{ margin: "0 0 18px", fontSize: "clamp(40px,5vw,64px)", lineHeight: 1.02, letterSpacing: "-.03em", fontWeight: 800, color: "var(--ink)" }}>
            {t(loc, "guides_heading")} <span style={{ color: "var(--blue)" }}>{countries.length} {tf(loc, "countries_label", "countries")}.</span>
          </h1>
          <p style={{ fontSize: 19, color: "var(--body)", maxWidth: 620, margin: 0 }}>
            {t(loc, "guides_subtitle")}
          </p>
        </div>
      </section>

      {/* Popular featured cards */}
      <section style={{ padding: "48px 32px 24px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--blue)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 16 }}>
            {t(loc, "popular_guides")}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }} className="tools-grid">
            {popular.slice(0, 8).map((c) => (
              <Link
                key={c.code}
                href={`/${locale}/guide/${c.slug_en}`}
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
                  gap: 8,
                  transition: "all .2s",
                }}
                className="team-card"
              >
                <span style={{ fontSize: 32 }}>{countryFlag(c.code)}</span>
                <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: "-.01em" }}>{getCountryName(c, loc)}</span>
                <span style={{ fontSize: 12, color: "var(--muted)" }}>{c.continent}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* By continent */}
      <section style={{ padding: "40px 32px 96px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          {sortedContinents.map(([continent, list]) => {
            const sorted = list.sort((a, b) =>
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
                      href={`/${locale}/guide/${c.slug_en}`}
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
              { "@type": "ListItem", position: 2, name: t(loc, "guides_heading") },
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
            name: t(loc, "guides_title"),
            description: t(loc, "guides_desc"),
            url: `https://rateships.com/${locale}/guide`,
            inLanguage: locale,
            isPartOf: { "@type": "WebSite", name: "RateShips", url: "https://rateships.com" },
            dateModified: new Date().toISOString().split("T")[0],
          }),
        }}
      />
    </>
  );
}
