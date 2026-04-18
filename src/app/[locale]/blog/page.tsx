import { Metadata } from "next";
import { t, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import BlogV2 from "@/components/BlogV2";

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
    title: t(loc, "blog"),
    description: t(loc, "site_description"),
    alternates: {
      canonical: `/${locale}/blog`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}/blog`])),
        "x-default": "/en/blog",
      },
    },
  };
}

export default async function Page() {
  return <BlogV2 />;
}
