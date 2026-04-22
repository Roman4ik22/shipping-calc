/**
 * Smart locale routing for carrier pages.
 *
 * Rule: a carrier page should only exist in languages where the carrier is
 * actually searched for — typically the carrier's HQ country language + English.
 *
 * Global integrators (DHL, FedEx, UPS, TNT, etc.) → all 12 locales.
 * Country-specific carriers → origin country language(s) + English.
 *
 * We keep the origin-country map explicit (no heuristics on name) so that
 * add/remove operations are obvious and searchable.
 */

import type { Locale } from "./types";
import { locales } from "./i18n";

/**
 * Carriers that serve truly global e-commerce markets and are searched
 * in every language. Includes type:"international" plus a few large
 * Asian integrators that ship worldwide consolidations.
 */
const GLOBAL_CARRIERS = new Set<string>([
  // International integrators
  "dhl-express", "fedex", "ups", "tnt",
  // Global pan-regional
  "aramex", "sf-express", "cainiao", "cainiao-network", "4px-express",
  "yanwen", "asendia", "landmark-global", "globalpost-by-auctane",
  "pitney-bowes", "passport-shipping-passport-global",
  "postnl-international", "epacket-china-post-usps", "spring-gds",
  "zonos", "packlink",
]);

/**
 * Carrier ID → country code (ISO 3166-1 alpha-2) of its main market.
 * Used to derive relevant locales via countryLocales in country-locale.ts.
 */
const CARRIER_COUNTRY: Record<string, string> = {
  // USA
  "usps": "US", "pitney-bowes": "US", "ipostal1": "US",
  // UK
  "royal-mail": "GB", "evri-formerly-hermes": "GB",
  // Germany
  "deutsche-post": "DE", "dpd": "DE", "gls-general-logistics-systems": "DE",
  "dpd-group-eu": "DE",
  // France
  "la-poste-france": "FR", "colissimo-la-poste": "FR", "mondial-relay": "FR",
  "dpex-worldwide": "FR", "env-a-com": "FR",
  // Netherlands
  "postnl": "NL",
  // Belgium
  "bpost": "BE",
  // Switzerland
  "swiss-post": "CH",
  // Austria
  "austrian-post-sterreichische-post": "AT",
  // Poland
  "inpost": "PL", "poczta-polska": "PL",
  // Spain
  "correos": "ES", "correos-express": "ES",
  // Italy (no national carrier in list)
  // Scandinavia
  "postnord": "SE",
  // Czech / Hungary
  "ceska-posta": "CZ", "magyar-posta": "HU", "omniva": "EE",
  // Russia
  "pochta-rossii": "RU", "cdek": "RU", "cdek-regional": "RU", "boxberry": "RU",
  "dpd-russia": "RU", "pony-express": "RU", "spsr-express": "RU",
  "hermes-russia": "RU", "pickpoint": "RU", "5post": "RU", "sberlogistika": "RU",
  // Ukraine
  "nova-poshta": "UA", "meest": "UA",
  // Japan
  "japan-post": "JP", "japan-post-yu-pack-ems": "JP",
  "yamato-transport-kuroneko-yamato": "JP", "sagawa-express": "JP",
  // Korea
  "korea-post": "KR", "cj-logistics-cj-korea-express": "KR",
  "hanjin-express": "KR", "lotte-global-logistics": "KR",
  // China
  "china-post": "CN", "sf-express": "CN", "ems": "CN",
  "sto-express-shentong-express": "CN", "yto-express-yuantong-express": "CN",
  "zto-international": "CN", "best-inc-international": "CN",
  "cne-express-china-navigation-express": "CN", "sunyou-sunyou-post": "CN",
  "equick-china": "CN", "wishpost": "CN", "joom-logistics": "CN",
  // Hong Kong / Taiwan
  "hongkong-post": "HK", "taiwan-post": "TW",
  // India
  "india-post": "IN", "delhivery": "IN", "blue-dart-dhl-group": "IN",
  "dtdc-express": "IN", "dtdc": "IN", "ecom-express": "IN",
  "xpressbees": "IN", "shadowfax": "IN",
  // Thailand / SE Asia
  "thailand-post": "TH", "kerry-express-thailand": "TH", "kerry-express-kex": "TH",
  "kerry-express": "TH", "flash-express": "TH",
  "best-express-thailand-sea": "TH",
  "j-and-t": "ID", "j-and-t-express": "ID", "j-t-express": "ID",
  "jne-express": "ID", "tiki-titipan-kilat": "ID", "sicepat-ekspres": "ID",
  "pos-indonesia": "ID",
  "ninja-van": "SG", "singpost": "SG",
  "lbc-express": "PH", "2go-express": "PH", "xend-business-solutions": "PH",
  "philpost": "PH",
  "pos-malaysia": "MY", "pos-laju": "MY",
  "vietnam-post": "VN",
  "bangladesh-post": "BD", "sri-lanka-post": "LK", "pakistan-post": "PK",
  // Australia / NZ
  "australia-post": "AU", "aramex-australia-formerly-fastway": "AU",
  "couriersplease": "AU", "startrack": "AU", "sendle": "AU",
  "nz-post": "NZ", "fiji-post": "FJ",
  // Canada
  "canada-post": "CA",
  // Middle East / Africa
  "emirates-post": "AE", "saudi-post": "SA", "smsa-express": "SA",
  "naqel-express": "SA", "fetchr": "AE", "imile": "AE",
  "skynet-worldwide-express": "AE", "aramex-shop-and-ship": "AE",
  "aramex-africa": "ZA", "dhl-africa-ecommerce": "ZA",
  "the-courier-guy": "ZA", "pargo": "ZA", "sa-post": "ZA",
  "jumia-logistics": "NG", "nipost": "NG",
  "posta-kenya": "KE",
  // Latin America
  "correios-brazil": "BR",
  "andreani": "AR",
  "chilexpress": "CL", "cruz-del-sur": "CL",
  "servientrega": "CO", "deprisa": "CO",
  "olva-courier": "PE",
  "99minutos": "MX", "estafeta": "MX",
  // Turkey
  "tnt": "NL", // TNT is NL-originated but global → GLOBAL_CARRIERS overrides
};

/**
 * Return the set of locales a carrier page should exist in.
 * - Global carriers → all 12 locales.
 * - Otherwise → origin country's locales + English.
 * - Unknown origin → English only (fail closed, no page spam).
 */
export function getCarrierLocales(carrierId: string, carrierType?: string): Locale[] {
  if (GLOBAL_CARRIERS.has(carrierId)) return [...locales];
  if (carrierType === "international") return [...locales];

  const country = CARRIER_COUNTRY[carrierId];
  if (!country) return ["en"];

  // Inline country→locale map to avoid circular import concerns.
  const countryLangs: Record<string, Locale[]> = {
    US: ["en"], GB: ["en"], AU: ["en"], CA: ["en"], NZ: ["en"],
    IE: ["en"], SG: ["en"], HK: ["en", "zh"], IN: ["en"],
    PH: ["en"], MY: ["en"], PK: ["en"], KE: ["en"], NG: ["en"], ZA: ["en"],
    RU: ["ru"], BY: ["ru"], KZ: ["ru"], UA: ["ru"],
    ES: ["es"], MX: ["es"], AR: ["es"], CO: ["es"], CL: ["es"], PE: ["es"],
    EC: ["es"], VE: ["es"], UY: ["es"], BO: ["es"],
    DE: ["de"], AT: ["de"], CH: ["de", "fr"],
    FR: ["fr"], BE: ["fr"], LU: ["fr"],
    BR: ["pt"], PT: ["pt"],
    CN: ["zh"], TW: ["zh"],
    JP: ["ja"],
    KR: ["ko"],
    AE: ["ar", "en"], SA: ["ar"], EG: ["ar"],
    TR: ["tr"],
    IT: ["it"],
    NL: ["en"], PL: ["en"], CZ: ["en"], HU: ["en"], SE: ["en"],
    EE: ["en"], FJ: ["en"], VN: ["en"], TH: ["en"], ID: ["en"],
    BD: ["en"], LK: ["en"],
  };
  const origin = countryLangs[country] || ["en"];
  return Array.from(new Set<Locale>([...origin, "en"]));
}

/**
 * Is a given locale valid for this carrier?
 */
export function isCarrierLocaleValid(carrierId: string, locale: Locale, carrierType?: string): boolean {
  return getCarrierLocales(carrierId, carrierType).includes(locale);
}
