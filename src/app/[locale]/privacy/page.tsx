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
    title: isRu ? "Политика конфиденциальности" : "Privacy Policy",
    description: isRu
      ? "Политика конфиденциальности RateShips — как мы собираем и используем данные."
      : "RateShips Privacy Policy — how we collect and use data.",
    alternates: {
      canonical: `/${locale}/privacy`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/privacy`])),
    },
  };
}

export default async function PrivacyPage({
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
          {isRu ? "Политика конфиденциальности" : "Privacy Policy"}
        </span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6">
        {isRu ? "Политика конфиденциальности" : "Privacy Policy"}
      </h1>

      <div className="space-y-6 text-gray-300 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            {isRu ? "1. Аналитика и отслеживание" : "1. Analytics & Tracking"}
          </h2>
          <p>
            {isRu
              ? "Мы используем Google Analytics и Google Tag Manager (GTM) для сбора анонимной статистики о посещениях сайта. Это помогает нам понимать, как пользователи взаимодействуют с сервисом, и улучшать его. Собираемые данные включают: страницы посещений, время на сайте, тип устройства, географическое расположение (на уровне страны) и источник перехода."
              : "We use Google Analytics and Google Tag Manager (GTM) to collect anonymous website usage statistics. This helps us understand how users interact with the service and improve it. Data collected includes: pages visited, time on site, device type, geographic location (country level), and referral source."}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            {isRu ? "2. Реклама" : "2. Advertising"}
          </h2>
          <p>
            {isRu
              ? "Мы используем Google AdSense для показа рекламы на сайте. AdSense может использовать файлы cookie для показа персонализированной рекламы на основе ваших предыдущих посещений нашего и других сайтов. Вы можете отказаться от персонализированной рекламы в настройках рекламы Google."
              : "We use Google AdSense to display advertisements on the site. AdSense may use cookies to serve personalized ads based on your prior visits to our and other websites. You can opt out of personalized advertising in Google Ad Settings."}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            {isRu ? "3. Сбор электронной почты" : "3. Email Collection"}
          </h2>
          <p>
            {isRu
              ? "Если вы подписываетесь на нашу рассылку, мы сохраняем ваш адрес электронной почты для отправки обновлений о новых функциях, изменениях тарифов и полезных руководствах по доставке. Вы можете отписаться в любое время, перейдя по ссылке в нижней части любого письма."
              : "If you subscribe to our newsletter, we store your email address to send updates about new features, rate changes, and useful shipping guides. You can unsubscribe at any time by clicking the link at the bottom of any email."}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            {isRu ? "4. Локальное хранилище" : "4. Local Storage"}
          </h2>
          <p>
            {isRu
              ? "Мы используем localStorage в вашем браузере для сохранения избранных маршрутов доставки и пользовательских настроек (валюта, единицы веса). Эти данные хранятся только на вашем устройстве и не передаются на наши серверы."
              : "We use localStorage in your browser to save your favorite shipping routes and user preferences (currency, weight units). This data is stored only on your device and is not transmitted to our servers."}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            {isRu ? "5. Файлы cookie" : "5. Cookies"}
          </h2>
          <p>
            {isRu
              ? "Наш сайт использует файлы cookie для работы Google Analytics, Google Tag Manager и Google AdSense. Эти cookie помогают анализировать трафик и показывать релевантную рекламу. Вы можете управлять cookie в настройках вашего браузера."
              : "Our site uses cookies for Google Analytics, Google Tag Manager, and Google AdSense. These cookies help analyze traffic and display relevant advertisements. You can manage cookies in your browser settings."}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            {isRu ? "6. Продажа данных" : "6. Data Sales"}
          </h2>
          <p>
            {isRu
              ? "Мы не продаём, не обмениваем и не передаём ваши персональные данные третьим лицам, за исключением случаев, описанных в данной политике (аналитика и реклама). Мы не собираем имена, адреса или платёжную информацию."
              : "We do not sell, trade, or transfer your personal data to third parties, except as described in this policy (analytics and advertising). We do not collect names, addresses, or payment information."}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            {isRu ? "7. Контакт" : "7. Contact"}
          </h2>
          <p>
            {isRu
              ? "По вопросам конфиденциальности обращайтесь по адресу: "
              : "For privacy inquiries, contact us at: "}
            <span className="font-medium text-white">privacy@rateships.com</span>
          </p>
        </section>

        <p className="text-sm text-gray-500 pt-4 border-t border-white/10">
          {isRu ? "Последнее обновление: март 2026" : "Last updated: March 2026"}
        </p>
      </div>
    </div>
  );
}
