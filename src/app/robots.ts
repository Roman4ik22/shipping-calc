import type { MetadataRoute } from "next";

const BASE_URL = "https://rateships.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/api/sitemap"],
        disallow: ["/api/rates", "/api/live-rates", "/api/subscribe", "/api/indexnow", "/_next/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
