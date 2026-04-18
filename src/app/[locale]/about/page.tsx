import { Metadata } from "next";
import { t, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import AboutV2 from "@/components/AboutV2";

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
    title: t(loc, "about_title"),
    description: t(loc, "about_desc"),
    alternates: {
      canonical: `/${locale}/about`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}/about`])),
        "x-default": "/en/about",
      },
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;

  return (
    <div>
      <AboutV2 />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: t(loc, "about_title"),
            description: t(loc, "about_desc"),
            mainEntity: {
              "@type": "Organization",
              name: "RateShips",
              legalName: "Global Supply KFT",
              url: "https://rateships.com",
              foundingDate: "2026",
              email: "info@rateships.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Toldi utca 4",
                addressLocality: "Kutasó",
                postalCode: "3066",
                addressCountry: "HU",
              },
              vatID: "HU26179030",
            },
          }),
        }}
      />
    </div>
  );
}
