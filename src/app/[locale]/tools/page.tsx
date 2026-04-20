import { Metadata } from "next";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import Link from "next/link";

export const dynamicParams = true;

export function generateStaticParams() {
  return [{ locale: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  return {
    title: t(loc, "tools_meta_title"),
    description: t(loc, "tools_meta_desc"),
    alternates: {
      canonical: `/${locale}/tools`,
      languages: {
        ...Object.fromEntries(
          ["en", "ru", "es", "de", "fr", "pt", "zh", "ja", "ko", "ar", "tr", "it"].map((l) => [l, `/${l}/tools`])
        ),
        "x-default": "/en/tools",
      },
    },
  };
}

const IconScale = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width={28} height={28}>
    <path d="M12 3v18M5 8h14M3 14l3-7 3 7M15 14l3-7 3 7" />
    <path d="M3 14a3 3 0 006 0M15 14a3 3 0 006 0" />
  </svg>
);
const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width={28} height={28}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);
const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width={28} height={28}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </svg>
);
const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={14} height={14}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export default async function ToolsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;

  const tools = [
    {
      icon: <IconScale />,
      color: "var(--accent)",
      bg: "var(--accent-50)",
      href: `/${locale}/tools/duty-calculator`,
      title: t(loc, "duty_calc_name"),
      description: t(loc, "duty_calc_desc"),
      cta: t(loc, "calculate") || "Calculate duties",
    },
    {
      icon: <IconClock />,
      color: "#A37A00",
      bg: "var(--warm-50)",
      href: `/${locale}/tools/delivery-estimator`,
      title: t(loc, "delivery_est_name"),
      description: t(loc, "delivery_est_desc"),
      cta: t(loc, "estimate_delivery") || "Estimate delivery",
    },
    {
      icon: <IconSearch />,
      color: "var(--blue)",
      bg: "var(--blue-50)",
      href: `/${locale}`,
      title: t(loc, "compare_shipping_rates"),
      description: t(loc, "hero_subtitle", { count: "134" }),
      cta: t(loc, "compare_rates") || "Compare rates",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t(loc, "shipping_tools"),
    description: t(loc, "free_shipping_calcs"),
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: t(loc, "home"), item: `https://rateships.com/${locale}` },
        { "@type": "ListItem", position: 2, name: t(loc, "tools_label") },
      ],
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section style={{ padding: "72px 32px 48px", borderBottom: "1px solid var(--line)", position: "relative" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(800px 400px at 60% -10%, rgba(232,92,58,.06), transparent 60%)" }} />
        <div style={{ position: "relative", maxWidth: 1240, margin: "0 auto" }}>
          <h1 style={{ margin: "0 0 18px", fontSize: "clamp(40px,5vw,64px)", lineHeight: 1.02, letterSpacing: "-.03em", fontWeight: 800, color: "var(--ink)" }}>
            {t(loc, "tools_page_title")}
          </h1>
          <p style={{ fontSize: 19, color: "var(--body)", maxWidth: 620, margin: 0 }}>
            {t(loc, "tools_subtitle")}
          </p>
        </div>
      </section>

      <section style={{ padding: "48px 32px 96px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto",
                  gap: 28,
                  alignItems: "center",
                  padding: 32,
                  background: "#fff",
                  border: "1px solid var(--line)",
                  borderRadius: 20,
                  boxShadow: "var(--shadow-sm)",
                  transition: "all .2s",
                  textDecoration: "none",
                  color: "inherit",
                }}
                className="team-card tools-row"
              >
                <div style={{ width: 64, height: 64, borderRadius: 16, background: tool.bg, color: tool.color, display: "grid", placeItems: "center" }}>
                  {tool.icon}
                </div>
                <div>
                  <h3 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 700, color: "var(--ink)" }}>{tool.title}</h3>
                  <p style={{ margin: 0, fontSize: 15, color: "var(--body)", lineHeight: 1.55, maxWidth: 600 }}>{tool.description}</p>
                </div>
                <div style={{ padding: "12px 20px", borderRadius: 12, background: "var(--ink)", color: "#fff", fontWeight: 600, fontSize: 14, display: "inline-flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
                  {tool.cta} <IconArrow />
                </div>
              </Link>
            ))}
          </div>

          <div style={{ marginTop: 40, padding: "24px 28px", background: "var(--bg)", borderRadius: 16, border: "1px solid var(--line)", textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 15, color: "var(--body)" }}>
              {t(loc, "tools_footer_note") || "All tools are free and don't require signup. Data sourced from published carrier tariffs and customs authority databases."}{" "}
              <Link href={`/${locale}/data-methodology`} style={{ color: "var(--blue)", fontWeight: 600 }}>
                {t(loc, "data_methodology") || "Read our methodology"} →
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
