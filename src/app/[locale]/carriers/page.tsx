import { Metadata } from "next";
import { t, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import CarriersV2 from "@/components/CarriersV2";

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
    title: t(loc, "carriers_page"),
    description: t(loc, "site_description"),
    alternates: {
      canonical: `/${locale}/carriers`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}/carriers`])),
        "x-default": "/en/carriers",
      },
    },
  };
}

export default async function Page() {
  return <CarriersV2 />;
}
