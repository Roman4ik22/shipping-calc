"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const localeLabels: Record<string, string> = {
  en: "English",
  ru: "Русский",
  es: "Español",
  de: "Deutsch",
  fr: "Français",
  pt: "Português",
  zh: "中文",
  ja: "日本語",
  ko: "한국어",
  ar: "العربية",
  tr: "Türkçe",
  it: "Italiano",
};

const localeFlags: Record<string, string> = {
  en: "🇬🇧",
  ru: "🇷🇺",
  es: "🇪🇸",
  de: "🇩🇪",
  fr: "🇫🇷",
  pt: "🇵🇹",
  zh: "🇨🇳",
  ja: "🇯🇵",
  ko: "🇰🇷",
  ar: "🇸🇦",
  tr: "🇹🇷",
  it: "🇮🇹",
};

// Country code → locale(s) spoken there
const countryLocaleMap: Record<string, string[]> = {
  // Russian-speaking
  RU: ["ru"], BY: ["ru"], KZ: ["ru"], KG: ["ru"], UA: ["ru"],
  // German-speaking
  DE: ["de"], AT: ["de"], CH: ["de", "fr", "it"],
  // French-speaking
  FR: ["fr"], BE: ["fr"], LU: ["fr"], MC: ["fr"],
  SN: ["fr"], CI: ["fr"], ML: ["fr"], CM: ["fr"], CD: ["fr"], MG: ["fr"],
  // Spanish-speaking
  ES: ["es"], MX: ["es"], AR: ["es"], CO: ["es"], CL: ["es"], PE: ["es"],
  VE: ["es"], EC: ["es"], GT: ["es"], CU: ["es"], BO: ["es"], DO: ["es"],
  HN: ["es"], PY: ["es"], SV: ["es"], NI: ["es"], CR: ["es"], PA: ["es"], UY: ["es"],
  // Portuguese-speaking
  BR: ["pt"], PT: ["pt"], AO: ["pt"], MZ: ["pt"],
  // Chinese-speaking
  CN: ["zh"], TW: ["zh"], HK: ["zh"],
  // Japanese
  JP: ["ja"],
  // Korean
  KR: ["ko"],
  // Arabic-speaking
  SA: ["ar"], AE: ["ar"], EG: ["ar"], IQ: ["ar"], MA: ["ar"], DZ: ["ar"],
  TN: ["ar"], LY: ["ar"], JO: ["ar"], LB: ["ar"], KW: ["ar"], QA: ["ar"],
  BH: ["ar"], OM: ["ar"], YE: ["ar"], SY: ["ar"], SD: ["ar"],
  // Turkish
  TR: ["tr"],
  // Italian
  IT: ["it"],
  // English-speaking
  US: ["en"], GB: ["en"], CA: ["en"], AU: ["en"], NZ: ["en"],
  IE: ["en"], SG: ["en"], ZA: ["en"], IN: ["en"], PH: ["en"], NG: ["en"],
  KE: ["en"], GH: ["en"], PK: ["en"],
};

interface LocaleSuggestionProps {
  currentLocale: string;
  originCode: string;
  destCode: string;
  viewInLabel: string;
}

export default function LocaleSuggestion({
  currentLocale,
  originCode,
  destCode,
  viewInLabel,
}: LocaleSuggestionProps) {
  const [dismissed, setDismissed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  if (dismissed) return null;

  // Build suggested locales: destination langs first, then origin langs, then english
  const suggested: string[] = [];
  const destLocales = countryLocaleMap[destCode] ?? [];
  const originLocales = countryLocaleMap[originCode] ?? [];

  for (const loc of destLocales) {
    if (loc !== currentLocale && !suggested.includes(loc)) suggested.push(loc);
  }
  for (const loc of originLocales) {
    if (loc !== currentLocale && !suggested.includes(loc)) suggested.push(loc);
  }
  if (currentLocale !== "en" && !suggested.includes("en")) {
    suggested.push("en");
  }

  // No suggestions needed
  if (suggested.length === 0) return null;

  // Max 3 suggestions
  const display = suggested.slice(0, 3);

  const locales = Object.keys(localeLabels);
  const localeRegex = new RegExp(`^\\/(${locales.join("|")})`);
  const pathWithoutLocale = pathname.replace(localeRegex, "") || "";

  const switchTo = (loc: string) => {
    router.push(`/${loc}${pathWithoutLocale}`);
  };

  return (
    <div className="bg-accent/10 border border-accent/30 rounded-lg px-4 py-3 mb-6 flex items-center justify-between flex-wrap gap-2">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-accent-light">{viewInLabel}:</span>
        {display.map((loc) => (
          <button
            key={loc}
            onClick={() => switchTo(loc)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-dark-700 border border-accent/30 rounded-full text-sm font-medium text-accent-light hover:bg-accent/20 hover:border-accent/50 transition-colors"
          >
            <span>{localeFlags[loc]}</span>
            <span>{localeLabels[loc]}</span>
          </button>
        ))}
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-gray-500 hover:text-gray-300 text-lg leading-none"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}
