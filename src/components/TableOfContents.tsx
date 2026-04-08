"use client";

import Link from "next/link";

export default function TableOfContents({
  locale,
  customsGuideHref,
}: {
  locale: string;
  customsGuideHref: string;
}) {
  const isRu = locale === "ru";

  const items = [
    { id: "examples", label: isRu ? "Примеры" : "Examples" },
    { id: "rates", label: isRu ? "Тарифы" : "Rates" },
    { id: "duties", label: isRu ? "Пошлины и налоги" : "Duties & Taxes" },
    { id: "documents", label: isRu ? "Документы" : "Documents" },
    { id: "customs", label: isRu ? "Таможня" : "Customs" },
    { id: "prohibited", label: isRu ? "Запрещённые товары" : "Prohibited Items" },
    { id: "faq", label: "FAQ" },
    { id: "tracking", label: isRu ? "Отслеживание" : "Tracking" },
  ];

  return (
    <nav className="mb-8 bg-card rounded-2xl p-5" aria-label="Table of contents">
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
        {isRu ? "На этой странице" : "On this page"}
      </p>
      <div className="flex flex-wrap gap-2 text-sm">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() =>
              document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-3 py-1.5 bg-card-hover rounded-full text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            {item.label}
          </button>
        ))}
        <Link
          href={customsGuideHref}
          className="px-3 py-1.5 bg-card-hover rounded-full text-gray-400 hover:text-white transition-colors"
        >
          {isRu ? "Подробнее о таможне" : "Full Customs Guide"}
        </Link>
      </div>
    </nav>
  );
}
