import { Metadata } from "next";
import { t, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import ToolsV2 from "@/components/ToolsV2";

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
    title: t(loc, "tools_title"),
    description: t(loc, "tools_desc"),
    alternates: {
      canonical: `/${locale}/tools`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}/tools`])),
        "x-default": "/en/tools",
      },
    },
  };
}

export default async function Page() {
  return <ToolsV2 />;
}
