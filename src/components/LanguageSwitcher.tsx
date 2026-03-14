"use client";

import { usePathname, useRouter } from "next/navigation";

const localeLabels: Record<string, string> = {
  en: "EN",
  ru: "RU",
  es: "ES",
  de: "DE",
  fr: "FR",
  pt: "PT",
  zh: "中文",
  ja: "日本",
  ko: "한국",
  ar: "عرب",
  tr: "TR",
  it: "IT",
};

const locales = Object.keys(localeLabels);

export default function LanguageSwitcher({ locale }: { locale: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const localeRegex = new RegExp(`^\\/(${locales.join("|")})`);
  const pathWithoutLocale = pathname.replace(localeRegex, "") || "";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  return (
    <select
      value={locale}
      onChange={handleChange}
      className="text-xs px-2 py-1 rounded border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 ml-2"
      aria-label="Language"
    >
      {locales.map((loc) => (
        <option key={loc} value={loc}>
          {localeLabels[loc]}
        </option>
      ))}
    </select>
  );
}
