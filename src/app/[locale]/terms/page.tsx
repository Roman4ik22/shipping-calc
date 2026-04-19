import { Metadata } from "next";
import { locales, t } from "@/lib/i18n";
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
    title: t(loc, "terms_title"),
    description: t(loc, "terms_meta_desc"),
    alternates: {
      canonical: `/${locale}/terms`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}/terms`])),
        "x-default": "/en/terms",
      },
    },
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* BreadcrumbList JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: t(loc, "home"), item: `https://rateships.com/${locale}` },
              { "@type": "ListItem", position: 2, name: t(loc, "terms_title") },
            ],
          }),
        }}
      />

      {/* Hero Section */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, #fdf6e3 0%, #fef9ef 40%, #f0e6d2 100%)",
          backgroundImage: `linear-gradient(135deg, #fdf6e3 0%, #fef9ef 40%, #f0e6d2 100%),
            linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)`,
          backgroundSize: "100% 100%, 32px 32px, 32px 32px",
          padding: "80px 24px 60px",
        }}
      >
        {/* Floating document/scroll shape */}
        <div
          style={{
            position: "absolute",
            top: 40,
            right: "12%",
            width: 64,
            height: 80,
            borderRadius: "6px 6px 6px 20px",
            background: "rgba(59,130,246,0.10)",
            border: "2px solid rgba(59,130,246,0.15)",
            transform: "rotate(8deg)",
            animation: "float 6s ease-in-out infinite",
          }}
        >
          <div style={{ margin: "14px 10px", display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ height: 3, borderRadius: 2, background: "rgba(59,130,246,0.2)", width: "100%" }} />
            <div style={{ height: 3, borderRadius: 2, background: "rgba(59,130,246,0.15)", width: "80%" }} />
            <div style={{ height: 3, borderRadius: 2, background: "rgba(59,130,246,0.12)", width: "90%" }} />
            <div style={{ height: 3, borderRadius: 2, background: "rgba(59,130,246,0.10)", width: "60%" }} />
          </div>
        </div>

        {/* Small gavel shape */}
        <div
          style={{
            position: "absolute",
            bottom: 50,
            left: "8%",
            width: 38,
            height: 38,
            borderRadius: "50% 50% 8px 8px",
            background: "rgba(217,119,6,0.12)",
            border: "2px solid rgba(217,119,6,0.18)",
            transform: "rotate(-15deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 36,
            left: "calc(8% + 14px)",
            width: 10,
            height: 28,
            borderRadius: 4,
            background: "rgba(217,119,6,0.10)",
            transform: "rotate(-15deg)",
          }}
        />

        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <nav style={{ fontSize: 14, color: "var(--muted)", marginBottom: 24 }}>
            <Link href={`/${locale}`} style={{ color: "var(--blue)", textDecoration: "none" }}>
              {t(loc, "home")}
            </Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "var(--ink)" }}>
              {t(loc, "terms_title")}
            </span>
          </nav>

          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 800,
              color: "var(--ink)",
              margin: 0,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
            }}
          >
            {t(loc, "terms_title")}
          </h1>
        </div>
      </section>

      {/* Content */}
      <div
        className="fade-in"
        style={{
          maxWidth: 800,
          margin: "0 auto",
          padding: "48px 24px 80px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          {([1, 2, 3, 4, 5, 6] as const).map((n) => (
            <section key={n} className="fade-in">
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "var(--ink)",
                  marginBottom: 12,
                  paddingBottom: 8,
                  borderBottom: "1px solid var(--line)",
                }}
              >
                {t(loc, `terms_s${n}_title` as any)}
              </h2>
              <p
                style={{
                  color: "var(--body)",
                  lineHeight: 1.75,
                  fontSize: 15,
                  margin: 0,
                }}
              >
                {t(loc, `terms_s${n}_body` as any)}
              </p>
            </section>
          ))}
        </div>

        <div
          style={{
            marginTop: 48,
            paddingTop: 20,
            borderTop: "1px solid var(--line)",
            fontSize: 13,
            color: "var(--muted)",
          }}
        >
          {t(loc, "last_updated_march")}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: rotate(8deg) translateY(0); }
          50% { transform: rotate(8deg) translateY(-12px); }
        }
      `}</style>
    </div>
  );
}
