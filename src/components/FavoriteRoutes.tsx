"use client";

import { useState, useEffect } from "react";
import type { FavoriteRoute } from "./SaveRoute";

const STORAGE_KEY = "rateships_favorites";

function getFavorites(): FavoriteRoute[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function FavoriteRoutes({ locale }: { locale: string }) {
  const [favorites, setFavorites] = useState<FavoriteRoute[]>([]);

  useEffect(() => {
    setFavorites(getFavorites());

    const handleUpdate = () => setFavorites(getFavorites());
    window.addEventListener("favorites-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("favorites-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const removeFavorite = (corridorSlug: string) => {
    const updated = favorites.filter((f) => f.corridorSlug !== corridorSlug);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    setFavorites(updated);
    window.dispatchEvent(new Event("favorites-updated"));
  };

  if (favorites.length === 0) {
    return (
      <div className="bg-surface border border-line rounded-lg p-6 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mx-auto mb-3 text-muted"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        <p className="text-body text-sm">
          {locale === "ru"
            ? "Нет сохранённых маршрутов. Нажмите на сердечко рядом с маршрутом, чтобы сохранить его."
            : "No saved routes yet. Click the heart icon on a route to save it here."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-body mb-3">
        {locale === "ru" ? "Избранные маршруты" : "Saved Routes"} ({favorites.length})
      </h3>
      {favorites.map((fav) => (
        <div
          key={fav.corridorSlug}
          className="flex items-center justify-between bg-surface border border-line rounded-lg px-4 py-3 hover:border-white/20 transition-colors"
        >
          <a
            href={`/${fav.locale}/shipping/${fav.corridorSlug}`}
            className="flex-1 text-gray-100 hover:text-accent transition-colors"
          >
            <span className="font-medium">{fav.originName}</span>
            <span className="text-muted mx-2">&rarr;</span>
            <span className="font-medium">{fav.destName}</span>
          </a>
          <button
            onClick={() => removeFavorite(fav.corridorSlug)}
            className="ml-3 p-1 text-muted hover:text-red-400 transition-colors"
            aria-label={locale === "ru" ? "Удалить" : "Remove"}
            title={locale === "ru" ? "Удалить из избранного" : "Remove from favorites"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
