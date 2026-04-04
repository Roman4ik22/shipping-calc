import { blogPosts } from "@/data/blog-posts";

export async function GET() {
  const posts = blogPosts.slice(0, 20);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>RateShips Blog</title>
    <link>https://rateships.com/en/blog</link>
    <description>Tips and guides for international shipping</description>
    <language>en</language>
    <atom:link href="https://rateships.com/feed.xml" rel="self" type="application/rss+xml"/>
    ${posts.map(p => `<item>
      <title>${p.title_en}</title>
      <link>https://rateships.com/en/blog/${p.id}</link>
      <description>${p.excerpt_en}</description>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <guid>https://rateships.com/en/blog/${p.id}</guid>
    </item>`).join("\n    ")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
