"use client";

import { useState, useMemo } from "react";
import type { Locale } from "@/lib/types";

interface Country {
  code: string;
  name_en: string;
  name_ru: string;
  slug_en: string;
  slug_ru: string;
  continent: string;
}

export default function CountrySelector({
  countries,
  locale,
  label,
  value,
  onChange,
}: {
  countries: Country[];
  locale: Locale;
  label: string;
  value: string;
  onChange: (code: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const getName = (c: Country) => (locale === "ru" ? c.name_ru : c.name_en);

  const filtered = useMemo(() => {
    if (!search) return countries;
    const q = search.toLowerCase();
    return countries.filter(
      (c) =>
        c.name_en.toLowerCase().includes(q) ||
        c.name_ru.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [countries, search]);

  const selected = countries.find((c) => c.code === value);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {selected ? getName(selected) : "—"}
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-72 overflow-hidden">
          <div className="p-2 border-b">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={locale === "ru" ? "Поиск страны..." : "Search country..."}
              className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
          </div>
          <div className="overflow-y-auto max-h-56">
            {filtered.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => {
                  onChange(c.code);
                  setIsOpen(false);
                  setSearch("");
                }}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-blue-50 ${
                  c.code === value ? "bg-blue-50 font-medium" : ""
                }`}
              >
                {getName(c)}
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-500">
                {locale === "ru" ? "Не найдено" : "No results"}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
