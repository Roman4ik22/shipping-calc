import { Metadata } from "next";
import { carriers, getCarrierById, getCarrierDescription, getPopularCountries, getCountryName, makeCorridorSlug } from "@/lib/data";
import { getCarrierReview } from "@/lib/reviews";
import { CountUp, HeroH1, StaggerWords } from "@/components/HeroMotion";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { countryFlag } from "@/lib/flags";
import { getCarrierLocales, isCarrierLocaleValid } from "@/lib/carrier-locales";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamicParams = true;

export function generateStaticParams() {
  const params: { locale: string; carrier: string }[] = [];
  const topIds = new Set(["dhl-express","fedex","ups","ems","usps","royal-mail","japan-post","dpd","aramex","sf-express"]);
  for (const c of carriers) {
    if (!topIds.has(c.id)) continue;
    for (const locale of getCarrierLocales(c.id, c.type)) {
      params.push({ locale, carrier: c.id });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; carrier: string }>;
}): Promise<Metadata> {
  const { locale, carrier: carrierId } = await params;
  const carrier = getCarrierById(carrierId);
  if (!carrier) return { title: "Not Found" };

  const loc = locale as Locale;
  const desc = getCarrierDescription(carrier, loc);
  const review = getCarrierReview(carrier.id);
  const serviceCount = carrier.services.length;
  const ratingStr = review ? ` ★ ${review.trustpilot.rating.toFixed(1)}` : "";
  const year = new Date().getFullYear();

  // Title pattern matches real search intents (verified via GSC):
  //   "{carrier} tracking" / "{carrier} rates" / "{carrier} delivery time"
  // Putting brand FIRST captures branded queries (highest CTR potential).
  const titleSuffix =
    loc === "ru"
      ? `отслеживание, тарифы и сроки (${year})`
      : loc === "de"
        ? `Sendungsverfolgung, Tarife & Lieferzeiten (${year})`
        : loc === "es"
          ? `seguimiento, tarifas y plazos (${year})`
          : loc === "fr"
            ? `suivi, tarifs et délais (${year})`
            : loc === "pt"
              ? `rastreio, tarifas e prazos (${year})`
              : loc === "it"
                ? `tracking, tariffe e tempi (${year})`
                : loc === "tr"
                  ? `takip, tarifeler ve teslimat (${year})`
                  : loc === "ar"
                    ? `التتبع، الأسعار وأوقات التسليم (${year})`
                    : loc === "zh"
                      ? `物流跟踪、运费与时效（${year}）`
                      : loc === "ja"
                        ? `追跡、料金、配達日数（${year}）`
                        : loc === "ko"
                          ? `배송조회, 요금 및 배송기간 (${year})`
                          : `tracking, rates & delivery times (${year})`;

  const title = `${carrier.name} ${titleSuffix}${ratingStr}`;

  // Description: combine carrier description + key facts in benefit terms
  const descSuffix =
    loc === "ru"
      ? `Сравните ${serviceCount} услуг, сроки доставки и реальные цены.`
      : loc === "de"
        ? `Vergleichen Sie ${serviceCount} Services, Lieferzeiten und echte Preise.`
        : `Compare ${serviceCount} services, delivery times, and live rates.`;

  const description = `${desc} ${descSuffix}`;

  // Smart locale: if this locale isn't relevant for the carrier, point canonical
  // to /en/ and mark as noindex. We render the page (no redirect) so Googlebot
  // doesn't see "Page with redirect" — Google reads the canonical and consolidates.
  const carrierLocales = getCarrierLocales(carrierId, carrier.type);
  const isLocaleRelevant = isCarrierLocaleValid(carrierId, loc, carrier.type);
  const canonicalPath = isLocaleRelevant
    ? `/${locale}/carriers/${carrierId}`
    : `/en/carriers/${carrierId}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        ...Object.fromEntries(
          carrierLocales.map((l) => [l, `/${l}/carriers/${carrierId}`])
        ),
        "x-default": `/en/carriers/${carrierId}`,
      },
    },
    robots: isLocaleRelevant ? undefined : { index: false, follow: true },
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function CarrierPage({
  params,
}: {
  params: Promise<{ locale: string; carrier: string }>;
}) {
  const { locale, carrier: carrierId } = await params;
  const loc = locale as Locale;
  const carrier = getCarrierById(carrierId);

  if (!carrier) {
    notFound();
  }
  // No redirect for irrelevant locales — see generateMetadata above. Page
  // renders normally; Google deindexes the duplicate locale via canonical+noindex.

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
            <Link href={`/${locale}/carriers`} className="hover:text-accent-light">
              {t(loc, "carriers_page")}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink">{carrier.name}</span>
          </nav>

          <div className="flex items-start gap-4 mb-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-ink">
                <StaggerWords text={carrier.name} />
              </h1>
              <span
                className={`inline-block mt-2 px-3 py-1 text-sm rounded-full ${
                  carrier.type === "international"
                    ? "bg-purple-500/20 text-purple-400"
                    : carrier.type === "postal"
                    ? "bg-orange-500/20 text-orange-400"
                    : "bg-teal-500/20 text-teal-400"
                }`}
              >
                {carrier.type}
              </span>
            </div>
          </div>

          <p className="text-body text-lg mb-6 max-w-2xl">
            {getCarrierDescription(carrier, loc)}
          </p>

          {/* Trustpilot Review */}
          {(() => {
            const review = getCarrierReview(carrierId);
            if (!review) return null;
            const { rating, reviews, url } = review.trustpilot;
            const ratingColor = rating >= 3.5 ? "text-green-400" :
              rating >= 2.5 ? "text-yellow-400" :
              rating >= 1.5 ? "text-orange-400" : "text-red-400";
            const barWidth = (rating / 5) * 100;
            return (
              <div className="mb-6 p-4 bg-white rounded-lg" style={{border:'1px solid var(--line)', boxShadow:'var(--shadow-sm)'}}>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-body">Trustpilot</span>
                    <span className={`text-lg font-bold ${ratingColor}`}>
                      ★ <CountUp to={rating} decimals={1} duration={1.2} />
                    </span>
                    <span className="text-sm text-muted">/ 5.0</span>
                  </div>
                  <div className="flex-1 min-w-[120px] max-w-[200px]">
                    <div className="h-2 bg-dark-600 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${rating >= 3.5 ? "bg-green-500" : rating >= 2.5 ? "bg-yellow-500" : rating >= 1.5 ? "bg-orange-500" : "bg-red-500"}`} style={{ width: `${barWidth}%` }} />
                    </div>
                  </div>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-accent-light hover:text-ink transition-colors card-hover"
                  >
                    {t(loc, "trustpilot_reviews", { count: reviews >= 1000 ? `${(reviews / 1000).toFixed(1)}K` : reviews })}
                  </a>
                </div>
              </div>
            );
          })()}

          <div className="flex gap-4">
            <a
              href={carrier.website}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-accent text-white btn-press rounded-lg text-sm hover:bg-accent-dark transition-colors card-hover"
            >
              {t(loc, "official_website")}
            </a>
          </div>
        </div>
      </section>

    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <h2 className="text-xl font-bold text-ink mb-4">
        {t(loc, "available_services")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {carrier.services.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-lg p-5"
            style={{border:'1px solid var(--line)', boxShadow:'var(--shadow-sm)'}}
          >
            <h3 className="font-semibold text-ink mb-2">
              {service.name}
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-body">
                  {t(loc, "delivery_time")}:
                </span>
                <p className="font-medium">
                  {service.speed_days_min}–{service.speed_days_max}{" "}
                  {t(loc, "days")}
                </p>
              </div>
              <div>
                <span className="text-body">
                  {t(loc, "max_weight")}:
                </span>
                <p className="font-medium">{service.max_weight_kg} {t(loc, "kg")}</p>
              </div>
              <div>
                <span className="text-body">{t(loc, "tracking")}:</span>
                <p className="font-medium">
                  {service.tracking ? t(loc, "yes") : t(loc, "no")}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Popular corridors for this carrier */}
      <h2 className="text-xl font-bold text-ink mb-4">
        {t(loc, "popular_routes_carrier", { carrier: carrier.name })}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {(() => {
          const popular = getPopularCountries().slice(0, 10);
          const corridors: { from: typeof popular[0]; to: typeof popular[0] }[] = [];
          for (let i = 0; i < popular.length && corridors.length < 9; i++) {
            for (let j = 0; j < popular.length && corridors.length < 9; j++) {
              if (i !== j) corridors.push({ from: popular[i], to: popular[j] });
            }
          }
          return corridors.map(({ from, to }) => (
            <Link
              key={`${from.code}-${to.code}`}
              href={`/${locale}/shipping/${makeCorridorSlug(from, to, loc)}`}
              className="block bg-surface border border-line rounded-lg p-3 hover:border-accent/50 transition-all text-sm"
            >
              {countryFlag(from.code)} {getCountryName(from, loc)} → {getCountryName(to, loc)} {countryFlag(to.code)}
            </Link>
          ));
        })()}
      </div>

      {/* Shipping guides */}
      <h2 className="text-xl font-bold text-ink mb-4">
        {t(loc, "guides_heading")}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-8">
        {getPopularCountries().slice(0, 8).map((c) => (
          <Link
            key={c.code}
            href={`/${locale}/guide/${c.slug_en}`}
            className="text-sm text-accent-light hover:text-ink py-1"
          >
            {countryFlag(c.code)} {getCountryName(c, loc)}
          </Link>
        ))}
      </div>

      {/* BreadcrumbList JSON-LD */}
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
                item: `${"https://rateships.com"}/${locale}`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: t(loc, "carriers_page"),
                item: `${"https://rateships.com"}/${locale}/carriers`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: carrier.name,
              },
            ],
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: `${carrier.name} — ${t(loc, "shipping")}`,
            description: getCarrierDescription(carrier, loc),
            url: `https://rateships.com/${locale}/carriers/${carrierId}`,
            inLanguage: locale,
            isPartOf: { "@type": "WebSite", name: "RateShips", url: "https://rateships.com" },
            dateModified: new Date().toISOString().split("T")[0],
            mainEntity: {
              "@type": "Organization",
              name: carrier.name,
              url: carrier.website,
              description: getCarrierDescription(carrier, loc),
              ...(getCarrierReview(carrierId) ? {
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: getCarrierReview(carrierId)!.trustpilot.rating,
                  reviewCount: getCarrierReview(carrierId)!.trustpilot.reviews,
                  bestRating: 5,
                  worstRating: 1,
                  itemReviewed: { "@type": "Organization", name: carrier.name },
                },
              } : {}),
              makesOffer: carrier.services.slice(0, 10).map((s) => ({
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: s.name,
                  serviceType: "Parcel Shipping",
                  provider: { "@type": "Organization", name: carrier.name },
                  areaServed: "Worldwide",
                  ...(s.speed_days_min ? {
                    description: `${s.speed_days_min}–${s.speed_days_max} ${t(loc, "days")}, ${t(loc, "max_weight")} ${s.max_weight_kg}${t(loc, "kg")}`,
                  } : {}),
                },
              })),
            },
          }),
        }}
      />

      {/* Back to carriers */}
      <Link
        href={`/${locale}/carriers`}
        className="text-accent-light hover:text-ink text-sm"
      >
        ← {t(loc, "all_carriers")}
      </Link>
    </div>
    </div>
  );
}
