import { Metadata } from "next";
import { platforms } from "@/data/platforms";
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
    title: t(loc, "platforms_title"),
    description: t(loc, "platforms_description"),
    alternates: {
      canonical: `/${locale}/platforms`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/platforms`])),
    },
  };
}

type FilterTab = "all" | "global" | "regional";

function PlatformCard({ platform }: { platform: (typeof platforms)[0] }) {
  return (
    <div className="bg-surface border border-white/10 rounded-lg p-5 hover:border-accent/50 transition-all flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-white text-lg leading-tight">
            {platform.company}
          </h3>
          <p className="text-sm text-gray-400 mt-0.5">{platform.countryHQ}</p>
        </div>
        <span className="shrink-0 ml-2 px-2 py-0.5 text-xs font-medium rounded bg-white/5 text-gray-300 border border-white/10">
          {platform.category}
        </span>
      </div>

      <p className="text-sm text-gray-300 mb-3">{platform.type}</p>

      <div className="space-y-1.5 text-sm text-gray-400 mb-4 flex-1">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{platform.coverage}</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          <span>{platform.carriers}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {platform.hasApi && (
          <span className="px-2 py-0.5 text-xs font-medium rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
            API
          </span>
        )}
        {platform.whiteLabel && (
          <span className="px-2 py-0.5 text-xs font-medium rounded bg-green-500/10 text-green-400 border border-green-500/20">
            White-Label
          </span>
        )}
        {platform.region !== "Global" && (
          <span className="px-2 py-0.5 text-xs font-medium rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
            {platform.region}
          </span>
        )}
      </div>

      <a
        href={`https://${platform.website}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm text-accent-light hover:text-accent transition-colors mt-auto"
      >
        {platform.website}
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </div>
  );
}

function FilterTabs({ locale }: { locale: string }) {
  const tabs: { key: FilterTab; label: string; href: string }[] = [
    { key: "all", label: "All", href: `/${locale}/platforms` },
    { key: "global", label: "Global", href: `/${locale}/platforms?filter=global` },
    { key: "regional", label: "Regional", href: `/${locale}/platforms?filter=regional` },
  ];

  return (
    <div className="flex gap-2 mb-8">
      {tabs.map((tab) => (
        <a
          key={tab.key}
          href={tab.href}
          className="px-4 py-2 text-sm font-medium rounded-lg border border-white/10 text-gray-300 hover:text-white hover:border-accent/50 bg-surface transition-all"
        >
          {tab.label}
        </a>
      ))}
    </div>
  );
}

export default async function PlatformsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ filter?: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;
  const { filter } = await searchParams;

  const filtered =
    filter === "global"
      ? platforms.filter((p) => p.category === "Global")
      : filter === "regional"
        ? platforms.filter((p) => p.category === "Regional")
        : platforms;

  const globalPlatforms = filtered.filter((p) => p.category === "Global");
  const regionalByRegion = filtered
    .filter((p) => p.category === "Regional")
    .reduce(
      (acc, p) => {
        if (!acc[p.region]) acc[p.region] = [];
        acc[p.region].push(p);
        return acc;
      },
      {} as Record<string, typeof platforms>,
    );

  const regionOrder = [
    "Europe",
    "North America",
    "Latin America",
    "East Asia",
    "Southeast Asia",
    "India",
    "Middle East",
    "Oceania",
    "Africa",
    "CIS / Turkey",
    "Forwarding",
  ];

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://rateships.com";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href={`/${locale}`} className="hover:text-white transition-colors">
          {t(loc, "home")}
        </Link>
        <span>/</span>
        <span className="text-white">{t(loc, "platforms")}</span>
      </nav>

      {/* Hero */}
      <section className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          {t(loc, "platforms_title")}
        </h1>
        <p className="text-lg text-gray-400 max-w-3xl">
          {t(loc, "platforms_description")}
        </p>
        <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
          <span>{platforms.length} platforms</span>
          <span>{platforms.filter((p) => p.category === "Global").length} global</span>
          <span>{platforms.filter((p) => p.category === "Regional").length} regional</span>
        </div>
      </section>

      {/* Filter Tabs */}
      <FilterTabs locale={locale} />

      {/* Global Platforms */}
      {globalPlatforms.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-accent-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Global Platforms ({globalPlatforms.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {globalPlatforms.map((p) => (
              <PlatformCard key={p.id} platform={p} />
            ))}
          </div>
        </section>
      )}

      {/* Regional Providers by region */}
      {regionOrder
        .filter((region) => regionalByRegion[region]?.length)
        .map((region) => (
          <section key={region} className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4">{region} ({regionalByRegion[region].length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {regionalByRegion[region].map((p) => (
                <PlatformCard key={p.id} platform={p} />
              ))}
            </div>
          </section>
        ))}

      {/* JSON-LD ItemList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: t(loc, "platforms_title"),
            numberOfItems: platforms.length,
            itemListElement: platforms.map((p, idx) => ({
              "@type": "ListItem",
              position: idx + 1,
              name: p.company,
              url: `https://${p.website}`,
            })),
          }),
        }}
      />

      {/* Breadcrumb JSON-LD */}
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
                item: `${BASE_URL}/${locale}`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: t(loc, "platforms"),
              },
            ],
          }),
        }}
      />
    </div>
  );
}
