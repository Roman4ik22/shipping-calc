import type { Metadata } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "../globals.css";
import { locales } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { getCountryByCode, getCountryName } from "@/lib/data";
import Link from "next/link";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import MobileMenu from "@/components/MobileMenu";
import Analytics from "@/components/Analytics";
import AdSense from "@/components/AdSense";
import WebVitals from "@/components/WebVitals";
import ServiceWorker from "@/components/ServiceWorker";

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
  const BASE_URL = "https://rateships.com";
  return {
    title: {
      default: `${t(loc, "site_name")} — ${t(loc, "compare_rates")}`,
      template: `%s | ${t(loc, "site_name")}`,
    },
    description: t(loc, "site_description"),
    metadataBase: new URL(BASE_URL),
    openGraph: {
      type: "website",
      siteName: t(loc, "site_name"),
      locale: locale,
    },
    twitter: {
      card: "summary_large_image",
    },
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    },
    icons: {
      icon: "/favicon.svg",
    },
    manifest: "/manifest.json",
    verification: {
      google: process.env.NEXT_PUBLIC_GSC_ID || "google5ccb7b7d1567cd4b",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <head>
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TKV39RWK');`,
          }}
        />
      </head>
      <body className="min-h-screen bg-[#0a0a0a] text-gray-400 antialiased font-sans">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TKV39RWK"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Analytics />
        <AdSense />
        <WebVitals />
        <ServiceWorker />
        {/* WebSite + Organization JSON-LD (on every page) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "RateShips",
                url: "https://rateships.com",
                description: t(loc, "site_description"),
                inLanguage: locale,
                potentialAction: {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate: `https://rateships.com/${locale}/shipping/{search_term}`,
                  },
                  "query-input": "required name=search_term",
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "RateShips",
                url: "https://rateships.com",
                logo: "https://rateships.com/favicon.svg",
                description: t(loc, "site_description"),
                foundingDate: "2026",
                sameAs: [],
                contactPoint: {
                  "@type": "ContactPoint",
                  contactType: "customer support",
                  url: "https://rateships.com/en/about",
                  availableLanguage: ["English", "Russian", "Spanish", "German", "French", "Portuguese", "Chinese", "Japanese", "Korean", "Arabic", "Turkish", "Italian"],
                },
              },
            ]),
          }}
        />
        {/* Header */}
        <header className="sticky top-0 z-50 bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-12">
              <Link
                href={`/${locale}`}
                className="text-lg font-semibold tracking-tight text-white"
              >
                {t(loc, "site_name")}
              </Link>
              <div className="flex items-center gap-4">
                <nav className="hidden sm:flex items-center gap-6">
                  <Link
                    href={`/${locale}`}
                    className="text-sm text-gray-500 hover:text-white transition-opacity"
                  >
                    {t(loc, "home")}
                  </Link>
                  <Link
                    href={`/${locale}/carriers`}
                    className="text-sm text-gray-500 hover:text-white transition-opacity"
                  >
                    {t(loc, "carriers_page")}
                  </Link>
                  <Link
                    href={`/${locale}/guide`}
                    className="text-sm text-gray-500 hover:text-white transition-opacity"
                  >
                    {t(loc, "guides")}
                  </Link>
                  <Link
                    href={`/${locale}/about`}
                    className="text-sm text-gray-500 hover:text-white transition-opacity"
                  >
                    {t(loc, "about")}
                  </Link>
                  <Link
                    href={`/${locale}/blog`}
                    className="text-sm text-gray-500 hover:text-white transition-opacity"
                  >
                    {t(loc, "blog")}
                  </Link>
                  <Link
                    href={`/${locale}/platforms`}
                    className="text-sm text-gray-500 hover:text-white transition-opacity"
                  >
                    {t(loc, "platforms")}
                  </Link>
                </nav>
                <LanguageSwitcher locale={locale} />
                <MobileMenu
                  locale={locale}
                  labels={{
                    home: t(loc, "home"),
                    carriers: t(loc, "carriers_page"),
                    guides: t(loc, "guides"),
                    about: t(loc, "about"),
                    blog: t(loc, "blog"),
                    platforms: t(loc, "platforms"),
                  }}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="border-t border-white/5 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <h3 className="text-white font-semibold text-sm mb-3">
                  {t(loc, "site_name")}
                </h3>
                <p className="text-xs text-gray-500 mb-4">{t(loc, "site_description")}</p>
                <div className="flex flex-wrap gap-3 text-xs">
                  <Link href={`/${locale}`} className="text-gray-500 hover:text-white transition-colors">{t(loc, "home")}</Link>
                  <Link href={`/${locale}/carriers`} className="text-gray-500 hover:text-white transition-colors">{t(loc, "carriers_page")}</Link>
                  <Link href={`/${locale}/guide`} className="text-gray-500 hover:text-white transition-colors">{t(loc, "guides")}</Link>
                  <Link href={`/${locale}/about`} className="text-gray-500 hover:text-white transition-colors">{t(loc, "about")}</Link>
                  <Link href={`/${locale}/blog`} className="text-gray-500 hover:text-white transition-colors">{t(loc, "blog")}</Link>
                  <Link href={`/${locale}/platforms`} className="text-gray-500 hover:text-white transition-colors">{t(loc, "platforms")}</Link>
                  <Link href={`/${locale}/customs/united-states`} className="text-gray-500 hover:text-white transition-colors">{t(loc, "customs_info")}</Link>
                </div>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm mb-3">
                  {t(loc, "popular_destinations")}
                </h4>
                <div className="grid grid-cols-1 gap-1 text-xs">
                  {["US", "GB", "DE", "CN", "JP", "AU", "CA", "FR"].map((code) => {
                    const country = getCountryByCode(code);
                    if (!country) return null;
                    return (
                      <Link
                        key={code}
                        href={`/${locale}/shipping/to/${country.slug_en}`}
                        prefetch={false}
                        className="text-gray-500 hover:text-white transition-colors"
                      >
                        {t(loc, "ship_to", {
                          country: getCountryName(country, loc),
                        })}
                      </Link>
                    );
                  })}
                </div>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm mb-3">
                  {t(loc, "popular_origins")}
                </h4>
                <div className="grid grid-cols-1 gap-1 text-xs">
                  {["US", "CN", "GB", "DE", "JP", "KR", "IN", "RU"].map((code) => {
                    const country = getCountryByCode(code);
                    if (!country) return null;
                    return (
                      <Link
                        key={code}
                        href={`/${locale}/shipping/from/${country.slug_en}`}
                        prefetch={false}
                        className="text-gray-500 hover:text-white transition-colors"
                      >
                        {t(loc, "ship_from", {
                          country: getCountryName(country, loc),
                        })}
                      </Link>
                    );
                  })}
                </div>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm mb-3">
                  {t(loc, "information")}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">{t(loc, "disclaimer")}</p>
                <div className="flex flex-wrap gap-3 text-xs">
                  <Link href={`/${locale}/terms`} className="text-gray-500 hover:text-white transition-colors">
                    {locale === "ru" ? "Условия" : "Terms"}
                  </Link>
                  <Link href={`/${locale}/privacy`} className="text-gray-500 hover:text-white transition-colors">
                    {locale === "ru" ? "Конфиденциальность" : "Privacy"}
                  </Link>
                  <Link href={`/${locale}/data-methodology`} className="text-gray-500 hover:text-white transition-colors">
                    {locale === "ru" ? "Методология" : "Data Methodology"}
                  </Link>
                  <Link href={`/${locale}/sources`} className="text-gray-500 hover:text-white transition-colors">
                    {locale === "ru" ? "Источники данных" : "Data Sources"}
                  </Link>
                  <Link href={`/${locale}/team`} className="text-gray-500 hover:text-white transition-colors">
                    {locale === "ru" ? "Команда" : "Team"}
                  </Link>
                </div>
              </div>
            </div>
            <div className="border-t border-white/5 mt-8 pt-6 text-xs text-center text-gray-600">
              &copy; {new Date().getFullYear()} {t(loc, "site_name")}.{" "}
              {t(loc, "all_rights")}
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
