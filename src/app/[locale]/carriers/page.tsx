import { Metadata } from "next";
import { carriers, getCarrierDescription } from "@/lib/data";
import { t, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
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
            {carriers.length} carriers tracked · Updated weekly
          </div>
          <h1 style={{ margin: '0 0 18px', fontSize: 'clamp(40px, 5vw, 64px)', lineHeight: 1.02, letterSpacing: '-.03em', fontWeight: 800, color: 'var(--ink)' }}>
            Compare <span style={{ color: 'var(--blue)' }}>every carrier</span>,<br />
            one search.
          </h1>
          <p style={{ fontSize: 19, color: 'var(--body)', lineHeight: 1.55, maxWidth: 560 }}>
            From DHL and FedEx to regional couriers and postal services — browse all {carriers.length} carriers we compare across 213 countries.
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
                <span style={{ color: 'var(--muted)' }}>{g.key}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Carrier groups */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8 py-12">
        {groups.map((group, gi) => (
          <section key={group.key} className="mb-16 fade-in">
            <div className="flex items-center gap-3 mb-6">
              <span style={{
                width: 10, height: 10, borderRadius: 999,
                background: group.key === 'international' ? 'var(--blue)' : group.key === 'regional' ? 'var(--accent)' : 'var(--warm)'
              }} />
              <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: '-.01em' }}>
                {group.key.charAt(0).toUpperCase() + group.key.slice(1)} carriers
              </h2>
              <span style={{ fontSize: 14, color: 'var(--muted)', fontWeight: 500 }}>{group.list.length}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 stagger-children">
              {group.list.map((c, ci) => {
                const brand = getBrand(c.id);
                const desc = getCarrierDescription(c, loc);
                const faviconUrl = brand.website
                  ? `https://www.google.com/s2/favicons?domain=${brand.website}&sz=64`
                  : null;

                return (
                  <Link key={c.id} href={`/${locale}/carriers/${c.id}`} prefetch={false}
                    className="card-hover group"
                    style={{
                      display: 'flex', gap: 14, alignItems: 'flex-start', padding: '18px 20px',
                      background: '#fff', borderRadius: 14, border: '1px solid var(--line)',
                      textDecoration: 'none', color: 'inherit',
                      transition: 'all .25s ease-out'
                    }}>
                    {/* Logo — real favicon or colored square */}
                    <div style={{
                      width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                      background: brand.bg, color: brand.fg,
                      display: 'grid', placeItems: 'center',
                      boxShadow: '0 2px 8px -2px rgba(0,0,0,.1)',
                      overflow: 'hidden', position: 'relative'
                    }}>
                      {faviconUrl ? (
                        <img src={faviconUrl} alt="" width={28} height={28} style={{ borderRadius: 4 }} loading="lazy" />
                      ) : (
                        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.02em' }}>{brand.letters}</span>
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{c.name}</div>
                      <p style={{ margin: 0, fontSize: 12, color: 'var(--muted)', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
                        {desc}
                      </p>
                      {c.services && c.services.length > 0 && (
                        <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' }}>
                          {c.services.slice(0, 2).map((s: { name: string; speed_days_min: number; speed_days_max: number }) => (
                            <span key={s.name} style={{
                              fontSize: 10, padding: '1px 6px', borderRadius: 4,
                              background: 'var(--bg)', color: 'var(--muted)', border: '1px solid var(--line-2)'
                            }}>
                              {s.speed_days_min}-{s.speed_days_max}d · {s.name.length > 18 ? s.name.slice(0, 18) + '…' : s.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Arrow */}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="14" height="14"
                      style={{ color: 'var(--line)', flexShrink: 0, marginTop: 4, transition: 'color .2s' }}
                      className="group-hover:stroke-[var(--blue)]"
                    ><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}

        {/* Bottom CTA */}
        <div className="fade-in" style={{
          padding: '32px', background: 'var(--ink)', borderRadius: 20, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20
        }}>
          <div>
            <h3 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 700 }}>Ready to compare?</h3>
            <p style={{ margin: 0, fontSize: 15, color: 'rgba(255,255,255,.65)' }}>
              Enter your route and see which of these {carriers.length} carriers offers the best rate.
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

        {/* Data source */}
        <div className="fade-in" style={{
          marginTop: 16, padding: '16px 20px', borderRadius: 12, border: '1px solid var(--line)',
          display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--muted)'
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="14" height="14" style={{ color: 'var(--blue)', flexShrink: 0 }}>
            <path d="M12 2l8 3v7c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V5l8-3z"/><path d="M9 12l2 2 4-4"/>
          </svg>
          Rates from published carrier tariffs, updated weekly. Independent comparison — zero carrier commissions.
          <Link href={`/${locale}/data-methodology`} style={{ color: 'var(--blue)', fontWeight: 600, marginLeft: 'auto', whiteSpace: 'nowrap' }}>Methodology →</Link>
        </div>
      </div>
    </div>
  );
}
