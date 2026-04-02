import { countryShippingInfo, type CountryShippingInfo } from "@/data/country-info";
import { deepCustomsData, type DeepCustomsData } from "@/data/customs-deep";

export interface CorridorGeneratedInfo {
  // Existing fields
  customs_section: string;
  trade_section: string;
  prohibited_section: string;
  docs_section: string;
  tips_section: string;
  faq: { q: string; a: string }[];
  trade_links: { name: string; url: string }[];
  // New fields
  duty_table: { category: string; rate: string; hs: string }[];
  clearance_info: string;
  clearance_time: string;
  de_minimis_info: string;
  documents_where: string;
  customs_reality: string;
  trade_volume: string;
  shipper_reviews: string;
  vat_info: string;
  useful_links: { name: string; url: string }[];
}

function getField(info: CountryShippingInfo, field: string, locale: string): string {
  const ruKey = `${field}_ru` as keyof CountryShippingInfo;
  const enKey = `${field}_en` as keyof CountryShippingInfo;
  if (locale === "ru" && typeof info[ruKey] === "string") {
    return info[ruKey] as string;
  }
  return (info[enKey] as string) ?? "";
}

function getDeepField(info: DeepCustomsData, field: string, locale: string): string {
  const ruKey = `${field}_ru` as keyof DeepCustomsData;
  const enKey = `${field}_en` as keyof DeepCustomsData;
  if (locale === "ru" && typeof info[ruKey] === "string") {
    return info[ruKey] as string;
  }
  return (typeof info[enKey] === "string" ? info[enKey] : "") as string;
}

function findSharedAgreements(fromInfo: CountryShippingInfo, toInfo: CountryShippingInfo): string[] {
  return fromInfo.trade_agreements.filter((a) => toInfo.trade_agreements.includes(a));
}

// --- Trade volume data for known pairs ---
const tradeVolumeData: Record<string, { en: string; ru: string }> = {
  "US-CN": {
    en: "$700B+ annual bilateral trade. Main goods: electronics, machinery, consumer products, agricultural goods. China is the largest US trading partner by total goods trade.",
    ru: "$700B+ ежегодного двустороннего товарооборота. Основные товары: электроника, машиностроение, потребительские товары, сельхозпродукция. Китай — крупнейший торговый партнёр США по общему объёму товарного оборота.",
  },
  "US-DE": {
    en: "$250B+ annual trade. Major goods: vehicles, machinery, pharmaceuticals, medical instruments. Germany is the US's largest European trading partner.",
    ru: "$250B+ ежегодного товарооборота. Основные товары: автомобили, машиностроение, фармацевтика, медицинские инструменты. Германия — крупнейший европейский торговый партнёр США.",
  },
  "US-JP": {
    en: "$220B+ annual trade. Key goods: vehicles, machinery, electronics, medical equipment. Japan is among the top 5 US trading partners.",
    ru: "$220B+ ежегодного товарооборота. Основные товары: автомобили, машиностроение, электроника, медицинское оборудование. Япония входит в топ-5 торговых партнёров США.",
  },
  "US-GB": {
    en: "$150B+ annual trade. Key goods: machinery, vehicles, pharmaceuticals, financial services equipment. The UK is one of the largest US trading partners.",
    ru: "$150B+ ежегодного товарооборота. Основные товары: машиностроение, автомобили, фармацевтика, оборудование для финансовых услуг. Великобритания — один из крупнейших торговых партнёров США.",
  },
  "US-KR": {
    en: "$170B+ annual trade. Key goods: semiconductors, vehicles, electronics, machinery. KORUS FTA eliminates tariffs on most goods.",
    ru: "$170B+ ежегодного товарооборота. Основные товары: полупроводники, автомобили, электроника, машиностроение. Соглашение KORUS FTA отменяет пошлины на большинство товаров.",
  },
  "US-CA": {
    en: "$750B+ annual trade — the largest bilateral trade relationship in the world. Key goods: vehicles, machinery, energy, agricultural products. USMCA provides duty-free trade for most goods.",
    ru: "$750B+ ежегодного товарооборота — крупнейшие двусторонние торговые отношения в мире. Основные товары: автомобили, машиностроение, энергоносители, сельхозпродукция. USMCA обеспечивает беспошлинную торговлю для большинства товаров.",
  },
  "CN-DE": {
    en: "$200B+ annual trade. Key goods: electronics, vehicles, machinery, chemicals. China is Germany's largest single-country trading partner.",
    ru: "$200B+ ежегодного товарооборота. Основные товары: электроника, автомобили, машиностроение, химикаты. Китай — крупнейший торговый партнёр Германии по объёму.",
  },
  "CN-JP": {
    en: "$350B+ annual trade. Key goods: electronics, machinery, chemicals, textiles. China is Japan's largest trading partner.",
    ru: "$350B+ ежегодного товарооборота. Основные товары: электроника, машиностроение, химикаты, текстиль. Китай — крупнейший торговый партнёр Японии.",
  },
  "DE-FR": {
    en: "$200B+ annual trade. Key goods: vehicles, machinery, pharmaceuticals, chemicals. Duty-free within EU single market.",
    ru: "$200B+ ежегодного товарооборота. Основные товары: автомобили, машиностроение, фармацевтика, химикаты. Беспошлинная торговля в рамках единого рынка ЕС.",
  },
  "GB-DE": {
    en: "$130B+ annual trade. Key goods: vehicles, machinery, chemicals, financial services equipment. Post-Brexit UK-EU TCA governs tariff rates.",
    ru: "$130B+ ежегодного товарооборота. Основные товары: автомобили, машиностроение, химикаты, оборудование для финансовых услуг. После Brexit торговля регулируется соглашением UK-EU TCA.",
  },
  "US-IN": {
    en: "$120B+ annual trade. Key goods: gems, pharmaceuticals, IT services, machinery, textiles. India is a major emerging trading partner for the US.",
    ru: "$120B+ ежегодного товарооборота. Основные товары: драгоценные камни, фармацевтика, ИТ-услуги, машиностроение, текстиль. Индия — крупный развивающийся торговый партнёр США.",
  },
  "CN-AU": {
    en: "$200B+ annual trade. Key goods: iron ore, coal, LNG, agricultural products, education services. China is Australia's largest trading partner.",
    ru: "$200B+ ежегодного товарооборота. Основные товары: железная руда, уголь, СПГ, сельхозпродукция, образовательные услуги. Китай — крупнейший торговый партнёр Австралии.",
  },
};

function getTradeVolume(fromCode: string, toCode: string, locale: string): string {
  const isRu = locale === "ru";
  const key1 = `${fromCode}-${toCode}`;
  const key2 = `${toCode}-${fromCode}`;
  const data = tradeVolumeData[key1] || tradeVolumeData[key2];
  if (data) {
    return isRu ? data.ru : data.en;
  }
  // Fallback for unknown pairs
  if (isRu) {
    return `Ограниченные данные о прямой торговле между ${fromCode} и ${toCode}. Большинство маршрутов проходит через крупные логистические хабы в Европе, ОАЭ или Сингапуре.`;
  }
  return `Limited direct trade data between ${fromCode} and ${toCode}. Most shipping routes go via major logistics hubs in Europe, UAE, or Singapore.`;
}

function getShipperReviews(fromCode: string, toCode: string, locale: string): string {
  const isRu = locale === "ru";

  // Express-heavy corridors
  const expressCorridors = ["US", "GB", "DE", "FR", "JP", "AU", "CA", "KR", "SG"];
  const bothExpress = expressCorridors.includes(fromCode) && expressCorridors.includes(toCode);

  if (bothExpress) {
    if (isRu) {
      return `По отзывам сообщества, DHL и FedEx доставляют из ${fromCode} в ${toCode} за 3-5 рабочих дней с надёжным таможенным оформлением. EMS занимает 7-14 дней. Пользователи рекомендуют указывать точную стоимость товаров для ускорения таможни. Курьерские службы автоматически проводят таможенное оформление.`;
    }
    return `Based on shipping community reports, DHL and FedEx deliver from ${fromCode} to ${toCode} in 3-5 business days with reliable customs clearance. EMS takes 7-14 days. Users recommend declaring accurate values to avoid delays. Express couriers handle customs brokerage automatically.`;
  }

  // Emerging market corridors
  const emergingMarkets = ["IN", "BR", "RU", "TR", "TH", "MY", "AE"];
  const hasEmerging = emergingMarkets.includes(fromCode) || emergingMarkets.includes(toCode);

  if (hasEmerging) {
    if (isRu) {
      return `По отзывам, доставка из ${fromCode} в ${toCode} может занять 10-21 день обычной почтой. Экспресс-службы (DHL, FedEx) — 5-8 дней. Таможенное оформление может добавить 2-5 дней. Рекомендуется использовать экспресс для ценных посылок и подготовить все документы заранее.`;
    }
    return `Based on user reports, shipping from ${fromCode} to ${toCode} typically takes 10-21 days via postal services. Express carriers (DHL, FedEx) deliver in 5-8 days. Customs clearance may add 2-5 days. Recommend using express for valuable shipments and preparing all documents in advance.`;
  }

  // Default
  if (isRu) {
    return `По отзывам отправителей, доставка из ${fromCode} в ${toCode} занимает 7-21 день в зависимости от службы. Экспресс-курьеры (DHL, FedEx, UPS) обеспечивают более быструю доставку за 3-7 дней. Рекомендуется правильно заполнять таможенные декларации для ускорения процесса.`;
  }
  return `Based on shipper reports, delivery from ${fromCode} to ${toCode} takes 7-21 days depending on the service. Express couriers (DHL, FedEx, UPS) offer faster delivery in 3-7 days. Accurate customs declarations are recommended to speed up the process.`;
}

export function generateCorridorInfo(
  fromCode: string,
  toCode: string,
  locale: string
): CorridorGeneratedInfo | null {
  const fromInfo = countryShippingInfo[fromCode];
  const toInfo = countryShippingInfo[toCode];

  if (!fromInfo && !toInfo) return null;

  const isRu = locale === "ru";
  const toDeep = deepCustomsData[toCode];
  const fromDeep = deepCustomsData[fromCode];

  // --- Customs section ---
  const destImports = toInfo ? getField(toInfo, "common_imports", locale) : "";
  const originExports = fromInfo ? getField(fromInfo, "common_exports", locale) : "";
  const destTips = toInfo ? getField(toInfo, "tips", locale) : "";

  let customs_section = "";
  if (isRu) {
    if (toInfo) customs_section += `Основные импортные товары ${toCode}: ${destImports}.`;
    if (fromInfo) customs_section += ` Основные экспортные товары ${fromCode}: ${originExports}.`;
    if (destTips) customs_section += ` ${destTips}`;
  } else {
    if (toInfo) customs_section += `Key imports into ${toCode}: ${destImports}.`;
    if (fromInfo) customs_section += ` Key exports from ${fromCode}: ${originExports}.`;
    if (destTips) customs_section += ` ${destTips}`;
  }

  // --- Trade section ---
  const shared = fromInfo && toInfo ? findSharedAgreements(fromInfo, toInfo) : [];
  let trade_section = "";
  if (shared.length > 0) {
    if (isRu) {
      trade_section = `${fromCode} и ${toCode} являются участниками следующих торговых соглашений: ${shared.join(", ")}. Эти соглашения могут обеспечивать сниженные или нулевые таможенные пошлины на квалифицированные товары. Обязательно получите сертификат происхождения для использования преференциальных тарифов.`;
    } else {
      trade_section = `${fromCode} and ${toCode} are both members of the following trade agreements: ${shared.join(", ")}. These agreements may provide reduced or zero customs duties on qualifying goods. Be sure to obtain a certificate of origin to take advantage of preferential tariff rates.`;
    }
  } else {
    if (isRu) {
      trade_section = `Между ${fromCode} и ${toCode} нет общих преференциальных торговых соглашений. Применяются стандартные тарифы режима наибольшего благоприятствования (РНБ) ВТО.`;
    } else {
      trade_section = `There are no shared preferential trade agreements between ${fromCode} and ${toCode}. Standard WTO Most Favored Nation (MFN) tariff rates apply.`;
    }
  }

  // --- Prohibited items ---
  const fromProhibited = fromInfo ? getField(fromInfo, "prohibited_items", locale) : "";
  const toProhibited = toInfo ? getField(toInfo, "prohibited_items", locale) : "";
  let prohibited_section = "";
  if (isRu) {
    if (fromProhibited) prohibited_section += `Запрещены к вывозу из ${fromCode}: ${fromProhibited}.`;
    if (toProhibited) prohibited_section += ` Запрещены к ввозу в ${toCode}: ${toProhibited}.`;
  } else {
    if (fromProhibited) prohibited_section += `Prohibited for export from ${fromCode}: ${fromProhibited}.`;
    if (toProhibited) prohibited_section += ` Prohibited for import into ${toCode}: ${toProhibited}.`;
  }

  // --- Docs section ---
  const fromDocs = fromInfo ? getField(fromInfo, "docs_required", locale) : "";
  const toDocs = toInfo ? getField(toInfo, "docs_required", locale) : "";
  let docs_section = "";
  if (isRu) {
    if (fromDocs) docs_section += `Для экспорта из ${fromCode}: ${fromDocs}.`;
    if (toDocs) docs_section += ` Для импорта в ${toCode}: ${toDocs}.`;
  } else {
    if (fromDocs) docs_section += `For export from ${fromCode}: ${fromDocs}.`;
    if (toDocs) docs_section += ` For import into ${toCode}: ${toDocs}.`;
  }

  // --- Tips section ---
  const fromTips = fromInfo ? getField(fromInfo, "tips", locale) : "";
  const toTips = toInfo ? getField(toInfo, "tips", locale) : "";
  let tips_section = "";
  if (isRu) {
    if (fromTips) tips_section += `${fromCode}: ${fromTips}`;
    if (toTips) tips_section += ` ${toCode}: ${toTips}`;
  } else {
    if (fromTips) tips_section += `${fromCode}: ${fromTips}`;
    if (toTips) tips_section += ` ${toCode}: ${toTips}`;
  }

  // --- NEW: Duty table from deep customs data ---
  const duty_table: { category: string; rate: string; hs: string }[] = [];
  if (toDeep) {
    for (const dr of toDeep.duty_rates) {
      duty_table.push({
        category: isRu ? dr.category_ru : dr.category_en,
        rate: dr.rate,
        hs: dr.hs_chapter,
      });
    }
  }

  // --- NEW: Clearance info ---
  let clearance_info = "";
  if (toDeep) {
    clearance_info = getDeepField(toDeep, "clearance_process", locale);
  }

  // --- NEW: Clearance time ---
  const clearance_time = toDeep?.clearance_time_days ?? "";

  // --- NEW: De minimis info ---
  let de_minimis_info = "";
  if (toDeep) {
    if (isRu) {
      de_minimis_info = `Порог беспошлинного ввоза (de minimis) в ${toCode}: $${toDeep.de_minimis_usd}. Посылки стоимостью ниже этого порога не облагаются импортными пошлинами.`;
    } else {
      de_minimis_info = `De minimis threshold for ${toCode}: $${toDeep.de_minimis_usd}. Shipments valued below this amount are exempt from import duties.`;
    }
  }

  // --- NEW: Documents where to get ---
  let documents_where = "";
  if (toDeep) {
    const certOrigin = getDeepField(toDeep, "certificate_of_origin", locale);
    const importLicense = getDeepField(toDeep, "import_license_info", locale);
    if (isRu) {
      documents_where = `Сертификат происхождения: ${certOrigin} Импортные лицензии: ${importLicense}`;
    } else {
      documents_where = `Certificate of origin: ${certOrigin} Import licenses: ${importLicense}`;
    }
  }

  // --- NEW: Customs reality ---
  let customs_reality = "";
  if (toDeep) {
    customs_reality = getDeepField(toDeep, "customs_reality", locale);
  }

  // --- NEW: Trade volume ---
  const trade_volume = getTradeVolume(fromCode, toCode, locale);

  // --- NEW: Shipper reviews ---
  const shipper_reviews = getShipperReviews(fromCode, toCode, locale);

  // --- NEW: VAT info ---
  let vat_info = "";
  if (toDeep) {
    if (isRu) {
      vat_info = `Ставка НДС/GST: ${toDeep.vat_rate}. Применяется к: ${toDeep.vat_applies_to}`;
    } else {
      vat_info = `VAT/GST rate: ${toDeep.vat_rate}. Applies to: ${toDeep.vat_applies_to}`;
    }
  }

  // --- NEW: Useful links (expanded) ---
  const useful_links: { name: string; url: string }[] = [];
  if (fromInfo) {
    useful_links.push(fromInfo.trade_chamber);
    useful_links.push(fromInfo.customs_authority);
  }
  if (toInfo) {
    useful_links.push(toInfo.trade_chamber);
    useful_links.push(toInfo.customs_authority);
  }
  if (toDeep) {
    if (toDeep.customs_tariff_url) {
      useful_links.push({
        name: isRu ? `Таможенный тариф ${toCode}` : `${toCode} Customs Tariff Lookup`,
        url: toDeep.customs_tariff_url,
      });
    }
    if (toDeep.trade_statistics_url) {
      useful_links.push({
        name: isRu ? `Статистика торговли ${toCode}` : `${toCode} Trade Statistics`,
        url: toDeep.trade_statistics_url,
      });
    }
    if (toDeep.import_regulations_url) {
      useful_links.push({
        name: isRu ? `Правила импорта ${toCode}` : `${toCode} Import Regulations`,
        url: toDeep.import_regulations_url,
      });
    }
  }
  if (fromDeep) {
    if (fromDeep.customs_tariff_url) {
      useful_links.push({
        name: isRu ? `Таможенный тариф ${fromCode}` : `${fromCode} Customs Tariff Lookup`,
        url: fromDeep.customs_tariff_url,
      });
    }
  }

  // --- FAQ ---
  const faq: { q: string; a: string }[] = [];

  if (toInfo) {
    if (isRu) {
      faq.push({
        q: `Какие товары запрещены к ввозу в ${toCode}?`,
        a: `В ${toCode} запрещены к ввозу: ${getField(toInfo, "prohibited_items", locale)}. Всегда проверяйте актуальный список перед отправкой.`,
      });
      faq.push({
        q: `Какие документы нужны для отправки из ${fromCode} в ${toCode}?`,
        a: `Для отправки из ${fromCode} в ${toCode} вам потребуются: ${toDocs || fromDocs}. Конкретные требования зависят от типа товара и стоимости отправления.`,
      });
    } else {
      faq.push({
        q: `What items are prohibited when shipping to ${toCode}?`,
        a: `Items prohibited for import into ${toCode} include: ${getField(toInfo, "prohibited_items", locale)}. Always check the latest regulations before shipping.`,
      });
      faq.push({
        q: `What documents are needed to ship from ${fromCode} to ${toCode}?`,
        a: `To ship from ${fromCode} to ${toCode} you will typically need: ${toDocs || fromDocs}. Specific requirements depend on the type of goods and shipment value.`,
      });
    }
  }

  if (shared.length > 0) {
    if (isRu) {
      faq.push({
        q: `Есть ли торговые соглашения между ${fromCode} и ${toCode}?`,
        a: `Да, ${fromCode} и ${toCode} являются участниками: ${shared.join(", ")}. Эти соглашения могут снизить или отменить таможенные пошлины на квалифицированные товары при наличии правильного сертификата происхождения.`,
      });
    } else {
      faq.push({
        q: `Are there trade agreements between ${fromCode} and ${toCode}?`,
        a: `Yes, ${fromCode} and ${toCode} share the following trade agreements: ${shared.join(", ")}. These can reduce or eliminate customs duties on qualifying goods when a proper certificate of origin is provided.`,
      });
    }
  } else {
    if (isRu) {
      faq.push({
        q: `Есть ли торговые соглашения между ${fromCode} и ${toCode}?`,
        a: `В настоящее время между ${fromCode} и ${toCode} нет преференциальных торговых соглашений. Применяются стандартные тарифы ВТО (РНБ). Проверяйте актуальные ставки пошлин для вашего товара.`,
      });
    } else {
      faq.push({
        q: `Are there trade agreements between ${fromCode} and ${toCode}?`,
        a: `Currently there are no preferential trade agreements between ${fromCode} and ${toCode}. Standard WTO MFN tariff rates apply. Check current duty rates for your specific product.`,
      });
    }
  }

  if (toInfo) {
    if (isRu) {
      faq.push({
        q: `Как пройти таможенное оформление при доставке в ${toCode}?`,
        a: `${getField(toInfo, "tips", locale)} Таможенное оформление обычно проходит быстрее при полном и точном заполнении документов. Используйте курьерские службы для ускоренного оформления.`,
      });
    } else {
      faq.push({
        q: `How does customs clearance work when shipping to ${toCode}?`,
        a: `${getField(toInfo, "tips", locale)} Customs clearance is typically faster when documentation is complete and accurate. Use courier services for expedited clearance.`,
      });
    }
  }

  // NEW FAQ items from deep data
  if (toDeep) {
    if (isRu) {
      faq.push({
        q: `Какой порог беспошлинного ввоза (de minimis) в ${toCode}?`,
        a: `Порог de minimis в ${toCode} составляет $${toDeep.de_minimis_usd}. Посылки стоимостью ниже этого порога не облагаются импортными пошлинами, но НДС/GST всё равно может применяться.`,
      });
      faq.push({
        q: `Какой НДС при импорте в ${toCode}?`,
        a: `Ставка НДС/GST: ${toDeep.vat_rate}. ${toDeep.vat_applies_to}`,
      });
    } else {
      faq.push({
        q: `What is the de minimis threshold for ${toCode}?`,
        a: `The de minimis threshold for ${toCode} is $${toDeep.de_minimis_usd}. Shipments valued below this amount are exempt from import duties, though VAT/GST may still apply.`,
      });
      faq.push({
        q: `What is the VAT/GST rate for imports into ${toCode}?`,
        a: `VAT/GST rate: ${toDeep.vat_rate}. ${toDeep.vat_applies_to}`,
      });
    }
  }

  // --- Trade links (legacy, kept for backward compat) ---
  const trade_links: { name: string; url: string }[] = [];
  if (fromInfo) {
    trade_links.push(fromInfo.trade_chamber);
    trade_links.push(fromInfo.customs_authority);
  }
  if (toInfo) {
    trade_links.push(toInfo.trade_chamber);
    trade_links.push(toInfo.customs_authority);
  }

  return {
    customs_section: customs_section.trim(),
    trade_section: trade_section.trim(),
    prohibited_section: prohibited_section.trim(),
    docs_section: docs_section.trim(),
    tips_section: tips_section.trim(),
    faq,
    trade_links,
    duty_table,
    clearance_info,
    clearance_time,
    de_minimis_info,
    documents_where,
    customs_reality,
    trade_volume,
    shipper_reviews,
    vat_info,
    useful_links,
  };
}
