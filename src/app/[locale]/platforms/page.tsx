import { Metadata } from "next";
import { platforms } from "@/data/platforms";
import { t, locales } from "@/lib/i18n";
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
    title: t(loc, "platforms_title"),
    description: t(loc, "platforms_description"),
    alternates: {
      canonical: `/${locale}/platforms`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}/platforms`])),
        "x-default": "/en/platforms",
      },
    },
  };
}

type FilterTab = "all" | "global" | "regional";

function PlatformCard({ platform }: { platform: (typeof platforms)[0] }) {
  return (
    <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 16, padding: 22, display: "flex", flexDirection: "column", transition: "all .2s" }} className="team-card">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: "-.01em", color: "var(--ink)", lineHeight: 1.2 }}>
            {platform.company}
          </h3>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--muted)" }}>{platform.countryHQ}</p>
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: "var(--line-2)", color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".05em" }}>
          {platform.category}
        </span>
      </div>

      <p style={{ fontSize: 14, color: "var(--body)", marginBottom: 12 }}>{platform.type}</p>

      <div className="space-y-1.5 mb-4 flex-1" style={{ fontSize: 13, color: "var(--muted)" }}>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "var(--muted)" }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{platform.coverage}</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "var(--muted)" }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          <span>{platform.carriers}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {platform.hasApi && (
          <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: "var(--blue-50)", color: "var(--blue)" }}>
            API
          </span>
        )}
        {platform.whiteLabel && (
          <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: "#E8F8EF", color: "#0F8A48" }}>
            White-Label
          </span>
        )}
        {platform.region !== "Global" && (
          <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: "var(--warm-50)", color: "#A37A00" }}>
            {platform.region}
          </span>
        )}
      </div>

      <a
        href={`https://${platform.website}`}
        target="_blank"
        rel="noopener noreferrer nofollow"
        style={{ fontSize: 14, fontWeight: 600, color: "var(--blue)", display: "inline-flex", alignItems: "center", gap: 6, marginTop: "auto", textDecoration: "none" }}
      >
        {platform.website}
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </div>
  );
}

function FilterTabs({ locale }: { locale: string }) {
  const tabs: { key: FilterTab; label: string; href: string }[] = [
    { key: "all", label: "All", href: `/${locale}/platforms` },
    { key: "global", label: "Global", href: `/${locale}/platforms?filter=global` },
    { key: "regional", label: "Regional", href: `/${locale}/platforms?filter=regional` },
  ];

  return (
    <div className="flex gap-2 mb-8">
      {tabs.map((tab) => (
        <a
          key={tab.key}
          href={tab.href}
          style={{ padding: "8px 16px", fontSize: 14, fontWeight: 600, borderRadius: 999, border: "1px solid var(--line)", color: "var(--body)", background: "#fff", textDecoration: "none", transition: "all .2s" }}
          className="team-card"
        >
          {tab.label}
        </a>
      ))}
    </div>
  );
}

export default async function PlatformsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ filter?: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;
  const { filter } = await searchParams;

  const filtered =
    filter === "global"
      ? platforms.filter((p) => p.category === "Global")
      : filter === "regional"
        ? platforms.filter((p) => p.category === "Regional")
        : platforms;

  const globalPlatforms = filtered.filter((p) => p.category === "Global");
  const regionalByRegion = filtered
    .filter((p) => p.category === "Regional")
    .reduce(
      (acc, p) => {
        if (!acc[p.region]) acc[p.region] = [];
        acc[p.region].push(p);
        return acc;
      },
      {} as Record<string, typeof platforms>,
    );

  const regionOrder = [
    "Europe",
    "North America",
    "Latin America",
    "East Asia",
    "Southeast Asia",
    "India",
    "Middle East",
    "Oceania",
    "Africa",
    "CIS / Turkey",
    "Forwarding",
  ];

  const BASE_URL = "https://rateships.com";

  return (
    <>
      <section style={{ padding: "72px 32px 48px", borderBottom: "1px solid var(--line)", position: "relative" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(800px 400px at 60% -10%, rgba(26,115,232,.08), transparent 60%)" }} />
        <div style={{ position: "relative", maxWidth: 1240, margin: "0 auto" }}>
          <h1 style={{ margin: "0 0 18px", fontSize: "clamp(40px,5vw,64px)", lineHeight: 1.02, letterSpacing: "-.03em", fontWeight: 800, color: "var(--ink)" }}>
            {t(loc, "platforms_title")}
          </h1>
          <p style={{ fontSize: 19, color: "var(--body)", maxWidth: 720, margin: 0 }}>
            {t(loc, "platforms_description")}
          </p>
          <div style={{ marginTop: 16, display: "flex", gap: 18, fontSize: 14, color: "var(--muted)", fontWeight: 500 }}>
            <span><span style={{ color: "var(--ink)", fontWeight: 700 }}>{platforms.length}</span> platforms</span>
            <span>|</span>
            <span><span style={{ color: "var(--ink)", fontWeight: 700 }}>{platforms.filter((p) => p.category === "Global").length}</span> global</span>
            <span>|</span>
            <span><span style={{ color: "var(--ink)", fontWeight: 700 }}>{platforms.filter((p) => p.category === "Regional").length}</span> regional</span>
          </div>
        </div>
      </section>

      <section style={{ padding: "48px 32px 96px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <FilterTabs locale={locale} />

          {globalPlatforms.length > 0 && (
            <section style={{ marginBottom: 48 }}>
              <h2 style={{ margin: "0 0 20px", fontSize: 24, fontWeight: 800, letterSpacing: "-.02em", color: "var(--ink)" }}>
                Global platforms <span style={{ color: "var(--muted)", fontWeight: 500 }}>({globalPlatforms.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {globalPlatforms.map((p) => (
                  <PlatformCard key={p.id} platform={p} />
                ))}
              </div>
            </section>
          )}

          {regionOrder
            .filter((region) => regionalByRegion[region]?.length)
            .map((region) => (
              <section key={region} style={{ marginBottom: 48 }}>
                <h2 style={{ margin: "0 0 20px", fontSize: 24, fontWeight: 800, letterSpacing: "-.02em", color: "var(--ink)" }}>
                  {region} <span style={{ color: "var(--muted)", fontWeight: 500 }}>({regionalByRegion[region].length})</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {regionalByRegion[region].map((p) => (
                    <PlatformCard key={p.id} platform={p} />
                  ))}
                </div>
              </section>
            ))}
        </div>
      </section>

      {/* JSON-LD ItemList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: t(loc, "platforms_title"),
            numberOfItems: platforms.length,
            itemListElement: platforms.map((p, idx) => ({
              "@type": "ListItem",
              position: idx + 1,
              name: p.company,
              url: `https://${p.website}`,
            })),
          }),
        }}
      />

      {/* Breadcrumb JSON-LD */}
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
                item: `${BASE_URL}/${locale}`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: t(loc, "platforms"),
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
            name: t(loc, "platforms_title"),
            description: t(loc, "platforms_description"),
            url: `${BASE_URL}/${locale}/platforms`,
            inLanguage: locale,
            isPartOf: { "@type": "WebSite", name: "RateShips", url: "https://rateships.com" },
            dateModified: new Date().toISOString().split("T")[0],
          }),
        }}
      />
    </>
  );
}
