import { Metadata } from "next";
import { locales, t } from "@/lib/i18n";
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
    title: t(loc, "terms_title"),
    description: t(loc, "terms_meta_desc"),
    alternates: {
      canonical: `/${locale}/terms`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}/terms`])),
        "x-default": "/en/terms",
      },
    },
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* BreadcrumbList JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: t(loc, "home"), item: `https://rateships.com/${locale}` },
              { "@type": "ListItem", position: 2, name: t(loc, "terms_title") },
            ],
          }),
        }}
      />

      <nav className="text-sm text-gray-400 mb-6">
        <Link href={`/${locale}`} className="hover:text-accent-light">
          {t(loc, "home")}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-white">
          {t(loc, "terms_title")}
        </span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6">
        {t(loc, "terms_title")}
      </h1>

      <div className="space-y-6 text-gray-300 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            {t(loc, "terms_s1_title")}
          </h2>
          <p>{t(loc, "terms_s1_body")}</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            {t(loc, "terms_s2_title")}
          </h2>
          <p>{t(loc, "terms_s2_body")}</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            {t(loc, "terms_s3_title")}
          </h2>
          <p>{t(loc, "terms_s3_body")}</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            {t(loc, "terms_s4_title")}
          </h2>
          <p>{t(loc, "terms_s4_body")}</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            {t(loc, "terms_s5_title")}
          </h2>
          <p>{t(loc, "terms_s5_body")}</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            {t(loc, "terms_s6_title")}
          </h2>
          <p>{t(loc, "terms_s6_body")}</p>
        </section>

        <p className="text-sm text-gray-500 pt-4 border-t border-white/10">
          {t(loc, "last_updated_march")}
        </p>
      </div>
    </div>
  );
}
