"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import type { Locale } from "@/lib/types";

interface Country {
  code: string;
  name: string;
  slug_en: string;
  slug_ru: string;
  continent: string;
}

function countryFlag(code: string): string {
  const codePoints = [...code.toUpperCase()].map(
    (c) => 0x1f1e6 + c.charCodeAt(0) - 65
  );
  return String.fromCodePoint(...codePoints);
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
  const ref = useRef<HTMLDivElement>(null);

  const getName = (c: Country) => c.name;

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen]);

  const filtered = useMemo(() => {
    if (!search) return countries;
    const q = search.toLowerCase();
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [countries, search]);

  const selected = countries.find((c) => c.code === value);

  return (
    <div className="relative" ref={ref}>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 text-left bg-dark-700 text-gray-100 border border-white/20 rounded-lg shadow-sm hover:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent"
      >
        {selected ? (
          <span>
            {countryFlag(selected.code)} {getName(selected)}
          </span>
        ) : (
          <span className="text-gray-500">—</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-dark-700 text-gray-100 border border-white/20 rounded-lg shadow-lg max-h-72 overflow-hidden">
          <div className="p-2 border-b border-white/10">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={label}
              className="w-full px-3 py-2 border border-white/20 rounded text-sm text-gray-100 bg-dark-600 focus:outline-none focus:ring-1 focus:ring-accent placeholder-gray-500"
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
                className={`w-full px-4 py-2 text-left text-sm hover:bg-accent/20 transition-colors ${
                  c.code === value ? "bg-accent/20 font-medium text-accent-light" : "text-gray-200"
                }`}
              >
                {countryFlag(c.code)} {getName(c)}
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-500">
                {"—"}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
