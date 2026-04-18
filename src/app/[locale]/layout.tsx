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
import NavLink from "@/components/NavLink";
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
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}`])),
        "x-default": "/en",
      },
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
  const validLocales = ["en", "ru", "es", "de", "fr", "pt", "zh", "ja", "ko", "ar", "tr", "it"];
  if (!validLocales.includes(locale)) {
    const { notFound } = await import("next/navigation");
    notFound();
  }
  const loc = locale as Locale;

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <head>
        <link rel="alternate" type="application/rss+xml" title="RateShips Blog" href="/feed.xml" />
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
      <body className="min-h-screen bg-bg text-body antialiased font-sans">
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
                legalName: "Global Supply KFT",
                url: "https://rateships.com",
                logo: "https://rateships.com/favicon.svg",
                description: t(loc, "site_description"),
                foundingDate: "2026",
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
                sameAs: [],
                contactPoint: {
                  "@type": "ContactPoint",
                  contactType: "customer support",
                  email: "info@rateships.com",
                  url: "https://rateships.com/en/about",
                  availableLanguage: ["English", "Russian", "Spanish", "German", "French", "Portuguese", "Chinese", "Japanese", "Korean", "Arabic", "Turkish", "Italian"],
                },
              },
            ]),
          }}
        />
        {/* Header */}
        <header className="sticky top-0 z-50 bg-bg/85 backdrop-blur-lg backdrop-saturate-[1.2] border-b border-line">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-14">
              <NavLink
                href={`/${locale}`}
                className="text-lg font-extrabold tracking-tight text-ink"
                activeClassName="text-lg font-extrabold tracking-tight text-ink"
              >
                {t(loc, "site_name")}
              </NavLink>
              <div className="flex items-center gap-5">
                <nav className="hidden sm:flex items-center gap-6">
                  <NavLink
                    href={`/${locale}`}
                    className="text-sm font-medium text-body hover:text-ink transition-colors"
                    activeClassName="text-sm font-medium text-ink transition-colors"
                  >
                    {t(loc, "home")}
                  </NavLink>
                  <NavLink
                    href={`/${locale}/carriers`}
                    className="text-sm font-medium text-body hover:text-ink transition-colors"
                    activeClassName="text-sm font-medium text-ink transition-colors"
                  >
                    {t(loc, "carriers_page")}
                  </NavLink>
                  <NavLink
                    href={`/${locale}/guide`}
                    className="text-sm font-medium text-body hover:text-ink transition-colors"
                    activeClassName="text-sm font-medium text-ink transition-colors"
                  >
                    {t(loc, "guides")}
                  </NavLink>
                  <NavLink
                    href={`/${locale}/about`}
                    className="text-sm font-medium text-body hover:text-ink transition-colors"
                    activeClassName="text-sm font-medium text-ink transition-colors"
                  >
                    {t(loc, "about")}
                  </NavLink>
                  <NavLink
                    href={`/${locale}/blog`}
                    className="text-sm font-medium text-body hover:text-ink transition-colors"
                    activeClassName="text-sm font-medium text-ink transition-colors"
                  >
                    {t(loc, "blog")}
                  </NavLink>
                  <NavLink
                    href={`/${locale}`}
                    className="px-4 py-2 bg-ink text-white text-sm font-semibold rounded-full hover:bg-ink/90 transition-colors"
                    activeClassName="px-4 py-2 bg-ink text-white text-sm font-semibold rounded-full opacity-70"
                  >
                    {t(loc, "compare_rates")}
                  </NavLink>
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
        <footer className="mt-16 bg-ink text-white px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-[1240px] mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <h3 className="text-white font-bold text-sm mb-3">
                  {t(loc, "site_name")}
                </h3>
                <p className="text-xs text-white/55 mb-4 leading-relaxed">{t(loc, "site_description")}</p>
                <div className="flex flex-wrap gap-3 text-xs">
                  <NavLink href={`/${locale}`} className="text-white/55 hover:text-white transition-colors" activeClassName="text-white">{t(loc, "home")}</NavLink>
                  <NavLink href={`/${locale}/carriers`} className="text-white/55 hover:text-white transition-colors" activeClassName="text-white">{t(loc, "carriers_page")}</NavLink>
                  <NavLink href={`/${locale}/guide`} className="text-white/55 hover:text-white transition-colors" activeClassName="text-white">{t(loc, "guides")}</NavLink>
                  <NavLink href={`/${locale}/about`} className="text-white/55 hover:text-white transition-colors" activeClassName="text-white">{t(loc, "about")}</NavLink>
                  <NavLink href={`/${locale}/blog`} className="text-white/55 hover:text-white transition-colors" activeClassName="text-white">{t(loc, "blog")}</NavLink>
                  <NavLink href={`/${locale}/platforms`} className="text-white/55 hover:text-white transition-colors" activeClassName="text-white">{t(loc, "platforms")}</NavLink>
                  <Link href={`/${locale}/customs/united-states`} className="text-white/55 hover:text-white transition-colors">{t(loc, "customs_info")}</Link>
                </div>
              </div>
              <div>
                <h4 className="text-white font-bold text-sm mb-3">
                  {t(loc, "popular_destinations")}
                </h4>
                <div className="grid grid-cols-1 gap-1.5 text-xs">
                  {["US", "GB", "DE", "CN", "JP", "AU", "CA", "FR"].map((code) => {
                    const country = getCountryByCode(code);
                    if (!country) return null;
                    return (
                      <NavLink
                        key={code}
                        href={`/${locale}/shipping/to/${country.slug_en}`}
                        className="text-white/55 hover:text-white transition-colors"
                        activeClassName="text-white"
                      >
                        {t(loc, "ship_to", {
                          country: getCountryName(country, loc),
                        })}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
              <div>
                <h4 className="text-white font-bold text-sm mb-3">
                  {t(loc, "popular_origins")}
                </h4>
                <div className="grid grid-cols-1 gap-1.5 text-xs">
                  {["US", "CN", "GB", "DE", "JP", "KR", "IN", "RU"].map((code) => {
                    const country = getCountryByCode(code);
                    if (!country) return null;
                    return (
                      <NavLink
                        key={code}
                        href={`/${locale}/shipping/from/${country.slug_en}`}
                        className="text-white/55 hover:text-white transition-colors"
                        activeClassName="text-white"
                      >
                        {t(loc, "ship_from", {
                          country: getCountryName(country, loc),
                        })}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
              <div>
                <h4 className="text-white font-bold text-sm mb-3">
                  {t(loc, "information")}
                </h4>
                <p className="text-xs text-white/40 leading-relaxed mb-4">{t(loc, "disclaimer")}</p>
                <div className="flex flex-wrap gap-3 text-xs">
                  <Link href={`/${locale}/terms`} className="text-white/55 hover:text-white transition-colors">
                    {t(loc, "terms_link")}
                  </Link>
                  <Link href={`/${locale}/privacy`} className="text-white/55 hover:text-white transition-colors">
                    {t(loc, "privacy_link")}
                  </Link>
                  <Link href={`/${locale}/data-methodology`} className="text-white/55 hover:text-white transition-colors">
                    {t(loc, "methodology_link")}
                  </Link>
                  <Link href={`/${locale}/sources`} className="text-white/55 hover:text-white transition-colors">
                    {t(loc, "sources_link")}
                  </Link>
                  <Link href={`/${locale}/team`} className="text-white/55 hover:text-white transition-colors">
                    {t(loc, "team_link")}
                  </Link>
                  <Link href={`/${locale}/updates`} className="text-white/55 hover:text-white transition-colors">
                    {t(loc, "updates_link")}
                  </Link>
                </div>
              </div>
            </div>
            <div className="mt-10 pt-6 border-t border-white/10 text-xs text-center text-white/40">
              &copy; {new Date().getFullYear()} Global Supply KFT · 134 carriers · 213 countries · Updated weekly
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
