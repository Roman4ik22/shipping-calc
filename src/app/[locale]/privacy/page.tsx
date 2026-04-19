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
    title: t(loc, "privacy_title"),
    description: t(loc, "privacy_meta_desc"),
    alternates: {
      canonical: `/${locale}/privacy`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}/privacy`])),
        "x-default": "/en/privacy",
      },
    },
  };
}

export default async function PrivacyPage({
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
              { "@type": "ListItem", position: 2, name: t(loc, "privacy_title") },
            ],
          }),
        }}
      />

      {/* Hero Section */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(160deg, #eef2ff 0%, #f0f4ff 35%, #e8edf8 100%)",
          backgroundImage: `linear-gradient(160deg, #eef2ff 0%, #f0f4ff 35%, #e8edf8 100%),
            linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)`,
          backgroundSize: "100% 100%, 28px 28px, 28px 28px",
          padding: "80px 24px 60px",
        }}
      >
        {/* Floating shield/lock icon */}
        <div
          style={{
            position: "absolute",
            top: 36,
            right: "14%",
            width: 56,
            height: 66,
            borderRadius: "50% 50% 8px 8px",
            background: "rgba(99,102,241,0.10)",
            border: "2px solid rgba(99,102,241,0.18)",
            transform: "rotate(-6deg)",
            animation: "floatPrivacy 7s ease-in-out infinite",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 16,
              height: 20,
              borderRadius: "3px 3px 10px 10px",
              background: "rgba(99,102,241,0.25)",
            }}
          />
        </div>

        {/* Small eye shape */}
        <div
          style={{
            position: "absolute",
            bottom: 44,
            left: "10%",
            width: 44,
            height: 24,
            borderRadius: "50%",
            background: "rgba(16,185,129,0.10)",
            border: "2px solid rgba(16,185,129,0.18)",
            transform: "rotate(5deg)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "rgba(16,185,129,0.3)",
            }}
          />
        </div>

        {/* Extra floating dot */}
        <div
          style={{
            position: "absolute",
            top: "60%",
            right: "6%",
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "rgba(99,102,241,0.08)",
          }}
        />

        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <nav style={{ fontSize: 14, color: "var(--muted)", marginBottom: 24 }}>
            <Link href={`/${locale}`} style={{ color: "var(--blue)", textDecoration: "none" }}>
              {t(loc, "home")}
            </Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "var(--ink)" }}>
              {t(loc, "privacy_title")}
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
            {t(loc, "privacy_title")}
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
                {t(loc, `privacy_s${n}_title` as any)}
              </h2>
              <p
                style={{
                  color: "var(--body)",
                  lineHeight: 1.75,
                  fontSize: 15,
                  margin: 0,
                }}
              >
                {t(loc, `privacy_s${n}_body` as any)}
              </p>
            </section>
          ))}

          {/* Section 7 with email */}
          <section className="fade-in">
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
              {t(loc, "privacy_s7_title")}
            </h2>
            <p
              style={{
                color: "var(--body)",
                lineHeight: 1.75,
                fontSize: 15,
                margin: 0,
              }}
            >
              {t(loc, "privacy_s7_body")}
              <span style={{ fontWeight: 600, color: "var(--ink)" }}>privacy@rateships.com</span>
            </p>
          </section>
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
        @keyframes floatPrivacy {
          0%, 100% { transform: rotate(-6deg) translateY(0); }
          50% { transform: rotate(-6deg) translateY(-14px); }
        }
      `}</style>
    </div>
  );
}
