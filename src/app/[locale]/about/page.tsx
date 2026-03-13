import { Metadata } from "next";
import { t, locales } from "@/lib/i18n";
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
    title: loc === "ru" ? "О ShipWorldwide" : "About ShipWorldwide",
    description:
      loc === "ru"
        ? "ShipWorldwide — бесплатный сервис сравнения тарифов международной доставки от 109+ перевозчиков в 213 стран мира."
        : "ShipWorldwide is a free international shipping rate comparison service covering 109+ carriers and 213 countries worldwide.",
    alternates: {
      canonical: `/${locale}/about`,
      languages: { en: "/en/about", ru: "/ru/about" },
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-blue-600">
          {t(loc, "home")}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">
          {loc === "ru" ? "О сервисе" : "About"}
        </span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
        {loc === "ru" ? "О ShipWorldwide" : "About ShipWorldwide"}
      </h1>

      <div className="prose max-w-none">
        {loc === "ru" ? (
          <>
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Наша миссия</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                ShipWorldwide — это бесплатный онлайн-сервис для сравнения тарифов международной доставки.
                Мы помогаем людям и бизнесу находить самые выгодные и быстрые варианты отправки посылок
                между любыми странами мира.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Наша цель — сделать международную доставку прозрачной и доступной для каждого.
                Вместо того чтобы проверять тарифы на десятках сайтов перевозчиков, вы можете
                сравнить все варианты на одной странице.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Что мы предлагаем</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <h3 className="font-semibold text-gray-900 mb-2">109+ перевозчиков</h3>
                  <p className="text-sm text-gray-600">
                    От крупнейших международных служб (DHL, FedEx, UPS) до региональных
                    и почтовых перевозчиков на каждом континенте.
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <h3 className="font-semibold text-gray-900 mb-2">213 стран</h3>
                  <p className="text-sm text-gray-600">
                    Полное покрытие всех стран и территорий мира. 45,000+ маршрутов доставки.
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <h3 className="font-semibold text-gray-900 mb-2">Таможенная информация</h3>
                  <p className="text-sm text-gray-600">
                    Данные о пошлинах, НДС и беспошлинных порогах для 80+ стран.
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <h3 className="font-semibold text-gray-900 mb-2">Гиды по доставке</h3>
                  <p className="text-sm text-gray-600">
                    Подробные руководства с советами по доставке для каждой страны.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Как мы работаем</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Мы собираем и анализируем публичные тарифы перевозчиков, чтобы предоставить
                вам актуальное сравнение цен. Наши данные основаны на опубликованных
                прайс-листах и обновляются регулярно.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Важно понимать, что указанные цены являются ориентировочными. Фактическая
                стоимость может отличаться в зависимости от габаритов посылки, топливных
                сборов, страховки и вашего типа аккаунта у перевозчика. Для точной цены
                рекомендуем обращаться к перевозчику напрямую.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Контакты</h2>
              <p className="text-gray-700 leading-relaxed">
                Если у вас есть вопросы, предложения или вы хотите сообщить об ошибке в данных,
                свяжитесь с нами по электронной почте: <span className="font-medium">info@shipworldwide.com</span>
              </p>
            </section>
          </>
        ) : (
          <>
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                ShipWorldwide is a free online service for comparing international shipping rates.
                We help individuals and businesses find the most affordable and fastest ways to send
                packages between any countries worldwide.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our goal is to make international shipping transparent and accessible to everyone.
                Instead of checking rates across dozens of carrier websites, you can compare all
                options on a single page.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">What We Offer</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <h3 className="font-semibold text-gray-900 mb-2">109+ Carriers</h3>
                  <p className="text-sm text-gray-600">
                    From major international services (DHL, FedEx, UPS) to regional
                    and postal carriers on every continent.
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <h3 className="font-semibold text-gray-900 mb-2">213 Countries</h3>
                  <p className="text-sm text-gray-600">
                    Complete coverage of all countries and territories worldwide. 45,000+ shipping routes.
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <h3 className="font-semibold text-gray-900 mb-2">Customs Information</h3>
                  <p className="text-sm text-gray-600">
                    Duty rates, VAT, and duty-free thresholds for 80+ countries.
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <h3 className="font-semibold text-gray-900 mb-2">Shipping Guides</h3>
                  <p className="text-sm text-gray-600">
                    Detailed guides with shipping tips for every country.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">How We Work</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We collect and analyze publicly available carrier tariffs to provide you with
                up-to-date price comparisons. Our data is based on published rate cards and
                is updated regularly.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Please note that displayed prices are estimates. Actual costs may vary depending on
                package dimensions, fuel surcharges, insurance, and your account type with the carrier.
                For exact pricing, we recommend contacting the carrier directly.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Contact</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have questions, suggestions, or want to report a data error,
                reach out to us at: <span className="font-medium">info@shipworldwide.com</span>
              </p>
            </section>
          </>
        )}
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: loc === "ru" ? "О ShipWorldwide" : "About ShipWorldwide",
            description:
              loc === "ru"
                ? "Бесплатный сервис сравнения тарифов международной доставки"
                : "Free international shipping rate comparison service",
            mainEntity: {
              "@type": "Organization",
              name: "ShipWorldwide",
              url: process.env.NEXT_PUBLIC_BASE_URL || "https://shipworldwide.com",
            },
          }),
        }}
      />
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
                item: `${process.env.NEXT_PUBLIC_BASE_URL || "https://shipworldwide.com"}/${locale}`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: loc === "ru" ? "О сервисе" : "About",
              },
            ],
          }),
        }}
      />
    </div>
  );
}
