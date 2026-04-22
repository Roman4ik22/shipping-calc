import { Metadata } from "next";
import { t, locales, pickLocalized } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import Link from "next/link";

type UpdateEntry = {
  date: string;
  tags: string[];
  [key: string]: unknown;
};

const updates: UpdateEntry[] = [
  {
    date: "2026-04-07",
    title_en: "Humanized all content",
    title_ru: "Улучшение текстов",
    desc_en:
      "Removed 1,133 AI writing patterns across all pages. Content now reads more naturally.",
    desc_ru:
      "Удалено 1,133 AI-паттернов из всех текстов. Контент теперь читается естественнее.",
    tags: ["content"],
    title_es: "Todo el contenido humanizado",
    desc_es: "Se han eliminado 1.133 patrones de escritura de IA en todas las páginas. El contenido se lee ahora de forma más natural.",
    title_de: "Gesamter Inhalt vermenschlicht",
    desc_de: "1.133 KI-typische Schreibmuster auf allen Seiten entfernt. Die Inhalte lesen sich jetzt natürlicher.",
    title_fr: "Humanisation de tous les contenus",
    desc_fr: "Suppression de 1 133 tournures typiques de l'IA sur l'ensemble des pages. Les contenus se lisent désormais de manière plus naturelle.",
    title_pt: "Todo o conteúdo humanizado",
    desc_pt: "Removidos 1.133 padrões de escrita de IA em todas as páginas. O conteúdo lê-se agora de forma mais natural.",
    title_zh: "全站内容人性化改写",
    desc_zh: "移除全站 1,133 处 AI 写作痕迹，内容阅读更自然。",
    title_ja: "全コンテンツの自然化",
    desc_ja: "全ページから1,133件のAI的な文章パターンを削除しました。コンテンツがより自然に読めるようになりました。",
    title_ko: "전체 콘텐츠 자연어 개선",
    desc_ko: "모든 페이지에서 AI 글쓰기 패턴 1,133건을 제거했습니다. 이제 콘텐츠가 더 자연스럽게 읽힙니다.",
    title_ar: "أنسنة جميع المحتوى",
    desc_ar: "إزالة 1,133 نمطًا من أنماط الكتابة المُنتَجة بالذكاء الاصطناعي عبر جميع الصفحات. أصبح المحتوى يُقرأ بصورة أكثر طبيعية.",
    title_tr: "Tüm içerik doğallaştırıldı",
    desc_tr: "Tüm sayfalardaki 1,133 yapay zekâ yazım kalıbı kaldırıldı. İçerik artık daha doğal okunuyor.",
    title_it: "Contenuti resi più naturali",
    desc_it: "Rimossi 1.133 pattern di scrittura tipici dell'IA in tutte le pagine. I contenuti ora risultano più naturali alla lettura.",
  },
  {
    date: "2026-04-06",
    title_en: "SEO audit fixes",
    title_ru: "Исправления SEO",
    desc_en:
      "Fixed soft 404s, added OG images, RSS feed, proper robots.txt. Sitemap now includes all trust pages.",
    desc_ru:
      "Исправлены soft 404, добавлены OG-изображения, RSS-лента, правильный robots.txt.",
    tags: ["seo", "technical"],
    title_es: "Correcciones de auditoría SEO",
    desc_es: "Se han corregido los soft 404, añadido imágenes OG, feed RSS y un robots.txt adecuado. El sitemap ahora incluye todas las páginas de confianza.",
    title_de: "SEO-Audit-Korrekturen",
    desc_de: "Soft-404-Fehler behoben, OG-Bilder, RSS-Feed und korrekte robots.txt ergänzt. Die Sitemap umfasst nun alle Trust-Seiten.",
    title_fr: "Corrections de l'audit SEO",
    desc_fr: "Correction des soft 404, ajout des images OG, du flux RSS et d'un robots.txt conforme. Le sitemap inclut désormais toutes les pages de confiance.",
    title_pt: "Correcções da auditoria SEO",
    desc_pt: "Corrigidos soft 404s, adicionadas imagens OG, feed RSS, robots.txt adequado. O sitemap inclui agora todas as páginas de confiança.",
    title_zh: "SEO 审计修复",
    desc_zh: "修复软 404，添加 OG 图片、RSS 订阅及规范的 robots.txt。站点地图现已涵盖全部信任页面。",
    title_ja: "SEO監査の修正",
    desc_ja: "ソフト404の修正、OG画像、RSSフィード、適切なrobots.txtを追加しました。サイトマップにすべての信頼ページが含まれるようになりました。",
    title_ko: "SEO 감사 수정",
    desc_ko: "소프트 404 오류를 수정하고, OG 이미지, RSS 피드, 올바른 robots.txt를 추가했습니다. 사이트맵에 모든 신뢰 페이지가 포함됩니다.",
    title_ar: "إصلاحات تدقيق تحسين محركات البحث (SEO)",
    desc_ar: "تم إصلاح صفحات الخطأ الوهمية (soft 404) وإضافة صور OG وخلاصة RSS وملف robots.txt مناسب. باتت خريطة الموقع تشمل جميع صفحات الثقة.",
    title_tr: "SEO denetim düzeltmeleri",
    desc_tr: "Soft 404 hataları giderildi, OG görselleri, RSS akışı ve düzgün bir robots.txt eklendi. Site haritası artık tüm güven sayfalarını kapsıyor.",
    title_it: "Correzioni dell'audit SEO",
    desc_it: "Risolti i soft 404, aggiunte immagini OG, feed RSS e un robots.txt corretto. La sitemap ora include tutte le pagine di trust.",
  },
  {
    date: "2026-04-05",
    title_en: "Nova Poshta style redesign",
    title_ru: "Редизайн в стиле Новой Почты",
    desc_en:
      "Card-based layout with rounded corners, blue accent CTA buttons, improved mobile contrast.",
    desc_ru:
      "Карточный дизайн с закруглёнными углами, синие CTA-кнопки, улучшенный контраст на мобильных.",
    tags: ["design"],
    title_es: "Rediseño al estilo Nova Poshta",
    desc_es: "Diseño basado en tarjetas con esquinas redondeadas, botones CTA con acento azul y contraste mejorado en móvil.",
    title_de: "Redesign im Nova-Poshta-Stil",
    desc_de: "Kartenbasiertes Layout mit abgerundeten Ecken, blau akzentuierten CTA-Schaltflächen und verbessertem Kontrast auf Mobilgeräten.",
    title_fr: "Refonte au style Nova Poshta",
    desc_fr: "Mise en page en cartes avec coins arrondis, boutons d'action accentués en bleu, contraste mobile amélioré.",
    title_pt: "Redesenho ao estilo Nova Poshta",
    desc_pt: "Disposição baseada em cartões com cantos arredondados, botões CTA com acento azul e contraste melhorado no ecrã móvel.",
    title_zh: "Nova Poshta 风格改版",
    desc_zh: "采用圆角卡片式布局，蓝色强调的 CTA 按钮，并优化了移动端对比度。",
    title_ja: "Nova Poshta風のデザイン刷新",
    desc_ja: "角丸のカード型レイアウト、青色アクセントのCTAボタン、モバイル表示のコントラスト改善を実施しました。",
    title_ko: "Nova Poshta 스타일 리디자인",
    desc_ko: "둥근 모서리의 카드 기반 레이아웃, 파란색 강조 CTA 버튼, 모바일 대비 개선을 적용했습니다.",
    title_ar: "إعادة تصميم بأسلوب Nova Poshta",
    desc_ar: "تخطيط مبني على البطاقات بزوايا دائرية، وأزرار دعوة للإجراء (CTA) بلون أزرق مميز، وتحسين التباين على الأجهزة المحمولة.",
    title_tr: "Nova Poshta tarzı yeniden tasarım",
    desc_tr: "Yuvarlatılmış köşeli kart tabanlı düzen, mavi vurgulu CTA düğmeleri ve mobilde iyileştirilmiş kontrast.",
    title_it: "Redesign in stile Nova Poshta",
    desc_it: "Layout a schede con angoli arrotondati, pulsanti CTA con accento blu e contrasto mobile migliorato.",
  },
  {
    date: "2026-04-04",
    title_en: "213 countries with detailed customs data",
    title_ru: "213 стран с детальными таможенными данными",
    desc_en:
      "Every country now has hand-crafted duty rates (8 categories), de minimis thresholds, VAT rates, customs authority URLs, and honest clearance process descriptions.",
    desc_ru:
      "Каждая страна теперь имеет ручные ставки пошлин (8 категорий), де минимис, НДС, URL таможенных органов.",
    tags: ["data", "customs"],
    title_es: "213 países con datos aduaneros detallados",
    desc_es: "Cada país dispone ahora de tasas arancelarias elaboradas a mano (8 categorías), umbrales de minimis, tipos de IVA, URL de las autoridades aduaneras y descripciones honestas del proceso de despacho.",
    title_de: "213 Länder mit detaillierten Zolldaten",
    desc_de: "Jedes Land verfügt nun über handgepflegte Zollsätze (8 Kategorien), De-minimis-Grenzwerte, Mehrwertsteuersätze, URLs der Zollbehörden und ehrliche Beschreibungen des Abfertigungsprozesses.",
    title_fr: "213 pays avec des données douanières détaillées",
    desc_fr: "Chaque pays dispose désormais de droits de douane rédigés à la main (8 catégories), de seuils de minimis, de taux de TVA, des URL des autorités douanières et de descriptions honnêtes du processus de dédouanement.",
    title_pt: "213 países com dados aduaneiros detalhados",
    desc_pt: "Cada país tem agora taxas alfandegárias elaboradas manualmente (8 categorias), limites de minimis, taxas de IVA, URLs das autoridades aduaneiras e descrições honestas do processo de desalfandegamento.",
    title_zh: "213 个国家的详细清关数据",
    desc_zh: "每个国家均配有人工整理的关税税率（8 大品类）、起征免税额、增值税税率、海关官方网址，以及真实客观的清关流程说明。",
    title_ja: "213カ国の詳細な通関データ",
    desc_ja: "すべての国に、手作業で作成した関税率(8カテゴリー)、デミニミス基準額、VAT税率、税関当局のURL、そして正直な通関プロセスの説明を用意しました。",
    title_ko: "213개국 상세 관세 데이터",
    desc_ko: "모든 국가에 대해 수작업으로 정리한 관세율(8개 카테고리), 면세 기준(de minimis), 부가가치세율, 관세청 URL, 그리고 솔직한 통관 절차 설명을 제공합니다.",
    title_ar: "213 دولة ببيانات جمركية تفصيلية",
    desc_ar: "لكل دولة الآن معدلات رسوم جمركية مُعدَّة يدويًا (8 فئات)، وحدود الإعفاء (de minimis)، ومعدلات ضريبة القيمة المضافة، وروابط سلطات الجمارك، ووصف صادق لإجراءات التخليص.",
    title_tr: "Ayrıntılı gümrük verileriyle 213 ülke",
    desc_tr: "Her ülke için artık elle hazırlanmış gümrük oranları (8 kategori), de minimis eşikleri, KDV oranları, gümrük idaresi URL'leri ve dürüst gümrükleme süreci açıklamaları mevcut.",
    title_it: "213 paesi con dati doganali dettagliati",
    desc_it: "Ogni paese dispone ora di aliquote doganali curate a mano (8 categorie), soglie de minimis, aliquote IVA, URL delle autorità doganali e descrizioni oneste dei processi di sdoganamento.",
  },
  {
    date: "2026-04-03",
    title_en: "Complete i18n: 12 languages × 243 keys",
    title_ru: "Полная локализация: 12 языков × 243 ключа",
    desc_en:
      "All UI phrases translated to English, Russian, Spanish, German, French, Portuguese, Chinese, Japanese, Korean, Arabic, Turkish, Italian.",
    desc_ru: "Все фразы интерфейса переведены на 12 языков.",
    tags: ["i18n"],
    title_es: "i18n completo: 12 idiomas × 243 claves",
    desc_es: "Todas las frases de la interfaz traducidas a inglés, ruso, español, alemán, francés, portugués, chino, japonés, coreano, árabe, turco e italiano.",
    title_de: "Vollständige i18n: 12 Sprachen × 243 Schlüssel",
    desc_de: "Alle UI-Texte übersetzt in Englisch, Russisch, Spanisch, Deutsch, Französisch, Portugiesisch, Chinesisch, Japanisch, Koreanisch, Arabisch, Türkisch und Italienisch.",
    title_fr: "i18n complète : 12 langues × 243 clés",
    desc_fr: "Toutes les phrases de l'interface traduites en anglais, russe, espagnol, allemand, français, portugais, chinois, japonais, coréen, arabe, turc et italien.",
    title_pt: "i18n completo: 12 idiomas × 243 chaves",
    desc_pt: "Todas as frases da interface traduzidas para inglês, russo, espanhol, alemão, francês, português, chinês, japonês, coreano, árabe, turco e italiano.",
    title_zh: "完整国际化：12 种语言 × 243 条词条",
    desc_zh: "全部 UI 文案已翻译为英语、俄语、西班牙语、德语、法语、葡萄牙语、中文、日语、韩语、阿拉伯语、土耳其语、意大利语。",
    title_ja: "完全な多言語対応：12言語 × 243キー",
    desc_ja: "すべてのUI表現を英語、ロシア語、スペイン語、ドイツ語、フランス語、ポルトガル語、中国語、日本語、韓国語、アラビア語、トルコ語、イタリア語に翻訳しました。",
    title_ko: "완전한 다국어화: 12개 언어 × 243개 키",
    desc_ko: "모든 UI 문구를 영어, 러시아어, 스페인어, 독일어, 프랑스어, 포르투갈어, 중국어, 일본어, 한국어, 아랍어, 터키어, 이탈리아어로 번역했습니다.",
    title_ar: "تعريب كامل: 12 لغة × 243 مفتاحًا",
    desc_ar: "تمت ترجمة جميع عبارات واجهة المستخدم إلى الإنجليزية والروسية والإسبانية والألمانية والفرنسية والبرتغالية والصينية واليابانية والكورية والعربية والتركية والإيطالية.",
    title_tr: "Eksiksiz i18n: 12 dil × 243 anahtar",
    desc_tr: "Tüm arayüz ifadeleri İngilizce, Rusça, İspanyolca, Almanca, Fransızca, Portekizce, Çince, Japonca, Korece, Arapça, Türkçe ve İtalyanca'ya çevrildi.",
    title_it: "i18n completa: 12 lingue × 243 chiavi",
    desc_it: "Tutte le frasi dell'interfaccia tradotte in inglese, russo, spagnolo, tedesco, francese, portoghese, cinese, giapponese, coreano, arabo, turco e italiano.",
  },
  {
    date: "2026-04-03",
    title_en: "Smart locale routing",
    title_ru: "Умная маршрутизация языков",
    desc_en:
      "Pages now exist only in relevant languages. BR→PL only in Portuguese and English, not Japanese. Reduced from 14K to 6.3K pages.",
    desc_ru:
      "Страницы существуют только на релевантных языках. BR→PL только на pt и en.",
    tags: ["seo", "technical"],
    title_es: "Enrutamiento inteligente por idioma",
    desc_es: "Las páginas existen ahora solo en los idiomas relevantes. BR→PL solo en portugués e inglés, no en japonés. Reducción de 14K a 6,3K páginas.",
    title_de: "Intelligentes Locale-Routing",
    desc_de: "Seiten existieren jetzt nur noch in relevanten Sprachen. BR→PL nur auf Portugiesisch und Englisch, nicht auf Japanisch. Reduzierung von 14K auf 6,3K Seiten.",
    title_fr: "Routage intelligent par langue",
    desc_fr: "Les pages n'existent désormais que dans les langues pertinentes. BR→PL uniquement en portugais et en anglais, pas en japonais. Réduction de 14 000 à 6 300 pages.",
    title_pt: "Encaminhamento inteligente por idioma",
    desc_pt: "As páginas existem agora apenas nos idiomas relevantes. BR→PL apenas em português e inglês, não em japonês. Redução de 14 mil para 6,3 mil páginas.",
    title_zh: "智能语言路由",
    desc_zh: "页面现仅在相关语言下生成。BR→PL 仅以葡萄牙语和英语提供，不再生成日语版本。页面总数从 14K 缩减至 6.3K。",
    title_ja: "スマートなロケールルーティング",
    desc_ja: "ページは関連する言語でのみ提供されます。BR→PLはポルトガル語と英語のみで、日本語では提供されません。ページ数を14Kから6.3Kに削減しました。",
    title_ko: "스마트 로케일 라우팅",
    desc_ko: "이제 페이지가 관련 언어로만 존재합니다. BR→PL은 포르투갈어와 영어로만 제공되며, 일본어로는 제공되지 않습니다. 전체 페이지 수를 14K에서 6.3K로 줄였습니다.",
    title_ar: "توجيه ذكي حسب اللغة",
    desc_ar: "أصبحت الصفحات متاحة فقط باللغات ذات الصلة. مسار BR→PL متاح بالبرتغالية والإنجليزية فقط، وليس باليابانية. تقليص العدد من 14K إلى 6.3K صفحة.",
    title_tr: "Akıllı yerel rota yönlendirme",
    desc_tr: "Sayfalar artık yalnızca ilgili dillerde mevcut. BR→PL yalnızca Portekizce ve İngilizce'de, Japonca'da değil. Sayfa sayısı 14K'dan 6.3K'ya düşürüldü.",
    title_it: "Routing intelligente per lingua",
    desc_it: "Le pagine ora esistono solo nelle lingue pertinenti. BR→PL solo in portoghese e inglese, non in giapponese. Ridotte da 14K a 6,3K pagine.",
  },
  {
    date: "2026-04-02",
    title_en: "Standalone customs & tools pages",
    title_ru: "Отдельные страницы таможни и инструментов",
    desc_en:
      "New /customs/{country} pages for all 213 countries. Standalone duty calculator and delivery estimator at /tools/.",
    desc_ru:
      "Новые страницы /customs/{country} для 213 стран. Калькулятор пошлин и сроков на /tools/.",
    tags: ["feature"],
    title_es: "Páginas independientes de aduanas y herramientas",
    desc_es: "Nuevas páginas /customs/{country} para los 213 países. Calculadora de aranceles y estimador de entrega independientes en /tools/.",
    title_de: "Eigenständige Zoll- und Tool-Seiten",
    desc_de: "Neue Seiten /customs/{country} für alle 213 Länder. Eigenständiger Zollrechner und Lieferzeit-Schätzer unter /tools/.",
    title_fr: "Pages autonomes pour les douanes et les outils",
    desc_fr: "Nouvelles pages /customs/{country} pour les 213 pays. Calculateur de droits et estimateur de délais autonomes sur /tools/.",
    title_pt: "Páginas autónomas de alfândega e ferramentas",
    desc_pt: "Novas páginas /customs/{country} para os 213 países. Calculadora autónoma de taxas alfandegárias e estimador de entregas em /tools/.",
    title_zh: "独立的清关与工具页面",
    desc_zh: "新增 /customs/{country} 页面，覆盖全部 213 个国家。在 /tools/ 下提供独立的关税计算器和到货时效估算器。",
    title_ja: "独立した通関・ツールページ",
    desc_ja: "213カ国すべてに対応した新しい/customs/{country}ページを追加しました。/tools/には独立した関税計算ツールと配送日数推定ツールがあります。",
    title_ko: "독립형 통관 및 도구 페이지",
    desc_ko: "213개 전 국가에 대해 새로운 /customs/{country} 페이지를 추가했습니다. /tools/ 경로에서 독립형 관세 계산기와 배송 예상 도구를 제공합니다.",
    title_ar: "صفحات مستقلة للجمارك والأدوات",
    desc_ar: "صفحات جديدة /customs/{country} لجميع الدول الـ213. حاسبة رسوم جمركية مستقلة ومقدِّر لوقت التسليم على /tools/.",
    title_tr: "Bağımsız gümrük ve araç sayfaları",
    desc_tr: "213 ülkenin tamamı için yeni /customs/{country} sayfaları. /tools/ adresinde bağımsız gümrük vergisi hesaplayıcı ve teslimat süresi tahmincisi.",
    title_it: "Pagine dedicate dogane e strumenti",
    desc_it: "Nuove pagine /customs/{country} per tutti i 213 paesi. Calcolatore dei dazi e stima dei tempi di consegna autonomi su /tools/.",
  },
  {
    date: "2026-04-01",
    title_en: "Priority-based URL submission system",
    title_ru: "Система приоритетной подачи URL",
    desc_en:
      "Google Indexing API + IndexNow integration. 280 URLs submitted to Google, 5000 to Bing/Yandex. Gradual sitemap based on page priority.",
    desc_ru:
      "Google Indexing API + IndexNow. 280 URL в Google, 5000 в Bing/Yandex.",
    tags: ["seo"],
    title_es: "Sistema de envío de URL basado en prioridades",
    desc_es: "Integración con Google Indexing API + IndexNow. 280 URL enviadas a Google y 5000 a Bing/Yandex. Sitemap gradual según la prioridad de la página.",
    title_de: "Prioritätsbasiertes URL-Einreichungssystem",
    desc_de: "Integration von Google Indexing API + IndexNow. 280 URLs an Google übermittelt, 5000 an Bing/Yandex. Schrittweise Sitemap basierend auf Seitenpriorität.",
    title_fr: "Système de soumission d'URL par priorité",
    desc_fr: "Intégration de Google Indexing API + IndexNow. 280 URL soumises à Google, 5000 à Bing/Yandex. Sitemap progressif selon la priorité des pages.",
    title_pt: "Sistema de submissão de URLs por prioridade",
    desc_pt: "Integração com Google Indexing API + IndexNow. 280 URLs submetidos ao Google, 5000 ao Bing/Yandex. Sitemap gradual baseado na prioridade das páginas.",
    title_zh: "基于优先级的 URL 提交系统",
    desc_zh: "接入 Google Indexing API 与 IndexNow。已向 Google 提交 280 条 URL，向 Bing/Yandex 提交 5000 条。按页面优先级渐进式生成站点地图。",
    title_ja: "優先度ベースのURL送信システム",
    desc_ja: "Google Indexing API + IndexNowと統合しました。Googleに280件のURL、Bing/Yandexに5000件を送信します。ページの優先度に基づいた段階的なサイトマップです。",
    title_ko: "우선순위 기반 URL 제출 시스템",
    desc_ko: "Google Indexing API 및 IndexNow 연동. Google에 280개 URL, Bing/Yandex에 5000개 URL을 제출했습니다. 페이지 우선순위에 기반한 점진적 사이트맵을 적용합니다.",
    title_ar: "نظام إرسال الروابط حسب الأولوية",
    desc_ar: "تكامل مع Google Indexing API و IndexNow. تم إرسال 280 رابطًا إلى Google، و5000 إلى Bing/Yandex. خريطة موقع تدريجية وفق أولوية كل صفحة.",
    title_tr: "Önceliğe dayalı URL gönderim sistemi",
    desc_tr: "Google Indexing API + IndexNow entegrasyonu. Google'a 280 URL, Bing/Yandex'e 5000 URL gönderildi. Sayfa önceliğine göre kademeli site haritası.",
    title_it: "Sistema di invio URL basato sulla priorità",
    desc_it: "Integrazione con Google Indexing API e IndexNow. 280 URL inviati a Google, 5000 a Bing/Yandex. Sitemap graduale basata sulla priorità delle pagine.",
  },
  {
    date: "2026-03-31",
    title_en: "Real carrier rates: 54 carriers verified",
    title_ru: "Реальные тарифы: 54 перевозчика проверены",
    desc_en:
      "Updated rates from official sources: Royal Mail, Japan Post, Australia Post, USPS, Deutsche Post, Colissimo, Korea Post, China Post, SF Express, and 45 more.",
    desc_ru:
      "Обновлены тарифы из официальных источников: Royal Mail, Japan Post, Australia Post и ещё 45.",
    tags: ["data", "rates"],
    title_es: "Tarifas reales de transportistas: 54 transportistas verificados",
    desc_es: "Tarifas actualizadas desde fuentes oficiales: Royal Mail, Japan Post, Australia Post, USPS, Deutsche Post, Colissimo, Korea Post, China Post, SF Express y 45 más.",
    title_de: "Reale Carrier-Tarife: 54 Anbieter verifiziert",
    desc_de: "Aktualisierte Tarife aus offiziellen Quellen: Royal Mail, Japan Post, Australia Post, USPS, Deutsche Post, Colissimo, Korea Post, China Post, SF Express und 45 weitere.",
    title_fr: "Tarifs transporteurs réels : 54 transporteurs vérifiés",
    desc_fr: "Tarifs mis à jour à partir des sources officielles : Royal Mail, Japan Post, Australia Post, USPS, Deutsche Post, Colissimo, Korea Post, China Post, SF Express et 45 autres.",
    title_pt: "Tarifas reais de transportadoras: 54 transportadoras verificadas",
    desc_pt: "Tarifas actualizadas a partir de fontes oficiais: Royal Mail, Japan Post, Australia Post, USPS, Deutsche Post, Colissimo, Korea Post, China Post, SF Express e mais 45.",
    title_zh: "真实承运商费率：已核验 54 家",
    desc_zh: "依据官方来源更新费率：Royal Mail、Japan Post、Australia Post、USPS、Deutsche Post、Colissimo、Korea Post、China Post、SF Express 等共 54 家。",
    title_ja: "実際のキャリア料金：54社を検証済み",
    desc_ja: "公式情報源から料金を更新しました：Royal Mail、Japan Post、Australia Post、USPS、Deutsche Post、Colissimo、Korea Post、China Post、SF Express、その他45社です。",
    title_ko: "실제 운송사 요금: 54개 운송사 검증 완료",
    desc_ko: "공식 자료를 기반으로 요금을 업데이트했습니다: Royal Mail, Japan Post, Australia Post, USPS, Deutsche Post, Colissimo, Korea Post, China Post, SF Express 외 45개사.",
    title_ar: "أسعار ناقلين حقيقية: التحقق من 54 ناقلًا",
    desc_ar: "تحديث الأسعار من مصادر رسمية: Royal Mail وJapan Post وAustralia Post وUSPS وDeutsche Post وColissimo وKorea Post وChina Post وSF Express و45 ناقلًا آخر.",
    title_tr: "Gerçek taşıyıcı tarifeleri: 54 taşıyıcı doğrulandı",
    desc_tr: "Resmi kaynaklardan güncellenen tarifeler: Royal Mail, Japan Post, Australia Post, USPS, Deutsche Post, Colissimo, Korea Post, China Post, SF Express ve 45 taşıyıcı daha.",
    title_it: "Tariffe reali dei corrieri: 54 corrieri verificati",
    desc_it: "Tariffe aggiornate da fonti ufficiali: Royal Mail, Japan Post, Australia Post, USPS, Deutsche Post, Colissimo, Korea Post, China Post, SF Express e altri 45.",
  },
  {
    date: "2026-03-28",
    title_en: "Apple minimalist redesign",
    title_ru: "Минималистичный редизайн",
    desc_en:
      "Complete visual overhaul: pure black background, Inter font, large typography, opacity-based interactions, no card borders.",
    desc_ru:
      "Полная визуальная переработка: чёрный фон, шрифт Inter, крупная типографика.",
    tags: ["design"],
    title_es: "Rediseño minimalista al estilo Apple",
    desc_es: "Renovación visual completa: fondo negro puro, tipografía Inter, tipografía grande, interacciones basadas en opacidad y sin bordes en las tarjetas.",
    title_de: "Minimalistisches Redesign im Apple-Stil",
    desc_de: "Komplette visuelle Überarbeitung: reinschwarzer Hintergrund, Inter-Schriftart, große Typografie, deckkraftbasierte Interaktionen, keine Kartenränder.",
    title_fr: "Refonte minimaliste inspirée d'Apple",
    desc_fr: "Refonte visuelle complète : fond noir pur, police Inter, typographie de grande taille, interactions par opacité, cartes sans bordure.",
    title_pt: "Redesenho minimalista ao estilo Apple",
    desc_pt: "Revisão visual completa: fundo preto puro, tipo de letra Inter, tipografia grande, interacções baseadas em opacidade, sem contornos nos cartões.",
    title_zh: "Apple 极简风格改版",
    desc_zh: "整体视觉焕新：纯黑背景、Inter 字体、大号字号、基于不透明度的交互效果、去除卡片边框。",
    title_ja: "Apple風ミニマリストデザインへの刷新",
    desc_ja: "ビジュアルを全面刷新：純粋な黒の背景、Interフォント、大きなタイポグラフィ、不透明度ベースのインタラクション、カード枠線なし。",
    title_ko: "Apple 미니멀리스트 리디자인",
    desc_ko: "완전한 비주얼 개편: 순수 검정 배경, Inter 폰트, 큰 타이포그래피, 투명도 기반 인터랙션, 카드 테두리 제거.",
    title_ar: "إعادة تصميم بسيطة بأسلوب Apple",
    desc_ar: "تجديد بصري شامل: خلفية سوداء خالصة، وخط Inter، وطباعة بحجم كبير، وتفاعلات قائمة على الشفافية، بلا حدود للبطاقات.",
    title_tr: "Apple minimalist yeniden tasarım",
    desc_tr: "Kapsamlı görsel yenileme: saf siyah arka plan, Inter yazı tipi, büyük tipografi, opaklık tabanlı etkileşimler, kart kenarlıksız.",
    title_it: "Redesign minimalista in stile Apple",
    desc_it: "Rinnovamento visivo completo: sfondo nero puro, font Inter, tipografia di grandi dimensioni, interazioni basate sull'opacità e nessun bordo sulle schede.",
  },
  {
    date: "2026-03-25",
    title_en: "Dark theme + Trustpilot reviews",
    title_ru: "Тёмная тема + отзывы Trustpilot",
    desc_en:
      "Dark theme with accent blue. Trustpilot ratings for 30+ carriers displayed on rate cards and carrier pages.",
    desc_ru:
      "Тёмная тема с синим акцентом. Рейтинги Trustpilot для 30+ перевозчиков.",
    tags: ["design", "data"],
    title_es: "Tema oscuro + reseñas de Trustpilot",
    desc_es: "Tema oscuro con acento azul. Valoraciones de Trustpilot para más de 30 transportistas mostradas en las tarjetas de tarifas y en las páginas de transportistas.",
    title_de: "Dark Theme + Trustpilot-Bewertungen",
    desc_de: "Dark Theme mit blauem Akzent. Trustpilot-Bewertungen für 30+ Carrier auf Tarifkarten und Carrier-Seiten eingeblendet.",
    title_fr: "Thème sombre + avis Trustpilot",
    desc_fr: "Thème sombre avec accent bleu. Notes Trustpilot pour plus de 30 transporteurs affichées sur les cartes de tarifs et les pages transporteurs.",
    title_pt: "Tema escuro + avaliações Trustpilot",
    desc_pt: "Tema escuro com azul de acento. Classificações do Trustpilot para mais de 30 transportadoras apresentadas nos cartões de tarifas e nas páginas de transportadoras.",
    title_zh: "深色主题 + Trustpilot 评分",
    desc_zh: "采用蓝色点缀的深色主题。30 余家承运商的 Trustpilot 评分已展示在费率卡片与承运商页面上。",
    title_ja: "ダークテーマ + Trustpilotレビュー",
    desc_ja: "青をアクセントにしたダークテーマです。30社以上のキャリアのTrustpilot評価を料金カードとキャリアページに表示します。",
    title_ko: "다크 테마 + Trustpilot 리뷰",
    desc_ko: "파란색 강조를 적용한 다크 테마. 30개 이상 운송사에 대한 Trustpilot 평점을 요금 카드와 운송사 페이지에 표시합니다.",
    title_ar: "الوضع الداكن + تقييمات Trustpilot",
    desc_ar: "وضع داكن بلون أزرق مميز. تقييمات Trustpilot لأكثر من 30 ناقلًا تُعرض على بطاقات الأسعار وصفحات الناقلين.",
    title_tr: "Koyu tema + Trustpilot yorumları",
    desc_tr: "Mavi vurgulu koyu tema. 30+ taşıyıcı için Trustpilot puanları tarife kartlarında ve taşıyıcı sayfalarında görüntüleniyor.",
    title_it: "Tema scuro + recensioni Trustpilot",
    desc_it: "Tema scuro con accento blu. Valutazioni Trustpilot per oltre 30 corrieri mostrate sulle schede tariffarie e sulle pagine dei corrieri.",
  },
  {
    date: "2026-03-20",
    title_en: "Launch: 145+ carriers, 213 countries, 12 languages",
    title_ru: "Запуск: 145+ перевозчика, 213 стран, 12 языков",
    desc_en:
      "RateShips launched with rate comparison across 145+ carriers, customs data for 213 countries, and full localization in 12 languages.",
    desc_ru:
      "RateShips запущен: сравнение тарифов 145+ перевозчиков, таможенные данные 213 стран, 12 языков.",
    tags: ["launch"],
    title_es: "Lanzamiento: más de 145 transportistas, 213 países y 12 idiomas",
    desc_es: "RateShips se ha lanzado con comparación de tarifas entre más de 145 transportistas, datos aduaneros de 213 países y localización completa en 12 idiomas.",
    title_de: "Launch: 145+ Carrier, 213 Länder, 12 Sprachen",
    desc_de: "RateShips gestartet mit Tarifvergleich über 145+ Carrier, Zolldaten für 213 Länder und vollständiger Lokalisierung in 12 Sprachen.",
    title_fr: "Lancement : 145+ transporteurs, 213 pays, 12 langues",
    desc_fr: "RateShips a été lancé avec la comparaison de tarifs sur plus de 145 transporteurs, des données douanières pour 213 pays et une localisation complète en 12 langues.",
    title_pt: "Lançamento: mais de 145 transportadoras, 213 países, 12 idiomas",
    desc_pt: "O RateShips foi lançado com comparação de tarifas em mais de 145 transportadoras, dados aduaneiros para 213 países e localização completa em 12 idiomas.",
    title_zh: "上线：145+ 承运商、213 个国家、12 种语言",
    desc_zh: "RateShips 正式上线，可在 145+ 家承运商之间比价，覆盖 213 个国家的清关数据，并提供 12 种语言的完整本地化。",
    title_ja: "ローンチ：145社以上のキャリア、213カ国、12言語",
    desc_ja: "RateShipsがローンチしました。145社以上のキャリアにわたる料金比較、213カ国の通関データ、12言語による完全なローカライゼーションを提供します。",
    title_ko: "출시: 145개 이상 운송사, 213개국, 12개 언어",
    desc_ko: "RateShips가 145개 이상 운송사 요금 비교, 213개국 관세 데이터, 12개 언어 완전 현지화와 함께 출시되었습니다.",
    title_ar: "الإطلاق: أكثر من 145 ناقلًا، و213 دولة، و12 لغة",
    desc_ar: "انطلقت RateShips بمقارنة أسعار عبر أكثر من 145 ناقلًا، وبيانات جمركية لـ213 دولة، وتوطين كامل بـ12 لغة.",
    title_tr: "Lansman: 145+ taşıyıcı, 213 ülke, 12 dil",
    desc_tr: "RateShips; 145+ taşıyıcı arasında tarife karşılaştırması, 213 ülke için gümrük verileri ve 12 dilde tam yerelleştirme ile yayına alındı.",
    title_it: "Lancio: oltre 145 corrieri, 213 paesi, 12 lingue",
    desc_it: "RateShips è stato lanciato con il confronto tariffario tra più di 145 corrieri, dati doganali per 213 paesi e localizzazione completa in 12 lingue.",
  },
];

const tagColors: Record<string, string> = {
  data: "bg-green-900/50 text-green-400",
  seo: "bg-blue-900/50 text-blue-400",
  design: "bg-purple-900/50 text-purple-400",
  technical: "bg-gray-700/50 text-body",
  feature: "bg-amber-900/50 text-amber-400",
  i18n: "bg-teal-900/50 text-teal-400",
  launch: "bg-red-900/50 text-red-400",
  content: "bg-orange-900/50 text-orange-400",
  rates: "bg-emerald-900/50 text-emerald-400",
  customs: "bg-yellow-900/50 text-yellow-400",
};

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
    title: t(loc, "updates_title"),
    description: t(loc, "updates_description"),
    robots: { index: false, follow: true },
    alternates: {
      canonical: `/${locale}/updates`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}/updates`])),
        "x-default": "/en/updates",
      },
    },
  };
}

export default async function UpdatesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;
  const breadcrumbSchema = {
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
        name: t(loc, "updates"),
        item: `https://rateships.com/${locale}/updates`,
      },
    ],
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: t(loc, "updates_title"),
    description: t(loc, "updates_description"),
    url: `https://rateships.com/${locale}/updates`,
    inLanguage: locale,
    isPartOf: {
      "@type": "WebSite",
      name: "RateShips",
      url: "https://rateships.com",
    },
    dateModified: updates[0]?.date,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbSchema, webPageSchema]),
        }}
      />

      <section style={{ padding: "72px 32px 48px", borderBottom: "1px solid var(--line)", position: "relative" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(800px 400px at 40% -10%, rgba(232,92,58,.06), transparent 60%)" }} />
        <div style={{ position: "relative", maxWidth: 1240, margin: "0 auto" }}>
          <nav style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>
            <Link href={`/${locale}`} style={{ color: "var(--muted)", textDecoration: "none" }}>{t(loc, "home")}</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "var(--ink)" }}>{t(loc, "updates")}</span>
          </nav>
          <h1 style={{ margin: "0 0 18px", fontSize: "clamp(40px,5vw,64px)", lineHeight: 1.02, letterSpacing: "-.03em", fontWeight: 800, color: "var(--ink)" }}>
            {t(loc, "updates_title")}
          </h1>
          <p style={{ fontSize: 19, color: "var(--body)", maxWidth: 720, margin: 0 }}>
            {t(loc, "updates_subtitle")}
          </p>
        </div>
      </section>

      <section style={{ padding: "48px 32px 96px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {updates.map((entry, i) => (
              <article key={i} style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 16, padding: "22px 26px", display: "flex", flexDirection: "row", gap: 20, alignItems: "flex-start" }}>
                <div style={{ width: 110, flexShrink: 0 }}>
                  <time dateTime={entry.date} style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", fontVariantNumeric: "tabular-nums" }}>
                    {new Date(entry.date + "T00:00:00").toLocaleDateString(locale, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h2 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700, color: "var(--ink)", letterSpacing: "-.01em" }}>
                    {pickLocalized(entry, "title", loc)}
                  </h2>
                  <p style={{ margin: "0 0 12px", fontSize: 14, color: "var(--body)", lineHeight: 1.55 }}>
                    {pickLocalized(entry, "desc", loc)}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${tagColors[tag] || "bg-line text-body"}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
