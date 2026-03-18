import { NextRequest, NextResponse } from "next/server";
import { getCorridorData, getCountryByCode } from "@/lib/data";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const from = searchParams.get("from")?.toUpperCase();
    const to = searchParams.get("to")?.toUpperCase();
    const weightParam = searchParams.get("weight");
    const weight = weightParam ? parseFloat(weightParam) : 1;

    if (!from || !to) {
      return NextResponse.json(
        {
          error: "Missing required parameters",
          message: "Both 'from' and 'to' country codes are required. Example: /api/rates?from=US&to=DE&weight=2",
        },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    if (from.length !== 2 || to.length !== 2) {
      return NextResponse.json(
        {
          error: "Invalid country code",
          message: "Country codes must be 2-letter ISO 3166-1 alpha-2 codes (e.g., US, DE, JP).",
        },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const originCountry = getCountryByCode(from);
    const destCountry = getCountryByCode(to);

    if (!originCountry) {
      return NextResponse.json(
        { error: "Unknown origin country", message: `Country code '${from}' not found.` },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    if (!destCountry) {
      return NextResponse.json(
        { error: "Unknown destination country", message: `Country code '${to}' not found.` },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    if (weight <= 0 || weight > 70 || isNaN(weight)) {
      return NextResponse.json(
        {
          error: "Invalid weight",
          message: "Weight must be a number between 0.1 and 70 kg.",
        },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const corridorData = getCorridorData(from, to);

    if (!corridorData || corridorData.carriers.length === 0) {
      return NextResponse.json(
        {
          origin: { code: from, name: originCountry.name_en },
          destination: { code: to, name: destCountry.name_en },
          weight_kg: weight,
          carriers: [],
          _note: "No carriers found for this route.",
        },
        { status: 200, headers: CORS_HEADERS }
      );
    }

    // Find the closest available weight bracket
    const availableWeights = new Set<number>();
    for (const cr of corridorData.carriers) {
      for (const r of cr.rates) {
        availableWeights.add(r.weight_kg);
      }
    }
    const sortedWeights = [...availableWeights].sort((a, b) => a - b);
    let billingWeight = sortedWeights[sortedWeights.length - 1];
    for (const w of sortedWeights) {
      if (w >= weight) {
        billingWeight = w;
        break;
      }
    }

    const carriers = corridorData.carriers
      .map((cr) => {
        const rate = cr.rates.find((r) => r.weight_kg === billingWeight);
        if (!rate || rate.price_usd <= 0) return null;
        return {
          name: cr.carrier.name,
          service: cr.service.name,
          price_usd: rate.price_usd,
          days_min: cr.estimated_days_min,
          days_max: cr.estimated_days_max,
          tracking: cr.service.tracking,
        };
      })
      .filter(Boolean)
      .sort((a, b) => (a!.price_usd ?? 999) - (b!.price_usd ?? 999));

    return NextResponse.json(
      {
        origin: { code: from, name: originCountry.name_en },
        destination: { code: to, name: destCountry.name_en },
        weight_kg: weight,
        billing_weight_kg: billingWeight,
        carriers,
        _rate_limit: "This API is intended for moderate use. Please cache results and avoid more than 60 requests per minute.",
      },
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (error) {
    console.error("API /api/rates error:", error);
    return NextResponse.json(
      { error: "Internal server error", message: "An unexpected error occurred." },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
