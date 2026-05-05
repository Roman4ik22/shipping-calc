# GSC Errors Export — 2026-05-05

**Site:** https://rateships.com/
**Service account:** rateships@rateships-new.iam.gserviceaccount.com
**Window:** 44 priority URLs inspected

---

## 1. Sitemap submissions

| Path | Type | Submitted | Last downloaded | Errors | Warnings | Indexed | Pending |
|---|---|---|---|---:|---:|---:|---:|
| `/sitemap.xml` | ? | 2026-03-18T23:26:25.862Z | 2026-04-30T20:14:09.784Z | 0 | 8 | 0 | 3842 |

---

## 2. URL Inspection — indexing + coverage

**Verdict legend:** `PASS` indexable; `NEUTRAL` neither pass nor fail; `PARTIAL` partial issues; `FAIL` not indexable.

### 2.1 Summary by verdict

| Verdict | Count |
|---|---:|
| PASS | 28 |
| NEUTRAL | 16 |

### 2.2 Problem URLs (verdict ≠ PASS)

| URL | Verdict | Coverage | Indexing | Robots | Canonical mismatch | Last crawl |
|---|---|---|---|---|---|---|
| `/en` | NEUTRAL | Crawled - currently not indexed | INDEXING_ALLOWED | ALLOWED | — | 2026-05-04 |
| `/en/customs` | NEUTRAL | URL is unknown to Google | INDEXING_STATE_UNSPECIFIED | ROBOTS_TXT_STATE_UNSPECIFIED | — | never |
| `/en/blog` | NEUTRAL | Crawled - currently not indexed | INDEXING_ALLOWED | ALLOWED | — | 2026-04-10 |
| `/en/guide` | NEUTRAL | Crawled - currently not indexed | INDEXING_ALLOWED | ALLOWED | — | 2026-03-30 |
| `/en/tools` | NEUTRAL | Crawled - currently not indexed | INDEXING_ALLOWED | ALLOWED | — | 2026-04-04 |
| `/en/platforms` | NEUTRAL | Crawled - currently not indexed | INDEXING_ALLOWED | ALLOWED | — | 2026-05-03 |
| `/ru` | NEUTRAL | Crawled - currently not indexed | INDEXING_ALLOWED | ALLOWED | — | 2026-03-28 |
| `/ru/carriers` | NEUTRAL | Crawled - currently not indexed | INDEXING_ALLOWED | ALLOWED | — | 2026-03-30 |
| `/ru/customs` | NEUTRAL | Discovered - currently not indexed | INDEXING_STATE_UNSPECIFIED | ROBOTS_TXT_STATE_UNSPECIFIED | — | never |
| `/ru/blog` | NEUTRAL | Crawled - currently not indexed | INDEXING_ALLOWED | ALLOWED | — | 2026-03-29 |
| `/ru/about` | NEUTRAL | Crawled - currently not indexed | INDEXING_ALLOWED | ALLOWED | — | 2026-03-28 |
| `/en/shipping/united-states-to-united-kingdom` | NEUTRAL | Crawled - currently not indexed | INDEXING_ALLOWED | ALLOWED | — | 2026-04-17 |
| `/en/shipping/china-to-united-states` | NEUTRAL | Crawled - currently not indexed | INDEXING_ALLOWED | ALLOWED | — | 2026-04-09 |
| `/en/shipping/germany-to-france` | NEUTRAL | Crawled - currently not indexed | INDEXING_ALLOWED | ALLOWED | — | 2026-04-08 |
| `/en/blog/cheapest-way-to-ship-internationally` | NEUTRAL | Duplicate without user-selected canonical | INDEXING_ALLOWED | ALLOWED | — | 2026-03-30 |
| `/en/blog/customs-clearance-guide` | NEUTRAL | URL is unknown to Google | INDEXING_STATE_UNSPECIFIED | ROBOTS_TXT_STATE_UNSPECIFIED | — | never |

### 2.3 Coverage states

| State | Count | Meaning |
|---|---:|---|
| Submitted and indexed | 28 | ✅ Healthy — page is in Google's index |
| Crawled - currently not indexed | 12 | ⚠️ Google saw it but chose not to index — often quality / duplicate signal |
| URL is unknown to Google | 2 | — |
| Discovered - currently not indexed | 1 | ⏳ Google knows the URL exists but hasn't crawled yet — often crawl budget or low priority |
| Duplicate without user-selected canonical | 1 | ⚠️ No canonical declared and Google found duplicates — set rel=canonical |

---

## 3. Pages with impressions but zero clicks (last 28d)

These pages are appearing in Google search results (impressions > 50) but nobody clicks (clicks = 0). Indicates SERP-level issues: weak titles, missing rich snippets, displayed for irrelevant queries, or appearing too low.

✅ No page has 50+ impressions with 0 clicks. SERP performance reasonable.

---

## Notes

- Mobile usability and Core Web Vitals errors are no longer exposed via the GSC API (deprecated 2024). Check those manually in Search Console UI → Experience → Page Experience.
- Manual actions and security issues require OAuth scope `siteSettings` which our service account doesn't have. Check manually in GSC UI → Security & Manual actions.
- This report covers 44 priority URLs. To inspect more, edit `PRIORITY_URLS` in `scripts/gsc-errors-export.ts`.

*Generated 2026-05-05*
