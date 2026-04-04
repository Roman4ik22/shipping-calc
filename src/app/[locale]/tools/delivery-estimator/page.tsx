import { Metadata } from "next";
import type { Locale } from "@/lib/types";
import Link from "next/link";
import DeliveryEstimatorStandalone from "@/components/DeliveryEstimatorStandalone";

export const dynamicParams = true;

export function generateStaticParams() {
  return [{ locale: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isRu = locale === "ru";
  return {
    title: isRu
      ? "Калькулятор сроков доставки — RateShips"
      : "Shipping Time Calculator & Delivery Date Estimator — RateShips",
    description: isRu
      ? "Бесплатный калькулятор сроков международной доставки. Узнайте ориентировочные сроки для экспресс, стандартных и экономичных отправлений."
      : "Free shipping time calculator and delivery date estimator. Estimate delivery times for express, standard, and economy international shipments.",
    alternates: {
      canonical: `/${locale}/tools/delivery-estimator`,
      languages: {
        ...Object.fromEntries(
          ["en", "ru", "es", "de", "fr", "pt", "zh", "ja", "ko", "ar", "tr", "it"].map((l) => [l, `/${l}/tools/delivery-estimator`])
        ),
        "x-default": "/en/tools/delivery-estimator",
      },
    },
    keywords: isRu
      ? ["калькулятор доставки", "сроки доставки", "дата доставки", "время доставки"]
      : ["shipping time calculator", "delivery date estimator", "delivery time calculator", "shipping estimator"],
  };
}

export default async function DeliveryEstimatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isRu = locale === "ru";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: isRu ? "Калькулятор сроков доставки" : "Delivery Time Estimator",
        description: isRu
          ? "Узнайте ориентировочные сроки международной доставки"
          : "Estimate international shipping delivery times",
        url: `https://rateships.com/${locale}/tools/delivery-estimator`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: isRu ? "Главная" : "Home",
            item: `https://rateships.com/${locale}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: isRu ? "Инструменты" : "Tools",
            item: `https://rateships.com/${locale}/tools`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: isRu ? "Сроки доставки" : "Delivery Estimator",
          },
        ],
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="text-sm text-gray-400 mb-6">
        <Link href={`/${locale}`} className="hover:text-accent-light">
          {isRu ? "Главная" : "Home"}
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/tools`} className="hover:text-accent-light">
          {isRu ? "Инструменты" : "Tools"}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-white">
          {isRu ? "Сроки доставки" : "Delivery Estimator"}
        </span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
        {isRu ? "Калькулятор сроков доставки" : "Delivery Time Estimator"}
      </h1>
      <p className="text-gray-400 mb-8 max-w-2xl">
        {isRu
          ? "Узнайте ориентировочные сроки доставки между странами для экспресс, стандартных и экономичных отправлений"
          : "Estimate shipping times between countries for express, standard, and economy services"}
      </p>

      <DeliveryEstimatorStandalone locale={locale} />
    </div>
  );
}
