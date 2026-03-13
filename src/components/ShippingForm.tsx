"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CountrySelector from "./CountrySelector";
import type { Locale } from "@/lib/types";

interface Country {
  code: string;
  name_en: string;
  name_ru: string;
  slug_en: string;
  slug_ru: string;
  continent: string;
}

export default function ShippingForm({
  countries,
  locale,
  labels,
}: {
  countries: Country[];
  locale: Locale;
  labels: { from: string; to: string; submit: string };
}) {
  const router = useRouter();
  const [origin, setOrigin] = useState("");
  const [dest, setDest] = useState("");

  const handleSubmit = () => {
    if (!origin || !dest || origin === dest) return;
    const originCountry = countries.find((c) => c.code === origin);
    const destCountry = countries.find((c) => c.code === dest);
    if (!originCountry || !destCountry) return;

    const originSlug = locale === "ru" ? originCountry.slug_ru : originCountry.slug_en;
    const destSlug = locale === "ru" ? destCountry.slug_ru : destCountry.slug_en;
    const sep = locale === "ru" ? "-v-" : "-to-";
    router.push(`/${locale}/shipping/${originSlug}${sep}${destSlug}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
      <CountrySelector
        countries={countries}
        locale={locale}
        label={labels.from}
        value={origin}
        onChange={setOrigin}
      />
      <CountrySelector
        countries={countries}
        locale={locale}
        label={labels.to}
        value={dest}
        onChange={setDest}
      />
      <button
        onClick={handleSubmit}
        disabled={!origin || !dest || origin === dest}
        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {labels.submit}
      </button>
    </div>
  );
}
