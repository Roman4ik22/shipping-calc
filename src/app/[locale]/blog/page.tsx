import type { Metadata } from "next";
import Link from "next/link";
import { locales, t } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { blogPosts } from "@/data/blog-posts";

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
  const BASE_URL = "https://rateships.com";

  return {
    title: t(loc, "blog_title"),
    description: t(loc, "blog_description"),
    alternates: {
      canonical: `/${locale}/blog`,
      languages: {
        ...Object.fromEntries(
          locales.map((l) => [l, `/${l}/blog`])
        ),
        "x-default": "/en/blog",
      },
    },
    openGraph: {
      title: t(loc, "blog_title"),
      description: t(loc, "blog_description"),
      url: `${BASE_URL}/${locale}/blog`,
      type: "website",
    },
  };
}

const TAG_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  guide:      { bg: 'rgba(26,115,232,.08)', color: 'var(--blue)',   border: 'rgba(26,115,232,.18)' },
  customs:    { bg: 'rgba(139,92,246,.08)',  color: '#8B5CF6',      border: 'rgba(139,92,246,.18)' },
  duties:     { bg: 'rgba(139,92,246,.08)',  color: '#8B5CF6',      border: 'rgba(139,92,246,.18)' },
  ecommerce:  { bg: 'rgba(242,201,76,.12)', color: '#B8860B',      border: 'rgba(242,201,76,.25)' },
  carriers:   { bg: 'rgba(16,185,129,.08)', color: '#059669',      border: 'rgba(16,185,129,.18)' },
  'cost-saving': { bg: 'rgba(16,185,129,.08)', color: '#059669',   border: 'rgba(16,185,129,.18)' },
  tips:       { bg: 'rgba(26,115,232,.08)', color: 'var(--blue)',   border: 'rgba(26,115,232,.18)' },
  tracking:   { bg: 'rgba(26,115,232,.08)', color: 'var(--blue)',   border: 'rgba(26,115,232,.18)' },
  regulations:{ bg: 'rgba(239,68,68,.08)',  color: '#DC2626',      border: 'rgba(239,68,68,.18)' },
  tariffs:    { bg: 'rgba(239,68,68,.08)',  color: '#DC2626',      border: 'rgba(239,68,68,.18)' },
};

function getTagStyle(tag: string) {
  const found = TAG_COLORS[tag];
  if (found) return found;
  return { bg: 'var(--bg)', color: 'var(--muted)', border: 'var(--line-2)' };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;
  const sortedPosts = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div>
      {/* BreadcrumbList JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: t(loc, "home"), item: `https://rateships.com/${locale}` },
              { "@type": "ListItem", position: 2, name: t(loc, "blog") },
            ],
          }),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ borderBottom: '1px solid var(--line)' }}>
        <div aria-hidden className="absolute inset-0 z-0" style={{
          backgroundImage: `
            radial-gradient(800px 400px at 60% 0%, rgba(242,201,76,.06), transparent 60%),
            radial-gradient(600px 300px at 20% 60%, rgba(26,115,232,.05), transparent 60%),
            linear-gradient(var(--line-2) 1px, transparent 1px),
            linear-gradient(90deg, var(--line-2) 1px, transparent 1px)`,
          backgroundSize: 'auto, auto, 56px 56px, 56px 56px',
          maskImage: 'linear-gradient(180deg, #000 50%, transparent 100%)'
        }} />

        {/* Floating pencil/document icon */}
        <div aria-hidden className="hero-shape-a absolute hidden md:block" style={{
          top: '14%', right: '6%', width: 70, height: 70, borderRadius: 16,
          background: '#fff', border: '2px solid var(--line)',
          display: 'grid', placeItems: 'center', opacity: 0.9,
          boxShadow: '0 14px 30px -8px rgba(15,23,42,.08)'
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#1A73E8" strokeWidth="1.4" width="30" height="30">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" fill="rgba(26,115,232,.06)" />
            <path d="M14 2v6h6" /><path d="M8 13h8M8 17h5" />
          </svg>
        </div>
        {/* Floating book shape */}
        <div aria-hidden className="hero-shape-b absolute hidden md:block" style={{
          bottom: '18%', right: '16%', width: 50, height: 50, borderRadius: 12,
          background: '#fff', border: '2px solid var(--line)',
          display: 'grid', placeItems: 'center', opacity: 0.8,
          boxShadow: '0 8px 20px -4px rgba(15,23,42,.06)'
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#1A73E8" strokeWidth="1.4" width="24" height="24">
            <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5z" fill="rgba(26,115,232,.05)" />
          </svg>
        </div>
        {/* Warm accent dot */}
        <div aria-hidden className="hero-shape-c absolute hidden lg:block" style={{
          top: '42%', right: '28%', width: 22, height: 22, borderRadius: 999,
          background: 'var(--warm)', opacity: 0.5,
          boxShadow: '0 8px 16px -4px rgba(242,201,76,.3)'
        }} />

        <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-8 pt-16 pb-14">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px',
            borderRadius: 999, background: '#fff', border: '1px solid var(--line)',
            fontSize: 12, fontWeight: 600, marginBottom: 20, boxShadow: 'var(--shadow-sm)'
          }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--good)', boxShadow: '0 0 0 3px rgba(17,138,84,.15)' }} className="pulse-dot" />
            {blogPosts.length} articles published
          </div>
          <h1 style={{
            margin: '0 0 18px', fontSize: 'clamp(40px, 5vw, 64px)',
            lineHeight: 1.02, letterSpacing: '-.03em', fontWeight: 800, color: 'var(--ink)'
          }}>
            Shipping<br />
            <span style={{ color: 'var(--blue)' }}>intelligence</span>.
          </h1>
          <p style={{ fontSize: 19, color: 'var(--body)', lineHeight: 1.55, maxWidth: 560 }}>
            Guides, customs tips, carrier deep-dives, and cost-saving strategies for international shipping.
          </p>

          {/* Category quick stats */}
          <div className="flex gap-8 mt-8 flex-wrap" style={{ fontSize: 14 }}>
            {[
              { label: 'guides', color: 'var(--blue)', count: blogPosts.filter(p => p.tags.includes('guide')).length },
              { label: 'customs', color: '#8B5CF6', count: blogPosts.filter(p => p.tags.includes('customs')).length },
              { label: 'ecommerce', color: 'var(--warm)', count: blogPosts.filter(p => p.tags.includes('ecommerce')).length },
              { label: 'carriers', color: 'var(--accent)', count: blogPosts.filter(p => p.tags.includes('carriers')).length },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2">
                <span style={{ width: 8, height: 8, borderRadius: 999, background: s.color }} />
                <span style={{ fontWeight: 700, color: 'var(--ink)' }}>{s.count}</span>
                <span style={{ color: 'var(--muted)' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger-children">
          {sortedPosts.map((post, index) => (
            <Link
              key={post.id}
              href={`/${locale}/blog/${post.id}`}
              className="card-hover group"
              style={{
                display: 'flex', flexDirection: 'column', gap: 10,
                padding: '24px 24px 20px',
                background: '#fff', borderRadius: 14, border: '1px solid var(--line)',
                textDecoration: 'none', color: 'inherit',
                transition: 'all .25s ease-out',
                ...(index === 0 ? { gridColumn: '1 / -1' } : {})
              }}
            >
              {/* Tags + date row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                {post.tags.slice(0, 3).map((tag) => {
                  const ts = getTagStyle(tag);
                  return (
                    <span key={tag} style={{
                      fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 6,
                      background: ts.bg, color: ts.color, border: `1px solid ${ts.border}`,
                      textTransform: 'uppercase', letterSpacing: '.04em'
                    }}>
                      {tag}
                    </span>
                  );
                })}
                <time
                  dateTime={post.date}
                  style={{
                    fontSize: 12, color: 'var(--muted)', fontWeight: 500,
                    marginLeft: 'auto', fontVariantNumeric: 'tabular-nums'
                  }}
                >
                  {new Date(post.date).toLocaleDateString(
                    loc === "ru" ? "ru-RU" : "en-US",
                    { year: "numeric", month: "short", day: "numeric" }
                  )}
                </time>
              </div>

              {/* Title */}
              <h2 style={{
                margin: 0, fontWeight: 700, color: 'var(--ink)',
                fontSize: index === 0 ? 22 : 17, lineHeight: 1.3,
                transition: 'color .2s'
              }} className="group-hover:text-[var(--blue)]">
                {loc === "ru" ? post.title_ru : post.title_en}
              </h2>

              {/* Excerpt */}
              <p style={{
                margin: 0, fontSize: 14, color: 'var(--body)', lineHeight: 1.55,
                display: '-webkit-box', WebkitLineClamp: index === 0 ? 4 : 3,
                WebkitBoxOrient: 'vertical' as const, overflow: 'hidden'
              }}>
                {loc === "ru" ? post.excerpt_ru : post.excerpt_en}
              </p>

              {/* Read article link */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginTop: 'auto', paddingTop: 4 }}>
                <span style={{
                  fontSize: 13, fontWeight: 600, color: 'var(--blue)',
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  transition: 'gap .2s'
                }}>
                  {t(loc, "read_more")} &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="fade-in" style={{
          marginTop: 48, padding: '32px', background: 'var(--ink)', borderRadius: 20, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20
        }}>
          <div>
            <h3 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 700 }}>More articles coming</h3>
            <p style={{ margin: 0, fontSize: 15, color: 'rgba(255,255,255,.65)' }}>
              We publish new shipping guides and carrier analyses every week. Bookmark this page to stay updated.
            </p>
          </div>
          <Link href={`/${locale}`} className="btn-press" style={{
            padding: '14px 24px', borderRadius: 12, background: 'var(--warm)', color: 'var(--ink)',
            fontWeight: 700, fontSize: 15, display: 'inline-flex', alignItems: 'center', gap: 8,
            textDecoration: 'none'
          }}>
            Try the calculator
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="16" height="16"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </Link>
        </div>

        {/* Data note */}
        <div className="fade-in" style={{
          marginTop: 16, padding: '16px 20px', borderRadius: 12, border: '1px solid var(--line)',
          display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--muted)'
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="14" height="14" style={{ color: 'var(--blue)', flexShrink: 0 }}>
            <path d="M12 2l8 3v7c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V5l8-3z"/><path d="M9 12l2 2 4-4"/>
          </svg>
          All articles are independently written. Carrier comparisons based on published tariffs, not paid placements.
        </div>
      </div>

      {/* CollectionPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: t(loc, "blog_title"),
            description: t(loc, "blog_description"),
            url: `https://rateships.com/${locale}/blog`,
            inLanguage: locale,
            isPartOf: { "@type": "WebSite", name: "RateShips", url: "https://rateships.com" },
            dateModified: "2026-04-03",
          }),
        }}
      />
    </div>
  );
}
