import { Metadata } from "next";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import Link from "next/link";

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
    title: t(loc, "tools_meta_title"),
    description: t(loc, "tools_meta_desc"),
    alternates: {
      canonical: `/${locale}/tools`,
      languages: {
        ...Object.fromEntries(
          ["en", "ru", "es", "de", "fr", "pt", "zh", "ja", "ko", "ar", "tr", "it"].map((l) => [l, `/${l}/tools`])
        ),
        "x-default": "/en/tools",
      },
    },
  };
}

export default async function ToolsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;

  const tools = [
    {
      href: `/${locale}/tools/duty-calculator`,
      title: t(loc, "duty_calc_name"),
      description: t(loc, "duty_calc_desc"),
      icon: (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <line x1="8" y1="6" x2="16" y2="6" />
          <line x1="8" y1="10" x2="10" y2="10" />
          <line x1="12" y1="10" x2="14" y2="10" />
          <line x1="8" y1="14" x2="10" y2="14" />
          <line x1="12" y1="14" x2="14" y2="14" />
          <line x1="8" y1="18" x2="14" y2="18" />
        </svg>
      ),
    },
    {
      href: `/${locale}/tools/delivery-estimator`,
      title: t(loc, "delivery_est_name"),
      description: t(loc, "delivery_est_desc"),
      icon: (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t(loc, "shipping_tools"),
    description: t(loc, "free_shipping_calcs"),
    breadcrumb: {
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
          name: t(loc, "tools_label"),
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ---- HERO ---- */}
      <section
        className="fade-in"
        style={{
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, color-mix(in srgb, var(--blue) 8%, var(--bg)) 0%, var(--bg) 60%, color-mix(in srgb, var(--accent) 6%, var(--bg)) 100%)",
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
            backgroundSize: "48px 48px",
            opacity: 0.35,
            pointerEvents: "none",
          }}
        />

        {/* floating calculator icon */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 28,
            right: "12%",
            width: 54,
            height: 54,
            borderRadius: 14,
            background: "color-mix(in srgb, var(--blue) 12%, transparent)",
            border: "1px solid color-mix(in srgb, var(--blue) 18%, transparent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: "rotate(-12deg)",
            animation: "float 6s ease-in-out infinite",
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <line x1="8" y1="6" x2="16" y2="6" />
            <line x1="8" y1="10" x2="10" y2="10" />
            <line x1="12" y1="10" x2="14" y2="10" />
            <line x1="8" y1="14" x2="10" y2="14" />
          </svg>
        </div>

        {/* floating clock icon */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 100,
            right: "6%",
            width: 42,
            height: 42,
            borderRadius: "50%",
            background: "color-mix(in srgb, var(--accent) 10%, transparent)",
            border: "1px solid color-mix(in srgb, var(--accent) 16%, transparent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "float 7s ease-in-out 1s infinite",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>

        {/* floating gear shape */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: 40,
            right: "18%",
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "color-mix(in srgb, var(--warm) 10%, transparent)",
            border: "1px solid color-mix(in srgb, var(--warm) 16%, transparent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: "rotate(20deg)",
            animation: "float 8s ease-in-out 0.5s infinite",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--warm)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
        </div>

        <div style={{ position: "relative", maxWidth: 1240, margin: "0 auto" }}>
          <nav style={{ fontSize: 14, color: "var(--muted)", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <Link href={`/${locale}`} style={{ color: "var(--muted)", textDecoration: "none" }}>
              {t(loc, "home")}
            </Link>
            <span>/</span>
            <span style={{ color: "var(--ink)" }}>{t(loc, "tools_label")}</span>
          </nav>

          <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, color: "var(--ink)", margin: "0 0 12px", lineHeight: 1.2 }}>
            {t(loc, "tools_page_title")}
          </h1>
          <p style={{ fontSize: 18, color: "var(--body)", maxWidth: 560, margin: 0, lineHeight: 1.6 }}>
            {t(loc, "tools_subtitle")}
          </p>
        </div>
      </section>

      {/* ---- TOOLS GRID ---- */}
      <section
        className="fade-in stagger-children"
        style={{ maxWidth: 1240, margin: "0 auto", padding: "48px 24px 64px" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))",
            gap: 28,
          }}
        >
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="card-hover"
              style={{
                display: "flex",
                flexDirection: "column",
                background: "white",
                border: "1px solid var(--line)",
                borderRadius: 14,
                padding: "36px 32px",
                textDecoration: "none",
                boxShadow: "var(--shadow-sm)",
                transition: "box-shadow .2s, border-color .2s",
              }}
            >
              <div style={{ marginBottom: 20 }}>{tool.icon}</div>
              <h2 style={{ fontSize: 22, fontWeight: 600, color: "var(--ink)", margin: "0 0 8px" }}>
                {tool.title}
              </h2>
              <p style={{ fontSize: 15, color: "var(--body)", lineHeight: 1.6, margin: "0 0 24px", flex: 1 }}>
                {tool.description}
              </p>
              <span
                className="btn-press"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  alignSelf: "flex-start",
                  padding: "10px 22px",
                  background: "var(--blue)",
                  color: "#fff",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {t(loc, "tools_label")}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
