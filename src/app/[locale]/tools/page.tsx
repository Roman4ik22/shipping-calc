import { Metadata } from "next";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import Link from "next/link";

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
      ? "Инструменты для международной доставки — RateShips"
      : "International Shipping Tools — RateShips",
    description: isRu
      ? "Бесплатные калькуляторы таможенных пошлин, налогов и сроков доставки для международных отправлений"
      : "Free customs duty calculator, import tax calculator, and delivery time estimator for international shipments",
    alternates: {
      canonical: `/${locale}/tools`,
    },
  };
}

export default async function ToolsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isRu = locale === "ru";

  const tools = [
    {
      href: `/${locale}/tools/duty-calculator`,
      title: isRu ? "Калькулятор таможенных пошлин" : "Customs Duty Calculator",
      description: isRu
        ? "Рассчитайте импортные пошлины, НДС и общую стоимость импорта для любой страны назначения"
        : "Calculate import duties, VAT, and total import costs for any destination country",
    },
    {
      href: `/${locale}/tools/delivery-estimator`,
      title: isRu ? "Калькулятор сроков доставки" : "Delivery Time Estimator",
      description: isRu
        ? "Узнайте ориентировочные сроки доставки для экспресс, стандартных и экономичных отправлений"
        : "Estimate delivery times for express, standard, and economy shipments between countries",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: isRu ? "Инструменты для доставки" : "Shipping Tools",
    description: isRu
      ? "Бесплатные калькуляторы для международной доставки"
      : "Free calculators for international shipping",
    breadcrumb: {
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
        },
      ],
    },
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
        <span className="text-white">{isRu ? "Инструменты" : "Tools"}</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
        {isRu ? "Инструменты для международной доставки" : "International Shipping Tools"}
      </h1>
      <p className="text-gray-400 mb-10 max-w-2xl">
        {isRu
          ? "Бесплатные калькуляторы для расчёта пошлин, налогов и сроков доставки"
          : "Free calculators to estimate customs duties, taxes, and delivery times for international shipments"}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group block bg-surface border border-white/10 rounded-xl p-6 hover:border-accent/40 transition-colors"
          >
            <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-accent-light transition-colors">
              {tool.title}
            </h2>
            <p className="text-sm text-gray-400">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
