import { Metadata } from "next";
import { t, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import CustomsV2 from "@/components/CustomsV2";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  return {
    title: t(loc, "duty_calculator_title"),
    description: t(loc, "duty_calculator_desc"),
    alternates: {
      canonical: `/${locale}/tools/duty-calculator`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}/tools/duty-calculator`])),
        "x-default": "/en/tools/duty-calculator",
      },
    },
  };
}

export default async function DutyCalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return (
    <div>
      <CustomsV2 />
    </div>
  );
}
