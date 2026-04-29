import type { Metadata } from "next";
import Link from "next/link";
import { locales, t } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { blogPosts } from "@/data/blog-posts";
import { BlogIllustration } from "@/components/PageIllustrations";

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
        ...Object.fromEntries(locales.map((l) => [l, `/${l}/blog`])),
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

function tagColor(tag: string): { bg: string; color: string } {
  const guideish = ["guide", "beginners", "small-business", "cost-saving"];
  const customsish = ["customs", "eu", "returns"];
  const ecomish = ["ecommerce", "shopify"];
  if (guideish.includes(tag)) return { bg: "var(--blue-50)", color: "var(--blue)" };
  if (customsish.includes(tag)) return { bg: "var(--accent-50)", color: "var(--accent)" };
  if (ecomish.includes(tag)) return { bg: "var(--warm-50)", color: "#A37A00" };
  return { bg: "var(--line-2)", color: "var(--muted)" };
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
    <>
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

      {/* V2 Hero */}
      <section style={{ padding: "72px 32px 48px", borderBottom: "1px solid var(--line)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(800px 400px at 70% -10%, rgba(232,92,58,.06), transparent 60%)" }} />
        {/* Themed corner illustration: stack of articles with featured card */}
        <div aria-hidden className="hidden md:block" style={{ position: "absolute", top: 24, right: 32, opacity: 0.95, pointerEvents: "none" }}>
          <BlogIllustration width={300} />
        </div>
        <div style={{ position: "relative", maxWidth: 1240, margin: "0 auto" }}>
          <h1 style={{ margin: "0 0 18px", fontSize: "clamp(40px,5vw,64px)", lineHeight: 1.02, letterSpacing: "-.03em", fontWeight: 800, color: "var(--ink)" }}>
            {t(loc, "blog_title")}
          </h1>
          <p style={{ fontSize: 19, color: "var(--body)", maxWidth: 620, margin: 0 }}>
            {t(loc, "blog_description")}
          </p>
        </div>
      </section>

      {/* Posts grid V2 */}
      <section style={{ padding: "48px 32px 96px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="two-col">
            {sortedPosts.map((post) => (
              <Link
                key={post.id}
                href={`/${locale}/blog/${post.id}`}
                style={{
                  background: "#fff",
                  border: "1px solid var(--line)",
                  borderRadius: 20,
                  padding: 28,
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  textDecoration: "none",
                  color: "inherit",
                  transition: "all .2s",
                }}
                className="team-card"
              >
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  {post.tags.slice(0, 3).map((tag) => {
                    const tc = tagColor(tag);
                    return (
                      <span key={tag} style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: tc.bg, color: tc.color }}>
                        {tag}
                      </span>
                    );
                  })}
                  <time
                    dateTime={post.date}
                    style={{ fontSize: 12, color: "var(--muted)", marginLeft: "auto" }}
                  >
                    {new Date(post.date).toLocaleDateString(loc === "ru" ? "ru-RU" : "en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: "-.01em", lineHeight: 1.25, color: "var(--ink)" }}>
                  {loc === "ru" ? post.title_ru : post.title_en}
                </h3>
                <p style={{ margin: 0, fontSize: 14, color: "var(--body)", lineHeight: 1.55 }}>
                  {loc === "ru" ? post.excerpt_ru : post.excerpt_en}
                </p>
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--blue)", marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 6 }}>
                  {t(loc, "read_more")} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

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
            dateModified: new Date().toISOString().split("T")[0],
          }),
        }}
      />
    </>
  );
}
