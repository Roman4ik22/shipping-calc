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

  const handleSwap = () => {
    setOrigin(dest);
    setDest(origin);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto] gap-4 items-end">
      <CountrySelector
        countries={countries}
        locale={locale}
        label={labels.from}
        value={origin}
        onChange={setOrigin}
      />
      <button
        type="button"
        onClick={handleSwap}
        disabled={!origin && !dest}
        className="hidden md:flex items-center justify-center w-10 h-10 mb-0.5 rounded-full bg-white/20 hover:bg-white/30 text-white disabled:opacity-30 transition-colors"
        title={locale === "ru" ? "Поменять местами" : "Swap"}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 16l-4-4 4-4" />
          <path d="M17 8l4 4-4 4" />
          <line x1="3" y1="12" x2="21" y2="12" />
        </svg>
      </button>
      {/* Mobile swap button */}
      <button
        type="button"
        onClick={handleSwap}
        disabled={!origin && !dest}
        className="md:hidden flex items-center justify-center w-full py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white disabled:opacity-30 text-sm"
      >
        {locale === "ru" ? "Поменять местами" : "Swap countries"}
      </button>
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
        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors md:col-span-1"
      >
        {labels.submit}
      </button>
    </div>
  );
}
