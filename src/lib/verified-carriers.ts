/**
 * Carriers with rates verified from official published sources.
 * All others use calibrated estimates.
 */
export const VERIFIED_CARRIER_IDS = new Set([
  // Major international (published rate cards)
  "dhl-express",
  "fedex",
  "ups",
  "ems",
  "usps",
  "royal-mail",
  "japan-post",
  "australia-post",
  "canada-post",
  "deutsche-post",
  // Regional verified
  "aramex",
  "korea-post",
  "china-post",
  "swiss-post",
  "evri-formerly-hermes",
  "dpd",
  "gls-general-logistics-systems",
  "colissimo-la-poste",
  "la-poste-france",
  "correos",
  "poczta-polska",
  "nipost",
  "nova-poshta",
  "nova-poshta-intl",
  "cdek-regional",
  "pochta-rossii",
  "india-post",
  "dtdc",
  "blue-dart",
  "sf-express",
  "kerry-express",
  "j-and-t-express",
  "pos-laju",
  "pos-malaysia",
  // Asian verified
  "4px-express",
  "cainiao",
  "cne-express-china-navigation-express",
  "epacket-china-post-usps",
  "sagawa-express",
  "yamato-transport-kuroneko-yamato",
  "yanwen",
  "lbc-express",
  "singpost",
  // Regional verified
  "fan-courier",
  "gigl",
  "globalpost-by-auctane",
  "inpost",
  "meest",
  "mondial-relay",
  "pargo",
  "the-courier-guy",
]);

export function isCarrierVerified(carrierId: string): boolean {
  return VERIFIED_CARRIER_IDS.has(carrierId);
}
