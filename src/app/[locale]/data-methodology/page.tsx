import { Metadata } from "next";
import { locales } from "@/lib/i18n";
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
  const isRu = locale === "ru";
  return {
    title: isRu ? "Методология данных" : "How We Collect Data",
    description: isRu
      ? "Как RateShips собирает и обрабатывает данные о тарифах перевозчиков, таможенных пошлинах и курсах валют."
      : "How RateShips collects and processes carrier rate data, customs duties, and exchange rates.",
    alternates: {
      canonical: `/${locale}/data-methodology`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/data-methodology`])),
    },
  };
}

export default async function DataMethodologyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isRu = locale === "ru";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-gray-400 mb-6">
        <Link href={`/${locale}`} className="hover:text-accent-light">
          {isRu ? "Главная" : "Home"}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-white">
          {isRu ? "Методология данных" : "How We Collect Data"}
        </span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6">
        {isRu ? "Как мы собираем данные" : "How We Collect Data"}
      </h1>

      <div className="space-y-6 text-gray-300 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            {isRu ? "1. Источники тарифов" : "1. Rate Sources"}
          </h2>
          <p>
            {isRu
              ? "Тарифы на доставку получены из публично доступных прайс-листов перевозчиков, официальных сайтов и открытых API. Мы собираем данные от 143 перевозчиков, охватывающих 213 стран и территорий. Каждый тариф включает стоимость, ориентировочные сроки доставки и информацию об отслеживании."
              : "Shipping rates are sourced from publicly available carrier price lists, official websites, and open APIs. We collect data from 143 carriers covering 213 countries and territories. Each rate includes pricing, estimated delivery times, and tracking information."}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            {isRu ? "2. Частота обновлений" : "2. Update Frequency"}
          </h2>
          <p>
            {isRu
              ? "Наша база данных тарифов обновляется еженедельно. Мы проверяем изменения цен, новые услуги и обновления зон доставки у всех перевозчиков. Основные перевозчики (DHL, FedEx, UPS, USPS) проверяются чаще — при каждом объявлении об изменении тарифов."
              : "Our rate database is updated weekly. We check for price changes, new services, and delivery zone updates across all carriers. Major carriers (DHL, FedEx, UPS, USPS) are checked more frequently — whenever rate change announcements are made."}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            {isRu ? "3. Покрытие" : "3. Coverage"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div className="bg-surface border border-white/10 rounded-lg p-5 text-center">
              <p className="text-3xl font-bold text-accent-light">143</p>
              <p className="text-sm text-gray-400 mt-1">
                {isRu ? "перевозчиков" : "carriers"}
              </p>
            </div>
            <div className="bg-surface border border-white/10 rounded-lg p-5 text-center">
              <p className="text-3xl font-bold text-accent-light">213</p>
              <p className="text-sm text-gray-400 mt-1">
                {isRu ? "стран и территорий" : "countries & territories"}
              </p>
            </div>
            <div className="bg-surface border border-white/10 rounded-lg p-5 text-center">
              <p className="text-3xl font-bold text-accent-light">
                {isRu ? "еженедельно" : "weekly"}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {isRu ? "обновление данных" : "data updates"}
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            {isRu ? "4. Таможенные данные" : "4. Customs Data"}
          </h2>
          <p>
            {isRu
              ? "Информация о таможенных пошлинах, НДС/GST и порогах de minimis получена из официальных государственных источников: таможенных служб, налоговых органов и международных торговых баз данных (WTO, WCO). Эти данные обновляются по мере изменения законодательства."
              : "Customs duty, VAT/GST, and de minimis threshold information is sourced from official government sources: customs authorities, tax agencies, and international trade databases (WTO, WCO). This data is updated as regulations change."}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            {isRu ? "5. Курсы валют" : "5. Exchange Rates"}
          </h2>
          <p>
            {isRu
              ? "Курсы валют являются приблизительными и основаны на средних рыночных курсах. Они обновляются ежедневно, но могут отличаться от курсов, предлагаемых перевозчиками или банками. Для точного расчёта стоимости рекомендуем проверять актуальный курс у вашего перевозчика."
              : "Exchange rates are approximate and based on mid-market rates. They are updated daily but may differ from rates offered by carriers or banks. For accurate cost calculations, we recommend checking the current exchange rate with your carrier."}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            {isRu ? "6. Отказ от ответственности" : "6. Accuracy Disclaimer"}
          </h2>
          <div className="bg-surface border border-white/10 rounded-lg p-5">
            <p>
              {isRu
                ? "Несмотря на наши усилия по поддержанию актуальности данных, мы не можем гарантировать 100% точность всей представленной информации. Тарифы перевозчиков могут меняться без предварительного уведомления. Дополнительные сборы (топливные надбавки, сборы за удалённые районы, сезонные надбавки) могут не быть учтены. Всегда проверяйте окончательную стоимость у перевозчика перед отправкой."
                : "Despite our efforts to keep data current, we cannot guarantee 100% accuracy of all information presented. Carrier rates may change without prior notice. Additional surcharges (fuel surcharges, remote area fees, seasonal surcharges) may not be reflected. Always verify the final cost with the carrier before shipping."}
            </p>
          </div>
        </section>

        <p className="text-sm text-gray-500 pt-4 border-t border-white/10">
          {isRu ? "Последнее обновление: март 2026" : "Last updated: March 2026"}
        </p>
      </div>
    </div>
  );
}
