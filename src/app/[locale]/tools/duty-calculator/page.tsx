import { Metadata } from "next";
import type { Locale } from "@/lib/types";
import Link from "next/link";
import DutyCalculatorStandalone from "@/components/DutyCalculatorStandalone";

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
      ? "Калькулятор таможенных пошлин и импортных налогов — RateShips"
      : "Customs Duty Calculator & Import Tax Calculator — RateShips",
    description: isRu
      ? "Бесплатный калькулятор таможенных пошлин и импортных налогов. Рассчитайте пошлины, НДС и общую стоимость импорта для любой страны."
      : "Free customs duty calculator and import tax calculator. Calculate duties, VAT, and total import costs for any destination country.",
    alternates: {
      canonical: `/${locale}/tools/duty-calculator`,
      languages: {
        ...Object.fromEntries(
          ["en", "ru", "es", "de", "fr", "pt", "zh", "ja", "ko", "ar", "tr", "it"].map((l) => [l, `/${l}/tools/duty-calculator`])
        ),
        "x-default": "/en/tools/duty-calculator",
      },
    },
    keywords: isRu
      ? ["калькулятор пошлин", "таможенный калькулятор", "импортный налог", "НДС калькулятор"]
      : ["customs duty calculator", "import tax calculator", "duty calculator", "VAT calculator"],
  };
}

export default async function DutyCalculatorPage({
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
        name: isRu ? "Калькулятор таможенных пошлин" : "Customs Duty Calculator",
        description: isRu
          ? "Рассчитайте импортные пошлины и налоги для любой страны"
          : "Calculate import duties and taxes for any country",
        url: `https://rateships.com/${locale}/tools/duty-calculator`,
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
            name: isRu ? "Калькулятор пошлин" : "Duty Calculator",
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
          {isRu ? "Калькулятор пошлин" : "Duty Calculator"}
        </span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
        {isRu ? "Калькулятор таможенных пошлин" : "Customs Duty Calculator"}
      </h1>
      <p className="text-gray-400 mb-8 max-w-2xl">
        {isRu
          ? "Рассчитайте импортные пошлины, НДС и общую стоимость импорта для товаров, отправляемых в любую страну"
          : "Calculate import duties, VAT, and total import costs for goods shipped to any country"}
      </p>

      <DutyCalculatorStandalone locale={locale} />
    </div>
  );
}
