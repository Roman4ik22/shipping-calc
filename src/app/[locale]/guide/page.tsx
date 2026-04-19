import { Metadata } from "next";
import { countries, getCountryName, getPopularCountries } from "@/lib/data";
import { t, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { countryFlag } from "@/lib/flags";
import Link from "next/link";
import ExpandableGrid from "@/components/ExpandableGrid";

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
    title: t(loc, "guides_title"),
    description: t(loc, "guides_desc"),
    alternates: {
      canonical: `/${locale}/guide`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}/guide`])),
        "x-default": "/en/guide",
      },
    },
  };
}

export default async function GuidesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;
  const popular = getPopularCountries();

  // Group countries by continent
  const continents = new Map<string, typeof countries>();
  for (const c of countries) {
    const list = continents.get(c.continent) || [];
    list.push(c);
    continents.set(c.continent, list);
  }

  const continentIcons: Record<string, string> = {
    Africa: '\u{1F30D}',
    Asia: '\u{1F30F}',
    Europe: '\u{1F30D}',
    'North America': '\u{1F30E}',
    'South America': '\u{1F30E}',
    Oceania: '\u{1F30F}',
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ borderBottom: '1px solid var(--line)' }}>
        <div aria-hidden className="absolute inset-0 z-0" style={{
          backgroundImage: `
            radial-gradient(800px 400px at 20% 0%, rgba(26,115,232,.06), transparent 60%),
            radial-gradient(600px 300px at 80% 60%, rgba(242,201,76,.05), transparent 60%),
            linear-gradient(var(--line-2) 1px, transparent 1px),
            linear-gradient(90deg, var(--line-2) 1px, transparent 1px)`,
          backgroundSize: 'auto, auto, 56px 56px, 56px 56px',
          maskImage: 'linear-gradient(180deg, #000 50%, transparent 100%)'
        }} />

        {/* Floating compass icon */}
        <div aria-hidden className="hero-shape-a absolute hidden md:block" style={{
          top: '12%', right: '7%', width: 70, height: 70, borderRadius: 999,
          background: '#fff', border: '2px solid var(--line)',
          display: 'grid', placeItems: 'center', opacity: 0.9,
          boxShadow: '0 14px 30px -8px rgba(15,23,42,.08)'
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#1A73E8" strokeWidth="1.4" width="32" height="32">
            <circle cx="12" cy="12" r="9" />
            <polygon points="12,4 14,10 12,12 10,10" fill="rgba(26,115,232,.2)" stroke="none" />
            <polygon points="12,20 10,14 12,12 14,14" fill="rgba(26,115,232,.35)" stroke="none" />
            <path d="M12 3v1M12 20v1M3 12h1M20 12h1" />
            <path d="M14 10l-2 2-2-2 2-6 2 6z" strokeLinejoin="round" />
            <path d="M10 14l2-2 2 2-2 6-2-6z" strokeLinejoin="round" />
          </svg>
        </div>
        {/* Floating flag icon */}
        <div aria-hidden className="hero-shape-b absolute hidden md:block" style={{
          bottom: '22%', right: '18%', width: 48, height: 48, borderRadius: 12,
          background: '#fff', border: '2px solid var(--line)',
          display: 'grid', placeItems: 'center', opacity: 0.8,
          boxShadow: '0 8px 20px -4px rgba(15,23,42,.06)'
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#1A73E8" strokeWidth="1.4" width="22" height="22">
            <path d="M4 22V4" /><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V4s-1 1-4 1-5-2-8-2-4 1-4 1" fill="rgba(26,115,232,.1)" />
          </svg>
        </div>
        {/* Accent circle */}
        <div aria-hidden className="hero-shape-c absolute hidden lg:block" style={{
          top: '45%', right: '30%', width: 24, height: 24, borderRadius: 999,
          background: 'var(--accent)', opacity: 0.35,
          boxShadow: '0 8px 16px -4px rgba(242,201,76,.3)'
        }} />

        <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-8 pt-16 pb-14">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px',
            borderRadius: 999, background: '#fff', border: '1px solid var(--line)',
            fontSize: 12, fontWeight: 600, marginBottom: 20, boxShadow: 'var(--shadow-sm)'
          }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--good)', boxShadow: '0 0 0 3px rgba(17,138,84,.15)' }} className="pulse-dot" />
            {countries.length} countries covered
          </div>
          <h1 style={{
            margin: '0 0 18px', fontSize: 'clamp(40px, 5vw, 64px)',
            lineHeight: 1.02, letterSpacing: '-.03em', fontWeight: 800, color: 'var(--ink)'
          }}>
            Shipping guides for<br />
            <span style={{ color: 'var(--blue)' }}>every destination</span>.
          </h1>
          <p style={{ fontSize: 19, color: 'var(--body)', lineHeight: 1.55, maxWidth: 560 }}>
            Customs rules, carrier options, and delivery times for {countries.length} countries — all in one place.
          </p>

          {/* Quick continent stats */}
          <div className="flex gap-8 mt-8 flex-wrap" style={{ fontSize: 14 }}>
            {[...continents.entries()].slice(0, 4).map(([continent, list]) => (
              <div key={continent} className="flex items-center gap-2">
                <span style={{
                  width: 8, height: 8, borderRadius: 999,
                  background: continent === 'Europe' ? 'var(--blue)' : continent === 'Asia' ? 'var(--accent)' : continent === 'Africa' ? 'var(--warm)' : '#8B5CF6'
                }} />
                <span style={{ fontWeight: 700, color: 'var(--ink)' }}>{list.length}</span>
                <span style={{ color: 'var(--muted)' }}>{continent}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-[1240px] mx-auto px-4 sm:px-8 py-12">

        {/* Popular countries — featured cards */}
        <section className="mb-16 fade-in">
          <div className="flex items-center gap-3 mb-6">
            <span style={{ width: 10, height: 10, borderRadius: 999, background: 'var(--blue)' }} />
            <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: '-.01em' }}>
              {t(loc, "popular_guides")}
            </h2>
            <span style={{ fontSize: 14, color: 'var(--muted)', fontWeight: 500 }}>Top 12</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 stagger-children">
            {popular.slice(0, 12).map((c) => (
              <Link
                key={c.code}
                href={`/${locale}/guide/${c.slug_en}`}
                prefetch={false}
                className="card-hover group"
                style={{
                  display: 'flex', flexDirection: 'column', gap: 8, padding: '18px 20px',
                  background: '#fff', borderRadius: 14, border: '1px solid var(--line)',
                  textDecoration: 'none', color: 'inherit',
                  transition: 'all .25s ease-out'
                }}
              >
                <span style={{ fontSize: 32 }}>{countryFlag(c.code)}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2, color: 'var(--ink)' }}>
                    {getCountryName(c, loc)}
                  </div>
                  <span style={{
                    fontSize: 10, padding: '1px 6px', borderRadius: 4,
                    background: 'var(--bg)', color: 'var(--muted)', border: '1px solid var(--line-2)'
                  }}>
                    {c.continent}
                  </span>
                </div>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="14" height="14"
                  style={{ color: 'var(--line)', marginTop: 'auto', transition: 'color .2s' }}
                  className="group-hover:stroke-[var(--blue)]"
                ><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </Link>
            ))}
          </div>
        </section>

        {/* All countries by continent */}
        {[...continents.entries()]
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([continent, list]) => {
            const sorted = list.sort((a, b) =>
              getCountryName(a, loc).localeCompare(getCountryName(b, loc))
            );
            const icon = continentIcons[continent] || '\u{1F30D}';
            return (
              <section key={continent} className="mb-14 fade-in">
                <div className="flex items-center gap-3 mb-5">
                  <span style={{ fontSize: 20 }}>{icon}</span>
                  <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, letterSpacing: '-.01em', color: 'var(--ink)' }}>
                    {continent}
                  </h2>
                  <span style={{
                    fontSize: 11, padding: '2px 8px', borderRadius: 6,
                    background: 'var(--bg)', color: 'var(--muted)', fontWeight: 600,
                    border: '1px solid var(--line-2)'
                  }}>
                    {sorted.length}
                  </span>
                </div>

                <ExpandableGrid
                  visibleCount={18}
                  showMoreLabel={t(loc, "show_all")}
                  showLessLabel={t(loc, "show_less")}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 stagger-children"
                >
                  {sorted.map((c) => (
                    <Link
                      key={c.code}
                      href={`/${locale}/guide/${c.slug_en}`}
                      prefetch={false}
                      className="card-hover"
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
                        borderRadius: 10, border: '1px solid transparent',
                        textDecoration: 'none', color: 'var(--body)', fontSize: 13,
                        transition: 'all .2s ease-out'
                      }}
                      onMouseEnter={undefined}
                    >
                      <span style={{ fontSize: 20 }}>{countryFlag(c.code)}</span>
                      <span>{getCountryName(c, loc)}</span>
                    </Link>
                  ))}
                </ExpandableGrid>
              </section>
            );
          })}

        {/* Bottom CTA */}
        <div className="fade-in" style={{
          padding: '32px', background: 'var(--ink)', borderRadius: 20, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20
        }}>
          <div>
            <h3 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 700 }}>Ready to compare rates?</h3>
            <p style={{ margin: 0, fontSize: 15, color: 'rgba(255,255,255,.65)' }}>
              Pick a destination above or jump straight to the calculator to compare {countries.length} shipping routes.
            </p>
          </div>
          <Link href={`/${locale}`} className="btn-press" style={{
            padding: '14px 24px', borderRadius: 12, background: 'var(--warm)', color: 'var(--ink)',
            fontWeight: 700, fontSize: 15, display: 'inline-flex', alignItems: 'center', gap: 8,
            textDecoration: 'none'
          }}>
            Compare rates
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="16" height="16"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </Link>
        </div>

        {/* Data disclaimer */}
        <div className="fade-in" style={{
          marginTop: 16, padding: '16px 20px', borderRadius: 12, border: '1px solid var(--line)',
          display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--muted)'
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="14" height="14" style={{ color: 'var(--blue)', flexShrink: 0 }}>
            <path d="M12 2l8 3v7c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V5l8-3z"/><path d="M9 12l2 2 4-4"/>
          </svg>
          Country guides based on official customs data and carrier coverage. Updated regularly.
          <Link href={`/${locale}/data-methodology`} style={{ color: 'var(--blue)', fontWeight: 600, marginLeft: 'auto', whiteSpace: 'nowrap' }}>Methodology &rarr;</Link>
        </div>
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
                name: t(loc, "guides_heading"),
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
            "@type": "CollectionPage",
            name: t(loc, "guides_title"),
            description: t(loc, "guides_desc"),
            url: `https://rateships.com/${locale}/guide`,
            inLanguage: locale,
            isPartOf: { "@type": "WebSite", name: "RateShips", url: "https://rateships.com" },
            dateModified: "2026-04-03",
          }),
        }}
      />
    </div>
  );
}
