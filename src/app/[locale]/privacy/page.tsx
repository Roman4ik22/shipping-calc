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
    title: t(loc, "privacy_title"),
    description: t(loc, "privacy_meta_desc"),
    alternates: {
      canonical: `/${locale}/privacy`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}/privacy`])),
        "x-default": "/en/privacy",
      },
    },
  };
}

export default async function PrivacyPage({
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
              { "@type": "ListItem", position: 2, name: t(loc, "privacy_title") },
            ],
          }),
        }}
      />

      <nav className="text-sm text-body mb-6">
        <Link href={`/${locale}`} className="hover:text-accent-light">
          {t(loc, "home")}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">
          {t(loc, "privacy_title")}
        </span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-6">
        {t(loc, "privacy_title")}
      </h1>

      <div className="space-y-6 text-body leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-ink mb-3">
            {t(loc, "privacy_s1_title")}
          </h2>
          <p>{t(loc, "privacy_s1_body")}</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink mb-3">
            {t(loc, "privacy_s2_title")}
          </h2>
          <p>{t(loc, "privacy_s2_body")}</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink mb-3">
            {t(loc, "privacy_s3_title")}
          </h2>
          <p>{t(loc, "privacy_s3_body")}</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink mb-3">
            {t(loc, "privacy_s4_title")}
          </h2>
          <p>{t(loc, "privacy_s4_body")}</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink mb-3">
            {t(loc, "privacy_s5_title")}
          </h2>
          <p>{t(loc, "privacy_s5_body")}</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink mb-3">
            {t(loc, "privacy_s6_title")}
          </h2>
          <p>{t(loc, "privacy_s6_body")}</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink mb-3">
            {t(loc, "privacy_s7_title")}
          </h2>
          <p>
            {t(loc, "privacy_s7_body")}
            <span className="font-medium text-ink">privacy@rateships.com</span>
          </p>
        </section>

        <p className="text-sm text-muted pt-4 border-t border-line">
          {t(loc, "last_updated_march")}
        </p>
      </div>
    </div>
  );
}
