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
import canadaPostRates from "../data/rates/canada-post.json";
import australiaPostRates from "../data/rates/australia-post.json";
import indiaPostRates from "../data/rates/india-post.json";
import koreaPostRates from "../data/rates/korea-post.json";
import singpostRates from "../data/rates/singpost.json";
import glsRates from "../data/rates/gls-general-logistics-systems.json";
import evriRates from "../data/rates/evri-formerly-hermes.json";
import colissimoRates from "../data/rates/colissimo-la-poste.json";
import correosRates from "../data/rates/correos.json";
import swissPostRates from "../data/rates/swiss-post.json";
import cdekRates from "../data/rates/cdek.json";
import correiosBrazilRates from "../data/rates/correios-brazil.json";
import postnordRates from "../data/rates/postnord.json";
import cainiaoRates from "../data/rates/cainiao.json";
import fourpxRates from "../data/rates/4px-express.json";
import thailandPostRates from "../data/rates/thailand-post.json";
import posMalaysiaRates from "../data/rates/pos-malaysia.json";
import novaPoshtaRates from "../data/rates/nova-poshta.json";
import blueDartRates from "../data/rates/blue-dart-dhl-group.json";
import delhiveryRates from "../data/rates/delhivery.json";
import jtRates from "../data/rates/j-and-t.json";
import ninjaVanRates from "../data/rates/ninja-van.json";
import jneRates from "../data/rates/jne-express.json";
import dpexRates from "../data/rates/dpex-worldwide.json";
import kerryRates from "../data/rates/kerry-express-kex.json";
import boxberryRates from "../data/rates/boxberry.json";
import ponyExpressRates from "../data/rates/pony-express.json";
import meestRates from "../data/rates/meest.json";
import dtdcRates from "../data/rates/dtdc-express.json";
import lbcRates from "../data/rates/lbc-express.json";
import flashExpressRates from "../data/rates/flash-express.json";
import cneRates from "../data/rates/cne-express-china-navigation-express.json";
import sunyouRates from "../data/rates/sunyou-sunyou-post.json";
import equickRates from "../data/rates/equick-china.json";
import ztoRates from "../data/rates/zto-international.json";
import stoRates from "../data/rates/sto-express-shentong-express.json";
import ytoRates from "../data/rates/yto-express-yuantong-express.json";
import bestIncRates from "../data/rates/best-inc-international.json";
import dpdRussiaRates from "../data/rates/dpd-russia.json";
import sicepatRates from "../data/rates/sicepat-ekspres.json";
// Batch 7
import bestExpressThaiRates from "../data/rates/best-express-thailand-sea.json";
import tikiRates from "../data/rates/tiki-titipan-kilat.json";
import twoGoRates from "../data/rates/2go-express.json";
import xendRates from "../data/rates/xend-business-solutions.json";
import kerryThaiRates from "../data/rates/kerry-express-thailand.json";
import spsrRates from "../data/rates/spsr-express.json";
import hermesRussiaRates from "../data/rates/hermes-russia.json";
import ecomRates from "../data/rates/ecom-express.json";
import xpressbeesRates from "../data/rates/xpressbees.json";
import shadowfaxRates from "../data/rates/shadowfax.json";
// Batch 8
import fetchrRates from "../data/rates/fetchr.json";
import naqelRates from "../data/rates/naqel-express.json";
import smsaRates from "../data/rates/smsa-express.json";
import skynetRates from "../data/rates/skynet-worldwide-express.json";
import courierGuyRates from "../data/rates/the-courier-guy.json";
import pargoRates from "../data/rates/pargo.json";
import jumiaRates from "../data/rates/jumia-logistics.json";
import imileRates from "../data/rates/imile.json";
import ninetyNineRates from "../data/rates/99minutos.json";
import envacomRates from "../data/rates/env-a-com.json";
// Batch 9
import andreaniRates from "../data/rates/andreani.json";
import chilexpressRates from "../data/rates/chilexpress.json";
import servientregaRates from "../data/rates/servientrega.json";
import olvaRates from "../data/rates/olva-courier.json";
import estafetaRates from "../data/rates/estafeta.json";
import inpostRates from "../data/rates/inpost.json";
import mondialRates from "../data/rates/mondial-relay.json";
// Removed: spring-gds, packlink (aggregators, not carriers)
import bpostRates from "../data/rates/bpost.json";
// Batch 10
import austrianPostRates from "../data/rates/austrian-post-sterreichische-post.json";
import laPosteRates from "../data/rates/la-poste-france.json";
import dpdEuRates from "../data/rates/dpd-group-eu.json";
import yamatoRates from "../data/rates/yamato-transport-kuroneko-yamato.json";
import sagawaRates from "../data/rates/sagawa-express.json";
import japanPostYuPackRates from "../data/rates/japan-post-yu-pack-ems.json";
import cjLogisticsRates from "../data/rates/cj-logistics-cj-korea-express.json";
import hanjinRates from "../data/rates/hanjin-express.json";
// Batch 11
import lotteRates from "../data/rates/lotte-global-logistics.json";
// Removed: sendle (shut down Jan 2026)
import courierspleaseRates from "../data/rates/couriersplease.json";
import startrackRates from "../data/rates/startrack.json";
import aramexAuRates from "../data/rates/aramex-australia-formerly-fastway.json";
import nzPostRates from "../data/rates/nz-post.json";
import epacketRates from "../data/rates/epacket-china-post-usps.json";
// Removed: zonos (platform, not carrier)
// Batch 12
import passportRates from "../data/rates/passport-shipping-passport-global.json";
import pitneyBowesRates from "../data/rates/pitney-bowes.json";
import asendiaRates from "../data/rates/asendia.json";
// Removed: ipostal1 (virtual mailbox, not carrier)
import postnlIntlRates from "../data/rates/postnl-international.json";
import globalpostRates from "../data/rates/globalpost-by-auctane.json";
import landmarkRates from "../data/rates/landmark-global.json";
// Batch 13
import aramexAfricaRates from "../data/rates/aramex-africa.json";
import aramexShopShipRates from "../data/rates/aramex-shop-and-ship.json";
import bangladeshPostRates from "../data/rates/bangladesh-post.json";
import ceskaPostaRates from "../data/rates/ceska-posta.json";
import correosExpressRates from "../data/rates/correos-express.json";
import cruzDelSurRates from "../data/rates/cruz-del-sur.json";
import deprisaRates from "../data/rates/deprisa.json";
import dhlAfricaRates from "../data/rates/dhl-africa-ecommerce.json";
import emiratesPostRates from "../data/rates/emirates-post.json";
import fijiPostRates from "../data/rates/fiji-post.json";
import hongkongPostRates from "../data/rates/hongkong-post.json";
import magyarPostaRates from "../data/rates/magyar-posta.json";
import mercadoEnviosRates from "../data/rates/mercado-envios.json";
import omnivaRates from "../data/rates/omniva.json";
import pakistanPostRates from "../data/rates/pakistan-post.json";
import philpostRates from "../data/rates/philpost.json";
import pocztaPolskaRates from "../data/rates/poczta-polska.json";
import posIndonesiaRates from "../data/rates/pos-indonesia.json";
import posLajuRates from "../data/rates/pos-laju.json";
import postaKenyaRates from "../data/rates/posta-kenya.json";
import saPostRates from "../data/rates/sa-post.json";
import saudiPostRates from "../data/rates/saudi-post.json";
import sriLankaPostRates from "../data/rates/sri-lanka-post.json";
import taiwanPostRates from "../data/rates/taiwan-post.json";
import vietnamPostRates from "../data/rates/vietnam-post.json";
import jAndTExpressRates from "../data/rates/j-and-t-express.json";
import theCourierGuyRates from "../data/rates/the-courier-guy.json";
// Batch 14
import wishpostRates from "../data/rates/wishpost.json";
import joomLogisticsRates from "../data/rates/joom-logistics.json";
import pickpointRates from "../data/rates/pickpoint.json";
import fivePostRates from "../data/rates/5post.json";
import sberlogistikaRates from "../data/rates/sberlogistika.json";
import nipostRates from "../data/rates/nipost.json";
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
  canadaPostRates,
  australiaPostRates,
  indiaPostRates,
  koreaPostRates,
  singpostRates,
  glsRates,
  evriRates,
  colissimoRates,
  correosRates,
  swissPostRates,
  cdekRates,
  correiosBrazilRates,
  postnordRates,
  cainiaoRates,
  fourpxRates,
  thailandPostRates,
  posMalaysiaRates,
  novaPoshtaRates,
  blueDartRates,
  delhiveryRates,
  jtRates,
  ninjaVanRates,
  jneRates,
  dpexRates,
  kerryRates,
  boxberryRates,
  ponyExpressRates,
  meestRates,
  dtdcRates,
  lbcRates,
  flashExpressRates,
  cneRates,
  sunyouRates,
  equickRates,
  ztoRates,
  stoRates,
  ytoRates,
  bestIncRates,
  dpdRussiaRates,
  sicepatRates,
  // Batch 7
  bestExpressThaiRates,
  tikiRates,
  twoGoRates,
  xendRates,
  kerryThaiRates,
  spsrRates,
  hermesRussiaRates,
  ecomRates,
  xpressbeesRates,
  shadowfaxRates,
  // Batch 8
  fetchrRates,
  naqelRates,
  smsaRates,
  skynetRates,
  courierGuyRates,
  pargoRates,
  jumiaRates,
  imileRates,
  ninetyNineRates,
  envacomRates,
  // Batch 9
  andreaniRates,
  chilexpressRates,
  servientregaRates,
  olvaRates,
  estafetaRates,
  inpostRates,
  mondialRates,
  bpostRates,
  // Batch 10
  austrianPostRates,
  laPosteRates,
  dpdEuRates,
  yamatoRates,
  sagawaRates,
  japanPostYuPackRates,
  cjLogisticsRates,
  hanjinRates,
  // Batch 11
  lotteRates,
  courierspleaseRates,
  startrackRates,
  aramexAuRates,
  nzPostRates,
  epacketRates,
  // Batch 12
  passportRates,
  pitneyBowesRates,
  asendiaRates,
  postnlIntlRates,
  globalpostRates,
  landmarkRates,
  // Batch 13
  aramexAfricaRates,
  aramexShopShipRates,
  bangladeshPostRates,
  ceskaPostaRates,
  correosExpressRates,
  cruzDelSurRates,
  deprisaRates,
  dhlAfricaRates,
  emiratesPostRates,
  fijiPostRates,
  hongkongPostRates,
  magyarPostaRates,
  mercadoEnviosRates,
  omnivaRates,
  pakistanPostRates,
  philpostRates,
  pocztaPolskaRates,
  posIndonesiaRates,
  posLajuRates,
  postaKenyaRates,
  saPostRates,
  saudiPostRates,
  sriLankaPostRates,
  taiwanPostRates,
  vietnamPostRates,
  jAndTExpressRates,
  theCourierGuyRates,
  // Batch 14
  wishpostRates,
  joomLogisticsRates,
  pickpointRates,
  fivePostRates,
  sberlogistikaRates,
  nipostRates,
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
  const nameKey = `name_${locale}` as keyof Country;
  return (country[nameKey] as string) || country.name_en;
}

export function getCarrierDescription(carrier: Carrier, locale: Locale): string {
  return locale === "ru" ? carrier.description_ru : carrier.description_en;
}
