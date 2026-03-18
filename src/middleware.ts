import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "ru", "es", "de", "fr", "pt", "zh", "ja", "ko", "ar", "tr", "it"];
const defaultLocale = "en";

const langMap: Record<string, string> = {
  ru: "ru", uk: "ru", be: "ru", kk: "ru",
  es: "es",
  de: "de",
  fr: "fr",
  pt: "pt",
  zh: "zh",
  ja: "ja",
  ko: "ko",
  ar: "ar",
  tr: "tr",
  it: "it",
};

function getPreferredLocale(request: NextRequest): string {
  const acceptLang = request.headers.get("accept-language") || "";
  // Parse Accept-Language header for best match
  const langs = acceptLang.split(",").map((part) => {
    const [lang] = part.trim().split(";");
    return lang.trim().toLowerCase();
  });

  for (const lang of langs) {
    // Check exact match first (e.g., "pt-br" -> "pt")
    const short = lang.split("-")[0];
    if (langMap[short]) return langMap[short];
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files, api routes, sitemaps, and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/sitemap") ||
    pathname === "/robots.txt" ||
    pathname === "/ads.txt" ||
    pathname === "/sw.js" ||
    pathname === "/favicon.svg" ||
    pathname === "/manifest.json" ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check if pathname already has a locale
  const hasLocale = locales.some(
    (loc) => pathname === `/${loc}` || pathname.startsWith(`/${loc}/`)
  );

  if (!hasLocale) {
    const locale = getPreferredLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|sitemap|robots\\.txt|ads\\.txt|sw\\.js|favicon\\.svg|manifest\\.json|.*\\..*).*)"],
};
