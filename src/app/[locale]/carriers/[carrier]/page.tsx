import { Metadata } from "next";
import { carriers, getCarrierById, getCarrierDescription, getPopularCountries, getCountryName, makeCorridorSlug } from "@/lib/data";
import { t, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { countryFlag } from "@/lib/flags";
import Link from "next/link";

export function generateStaticParams() {
  const params: { locale: string; carrier: string }[] = [];
  for (const locale of locales) {
    for (const c of carriers) {
      params.push({ locale, carrier: c.id });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; carrier: string }>;
}): Promise<Metadata> {
  const { locale, carrier: carrierId } = await params;
  const carrier = getCarrierById(carrierId);
  if (!carrier) return { title: "Not Found" };

  const desc = getCarrierDescription(carrier, locale as Locale);
  return {
    title: `${carrier.name} — ${t(locale as Locale, "shipping")}`,
    description: desc,
    alternates: {
      canonical: `/${locale}/carriers/${carrierId}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/carriers/${carrierId}`])),
    },
    openGraph: {
      title: `${carrier.name} — International Shipping Rates`,
      description: desc,
      type: "website",
    },
  };
}

export default async function CarrierPage({
  params,
}: {
  params: Promise<{ locale: string; carrier: string }>;
}) {
  const { locale, carrier: carrierId } = await params;
  const loc = locale as Locale;
  const carrier = getCarrierById(carrierId);

  if (!carrier) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Carrier not found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-gray-600 mb-6">
        <Link href={`/${locale}`} className="hover:text-blue-600">
          {t(loc, "home")}
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/carriers`} className="hover:text-blue-600">
          {t(loc, "carriers_page")}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{carrier.name}</span>
      </nav>

      <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 mb-8">
        <div className="flex items-start gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {carrier.name}
            </h1>
            <span
              className={`inline-block mt-2 px-3 py-1 text-sm rounded-full ${
                carrier.type === "international"
                  ? "bg-purple-100 text-purple-700"
                  : carrier.type === "postal"
                  ? "bg-orange-100 text-orange-700"
                  : "bg-teal-100 text-teal-700"
              }`}
            >
              {carrier.type}
            </span>
          </div>
        </div>

        <p className="text-gray-600 text-lg mb-6">
          {getCarrierDescription(carrier, loc)}
        </p>

        <div className="flex gap-4">
          <a
            href={carrier.website}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            {t(loc, "official_website")}
          </a>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-4">
        {t(loc, "available_services")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {carrier.services.map((service) => (
          <div
            key={service.id}
            className="bg-white border border-gray-200 rounded-lg p-5"
          >
            <h3 className="font-semibold text-gray-900 mb-2">
              {service.name}
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">
                  {t(loc, "delivery_time")}:
                </span>
                <p className="font-medium">
                  {service.speed_days_min}–{service.speed_days_max}{" "}
                  {t(loc, "days")}
                </p>
              </div>
              <div>
                <span className="text-gray-600">
                  {t(loc, "max_weight")}:
                </span>
                <p className="font-medium">{service.max_weight_kg} {t(loc, "kg")}</p>
              </div>
              <div>
                <span className="text-gray-600">{t(loc, "tracking")}:</span>
                <p className="font-medium">
                  {service.tracking ? t(loc, "yes") : t(loc, "no")}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Popular corridors for this carrier */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        {t(loc, "popular_routes_carrier", { carrier: carrier.name })}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {(() => {
          const popular = getPopularCountries().slice(0, 10);
          const corridors: { from: typeof popular[0]; to: typeof popular[0] }[] = [];
          for (let i = 0; i < popular.length && corridors.length < 9; i++) {
            for (let j = 0; j < popular.length && corridors.length < 9; j++) {
              if (i !== j) corridors.push({ from: popular[i], to: popular[j] });
            }
          }
          return corridors.map(({ from, to }) => (
            <Link
              key={`${from.code}-${to.code}`}
              href={`/${locale}/shipping/${makeCorridorSlug(from, to, loc)}`}
              className="block bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-300 hover:shadow-sm transition-all text-sm"
            >
              {countryFlag(from.code)} {getCountryName(from, loc)} → {getCountryName(to, loc)} {countryFlag(to.code)}
            </Link>
          ));
        })()}
      </div>

      {/* Shipping guides */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        {t(loc, "guides_heading")}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-8">
        {getPopularCountries().slice(0, 8).map((c) => (
          <Link
            key={c.code}
            href={`/${locale}/guide/${c.slug_en}`}
            className="text-sm text-blue-600 hover:text-blue-800 py-1"
          >
            {countryFlag(c.code)} {getCountryName(c, loc)}
          </Link>
        ))}
      </div>

      {/* BreadcrumbList JSON-LD */}
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
                item: `${process.env.NEXT_PUBLIC_BASE_URL || "https://shipworldwide.com"}/${locale}/carriers`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: carrier.name,
              },
            ],
          }),
        }}
      />

      {/* Back to carriers */}
      <Link
        href={`/${locale}/carriers`}
        className="text-blue-600 hover:text-blue-800 text-sm"
      >
        ← {t(loc, "all_carriers")}
      </Link>
    </div>
  );
}
