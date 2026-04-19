import { Metadata } from "next";
import { t, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import UpdatesV2 from "@/components/UpdatesV2";

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
    title: t(loc, "updates_link"),
    description: t(loc, "site_description"),
    alternates: {
      canonical: `/${locale}/updates`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}/updates`])),
        "x-default": "/en/updates",
      },
    },
  };
}

export default async function Page() {
  return <UpdatesV2 />;
}
