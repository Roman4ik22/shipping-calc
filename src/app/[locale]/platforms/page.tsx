import { Metadata } from "next";
import { t, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import PlatformsV2 from "@/components/PlatformsV2";

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
    title: t(loc, "platforms"),
    description: t(loc, "site_description"),
    alternates: {
      canonical: `/${locale}/platforms`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}/platforms`])),
        "x-default": "/en/platforms",
      },
    },
  };
}

export default async function Page() {
  return <PlatformsV2 />;
}
