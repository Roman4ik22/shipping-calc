"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LanguageSwitcher({ locale }: { locale: string }) {
  const pathname = usePathname();
  const pathWithoutLocale = pathname.replace(/^\/(en|ru)/, "") || "";

  return (
    <div className="flex gap-1 ml-4 border-l pl-4">
      <Link
        href={`/en${pathWithoutLocale}`}
        className={`text-xs px-2 py-1 rounded ${
          locale === "en"
            ? "bg-blue-100 text-blue-700 font-medium"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        EN
      </Link>
      <Link
        href={`/ru${pathWithoutLocale}`}
        className={`text-xs px-2 py-1 rounded ${
          locale === "ru"
            ? "bg-blue-100 text-blue-700 font-medium"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        RU
      </Link>
    </div>
  );
}
