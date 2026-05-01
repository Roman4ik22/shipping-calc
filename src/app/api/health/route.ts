/**
 * Tiny health-check endpoint. Returns 200 + "ok" plain text.
 *
 * Why it exists: Coolify (and other PaaS) need a fast endpoint to verify the
 * container is alive after deploy. Hitting the root SSR page costs ~200-500ms
 * because it does i18n lookups + JSON-LD generation; if that times out during
 * the deploy window, Coolify reports "no available server" via Traefik even
 * though the container is starting up fine.
 *
 * This route bypasses all of that — no params, no i18n, no DB. Force the
 * runtime to nodejs to avoid the edge bundle entirely.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return new Response("ok", {
    status: 200,
    headers: { "Content-Type": "text/plain", "Cache-Control": "no-store" },
  });
}
