import { NextRequest, NextResponse } from "next/server";

// EasyPost live rate quotes
// Requires EASYPOST_API_KEY env var
// Usage: /api/live-rates?from_country=US&from_zip=10001&to_country=DE&to_zip=10115&weight_kg=2

// Representative addresses per country (capital/major city)
const countryAddresses: Record<string, { city: string; state: string; zip: string; street: string }> = {
  US: { city: "New York", state: "NY", zip: "10001", street: "350 5th Ave" },
  GB: { city: "London", state: "", zip: "SW1A 1AA", street: "10 Downing Street" },
  DE: { city: "Berlin", state: "", zip: "10115", street: "Unter den Linden 1" },
  FR: { city: "Paris", state: "", zip: "75001", street: "1 Rue de Rivoli" },
  CN: { city: "Shanghai", state: "SH", zip: "200000", street: "1 Nanjing Road" },
  JP: { city: "Tokyo", state: "", zip: "100-0001", street: "1-1 Chiyoda" },
  KR: { city: "Seoul", state: "", zip: "04524", street: "110 Sejong-daero" },
  AU: { city: "Sydney", state: "NSW", zip: "2000", street: "1 Macquarie Street" },
  CA: { city: "Toronto", state: "ON", zip: "M5V 3L9", street: "100 Queen St W" },
  RU: { city: "Moscow", state: "", zip: "101000", street: "1 Red Square" },
  IN: { city: "New Delhi", state: "DL", zip: "110001", street: "1 Rajpath" },
  AE: { city: "Dubai", state: "", zip: "00000", street: "1 Sheikh Zayed Road" },
  SG: { city: "Singapore", state: "", zip: "018956", street: "1 Raffles Place" },
  BR: { city: "São Paulo", state: "SP", zip: "01310-100", street: "1 Av Paulista" },
  MX: { city: "Mexico City", state: "CDMX", zip: "06600", street: "1 Paseo de la Reforma" },
  IT: { city: "Rome", state: "", zip: "00186", street: "1 Via del Corso" },
  ES: { city: "Madrid", state: "", zip: "28013", street: "1 Gran Via" },
  NL: { city: "Amsterdam", state: "", zip: "1012 JS", street: "1 Dam Square" },
  TR: { city: "Istanbul", state: "", zip: "34122", street: "1 Istiklal Caddesi" },
  TH: { city: "Bangkok", state: "", zip: "10200", street: "1 Ratchadamnoen" },
};

export async function GET(req: NextRequest) {
  const apiKey = process.env.EASYPOST_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        error: "EasyPost API not configured",
        message: "Set EASYPOST_API_KEY environment variable. Get a free key at easypost.com",
        fallback: "Using static rate estimates. Live rates available when API key is configured.",
      },
      { status: 503 }
    );
  }

  const fromCountry = req.nextUrl.searchParams.get("from_country")?.toUpperCase() || "US";
  const toCountry = req.nextUrl.searchParams.get("to_country")?.toUpperCase() || "DE";
  const fromZip = req.nextUrl.searchParams.get("from_zip") || countryAddresses[fromCountry]?.zip || "10001";
  const toZip = req.nextUrl.searchParams.get("to_zip") || countryAddresses[toCountry]?.zip || "10115";
  const weightKg = parseFloat(req.nextUrl.searchParams.get("weight_kg") || "1");
  const weightOz = Math.round(weightKg * 35.274);

  const fromAddr = countryAddresses[fromCountry] || countryAddresses.US;
  const toAddr = countryAddresses[toCountry] || countryAddresses.DE;

  try {
    // Create shipment via EasyPost REST API
    const response = await fetch("https://api.easypost.com/v2/shipments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        shipment: {
          from_address: {
            street1: fromAddr.street,
            city: fromAddr.city,
            state: fromAddr.state,
            zip: fromZip,
            country: fromCountry,
          },
          to_address: {
            street1: toAddr.street,
            city: toAddr.city,
            state: toAddr.state,
            zip: toZip,
            country: toCountry,
          },
          parcel: {
            length: 20,
            width: 15,
            height: 10,
            weight: weightOz,
          },
        },
      }),
    });

    if (!response.ok) {
      const errData = await response.json();
      return NextResponse.json(
        { error: "EasyPost API error", details: errData },
        { status: response.status }
      );
    }

    const data = await response.json();
    const rates = (data.rates || []).map((r: Record<string, string | number>) => ({
      carrier: r.carrier,
      service: r.service,
      rate_usd: parseFloat(String(r.rate)),
      currency: r.currency,
      delivery_days: r.est_delivery_days || r.delivery_days || null,
      delivery_date: r.delivery_date || null,
      list_rate: r.list_rate ? parseFloat(String(r.list_rate)) : null,
      retail_rate: r.retail_rate ? parseFloat(String(r.retail_rate)) : null,
    })).sort((a: { rate_usd: number }, b: { rate_usd: number }) => a.rate_usd - b.rate_usd);

    return NextResponse.json({
      from: { country: fromCountry, zip: fromZip, city: fromAddr.city },
      to: { country: toCountry, zip: toZip, city: toAddr.city },
      weight_kg: weightKg,
      weight_oz: weightOz,
      rates,
      source: "easypost_live",
      timestamp: new Date().toISOString(),
    }, {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch rates", message: String(err) },
      { status: 500 }
    );
  }
}
