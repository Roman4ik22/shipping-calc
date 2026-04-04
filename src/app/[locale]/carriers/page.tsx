import { Metadata } from "next";
import { carriers, getCarrierDescription } from "@/lib/data";
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
    title: t(loc, "carriers_title"),
    description: t(loc, "carriers_desc"),
    alternates: {
      canonical: `/${locale}/carriers`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/carriers`])),
    },
  };
}

export default async function CarriersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;

  const international = carriers.filter((c) => c.type === "international");
  const regional = carriers.filter((c) => c.type === "regional");
  const postal = carriers.filter((c) => c.type === "postal");

  const typeBadgeColor: Record<string, string> = {
    international: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    regional: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    postal: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  };

  const CarrierSection = ({
    title,
    items,
    isTop,
  }: {
    title: string;
    items: typeof carriers;
    isTop?: boolean;
  }) => (
    <section className="mb-10">
      <h2 className={`font-bold text-white mb-4 ${isTop ? "text-2xl" : "text-xl"}`}>{title}</h2>
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${isTop ? "lg:grid-cols-3" : ""}`}>
        {items.map((carrier) => (
          <Link
            key={carrier.id}
            href={`/${locale}/carriers/${carrier.id}`}
            prefetch={false}
            className="block bg-surface border border-white/10 rounded-lg p-5 hover:border-accent/50 hover:translate-y-[-2px] transition-all duration-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-white">
                {carrier.name}
              </h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${typeBadgeColor[carrier.type] ?? "bg-gray-500/20 text-gray-300 border-gray-500/30"}`}>
                {carrier.type}
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-3">
              {getCarrierDescription(carrier, loc)}
            </p>
            <div className="flex flex-wrap gap-1">
              {carrier.services.map((s) => (
                <span
                  key={s.id}
                  className="px-2 py-0.5 bg-gray-100 text-gray-400 text-xs rounded"
                >
                  {s.name}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">
        {t(loc, "all_carriers")}
      </h1>

      <CarrierSection
        title={t(loc, "international_carriers")}
        items={international}
        isTop
      />
      <CarrierSection
        title={t(loc, "regional_carriers")}
        items={regional}
      />
      <CarrierSection
        title={t(loc, "postal_services")}
        items={postal}
      />

      {/* ItemList JSON-LD for all carriers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: t(loc, "all_carriers"),
            numberOfItems: carriers.length,
            itemListElement: carriers.map((carrier, idx) => ({
              "@type": "ListItem",
              position: idx + 1,
              name: carrier.name,
              url: `${"https://rateships.com"}/${locale}/carriers/${carrier.id}`,
            })),
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
                name: t(loc, "carriers_page"),
              },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: t(loc, "carriers_title"),
            description: t(loc, "carriers_desc"),
            url: `https://rateships.com/${locale}/carriers`,
            inLanguage: locale,
            isPartOf: { "@type": "WebSite", name: "RateShips", url: "https://rateships.com" },
            dateModified: "2026-04-03",
          }),
        }}
      />
    </div>
  );
}
