import countriesData from "../data/countries.json";
import carriersData from "../data/carriers.json";
import dhlRates from "../data/rates/dhl-express.json";
import fedexRates from "../data/rates/fedex.json";
import upsRates from "../data/rates/ups.json";
import emsRates from "../data/rates/ems.json";
import aramexRates from "../data/rates/aramex.json";
import pochtaRates from "../data/rates/pochta-rossii.json";
import tntRates from "../data/rates/tnt.json";
import dpdRates from "../data/rates/dpd.json";
import uspsRates from "../data/rates/usps.json";
import royalMailRates from "../data/rates/royal-mail.json";
import japanPostRates from "../data/rates/japan-post.json";
import chinaPostRates from "../data/rates/china-post.json";
import sfExpressRates from "../data/rates/sf-express.json";
import yanwenRates from "../data/rates/yanwen.json";
import postnlRates from "../data/rates/postnl.json";
import deutschePostRates from "../data/rates/deutsche-post.json";
import type {
  Country,
  Carrier,
  CarrierRateData,
  CorridorRate,
  CorridorData,
  Locale,
} from "./types";

// Cast imported JSON
export const countries: Country[] = countriesData as Country[];
export const carriers: Carrier[] = carriersData as Carrier[];
const allRateData: CarrierRateData[] = [
  dhlRates,
  fedexRates,
  upsRates,
  emsRates,
  aramexRates,
  pochtaRates,
  tntRates,
  dpdRates,
  uspsRates,
  royalMailRates,
  japanPostRates,
  chinaPostRates,
  sfExpressRates,
  yanwenRates,
  postnlRates,
  deutschePostRates,
] as CarrierRateData[];

// Lookup maps
const countryByCode = new Map(countries.map((c) => [c.code, c]));
const countryBySlugEn = new Map(countries.map((c) => [c.slug_en, c]));
const countryBySlugRu = new Map(countries.map((c) => [c.slug_ru, c]));
const carrierById = new Map(carriers.map((c) => [c.id, c]));
const ratesByCarrierId = new Map(allRateData.map((r) => [r.carrier_id, r]));

export function getCountryBySlug(
  slug: string,
  locale: Locale = "en"
): Country | undefined {
  return locale === "ru" ? countryBySlugRu.get(slug) : countryBySlugEn.get(slug);
}

export function getCountryByCode(code: string): Country | undefined {
  return countryByCode.get(code);
}

export function getCarrierById(id: string): Carrier | undefined {
  return carrierById.get(id);
}

function findZoneIndex(
  rateData: CarrierRateData,
  originCode: string,
  destCode: string
): number | null {
  for (let i = 0; i < rateData.zones.length; i++) {
    const zone = rateData.zones[i];
    const fromMatch =
      zone.countries_from.includes("*") ||
      zone.countries_from.includes(originCode);
    const toMatch =
      zone.countries_to.includes(destCode) ||
      zone.countries_to.includes("NEIGHBORS") ||
      zone.countries_to.includes("REGIONAL") ||
      zone.countries_to.includes("INTERCONTINENTAL") ||
      zone.countries_to.includes("REMOTE");

    if (fromMatch && toMatch) {
      return i;
    }
  }
  return null;
}

// For EMS and similar universal services, estimate zone by distance/region
function estimateEmsZone(origin: Country, dest: Country): number {
  if (origin.continent === dest.continent && origin.region === dest.region)
    return 0; // neighbors
  if (origin.continent === dest.continent) return 1; // regional
  // Check if relatively close continents
  const closeGroups = [
    ["Europe", "Africa"],
    ["Asia", "Oceania"],
    ["North America", "South America"],
  ];
  for (const group of closeGroups) {
    if (
      group.includes(origin.continent) &&
      group.includes(dest.continent)
    )
      return 2;
  }
  return 3; // remote
}

export function getCorridorRates(
  originCode: string,
  destCode: string
): CorridorRate[] {
  const origin = countryByCode.get(originCode);
  const dest = countryByCode.get(destCode);
  if (!origin || !dest || originCode === destCode) return [];

  const results: CorridorRate[] = [];

  for (const carrier of carriers) {
    const rateData = ratesByCarrierId.get(carrier.id);

    for (const service of carrier.services) {
      let rates: { weight_kg: number; price_usd: number }[] = [];

      if (rateData) {
        const serviceRates = rateData.rates[service.id];
        if (!serviceRates) continue;

        let zoneIdx: number | null = null;

        // Special handling for EMS-like universal postal services
        if (carrier.id === "ems") {
          zoneIdx = estimateEmsZone(origin, dest);
        } else {
          zoneIdx = findZoneIndex(rateData, originCode, destCode);
        }

        if (zoneIdx === null) continue;

        rates = serviceRates
          .map((entry) => ({
            weight_kg: entry.weight_kg,
            price_usd: entry.prices_by_zone[zoneIdx!] ?? 0,
          }))
          .filter((r) => r.price_usd > 0);
      }

      // If no rate data, create estimated rates based on carrier type and distance
      if (rates.length === 0 && !rateData) {
        rates = generateEstimatedRates(carrier, origin, dest);
      }

      if (rates.length > 0) {
        results.push({
          carrier,
          service,
          rates,
          estimated_days_min: service.speed_days_min,
          estimated_days_max: service.speed_days_max,
        });
      }
    }
  }

  // Sort by cheapest 1kg rate
  results.sort((a, b) => {
    const aRate = a.rates.find((r) => r.weight_kg === 1)?.price_usd ?? 999;
    const bRate = b.rates.find((r) => r.weight_kg === 1)?.price_usd ?? 999;
    return aRate - bRate;
  });

  return results;
}

function generateEstimatedRates(
  carrier: Carrier,
  origin: Country,
  dest: Country
): { weight_kg: number; price_usd: number }[] {
  // Base multiplier by distance
  let multiplier = 1;
  if (origin.continent === dest.continent && origin.region === dest.region) {
    multiplier = 0.7;
  } else if (origin.continent === dest.continent) {
    multiplier = 0.85;
  } else {
    multiplier = 1.2;
  }

  // Carrier type affects base price
  let basePrice = 40;
  if (carrier.type === "postal") basePrice = 20;
  if (carrier.type === "regional") basePrice = 30;

  const weights = [0.5, 1, 2, 5, 10, 20, 30];
  return weights
    .filter((w) => w <= (carrier.services[0]?.max_weight_kg ?? 30))
    .map((w) => ({
      weight_kg: w,
      price_usd: Math.round(basePrice * multiplier * (0.6 + w * 0.4)),
    }));
}

export function getCorridorData(
  originCode: string,
  destCode: string
): CorridorData | null {
  const origin = countryByCode.get(originCode);
  const dest = countryByCode.get(destCode);
  if (!origin || !dest) return null;

  return {
    origin,
    destination: dest,
    carriers: getCorridorRates(originCode, destCode),
  };
}

export function parseCorridorSlug(
  slug: string,
  locale: Locale = "en"
): { origin: Country; destination: Country } | null {
  const separator = locale === "ru" ? "-v-" : "-to-";
  const parts = slug.split(separator);
  if (parts.length !== 2) return null;

  const origin = getCountryBySlug(parts[0], locale);
  const destination = getCountryBySlug(parts[1], locale);

  if (!origin || !destination) return null;
  return { origin, destination };
}

export function makeCorridorSlug(
  origin: Country,
  dest: Country,
  locale: Locale = "en"
): string {
  if (locale === "ru") {
    return `${origin.slug_ru}-v-${dest.slug_ru}`;
  }
  return `${origin.slug_en}-to-${dest.slug_en}`;
}

export function getAllCorridorSlugs(locale: Locale = "en"): string[] {
  const slugs: string[] = [];
  for (const origin of countries) {
    for (const dest of countries) {
      if (origin.code !== dest.code) {
        slugs.push(makeCorridorSlug(origin, dest, locale));
      }
    }
  }
  return slugs;
}

export function getPopularCountries(): Country[] {
  const popularCodes = [
    "US", "GB", "DE", "FR", "CN", "JP", "KR", "AU", "CA", "IT",
    "ES", "NL", "RU", "BR", "IN", "AE", "SG", "TH", "MY", "TR",
    "PL", "SE", "CH", "SA", "ID", "PH", "VN", "MX", "IL", "NZ",
  ];
  return popularCodes
    .map((code) => countryByCode.get(code))
    .filter((c): c is Country => c !== undefined);
}

export function getCountryName(country: Country, locale: Locale): string {
  return locale === "ru" ? country.name_ru : country.name_en;
}

export function getCarrierDescription(carrier: Carrier, locale: Locale): string {
  return locale === "ru" ? carrier.description_ru : carrier.description_en;
}
