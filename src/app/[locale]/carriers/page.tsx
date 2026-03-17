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

  const CarrierSection = ({
    title,
    items,
  }: {
    title: string;
    items: typeof carriers;
  }) => (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((carrier) => (
          <Link
            key={carrier.id}
            href={`/${locale}/carriers/${carrier.id}`}
            prefetch={false}
            className="block bg-surface border border-white/10 rounded-lg p-5 hover:border-accent/50 transition-all"
          >
            <h3 className="font-semibold text-white mb-2">
              {carrier.name}
            </h3>
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
              url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://shipworldwide.com"}/${locale}/carriers/${carrier.id}`,
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
                item: `${process.env.NEXT_PUBLIC_BASE_URL || "https://shipworldwide.com"}/${locale}`,
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
    </div>
  );
}
