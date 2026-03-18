import { NextResponse } from "next/server";

export async function GET() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Shipping Rates API Documentation</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0f1117;
      color: #e5e7eb;
      line-height: 1.6;
      padding: 2rem;
    }
    .container { max-width: 800px; margin: 0 auto; }
    h1 {
      font-size: 2rem;
      color: #f9fafb;
      margin-bottom: 0.5rem;
    }
    h2 {
      font-size: 1.25rem;
      color: #f9fafb;
      margin-top: 2rem;
      margin-bottom: 0.75rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    h3 {
      font-size: 1rem;
      color: #d1d5db;
      margin-top: 1.25rem;
      margin-bottom: 0.5rem;
    }
    .subtitle {
      color: #9ca3af;
      margin-bottom: 2rem;
    }
    .endpoint-box {
      background: #1a1d2e;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px;
      padding: 1rem 1.25rem;
      margin: 1rem 0;
      font-family: 'SF Mono', 'Fira Code', monospace;
      font-size: 0.95rem;
    }
    .method {
      display: inline-block;
      background: #22c55e33;
      color: #4ade80;
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: 600;
      font-size: 0.85rem;
      margin-right: 0.5rem;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1rem 0;
    }
    th, td {
      text-align: left;
      padding: 0.6rem 1rem;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    th {
      color: #9ca3af;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    td { font-size: 0.9rem; }
    code {
      background: #1a1d2e;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'SF Mono', 'Fira Code', monospace;
      font-size: 0.85rem;
      color: #a78bfa;
    }
    pre {
      background: #1a1d2e;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px;
      padding: 1.25rem;
      overflow-x: auto;
      margin: 1rem 0;
      font-family: 'SF Mono', 'Fira Code', monospace;
      font-size: 0.85rem;
      line-height: 1.5;
    }
    .text-accent { color: #a78bfa; }
    .text-muted { color: #6b7280; }
    .text-green { color: #4ade80; }
    .text-yellow { color: #fbbf24; }
    .badge {
      display: inline-block;
      background: rgba(167, 139, 250, 0.15);
      color: #a78bfa;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.8rem;
      margin-left: 0.5rem;
    }
    .note {
      background: rgba(251, 191, 36, 0.1);
      border-left: 3px solid #fbbf24;
      padding: 0.75rem 1rem;
      border-radius: 0 6px 6px 0;
      margin: 1rem 0;
      font-size: 0.9rem;
      color: #fde68a;
    }
    a { color: #a78bfa; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .try-it {
      display: inline-block;
      margin-top: 0.5rem;
      padding: 0.5rem 1rem;
      background: #a78bfa22;
      border: 1px solid #a78bfa44;
      border-radius: 6px;
      color: #a78bfa;
      font-size: 0.85rem;
      cursor: pointer;
      text-decoration: none;
    }
    .try-it:hover { background: #a78bfa33; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Shipping Rates API</h1>
    <p class="subtitle">Get international shipping rates between any two countries.</p>

    <h2>Endpoint</h2>
    <div class="endpoint-box">
      <span class="method">GET</span> /api/rates
    </div>

    <h2>Parameters</h2>
    <table>
      <thead>
        <tr>
          <th>Parameter</th>
          <th>Type</th>
          <th>Required</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>from</code></td>
          <td>string</td>
          <td>Yes</td>
          <td>Origin country (ISO 3166-1 alpha-2 code, e.g. <code>US</code>)</td>
        </tr>
        <tr>
          <td><code>to</code></td>
          <td>string</td>
          <td>Yes</td>
          <td>Destination country (ISO 3166-1 alpha-2 code, e.g. <code>DE</code>)</td>
        </tr>
        <tr>
          <td><code>weight</code></td>
          <td>number</td>
          <td>No</td>
          <td>Package weight in kg (default: <code>1</code>, max: <code>70</code>)</td>
        </tr>
      </tbody>
    </table>

    <h2>Example Request</h2>
    <pre>GET /api/rates?from=US&amp;to=DE&amp;weight=2</pre>
    <a class="try-it" href="/api/rates?from=US&to=DE&weight=2" target="_blank">Try it live &rarr;</a>

    <h2>Example Response</h2>
    <pre>{
  "origin": {
    "code": "US",
    "name": "United States"
  },
  "destination": {
    "code": "DE",
    "name": "Germany"
  },
  "weight_kg": 2,
  "billing_weight_kg": 2,
  "carriers": [
    {
      "name": "USPS",
      "service": "Priority Mail International",
      "price_usd": 42,
      "days_min": 6,
      "days_max": 10,
      "tracking": true
    },
    {
      "name": "DHL Express",
      "service": "Express Worldwide",
      "price_usd": 65,
      "days_min": 2,
      "days_max": 4,
      "tracking": true
    }
  ],
  "_rate_limit": "This API is intended for moderate use. Please cache results and avoid more than 60 requests per minute."
}</pre>

    <h2>Error Responses</h2>

    <h3>400 Bad Request</h3>
    <pre>{
  "error": "Missing required parameters",
  "message": "Both 'from' and 'to' country codes are required."
}</pre>

    <h3>404 Not Found</h3>
    <pre>{
  "error": "Unknown origin country",
  "message": "Country code 'XX' not found."
}</pre>

    <h2>Usage Examples</h2>

    <h3>JavaScript / Fetch</h3>
    <pre><span class="text-muted">// Get rates from US to Germany for a 2kg package</span>
const res = await fetch('/api/rates?from=US&amp;to=DE&amp;weight=2');
const data = await res.json();

console.log(data.carriers);
<span class="text-muted">// [{ name: "USPS", service: "Priority Mail International", price_usd: 42, ... }]</span></pre>

    <h3>Python</h3>
    <pre><span class="text-muted"># pip install requests</span>
import requests

resp = requests.get("https://rateships.com/api/rates", params={
    "from": "US",
    "to": "JP",
    "weight": 5
})
data = resp.json()

for carrier in data["carriers"]:
    print(f"{carrier['name']} - \${carrier['price_usd']} ({carrier['days_min']}-{carrier['days_max']} days)")</pre>

    <h3>cURL</h3>
    <pre>curl "https://rateships.com/api/rates?from=CN&amp;to=US&amp;weight=1"</pre>

    <div class="note">
      <strong>Rate limiting:</strong> Please cache results on your end and limit requests to 60 per minute.
      Prices are approximate and may differ from actual carrier quotes.
    </div>

    <h2>Response Fields</h2>
    <table>
      <thead>
        <tr>
          <th>Field</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>origin</code></td>
          <td>object</td>
          <td>Origin country with <code>code</code> and <code>name</code></td>
        </tr>
        <tr>
          <td><code>destination</code></td>
          <td>object</td>
          <td>Destination country with <code>code</code> and <code>name</code></td>
        </tr>
        <tr>
          <td><code>weight_kg</code></td>
          <td>number</td>
          <td>Requested weight</td>
        </tr>
        <tr>
          <td><code>billing_weight_kg</code></td>
          <td>number</td>
          <td>Nearest available weight bracket used for pricing</td>
        </tr>
        <tr>
          <td><code>carriers[]</code></td>
          <td>array</td>
          <td>List of carriers sorted by price (cheapest first)</td>
        </tr>
        <tr>
          <td><code>carriers[].name</code></td>
          <td>string</td>
          <td>Carrier name</td>
        </tr>
        <tr>
          <td><code>carriers[].service</code></td>
          <td>string</td>
          <td>Service tier name</td>
        </tr>
        <tr>
          <td><code>carriers[].price_usd</code></td>
          <td>number</td>
          <td>Estimated price in USD</td>
        </tr>
        <tr>
          <td><code>carriers[].days_min</code></td>
          <td>number</td>
          <td>Minimum estimated delivery days</td>
        </tr>
        <tr>
          <td><code>carriers[].days_max</code></td>
          <td>number</td>
          <td>Maximum estimated delivery days</td>
        </tr>
        <tr>
          <td><code>carriers[].tracking</code></td>
          <td>boolean</td>
          <td>Whether tracking is available</td>
        </tr>
      </tbody>
    </table>

    <p style="margin-top: 3rem; color: #6b7280; font-size: 0.85rem;">
      &copy; RateShips. Shipping rates are estimates and may vary.
    </p>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
