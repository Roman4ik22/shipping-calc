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
  const loc = locale as Locale;
  return {
    title: t(loc, "tools_meta_title"),
    description: t(loc, "tools_meta_desc"),
    alternates: {
      canonical: `/${locale}/tools`,
      languages: {
        ...Object.fromEntries(
          ["en", "ru", "es", "de", "fr", "pt", "zh", "ja", "ko", "ar", "tr", "it"].map((l) => [l, `/${l}/tools`])
        ),
        "x-default": "/en/tools",
      },
    },
  };
}

export default async function ToolsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;

  const tools = [
    {
      href: `/${locale}/tools/duty-calculator`,
      title: t(loc, "duty_calc_name"),
      description: t(loc, "duty_calc_desc"),
    },
    {
      href: `/${locale}/tools/delivery-estimator`,
      title: t(loc, "delivery_est_name"),
      description: t(loc, "delivery_est_desc"),
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t(loc, "shipping_tools"),
    description: t(loc, "free_shipping_calcs"),
    breadcrumb: {
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

      <nav className="text-sm text-body mb-6">
        <Link href={`/${locale}`} className="hover:text-accent-light">
          {t(loc, "home")}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{t(loc, "tools_label")}</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-4">
        {t(loc, "tools_page_title")}
      </h1>
      <p className="text-body mb-10 max-w-2xl">
        {t(loc, "tools_subtitle")}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group block bg-surface border border-line rounded-xl p-6 hover:border-accent/40 transition-colors card-hover"
          >
            <h2 className="text-xl font-semibold text-ink mb-2 group-hover:text-accent-light transition-colors card-hover">
              {tool.title}
            </h2>
            <p className="text-sm text-body">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
