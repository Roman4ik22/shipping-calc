import { Metadata } from "next";
import { carriers, getCarrierById, getCarrierDescription } from "@/lib/data";
import { t, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
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

  return {
    title: `${carrier.name} — ${t(locale as Locale, "shipping")}`,
    description: getCarrierDescription(carrier, locale as Locale),
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
      <nav className="text-sm text-gray-500 mb-6">
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
            {loc === "ru" ? "Официальный сайт" : "Official Website"}
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
                <span className="text-gray-500">
                  {t(loc, "delivery_time")}:
                </span>
                <p className="font-medium">
                  {service.speed_days_min}–{service.speed_days_max}{" "}
                  {t(loc, "days")}
                </p>
              </div>
              <div>
                <span className="text-gray-500">
                  {loc === "ru" ? "Макс. вес" : "Max weight"}:
                </span>
                <p className="font-medium">{service.max_weight_kg} {t(loc, "kg")}</p>
              </div>
              <div>
                <span className="text-gray-500">{t(loc, "tracking")}:</span>
                <p className="font-medium">
                  {service.tracking ? t(loc, "yes") : t(loc, "no")}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
