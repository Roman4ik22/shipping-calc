import { Metadata } from "next";
import { locales, t } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import Link from "next/link";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  return {
    title: t(loc, "data_method_meta_title"),
    description: t(loc, "data_method_meta_desc"),
    alternates: {
      canonical: `/${locale}/data-methodology`,
      languages: {
        ...Object.fromEntries(
          locales.map((l) => [l, `/${l}/data-methodology`])
        ),
        "x-default": "/en/data-methodology",
      },
    },
  };
}

const TOP_CARRIERS = [
  { name: "DHL Express", url: "https://www.dhl.com/en/express/shipping/shipping_rates.html" },
  { name: "FedEx", url: "https://www.fedex.com/en-us/shipping/rate-changes.html" },
  { name: "UPS", url: "https://www.ups.com/us/en/support/shipping-support/shipping-costs.page" },
  { name: "USPS", url: "https://www.usps.com/international/priority-mail-international.htm" },
  { name: "Royal Mail", url: "https://www.royalmail.com/prices2026" },
  { name: "Japan Post", url: "https://www.post.japanpost.jp/int/charge/list/ems_all_en.html" },
  { name: "Australia Post", url: "https://auspost.com.au/parcels-mail/calculate-postage-delivery-times" },
  { name: "Canada Post", url: "https://www.canadapost-postescanada.ca/tools/find-a-rate.page" },
  { name: "Deutsche Post / DHL Paket", url: "https://www.dhl.de/en/privatkunden/pakete-versenden/weltweit-versenden/preise-international.html" },
  { name: "SF Express", url: "https://www.sf-international.com/cn/en/support/querySupport/fee_rate" },
];

const GRI_2026 = [
  { carrier: "DHL Express", increase: "4.9%", effective: "January 2026" },
  { carrier: "FedEx", increase: "5.9%", effective: "January 2026" },
  { carrier: "UPS", increase: "5.9%", effective: "December 2025" },
  { carrier: "USPS", increase: "3.6%", effective: "January 2026" },
  { carrier: "Royal Mail", increase: "7.6%", effective: "April 2026" },
  { carrier: "Canada Post", increase: "4.2%", effective: "January 2026" },
];

const CUSTOMS_SOURCES = [
  { name: "WTO Customs Valuation Database", url: "https://www.wto.org", purpose: "De minimis thresholds, trade agreements" },
  { name: "EU TARIC Database", url: "https://ec.europa.eu/taxation_customs/dds2/taric/taric_consultation.jsp", purpose: "EU duty rates and tariff classifications" },
  { name: "US International Trade Commission (USITC)", url: "https://hts.usitc.gov/", purpose: "US harmonized tariff schedule" },
  { name: "UK Trade Tariff (HMRC)", url: "https://www.trade-tariff.service.gov.uk/", purpose: "UK duty rates post-Brexit" },
  { name: "Canada Border Services Agency (CBSA)", url: "https://www.cbsa-asfc.gc.ca/trade-commerce/tariff-tarif/", purpose: "Canadian tariff schedule" },
  { name: "Australian Border Force", url: "https://www.abf.gov.au/importing-exporting-and-manufacturing/tariff-classification", purpose: "Australian tariff and duty rates" },
  { name: "Japan Customs", url: "https://www.customs.go.jp/english/tariff/", purpose: "Japanese tariff schedule" },
  { name: "Korea Customs Service", url: "https://www.customs.go.kr/english/", purpose: "Korean tariff schedule" },
  { name: "China Customs (GACC)", url: "http://english.customs.gov.cn/", purpose: "Chinese tariff schedule" },
  { name: "India Central Board of Indirect Taxes", url: "https://www.cbic.gov.in/", purpose: "Indian customs duties and GST" },
];

const RECENT_UPDATES = [
  { date: "March 2026", description: "Full audit of all 143 carrier rate databases" },
  { date: "March 2026", description: "Updated EU de minimis threshold to reflect new IOSS regulations" },
  { date: "February 2026", description: "Applied 2026 GRI for DHL, FedEx, UPS, Canada Post" },
  { date: "January 2026", description: "Updated VAT rates for 12 countries (Turkey, Nigeria, Saudi Arabia, etc.)" },
  { date: "January 2026", description: "Added Royal Mail 2026 tariff schedule" },
  { date: "December 2025", description: "Applied UPS 2026 rate adjustment (effective Dec 27, 2025)" },
  { date: "November 2025", description: "Updated Switzerland customs procedures and de minimis threshold" },
];

export default async function DataMethodologyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* BreadcrumbList + WebPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: t(loc, "home"),
                  item: `https://rateships.com/${locale}`,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: t(loc, "data_method_breadcrumb"),
                },
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: t(loc, "data_method_name"),
              description: t(loc, "data_method_wp_desc"),
              url: `https://rateships.com/${locale}/data-methodology`,
              dateModified: "2026-03-28",
              publisher: {
                "@type": "Organization",
                name: "RateShips",
                url: "https://rateships.com",
              },
            },
          ]),
        }}
      />

      <nav className="text-sm text-body mb-6">
        <Link href={`/${locale}`} className="hover:text-accent">
          {t(loc, "home")}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">
          {t(loc, "data_method_breadcrumb")}
        </span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-4">
        {t(loc, "data_method_h1")}
      </h1>
      <p className="text-body mb-8 text-lg">
        {t(loc, "data_method_intro")}
      </p>

      <div className="space-y-10 text-body leading-relaxed">
        {/* Section 1: Carrier Rate Data */}
        <section>
          <h2 className="text-2xl font-bold text-ink mb-4">
            {t(loc, "data_method_s1_title")}
          </h2>
          <p className="mb-4">
            {t(loc, "data_method_s1_body")}
          </p>

          <h3 className="text-lg font-semibold text-ink mb-3">
            {t(loc, "data_method_top10")}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-line rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-white/5">
                  <th className="text-left p-3 text-body font-medium">
                    {t(loc, "data_method_carrier_col")}
                  </th>
                  <th className="text-left p-3 text-body font-medium">
                    {t(loc, "data_method_source_col")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {TOP_CARRIERS.map((c) => (
                  <tr key={c.name} className="border-t border-line">
                    <td className="p-3 text-ink font-medium">{c.name}</td>
                    <td className="p-3">
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="text-accent hover:underline break-all text-xs"
                      >
                        {c.url.replace("https://www.", "").replace("https://", "")}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted mt-2">
            {t(loc, "data_method_full_list_pre")}
            <Link
              href={`/${locale}/sources`}
              className="text-accent hover:underline"
            >
              {t(loc, "data_method_full_list_link")}
            </Link>
            {t(loc, "data_method_full_list_post")}
          </p>

          <h3 className="text-lg font-semibold text-ink mt-6 mb-3">
            {t(loc, "data_method_currency_title")}
          </h3>
          <p>
            {t(loc, "data_method_currency_body")}
          </p>

          <h3 className="text-lg font-semibold text-ink mt-6 mb-3">
            {t(loc, "data_method_gri_title")}
          </h3>
          <p className="mb-3">
            {t(loc, "data_method_gri_body")}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-line rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-white/5">
                  <th className="text-left p-3 text-body font-medium">
                    {t(loc, "data_method_carrier_col")}
                  </th>
                  <th className="text-left p-3 text-body font-medium">
                    {t(loc, "data_method_increase_col")}
                  </th>
                  <th className="text-left p-3 text-body font-medium">
                    {t(loc, "data_method_effective_col")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {GRI_2026.map((g) => (
                  <tr key={g.carrier} className="border-t border-line">
                    <td className="p-3 text-ink">{g.carrier}</td>
                    <td className="p-3 text-accent font-medium">
                      +{g.increase}
                    </td>
                    <td className="p-3 text-body">{g.effective}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-semibold text-ink mt-6 mb-3">
            {t(loc, "data_method_verified_title")}
          </h3>
          <div className="bg-surface border border-line rounded-lg p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-ink font-semibold">
                    {t(loc, "data_method_verified_label")}
                  </span>
                </div>
                <p className="text-sm text-body">
                  {t(loc, "data_method_verified_desc")}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-ink font-semibold">
                    {t(loc, "data_method_estimated_label")}
                  </span>
                </div>
                <p className="text-sm text-body">
                  {t(loc, "data_method_estimated_desc")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Customs Data */}
        <section>
          <h2 className="text-2xl font-bold text-ink mb-4">
            {t(loc, "data_method_s2_title")}
          </h2>
          <p className="mb-4">
            {t(loc, "data_method_s2_body")}
          </p>

          <h3 className="text-lg font-semibold text-ink mb-3">
            {t(loc, "data_method_what_track")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-surface border border-line rounded-lg p-4">
              <p className="text-ink font-semibold mb-1">
                {t(loc, "data_method_deminimis_title")}
              </p>
              <p className="text-sm text-body">
                {t(loc, "data_method_deminimis_desc")}
              </p>
            </div>
            <div className="bg-surface border border-line rounded-lg p-4">
              <p className="text-ink font-semibold mb-1">
                {t(loc, "data_method_duty_title")}
              </p>
              <p className="text-sm text-body">
                {t(loc, "data_method_duty_desc")}
              </p>
            </div>
            <div className="bg-surface border border-line rounded-lg p-4">
              <p className="text-ink font-semibold mb-1">
                {t(loc, "data_method_vat_title")}
              </p>
              <p className="text-sm text-body">
                {t(loc, "data_method_vat_desc")}
              </p>
            </div>
            <div className="bg-surface border border-line rounded-lg p-4">
              <p className="text-ink font-semibold mb-1">
                {t(loc, "data_method_prohibited_title")}
              </p>
              <p className="text-sm text-body">
                {t(loc, "data_method_prohibited_desc")}
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-ink mb-3">
            {t(loc, "data_method_customs_sources")}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-line rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-white/5">
                  <th className="text-left p-3 text-body font-medium">
                    {t(loc, "data_method_source_name")}
                  </th>
                  <th className="text-left p-3 text-body font-medium">
                    {t(loc, "data_method_source_purpose")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {CUSTOMS_SOURCES.map((s) => (
                  <tr key={s.name} className="border-t border-line">
                    <td className="p-3">
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="text-accent hover:underline"
                      >
                        {s.name}
                      </a>
                    </td>
                    <td className="p-3 text-body">{s.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: Update Frequency */}
        <section>
          <h2 className="text-2xl font-bold text-ink mb-4">
            {t(loc, "data_method_s3_title")}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-surface border border-line rounded-lg p-5 text-center">
              <p className="text-2xl font-bold text-accent">
                {t(loc, "data_method_weekly")}
              </p>
              <p className="text-xs text-body mt-1">
                {t(loc, "data_method_weekly_desc")}
              </p>
            </div>
            <div className="bg-surface border border-line rounded-lg p-5 text-center">
              <p className="text-2xl font-bold text-accent">
                {t(loc, "data_method_monthly")}
              </p>
              <p className="text-xs text-body mt-1">
                {t(loc, "data_method_monthly_desc")}
              </p>
            </div>
            <div className="bg-surface border border-line rounded-lg p-5 text-center">
              <p className="text-2xl font-bold text-accent">
                {t(loc, "data_method_daily")}
              </p>
              <p className="text-xs text-body mt-1">
                {t(loc, "data_method_daily_desc")}
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-ink mb-3">
            {t(loc, "data_method_recent_updates")}
          </h3>
          <div className="space-y-2">
            {RECENT_UPDATES.map((u, i) => (
              <div
                key={i}
                className="flex gap-4 items-start border-l-2 border-accent-light/30 pl-4 py-1"
              >
                <span className="text-sm text-accent font-medium whitespace-nowrap min-w-[100px]">
                  {u.date}
                </span>
                <span className="text-sm text-body">{u.description}</span>
              </div>
            ))}
          </div>

          <div className="bg-surface border border-line rounded-lg p-5 mt-6">
            <p className="text-ink font-semibold mb-1">
              {t(loc, "data_method_last_audit_title")}
            </p>
            <p className="text-sm text-body">
              {t(loc, "data_method_last_audit_body")}
            </p>
          </div>
        </section>

        {/* Section 4: Coverage */}
        <section>
          <h2 className="text-2xl font-bold text-ink mb-4">
            {t(loc, "data_method_s4_title")}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-surface border border-line rounded-lg p-5 text-center">
              <p className="text-3xl font-bold text-accent">143</p>
              <p className="text-sm text-body mt-1">
                {t(loc, "data_method_carriers_label")}
              </p>
            </div>
            <div className="bg-surface border border-line rounded-lg p-5 text-center">
              <p className="text-3xl font-bold text-accent">213</p>
              <p className="text-sm text-body mt-1">
                {t(loc, "data_method_countries_label")}
              </p>
            </div>
            <div className="bg-surface border border-line rounded-lg p-5 text-center">
              <p className="text-3xl font-bold text-accent">80+</p>
              <p className="text-sm text-body mt-1">
                {t(loc, "data_method_verified_count")}
              </p>
            </div>
            <div className="bg-surface border border-line rounded-lg p-5 text-center">
              <p className="text-3xl font-bold text-accent">40+</p>
              <p className="text-sm text-body mt-1">
                {t(loc, "data_method_customs_count")}
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Accuracy Commitment */}
        <section>
          <h2 className="text-2xl font-bold text-ink mb-4">
            {t(loc, "data_method_s5_title")}
          </h2>

          <div className="space-y-4">
            <div className="bg-surface border border-green-500/20 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block w-3 h-3 rounded-full bg-green-500" />
                <span className="text-ink font-semibold">
                  {t(loc, "data_method_verified_accuracy")}
                </span>
              </div>
              <p className="text-sm text-body">
                {t(loc, "data_method_verified_acc_desc")}
              </p>
            </div>

            <div className="bg-surface border border-yellow-500/20 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-ink font-semibold">
                  {t(loc, "data_method_estimated_accuracy")}
                </span>
              </div>
              <p className="text-sm text-body">
                {t(loc, "data_method_estimated_acc_desc")}
              </p>
            </div>
          </div>

          <div className="bg-surface border border-line rounded-lg p-5 mt-6">
            <h3 className="text-ink font-semibold mb-2">
              {t(loc, "data_method_disclaimer_title")}
            </h3>
            <ul className="list-disc list-inside text-sm text-body space-y-2">
              <li>{t(loc, "data_method_disclaimer_1")}</li>
              <li>{t(loc, "data_method_disclaimer_2")}</li>
              <li>{t(loc, "data_method_disclaimer_3")}</li>
              <li>{t(loc, "data_method_disclaimer_4")}</li>
            </ul>
          </div>
        </section>

        {/* Section 6: Report Inaccuracies */}
        <section>
          <h2 className="text-2xl font-bold text-ink mb-4">
            {t(loc, "data_method_s6_title")}
          </h2>
          <p className="mb-4">
            {t(loc, "data_method_s6_body")}
          </p>
          <div className="bg-surface border border-line rounded-lg p-5">
            <p className="text-body text-sm">
              {t(loc, "data_method_s6_contact_pre")}
              <Link
                href={`/${locale}/about`}
                className="text-accent hover:underline"
              >
                {t(loc, "data_method_s6_contact_link")}
              </Link>
              {t(loc, "data_method_s6_contact_post")}
            </p>
          </div>
        </section>

        <p className="text-sm text-muted pt-4 border-t border-line">
          {t(loc, "last_updated_march")}
        </p>
      </div>
    </div>
  );
}
