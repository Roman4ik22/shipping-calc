import { Metadata } from "next";
import { t, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import MethodologyV2 from "@/components/MethodologyV2";

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
    title: t(loc, "methodology_link"),
    description: t(loc, "site_description"),
    alternates: {
      canonical: `/${locale}/data-methodology`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}/data-methodology`])),
        "x-default": "/en/data-methodology",
      },
    },
  };
}

export default async function Page() {
  return <MethodologyV2 />;
}
