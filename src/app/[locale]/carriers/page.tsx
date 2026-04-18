import { Metadata } from "next";
import { carriers, getCarrierDescription } from "@/lib/data";
import { t, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import Link from "next/link";
import ExpandableGrid from "@/components/ExpandableGrid";

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
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}/carriers`])),
        "x-default": "/en/carriers",
      },
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

  // Featured layout for international carriers (few, important)
  const FeaturedCarrierSection = ({ title, items }: { title: string; items: typeof carriers }) => (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-ink mb-5">{title}</h2>
      <div className="space-y-3">
        {items.map((carrier) => (
          <Link
            key={carrier.id}
            href={`/${locale}/carriers/${carrier.id}`}
            prefetch={false}
            className="flex items-start gap-5 bg-surface border border-line rounded-lg p-5 hover:border-accent/50 transition-all"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-ink text-lg">{carrier.name}</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${typeBadgeColor[carrier.type] ?? "bg-gray-500/20 text-body border-gray-500/30"}`}>
                  {carrier.type}
                </span>
              </div>
              <p className="text-sm text-body">{getCarrierDescription(carrier, loc)}</p>
            </div>
            <div className="flex flex-wrap gap-1 max-w-xs shrink-0">
              {carrier.services.map((s) => (
                <span key={s.id} className="px-2 py-0.5 bg-white/5 text-muted text-xs rounded">{s.name}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );

  // Compact layout for regional/postal (many, less detail needed)
  const CompactCarrierSection = ({ title, items }: { title: string; items: typeof carriers }) => (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-ink mb-4">{title} <span className="text-sm font-normal text-muted">({items.length})</span></h2>
      <ExpandableGrid
        visibleCount={12}
        showMoreLabel={t(loc, "show_all")}
        showLessLabel={t(loc, "show_less")}
        className="flex flex-wrap gap-2"
      >
        {items.map((carrier) => (
          <Link
            key={carrier.id}
            href={`/${locale}/carriers/${carrier.id}`}
            prefetch={false}
            className="flex items-center gap-2 bg-card hover:bg-card-hover rounded-lg px-4 py-3 transition-colors"
          >
            <span className="font-medium text-ink text-sm">{carrier.name}</span>
            <span className="text-xs text-muted">{carrier.services.length} {t(loc, "svc_short")}</span>
          </Link>
        ))}
      </ExpandableGrid>
    </section>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-ink mb-8">
        {t(loc, "all_carriers")}
      </h1>

      <FeaturedCarrierSection
        title={t(loc, "international_carriers")}
        items={international}
      />
      <CompactCarrierSection
        title={t(loc, "regional_carriers")}
        items={regional}
      />
      <CompactCarrierSection
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
