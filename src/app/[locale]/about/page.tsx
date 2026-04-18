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

      <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {t(loc, "about_title")}
          </h1>
        </div>
        <img src="/img/data-network.svg" alt="" aria-hidden="true" className="w-48 md:w-64 opacity-50 shrink-0 hidden md:block" />
      </div>

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

        {/* Legal entity */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            {loc === "ru" ? "Юридическая информация" : "Legal Entity"}
          </h2>
          <div className="bg-surface border border-white/10 rounded-xl p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
              <div>
                <p className="text-gray-500 mb-1">{loc === "ru" ? "Компания" : "Company"}</p>
                <p className="text-white font-medium">Global Supply KFT</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">{loc === "ru" ? "Адрес" : "Address"}</p>
                <p className="text-white">Toldi utca 4, 3066 Kutasó, Hungary</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">{loc === "ru" ? "Налоговый номер" : "Tax number"}</p>
                <p className="text-white font-mono">26179030-2-12</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">VAT</p>
                <p className="text-white font-mono">HU26179030</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">IBAN</p>
                <p className="text-white font-mono">BE14 9672 5993 2983</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">SWIFT</p>
                <p className="text-white font-mono">TRWIBEB1XXX</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            {loc === "ru" ? "Команда" : "Team"}
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center text-accent-light font-bold text-sm">RK</div>
              <div>
                <p className="text-white font-medium">Roman Kolosovskiy</p>
                <p className="text-sm text-gray-500">{loc === "ru" ? "Руководитель технического отдела, разработка" : "Head of Engineering & Development"}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center text-accent-light font-bold text-sm">DK</div>
              <div>
                <p className="text-white font-medium">Dmytro Kolosovskiy</p>
                <p className="text-sm text-gray-500">{loc === "ru" ? "Менеджер проекта" : "Project Manager"}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center text-accent-light font-bold text-sm">ZY</div>
              <div>
                <p className="text-white font-medium">Zhenya Yakovenko</p>
                <p className="text-sm text-gray-500">{loc === "ru" ? "Маркетолог" : "Marketing Lead"}</p>
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
    </div>
  );
}
