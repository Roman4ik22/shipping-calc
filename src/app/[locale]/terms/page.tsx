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
    title: isRu ? "Условия использования" : "Terms of Service",
    description: isRu
      ? "Условия использования сервиса RateShips — бесплатный калькулятор стоимости международной доставки."
      : "Terms of Service for RateShips — a free international shipping cost comparison tool.",
    alternates: {
      canonical: `/${locale}/terms`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}/terms`])),
        "x-default": "/en/terms",
      },
    },
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isRu = locale === "ru";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* BreadcrumbList JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: isRu ? "Главная" : "Home", item: `https://rateships.com/${locale}` },
              { "@type": "ListItem", position: 2, name: isRu ? "Условия использования" : "Terms of Service" },
            ],
          }),
        }}
      />

      <nav className="text-sm text-gray-400 mb-6">
        <Link href={`/${locale}`} className="hover:text-accent-light">
          {isRu ? "Главная" : "Home"}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-white">
          {isRu ? "Условия использования" : "Terms of Service"}
        </span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6">
        {isRu ? "Условия использования" : "Terms of Service"}
      </h1>

      <div className="space-y-6 text-gray-300 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            {isRu ? "1. Описание сервиса" : "1. Service Description"}
          </h2>
          <p>
            {isRu
              ? "RateShips — это бесплатный информационный сервис для сравнения стоимости международной доставки. Мы предоставляем ориентировочные цены на основе опубликованных тарифных сеток перевозчиков. Сервис предназначен исключительно для информационных целей."
              : "RateShips is a free informational service for comparing international shipping costs. We provide estimated prices based on publicly available carrier rate cards. The service is intended for informational purposes only."}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            {isRu ? "2. Точность информации" : "2. Accuracy of Information"}
          </h2>
          <p>
            {isRu
              ? "Все цены, сроки доставки и таможенная информация являются приблизительными оценками. Мы не гарантируем точность, полноту или актуальность представленных данных. Фактические тарифы могут отличаться в зависимости от перевозчика, размеров посылки, дополнительных сборов и других факторов."
              : "All prices, delivery times, and customs information are approximate estimates. We do not guarantee the accuracy, completeness, or timeliness of the data presented. Actual rates may vary depending on the carrier, package dimensions, surcharges, and other factors."}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            {isRu ? "3. Отсутствие аффилиации" : "3. No Carrier Affiliation"}
          </h2>
          <p>
            {isRu
              ? "RateShips не является аффилированным лицом, партнёром или представителем каких-либо перевозчиков или курьерских служб. Мы не продаём услуги доставки и не обрабатываем отправления. Все товарные знаки и названия перевозчиков принадлежат их соответствующим владельцам."
              : "RateShips is not affiliated with, partnered with, or an agent of any carriers or courier services. We do not sell shipping services or process shipments. All trademarks and carrier names belong to their respective owners."}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            {isRu ? "4. Отказ от гарантий" : "4. Disclaimer of Warranties"}
          </h2>
          <p>
            {isRu
              ? "Сервис предоставляется «как есть» без каких-либо гарантий. Мы не несём ответственности за убытки, возникшие в результате использования информации с нашего сайта. Пользователь несёт ответственность за проверку актуальных тарифов и условий непосредственно у выбранного перевозчика перед отправкой."
              : "The service is provided \"as is\" without any warranties of any kind. We are not liable for any losses arising from the use of information from our website. The user is responsible for verifying current rates and conditions directly with the chosen carrier before shipping."}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            {isRu ? "5. Ответственность пользователя" : "5. User Responsibility"}
          </h2>
          <p>
            {isRu
              ? "Пользователь обязан самостоятельно проверять все тарифы, правила и ограничения у перевозчика перед оформлением отправления. RateShips не несёт ответственности за решения, принятые на основе информации, представленной на сайте."
              : "Users are responsible for independently verifying all rates, rules, and restrictions with the carrier before arranging a shipment. RateShips is not responsible for decisions made based on the information presented on the site."}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            {isRu ? "6. Изменение условий" : "6. Changes to Terms"}
          </h2>
          <p>
            {isRu
              ? "Мы оставляем за собой право изменять настоящие условия в любое время. Продолжение использования сервиса после внесения изменений означает согласие с обновлёнными условиями."
              : "We reserve the right to modify these terms at any time. Continued use of the service after changes are made constitutes acceptance of the updated terms."}
          </p>
        </section>

        <p className="text-sm text-gray-500 pt-4 border-t border-white/10">
          {isRu ? "Последнее обновление: март 2026" : "Last updated: March 2026"}
        </p>
      </div>
    </div>
  );
}
