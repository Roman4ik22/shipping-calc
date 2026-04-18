import { Metadata } from "next";
import { t, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import TermsV2 from "@/components/TermsV2";

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
    title: t(loc, "terms_link"),
    description: t(loc, "site_description"),
    alternates: {
      canonical: `/${locale}/terms`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}/terms`])),
        "x-default": "/en/terms",
      },
    },
  };
}

export default async function Page() {
  return <TermsV2 />;
}
