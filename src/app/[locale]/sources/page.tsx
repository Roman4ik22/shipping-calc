import { Metadata } from "next";
import { t, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import SourcesV2 from "@/components/SourcesV2";

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
    title: t(loc, "sources_link"),
    description: t(loc, "site_description"),
    alternates: {
      canonical: `/${locale}/sources`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}/sources`])),
        "x-default": "/en/sources",
      },
    },
  };
}

export default async function Page() {
  return <SourcesV2 />;
}
