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

const CARRIER_COLORS: Record<string, { bg: string; fg: string; letters: string }> = {
  "dhl-express": { bg: "#FFCC00", fg: "#D40511", letters: "DHL" },
  "fedex": { bg: "#4D148C", fg: "#FF6600", letters: "FDX" },
  "ups": { bg: "#351C15", fg: "#FFB500", letters: "UPS" },
  "tnt-fedex": { bg: "#FF6600", fg: "#FFF", letters: "TNT" },
  "ems": { bg: "#0F3C8A", fg: "#FFD400", letters: "EMS" },
  "aramex": { bg: "#E32219", fg: "#FFF", letters: "ARX" },
  "sf-express": { bg: "#000", fg: "#FFF", letters: "SF" },
  "usps": { bg: "#333E6B", fg: "#FFF", letters: "USPS" },
  "royal-mail": { bg: "#E2001A", fg: "#FFF", letters: "RM" },
  "dpd": { bg: "#DC0032", fg: "#FFF", letters: "DPD" },
  "japan-post": { bg: "#CC0000", fg: "#FFF", letters: "JP" },
  "australia-post": { bg: "#E3001B", fg: "#FFF", letters: "AP" },
  "canada-post": { bg: "#E31937", fg: "#FFF", letters: "CA" },
  "china-post": { bg: "#006633", fg: "#FFF", letters: "CP" },
  "india-post": { bg: "#FF0000", fg: "#FFF", letters: "IN" },
  "deutsche-post-dhl-paket": { bg: "#FFCC00", fg: "#333", letters: "DP" },
  "correos-spain": { bg: "#FFCC00", fg: "#003DA5", letters: "COR" },
  "correios-brazil": { bg: "#009639", fg: "#FFD700", letters: "CRB" },
  "korea-post": { bg: "#E31E24", fg: "#FFF", letters: "KR" },
  "gls": { bg: "#FFC600", fg: "#003087", letters: "GLS" },
  "postnl": { bg: "#FF6600", fg: "#FFF", letters: "PNL" },
  "delhivery": { bg: "#2B45D4", fg: "#FFF", letters: "DEL" },
  "cainiao": { bg: "#FF6A00", fg: "#FFF", letters: "CN" },
  "cdek": { bg: "#00923E", fg: "#FFF", letters: "CDK" },
  "ninja-van": { bg: "#C41515", fg: "#FFF", letters: "NV" },
  "jt-express": { bg: "#E31E24", fg: "#FFF", letters: "J&T" },
};

function getCarrierVisual(id: string) {
  return CARRIER_COLORS[id] || { bg: "#6B7280", fg: "#FFF", letters: id.slice(0, 3).toUpperCase() };
}

export default async function CarriersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc = locale as Locale;

  const intl = carriers.filter(c => c.type === "international");
  const regional = carriers.filter(c => c.type === "regional");
  const postal = carriers.filter(c => c.type === "postal");

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ borderBottom: '1px solid var(--line)' }}>
        <div aria-hidden className="absolute inset-0 z-0" style={{
          backgroundImage: `
            radial-gradient(900px 400px at 70% -10%, rgba(26,115,232,.08), transparent 60%),
            radial-gradient(600px 300px at -5% 50%, rgba(232,92,58,.05), transparent 60%),
            linear-gradient(var(--line-2) 1px, transparent 1px),
            linear-gradient(90deg, var(--line-2) 1px, transparent 1px)`,
          backgroundSize: 'auto, auto, 48px 48px, 48px 48px',
          maskImage: 'linear-gradient(180deg, #000 60%, transparent 100%)'
        }} />
        <div aria-hidden className="hero-shape-a absolute hidden md:block" style={{ top: '20%', right: '8%', width: 60, height: 60, borderRadius: 14, background: 'linear-gradient(135deg, var(--warm) 0%, #E8B43D 100%)', opacity: 0.7 }} />
        <div aria-hidden className="hero-shape-b absolute hidden md:block" style={{ bottom: '25%', right: '18%', width: 40, height: 40, borderRadius: 10, background: 'var(--accent)', opacity: 0.6 }} />

        <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-8 pt-16 pb-12">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 999, background: '#fff', border: '1px solid var(--line)', fontSize: 12, fontWeight: 600, marginBottom: 20, boxShadow: 'var(--shadow-sm)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="14" height="14"><path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/></svg>
            {carriers.length} {t(loc, "carriers_page")} · {intl.length} international · {regional.length} regional · {postal.length} postal
          </div>
          <h1 style={{ margin: '0 0 18px', fontSize: 'clamp(40px, 5vw, 64px)', lineHeight: 1.02, letterSpacing: '-.03em', fontWeight: 800, color: 'var(--ink)' }}>
            {t(loc, "carriers_page")}<br />
            <span style={{ color: 'var(--blue)' }}>{t(loc, "compare_rates")}</span>
          </h1>
          <p style={{ fontSize: 19, color: 'var(--body)', lineHeight: 1.55, maxWidth: 600 }}>
            {t(loc, "site_description")}
          </p>
        </div>
      </section>

      {/* Carrier list */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8 py-12">
        {[
          { title: `International (${intl.length})`, list: intl },
          { title: `Regional (${regional.length})`, list: regional },
          { title: `Postal (${postal.length})`, list: postal },
        ].map(group => (
          <div key={group.title} className="mb-12">
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16, color: 'var(--ink)' }}>{group.title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {group.list.map(c => {
                const v = getCarrierVisual(c.id);
                const desc = getCarrierDescription(c, loc);
                return (
                  <Link key={c.id} href={`/${locale}/carriers/${c.id}`} prefetch={false}
                    className="card-hover"
                    style={{
                      display: 'flex', gap: 16, alignItems: 'flex-start', padding: '20px 24px',
                      background: '#fff', borderRadius: 16, border: '1px solid var(--line)',
                      textDecoration: 'none', color: 'inherit', transition: 'all .2s'
                    }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 10, background: v.bg, color: v.fg,
                      display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 800,
                      letterSpacing: '.02em', flexShrink: 0,
                      boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.06)'
                    }}>{v.letters}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, fontSize: 15 }}>{c.name}</span>
                        <span style={{
                          fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 999,
                          background: c.type === 'international' ? 'var(--blue-50)' : c.type === 'regional' ? 'var(--accent-50)' : 'var(--warm-50)',
                          color: c.type === 'international' ? 'var(--blue)' : c.type === 'regional' ? 'var(--accent)' : '#A37A00'
                        }}>{c.type}</span>
                      </div>
                      <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--body)', lineHeight: 1.45 }}>{desc}</p>
                      {c.services && c.services.length > 0 && (
                        <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                          {c.services.slice(0, 3).map((s: { name: string }) => (
                            <span key={s.name} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: 'var(--bg)', color: 'var(--muted)', border: '1px solid var(--line)' }}>{s.name}</span>
                          ))}
                          {c.services.length > 3 && <span style={{ fontSize: 11, color: 'var(--muted)' }}>+{c.services.length - 3} more</span>}
                        </div>
                      )}
                    </div>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="16" height="16" style={{ color: 'var(--muted)', flexShrink: 0, marginTop: 4 }}><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {/* Data disclaimer */}
        <div style={{
          marginTop: 32, padding: '20px 24px', background: 'var(--bg)', borderRadius: 14,
          border: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap'
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="18" height="18" style={{ color: 'var(--blue)', flexShrink: 0 }}>
            <path d="M12 2l8 3v7c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V5l8-3z"/><path d="M9 12l2 2 4-4"/>
          </svg>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Rate data from published carrier tariffs</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>Updated weekly. RateShips is an independent comparison tool — we take no commissions from carriers.</div>
          </div>
          <Link href={`/${locale}/data-methodology`} style={{
            padding: '10px 18px', borderRadius: 10, background: 'var(--ink)', color: '#fff',
            fontWeight: 600, fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap'
          }}>
            Methodology <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="14" height="14"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
