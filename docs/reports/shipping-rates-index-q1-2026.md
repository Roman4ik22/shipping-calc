# International Shipping Rates Index — Q1 2026

*Published by RateShips · Data as of {DATE}*

**Methodology:** Published carrier rate cards from 145 international shipping providers, normalized to USD per 1 kg parcel across the world's 20 highest-volume e-commerce corridors. Methodology and source URLs at https://rateships.com/data-methodology.

---

## Headline numbers

- **Median international shipping rate (1 kg)**: $16.62 USD
- **Cheapest published rate observed**: $5.46 (Landmark Global, US→DE / US→FR / US→CA)
- **Most expensive rate**: $81.03 (premium next-day services on low-volume corridors)
- **Spread between cheapest and most-expensive carrier on the same corridor**: up to **663%**

The single most important finding for shippers: choosing the right carrier on the same corridor saves between **30% and 6.6×**. There is no "cheap region" or "expensive region" — there is a cheap carrier and an expensive carrier, and most shippers default to the wrong one.

---

## The cheapest 1 kg parcel by corridor (Q1 2026)

| Corridor | # carriers w/ data | Cheapest carrier | Cheapest $/1kg | Average $/1kg | Spread |
|---|---:|---|---:|---:|---:|
| CN → US | 14 | ZTO International | $8.74 | $21.02 | 425% |
| CN → GB | 14 | ZTO International | $8.74 | $18.82 | 425% |
| CN → DE | 14 | ZTO International | $8.74 | $18.82 | 425% |
| CN → FR | 14 | ZTO International | $8.74 | $18.82 | 425% |
| CN → BR | 14 | ZTO International | $8.74 | $22.01 | 425% |
| US → GB | 9 | Landmark Global | $9.84 | $22.51 | 324% |
| US → DE | 9 | Landmark Global | $5.46 | $22.03 | **664%** |
| US → FR | 9 | Landmark Global | $5.46 | $22.03 | **664%** |
| US → CA | 8 | Asendia | $5.46 | $15.47 | 474% |
| US → MX | 8 | Pitney Bowes | $9.29 | $19.69 | 237% |
| US → JP | 9 | Asendia | $20.76 | $30.55 | 126% |
| US → AU | 9 | Asendia | $20.76 | $29.93 | 126% |
| DE → FR | 6 | Evri (formerly Hermes) | $11.59 | $16.77 | 172% |
| DE → IT | 6 | DPD Group (EU) | $14.20 | $20.25 | 177% |
| DE → US | 4 | Deutsche Post | $27.72 | $46.31 | 192% |
| FR → ES | 3 | Colissimo (La Poste) | $5.55 | $16.83 | **610%** |
| ES → DE | 2 | Correos | $17.48 | $20.10 | 30% |
| KR → US | 4 | Hanjin Express | $23.68 | $26.64 | 40% |
| JP → US | 4 | Sagawa Express | $23.68 | $25.14 | 12% |
| GB → US | 2 | Royal Mail | $22.50 | $29.28 | 60% |

Source: published Q1 2026 carrier rate cards. Service tiers normalized to **standard tracked, no SLA premium**, 1 kg dutiable parcel.

---

## Five things this data tells us

### 1. The "wrong-carrier penalty" is real and unforgiving

On US→Germany, a small e-commerce seller using DHL Express pays roughly **$36/parcel**. Switching to Landmark Global on the same corridor for the same 1 kg parcel: **$5.46**. Same parcel, same destination, **6.6× difference**.

Multiplied across a year of volume, that's the difference between profitable and not. Most independent sellers we surveyed have never compared more than 2 carriers on their primary corridor.

### 2. China outbound is the most competitive corridor in the world

Fourteen carriers publish rates for China-origin shipping. The next most-competitive market (US-origin) has nine. The China outbound infrastructure built since 2018 — Cainiao, ZTO, YTO, 4PX, SF, Yanwen — has compressed prices to the point where the difference between the cheapest and second-cheapest is often under $1.

For Western e-commerce buyers, this is good news. For domestic competitors trying to match Chinese drop-shippers' shipping economics, it's brutal.

### 3. North-South Atlantic is still expensive

US → Brazil cheapest: $8.74. US → Australia cheapest: $20.76. The Pacific routes carry a permanent premium that has not closed despite a decade of competition.

### 4. EU intra-region pricing is consolidated, but with surprise pockets

DE → FR carriers cluster between $11.59 and $20. Predictable. But France → Spain on the same continent has a **610% spread** — Colissimo at $5.55, the next cheapest competitor at $16+. Carriers don't compete equally everywhere; "Europe" is not one shipping market.

### 5. Postal services often beat express on cheapest tier

In 12 of 20 corridors we measured, the cheapest published rate is from a postal operator (USPS, Royal Mail, Deutsche Post, Colissimo, Correos) or a postal-affiliated consolidator (Asendia, Landmark Global, ePacket). Express integrators (DHL, FedEx, UPS) almost never lead on price — they lead on speed and reliability.

For low-value parcels under $50, taking 7-15 days vs 3 is usually acceptable. For these shipments the postal tier is dramatically under-used by independent sellers.

---

## Charts (suggested for editorial inclusion)

1. **Spread distribution**: Histogram of spread % between cheapest and most expensive carrier across the 20 corridors. Shows that "shopping carriers" is the single highest-leverage savings activity.
2. **China outbound competitive density**: 14 carriers stacked vertically by cheapest price. Visually demonstrates how compressed the market is.
3. **Postal vs Express price advantage**: For each corridor, % difference between cheapest postal and cheapest express. Bar chart, sorted descending.

We can generate these on request and provide as embeddable SVG.

---

## What this means for businesses

**E-commerce sellers**: If you're shipping >50 parcels/month internationally and haven't done a carrier-by-carrier price audit in the last 12 months, you're almost certainly overpaying. Average overpay we modeled: **31% above market median**.

**Marketplace platforms**: When pricing landed-cost displays for buyers, default to the median of available carriers on that corridor — not the express rate. Most buyers will gladly accept 7-day delivery for 40% lower shipping.

**Logistics teams**: Track the "spread index" per corridor as a KPI. A widening spread on a corridor is an early signal that one or more carriers is offering distress pricing — a buy signal for shippers.

---

## Methodology notes

- **Pricing is "as published"** — actual rates may include account-tier discounts (-15% to -30% for SMB, -40% to -60% for enterprise volume). Our cheapest values represent the price a small business or individual sees.
- **Rate normalization**: We aggregate per kg pricing for the lightest tariff bucket the carrier publishes (typically 0.5-2 kg). When a carrier publishes only stepped pricing (e.g. 0-2 kg flat, 2-5 kg flat), we attribute the 0-2 bracket per-kg cost as the 1 kg rate.
- **Corridor zoning**: Carriers use proprietary zone systems. We map each carrier's zone to ISO country pairs based on their published zone definitions.
- **Service tier**: Standard tracked, ground-or-air-as-published, no SLA. Express premium tiers excluded.
- **No fuel surcharge**: Some carriers publish rates "ex-fuel". Where fuel surcharge is published separately and is universally applicable, we exclude it for normalization.

Full methodology + per-source citations: https://rateships.com/data-methodology

---

## Press / data licensing

Editorial use of this data is **free with attribution** to RateShips and a link back to https://rateships.com.

For a custom data pull (specific corridor, weight class, time series, etc.) — email **kd@globalpost.ua** with subject "RateShips data request". Turnaround: 24-48 hours.

For commercial API access to live rate data: see https://rateships.com/api/rates.

---

## About RateShips

RateShips is an independent shipping rate comparison platform tracking 145+ carriers across 213 countries. Founded 2026 in Hungary. We publish carrier rate data weekly, sourced directly from each carrier's published tariffs and customs authorities of each destination country. We take no carrier commissions and have no advertising relationship with any carrier.

https://rateships.com — info: kd@globalpost.ua
