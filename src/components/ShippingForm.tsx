"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CountrySelector from "./CountrySelector";
import type { Locale } from "@/lib/types";

interface Country {
  code: string;
  name: string;
  slug: string;
  slug_en: string;
  slug_ru: string;
  continent: string;
}

export default function ShippingForm({
  countries,
  locale,
  labels,
  corridorSep,
}: {
  countries: Country[];
  locale: Locale;
  labels: { from: string; to: string; submit: string; swap: string };
  corridorSep: string;
}) {
  const router = useRouter();
  const [origin, setOrigin] = useState("");
  const [dest, setDest] = useState("");

  const handleSubmit = () => {
    if (!origin || !dest || origin === dest) return;
    const originCountry = countries.find((c) => c.code === origin);
    const destCountry = countries.find((c) => c.code === dest);
    if (!originCountry || !destCountry) return;

    router.push(`/${locale}/shipping/${originCountry.slug}${corridorSep}${destCountry.slug}`);
  };

  const handleSwap = () => {
    setOrigin(dest);
    setDest(origin);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto] gap-6 items-end">
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
        className="hidden md:flex items-center justify-center w-10 h-10 mb-0.5 text-body hover:text-ink disabled:opacity-20 transition-colors"
        aria-label={labels.swap}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
        className="md:hidden flex items-center justify-center w-full py-3 text-muted hover:opacity-70 disabled:opacity-20 text-sm transition-opacity"
        aria-label={labels.swap}
      >
        {labels.swap}
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
        className="px-10 py-4 bg-accent text-white text-base font-medium rounded-full hover:bg-[#1558B8] disabled:bg-[#1a2a3a] disabled:text-body disabled:cursor-not-allowed transition-colors md:col-span-1"
      >
        {labels.submit}
      </button>
    </div>
  );
}
