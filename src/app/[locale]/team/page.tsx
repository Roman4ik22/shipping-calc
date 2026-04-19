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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

      <nav className="text-sm text-body mb-6">
        <Link href={`/${locale}`} className="hover:text-accent-light">
          {t(loc, "home")}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">
          {t(loc, "team_breadcrumb")}
        </span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-4">
        {t(loc, "team_h1")}
      </h1>

      <div className="space-y-8 text-body leading-relaxed">
        {/* Mission Statement */}
        <section className="bg-surface border border-line rounded-lg p-6">
          <p className="text-lg">
            {t(loc, "team_mission")}
          </p>
        </section>

        {/* Our Data Team */}
        <section>
          <h2 className="text-2xl font-bold text-ink mb-6">
            {t(loc, "team_our_team")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {teams.map((team) => (
              <div
                key={team.title}
                className="bg-surface border border-line rounded-lg p-6"
              >
                <div className="mb-4">{team.icon}</div>
                <h3 className="text-ink font-semibold text-lg mb-2">
                  {team.title}
                </h3>
                <p className="text-sm text-body">{team.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What We Do */}
        <section>
          <h2 className="text-2xl font-bold text-ink mb-4">
            {t(loc, "team_what_we_do")}
          </h2>
          <div className="space-y-4">
            {[
              { step: "1", title: t(loc, "team_step_collect"), desc: t(loc, "team_step_collect_desc") },
              { step: "2", title: t(loc, "team_step_verify"), desc: t(loc, "team_step_verify_desc") },
              { step: "3", title: t(loc, "team_step_normalize"), desc: t(loc, "team_step_normalize_desc") },
              { step: "4", title: t(loc, "team_step_publish"), desc: t(loc, "team_step_publish_desc") },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent-light/10 flex items-center justify-center text-accent-light font-bold">
                  {item.step}
                </div>
                <div>
                  <p className="text-ink font-semibold">{item.title}</p>
                  <p className="text-sm text-body">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Our Commitment */}
        <section>
          <h2 className="text-2xl font-bold text-ink mb-4">
            {t(loc, "team_commitment_title")}
          </h2>
          <div className="bg-surface border border-line rounded-lg p-6 space-y-3">
            <p className="text-body">
              {t(loc, "team_commitment_body")}
            </p>
            <p className="text-body">
              {t(loc, "team_commitment_contact_pre")}
              <Link
                href={`/${locale}/about`}
                className="text-accent-light hover:underline"
              >
                {t(loc, "team_commitment_contact_link")}
              </Link>
              {t(loc, "team_commitment_contact_post")}
            </p>
          </div>
        </section>

        {/* Related Pages */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href={`/${locale}/data-methodology`}
            className="bg-surface border border-line rounded-lg p-5 hover:border-accent-light/30 transition-colors"
          >
            <p className="text-ink font-semibold mb-1">
              {t(loc, "team_data_methodology")}
            </p>
            <p className="text-sm text-body">
              {t(loc, "team_data_methodology_desc")}
            </p>
          </Link>
          <Link
            href={`/${locale}/sources`}
            className="bg-surface border border-line rounded-lg p-5 hover:border-accent-light/30 transition-colors"
          >
            <p className="text-ink font-semibold mb-1">
              {t(loc, "team_data_sources")}
            </p>
            <p className="text-sm text-body">
              {t(loc, "team_data_sources_desc")}
            </p>
          </Link>
        </section>

        <p className="text-sm text-muted pt-4 border-t border-line">
          {t(loc, "last_updated_march")}
        </p>
      </div>
    </div>
  );
}
