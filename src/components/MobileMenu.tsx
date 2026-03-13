"use client";

import { useState } from "react";
import Link from "next/link";

export default function MobileMenu({
  locale,
  labels,
}: {
  locale: string;
  labels: { home: string; carriers: string; guides: string; about?: string };
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-gray-600 hover:text-gray-900"
        aria-label="Menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {open ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>
      {open && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50">
          <nav className="flex flex-col p-4 gap-3">
            <Link
              href={`/${locale}`}
              className="text-gray-700 hover:text-blue-600 py-2"
              onClick={() => setOpen(false)}
            >
              {labels.home}
            </Link>
            <Link
              href={`/${locale}/carriers`}
              className="text-gray-700 hover:text-blue-600 py-2"
              onClick={() => setOpen(false)}
            >
              {labels.carriers}
            </Link>
            <Link
              href={`/${locale}/guide`}
              className="text-gray-700 hover:text-blue-600 py-2"
              onClick={() => setOpen(false)}
            >
              {labels.guides}
            </Link>
            <Link
              href={`/${locale}/about`}
              className="text-gray-700 hover:text-blue-600 py-2"
              onClick={() => setOpen(false)}
            >
              {labels.about || "About"}
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
