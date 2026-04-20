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

  const sections = [
    { title: t(loc, "terms_s1_title"), body: t(loc, "terms_s1_body") },
    { title: t(loc, "terms_s2_title"), body: t(loc, "terms_s2_body") },
    { title: t(loc, "terms_s3_title"), body: t(loc, "terms_s3_body") },
    { title: t(loc, "terms_s4_title"), body: t(loc, "terms_s4_body") },
    { title: t(loc, "terms_s5_title"), body: t(loc, "terms_s5_body") },
    { title: t(loc, "terms_s6_title"), body: t(loc, "terms_s6_body") },
  ];

  return (
    <>
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

      <section style={{ padding: "72px 32px 48px", borderBottom: "1px solid var(--line)", position: "relative" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(800px 400px at 40% -10%, rgba(26,115,232,.08), transparent 60%)" }} />
        <div style={{ position: "relative", maxWidth: 1240, margin: "0 auto" }}>
          <nav style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>
            <Link href={`/${locale}`} style={{ color: "var(--muted)", textDecoration: "none" }}>{t(loc, "home")}</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "var(--ink)" }}>{t(loc, "terms_title")}</span>
          </nav>
          <h1 style={{ margin: "0 0 18px", fontSize: "clamp(40px,5vw,64px)", lineHeight: 1.02, letterSpacing: "-.03em", fontWeight: 800, color: "var(--ink)" }}>
            {t(loc, "terms_title")}
          </h1>
        </div>
      </section>

      <section style={{ padding: "48px 32px 96px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ display: "grid", gap: 20 }}>
            {sections.map((s, i) => (
              <section key={i} style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 16, padding: 28 }}>
                <h2 style={{ margin: "0 0 12px", fontSize: 22, fontWeight: 800, letterSpacing: "-.01em", color: "var(--ink)" }}>
                  {s.title}
                </h2>
                <p style={{ margin: 0, color: "var(--body)", lineHeight: 1.65, fontSize: 15 }}>{s.body}</p>
              </section>
            ))}
          </div>

          <p style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid var(--line)", fontSize: 13, color: "var(--muted)" }}>
            {t(loc, "last_updated_march")}
          </p>
        </div>
      </section>
    </>
  );
}
