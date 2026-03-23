import { countryShippingInfo, type CountryShippingInfo } from "@/data/country-info";

export interface CorridorGeneratedInfo {
  customs_section: string;
  trade_section: string;
  prohibited_section: string;
  docs_section: string;
  tips_section: string;
  faq: { q: string; a: string }[];
  trade_links: { name: string; url: string }[];
}

function getField(info: CountryShippingInfo, field: string, locale: string): string {
  const ruKey = `${field}_ru` as keyof CountryShippingInfo;
  const enKey = `${field}_en` as keyof CountryShippingInfo;
  if (locale === "ru" && typeof info[ruKey] === "string") {
    return info[ruKey] as string;
  }
  return (info[enKey] as string) ?? "";
}

function findSharedAgreements(fromInfo: CountryShippingInfo, toInfo: CountryShippingInfo): string[] {
  return fromInfo.trade_agreements.filter((a) => toInfo.trade_agreements.includes(a));
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

  // --- Customs section ---
  const destImports = toInfo ? getField(toInfo, "common_imports", locale) : "";
  const originExports = fromInfo ? getField(fromInfo, "common_exports", locale) : "";
  const destTips = toInfo ? getField(toInfo, "tips", locale) : "";

  let customs_section = "";
  if (isRu) {
    if (toInfo) {
      customs_section += `Основные импортные товары ${toCode}: ${destImports}.`;
    }
    if (fromInfo) {
      customs_section += ` Основные экспортные товары ${fromCode}: ${originExports}.`;
    }
    if (destTips) {
      customs_section += ` ${destTips}`;
    }
  } else {
    if (toInfo) {
      customs_section += `Key imports into ${toCode}: ${destImports}.`;
    }
    if (fromInfo) {
      customs_section += ` Key exports from ${fromCode}: ${originExports}.`;
    }
    if (destTips) {
      customs_section += ` ${destTips}`;
    }
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

  // --- Trade links ---
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
  };
}
