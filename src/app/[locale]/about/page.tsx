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
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/about`])),
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-gray-400 mb-6">
        <Link href={`/${locale}`} className="hover:text-accent-light">
          {t(loc, "home")}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-white">
          {t(loc, "about_breadcrumb")}
        </span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6">
        {t(loc, "about_title")}
      </h1>

      <div className="prose max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-3">{t(loc, "about_mission")}</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            {t(loc, "about_mission_p1")}
          </p>
          <p className="text-gray-300 leading-relaxed">
            {t(loc, "about_mission_p2")}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-3">{t(loc, "about_what_we_offer")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-surface border border-white/10 rounded-lg p-5">
              <h3 className="font-semibold text-white mb-2">{t(loc, "about_carriers_card")}</h3>
              <p className="text-sm text-gray-400">
                {t(loc, "about_carriers_card_desc")}
              </p>
            </div>
            <div className="bg-surface border border-white/10 rounded-lg p-5">
              <h3 className="font-semibold text-white mb-2">{t(loc, "about_countries_card")}</h3>
              <p className="text-sm text-gray-400">
                {t(loc, "about_countries_card_desc")}
              </p>
            </div>
            <div className="bg-surface border border-white/10 rounded-lg p-5">
              <h3 className="font-semibold text-white mb-2">{t(loc, "about_customs_card")}</h3>
              <p className="text-sm text-gray-400">
                {t(loc, "about_customs_card_desc")}
              </p>
            </div>
            <div className="bg-surface border border-white/10 rounded-lg p-5">
              <h3 className="font-semibold text-white mb-2">{t(loc, "about_guides_card")}</h3>
              <p className="text-sm text-gray-400">
                {t(loc, "about_guides_card_desc")}
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-3">{t(loc, "about_how_we_work")}</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            {t(loc, "about_how_p1")}
          </p>
          <p className="text-gray-300 leading-relaxed">
            {t(loc, "about_how_p2")}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-3">{t(loc, "about_contact")}</h2>
          <p className="text-gray-300 leading-relaxed">
            {t(loc, "about_contact_text")} <span className="font-medium">info@rateships.com</span>
          </p>
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
              url: "https://rateships.com",
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
    </div>
  );
}
