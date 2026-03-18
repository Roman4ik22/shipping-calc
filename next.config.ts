import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  compress: true,
  rewrites: async () => [
    { source: "/sitemap.xml", destination: "/api/sitemap" },
  ],
  poweredByHeader: false,
  reactStrictMode: true,
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-XSS-Protection", value: "1; mode=block" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      ],
    },
    {
      source: "/sitemap/:path*",
      headers: [
        { key: "Cache-Control", value: "public, max-age=86400, s-maxage=86400" },
      ],
    },
    {
      source: "/:locale/shipping/:path*",
      headers: [
        { key: "Cache-Control", value: "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400" },
      ],
    },
    {
      source: "/:locale/carriers/:path*",
      headers: [
        { key: "Cache-Control", value: "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400" },
      ],
    },
    {
      source: "/:locale/guide/:path*",
      headers: [
        { key: "Cache-Control", value: "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400" },
      ],
    },
  ],
};

export default nextConfig;
