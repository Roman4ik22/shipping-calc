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
npm run translate:ui        # UI dictionary — fixes ~1850 placeholder English strings across 10 locales. Run this FIRST.
npm run translate:updates   # smallest, ~30s
npm run translate:carriers  # ~5 min
npm run translate:blog      # ~15-30 min, long-form markdown
npm run translate:customs   # ~30-60 min, 193 countries
```

## What it touches

Translations are scoped by **smart locale routing** — each entity is only translated into locales where it's actually relevant, matching the page routing rules in `src/lib/*-locales.ts`. No point translating Nova Poshta into Japanese.

| Target    | File                                    | Relevant locales                                     | What gets filled                                        |
|-----------|-----------------------------------------|------------------------------------------------------|---------------------------------------------------------|
| ui        | `src/lib/i18n.ts`                       | all 10 non-EN/RU locales                             | Any UI key whose value equals the English value (i.e. untranslated placeholder) |
| updates   | `src/app/[locale]/updates/page.tsx`     | all 12 (global changelog)                            | `title_*` and `desc_*` for all entries                  |
| carriers  | `src/data/carriers.json`                | Global carriers (DHL/FedEx/UPS/etc): all 12. Country-specific carriers: origin country's langs + en only | `description_*`              |
| blog      | `src/data/blog-posts.ts`                | Region-tagged posts: that region's langs + en. Generic posts: all 12 | `title_*`, `excerpt_*`, `content_*`  |
| customs   | `src/data/customs-deep.ts`              | country's own langs + en only                        | `clearance_process_*`, `certificate_of_origin_*`, `import_license_info_*`, `customs_reality_*`, `category_*` per duty_rate |

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

## Rough cost estimate (Sonnet 4.6, with smart locale routing)

- ui: ~$1-2 (~1850 short UI strings)
- updates: ~$0.10 (all 12 locales)
- carriers: ~$0.30-0.60 (global carriers all 12; country-specific 1-2 locales)
- blog: ~$3-6 (region posts 1-2 locales; generic posts all 12)
- customs: ~$3-5 (each country 1-2 locales)

**Total ~$8-14** — vs. ~$25-50 if we translated everything into all 10 non-EN/RU locales. Use Haiku (`claude-haiku-4-5-20251001`) for ~5× cheaper if quality is acceptable.

## After running

1. Review a few random samples (e.g. open `src/data/blog-posts.ts` and check `title_ja`).
2. `npm run build` to verify everything still compiles.
3. Commit the data file changes.
