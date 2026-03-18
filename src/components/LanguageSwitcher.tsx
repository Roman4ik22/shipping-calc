"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

const localeConfig: Record<string, { label: string; flag: string }> = {
  en: { label: "English", flag: "🇬🇧" },
  ru: { label: "Русский", flag: "🇷🇺" },
  es: { label: "Español", flag: "🇪🇸" },
  de: { label: "Deutsch", flag: "🇩🇪" },
  fr: { label: "Français", flag: "🇫🇷" },
  pt: { label: "Português", flag: "🇧🇷" },
  zh: { label: "中文", flag: "🇨🇳" },
  ja: { label: "日本語", flag: "🇯🇵" },
  ko: { label: "한국어", flag: "🇰🇷" },
  ar: { label: "العربية", flag: "🇸🇦" },
  tr: { label: "Türkçe", flag: "🇹🇷" },
  it: { label: "Italiano", flag: "🇮🇹" },
};

const locales = Object.keys(localeConfig);

export default function LanguageSwitcher({ locale }: { locale: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleSelect = (newLocale: string) => {
    setOpen(false);
    // For corridor pages with locale-specific slugs, redirect to homepage of new locale
    // to avoid 404 on slug mismatch
    const localeRegex = new RegExp(`^/(${locales.join("|")})`);
    const pathWithoutLocale = pathname.replace(localeRegex, "") || "";

    // If on a corridor page (contains /shipping/ but not /shipping/from or /shipping/to)
    const isCorridorPage = /\/shipping\/[^/]+$/.test(pathWithoutLocale) &&
      !pathWithoutLocale.includes("/shipping/from/") &&
      !pathWithoutLocale.includes("/shipping/to/");

    if (isCorridorPage) {
      // Corridor slugs are locale-dependent, redirect to homepage
      router.push(`/${newLocale}`);
    } else {
      router.push(`/${newLocale}${pathWithoutLocale}`);
    }
  };

  const current = localeConfig[locale] || localeConfig.en;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/20 bg-dark-700 text-gray-200 hover:bg-dark-600 hover:border-white/30 transition-colors text-sm"
        aria-label="Language"
      >
        <span>{current.flag}</span>
        <span className="hidden sm:inline">{current.label}</span>
        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-44 bg-dark-700 border border-white/20 rounded-lg shadow-xl z-50 overflow-hidden">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => handleSelect(loc)}
              className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-colors ${
                loc === locale
                  ? "bg-accent/20 text-accent-light"
                  : "text-gray-300 hover:bg-dark-600"
              }`}
            >
              <span>{localeConfig[loc].flag}</span>
              <span>{localeConfig[loc].label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
