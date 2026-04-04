import { getTopPages } from "../src/lib/page-priority";

async function main() {
  const pages = getTopPages(5000);
  const urls = pages.map(p => p.url.startsWith("http") ? p.url : `https://rateships.com${p.url}`);

  const batchSize = 500;
  let total = 0;

  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    try {
      const r = await fetch("https://api.indexnow.org/IndexNow", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          host: "rateships.com",
          key: "382c6560e829da9c4e0fd0b8864481b3",
          keyLocation: "https://rateships.com/382c6560e829da9c4e0fd0b8864481b3.txt",
          urlList: batch,
        }),
      });
      console.log(`Batch ${Math.floor(i / batchSize) + 1}: ${r.status} (${batch.length} URLs)`);
      total += batch.length;
    } catch (e: any) {
      console.error(`Batch ${Math.floor(i / batchSize) + 1} failed:`, e.message);
    }
  }

  console.log(`\nDone! Total submitted: ${total}`);
}

main();
