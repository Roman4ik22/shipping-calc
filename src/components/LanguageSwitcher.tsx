"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

const localeConfig: Record<string, { label: string; flag: string; short: string }> = {
  en: { label: "English", flag: "🇬🇧", short: "EN" },
  ru: { label: "Русский", flag: "🇷🇺", short: "RU" },
  es: { label: "Español", flag: "🇪🇸", short: "ES" },
  de: { label: "Deutsch", flag: "🇩🇪", short: "DE" },
  fr: { label: "Français", flag: "🇫🇷", short: "FR" },
  pt: { label: "Português", flag: "🇧🇷", short: "PT" },
  zh: { label: "中文", flag: "🇨🇳", short: "中" },
  ja: { label: "日本語", flag: "🇯🇵", short: "日" },
  ko: { label: "한국어", flag: "🇰🇷", short: "한" },
  ar: { label: "العربية", flag: "🇸🇦", short: "ع" },
  tr: { label: "Türkçe", flag: "🇹🇷", short: "TR" },
  it: { label: "Italiano", flag: "🇮🇹", short: "IT" },
};

const allLocales = Object.keys(localeConfig);
const majorLocales = ["en", "ru", "es", "de", "fr", "pt", "zh", "ja", "ko", "ar", "tr", "it"];

function getAlternateUrls(): Record<string, string> {
  const map: Record<string, string> = {};
  if (typeof document === "undefined") return map;
  const links = document.querySelectorAll<HTMLLinkElement>('link[rel="alternate"][hreflang]');
  links.forEach((link) => {
    const lang = link.getAttribute("hreflang");
    const href = link.getAttribute("href");
    if (lang && href && lang !== "x-default") {
      // Extract path from full URL or relative URL
      try {
        const url = new URL(href, window.location.origin);
        map[lang] = url.pathname;
      } catch {
        map[lang] = href;
      }
    }
  });
  return map;
}

export default function LanguageSwitcher({ locale, validLocales }: { locale: string; validLocales?: string[] }) {
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

    // Try to use hreflang alternate links (works for corridor pages with locale-specific slugs)
    const alternates = getAlternateUrls();
    if (alternates[newLocale]) {
      router.push(alternates[newLocale]);
      return;
    }

    // Fallback: replace locale prefix in current path
    const localeRegex = new RegExp(`^/(${allLocales.join("|")})`);
    const pathWithoutLocale = pathname.replace(localeRegex, "") || "";
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  const availableLocales = validLocales || majorLocales;
  const current = localeConfig[locale] || localeConfig.en;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-sm text-muted hover:text-ink transition-colors"
        aria-label="Language"
        aria-expanded={open}
      >
        <span className="text-base">{current.flag}</span>
        <span className="hidden sm:inline">{current.short}</span>
        <svg className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-48 bg-[#141414] rounded-xl shadow-lg overflow-hidden z-50">
          <div className="py-1">
            {availableLocales.map((loc) => {
              const config = localeConfig[loc];
              if (!config) return null;
              const isActive = loc === locale;
              return (
                <button
                  key={loc}
                  onClick={() => handleSelect(loc)}
                  className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 transition-colors ${
                    isActive
                      ? "text-ink bg-white/[0.05]"
                      : "text-muted hover:text-ink hover:bg-white/[0.03]"
                  }`}
                >
                  <span className="text-base">{config.flag}</span>
                  <span className="flex-1">{config.label}</span>
                  {isActive && (
                    <span className="text-xs text-muted">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
