import { Metadata } from "next";
import { t, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import DeliveryV2 from "@/components/DeliveryV2";

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
    title: t(loc, "delivery_title"),
    description: t(loc, "delivery_desc"),
    alternates: {
      canonical: `/${locale}/tools/delivery-estimator`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}/tools/delivery-estimator`])),
        "x-default": "/en/tools/delivery-estimator",
      },
    },
  };
}

export default async function Page() {
  return <DeliveryV2 />;
}
