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
    <div
      className="card-hover"
      style={{
        background: "white",
        border: "1px solid var(--line)",
        borderRadius: 14,
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        boxShadow: "var(--shadow-sm)",
        transition: "box-shadow .2s, border-color .2s",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <h3 style={{ fontSize: 17, fontWeight: 600, color: "var(--ink)", margin: 0, lineHeight: 1.3 }}>
            {platform.company}
          </h3>
          <p style={{ fontSize: 13, color: "var(--muted)", margin: "4px 0 0" }}>{platform.countryHQ}</p>
        </div>
        <span
          style={{
            flexShrink: 0,
            marginLeft: 8,
            padding: "3px 10px",
            fontSize: 11,
            fontWeight: 600,
            borderRadius: 6,
            background: "color-mix(in srgb, var(--blue) 8%, transparent)",
            color: "var(--blue)",
            border: "1px solid color-mix(in srgb, var(--blue) 14%, transparent)",
          }}
        >
          {platform.category}
        </span>
      </div>

      <p style={{ fontSize: 13, color: "var(--body)", margin: "0 0 14px" }}>{platform.type}</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: "var(--body)", marginBottom: 16, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg style={{ width: 16, height: 16, flexShrink: 0, color: "var(--muted)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{platform.coverage}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg style={{ width: 16, height: 16, flexShrink: 0, color: "var(--muted)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          <span>{platform.carriers}</span>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
        {platform.hasApi && (
          <span style={{ padding: "2px 10px", fontSize: 11, fontWeight: 600, borderRadius: 6, background: "color-mix(in srgb, var(--blue) 10%, transparent)", color: "var(--blue)", border: "1px solid color-mix(in srgb, var(--blue) 18%, transparent)" }}>
            API
          </span>
        )}
        {platform.whiteLabel && (
          <span style={{ padding: "2px 10px", fontSize: 11, fontWeight: 600, borderRadius: 6, background: "color-mix(in srgb, var(--accent) 10%, transparent)", color: "var(--accent)", border: "1px solid color-mix(in srgb, var(--accent) 18%, transparent)" }}>
            White-Label
          </span>
        )}
        {platform.region !== "Global" && (
          <span style={{ padding: "2px 10px", fontSize: 11, fontWeight: 600, borderRadius: 6, background: "color-mix(in srgb, var(--warm) 10%, transparent)", color: "var(--warm)", border: "1px solid color-mix(in srgb, var(--warm) 18%, transparent)" }}>
            {platform.region}
          </span>
        )}
      </div>

      <a
        href={`https://${platform.website}`}
        target="_blank"
        rel="noopener noreferrer nofollow"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: 13,
          color: "var(--blue)",
          textDecoration: "none",
          marginTop: "auto",
          fontWeight: 500,
        }}
      >
        {platform.website}
        <svg style={{ width: 12, height: 12 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
      {tabs.map((tab) => (
        <a
          key={tab.key}
          href={tab.href}
          className="btn-press"
          style={{
            padding: "8px 18px",
            fontSize: 13,
            fontWeight: 600,
            borderRadius: 10,
            border: "1px solid var(--line)",
            color: "var(--body)",
            background: "white",
            textDecoration: "none",
            transition: "all .15s",
          }}
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
      {/* ---- HERO ---- */}
      <section
        className="fade-in"
        style={{
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(145deg, color-mix(in srgb, var(--accent) 7%, var(--bg)) 0%, var(--bg) 50%, color-mix(in srgb, var(--warm) 5%, var(--bg)) 100%)",
          borderBottom: "1px solid var(--line)",
          padding: "64px 24px 56px",
        }}
      >
        {/* grid pattern */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            opacity: 0.3,
            pointerEvents: "none",
          }}
        />

        {/* floating plug / integration icon */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 30,
            right: "10%",
            width: 56,
            height: 56,
            borderRadius: 14,
            background: "color-mix(in srgb, var(--accent) 10%, transparent)",
            border: "1px solid color-mix(in srgb, var(--accent) 16%, transparent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: "rotate(8deg)",
            animation: "float 6s ease-in-out infinite",
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="M2 12h20" />
            <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
          </svg>
        </div>

        {/* floating API brackets */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 110,
            right: "5%",
            width: 44,
            height: 44,
            borderRadius: 10,
            background: "color-mix(in srgb, var(--blue) 10%, transparent)",
            border: "1px solid color-mix(in srgb, var(--blue) 16%, transparent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: "rotate(-6deg)",
            animation: "float 7s ease-in-out 0.8s infinite",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        </div>

        {/* floating circuit dot */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: 36,
            right: "16%",
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "color-mix(in srgb, var(--warm) 12%, transparent)",
            border: "1px solid color-mix(in srgb, var(--warm) 20%, transparent)",
            animation: "float 8s ease-in-out 1.5s infinite",
          }}
        />

        <div style={{ position: "relative", maxWidth: 1240, margin: "0 auto" }}>
          <nav style={{ fontSize: 14, color: "var(--muted)", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <Link href={`/${locale}`} style={{ color: "var(--muted)", textDecoration: "none" }}>
              {t(loc, "home")}
            </Link>
            <span>/</span>
            <span style={{ color: "var(--ink)" }}>{t(loc, "platforms")}</span>
          </nav>

          <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, color: "var(--ink)", margin: "0 0 12px", lineHeight: 1.2 }}>
            {t(loc, "platforms_title")}
          </h1>
          <p style={{ fontSize: 18, color: "var(--body)", maxWidth: 640, margin: "0 0 20px", lineHeight: 1.6 }}>
            {t(loc, "platforms_description")}
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 14, color: "var(--muted)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--blue)", display: "inline-block" }} />
              {platforms.length} platforms
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />
              {platforms.filter((p) => p.category === "Global").length} global
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--warm)", display: "inline-block" }} />
              {platforms.filter((p) => p.category === "Regional").length} regional
            </span>
          </div>
        </div>
      </section>

      {/* ---- CONTENT ---- */}
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "40px 24px 64px" }}>
        <FilterTabs locale={locale} />

        {/* Global Platforms */}
        {globalPlatforms.length > 0 && (
          <section className="fade-in" style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--ink)", margin: "0 0 20px", display: "flex", alignItems: "center", gap: 10 }}>
              <svg style={{ width: 22, height: 22, color: "var(--blue)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Global Platforms ({globalPlatforms.length})
            </h2>
            <div
              className="stagger-children"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
                gap: 20,
              }}
            >
              {globalPlatforms.map((p) => (
                <PlatformCard key={p.id} platform={p} />
              ))}
            </div>
          </section>
        )}

        {/* Regional Providers by region */}
        {regionOrder
          .filter((region) => regionalByRegion[region]?.length)
          .map((region) => (
            <section key={region} className="fade-in" style={{ marginBottom: 48 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--ink)", margin: "0 0 20px" }}>
                {region} ({regionalByRegion[region].length})
              </h2>
              <div
                className="stagger-children"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
                  gap: 20,
                }}
              >
                {regionalByRegion[region].map((p) => (
                  <PlatformCard key={p.id} platform={p} />
                ))}
              </div>
            </section>
          ))}
      </div>

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
            dateModified: "2026-04-03",
          }),
        }}
      />
    </>
  );
}
