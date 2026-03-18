/**
 * Route-specific carrier scoring system.
 *
 * Generates a 1-5 reliability score for each carrier on a given corridor
 * based on: carrier home-country advantage, destination infrastructure,
 * customs complexity, and known route-level performance data.
 */

// Carrier home countries / strong-presence countries
const carrierPresence: Record<string, string[]> = {
  "dhl-express": ["DE", "US", "GB", "NL", "SG", "HK", "AE", "AU", "JP", "CN", "KR", "IN", "BR", "MX", "ZA"],
  "fedex": ["US", "CA", "MX", "GB", "FR", "DE", "CN", "JP", "IN", "BR", "AU"],
  "ups": ["US", "CA", "MX", "GB", "DE", "FR", "CN", "JP", "HK", "AU"],
  "ems": ["CN", "JP", "KR", "RU", "DE", "FR", "GB", "US", "AU", "IN", "BR"],
  "usps": ["US"],
  "royal-mail": ["GB"],
  "japan-post": ["JP"],
  "dpd": ["DE", "GB", "FR", "NL", "BE", "PL", "AT", "CH", "CZ", "HU", "RO", "IE"],
  "aramex": ["AE", "SA", "EG", "JO", "KW", "BH", "QA", "OM", "IN", "ZA", "NG", "KE", "AU"],
  "sf-express": ["CN", "HK", "TW", "SG", "MY", "TH", "VN", "JP", "KR", "US", "AU"],
  "tnt": ["NL", "DE", "FR", "GB", "IT", "ES", "AU", "BR"],
  "postnl": ["NL", "BE", "DE"],
  "gls": ["DE", "FR", "IT", "ES", "BE", "NL", "PL", "HU", "CZ", "SK", "RO", "HR", "SI"],
  "deutsche-post": ["DE", "AT", "CH"],
  "china-post": ["CN"],
  "canada-post": ["CA"],
  "australia-post": ["AU", "NZ"],
  "la-poste": ["FR", "BE"],
  "correos": ["ES", "PT"],
  "india-post": ["IN"],
  "korea-post": ["KR"],
  "singapore-post": ["SG"],
  "swiss-post": ["CH"],
  "russian-post": ["RU", "KZ", "BY"],
  "cainiao": ["CN", "HK", "SG", "MY", "TH", "BR", "ES"],
  "yanwen": ["CN"],
  "cdek": ["RU", "KZ", "BY", "AM", "KG"],
  "cdek-regional": ["RU", "KZ", "BY", "AM", "KG"],
  "nova-poshta": ["UA", "PL", "DE", "CZ"],
  "boxberry": ["RU", "KZ", "BY", "AM"],
  "j-and-t-express": ["ID", "MY", "TH", "VN", "PH", "SG"],
  "ninja-van": ["SG", "MY", "ID", "TH", "VN", "PH"],
  "kerry-express": ["TH", "HK", "VN", "MY", "ID"],
  "servientrega": ["CO", "EC", "PE"],
  "estafeta": ["MX", "US"],
  "andreani": ["AR"],
  "smsa-express": ["SA", "AE", "KW", "BH", "QA", "OM"],
  "imile": ["AE", "SA", "KW", "BH", "QA", "OM", "EG"],
  "dtdc": ["IN", "SG", "HK", "US", "GB", "AE", "AU", "CA"],
  "delhivery": ["IN", "AE", "US", "GB", "SG"],
  "the-courier-guy": ["ZA", "NA", "BW", "MZ", "ZW", "LS", "SZ"],
  "sendle": ["AU", "US", "CA"],
  "blue-dart": ["IN"],
  "ptt-post": ["TR"],
  "hermes": ["GB", "DE", "FR", "IT", "NL"],
};

// Infrastructure quality score by country (1-5)
const infraScore: Record<string, number> = {
  US: 5, CA: 5, GB: 5, DE: 5, FR: 5, NL: 5, CH: 5, AT: 5, BE: 5, LU: 5,
  JP: 5, KR: 5, SG: 5, AU: 5, NZ: 5, SE: 5, NO: 5, DK: 5, FI: 5,
  HK: 5, TW: 4.5, AE: 4.5, IL: 4.5, IE: 4.5,
  IT: 4, ES: 4, PT: 4, CZ: 4, PL: 4, MY: 4, TH: 4, CN: 4, SA: 4,
  HR: 3.5, HU: 3.5, RO: 3.5, BG: 3.5, GR: 3.5, SK: 3.5, CL: 3.5,
  BR: 3.5, MX: 3.5, AR: 3, TR: 3.5, RU: 3.5, UA: 3,
  IN: 3, ID: 3, VN: 3, PH: 3, CO: 3, PE: 3,
  ZA: 3, EG: 3, KE: 2.5, NG: 2.5, GH: 2.5,
  KZ: 3, BY: 3, PK: 2.5, BD: 2.5, LK: 2.5,
};

// Customs difficulty (1 = easy, 5 = very hard)
const customsDifficulty: Record<string, number> = {
  HK: 1, SG: 1, AE: 1.5, BN: 1,
  US: 2, CA: 2, AU: 2, NZ: 2, GB: 2, CH: 2, JP: 2, KR: 2,
  DE: 2, FR: 2, NL: 2, IT: 2.5, ES: 2.5, SE: 2, NO: 2, DK: 2, FI: 2,
  PL: 2.5, CZ: 2.5, HU: 2.5, RO: 2.5, IE: 2,
  CN: 4, IN: 4, BR: 5, AR: 5, RU: 3.5, TR: 3.5,
  MX: 3, CO: 3, CL: 2.5, PE: 3, EG: 4, NG: 4,
  ID: 3.5, TH: 3, MY: 2.5, VN: 3.5, PH: 3,
  SA: 2.5, KW: 2, QA: 2, BH: 2, IL: 3,
  ZA: 3, KE: 3.5, GH: 3.5, UA: 3.5, KZ: 3, PK: 4, BD: 4,
  DZ: 5, CU: 5,
};

// Known problematic or excellent routes (carrier → "FROM-TO" → modifier)
const routeModifiers: Record<string, Record<string, number>> = {
  "dhl-express": {
    "DE-*": 0.5, "*-DE": 0.5,  // Home country advantage
    "US-CN": -0.3, "CN-US": -0.3,  // Tariff issues slow things down
    "AE-*": 0.3, "*-AE": 0.3,  // Strong Middle East hub
    "SG-*": 0.3, "*-SG": 0.3,
  },
  "fedex": {
    "US-*": 0.5, "*-US": 0.5,  // Home country
    "US-CA": 0.5, "CA-US": 0.5,
    "US-MX": 0.3, "MX-US": 0.3,
    "*-BR": -0.5,  // Brazil customs issues
    "*-AR": -0.5,
  },
  "ups": {
    "US-*": 0.5, "*-US": 0.5,
    "US-DE": 0.4, "DE-US": 0.4,
    "*-BR": -0.5,
    "*-IN": -0.3,
  },
  "ems": {
    "JP-*": 0.5, "*-JP": 0.5,
    "CN-*": 0.3, "*-CN": 0.3,
    "KR-*": 0.3,
    "*-BR": -0.5,
    "*-NG": -0.5,
  },
  "sf-express": {
    "CN-*": 0.5, "*-CN": 0.5,
    "CN-US": 0.3, "CN-JP": 0.4, "CN-KR": 0.4,
    "CN-SG": 0.4, "CN-MY": 0.3, "CN-TH": 0.3,
  },
  "aramex": {
    "AE-*": 0.5, "*-AE": 0.5,
    "SA-*": 0.4, "*-SA": 0.4,
    "*-IN": 0.3, "IN-*": 0.2,
    "*-AU": 0.2,
  },
  "russian-post": {
    "RU-*": 0.3, "*-RU": 0.3,
    "RU-CN": -0.3,  // Slow
    "RU-US": -0.5,  // Sanctions issues
    "US-RU": -0.5,
  },
  "cdek-regional": {
    "RU-KZ": 0.5, "KZ-RU": 0.5,
    "RU-BY": 0.5, "BY-RU": 0.5,
    "RU-AM": 0.3,
  },
  "nova-poshta": {
    "UA-*": 0.5, "*-UA": 0.5,
    "UA-PL": 0.5, "UA-DE": 0.3,
  },
  "j-and-t-express": {
    "ID-*": 0.5, "*-ID": 0.5,
    "ID-MY": 0.5, "MY-ID": 0.5,
    "ID-SG": 0.4, "TH-VN": 0.3,
  },
  "cainiao": {
    "CN-*": 0.4,
    "CN-BR": 0.2,  // Established route
    "CN-ES": 0.3,
    "CN-RU": 0.3,
    "*-CN": -0.3,  // One-way mostly
  },
};

/**
 * Calculate a route-specific reliability score (1.0 - 5.0) for a carrier
 * on a given origin→destination corridor.
 */
export function getRouteScore(
  carrierId: string,
  originCode: string,
  destCode: string
): number {
  let score = 3.0; // Base score

  // 1. Carrier presence bonus (up to +1.0)
  const presence = carrierPresence[carrierId] || [];
  const hasOrigin = presence.includes(originCode);
  const hasDest = presence.includes(destCode);
  if (hasOrigin && hasDest) score += 1.0;
  else if (hasOrigin || hasDest) score += 0.5;

  // 2. Infrastructure factor (affects by up to ±0.5)
  const originInfra = infraScore[originCode] ?? 3;
  const destInfra = infraScore[destCode] ?? 3;
  const avgInfra = (originInfra + destInfra) / 2;
  score += (avgInfra - 3) * 0.25; // ±0.5

  // 3. Customs difficulty penalty (up to -0.5)
  const customs = customsDifficulty[destCode] ?? 3;
  score -= (customs - 2) * 0.15; // Easy customs = bonus, hard = penalty

  // 4. Route-specific modifiers
  const mods = routeModifiers[carrierId];
  if (mods) {
    const exactRoute = `${originCode}-${destCode}`;
    const fromWild = `${originCode}-*`;
    const toWild = `*-${destCode}`;

    if (mods[exactRoute] !== undefined) score += mods[exactRoute];
    else {
      if (mods[fromWild] !== undefined) score += mods[fromWild];
      if (mods[toWild] !== undefined) score += mods[toWild];
    }
  }

  // Clamp to 1.0 - 5.0
  return Math.round(Math.max(1.0, Math.min(5.0, score)) * 10) / 10;
}

/**
 * Get a text label for a route score.
 */
export function getScoreLabel(score: number, locale: string): string {
  const labels: Record<string, [string, string, string, string, string]> = {
    en: ["Poor", "Below Average", "Average", "Good", "Excellent"],
    ru: ["Плохо", "Ниже среднего", "Средне", "Хорошо", "Отлично"],
    es: ["Malo", "Bajo promedio", "Promedio", "Bueno", "Excelente"],
    de: ["Schlecht", "Unterdurchschnittlich", "Durchschnittlich", "Gut", "Ausgezeichnet"],
    fr: ["Mauvais", "Sous la moyenne", "Moyen", "Bon", "Excellent"],
    pt: ["Ruim", "Abaixo da média", "Médio", "Bom", "Excelente"],
    zh: ["差", "低于平均", "一般", "好", "优秀"],
    ja: ["悪い", "平均以下", "普通", "良い", "優秀"],
    ko: ["나쁨", "평균 이하", "보통", "좋음", "우수"],
    ar: ["سيء", "أقل من المتوسط", "متوسط", "جيد", "ممتاز"],
    tr: ["Kötü", "Ortalamanın altında", "Ortalama", "İyi", "Mükemmel"],
    it: ["Scarso", "Sotto la media", "Medio", "Buono", "Eccellente"],
  };
  const l = labels[locale] || labels.en;
  if (score >= 4.5) return l[4];
  if (score >= 3.5) return l[3];
  if (score >= 2.5) return l[2];
  if (score >= 1.5) return l[1];
  return l[0];
}

export function getScoreColor(score: number): string {
  if (score >= 4.0) return "text-green-400";
  if (score >= 3.0) return "text-yellow-400";
  if (score >= 2.0) return "text-orange-400";
  return "text-red-400";
}
