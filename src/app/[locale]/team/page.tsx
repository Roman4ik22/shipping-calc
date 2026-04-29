import { Metadata } from "next";
import { locales, t } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { StaggerGrid, StaggerItem } from "@/components/HeroMotion";
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
      icon: (
        <svg
          className="w-8 h-8 text-accent-light"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
          />
        </svg>
      ),
    },
    {
      title: t(loc, "team_customs_specialists"),
      description: t(loc, "team_customs_specialists_desc"),
      icon: (
        <svg
          className="w-8 h-8 text-accent-light"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
          />
        </svg>
      ),
    },
    {
      title: t(loc, "team_engineering"),
      description: t(loc, "team_engineering_desc"),
      icon: (
        <svg
          className="w-8 h-8 text-accent-light"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
          />
        </svg>
      ),
    },
    {
      title: t(loc, "team_content"),
      description: t(loc, "team_content_desc"),
      icon: (
        <svg
          className="w-8 h-8 text-accent-light"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
          />
        </svg>
      ),
    },
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

      <section style={{ padding: "72px 32px 48px", borderBottom: "1px solid var(--line)", position: "relative" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(800px 400px at 40% -10%, rgba(26,115,232,.08), transparent 60%)" }} />
        <div style={{ position: "relative", maxWidth: 1240, margin: "0 auto" }}>
          <nav style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>
            <Link href={`/${locale}`} style={{ color: "var(--muted)", textDecoration: "none" }}>{t(loc, "home")}</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "var(--ink)" }}>{t(loc, "team_breadcrumb")}</span>
          </nav>
          <h1 style={{ margin: "0 0 18px", fontSize: "clamp(40px,5vw,64px)", lineHeight: 1.02, letterSpacing: "-.03em", fontWeight: 800, color: "var(--ink)" }}>
            {t(loc, "team_h1")}
          </h1>
          <p style={{ fontSize: 19, color: "var(--body)", maxWidth: 720, margin: 0 }}>
            {t(loc, "team_mission")}
          </p>
        </div>
      </section>

      <section style={{ padding: "64px 32px 48px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--blue)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 16 }}>
            {t(loc, "team_our_team")}
          </div>
          <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 gap-5" staggerDelay={0.07}>
            {teams.map((team) => (
              <StaggerItem key={team.title}>
                <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 20, padding: 28, transition: "all .2s", height: "100%" }} className="team-card">
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: "var(--blue-50)", color: "var(--blue)", display: "grid", placeItems: "center", marginBottom: 16 }}>
                    {team.icon}
                  </div>
                  <h3 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 700, color: "var(--ink)", letterSpacing: "-.01em" }}>{team.title}</h3>
                  <p style={{ margin: 0, fontSize: 14, color: "var(--body)", lineHeight: 1.55 }}>{team.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      <section style={{ padding: "24px 32px 48px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <h2 style={{ margin: "0 0 24px", fontSize: 28, fontWeight: 800, letterSpacing: "-.02em", color: "var(--ink)" }}>
            {t(loc, "team_what_we_do")}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }} className="stats-grid">
            {[
              { step: "1", title: t(loc, "team_step_collect"), desc: t(loc, "team_step_collect_desc") },
              { step: "2", title: t(loc, "team_step_verify"), desc: t(loc, "team_step_verify_desc") },
              { step: "3", title: t(loc, "team_step_normalize"), desc: t(loc, "team_step_normalize_desc") },
              { step: "4", title: t(loc, "team_step_publish"), desc: t(loc, "team_step_publish_desc") },
            ].map((item) => (
              <div key={item.step} style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 16, padding: 22 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--blue-50)", color: "var(--blue)", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 16, marginBottom: 14 }}>
                  {item.step}
                </div>
                <p style={{ margin: "0 0 4px", fontWeight: 700, color: "var(--ink)", fontSize: 15 }}>{item.title}</p>
                <p style={{ margin: 0, fontSize: 13, color: "var(--body)", lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "24px 32px 48px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <h2 style={{ margin: "0 0 20px", fontSize: 28, fontWeight: 800, letterSpacing: "-.02em", color: "var(--ink)" }}>
            {t(loc, "team_commitment_title")}
          </h2>
          <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 20, padding: 28 }}>
            <p style={{ margin: "0 0 14px", color: "var(--body)", fontSize: 15, lineHeight: 1.65 }}>{t(loc, "team_commitment_body")}</p>
            <p style={{ margin: 0, color: "var(--body)", fontSize: 15, lineHeight: 1.65 }}>
              {t(loc, "team_commitment_contact_pre")}
              <Link href={`/${locale}/about`} style={{ color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>
                {t(loc, "team_commitment_contact_link")}
              </Link>
              {t(loc, "team_commitment_contact_post")}
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: "24px 32px 96px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Link href={`/${locale}/data-methodology`} style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 16, padding: 22, textDecoration: "none", transition: "all .2s" }} className="team-card">
              <p style={{ margin: "0 0 4px", color: "var(--ink)", fontWeight: 700, fontSize: 16 }}>{t(loc, "team_data_methodology")}</p>
              <p style={{ margin: 0, fontSize: 13, color: "var(--body)" }}>{t(loc, "team_data_methodology_desc")}</p>
            </Link>
            <Link href={`/${locale}/sources`} style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 16, padding: 22, textDecoration: "none", transition: "all .2s" }} className="team-card">
              <p style={{ margin: "0 0 4px", color: "var(--ink)", fontWeight: 700, fontSize: 16 }}>{t(loc, "team_data_sources")}</p>
              <p style={{ margin: 0, fontSize: 13, color: "var(--body)" }}>{t(loc, "team_data_sources_desc")}</p>
            </Link>
          </div>
          <p style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid var(--line)", fontSize: 13, color: "var(--muted)" }}>
            {t(loc, "last_updated_march")}
          </p>
        </div>
      </section>
    </>
  );
}
