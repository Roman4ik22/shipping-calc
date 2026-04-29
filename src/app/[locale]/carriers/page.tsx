import { Metadata } from "next";
import { carriers, getCarrierDescription } from "@/lib/data";
import { t, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { StaggerGrid, StaggerItem, GlowCTA, MagneticCTA } from "@/components/HeroMotion";
import { CarrierTypePill } from "@/components/CarrierTypeIcon";
import Link from "next/link";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  return {
    title: t(loc, "carriers_page"),
    description: t(loc, "site_description"),
    alternates: {
      canonical: `/${locale}/carriers`,
      languages: { ...Object.fromEntries(locales.map((l) => [l, `/${l}/carriers`])), "x-default": "/en/carriers" },
    },
  };
}

const CARRIER_BRANDS: Record<string, { bg: string; fg: string; letters: string; website?: string }> = {
  "dhl-express": { bg: "#FFCC00", fg: "#D40511", letters: "DHL", website: "dhl.com" },
  "fedex": { bg: "#4D148C", fg: "#FF6600", letters: "FDX", website: "fedex.com" },
  "ups": { bg: "#351C15", fg: "#FFB500", letters: "UPS", website: "ups.com" },
  "tnt-fedex": { bg: "#FF6600", fg: "#FFF", letters: "TNT", website: "tnt.com" },
  "ems": { bg: "#0F3C8A", fg: "#FFD400", letters: "EMS" },
  "aramex": { bg: "#E32219", fg: "#FFF", letters: "ARX", website: "aramex.com" },
  "sf-express": { bg: "#000", fg: "#FFF", letters: "SF", website: "sf-express.com" },
  "usps": { bg: "#333E6B", fg: "#FFF", letters: "USPS", website: "usps.com" },
  "royal-mail": { bg: "#E2001A", fg: "#FFF", letters: "RM", website: "royalmail.com" },
  "dpd": { bg: "#DC0032", fg: "#FFF", letters: "DPD", website: "dpd.com" },
  "japan-post": { bg: "#CC0000", fg: "#FFF", letters: "JP", website: "post.japanpost.jp" },
  "australia-post": { bg: "#E3001B", fg: "#FFF", letters: "AP", website: "auspost.com.au" },
  "canada-post": { bg: "#E31937", fg: "#FFF", letters: "CA", website: "canadapost.ca" },
  "china-post": { bg: "#006633", fg: "#FFF", letters: "CP" },
  "india-post": { bg: "#FF0000", fg: "#FFF", letters: "IN", website: "indiapost.gov.in" },
  "deutsche-post-dhl-paket": { bg: "#FFCC00", fg: "#333", letters: "DP", website: "deutschepost.de" },
  "gls": { bg: "#FFC600", fg: "#003087", letters: "GLS", website: "gls-group.eu" },
  "postnl": { bg: "#FF6600", fg: "#FFF", letters: "PNL", website: "postnl.nl" },
  "delhivery": { bg: "#2B45D4", fg: "#FFF", letters: "DEL", website: "delhivery.com" },
  "cainiao": { bg: "#FF6A00", fg: "#FFF", letters: "CN", website: "global.cainiao.com" },
  "cdek": { bg: "#00923E", fg: "#FFF", letters: "CDK", website: "cdek.ru" },
  "ninja-van": { bg: "#C41515", fg: "#FFF", letters: "NV", website: "ninjavan.co" },
  "jt-express": { bg: "#E31E24", fg: "#FFF", letters: "J&T", website: "jtexpress.com" },
  "pochta-rossii": { bg: "#005BAC", fg: "#FFF", letters: "ПР", website: "pochta.ru" },
  "correos-spain": { bg: "#FFCC00", fg: "#003DA5", letters: "COR", website: "correos.es" },
  "correios-brazil": { bg: "#009639", fg: "#FFD700", letters: "CRB", website: "correios.com.br" },
  "korea-post": { bg: "#E31E24", fg: "#FFF", letters: "KR", website: "koreapost.go.kr" },
  "singpost": { bg: "#E31937", fg: "#FFF", letters: "SG", website: "singpost.com" },
  "evri": { bg: "#7B2D8E", fg: "#FFF", letters: "EVR", website: "evri.com" },
  "colissimo": { bg: "#003DA5", fg: "#FFD700", letters: "COL", website: "colissimo.fr" },
  "swiss-post": { bg: "#E2001A", fg: "#FFF", letters: "CH", website: "post.ch" },
  "blue-dart-dhl-group": { bg: "#003DA5", fg: "#FFF", letters: "BD", website: "bluedart.com" },
  "yanwen-express": { bg: "#005BAC", fg: "#FFF", letters: "YW", website: "yanwen.com" },
};

function getBrand(id: string) {
  return CARRIER_BRANDS[id] || { bg: "#6B7280", fg: "#FFF", letters: id.slice(0, 3).toUpperCase() };
}

// Decorative shapes unique to carriers page — package boxes
function CarriersDecor() {
  return (
    <>
      {/* Floating package box */}
      <div aria-hidden className="hero-shape-a absolute hidden md:block" style={{
        top: '15%', right: '6%', width: 70, height: 70, borderRadius: 16,
        background: '#fff', border: '2px solid var(--line)',
        display: 'grid', placeItems: 'center', opacity: 0.9,
        boxShadow: '0 14px 30px -8px rgba(15,23,42,.08)'
      }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="#1A73E8" strokeWidth="1.4" width="32" height="32">
          <path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>
        </svg>
      </div>
      {/* Floating globe */}
      <div aria-hidden className="hero-shape-b absolute hidden md:block" style={{
        bottom: '20%', right: '16%', width: 50, height: 50, borderRadius: 999,
        background: 'var(--blue-50)', border: '2px solid var(--blue-100)',
        display: 'grid', placeItems: 'center', opacity: 0.8
      }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="#1A73E8" strokeWidth="1.4" width="24" height="24">
          <circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/>
        </svg>
      </div>
      {/* Small accent square */}
      <div aria-hidden className="hero-shape-c absolute hidden lg:block" style={{
        top: '40%', right: '28%', width: 28, height: 28, borderRadius: 8,
        background: 'var(--warm)', opacity: 0.5, transform: 'rotate(15deg)',
        boxShadow: '0 8px 16px -4px rgba(242,201,76,.3)'
      }} />
    </>
  );
}

export default async function CarriersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc = locale as Locale;

  const groups = [
    { key: 'international', list: carriers.filter(c => c.type === "international") },
    { key: 'regional', list: carriers.filter(c => c.type === "regional") },
    { key: 'postal', list: carriers.filter(c => c.type === "postal") },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ borderBottom: '1px solid var(--line)' }}>
        <div aria-hidden className="absolute inset-0 z-0" style={{
          backgroundImage: `
            radial-gradient(800px 400px at 80% 0%, rgba(26,115,232,.06), transparent 60%),
            radial-gradient(600px 300px at 10% 60%, rgba(242,201,76,.06), transparent 60%),
            linear-gradient(var(--line-2) 1px, transparent 1px),
            linear-gradient(90deg, var(--line-2) 1px, transparent 1px)`,
          backgroundSize: 'auto, auto, 56px 56px, 56px 56px',
          maskImage: 'linear-gradient(180deg, #000 50%, transparent 100%)'
        }} />
        <CarriersDecor />

        <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-8 pt-16 pb-14">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 999, background: '#fff', border: '1px solid var(--line)', fontSize: 12, fontWeight: 600, marginBottom: 20, boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--good)', boxShadow: '0 0 0 3px rgba(17,138,84,.15)' }} className="pulse-dot" />
            {t(loc, "carriers_tracked_weekly", { count: carriers.length })}
          </div>
          <h1 style={{ margin: '0 0 18px', fontSize: 'clamp(40px, 5vw, 64px)', lineHeight: 1.02, letterSpacing: '-.03em', fontWeight: 800, color: 'var(--ink)' }}>
            {t(loc, "carriers_hero_compare")} <span style={{ color: 'var(--blue)' }}>{t(loc, "carriers_hero_every_carrier")}</span>,<br />
            {t(loc, "carriers_hero_one_search")}
          </h1>
          <p style={{ fontSize: 19, color: 'var(--body)', lineHeight: 1.55, maxWidth: 560 }}>
            {t(loc, "carriers_hero_subtitle", { count: carriers.length })}
          </p>

          {/* Quick stats */}
          <div className="flex gap-8 mt-8 flex-wrap" style={{ fontSize: 14 }}>
            {groups.map(g => (
              <div key={g.key} className="flex items-center gap-2">
                <span style={{
                  width: 8, height: 8, borderRadius: 999,
                  background: g.key === 'international' ? 'var(--blue)' : g.key === 'regional' ? 'var(--accent)' : 'var(--warm)'
                }} />
                <span style={{ fontWeight: 700, color: 'var(--ink)' }}>{g.list.length}</span>
                <span style={{ color: 'var(--muted)' }}>{t(loc, `carrier_type_${g.key}`)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Carrier groups */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8 py-12">
        {groups.map((group) => {
          const color = group.key === 'international' ? 'var(--blue)' : group.key === 'regional' ? 'var(--accent)' : 'var(--warm)';
          const featured = group.list.slice(0, group.key === 'international' ? 4 : 6);
          const rest = group.list.slice(group.key === 'international' ? 4 : 6);

          return (
          <section key={group.key} className="mb-16 fade-in">
            <div className="flex items-center gap-3 mb-6">
              <span style={{ width: 10, height: 10, borderRadius: 999, background: color }} />
              <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: '-.01em' }}>
                {t(loc, `carrier_group_${group.key}`)}
              </h2>
              <span style={{ fontSize: 14, color: 'var(--muted)', fontWeight: 500 }}>{group.list.length}</span>
            </div>

            {/* Featured — large cards */}
            <StaggerGrid
              className={`grid gap-4 mb-4 ${group.key === 'international' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}
              staggerDelay={0.06}
            >
              {featured.map((c) => {
                const brand = getBrand(c.id);
                const desc = getCarrierDescription(c, loc);
                return (
                  <StaggerItem key={c.id}>
                  <Link href={`/${locale}/carriers/${c.id}`} prefetch={false}
                    className="card-hover"
                    style={{
                      display: 'flex', flexDirection: 'column', gap: 14, padding: '24px',
                      background: '#fff', borderRadius: 16, border: '1px solid var(--line)',
                      textDecoration: 'none', color: 'inherit', transition: 'all .25s ease-out',
                      height: '100%',
                    }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                        background: brand.bg, color: brand.fg,
                        display: 'grid', placeItems: 'center',
                        boxShadow: '0 4px 12px -4px rgba(0,0,0,.15)',
                      }}>
                        <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: '.02em' }}>{brand.letters}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div style={{ fontWeight: 700, fontSize: 17 }}>{c.name}</div>
                        <CarrierTypePill
                          type={c.type}
                          label={t(loc, `carrier_type_${group.key}`)}
                          size="xs"
                        />
                      </div>
                    </div>
                    <p style={{ margin: 0, fontSize: 14, color: 'var(--body)', lineHeight: 1.5 }}>{desc}</p>
                    {c.services && c.services.length > 0 && (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {c.services.slice(0, 3).map((s: { name: string; speed_days_min: number; speed_days_max: number }) => (
                          <span key={s.name} style={{
                            fontSize: 11, padding: '3px 8px', borderRadius: 6,
                            background: 'var(--bg)', color: 'var(--body)', border: '1px solid var(--line-2)'
                          }}>
                            {s.speed_days_min}-{s.speed_days_max}d · {s.name}
                          </span>
                        ))}
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, color: 'var(--blue)', marginTop: 'auto' }}>
                      {t(loc, "view_profile")}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="14" height="14"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                    </div>
                  </Link>
                  </StaggerItem>
                );
              })}
            </StaggerGrid>

            {/* Rest — compact grid */}
            {rest.length > 0 && (
              <>
                <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600, marginBottom: 10, marginTop: 16 }}>
                  {t(loc, "more_carriers_of_type", { count: rest.length, type: t(loc, `carrier_type_${group.key}`).toLowerCase() })}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                  {rest.map((c) => {
                    const brand = getBrand(c.id);
                    return (
                      <Link key={c.id} href={`/${locale}/carriers/${c.id}`} prefetch={false}
                        className="card-hover"
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
                          background: '#fff', borderRadius: 10, border: '1px solid var(--line)',
                          textDecoration: 'none', color: 'inherit', transition: 'all .2s',
                          fontSize: 13
                        }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                          background: brand.bg, color: brand.fg,
                          display: 'grid', placeItems: 'center',
                          fontSize: 8, fontWeight: 800, letterSpacing: '.02em'
                        }}>{brand.letters}</div>
                        <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, flex: 1 }}>{c.name}</span>
                        <span style={{
                          display: 'inline-grid', placeItems: 'center',
                          width: 22, height: 22, borderRadius: 999,
                          background: color === 'var(--blue)' ? 'var(--blue-50)' : color === 'var(--accent)' ? 'var(--accent-50)' : 'var(--warm-50)',
                          color, flexShrink: 0
                        }} aria-label={t(loc, `carrier_type_${group.key}`)}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {group.key === 'international' ? (
                              <><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" /></>
                            ) : group.key === 'regional' ? (
                              <><path d="M1 3h15v13H1z" /><path d="M16 8h4l3 3v5h-7z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></>
                            ) : (
                              <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></>
                            )}
                          </svg>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </>
            )}

            {/* Divider between groups */}
            {group.key !== 'postal' && (
              <div style={{ height: 1, background: 'var(--line)', margin: '40px 0 0' }} />
            )}
          </section>
          );
        })}

        {/* Bottom CTA — dark block with glow follow + magnetic CTA */}
        <GlowCTA
          glowColor="rgba(242,201,76,.35)"
          style={{
            padding: '32px', background: 'var(--ink)', borderRadius: 20, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20,
            overflow: 'hidden',
          }}
        >
          <div>
            <h3 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 700 }}>{t(loc, "ready_to_compare")}</h3>
            <p style={{ margin: 0, fontSize: 15, color: 'rgba(255,255,255,.65)' }}>
              {t(loc, "ready_to_compare_sub", { count: carriers.length })}
            </p>
          </div>
          <MagneticCTA>
            <Link href={`/${locale}`} className="btn-press" style={{
              padding: '14px 24px', borderRadius: 12, background: 'var(--warm)', color: 'var(--ink)',
              fontWeight: 700, fontSize: 15, display: 'inline-flex', alignItems: 'center', gap: 8,
              textDecoration: 'none'
            }}>
              {t(loc, "carriers_cta_compare")}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="16" height="16"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
          </MagneticCTA>
        </GlowCTA>

        {/* Data source */}
        <div className="fade-in" style={{
          marginTop: 16, padding: '16px 20px', borderRadius: 12, border: '1px solid var(--line)',
          display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--muted)'
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="14" height="14" style={{ color: 'var(--blue)', flexShrink: 0 }}>
            <path d="M12 2l8 3v7c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V5l8-3z"/><path d="M9 12l2 2 4-4"/>
          </svg>
          {t(loc, "carriers_data_note")}
          <Link href={`/${locale}/data-methodology`} style={{ color: 'var(--blue)', fontWeight: 600, marginLeft: 'auto', whiteSpace: 'nowrap' }}>{t(loc, "carriers_methodology_link")}</Link>
        </div>
      </div>

      {/* JSON-LD: BreadcrumbList + CollectionPage + ItemList of all carriers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: t(loc, "home"), item: `https://rateships.com/${locale}` },
              { "@type": "ListItem", position: 2, name: t(loc, "carriers_page") },
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
            name: t(loc, "carriers_page"),
            description: t(loc, "carriers_hero_subtitle", { count: carriers.length }),
            url: `https://rateships.com/${locale}/carriers`,
            inLanguage: locale,
            isPartOf: { "@type": "WebSite", name: "RateShips", url: "https://rateships.com" },
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: carriers.length,
              itemListElement: carriers.slice(0, 50).map((c, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: `https://rateships.com/${locale}/carriers/${c.id}`,
                name: c.name,
              })),
            },
          }),
        }}
      />
    </div>
  );
}
