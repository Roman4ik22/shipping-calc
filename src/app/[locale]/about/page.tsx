import { Metadata } from "next";
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

  return (
    <>
      {/* V2 Hero */}
      <section style={{ padding: "72px 32px 56px", borderBottom: "1px solid var(--line)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(800px 400px at 25% -10%, rgba(26,115,232,.10), transparent 60%)" }} />
        <img src="/img/data-network.svg" alt="" aria-hidden="true" style={{ position: "absolute", right: -40, top: 20, width: 380, opacity: 0.55, pointerEvents: "none" }} className="hidden md:block" />
        <div style={{ position: "relative", maxWidth: 1240, margin: "0 auto" }}>
          <nav style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>
            <Link href={`/${locale}`} style={{ color: "var(--muted)", textDecoration: "none" }}>{t(loc, "home")}</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "var(--ink)" }}>{t(loc, "about_breadcrumb")}</span>
          </nav>
          <h1 style={{ margin: "0 0 18px", fontSize: "clamp(40px,5vw,64px)", lineHeight: 1.02, letterSpacing: "-.03em", fontWeight: 800, color: "var(--ink)", maxWidth: 780 }}>
            {t(loc, "about_title")}
          </h1>
          <p style={{ fontSize: 19, color: "var(--body)", maxWidth: 620, margin: 0, lineHeight: 1.55 }}>
            {t(loc, "about_mission_p1")}
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "56px 32px 96px" }} className="prose max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-ink mb-3">{t(loc, "about_mission")}</h2>
          <p className="text-body leading-relaxed mb-4">
            {t(loc, "about_mission_p1")}
          </p>
          <p className="text-body leading-relaxed">
            {t(loc, "about_mission_p2")}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-ink mb-3">{t(loc, "about_what_we_offer")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-surface border border-line rounded-lg p-5">
              <h3 className="font-semibold text-ink mb-2">{t(loc, "about_carriers_card")}</h3>
              <p className="text-sm text-body">
                {t(loc, "about_carriers_card_desc")}
              </p>
            </div>
            <div className="bg-surface border border-line rounded-lg p-5">
              <h3 className="font-semibold text-ink mb-2">{t(loc, "about_countries_card")}</h3>
              <p className="text-sm text-body">
                {t(loc, "about_countries_card_desc")}
              </p>
            </div>
            <div className="bg-surface border border-line rounded-lg p-5">
              <h3 className="font-semibold text-ink mb-2">{t(loc, "about_customs_card")}</h3>
              <p className="text-sm text-body">
                {t(loc, "about_customs_card_desc")}
              </p>
            </div>
            <div className="bg-surface border border-line rounded-lg p-5">
              <h3 className="font-semibold text-ink mb-2">{t(loc, "about_guides_card")}</h3>
              <p className="text-sm text-body">
                {t(loc, "about_guides_card_desc")}
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-ink mb-3">{t(loc, "about_how_we_work")}</h2>
          <p className="text-body leading-relaxed mb-4">
            {t(loc, "about_how_p1")}
          </p>
          <p className="text-body leading-relaxed">
            {t(loc, "about_how_p2")}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-ink mb-3">{t(loc, "about_contact")}</h2>
          <p className="text-body leading-relaxed">
            {t(loc, "about_contact_text")} <span className="font-medium">info@rateships.com</span>
          </p>
        </section>

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

        {/* Team */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-ink mb-4">
            {loc === "ru" ? "Команда" : "Team"}
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center text-accent-light font-bold text-sm">RK</div>
              <div>
                <p className="text-ink font-medium">Roman Kolosovskiy</p>
                <p className="text-sm text-muted">{loc === "ru" ? "Руководитель технического отдела, разработка" : "Head of Engineering & Development"}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center text-accent-light font-bold text-sm">DK</div>
              <div>
                <p className="text-ink font-medium">Dmytro Kolosovskiy</p>
                <p className="text-sm text-muted">{loc === "ru" ? "Менеджер проекта" : "Project Manager"}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center text-accent-light font-bold text-sm">ZY</div>
              <div>
                <p className="text-ink font-medium">Zhenya Yakovenko</p>
                <p className="text-sm text-muted">{loc === "ru" ? "Маркетолог" : "Marketing Lead"}</p>
              </div>
            </div>
          </div>
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
