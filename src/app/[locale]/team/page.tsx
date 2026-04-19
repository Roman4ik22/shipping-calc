import { Metadata } from "next";
import { locales, t } from "@/lib/i18n";
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
    title: t(loc, "team_meta_title"),
    description: t(loc, "team_meta_desc"),
    alternates: {
      canonical: `/${locale}/team`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}/team`])),
        "x-default": "/en/team",
      },
    },
  };
}

export default async function TeamPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;

  const teams = [
    {
      title: t(loc, "team_rate_analysts"),
      description: t(loc, "team_rate_analysts_desc"),
      seed: "Analyst",
      accent: "var(--blue)",
    },
    {
      title: t(loc, "team_customs_specialists"),
      description: t(loc, "team_customs_specialists_desc"),
      seed: "Customs",
      accent: "var(--accent)",
    },
    {
      title: t(loc, "team_engineering"),
      description: t(loc, "team_engineering_desc"),
      seed: "Engineer",
      accent: "var(--warm)",
    },
    {
      title: t(loc, "team_content"),
      description: t(loc, "team_content_desc"),
      seed: "Writer",
      accent: "var(--blue)",
    },
  ];

  const steps = [
    { step: "1", title: t(loc, "team_step_collect"), desc: t(loc, "team_step_collect_desc") },
    { step: "2", title: t(loc, "team_step_verify"), desc: t(loc, "team_step_verify_desc") },
    { step: "3", title: t(loc, "team_step_normalize"), desc: t(loc, "team_step_normalize_desc") },
    { step: "4", title: t(loc, "team_step_publish"), desc: t(loc, "team_step_publish_desc") },
  ];

  return (
    <>
      {/* Organization + BreadcrumbList JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
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
                  name: t(loc, "team_breadcrumb"),
                },
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "RateShips",
              url: "https://rateships.com",
              logo: "https://rateships.com/favicon.svg",
              description: t(loc, "team_meta_desc"),
              foundingDate: "2026",
              knowsAbout: [
                "International shipping rates",
                "Customs duties and taxes",
                "Carrier comparison",
                "Cross-border logistics",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer support",
                url: "https://rateships.com/en/about",
                availableLanguage: [
                  "English", "Russian", "Spanish", "German", "French",
                  "Portuguese", "Chinese", "Japanese", "Korean",
                  "Arabic", "Turkish", "Italian",
                ],
              },
            },
          ]),
        }}
      />

      {/* ---- HERO ---- */}
      <section
        className="fade-in"
        style={{
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(155deg, color-mix(in srgb, var(--warm) 7%, var(--bg)) 0%, var(--bg) 55%, color-mix(in srgb, var(--blue) 5%, var(--bg)) 100%)",
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
            backgroundSize: "52px 52px",
            opacity: 0.3,
            pointerEvents: "none",
          }}
        />

        {/* floating people icon */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 28,
            right: "11%",
            width: 56,
            height: 56,
            borderRadius: 14,
            background: "color-mix(in srgb, var(--warm) 10%, transparent)",
            border: "1px solid color-mix(in srgb, var(--warm) 16%, transparent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: "rotate(-8deg)",
            animation: "float 6s ease-in-out infinite",
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--warm)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87" />
            <path d="M16 3.13a4 4 0 010 7.75" />
          </svg>
        </div>

        {/* floating heart shape */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 105,
            right: "5%",
            width: 38,
            height: 38,
            borderRadius: 10,
            background: "color-mix(in srgb, var(--accent) 10%, transparent)",
            border: "1px solid color-mix(in srgb, var(--accent) 16%, transparent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "float 7s ease-in-out 1s infinite",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
        </div>

        {/* floating accent star */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: 38,
            right: "17%",
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: "color-mix(in srgb, var(--blue) 12%, transparent)",
            border: "1px solid color-mix(in srgb, var(--blue) 18%, transparent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "float 8s ease-in-out 0.5s infinite",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--blue)" stroke="none">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>

        <div style={{ position: "relative", maxWidth: 1240, margin: "0 auto" }}>
          <nav style={{ fontSize: 14, color: "var(--muted)", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <Link href={`/${locale}`} style={{ color: "var(--muted)", textDecoration: "none" }}>
              {t(loc, "home")}
            </Link>
            <span>/</span>
            <span style={{ color: "var(--ink)" }}>{t(loc, "team_breadcrumb")}</span>
          </nav>

          <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, color: "var(--ink)", margin: "0 0 12px", lineHeight: 1.2 }}>
            {t(loc, "team_h1")}
          </h1>
        </div>
      </section>

      {/* ---- CONTENT ---- */}
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "40px 24px 64px" }}>

        {/* Mission Statement */}
        <section
          className="fade-in"
          style={{
            background: "white",
            border: "1px solid var(--line)",
            borderRadius: 14,
            padding: "28px 32px",
            marginBottom: 48,
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <p style={{ fontSize: 18, color: "var(--body)", lineHeight: 1.7, margin: 0 }}>
            {t(loc, "team_mission")}
          </p>
        </section>

        {/* Our Data Team */}
        <section className="fade-in" style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: "0 0 24px" }}>
            {t(loc, "team_our_team")}
          </h2>
          <div
            className="stagger-children"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
              gap: 20,
            }}
          >
            {teams.map((team) => (
              <div
                key={team.title}
                className="card-hover"
                style={{
                  background: "white",
                  border: "1px solid var(--line)",
                  borderRadius: 14,
                  padding: "28px 24px",
                  boxShadow: "var(--shadow-sm)",
                  transition: "box-shadow .2s, border-color .2s",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${team.seed}`}
                  alt=""
                  width={52}
                  height={52}
                  style={{ borderRadius: "50%", marginBottom: 16, border: `2px solid color-mix(in srgb, ${team.accent} 20%, transparent)` }}
                />
                <h3 style={{ fontSize: 17, fontWeight: 600, color: "var(--ink)", margin: "0 0 8px" }}>
                  {team.title}
                </h3>
                <p style={{ fontSize: 14, color: "var(--body)", lineHeight: 1.6, margin: 0 }}>
                  {team.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* What We Do */}
        <section className="fade-in" style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: "0 0 24px" }}>
            {t(loc, "team_what_we_do")}
          </h2>
          <div
            className="stagger-children"
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            {steps.map((item) => (
              <div
                key={item.step}
                className="card-hover"
                style={{
                  display: "flex",
                  gap: 20,
                  alignItems: "flex-start",
                  background: "white",
                  border: "1px solid var(--line)",
                  borderRadius: 14,
                  padding: "20px 24px",
                  boxShadow: "var(--shadow-sm)",
                  transition: "box-shadow .2s, border-color .2s",
                }}
              >
                <div
                  style={{
                    flexShrink: 0,
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "color-mix(in srgb, var(--blue) 10%, transparent)",
                    border: "1px solid color-mix(in srgb, var(--blue) 16%, transparent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--blue)",
                    fontWeight: 700,
                    fontSize: 16,
                  }}
                >
                  {item.step}
                </div>
                <div>
                  <p style={{ fontWeight: 600, color: "var(--ink)", margin: "0 0 4px", fontSize: 15 }}>
                    {item.title}
                  </p>
                  <p style={{ fontSize: 14, color: "var(--body)", margin: 0, lineHeight: 1.6 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Our Commitment */}
        <section className="fade-in" style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: "0 0 20px" }}>
            {t(loc, "team_commitment_title")}
          </h2>
          <div
            style={{
              background: "white",
              border: "1px solid var(--line)",
              borderRadius: 14,
              padding: "28px 32px",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <p style={{ fontSize: 15, color: "var(--body)", lineHeight: 1.7, margin: "0 0 12px" }}>
              {t(loc, "team_commitment_body")}
            </p>
            <p style={{ fontSize: 15, color: "var(--body)", lineHeight: 1.7, margin: 0 }}>
              {t(loc, "team_commitment_contact_pre")}
              <Link
                href={`/${locale}/about`}
                style={{ color: "var(--blue)", textDecoration: "underline", textUnderlineOffset: 3 }}
              >
                {t(loc, "team_commitment_contact_link")}
              </Link>
              {t(loc, "team_commitment_contact_post")}
            </p>
          </div>
        </section>

        {/* Related Pages */}
        <section
          className="fade-in stagger-children"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            gap: 20,
            marginBottom: 40,
          }}
        >
          <Link
            href={`/${locale}/data-methodology`}
            className="card-hover"
            style={{
              background: "white",
              border: "1px solid var(--line)",
              borderRadius: 14,
              padding: "24px 28px",
              textDecoration: "none",
              boxShadow: "var(--shadow-sm)",
              transition: "box-shadow .2s, border-color .2s",
            }}
          >
            <p style={{ fontWeight: 600, color: "var(--ink)", margin: "0 0 6px", fontSize: 16 }}>
              {t(loc, "team_data_methodology")}
            </p>
            <p style={{ fontSize: 14, color: "var(--body)", margin: 0, lineHeight: 1.5 }}>
              {t(loc, "team_data_methodology_desc")}
            </p>
          </Link>
          <Link
            href={`/${locale}/sources`}
            className="card-hover"
            style={{
              background: "white",
              border: "1px solid var(--line)",
              borderRadius: 14,
              padding: "24px 28px",
              textDecoration: "none",
              boxShadow: "var(--shadow-sm)",
              transition: "box-shadow .2s, border-color .2s",
            }}
          >
            <p style={{ fontWeight: 600, color: "var(--ink)", margin: "0 0 6px", fontSize: 16 }}>
              {t(loc, "team_data_sources")}
            </p>
            <p style={{ fontSize: 14, color: "var(--body)", margin: 0, lineHeight: 1.5 }}>
              {t(loc, "team_data_sources_desc")}
            </p>
          </Link>
        </section>

        <p style={{ fontSize: 13, color: "var(--muted)", paddingTop: 20, borderTop: "1px solid var(--line)", margin: 0 }}>
          {t(loc, "last_updated_march")}
        </p>
      </div>
    </>
  );
}
