import { Metadata } from "next";
import {
  countries,
  getCountryBySlug,
  getCountryName,
  getPopularCountries,
  makeCorridorSlug,
} from "@/lib/data";
import { getCustomsInfo, getCustomsNotes, hasCustomsData } from "@/lib/customs";
import { deepCustomsData, type DeepCustomsData } from "@/data/customs-deep";
import { t, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { countryFlag } from "@/lib/flags";
import { getCorridorLocales } from "@/lib/country-locale";
import DutyCalculator from "@/components/DutyCalculator";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";

const BASE_URL = "https://rateships.com";

// Top 40 hand-crafted countries in deepCustomsData
const TOP_40_CODES = [
  "US","GB","DE","FR","CN","JP","KR","AU","CA","RU",
  "IN","AE","SG","TH","MY","BR","IT","ES","NL","TR",
  "MX","PL","SE","CH","SA","EG","IL","ZA","NG","KE",
  "UA","KZ","VN","ID","PH","AR","CL","CO","NZ","UG",
];

export const dynamicParams = true;

export function generateStaticParams() {
  const params: { locale: string; country: string }[] = [];
  for (const code of TOP_40_CODES) {
    const c = countries.find((x) => x.code === code);
    if (!c) continue;
    // Only en for static generation
    params.push({ locale: "en", country: c.slug_en });
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; country: string }>;
}): Promise<Metadata> {
  const { locale, country: slug } = await params;
  const loc = locale as Locale;
  const country = getCountryBySlug(slug, "en");
  if (!country) return { title: "Not Found" };

  const name = getCountryName(country, loc);
  const customs = getCustomsInfo(country.code);
  const deep = deepCustomsData[country.code];

  const deMinimisText = customs.de_minimis_usd > 0
    ? `$${customs.de_minimis_usd} de minimis`
    : "no de minimis exemption";

  const countryEn = getCountryName(country, "en");
  const titleLocalized = loc === "ru"
    ? `Пошлины и таможня ${name} [2026] — НДС ${customs.vat_rate}%, de minimis $${customs.de_minimis_usd}`
    : loc === "de"
    ? `Zoll & Einfuhrregeln ${countryEn} [2026] — ${customs.vat_rate}% MwSt, de minimis $${customs.de_minimis_usd}`
    : `${countryEn} Import Duties & Customs [2026] — ${customs.vat_rate}% VAT, $${customs.de_minimis_usd} Threshold`;

  return {
    title: titleLocalized,
    description: `Complete guide to importing goods into ${countryEn}: ${deMinimisText}, ${customs.vat_rate}% VAT, duty rates by category, required documents, clearance process, and prohibited items.`,
    alternates: {
      canonical: `/${locale}/customs/${slug}`,
      languages: {
        ...Object.fromEntries(
          getCorridorLocales(country.code, country.code).map((l) => [l, `/${l}/customs/${slug}`])
        ),
        "x-default": `/en/customs/${slug}`,
      },
    },
    openGraph: {
      title: `Import Duties & Customs Rules for ${getCountryName(country, "en")} [2026]`,
      description: `${getCountryName(country, "en")} customs: ${deMinimisText}, ${customs.vat_rate}% VAT, avg duty ${customs.avg_duty_rate}%.`,
      type: "article",
    },
  };
}

function getLocalizedField(deep: DeepCustomsData, field: string, locale: string): string {
  const ruKey = `${field}_ru` as keyof DeepCustomsData;
  const enKey = `${field}_en` as keyof DeepCustomsData;
  if (locale === "ru" && deep[ruKey]) return deep[ruKey] as string;
  return (deep[enKey] as string) || "";
}

export default async function CustomsCountryPage({
  params,
}: {
  params: Promise<{ locale: string; country: string }>;
}) {
  const { locale, country: slug } = await params;
  const loc = locale as Locale;
  const country = getCountryBySlug(slug, "en");

  if (!country) {
    notFound();
  }

  // Smart locale: redirect if locale is not relevant for this country
  const validLocales = getCorridorLocales(country.code, country.code);
  if (!validLocales.includes(loc)) {
    redirect(`/en/customs/${slug}`);
  }

  const name = getCountryName(country, loc);
  const customs = getCustomsInfo(country.code);
  const deep = deepCustomsData[country.code];
  const isRu = loc === "ru";

  // Popular countries for related links
  const popular = getPopularCountries().filter((c) => c.code !== country.code);

  // FAQ data
  const faqs = [
    {
      q: isRu
        ? `Какой беспошлинный порог в ${name}?`
        : `What is the duty-free threshold for ${name}?`,
      a: customs.de_minimis_usd > 0
        ? (isRu
          ? `Беспошлинный порог для импорта в ${name} составляет $${customs.de_minimis_usd}. Товары стоимостью ниже этого порога не облагаются пошлиной.`
          : `The duty-free (de minimis) threshold for imports into ${name} is $${customs.de_minimis_usd}. Goods valued below this amount are exempt from customs duties.`)
        : (isRu
          ? `В ${name} нет беспошлинного порога. Все импортные товары облагаются пошлиной независимо от стоимости.`
          : `${name} has no duty-free threshold. All imported goods are subject to duties regardless of their value.`),
    },
    {
      q: isRu
        ? `Какая ставка НДС при импорте в ${name}?`
        : `What is the VAT rate on imports to ${name}?`,
      a: isRu
        ? `Ставка НДС на импорт в ${name} составляет ${customs.vat_rate}%. ${deep ? `НДС применяется к: ${deep.vat_applies_to}` : ""}`
        : `The VAT/tax rate on imports to ${name} is ${customs.vat_rate}%. ${deep ? `VAT applies to: ${deep.vat_applies_to}` : ""}`,
    },
    {
      q: isRu
        ? `Сколько занимает таможенное оформление в ${name}?`
        : `How long does customs clearance take in ${name}?`,
      a: deep
        ? (isRu
          ? `Обычное время таможенного оформления в ${name} составляет ${deep.clearance_time_days} дней. Экспресс-отправления обычно оформляются быстрее.`
          : `Typical customs clearance in ${name} takes ${deep.clearance_time_days} days. Express shipments usually clear faster.`)
        : (isRu
          ? `Время таможенного оформления зависит от перевозчика и типа товара.`
          : `Clearance time depends on the carrier and type of goods.`),
    },
    {
      q: isRu
        ? `Какие документы нужны для импорта в ${name}?`
        : `What documents are needed to import into ${name}?`,
      a: isRu
        ? `Для импорта в ${name} обычно требуются: коммерческий инвойс, упаковочный лист, транспортная накладная и таможенная декларация. Для некоторых товаров может потребоваться сертификат происхождения или импортная лицензия.`
        : `To import into ${name}, you typically need: commercial invoice, packing list, bill of lading/airway bill, and customs declaration. Some goods may require a certificate of origin or import license.`,
    },
    {
      q: isRu
        ? `Какие товары запрещено ввозить в ${name}?`
        : `What items are prohibited from import into ${name}?`,
      a: isRu
        ? `В ${name} запрещён ввоз наркотиков, оружия, поддельных товаров, некоторых продуктов животного происхождения и опасных материалов. Ограничения также могут касаться алкоголя, табака, фармацевтики и электроники.`
        : `${name} prohibits the import of narcotics, weapons, counterfeit goods, certain animal products, and hazardous materials. Restrictions may also apply to alcohol, tobacco, pharmaceuticals, and certain electronics.`,
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line" style={{
        backgroundImage: `
          radial-gradient(900px 400px at 70% -10%, rgba(26,115,232,.08), transparent 60%),
          radial-gradient(600px 300px at -5% 50%, rgba(232,92,58,.05), transparent 60%),
          linear-gradient(var(--line-2) 1px, transparent 1px),
          linear-gradient(90deg, var(--line-2) 1px, transparent 1px)`,
        backgroundSize: 'auto, auto, 48px 48px, 48px 48px',
        maskImage: 'linear-gradient(180deg, #000 60%, transparent 100%)'
      }}>
        <div aria-hidden className="hero-shape-a absolute hidden md:block" style={{top:'20%', right:'8%', width:60, height:60, borderRadius:14, background:'linear-gradient(135deg, var(--warm) 0%, #E8B43D 100%)', transform:'rotate(-8deg)', boxShadow:'0 14px 30px -8px rgba(242,201,76,.4)', opacity:0.7}} />
        <div aria-hidden className="hero-shape-b absolute hidden md:block" style={{bottom:'25%', right:'18%', width:40, height:40, borderRadius:10, background:'var(--accent)', transform:'rotate(12deg)', opacity:0.6, boxShadow:'0 10px 20px -6px rgba(232,92,58,.4)'}} />

        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <nav className="text-sm text-body mb-6">
            <Link href={`/${locale}`} className="hover:text-accent-light">
              {t(loc, "home")}
            </Link>
            <span className="mx-2">/</span>
            <Link href={`/${locale}/guide`} className="hover:text-accent-light">
              {t(loc, "guides")}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink">{t(loc, "customs_breadcrumb", { country: name })}</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-6">
            {countryFlag(country.code)}{" "}
            {t(loc, "customs_h1", { country: name })}
          </h1>

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/${locale}/guide/${country.slug_en}`}
              className="px-4 py-2 bg-surface border border-line rounded-lg text-sm hover:border-accent/50"
            >
              {t(loc, "customs_shipping_guide", { country: name })}
            </Link>
            <Link
              href={`/${locale}/shipping/to/${country.slug_en}`}
              className="px-4 py-2 bg-[#1A73E8] text-white rounded-lg text-sm hover:brightness-110"
            >
              {t(loc, "ship_to", { country: name })}
            </Link>
          </div>
        </div>
      </section>

    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Table of Contents */}
      <nav className="mb-8 py-4 border-y border-line">
        <p className="text-xs text-muted uppercase tracking-wider mb-3">
          {t(loc, "customs_on_this_page")}
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <a href="#quick-facts" className="text-body hover:text-ink">{t(loc, "customs_quick_facts")}</a>
          {deep && <a href="#duty-rates" className="text-body hover:text-ink">{t(loc, "customs_duty_rates_link")}</a>}
          <a href="#calculator" className="text-body hover:text-ink">{t(loc, "customs_calculator_link")}</a>
          {deep && <a href="#clearance" className="text-body hover:text-ink">{t(loc, "customs_clearance_link")}</a>}
          {deep && <a href="#reality" className="text-body hover:text-ink">{t(loc, "customs_reality_link")}</a>}
          <a href="#documents" className="text-body hover:text-ink">{t(loc, "customs_documents_link")}</a>
          {deep && <a href="#license" className="text-body hover:text-ink">{t(loc, "customs_licenses_link")}</a>}
          {deep && <a href="#origin" className="text-body hover:text-ink">{t(loc, "customs_cert_origin_link")}</a>}
          <a href="#prohibited" className="text-body hover:text-ink">{t(loc, "customs_prohibited_link")}</a>
          {deep && <a href="#links" className="text-body hover:text-ink">{t(loc, "customs_useful_links")}</a>}
          <a href="#faq" className="text-body hover:text-ink">FAQ</a>
        </div>
      </nav>

      {/* Quick Facts */}
      <section id="quick-facts" className="mb-10">
        <h2 className="text-2xl font-bold text-ink mb-4">
          {t(loc, "customs_quick_facts")}
        </h2>
        <div className="bg-surface border border-line rounded-xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-4">
            <div className="text-center p-4 bg-white rounded-lg" style={{border:'1px solid var(--line)', boxShadow:'var(--shadow-sm)'}}>
              <p className="text-sm text-body mb-1">{t(loc, "de_minimis")}</p>
              <p className="text-2xl font-bold text-ink">
                {customs.de_minimis_usd > 0 ? `$${customs.de_minimis_usd}` : "$0"}
              </p>
              <p className="text-xs text-body mt-1">
                {customs.de_minimis_usd > 0
                  ? t(loc, "duty_free_below", { threshold: String(customs.de_minimis_usd) })
                  : t(loc, "duty_from_zero")}
              </p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg" style={{border:'1px solid var(--line)', boxShadow:'var(--shadow-sm)'}}>
              <p className="text-sm text-body mb-1">{t(loc, "vat_rate")}</p>
              <p className="text-2xl font-bold text-ink">{customs.vat_rate}%</p>
              <p className="text-xs text-body mt-1">
                {deep ? deep.vat_applies_to : customs.currency}
              </p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg" style={{border:'1px solid var(--line)', boxShadow:'var(--shadow-sm)'}}>
              <p className="text-sm text-body mb-1">
                {t(loc, "customs_clearance_time")}
              </p>
              <p className="text-2xl font-bold text-ink">
                {deep ? `${deep.clearance_time_days}` : "2-5"}{" "}
                <span className="text-base font-normal text-body">{t(loc, "customs_days")}</span>
              </p>
              <p className="text-xs text-body mt-1">
                {t(loc, "customs_typical")}
              </p>
            </div>
          </div>
          {getCustomsNotes(customs, loc) && (
            <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 mt-4">
              <p className="text-sm text-accent-light">
                <span className="font-medium">{t(loc, "customs_note")}:</span>{" "}
                {getCustomsNotes(customs, loc)}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Duty Rates Table */}
      {deep && (
        <section id="duty-rates" className="mb-10">
          <h2 className="text-2xl font-bold text-ink mb-4">
            {t(loc, "customs_duty_rates_title")}
          </h2>
          <div className="bg-surface border border-line rounded-xl p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-body border-b border-line">
                    <th className="pb-3 pr-4">{t(loc, "customs_category_col")}</th>
                    <th className="pb-3 pr-4">{t(loc, "customs_duty_rate_col")}</th>
                    <th className="pb-3">{t(loc, "customs_hs_col")}</th>
                  </tr>
                </thead>
                <tbody>
                  {deep.duty_rates.map((rate, i) => (
                    <tr key={i} className="border-b border-line">
                      <td className="py-3 pr-4 text-ink font-medium">
                        {loc === "ru" ? rate.category_ru : rate.category_en}
                      </td>
                      <td className="py-3 pr-4 text-accent-light font-semibold">{rate.rate}</td>
                      <td className="py-3 text-body">{rate.hs_chapter}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted mt-4">
              {t(loc, "customs_rates_note")}
            </p>
          </div>
        </section>
      )}

      {/* Duty Calculator */}
      {hasCustomsData(country.code) && (
        <section id="calculator" className="mb-10">
          <DutyCalculator
            destCode={country.code}
            locale={loc}
            labels={{
              title: t(loc, "duty_calc_title"),
              item_value: t(loc, "duty_calc_value"),
              calculate: t(loc, "duty_calc_calculate"),
              duty: t(loc, "duty_calc_duty"),
              vat: t(loc, "duty_calc_vat"),
              total_import_cost: t(loc, "duty_calc_total"),
              de_minimis_note: t(loc, "duty_calc_below"),
              below_threshold: t(loc, "duty_calc_below"),
              currency_label: t(loc, "currency"),
              result_title: t(loc, "duty_calc_result"),
            }}
            dutyRates={deep?.duty_rates.map((r) => ({
              category: loc === "ru" ? r.category_ru : r.category_en,
              rate: r.rate,
              hs: r.hs_chapter.replace("HS ", ""),
            }))}
          />
        </section>
      )}

      {/* Clearance Process */}
      {deep && (
        <section id="clearance" className="mb-10">
          <h2 className="text-2xl font-bold text-ink mb-4">
            {t(loc, "customs_clearance_title")}
          </h2>
          <div className="bg-surface border border-line rounded-xl p-6">
            <p className="text-sm text-body leading-relaxed">
              {getLocalizedField(deep, "clearance_process", locale)}
            </p>
            <div className="flex flex-wrap gap-x-10 gap-y-3 mt-5">
              <div>
                <span className="block text-xs text-muted uppercase tracking-wider mb-1">
                  {t(loc, "customs_processing_time")}
                </span>
                <span className="text-ink font-medium">
                  {deep.clearance_time_days} {t(loc, "customs_days")}
                </span>
              </div>
              <div>
                <span className="block text-xs text-muted uppercase tracking-wider mb-1">
                  {t(loc, "customs_vat_rate_label")}
                </span>
                <span className="text-ink font-medium">{deep.vat_rate}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Customs Reality */}
      {deep && (
        <section id="reality" className="mb-10">
          <h2 className="text-2xl font-bold text-ink mb-4">
            {t(loc, "customs_reality_title")}
          </h2>
          <div className="bg-surface border border-line rounded-xl p-6">
            <p className="text-sm text-body leading-relaxed">
              {getLocalizedField(deep, "customs_reality", locale)}
            </p>
          </div>
        </section>
      )}

      {/* Required Documents */}
      <section id="documents" className="mb-10">
        <h2 className="text-2xl font-bold text-ink mb-4">
          {t(loc, "required_documents")}
        </h2>
        <div className="bg-surface border border-line rounded-xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { doc: t(loc, "doc_invoice"), desc: t(loc, "doc_invoice_desc") },
              { doc: t(loc, "doc_packing"), desc: t(loc, "doc_packing_desc") },
              { doc: t(loc, "doc_customs"), desc: t(loc, "doc_customs_desc") },
              { doc: t(loc, "doc_awb"), desc: t(loc, "doc_awb_desc") },
              { doc: t(loc, "doc_origin"), desc: t(loc, "doc_origin_desc") },
              { doc: t(loc, "doc_license"), desc: t(loc, "doc_license_desc") },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 items-start p-3 bg-surface-light rounded-lg">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-accent-light rounded-lg flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium text-ink text-sm">{item.doc}</p>
                  <p className="text-xs text-muted mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Import License Info */}
      {deep && (
        <section id="license" className="mb-10">
          <h2 className="text-2xl font-bold text-ink mb-4">
            {t(loc, "customs_license_title")}
          </h2>
          <div className="bg-surface border border-line rounded-xl p-6">
            <p className="text-sm text-body leading-relaxed">
              {getLocalizedField(deep, "import_license_info", locale)}
            </p>
          </div>
        </section>
      )}

      {/* Certificate of Origin */}
      {deep && (
        <section id="origin" className="mb-10">
          <h2 className="text-2xl font-bold text-ink mb-4">
            {t(loc, "customs_cert_origin_link")}
          </h2>
          <div className="bg-surface border border-line rounded-xl p-6">
            <p className="text-sm text-body leading-relaxed">
              {getLocalizedField(deep, "certificate_of_origin", locale)}
            </p>
            {deep.certificate_of_origin_url && (
              <a
                href={deep.certificate_of_origin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-sm text-accent-light hover:underline"
              >
                {t(loc, "customs_learn_more")} &rarr;
              </a>
            )}
          </div>
        </section>
      )}

      {/* Prohibited & Restricted Items */}
      <section id="prohibited" className="mb-10">
        <h2 className="text-2xl font-bold text-ink mb-4">
          {t(loc, "prohibited_items")}
        </h2>
        <div className="bg-surface border border-line rounded-xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-red-400 mb-2 text-sm">
                {t(loc, "prohibited")}
              </h3>
              <ul className="space-y-1 text-sm text-body">
                {[
                  t(loc, "prohibited_1"),
                  t(loc, "prohibited_2"),
                  t(loc, "prohibited_3"),
                  t(loc, "prohibited_4"),
                  t(loc, "prohibited_5"),
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-500 flex-shrink-0">x</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-amber-400 mb-2 text-sm">
                {t(loc, "restricted")}
              </h3>
              <ul className="space-y-1 text-sm text-body">
                {[
                  t(loc, "restricted_1"),
                  t(loc, "restricted_2"),
                  t(loc, "restricted_3"),
                  t(loc, "restricted_4"),
                  t(loc, "restricted_5"),
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-500 flex-shrink-0">!</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Useful Links */}
      {deep && (
        <section id="links" className="mb-10">
          <h2 className="text-2xl font-bold text-ink mb-4">
            {t(loc, "customs_useful_links")}
          </h2>
          <div className="bg-surface border border-line rounded-xl p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  label: t(loc, "customs_tariff_lookup"),
                  url: deep.customs_tariff_url,
                },
                {
                  label: t(loc, "customs_trade_stats"),
                  url: deep.trade_statistics_url,
                },
                {
                  label: t(loc, "customs_cert_origin"),
                  url: deep.certificate_of_origin_url,
                },
                {
                  label: t(loc, "customs_import_regs"),
                  url: deep.import_regulations_url,
                },
              ]
                .filter((link) => link.url)
                .map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-surface-light rounded-lg hover:border-accent/50 border border-transparent transition-all"
                  >
                    <span className="text-sm text-ink font-medium">{link.label}</span>
                    <span className="text-muted text-xs ml-auto">&rarr;</span>
                  </a>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Import Duty Estimator Table */}
      {hasCustomsData(country.code) && (
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-ink mb-4">
            {t(loc, "duty_tax_estimate")}
          </h2>
          <div className="bg-surface border border-line rounded-xl p-6">
            <p className="text-sm text-body mb-4">
              {t(loc, "duty_estimate_intro", { country: name })}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-body border-b border-line">
                    <th className="pb-2 pr-4">{t(loc, "goods_value")}</th>
                    <th className="pb-2 pr-4">{t(loc, "duty")}</th>
                    <th className="pb-2 pr-4">{t(loc, "vat_tax")}</th>
                    <th className="pb-2">{t(loc, "total_charges")}</th>
                  </tr>
                </thead>
                <tbody>
                  {[50, 100, 200, 500, 1000].map((value) => {
                    const dutiableValue = Math.max(0, value - customs.de_minimis_usd);
                    const duty = (dutiableValue * customs.avg_duty_rate) / 100;
                    const vatBase = value + duty;
                    const vat =
                      customs.de_minimis_usd > 0 && value <= customs.de_minimis_usd
                        ? 0
                        : (vatBase * customs.vat_rate) / 100;
                    const total = duty + vat;
                    return (
                      <tr key={value} className="border-b border-line">
                        <td className="py-2 pr-4 font-medium">${value}</td>
                        <td className="py-2 pr-4">${duty.toFixed(0)}</td>
                        <td className="py-2 pr-4">${vat.toFixed(0)}</td>
                        <td className="py-2 font-bold text-ink">
                          {total > 0 ? `$${total.toFixed(0)}` : t(loc, "free")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-body mt-3">
              {t(loc, "duty_estimate_note")}
            </p>
          </div>
        </section>
      )}

      {/* Popular routes to this country */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-ink mb-4">
          {t(loc, "popular_routes_to", { country: name })}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {popular.slice(0, 8).map((from) => (
            <Link
              key={from.code}
              href={`/${locale}/shipping/${makeCorridorSlug(from, country, loc)}`}
              prefetch={false}
              className="flex items-center gap-2 bg-surface border border-line rounded-lg p-3 hover:border-accent/50 transition-all text-sm"
            >
              <span>{countryFlag(from.code)}</span>
              <span>
                {getCountryName(from, loc)} &rarr; {name}
              </span>
              <span>{countryFlag(country.code)}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mb-10">
        <h2 className="text-2xl font-bold text-ink mb-4">
          {t(loc, "faq_title")}
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="bg-surface border border-line rounded-lg">
              <summary className="p-4 font-medium text-ink cursor-pointer hover:text-accent-light">
                {faq.q}
              </summary>
              <p className="px-4 pb-4 text-body text-sm">{faq.a}</p>
            </details>
          ))}
        </div>
        {/* FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((faq) => ({
                "@type": "Question",
                name: faq.q,
                acceptedAnswer: { "@type": "Answer", text: faq.a },
              })),
            }),
          }}
        />
      </section>

      {/* BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: t(loc, "home"),
                item: `${BASE_URL}/${locale}`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: t(loc, "guides"),
                item: `${BASE_URL}/${locale}/guide`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: t(loc, "customs_breadcrumb", { country: name }),
              },
            ],
          }),
        }}
      />

      {/* WebPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: `Import Duties & Customs Rules for ${getCountryName(country, "en")} [2026]`,
            description: `Complete customs guide for ${getCountryName(country, "en")}: de minimis $${customs.de_minimis_usd}, VAT ${customs.vat_rate}%, duty rates, documents, clearance.`,
            url: `${BASE_URL}/${locale}/customs/${slug}`,
            inLanguage: locale,
            isPartOf: {
              "@type": "WebSite",
              name: "RateShips",
              url: BASE_URL,
            },
            dateModified: "2026-04-01",
          }),
        }}
      />
    </div>
    </div>
  );
}
