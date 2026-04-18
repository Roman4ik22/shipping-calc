"use client";

import { useState, useEffect } from "react";

interface SaveRouteProps {
  corridorSlug: string;
  originName: string;
  destName: string;
  locale: string;
}

export interface FavoriteRoute {
  corridorSlug: string;
  originName: string;
  destName: string;
  locale: string;
  savedAt: number;
}

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

function setFavorites(favorites: FavoriteRoute[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch {
    // storage full or unavailable
  }
}

export default function SaveRoute({ corridorSlug, originName, destName, locale }: SaveRouteProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const favorites = getFavorites();
    setSaved(favorites.some((f) => f.corridorSlug === corridorSlug));
  }, [corridorSlug]);

  const toggle = () => {
    const favorites = getFavorites();
    const exists = favorites.findIndex((f) => f.corridorSlug === corridorSlug);

    if (exists >= 0) {
      favorites.splice(exists, 1);
      setSaved(false);
    } else {
      favorites.push({
        corridorSlug,
        originName,
        destName,
        locale,
        savedAt: Date.now(),
      });
      setSaved(true);
    }

    setFavorites(favorites);
    window.dispatchEvent(new Event("favorites-updated"));
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-dark-700 border border-line rounded-lg hover:bg-dark-600 transition-colors"
      aria-label={saved ? "Remove from favorites" : "Save to favorites"}
      aria-pressed={saved}
      title={
        saved
          ? locale === "ru"
            ? "Убрать из избранного"
            : "Remove from favorites"
          : locale === "ru"
          ? "Добавить в избранное"
          : "Save to favorites"
      }
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={saved ? "text-red-400" : "text-body"}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      <span className={saved ? "text-red-400" : "text-body"}>
        {saved
          ? locale === "ru"
            ? "В избранном"
            : "Saved"
          : locale === "ru"
          ? "Сохранить"
          : "Save"}
      </span>
    </button>
  );
}
