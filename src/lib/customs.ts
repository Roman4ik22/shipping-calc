// Customs duty / import tax data by country
// De minimis = value threshold below which no duty is charged

interface CustomsInfo {
  currency: string;
  de_minimis_usd: number;
  vat_rate: number; // percent
  avg_duty_rate: number; // percent, average for general goods
  notes_en?: string;
  notes_ru?: string;
}

const customsData: Record<string, CustomsInfo> = {
  US: { currency: "USD", de_minimis_usd: 800, vat_rate: 0, avg_duty_rate: 3.4, notes_en: "De minimis $800 threshold will be eliminated from Aug 1, 2026. No federal sales tax; state taxes may apply", notes_ru: "Порог де минимис $800 будет отменён с 1 августа 2026. Нет федерального налога; могут применяться налоги штата" },
  GB: { currency: "GBP", de_minimis_usd: 0, vat_rate: 20, avg_duty_rate: 4.2, notes_en: "VAT applies to all imports since Jan 2021", notes_ru: "НДС применяется ко всему импорту с января 2021" },
  DE: { currency: "EUR", de_minimis_usd: 0, vat_rate: 19, avg_duty_rate: 4.2, notes_en: "EU customs union; EORI number may be required", notes_ru: "Таможенный союз ЕС; может потребоваться номер EORI" },
  FR: { currency: "EUR", de_minimis_usd: 0, vat_rate: 20, avg_duty_rate: 4.2, notes_en: "EU customs union", notes_ru: "Таможенный союз ЕС" },
  IT: { currency: "EUR", de_minimis_usd: 0, vat_rate: 22, avg_duty_rate: 4.2 },
  ES: { currency: "EUR", de_minimis_usd: 0, vat_rate: 21, avg_duty_rate: 4.2 },
  NL: { currency: "EUR", de_minimis_usd: 0, vat_rate: 21, avg_duty_rate: 4.2 },
  CN: { currency: "CNY", de_minimis_usd: 7, vat_rate: 13, avg_duty_rate: 7.5, notes_en: "Strict customs; some items require permits", notes_ru: "Строгая таможня; на некоторые товары нужны разрешения" },
  JP: { currency: "JPY", de_minimis_usd: 130, vat_rate: 10, avg_duty_rate: 4.5 },
  KR: { currency: "KRW", de_minimis_usd: 150, vat_rate: 10, avg_duty_rate: 8 },
  AU: { currency: "AUD", de_minimis_usd: 700, vat_rate: 10, avg_duty_rate: 5 },
  CA: { currency: "CAD", de_minimis_usd: 20, vat_rate: 5, avg_duty_rate: 3.5, notes_en: "GST 5% + provincial taxes vary", notes_ru: "GST 5% + провинциальные налоги различаются" },
  RU: { currency: "RUB", de_minimis_usd: 200, vat_rate: 20, avg_duty_rate: 15, notes_en: "Duty on value above €200 threshold", notes_ru: "Пошлина на стоимость свыше порога €200" },
  IN: { currency: "INR", de_minimis_usd: 0, vat_rate: 18, avg_duty_rate: 10, notes_en: "GST applies; high duty on electronics", notes_ru: "Применяется GST; высокие пошлины на электронику" },
  AE: { currency: "AED", de_minimis_usd: 70, vat_rate: 5, avg_duty_rate: 5 },
  SG: { currency: "SGD", de_minimis_usd: 300, vat_rate: 9, avg_duty_rate: 0, notes_en: "Most goods duty-free; GST applies", notes_ru: "Большинство товаров без пошлины; GST применяется" },
  TH: { currency: "THB", de_minimis_usd: 45, vat_rate: 7, avg_duty_rate: 8 },
  MY: { currency: "MYR", de_minimis_usd: 120, vat_rate: 6, avg_duty_rate: 6 },
  BR: { currency: "BRL", de_minimis_usd: 50, vat_rate: 17, avg_duty_rate: 60, notes_en: "Very high import duties; simplified tax of 60% for most goods", notes_ru: "Очень высокие пошлины; упрощённый налог 60% для большинства товаров" },
  MX: { currency: "MXN", de_minimis_usd: 50, vat_rate: 16, avg_duty_rate: 15 },
  TR: { currency: "TRY", de_minimis_usd: 22, vat_rate: 20, avg_duty_rate: 10 },
  SA: { currency: "SAR", de_minimis_usd: 267, vat_rate: 15, avg_duty_rate: 5 },
  PH: { currency: "PHP", de_minimis_usd: 200, vat_rate: 12, avg_duty_rate: 10 },
  ID: { currency: "IDR", de_minimis_usd: 3, vat_rate: 11, avg_duty_rate: 7.5, notes_en: "Very low de minimis; duty applies to almost all imports", notes_ru: "Очень низкий порог; пошлина на почти весь импорт" },
  VN: { currency: "VND", de_minimis_usd: 45, vat_rate: 10, avg_duty_rate: 10 },
  PL: { currency: "PLN", de_minimis_usd: 0, vat_rate: 23, avg_duty_rate: 4.2 },
  SE: { currency: "SEK", de_minimis_usd: 0, vat_rate: 25, avg_duty_rate: 4.2 },
  NO: { currency: "NOK", de_minimis_usd: 0, vat_rate: 25, avg_duty_rate: 3, notes_en: "Not EU; separate customs rules", notes_ru: "Не ЕС; отдельные таможенные правила" },
  CH: { currency: "CHF", de_minimis_usd: 5, vat_rate: 8.1, avg_duty_rate: 2 },
  NZ: { currency: "NZD", de_minimis_usd: 700, vat_rate: 15, avg_duty_rate: 5 },
  IL: { currency: "ILS", de_minimis_usd: 75, vat_rate: 17, avg_duty_rate: 8 },
  ZA: { currency: "ZAR", de_minimis_usd: 30, vat_rate: 15, avg_duty_rate: 10 },
  NG: { currency: "NGN", de_minimis_usd: 50, vat_rate: 7.5, avg_duty_rate: 20 },
  EG: { currency: "EGP", de_minimis_usd: 0, vat_rate: 14, avg_duty_rate: 20 },
  KE: { currency: "KES", de_minimis_usd: 50, vat_rate: 16, avg_duty_rate: 25 },
  CL: { currency: "CLP", de_minimis_usd: 30, vat_rate: 19, avg_duty_rate: 6 },
  CO: { currency: "COP", de_minimis_usd: 200, vat_rate: 19, avg_duty_rate: 10 },
  AR: { currency: "ARS", de_minimis_usd: 50, vat_rate: 21, avg_duty_rate: 35, notes_en: "Very high import taxes and restrictions", notes_ru: "Очень высокие налоги на импорт и ограничения" },
  PE: { currency: "PEN", de_minimis_usd: 200, vat_rate: 18, avg_duty_rate: 6 },
  UA: { currency: "UAH", de_minimis_usd: 150, vat_rate: 20, avg_duty_rate: 10 },
  KZ: { currency: "KZT", de_minimis_usd: 200, vat_rate: 12, avg_duty_rate: 15 },
  AT: { currency: "EUR", de_minimis_usd: 0, vat_rate: 20, avg_duty_rate: 4.2 },
  BE: { currency: "EUR", de_minimis_usd: 0, vat_rate: 21, avg_duty_rate: 4.2 },
  PT: { currency: "EUR", de_minimis_usd: 0, vat_rate: 23, avg_duty_rate: 4.2 },
  GR: { currency: "EUR", de_minimis_usd: 0, vat_rate: 24, avg_duty_rate: 4.2 },
  CZ: { currency: "CZK", de_minimis_usd: 0, vat_rate: 21, avg_duty_rate: 4.2 },
  HU: { currency: "HUF", de_minimis_usd: 0, vat_rate: 27, avg_duty_rate: 4.2, notes_en: "Highest VAT in EU at 27%", notes_ru: "Самый высокий НДС в ЕС — 27%" },
  RO: { currency: "RON", de_minimis_usd: 0, vat_rate: 19, avg_duty_rate: 4.2 },
  DK: { currency: "DKK", de_minimis_usd: 0, vat_rate: 25, avg_duty_rate: 4.2 },
  FI: { currency: "EUR", de_minimis_usd: 0, vat_rate: 24, avg_duty_rate: 4.2 },
  IE: { currency: "EUR", de_minimis_usd: 0, vat_rate: 23, avg_duty_rate: 4.2 },
  HK: { currency: "HKD", de_minimis_usd: 0, vat_rate: 0, avg_duty_rate: 0, notes_en: "Free port — no customs duties or VAT on most goods", notes_ru: "Свободный порт — нет пошлин и НДС на большинство товаров" },
  TW: { currency: "TWD", de_minimis_usd: 60, vat_rate: 5, avg_duty_rate: 6.5 },
  BD: { currency: "BDT", de_minimis_usd: 0, vat_rate: 15, avg_duty_rate: 25 },
  PK: { currency: "PKR", de_minimis_usd: 0, vat_rate: 18, avg_duty_rate: 20, notes_en: "High duties on many imported goods", notes_ru: "Высокие пошлины на многие импортные товары" },
  LK: { currency: "LKR", de_minimis_usd: 0, vat_rate: 15, avg_duty_rate: 15 },
  BY: { currency: "BYN", de_minimis_usd: 200, vat_rate: 20, avg_duty_rate: 15, notes_en: "EAEU member; shared customs rules with Russia", notes_ru: "Член ЕАЭС; общие таможенные правила с Россией" },
  GE: { currency: "GEL", de_minimis_usd: 300, vat_rate: 18, avg_duty_rate: 5, notes_en: "Liberal trade policy with low import duties", notes_ru: "Либеральная торговая политика с низкими пошлинами" },
  MA: { currency: "MAD", de_minimis_usd: 0, vat_rate: 20, avg_duty_rate: 25 },
  QA: { currency: "QAR", de_minimis_usd: 270, vat_rate: 0, avg_duty_rate: 5, notes_en: "No VAT; 5% customs duty on most goods", notes_ru: "Нет НДС; 5% таможенная пошлина на большинство товаров" },
  KW: { currency: "KWD", de_minimis_usd: 270, vat_rate: 0, avg_duty_rate: 5 },
  // Batch 3 — 20 more countries
  BG: { currency: "BGN", de_minimis_usd: 0, vat_rate: 20, avg_duty_rate: 4.2 },
  HR: { currency: "EUR", de_minimis_usd: 0, vat_rate: 25, avg_duty_rate: 4.2 },
  SK: { currency: "EUR", de_minimis_usd: 0, vat_rate: 20, avg_duty_rate: 4.2 },
  SI: { currency: "EUR", de_minimis_usd: 0, vat_rate: 22, avg_duty_rate: 4.2 },
  LT: { currency: "EUR", de_minimis_usd: 0, vat_rate: 21, avg_duty_rate: 4.2 },
  LV: { currency: "EUR", de_minimis_usd: 0, vat_rate: 21, avg_duty_rate: 4.2 },
  EE: { currency: "EUR", de_minimis_usd: 0, vat_rate: 22, avg_duty_rate: 4.2 },
  CY: { currency: "EUR", de_minimis_usd: 0, vat_rate: 19, avg_duty_rate: 4.2 },
  MT: { currency: "EUR", de_minimis_usd: 0, vat_rate: 18, avg_duty_rate: 4.2 },
  LU: { currency: "EUR", de_minimis_usd: 0, vat_rate: 17, avg_duty_rate: 4.2, notes_en: "Lowest VAT in EU at 17%", notes_ru: "Самый низкий НДС в ЕС — 17%" },
  IS: { currency: "ISK", de_minimis_usd: 25, vat_rate: 24, avg_duty_rate: 5 },
  RS: { currency: "RSD", de_minimis_usd: 50, vat_rate: 20, avg_duty_rate: 10 },
  BA: { currency: "BAM", de_minimis_usd: 40, vat_rate: 17, avg_duty_rate: 10 },
  AL: { currency: "ALL", de_minimis_usd: 22, vat_rate: 20, avg_duty_rate: 10 },
  MK: { currency: "MKD", de_minimis_usd: 45, vat_rate: 18, avg_duty_rate: 10 },
  UY: { currency: "UYU", de_minimis_usd: 200, vat_rate: 22, avg_duty_rate: 14 },
  EC: { currency: "USD", de_minimis_usd: 400, vat_rate: 12, avg_duty_rate: 10, notes_en: "Uses USD; $400 duty-free for international mail", notes_ru: "Используется USD; $400 беспошлинно для международной почты" },
  JO: { currency: "JOD", de_minimis_usd: 100, vat_rate: 16, avg_duty_rate: 15 },
  BH: { currency: "BHD", de_minimis_usd: 270, vat_rate: 10, avg_duty_rate: 5 },
  OM: { currency: "OMR", de_minimis_usd: 270, vat_rate: 5, avg_duty_rate: 5 },
  // Batch 4 — 20 more countries
  GH: { currency: "GHS", de_minimis_usd: 50, vat_rate: 15, avg_duty_rate: 20 },
  TZ: { currency: "TZS", de_minimis_usd: 0, vat_rate: 18, avg_duty_rate: 25 },
  UG: { currency: "UGX", de_minimis_usd: 0, vat_rate: 18, avg_duty_rate: 25 },
  ET: { currency: "ETB", de_minimis_usd: 0, vat_rate: 15, avg_duty_rate: 25 },
  SN: { currency: "XOF", de_minimis_usd: 0, vat_rate: 18, avg_duty_rate: 20 },
  CI: { currency: "XOF", de_minimis_usd: 0, vat_rate: 18, avg_duty_rate: 20 },
  CM: { currency: "XAF", de_minimis_usd: 0, vat_rate: 19.25, avg_duty_rate: 20 },
  MU: { currency: "MUR", de_minimis_usd: 0, vat_rate: 15, avg_duty_rate: 8 },
  TN: { currency: "TND", de_minimis_usd: 0, vat_rate: 19, avg_duty_rate: 20 },
  LB: { currency: "LBP", de_minimis_usd: 0, vat_rate: 11, avg_duty_rate: 5 },
  IQ: { currency: "IQD", de_minimis_usd: 0, vat_rate: 0, avg_duty_rate: 5, notes_en: "No VAT system; customs duties apply", notes_ru: "Нет системы НДС; применяются таможенные пошлины" },
  MM: { currency: "MMK", de_minimis_usd: 0, vat_rate: 5, avg_duty_rate: 15 },
  KH: { currency: "KHR", de_minimis_usd: 0, vat_rate: 10, avg_duty_rate: 15 },
  NP: { currency: "NPR", de_minimis_usd: 0, vat_rate: 13, avg_duty_rate: 15 },
  CR: { currency: "CRC", de_minimis_usd: 50, vat_rate: 13, avg_duty_rate: 10 },
  PA: { currency: "USD", de_minimis_usd: 100, vat_rate: 7, avg_duty_rate: 10, notes_en: "Uses USD; Colon Free Zone for re-exports", notes_ru: "Используется USD; Свободная зона Колон для реэкспорта" },
  DO: { currency: "DOP", de_minimis_usd: 200, vat_rate: 18, avg_duty_rate: 14 },
  GT: { currency: "GTQ", de_minimis_usd: 0, vat_rate: 12, avg_duty_rate: 15 },
  PY: { currency: "PYG", de_minimis_usd: 50, vat_rate: 10, avg_duty_rate: 10 },
  BO: { currency: "BOB", de_minimis_usd: 0, vat_rate: 13, avg_duty_rate: 10 },
};

// Default for countries not in the list
const defaultCustoms: CustomsInfo = {
  currency: "USD",
  de_minimis_usd: 50,
  vat_rate: 15,
  avg_duty_rate: 10,
};

export function getCustomsInfo(countryCode: string): CustomsInfo {
  return customsData[countryCode] || defaultCustoms;
}

export function hasCustomsData(countryCode: string): boolean {
  return countryCode in customsData;
}
