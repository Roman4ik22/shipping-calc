// Self-unregistering service worker — kills all caches and removes itself.
// Keeps /sw.js responding 200 so existing installations detect the update.
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: "window" });
      for (const client of clients) {
        client.navigate(client.url);
      }
    })()
  );
});

self.addEventListener("fetch", (event) => {
  // Network-only — never serve from cache
  event.respondWith(fetch(event.request));
});
