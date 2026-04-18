"use client";

import { useState, useEffect } from "react";
import NavLink from "@/components/NavLink";

export default function MobileMenu({
  locale,
  labels,
}: {
  locale: string;
  labels: { home: string; carriers: string; guides: string; about?: string; blog?: string; platforms?: string };
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open]);

  return (
    <div className="sm:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-body hover:text-ink"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
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
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-line shadow-lg z-50">
          <nav className="flex flex-col p-4 gap-3">
            <NavLink
              href={`/${locale}`}
              className="text-body hover:text-accent-light py-2 transition-colors"
              activeClassName="text-ink py-2"
              onClick={() => setOpen(false)}
            >
              {labels.home}
            </NavLink>
            <NavLink
              href={`/${locale}/carriers`}
              className="text-body hover:text-accent-light py-2 transition-colors"
              activeClassName="text-ink py-2"
              onClick={() => setOpen(false)}
            >
              {labels.carriers}
            </NavLink>
            <NavLink
              href={`/${locale}/guide`}
              className="text-body hover:text-accent-light py-2 transition-colors"
              activeClassName="text-ink py-2"
              onClick={() => setOpen(false)}
            >
              {labels.guides}
            </NavLink>
            <NavLink
              href={`/${locale}/about`}
              className="text-body hover:text-accent-light py-2 transition-colors"
              activeClassName="text-ink py-2"
              onClick={() => setOpen(false)}
            >
              {labels.about || "About"}
            </NavLink>
            <NavLink
              href={`/${locale}/blog`}
              className="text-body hover:text-accent-light py-2 transition-colors"
              activeClassName="text-ink py-2"
              onClick={() => setOpen(false)}
            >
              {labels.blog || "Blog"}
            </NavLink>
            <NavLink
              href={`/${locale}/platforms`}
              className="text-body hover:text-accent-light py-2 transition-colors"
              activeClassName="text-ink py-2"
              onClick={() => setOpen(false)}
            >
              {labels.platforms || "Platforms"}
            </NavLink>
          </nav>
        </div>
      )}
    </div>
  );
}
