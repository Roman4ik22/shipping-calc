export interface Country {
  code: string;
  name_en: string;
  name_ru: string;
  name_es: string;
  name_de: string;
  name_fr: string;
  name_pt: string;
  name_zh: string;
  name_ja: string;
  name_ko: string;
  name_ar: string;
  name_tr: string;
  name_it: string;
  slug_en: string;
  slug_ru: string;
  region: string;
  continent: string;
}

export interface CarrierService {
  id: string;
  name: string;
  speed_days_min: number;
  speed_days_max: number;
  max_weight_kg: number;
  tracking: boolean;
}

export interface Carrier {
  id: string;
  name: string;
  type: "international" | "regional" | "postal";
  logo: string;
  website: string;
  tracking_url: string;
  description_en: string;
  description_ru: string;
  services: CarrierService[];
}

export interface RateZone {
  zone: number;
  description: string;
  countries_from: string[];
  countries_to: string[];
}

export interface RateEntry {
  weight_kg: number;
  prices_by_zone: (number | null)[];
}

export interface CarrierRateData {
  carrier_id: string;
  effective_date: string;
  note: string;
  zones: RateZone[];
  rates: Record<string, RateEntry[]>;
}

export interface CorridorRate {
  carrier: Carrier;
  service: CarrierService;
  rates: { weight_kg: number; price_usd: number }[];
  estimated_days_min: number;
  estimated_days_max: number;
}

export interface CorridorData {
  origin: Country;
  destination: Country;
  carriers: CorridorRate[];
}

export type Locale = "en" | "ru" | "es" | "de" | "fr" | "pt" | "zh" | "ja" | "ko" | "ar" | "tr" | "it";
