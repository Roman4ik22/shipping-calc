import type { MetadataRoute } from "next";

const BASE_URL = "https://rateships.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/api/sitemap", "/api/rates"],
        disallow: ["/api/live-rates", "/api/subscribe", "/_next/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
