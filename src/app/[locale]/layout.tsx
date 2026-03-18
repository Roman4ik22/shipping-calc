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
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://rateships.com";
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
      </head>
      <body className="min-h-screen bg-dark-900 text-gray-100 antialiased font-sans">
        <Analytics />
        <AdSense />
        <WebVitals />
        <ServiceWorker />
        {/* Organization JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "RateShips",
              url: process.env.NEXT_PUBLIC_BASE_URL || "https://rateships.com",
              description: t(loc, "site_description"),
              inLanguage: locale,
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${process.env.NEXT_PUBLIC_BASE_URL || "https://rateships.com"}/${locale}/shipping/{search_term}`,
                },
                "query-input": "required name=search_term",
              },
            }),
          }}
        />
        {/* Header */}
        <header className="bg-dark-800/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link
                href={`/${locale}`}
                className="text-xl font-bold text-accent-light"
              >
                {t(loc, "site_name")}
              </Link>
              <div className="flex items-center gap-4">
                <nav className="hidden sm:flex items-center gap-6">
                  <Link
                    href={`/${locale}`}
                    className="text-sm text-gray-300 hover:text-white font-medium transition-colors"
                  >
                    {t(loc, "home")}
                  </Link>
                  <Link
                    href={`/${locale}/carriers`}
                    className="text-sm text-gray-300 hover:text-white font-medium transition-colors"
                  >
                    {t(loc, "carriers_page")}
                  </Link>
                  <Link
                    href={`/${locale}/guide`}
                    className="text-sm text-gray-300 hover:text-white font-medium transition-colors"
                  >
                    {t(loc, "guides")}
                  </Link>
                  <Link
                    href={`/${locale}/about`}
                    className="text-sm text-gray-300 hover:text-white font-medium transition-colors"
                  >
                    {t(loc, "about")}
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
                  }}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="bg-dark-800 border-t border-white/10 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <h3 className="text-white font-bold text-lg mb-3">
                  {t(loc, "site_name")}
                </h3>
                <p className="text-sm text-gray-400 mb-4">{t(loc, "site_description")}</p>
                <div className="flex flex-wrap gap-3 text-sm">
                  <Link href={`/${locale}`} className="text-gray-400 hover:text-accent-light transition-colors">{t(loc, "home")}</Link>
                  <Link href={`/${locale}/carriers`} className="text-gray-400 hover:text-accent-light transition-colors">{t(loc, "carriers_page")}</Link>
                  <Link href={`/${locale}/guide`} className="text-gray-400 hover:text-accent-light transition-colors">{t(loc, "guides")}</Link>
                  <Link href={`/${locale}/about`} className="text-gray-400 hover:text-accent-light transition-colors">{t(loc, "about")}</Link>
                </div>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3">
                  {t(loc, "popular_destinations")}
                </h4>
                <div className="grid grid-cols-1 gap-1 text-sm">
                  {["US", "GB", "DE", "CN", "JP", "AU", "CA", "FR"].map((code) => {
                    const country = getCountryByCode(code);
                    if (!country) return null;
                    return (
                      <Link
                        key={code}
                        href={`/${locale}/shipping/to/${country.slug_en}`}
                        prefetch={false}
                        className="text-gray-400 hover:text-accent-light transition-colors"
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
                <h4 className="text-white font-semibold mb-3">
                  {t(loc, "popular_origins")}
                </h4>
                <div className="grid grid-cols-1 gap-1 text-sm">
                  {["US", "CN", "GB", "DE", "JP", "KR", "IN", "RU"].map((code) => {
                    const country = getCountryByCode(code);
                    if (!country) return null;
                    return (
                      <Link
                        key={code}
                        href={`/${locale}/shipping/from/${country.slug_en}`}
                        prefetch={false}
                        className="text-gray-400 hover:text-accent-light transition-colors"
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
                <h4 className="text-white font-semibold mb-3">
                  {t(loc, "information")}
                </h4>
                <p className="text-sm text-gray-500 leading-relaxed">{t(loc, "disclaimer")}</p>
              </div>
            </div>
            <div className="border-t border-white/10 mt-8 pt-6 text-sm text-center text-gray-500">
              &copy; {new Date().getFullYear()} {t(loc, "site_name")}.{" "}
              {t(loc, "all_rights")}
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
