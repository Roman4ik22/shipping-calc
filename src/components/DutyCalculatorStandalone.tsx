"use client";

import { useState, useMemo } from "react";
import { countries } from "@/lib/data";
import { getCustomsInfo } from "@/lib/customs";
import DutyCalculator from "@/components/DutyCalculator";

// Duty rates table for common categories
const dutyCategories = [
  { category_en: "Electronics", category_ru: "Электроника", hs: "8471-8473" },
  { category_en: "Clothing", category_ru: "Одежда", hs: "6101-6114" },
  { category_en: "Footwear", category_ru: "Обувь", hs: "6401-6405" },
  { category_en: "Cosmetics", category_ru: "Косметика", hs: "3304" },
  { category_en: "Food & Beverages", category_ru: "Продукты питания", hs: "0901-2202" },
  { category_en: "Toys & Games", category_ru: "Игрушки", hs: "9503-9505" },
  { category_en: "Jewelry", category_ru: "Ювелирные изделия", hs: "7113-7117" },
  { category_en: "Furniture", category_ru: "Мебель", hs: "9401-9403" },
];

interface Props {
  locale: string;
}

export default function DutyCalculatorStandalone({ locale }: Props) {
  const isRu = locale === "ru";
  const [selectedCountry, setSelectedCountry] = useState("US");
  const customs = getCustomsInfo(selectedCountry);

  const sortedCountries = useMemo(() => {
    return [...countries].sort((a, b) => {
      const nameA = isRu ? a.name_ru : a.name_en;
      const nameB = isRu ? b.name_ru : b.name_en;
      return nameA.localeCompare(nameB);
    });
  }, [isRu]);

  const selectedName = sortedCountries.find((c) => c.code === selectedCountry);

  const labels = {
    title: isRu ? "Калькулятор пошлин" : "Duty Calculator",
    item_value: isRu ? "Стоимость товара" : "Item value",
    calculate: isRu ? "Рассчитать" : "Calculate",
    duty: isRu ? "Пошлина" : "Duty",
    vat: isRu ? "НДС" : "VAT",
    total_import_cost: isRu ? "Итого с учётом импорта" : "Total import cost",
    de_minimis_note: isRu ? "Порог де минимис" : "De minimis threshold",
    below_threshold: isRu
      ? "Стоимость ниже порога — пошлины не взимаются"
      : "Value below threshold — no duties apply",
    currency_label: isRu ? "Валюта" : "Currency",
    result_title: isRu ? "Результат расчёта" : "Calculation Result",
  };

  return (
    <>
      {/* Country selector */}
      <div className="mb-8">
        <label className="block text-sm text-gray-400 mb-2">
          {isRu ? "Страна назначения" : "Destination country"}
        </label>
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="w-full sm:w-80 px-4 py-2.5 bg-dark-700 border border-white/10 rounded-lg text-gray-100 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30"
        >
          {sortedCountries.map((c) => (
            <option key={c.code} value={c.code}>
              {isRu ? c.name_ru : c.name_en}
            </option>
          ))}
        </select>
      </div>

      {/* Duty Calculator component */}
      <div className="mb-10">
        <DutyCalculator
          destCode={selectedCountry}
          locale={locale as "en" | "ru"}
          labels={labels}
        />
      </div>

      {/* De minimis threshold info */}
      <div className="mb-10 bg-surface border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-3">
          {isRu ? "Порог де минимис" : "De Minimis Threshold"}
          {selectedName && ` — ${isRu ? selectedName.name_ru : selectedName.name_en}`}
        </h2>
        <p className="text-gray-300 mb-2">
          {customs.de_minimis_usd > 0 ? (
            <>
              {isRu
                ? `Товары стоимостью до $${customs.de_minimis_usd} USD не облагаются пошлинами`
                : `Goods valued under $${customs.de_minimis_usd} USD are duty-free`}
            </>
          ) : (
            <>
              {isRu
                ? "Нет порога де минимис — все товары облагаются пошлинами"
                : "No de minimis threshold — all goods are subject to duties"}
            </>
          )}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              {isRu ? "Средняя пошлина" : "Average Duty Rate"}
            </p>
            <p className="text-xl font-light text-white mt-1">{customs.avg_duty_rate}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              {isRu ? "Ставка НДС" : "VAT Rate"}
            </p>
            <p className="text-xl font-light text-white mt-1">{customs.vat_rate}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              {isRu ? "Валюта" : "Currency"}
            </p>
            <p className="text-xl font-light text-white mt-1">{customs.currency}</p>
          </div>
        </div>
      </div>

      {/* Duty rates table */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-white mb-4">
          {isRu ? "Ориентировочные ставки пошлин по категориям" : "Estimated Duty Rates by Category"}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-gray-400 py-3 pr-4">
                  {isRu ? "Категория" : "Category"}
                </th>
                <th className="text-left text-gray-400 py-3 pr-4">
                  {isRu ? "Код ТН ВЭД" : "HS Code"}
                </th>
                <th className="text-right text-gray-400 py-3">
                  {isRu ? "Пошлина (прим.)" : "Duty (est.)"}
                </th>
              </tr>
            </thead>
            <tbody>
              {dutyCategories.map((cat) => (
                <tr key={cat.hs} className="border-b border-white/5">
                  <td className="text-gray-200 py-3 pr-4">
                    {isRu ? cat.category_ru : cat.category_en}
                  </td>
                  <td className="text-gray-400 py-3 pr-4 font-mono text-xs">{cat.hs}</td>
                  <td className="text-right text-gray-200 py-3">{customs.avg_duty_rate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          {isRu
            ? "* Фактические ставки зависят от конкретного товара и кода ТН ВЭД. Указаны средние значения."
            : "* Actual rates depend on the specific product and HS code. Averages shown."}
        </p>
      </div>
    </>
  );
}
