/**
 * Maps countries to their relevant locales.
 * Corridor pages should only exist in: origin language + destination language + English
 */

import type { Locale } from "./types";

// Country → primary language(s) that people search in
const countryLocales: Record<string, Locale[]> = {
  // English-speaking
  US: ["en"], GB: ["en"], AU: ["en"], CA: ["en"], NZ: ["en"], IE: ["en"],
  SG: ["en"], HK: ["en", "zh"], ZA: ["en"], NG: ["en"], KE: ["en"], GH: ["en"],
  PH: ["en"], IN: ["en"], PK: ["en"], MY: ["en"],

  // Russian-speaking
  RU: ["ru"], BY: ["ru"], KZ: ["ru"], KG: ["ru"], UA: ["ru"],

  // Spanish-speaking
  ES: ["es"], MX: ["es"], AR: ["es"], CO: ["es"], CL: ["es"], PE: ["es"],
  EC: ["es"], VE: ["es"], UY: ["es"], BO: ["es"], PY: ["es"], CR: ["es"],
  PA: ["es"], DO: ["es"], GT: ["es"], HN: ["es"], SV: ["es"], NI: ["es"],
  CU: ["es"],

  // German-speaking
  DE: ["de"], AT: ["de"], CH: ["de", "fr"],

  // French-speaking
  FR: ["fr"], BE: ["fr"], LU: ["fr"], SN: ["fr"], CI: ["fr"], CM: ["fr"],
  MA: ["fr"], TN: ["fr"], DZ: ["fr"],

  // Portuguese-speaking
  BR: ["pt"], PT: ["pt"], MZ: ["pt"], AO: ["pt"],

  // Chinese-speaking
  CN: ["zh"], TW: ["zh"],

  // Japanese
  JP: ["ja"],

  // Korean
  KR: ["ko"],

  // Arabic-speaking
  AE: ["ar", "en"], SA: ["ar"], EG: ["ar"], JO: ["ar"], KW: ["ar"],
  QA: ["ar"], BH: ["ar"], OM: ["ar"], IQ: ["ar"], LB: ["ar"], LY: ["ar"],
  SD: ["ar"],

  // Turkish
  TR: ["tr"],

  // Italian
  IT: ["it"],

  // Others (default to English)
  TH: ["en"], VN: ["en"], ID: ["en"], BD: ["en"], LK: ["en"], MM: ["en"],
  KH: ["en"], LA: ["en"], NP: ["en"], MN: ["en"], BN: ["en"], FJ: ["en"],
  IL: ["en"], GE: ["en"], AM: ["ru"], AZ: ["en"], UZ: ["ru"], TJ: ["ru"],
  MD: ["ru"], AL: ["en"], RS: ["en"], BA: ["en"], MK: ["en"], ME: ["en"],
  XK: ["en"], IS: ["en"],
  SE: ["en"], NO: ["en"], DK: ["en"], FI: ["en"],
  PL: ["en"], CZ: ["en"], SK: ["en"], HU: ["en"], RO: ["en"], BG: ["en"],
  HR: ["en"], SI: ["en"], LT: ["en"], LV: ["en"], EE: ["en"],
  GR: ["en"], CY: ["en"], MT: ["en"],
  JM: ["en"], TT: ["en"],
  MU: ["en"], MW: ["en"], ZM: ["en"], ZW: ["en"], RW: ["en"],
  BW: ["en"], NA: ["en"], TZ: ["en"], UG: ["en"], ET: ["en"],
};

/**
 * Get the relevant locales for a corridor page.
 * Returns: union of origin locales + destination locales + always English.
 */
export function getCorridorLocales(originCode: string, destCode: string): Locale[] {
  const originLangs = countryLocales[originCode] || ["en"];
  const destLangs = countryLocales[destCode] || ["en"];
  const combined = new Set<Locale>([...originLangs, ...destLangs, "en" as Locale]);
  return [...combined];
}

/**
 * Check if a corridor page should exist for a given locale.
 */
export function isCorridorLocaleValid(originCode: string, destCode: string, locale: Locale): boolean {
  const valid = getCorridorLocales(originCode, destCode);
  return valid.includes(locale);
}

/**
 * Get the best fallback locale for a corridor if current locale is not valid.
 */
export function getCorridorFallbackLocale(originCode: string, destCode: string, currentLocale: Locale): Locale {
  const valid = getCorridorLocales(originCode, destCode);
  if (valid.includes(currentLocale)) return currentLocale;
  // Prefer English
  return "en";
}
