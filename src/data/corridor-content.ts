export interface CorridorContent {
  from: string;
  to: string;
  trade_info_en: string;
  trade_info_ru: string;
  tips_en: string;
  tips_ru: string;
  reviews: { text_en: string; text_ru: string; carrier: string; days: number }[];
}

const corridors: CorridorContent[] = [
  {
    from: "US",
    to: "GB",
    trade_info_en:
      "The US and UK are major trade partners with bilateral goods trade exceeding $130 billion annually. There is no broad free trade agreement between the two countries, so standard MFN tariffs apply. The UK charges 20% VAT on most imported goods with a de minimis threshold of GBP 135.",
    trade_info_ru:
      "США и Великобритания являются крупными торговыми партнёрами с двусторонним товарооборотом более $130 млрд в год. Между странами нет всеобъемлющего соглашения о свободной торговле, поэтому применяются стандартные тарифы РНБ. Великобритания взимает НДС 20% на большинство импортируемых товаров с порогом de minimis 135 GBP.",
    tips_en:
      "USPS Priority Mail International is often the cheapest option for small parcels under 2 kg. For larger shipments, UPS and FedEx offer competitive express rates with 2-3 day delivery. Always include a detailed customs declaration, UK customs frequently inspect US parcels.",
    tips_ru:
      "USPS Priority Mail International часто самый дешёвый вариант для небольших посылок до 2 кг. Для более крупных отправлений UPS и FedEx предлагают конкурентные экспресс-тарифы с доставкой за 2-3 дня. Всегда заполняйте подробную таможенную декларацию, британская таможня часто проверяет посылки из США.",
    reviews: [
      { text_en: "Shipped a 3 kg package via UPS Express and it arrived in London in just 2 days. Customs clearance was smooth with no extra fees since the value was under GBP 135.", text_ru: "Отправил посылку 3 кг через UPS Express, и она прибыла в Лондон всего за 2 дня. Таможенное оформление прошло гладко, без дополнительных сборов, так как стоимость была ниже 135 GBP.", carrier: "UPS", days: 2 },
      { text_en: "Used USPS Priority Mail International for a birthday gift. Took 7 days to deliver to Manchester. Good tracking and very affordable at $35 for 1.5 kg.", text_ru: "Воспользовался USPS Priority Mail International для отправки подарка на день рождения. Доставка в Манчестер заняла 7 дней. Хорошее отслеживание и очень доступная цена, $35 за 1,5 кг.", carrier: "USPS", days: 7 },
    ],
  },
  {
    from: "US",
    to: "DE",
    trade_info_en:
      "Germany is the largest US trade partner in the EU, with bilateral goods trade around $250 billion per year. There is no US-EU free trade agreement, so EU common external tariffs apply. Germany charges 19% VAT (Einfuhrumsatzsteuer) on imports, with duty-free entry for shipments valued under EUR 150.",
    trade_info_ru:
      "Германия, крупнейший торговый партнёр США в ЕС с двусторонним товарооборотом около $250 млрд в год. Между США и ЕС нет соглашения о свободной торговле, поэтому применяются единые внешние тарифы ЕС. Германия взимает НДС 19% (Einfuhrumsatzsteuer) на импорт, с беспошлинным ввозом товаров стоимостью до 150 EUR.",
    tips_en:
      "DHL Express is the fastest option, typically 1-2 business days from the US. For economy shipping, USPS First Class International works well for items under 2 kg. German customs are strict about declared values, so be accurate to avoid delays and penalties.",
    tips_ru:
      "DHL Express, самый быстрый вариант, обычно 1-2 рабочих дня из США. Для экономичной доставки USPS First Class International хорошо подходит для товаров до 2 кг. Немецкая таможня строго относится к декларируемой стоимости, поэтому указывайте точные данные, чтобы избежать задержек и штрафов.",
    reviews: [
      { text_en: "DHL Express from New York to Berlin in 2 days flat. Paid $65 for a 2 kg box. Duties were pre-calculated and I paid them at checkout, no surprises at delivery.", text_ru: "DHL Express из Нью-Йорка в Берлин за ровно 2 дня. Заплатил $65 за коробку 2 кг. Пошлины были рассчитаны заранее и оплачены при оформлении, никаких сюрпризов при доставке.", carrier: "DHL", days: 2 },
      { text_en: "Sent electronics via FedEx International Priority. Arrived in Munich in 3 days. Had to pay 19% VAT on delivery but the process was straightforward.", text_ru: "Отправил электронику через FedEx International Priority. Прибыла в Мюнхен за 3 дня. Пришлось заплатить 19% НДС при доставке, но процесс был простым.", carrier: "FedEx", days: 3 },
    ],
  },
  {
    from: "CN",
    to: "US",
    trade_info_en:
      "China is the largest source of US imports, with over $400 billion in goods shipped annually. Since 2018, additional tariffs of 7.5-25% apply on many Chinese goods under Section 301 actions, on top of standard MFN rates. The US de minimis threshold is $800, making small direct-to-consumer parcels duty-free.",
    trade_info_ru:
      "Китай, крупнейший источник импорта в США, с ежегодным объёмом поставок более $400 млрд. С 2018 года на многие китайские товары действуют дополнительные пошлины 7,5-25% в рамках мер по Разделу 301, помимо стандартных тарифов РНБ. Порог de minimis в США составляет $800, что делает мелкие посылки для потребителей беспошлинными.",
    tips_en:
      "For parcels under $800, the US de minimis exemption means no duties or taxes. China Post and Yanwen offer the cheapest economy options (15-30 days). SF Express and 4PX provide faster alternatives at 7-12 days. Always check if your item falls under Section 301 tariffs before shipping high-value goods.",
    tips_ru:
      "Для посылок стоимостью до $800 действует освобождение de minimis в США, без пошлин и налогов. China Post и Yanwen предлагают самые дешёвые эконом-варианты (15-30 дней). SF Express и 4PX обеспечивают более быструю доставку за 7-12 дней. Всегда проверяйте, подпадает ли ваш товар под тарифы по Разделу 301, прежде чем отправлять дорогие товары.",
    reviews: [
      { text_en: "Ordered a package from Shenzhen via SF Express. Arrived in Los Angeles in 8 days with full tracking. Very impressed with the speed for the price.", text_ru: "Заказал посылку из Шэньчжэня через SF Express. Прибыла в Лос-Анджелес за 8 дней с полным отслеживанием. Очень впечатлён скоростью за такую цену.", carrier: "SF Express", days: 8 },
      { text_en: "Used China Post for a 0.5 kg item. Took 22 days but only cost $6. Good for non-urgent shipments. Tracking stopped updating after it left China but the package arrived fine.", text_ru: "Воспользовался China Post для товара 0,5 кг. Заняло 22 дня, но стоило всего $6. Подходит для несрочных отправлений. Отслеживание перестало обновляться после выхода из Китая, но посылка пришла в порядке.", carrier: "China Post", days: 22 },
    ],
  },
  {
    from: "US",
    to: "CA",
    trade_info_en:
      "The United States-Mexico-Canada Agreement (USMCA, formerly NAFTA) governs US-Canada trade, providing duty-free treatment for most goods that meet rules of origin. Canada is the largest US trade partner with over $700 billion in bilateral trade. Canada charges 5% GST (plus provincial taxes in some provinces) on imports, with a de minimis threshold of CAD 20 for taxes and CAD 150 for duties.",
    trade_info_ru:
      "Соглашение США-Мексика-Канада (USMCA, ранее НАФТА) регулирует торговлю между США и Канадой, обеспечивая беспошлинный режим для большинства товаров, соответствующих правилам происхождения. Канада, крупнейший торговый партнёр США с двусторонним товарооборотом свыше $700 млрд. Канада взимает 5% GST (плюс провинциальные налоги) на импорт, с порогом de minimis CAD 20 для налогов и CAD 150 для пошлин.",
    tips_en:
      "USPS is usually the most affordable for small parcels, First Class International delivers in 6-10 days. UPS Standard to Canada is fast (2-5 days) and often cheaper than express options. Mark packages as made in the USA to benefit from USMCA duty-free treatment. Canada's low de minimis of CAD 20 means GST applies on most imports.",
    tips_ru:
      "USPS обычно самый доступный вариант для небольших посылок, First Class International доставляет за 6-10 дней. UPS Standard в Канаду быстрый (2-5 дней) и часто дешевле экспресс-вариантов. Маркируйте посылки как произведённые в США для получения беспошлинного режима по USMCA. Низкий порог de minimis Канады в CAD 20 означает, что GST применяется к большинству импортных товаров.",
    reviews: [
      { text_en: "Shipped a gift to Toronto via USPS Priority Mail International. Got there in 5 days for $28. Had to pay CAD 12 in GST on delivery but that was expected.", text_ru: "Отправил подарок в Торонто через USPS Priority Mail International. Дошёл за 5 дней за $28. Пришлось заплатить 12 CAD GST при доставке, но это было ожидаемо.", carrier: "USPS", days: 5 },
      { text_en: "Use UPS Standard regularly for business shipments to Vancouver. Consistent 3-day delivery and the USMCA paperwork keeps duties at zero for US-made products.", text_ru: "Регулярно использую UPS Standard для деловых отправлений в Ванкувер. Стабильная доставка за 3 дня, а документы USMCA обеспечивают нулевые пошлины на товары американского производства.", carrier: "UPS", days: 3 },
    ],
  },
  {
    from: "US",
    to: "JP",
    trade_info_en:
      "The US-Japan Trade Agreement (Phase 1, 2020) reduced tariffs on many US agricultural and industrial exports to Japan. Japan is the 4th largest US trade partner. Japan charges 10% consumption tax (shouhizei) on imports, with customs duties varying by product category. There is no general de minimis for duties, but items under JPY 10,000 in duty may be exempted.",
    trade_info_ru:
      "Торговое соглашение США-Япония (Фаза 1, 2020) снизило тарифы на многие американские сельскохозяйственные и промышленные товары, экспортируемые в Японию. Япония, 4-й крупнейший торговый партнёр США. Япония взимает 10% налог на потребление (сёхидзэй) на импорт, таможенные пошлины варьируются по категориям товаров. Общего порога de minimis для пошлин нет, но товары с пошлиной менее 10 000 JPY могут быть освобождены.",
    tips_en:
      "FedEx and DHL offer the fastest delivery (2-3 days) but are pricier. EMS via USPS is a solid middle ground, 5-7 days at reasonable rates. Japan Post handles last-mile delivery for most carriers, so delivery is reliable. Label contents in English and Japanese if possible to speed up customs clearance.",
    tips_ru:
      "FedEx и DHL предлагают самую быструю доставку (2-3 дня), но дороже. EMS через USPS, хороший средний вариант за 5-7 дней по разумным ценам. Japan Post обрабатывает последнюю милю для большинства перевозчиков, поэтому доставка надёжная. По возможности маркируйте содержимое на английском и японском для ускорения таможенного оформления.",
    reviews: [
      { text_en: "Sent a care package to Tokyo via EMS. Arrived in 5 days and cost $45 for 2 kg. Japanese customs clearance was fast, package was delivered the day after it cleared.", text_ru: "Отправил посылку в Токио через EMS. Прибыла за 5 дней, стоимость $45 за 2 кг. Японская таможня сработала быстро, посылку доставили на следующий день после оформления.", carrier: "EMS (USPS)", days: 5 },
      { text_en: "FedEx International Priority to Osaka, 2 days door to door. Expensive at $89 for 1.5 kg but absolutely worth it for time-sensitive items.", text_ru: "FedEx International Priority в Осаку, 2 дня от двери до двери. Дорого, $89 за 1,5 кг, но абсолютно стоит того для срочных отправлений.", carrier: "FedEx", days: 2 },
    ],
  },
  {
    from: "GB",
    to: "DE",
    trade_info_en:
      "Since Brexit, UK-EU trade is governed by the UK-EU Trade and Cooperation Agreement (TCA), which provides zero tariffs and zero quotas for goods meeting rules of origin. However, customs declarations are now required. Germany charges 19% VAT on imports from the UK. The EU de minimis threshold of EUR 150 applies for duty-free entry.",
    trade_info_ru:
      "После Брексита торговля между Великобританией и ЕС регулируется Соглашением о торговле и сотрудничестве (TCA), которое обеспечивает нулевые тарифы и квоты для товаров, соответствующих правилам происхождения. Однако теперь требуются таможенные декларации. Германия взимает 19% НДС на импорт из Великобритании. Порог de minimis ЕС в 150 EUR применяется для беспошлинного ввоза.",
    tips_en:
      "Royal Mail International Tracked is the most affordable option for parcels under 2 kg (5-7 days). DHL Express and DPD offer next-day or 2-day delivery. Since Brexit, all shipments require customs forms, always include a CN23 declaration. Ensure goods qualify as UK-origin to benefit from zero-tariff TCA treatment.",
    tips_ru:
      "Royal Mail International Tracked, самый доступный вариант для посылок до 2 кг (5-7 дней). DHL Express и DPD предлагают доставку на следующий день или за 2 дня. После Брексита для всех отправлений нужны таможенные формы, всегда прикладывайте декларацию CN23. Убедитесь, что товары квалифицируются как британского происхождения для получения нулевых тарифов по TCA.",
    reviews: [
      { text_en: "DHL Express from London to Frankfurt in 1 day. Cost GBP 35 for a 1 kg parcel. Had to fill out customs forms post-Brexit but it was straightforward.", text_ru: "DHL Express из Лондона во Франкфурт за 1 день. Стоимость 35 GBP за посылку 1 кг. Пришлось заполнять таможенные формы после Брексита, но всё было просто.", carrier: "DHL", days: 1 },
      { text_en: "Royal Mail Tracked to Munich, 6 days, GBP 15 for 1.5 kg. Great value. Recipient had to pay EUR 8 import VAT on delivery.", text_ru: "Royal Mail Tracked в Мюнхен, 6 дней, 15 GBP за 1,5 кг. Отличное соотношение цены. Получателю пришлось заплатить 8 EUR НДС при доставке.", carrier: "Royal Mail", days: 6 },
    ],
  },
  {
    from: "US",
    to: "AU",
    trade_info_en:
      "The Australia-United States Free Trade Agreement (AUSFTA), in effect since 2005, eliminates tariffs on most goods traded between the two countries. Australia charges 10% GST on imported goods. Since July 2018, GST applies to all imported goods regardless of value (no de minimis for GST). Customs duty applies on goods over AUD 1,000.",
    trade_info_ru:
      "Соглашение о свободной торговле между Австралией и США (AUSFTA), действующее с 2005 года, отменяет тарифы на большинство товаров. Австралия взимает 10% GST на импортируемые товары. С июля 2018 года GST применяется ко всем импортным товарам независимо от стоимости (нет порога de minimis для GST). Таможенные пошлины применяются к товарам стоимостью выше 1000 AUD.",
    tips_en:
      "Transit times are longer due to distance, expect 7-14 days for economy and 3-5 days for express. USPS Priority Mail International offers the best value for parcels under 2 kg. DHL and FedEx are faster but significantly more expensive. AUSFTA means most US-origin goods enter duty-free, but 10% GST always applies.",
    tips_ru:
      "Сроки доставки дольше из-за расстояния, ожидайте 7-14 дней для эконом и 3-5 дней для экспресс. USPS Priority Mail International, лучший вариант по цене для посылок до 2 кг. DHL и FedEx быстрее, но значительно дороже. Благодаря AUSFTA большинство товаров американского происхождения ввозятся беспошлинно, но 10% GST применяется всегда.",
    reviews: [
      { text_en: "FedEx International Economy to Sydney, 5 days, $72 for 2 kg. Package arrived in perfect condition. Had to pay AUD 15 GST on delivery.", text_ru: "FedEx International Economy в Сидней, 5 дней, $72 за 2 кг. Посылка прибыла в идеальном состоянии. Пришлось заплатить 15 AUD GST при доставке.", carrier: "FedEx", days: 5 },
      { text_en: "USPS Priority Mail International to Melbourne took 9 days. Cost only $38 for 1 kg. Solid option if you're not in a rush.", text_ru: "USPS Priority Mail International в Мельбурн занял 9 дней. Стоимость всего $38 за 1 кг. Отличный вариант, если не спешите.", carrier: "USPS", days: 9 },
    ],
  },
  {
    from: "US",
    to: "FR",
    trade_info_en:
      "France is a top US trade partner within the EU, with bilateral goods trade exceeding $80 billion annually. No US-EU FTA exists, so EU common external tariffs apply. France charges 20% VAT (TVA) on imports. The EU de minimis threshold of EUR 150 applies for customs duties, but VAT is charged from the first euro via the IOSS system for e-commerce.",
    trade_info_ru:
      "Франция, ведущий торговый партнёр США в ЕС с двусторонним товарооборотом более $80 млрд в год. Между США и ЕС нет ЗСТ, поэтому применяются единые внешние тарифы ЕС. Франция взимает 20% НДС (TVA) на импорт. Порог de minimis ЕС в 150 EUR применяется для таможенных пошлин, но НДС начисляется с первого евро через систему IOSS для электронной коммерции.",
    tips_en:
      "La Poste handles last-mile delivery in France and is generally reliable. DHL Express offers 2-day delivery from the US. For economy shipping, USPS First Class International (10-14 days) is very affordable for items under 2 kg. French customs can be slow during holiday periods, ship early for Christmas and summer deliveries.",
    tips_ru:
      "La Poste обеспечивает доставку последней мили во Франции и в целом надёжна. DHL Express предлагает 2-дневную доставку из США. Для экономичной доставки USPS First Class International (10-14 дней) очень доступен для товаров до 2 кг. Французская таможня может работать медленно в праздничные периоды, отправляйте заранее для рождественских и летних доставок.",
    reviews: [
      { text_en: "DHL Express to Paris, 2 days exactly. Cost $58 for 1 kg. TVA was collected by DHL before delivery, so no cash on delivery hassle.", text_ru: "DHL Express в Париж, ровно 2 дня. Стоимость $58 за 1 кг. TVA был собран DHL до доставки, поэтому никаких хлопот с наложенным платежом.", carrier: "DHL", days: 2 },
      { text_en: "Sent books via USPS Media Mail International to Lyon. Took 12 days but cost just $18 for 1.5 kg. Great for non-urgent items.", text_ru: "Отправил книги через USPS Media Mail International в Лион. Заняло 12 дней, но стоило всего $18 за 1,5 кг. Отлично подходит для несрочных товаров.", carrier: "USPS", days: 12 },
    ],
  },
  {
    from: "RU",
    to: "DE",
    trade_info_en:
      "Trade between Russia and Germany has been significantly impacted by EU sanctions since 2022. Many goods are subject to export controls and trade restrictions. EU sanctions prohibit the import of numerous Russian products and restrict exports of technology and luxury goods to Russia. Standard EU customs rules apply for non-sanctioned goods, with 19% German VAT.",
    trade_info_ru:
      "Торговля между Россией и Германией значительно пострадала от санкций ЕС с 2022 года. Многие товары подпадают под экспортный контроль и торговые ограничения. Санкции ЕС запрещают импорт многих российских товаров и ограничивают экспорт технологий и предметов роскоши в Россию. Стандартные таможенные правила ЕС применяются для несанкционных товаров с 19% НДС Германии.",
    tips_en:
      "Due to sanctions, shipping options are limited. Many international carriers have suspended services to/from Russia. Russian Post (Pochta Rossii) still operates international shipments but with longer transit times (14-30 days). Check current sanctions lists carefully before shipping. Personal effects and non-sanctioned consumer goods can still be sent.",
    tips_ru:
      "Из-за санкций варианты доставки ограничены. Многие международные перевозчики приостановили услуги в/из России. Почта России по-прежнему осуществляет международные отправления, но с увеличенными сроками доставки (14-30 дней). Тщательно проверяйте действующие санкционные списки перед отправкой. Личные вещи и несанкционные потребительские товары по-прежнему можно отправлять.",
    reviews: [
      { text_en: "Sent personal items via Russian Post to relatives in Berlin. Took 18 days and cost about 2500 RUB for 3 kg. Tracking was spotty but the package arrived intact.", text_ru: "Отправил личные вещи через Почту России родственникам в Берлин. Заняло 18 дней, стоимость около 2500 руб. за 3 кг. Отслеживание было нестабильным, но посылка пришла целой.", carrier: "Russian Post", days: 18 },
      { text_en: "Used CDEK international service from Moscow to Hamburg. Took 12 days, cost about 3800 RUB for 2 kg. Better tracking than Russian Post and the package was handled well.", text_ru: "Воспользовался международной службой СДЭК из Москвы в Гамбург. Заняло 12 дней, стоимость около 3800 руб. за 2 кг. Отслеживание лучше, чем у Почты России, и посылка была обработана аккуратно.", carrier: "CDEK", days: 12 },
    ],
  },
  {
    from: "CN",
    to: "GB",
    trade_info_en:
      "China is the UK's third-largest trading partner for goods. There is no China-UK free trade agreement, so MFN tariffs apply. The UK charges 20% VAT on all imported goods, with the VAT collected at point of sale for shipments under GBP 135. For goods over GBP 135, VAT and any applicable duties are collected from the recipient.",
    trade_info_ru:
      "Китай, третий по величине торговый партнёр Великобритании по товарам. Между Китаем и Великобританией нет соглашения о свободной торговле, поэтому применяются тарифы РНБ. Великобритания взимает 20% НДС на все импортируемые товары, причём НДС собирается в точке продажи для отправлений стоимостью до 135 GBP. Для товаров свыше 135 GBP НДС и пошлины взимаются с получателя.",
    tips_en:
      "Yanwen, 4PX, and Cainiao offer budget shipping from China to the UK (10-20 days). Royal Mail handles most last-mile deliveries. For faster options, DHL eCommerce (5-8 days) is a good middle ground. Since January 2021, UK VAT is collected at checkout for orders under GBP 135 from overseas sellers.",
    tips_ru:
      "Yanwen, 4PX и Cainiao предлагают бюджетную доставку из Китая в Великобританию (10-20 дней). Royal Mail обрабатывает большинство доставок последней мили. Для более быстрых вариантов DHL eCommerce (5-8 дней), хороший средний вариант. С января 2021 года НДС Великобритании собирается при оформлении заказа для покупок до 135 GBP от зарубежных продавцов.",
    reviews: [
      { text_en: "4PX delivery from Guangzhou to Birmingham in 11 days. Cost was very low, about $8 for 0.8 kg. Tracking updated regularly. No additional charges on delivery.", text_ru: "Доставка 4PX из Гуанчжоу в Бирмингем за 11 дней. Стоимость очень низкая, около $8 за 0,8 кг. Отслеживание обновлялось регулярно. Никаких дополнительных сборов при доставке.", carrier: "4PX", days: 11 },
      { text_en: "Used DHL eCommerce for a 2 kg parcel to London. Arrived in 7 days for about $15. Much faster than the cheapest options and still very affordable.", text_ru: "Воспользовался DHL eCommerce для посылки 2 кг в Лондон. Прибыла за 7 дней примерно за $15. Намного быстрее самых дешёвых вариантов и при этом очень доступно.", carrier: "DHL eCommerce", days: 7 },
    ],
  },
  {
    from: "AE",
    to: "IN",
    trade_info_en:
      "The India-UAE Comprehensive Economic Partnership Agreement (CEPA), effective since May 2022, eliminates tariffs on over 80% of products traded between the two countries. The UAE is India's third-largest trade partner, with bilateral trade exceeding $80 billion. India charges GST of 5-28% depending on the product category, with a de minimis threshold of INR 5,000 for gifts.",
    trade_info_ru:
      "Соглашение о всеобъемлющем экономическом партнёрстве Индия-ОАЭ (CEPA), действующее с мая 2022 года, отменяет тарифы на более чем 80% товаров. ОАЭ, третий по величине торговый партнёр Индии с двусторонним товарооборотом свыше $80 млрд. Индия взимает GST 5-28% в зависимости от категории товара, с порогом de minimis 5000 INR для подарков.",
    tips_en:
      "Emirates Post and India Post offer affordable economy options (7-14 days). Aramex is a popular regional express carrier with 3-5 day delivery. The large Indian diaspora in the UAE makes this a very well-served corridor. For sending gold or jewelry, strict customs declarations are required on both sides.",
    tips_ru:
      "Emirates Post и India Post предлагают доступные эконом-варианты (7-14 дней). Aramex, популярный региональный экспресс-перевозчик с доставкой за 3-5 дней. Большая индийская диаспора в ОАЭ делает это направление очень хорошо обслуживаемым. Для отправки золота или ювелирных изделий требуются строгие таможенные декларации с обеих сторон.",
    reviews: [
      { text_en: "Aramex from Dubai to Mumbai in 4 days. Cost AED 85 for 1.5 kg. Very smooth process and good tracking throughout. Perfect for sending gifts to family.", text_ru: "Aramex из Дубая в Мумбаи за 4 дня. Стоимость 85 AED за 1,5 кг. Очень гладкий процесс и хорошее отслеживание на протяжении всего пути. Идеально для отправки подарков семье.", carrier: "Aramex", days: 4 },
      { text_en: "Used Emirates Post economy to send documents to Delhi. Took 10 days, cost only AED 35. Reliable and affordable for non-urgent items.", text_ru: "Воспользовался эконом-доставкой Emirates Post для отправки документов в Дели. Заняло 10 дней, стоимость всего 35 AED. Надёжный и доступный вариант для несрочных отправлений.", carrier: "Emirates Post", days: 10 },
    ],
  },
  {
    from: "US",
    to: "KR",
    trade_info_en:
      "The Korea-US Free Trade Agreement (KORUS), in effect since 2012, eliminates tariffs on over 95% of goods traded between the two countries. South Korea charges 10% VAT on imports. Korea's de minimis threshold is $150 for customs duties and applies to most personal imports. KORUS makes this one of the most favorable corridors for US exporters.",
    trade_info_ru:
      "Соглашение о свободной торговле Корея-США (KORUS), действующее с 2012 года, отменяет тарифы на более чем 95% товаров. Южная Корея взимает 10% НДС на импорт. Порог de minimis Кореи составляет $150 для таможенных пошлин и применяется к большинству личных импортных товаров. KORUS делает это направление одним из наиболее выгодных для американских экспортёров.",
    tips_en:
      "Korea Post handles last-mile delivery efficiently. UPS and FedEx offer 2-3 day express service. USPS Priority Mail International takes 6-10 days and is the best budget option. Thanks to KORUS, most US-origin goods enter Korea duty-free. K-Packet (via Korea Post) is excellent for returns or small parcels from Korea.",
    tips_ru:
      "Korea Post эффективно обрабатывает доставку последней мили. UPS и FedEx предлагают экспресс-доставку за 2-3 дня. USPS Priority Mail International занимает 6-10 дней и является лучшим бюджетным вариантом. Благодаря KORUS большинство товаров американского происхождения ввозятся в Корею беспошлинно. K-Packet (через Korea Post) отлично подходит для возвратов или мелких посылок из Кореи.",
    reviews: [
      { text_en: "UPS Worldwide Saver to Seoul, 3 days, $55 for 1 kg. Customs clearance was instant thanks to KORUS. No duties charged on US-made electronics.", text_ru: "UPS Worldwide Saver в Сеул, 3 дня, $55 за 1 кг. Таможенное оформление прошло мгновенно благодаря KORUS. Никаких пошлин на электронику американского производства.", carrier: "UPS", days: 3 },
      { text_en: "USPS Priority Mail International to Busan. 8 days, $32 for 1 kg. Tracking worked well and the recipient received an SMS notification for pickup.", text_ru: "USPS Priority Mail International в Пусан. 8 дней, $32 за 1 кг. Отслеживание работало хорошо, получатель получил SMS-уведомление для получения.", carrier: "USPS", days: 8 },
    ],
  },
  {
    from: "US",
    to: "BR",
    trade_info_en:
      "Brazil and the US have no free trade agreement. Brazil has some of the highest import tariffs in the world, with average rates of 11-14% and a 60% simplified tariff on international postal shipments. ICMS state tax (17-25%) and IPI federal tax also apply. Brazil's de minimis is $50 for duty exemption on shipments between individuals.",
    trade_info_ru:
      "Между Бразилией и США нет соглашения о свободной торговле. Бразилия имеет одни из самых высоких импортных тарифов в мире, средние ставки 11-14% и упрощённый тариф 60% на международные почтовые отправления. Также применяются налог ICMS (17-25%) и федеральный налог IPI. Порог de minimis Бразилии, $50 для освобождения от пошлин на отправления между физическими лицами.",
    tips_en:
      "Shipping to Brazil is notoriously expensive and slow due to high tariffs and customs delays. Expect 15-30 days for economy options. The 60% import tax on postal shipments makes costs high. Use DHL or FedEx for faster customs clearance (3-5 days). Always declare accurate values, Brazilian customs (Receita Federal) audits shipments thoroughly. Include the recipient's CPF number on the label.",
    tips_ru:
      "Доставка в Бразилию известна своей дороговизной и медлительностью из-за высоких тарифов и таможенных задержек. Ожидайте 15-30 дней для эконом-вариантов. Импортный налог 60% на почтовые отправления делает расходы высокими. Используйте DHL или FedEx для более быстрого таможенного оформления (3-5 дней). Всегда указывайте точную стоимость, бразильская таможня (Receita Federal) тщательно проверяет отправления. Укажите номер CPF получателя на этикетке.",
    reviews: [
      { text_en: "FedEx International Priority to Sao Paulo, 4 days, $95 for 1.5 kg. Fast customs clearance but the recipient paid 60% import tax plus ICMS. Total landed cost was high.", text_ru: "FedEx International Priority в Сан-Паулу, 4 дня, $95 за 1,5 кг. Быстрое таможенное оформление, но получатель заплатил 60% импортного налога плюс ICMS. Общая стоимость с учётом всех сборов была высокой.", carrier: "FedEx", days: 4 },
      { text_en: "USPS to Rio de Janeiro took 25 days and the package sat in customs for 2 weeks. Cost $42 for 1 kg but my friend paid almost the same in import taxes. Ship via courier if time matters.", text_ru: "USPS в Рио-де-Жанейро занял 25 дней, и посылка пролежала на таможне 2 недели. Стоимость $42 за 1 кг, но друг заплатил почти столько же в импортных налогах. Отправляйте курьером, если время важно.", carrier: "USPS", days: 25 },
    ],
  },
  {
    from: "CN",
    to: "JP",
    trade_info_en:
      "China and Japan are both members of the Regional Comprehensive Economic Partnership (RCEP), which entered into force in 2022 and progressively reduces tariffs between member countries. Japan is China's second-largest trade partner. Japan charges 10% consumption tax on imports, with customs duties varying by product. RCEP provides preferential tariff treatment for qualifying goods.",
    trade_info_ru:
      "Китай и Япония являются членами Регионального всеобъемлющего экономического партнёрства (RCEP), которое вступило в силу в 2022 году и постепенно снижает тарифы между странами-участницами. Япония, второй по величине торговый партнёр Китая. Япония взимает 10% налог на потребление на импорт, пошлины варьируются по товарам. RCEP обеспечивает преференциальный тарифный режим для квалифицированных товаров.",
    tips_en:
      "Due to geographic proximity, shipping is fast and affordable. EMS delivers in 3-5 days. SF Express and ZTO International offer competitive rates with 4-7 day delivery. China Post economy takes 7-14 days but is very cheap. Japan Post efficiency means last-mile delivery is always reliable. RCEP certificates of origin can reduce or eliminate duties.",
    tips_ru:
      "Благодаря географической близости доставка быстрая и доступная. EMS доставляет за 3-5 дней. SF Express и ZTO International предлагают конкурентные тарифы с доставкой за 4-7 дней. Эконом China Post занимает 7-14 дней, но очень дёшево. Эффективность Japan Post обеспечивает надёжную доставку последней мили. Сертификаты происхождения RCEP могут снизить или отменить пошлины.",
    reviews: [
      { text_en: "SF Express from Shanghai to Tokyo in 3 days. Cost CNY 120 for 1 kg. Excellent tracking and very professional service. The fastest affordable option for this route.", text_ru: "SF Express из Шанхая в Токио за 3 дня. Стоимость 120 CNY за 1 кг. Отличное отслеживание и очень профессиональный сервис. Самый быстрый доступный вариант для этого маршрута.", carrier: "SF Express", days: 3 },
      { text_en: "China Post economy to Osaka, 10 days, just CNY 35 for 0.5 kg. Can't beat the price for non-urgent items. Tracking was basic but the package arrived safely.", text_ru: "Эконом China Post в Осаку, 10 дней, всего 35 CNY за 0,5 кг. Цену для несрочных отправлений не превзойти. Отслеживание базовое, но посылка пришла в целости.", carrier: "China Post", days: 10 },
    ],
  },
  {
    from: "TR",
    to: "DE",
    trade_info_en:
      "Turkey and the EU have a Customs Union agreement (since 1996) covering industrial goods, which means most manufactured products can be traded without customs duties. However, agricultural products and services are not covered. Germany charges 19% VAT on imports. The Customs Union significantly reduces trade barriers for Turkish industrial exports to the EU.",
    trade_info_ru:
      "Турция и ЕС имеют соглашение о Таможенном союзе (с 1996 года), охватывающее промышленные товары, что означает, что большинство промышленных товаров могут продаваться без таможенных пошлин. Однако сельскохозяйственная продукция и услуги не охвачены. Германия взимает 19% НДС на импорт. Таможенный союз значительно снижает торговые барьеры для турецкого промышленного экспорта в ЕС.",
    tips_en:
      "PTT (Turkish Post) offers affordable economy shipping (7-14 days). Yurtici Kargo has international services with good regional coverage. DHL Express provides 2-3 day delivery. Industrial goods benefit from duty-free treatment under the Customs Union. The large Turkish diaspora in Germany makes this a heavily used corridor with many shipping options.",
    tips_ru:
      "PTT (Турецкая почта) предлагает доступную эконом-доставку (7-14 дней). Yurtici Kargo имеет международные услуги с хорошим региональным покрытием. DHL Express обеспечивает доставку за 2-3 дня. Промышленные товары пользуются беспошлинным режимом по Таможенному союзу. Большая турецкая диаспора в Германии делает это направление активно используемым с множеством вариантов доставки.",
    reviews: [
      { text_en: "DHL Express from Istanbul to Berlin in 2 days. Cost TRY 850 for 2 kg. Fast and reliable as always. German customs cleared it within hours.", text_ru: "DHL Express из Стамбула в Берлин за 2 дня. Стоимость 850 TRY за 2 кг. Быстро и надёжно, как всегда. Немецкая таможня оформила за несколько часов.", carrier: "DHL", days: 2 },
      { text_en: "PTT to Munich, 9 days, TRY 180 for 1 kg. Very affordable. Tracking stopped after Turkey but Deutsche Post picked it up and delivered on time.", text_ru: "PTT в Мюнхен, 9 дней, 180 TRY за 1 кг. Очень доступно. Отслеживание прекратилось после Турции, но Deutsche Post подхватила и доставила вовремя.", carrier: "PTT", days: 9 },
    ],
  },
];

export function getCorridorContent(
  from: string,
  to: string
): CorridorContent | undefined {
  return corridors.find(
    (c) => c.from === from && c.to === to
  );
}
