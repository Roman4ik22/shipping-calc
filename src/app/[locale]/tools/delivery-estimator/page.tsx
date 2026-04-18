import { Metadata } from "next";
import { t } from "@/lib/i18n";
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
  const loc = locale as Locale;
  return {
    title: t(loc, "delivery_est_meta_title"),
    description: t(loc, "delivery_est_meta_desc"),
    alternates: {
      canonical: `/${locale}/tools/delivery-estimator`,
      languages: {
        ...Object.fromEntries(
          ["en", "ru", "es", "de", "fr", "pt", "zh", "ja", "ko", "ar", "tr", "it"].map((l) => [l, `/${l}/tools/delivery-estimator`])
        ),
        "x-default": "/en/tools/delivery-estimator",
      },
    },
    keywords: t(loc, "delivery_est_kw").split(","),
  };
}

export default async function DeliveryEstimatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: t(loc, "delivery_est_page_name"),
        description: t(loc, "delivery_est_page_desc"),
        url: `https://rateships.com/${locale}/tools/delivery-estimator`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: t(loc, "home"),
            item: `https://rateships.com/${locale}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: t(loc, "tools_label"),
            item: `https://rateships.com/${locale}/tools`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: t(loc, "delivery_est_breadcrumb"),
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

      <nav className="text-sm text-body mb-6">
        <Link href={`/${locale}`} className="hover:text-accent-light">
          {t(loc, "home")}
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/tools`} className="hover:text-accent-light">
          {t(loc, "tools_label")}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">
          {t(loc, "delivery_est_breadcrumb")}
        </span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-4">
        {t(loc, "delivery_est_page_name")}
      </h1>
      <p className="text-body mb-8 max-w-2xl">
        {t(loc, "delivery_est_body")}
      </p>

      <DeliveryEstimatorStandalone locale={locale} />
    </div>
  );
}
