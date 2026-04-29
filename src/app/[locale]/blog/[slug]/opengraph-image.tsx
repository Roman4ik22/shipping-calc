import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/data/blog-posts";
import { pickLocalized } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

export const runtime = "edge";
export const alt = "RateShips blog post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const loc = locale as Locale;
  const post = getPostBySlug(slug);

  if (!post) {
    return new ImageResponse(
      (
        <div style={{
          width: "100%", height: "100%",
          display: "flex", alignItems: "center", justifyContent: "center",
          backgroundColor: "#0F172A", color: "white", fontSize: 56, fontWeight: 700,
        }}>
          RateShips Blog
        </div>
      ),
      { ...size }
    );
  }

  const title = pickLocalized(post as unknown as Record<string, unknown>, "title", loc) ?? post.title_en;
  const date = new Date(post.date).toLocaleDateString(loc === "ru" ? "ru-RU" : "en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
  const tagLine = post.tags.slice(0, 3).join(" · ");

  return new ImageResponse(
    (
      <div style={{
        width: "100%", height: "100%",
        display: "flex", flexDirection: "column",
        padding: "70px 80px",
        backgroundColor: "#0F172A",
        backgroundImage:
          "linear-gradient(135deg, rgba(26,115,232,.18) 0%, rgba(15,23,42,0) 50%), radial-gradient(ellipse at bottom right, rgba(232,92,58,.10), transparent 65%)",
      }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #1A73E8, #2F88FF)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontSize: 22, fontWeight: 800,
          }}>R</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#E8F0FE", display: "flex" }}>RateShips</div>
          <div style={{
            display: "flex", marginLeft: 16,
            padding: "5px 14px", borderRadius: 999,
            background: "rgba(232,92,58,.18)", color: "#FCA189",
            fontSize: 18, fontWeight: 600,
          }}>
            Blog
          </div>
        </div>

        {/* Title (large) */}
        <div style={{
          fontSize: title.length > 60 ? 56 : 68,
          fontWeight: 800, color: "white",
          letterSpacing: "-0.025em", lineHeight: 1.1,
          display: "flex", flexWrap: "wrap",
          marginTop: 10,
        }}>
          {title}
        </div>

        {/* Bottom row: date + tags */}
        <div style={{
          marginTop: "auto", display: "flex",
          alignItems: "center", gap: 24,
          fontSize: 22, color: "#9CA3AF",
        }}>
          <div style={{ display: "flex" }}>{date}</div>
          {tagLine && (
            <>
              <div style={{ display: "flex", color: "#4B5563" }}>·</div>
              <div style={{ display: "flex", color: "#60A5FA", textTransform: "capitalize" }}>{tagLine}</div>
            </>
          )}
          <div style={{ display: "flex", marginLeft: "auto", color: "#6B7280" }}>
            rateships.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
