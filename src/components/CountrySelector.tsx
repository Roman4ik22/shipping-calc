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
  const [activeIdx, setActiveIdx] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const getName = (c: Country) => c.name;

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

  const filtered = useMemo(() => {
    if (!search) return countries;
    const q = search.toLowerCase();
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [countries, search]);

  // Reset highlight when filter changes.
  useEffect(() => {
    setActiveIdx(0);
  }, [search]);

  // Scroll the active option into view as the user arrows through the list.
  useEffect(() => {
    if (!isOpen) return;
    const item = listRef.current?.querySelector<HTMLElement>(
      `[data-idx="${activeIdx}"]`
    );
    item?.scrollIntoView({ block: "nearest" });
  }, [activeIdx, isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setSearch("");
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, filtered.length - 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const c = filtered[activeIdx];
      if (c) {
        onChange(c.code);
        setIsOpen(false);
        setSearch("");
      }
    }
  };

  const selected = countries.find((c) => c.code === value);

  return (
    <div className="relative" ref={ref}>
      <label className="block text-xs text-body mb-2 uppercase tracking-wide">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="w-full py-4 px-4 text-left bg-white border border-line text-ink rounded-xl hover:bg-card-hover hover:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-colors flex items-center justify-between gap-2"
      >
        {selected ? (
          <span className="flex items-center gap-2 truncate">
            <span className="text-xl leading-none">{countryFlag(selected.code)}</span>
            <span className="truncate">{getName(selected)}</span>
          </span>
        ) : (
          <span className="text-muted">—</span>
        )}
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          strokeLinejoin="round" aria-hidden="true"
          className={`text-muted shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-lg border border-line max-h-72 overflow-hidden"
          role="listbox"
        >
          <div className="p-3 border-b border-line-2">
            <div className="relative">
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                strokeLinejoin="round" aria-hidden="true"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={label}
                className="w-full pl-10 pr-4 py-3 bg-white border border-line rounded-xl text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/50 placeholder-muted"
                autoFocus
                aria-autocomplete="list"
                aria-controls="country-options"
              />
            </div>
          </div>
          <div className="overflow-y-auto max-h-52" ref={listRef} id="country-options">
            {filtered.map((c, idx) => (
              <button
                key={c.code}
                type="button"
                data-idx={idx}
                role="option"
                aria-selected={c.code === value}
                onMouseEnter={() => setActiveIdx(idx)}
                onClick={() => {
                  onChange(c.code);
                  setIsOpen(false);
                  setSearch("");
                }}
                className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2.5 transition-colors ${
                  idx === activeIdx ? "bg-bg-alt" : ""
                } ${
                  c.code === value ? "text-ink font-semibold" : "text-body"
                }`}
              >
                <span className="text-xl leading-none">{countryFlag(c.code)}</span>
                <span className="truncate">{getName(c)}</span>
                {c.code === value && (
                  <svg
                    width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="3" strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-auto text-accent shrink-0" aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="px-4 py-6 text-sm text-muted text-center">
                <svg
                  width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                  strokeLinejoin="round" aria-hidden="true"
                  className="mx-auto mb-2 opacity-60"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                No matches for &ldquo;{search}&rdquo;
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
