"use client";

import { useEffect, useState } from "react";

export default function StickyCorridorCTA({
  cheapestPrice,
  fastestDays,
  carrierName,
  locale,
}: {
  cheapestPrice: number;
  fastestDays: number;
  carrierName: string;
  locale: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past hero/quick answer (~500px)
      setVisible(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  const isRu = locale === "ru";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-bg/95 backdrop-blur-xl border-t border-line px-4 py-3 safe-area-bottom">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-ink text-sm font-medium truncate">
            {isRu ? "От" : "From"} ${cheapestPrice}/kg
          </p>
          <p className="text-xs text-muted truncate">
            {carrierName} · {fastestDays}+ {isRu ? "дней" : "days"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => document.getElementById("rates")?.scrollIntoView({ behavior: "smooth" })}
          className="shrink-0 px-5 py-2.5 bg-accent text-white btn-press text-sm font-medium rounded-full hover:bg-[#1558B8] transition-colors"
        >
          {isRu ? "Сравнить" : "Compare"}
        </button>
      </div>
    </div>
  );
}
