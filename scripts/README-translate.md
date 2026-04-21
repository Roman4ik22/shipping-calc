# Content translation

`scripts/translate-content.mjs` fills in missing locale fields (`_es`, `_de`, `_fr`, `_pt`, `_zh`, `_ja`, `_ko`, `_ar`, `_tr`, `_it`) across the data files using the Claude API.

## One-time setup

1. Get an Anthropic API key at https://console.anthropic.com
2. Export it:
   ```bash
   export ANTHROPIC_API_KEY=sk-ant-...
   ```

## Run

Translate everything:

```bash
npm run translate
```

Or one target at a time (recommended for the first pass, since customs is large):

```bash
npm run translate:updates   # smallest, ~30s
npm run translate:carriers  # ~5 min
npm run translate:blog      # ~15-30 min, long-form markdown
npm run translate:customs   # ~30-60 min, 193 countries
```

## What it touches

| Target    | File                                    | What gets filled                                        |
|-----------|-----------------------------------------|---------------------------------------------------------|
| updates   | `src/app/[locale]/updates/page.tsx`     | `title_*` and `desc_*` for all entries                  |
| carriers  | `src/data/carriers.json`                | `description_*` for all carriers                        |
| blog      | `src/data/blog-posts.ts`                | `title_*`, `excerpt_*`, `content_*` for each post       |
| customs   | `src/data/customs-deep.ts`              | `clearance_process_*`, `certificate_of_origin_*`, `import_license_info_*`, `customs_reality_*`, and `category_*` in each `duty_rates` entry |

## Safety

- **Idempotent**: only fills keys that are missing. Safe to re-run.
- **Crash-safe**: writes after each batch. If a batch fails, subsequent batches continue; re-run to fill the gaps.
- **Never overwrites**: existing `_en` / `_ru` / manually translated strings are preserved.

## Options

```bash
TRANSLATE_MODEL=claude-sonnet-4-6 npm run translate        # default
TRANSLATE_MODEL=claude-haiku-4-5-20251001 npm run translate  # cheaper, faster
TRANSLATE_CONCURRENCY=8 npm run translate                  # default 4
```

## Rough cost estimate (Sonnet 4.6)

- updates: ~$0.10
- carriers: ~$1-2
- blog: ~$10-20
- customs: ~$15-30

**Total ~$25-50** for a complete translation run across 10 non-EN/RU locales. Use Haiku (`claude-haiku-4-5-20251001`) for ~5× cheaper if quality is acceptable.

## After running

1. Review a few random samples (e.g. open `src/data/blog-posts.ts` and check `title_ja`).
2. `npm run build` to verify everything still compiles.
3. Commit the data file changes.
