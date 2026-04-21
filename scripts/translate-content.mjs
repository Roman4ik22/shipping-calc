#!/usr/bin/env node
// Translate missing locale fields across data files using Claude API.
//
// Requirements:
//   - ANTHROPIC_API_KEY env var
//   - Node 20+ (global fetch)
//
// Usage:
//   ANTHROPIC_API_KEY=sk-ant-... node scripts/translate-content.mjs [target]
//
// Targets: updates | carriers | blog | customs | all  (default: all)
//
// Resumable: only fills fields that are missing. Safe to re-run.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const LOCALES = ["es", "de", "fr", "pt", "zh", "ja", "ko", "ar", "tr", "it"];

const LOCALE_NAMES = {
  es: "Spanish (Spain)",
  de: "German",
  fr: "French",
  pt: "Portuguese (European)",
  zh: "Simplified Chinese",
  ja: "Japanese",
  ko: "Korean",
  ar: "Arabic (MSA)",
  tr: "Turkish",
  it: "Italian",
};

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  console.error("ERROR: ANTHROPIC_API_KEY env var is required.");
  console.error("Get a key at https://console.anthropic.com, then:");
  console.error("  export ANTHROPIC_API_KEY=sk-ant-...");
  process.exit(1);
}

const MODEL = process.env.TRANSLATE_MODEL || "claude-sonnet-4-6";
const CONCURRENCY = Number(process.env.TRANSLATE_CONCURRENCY || 4);
const TARGET = process.argv[2] || "all";

let totalCalls = 0;
let totalTokensIn = 0;
let totalTokensOut = 0;

async function callClaude(systemPrompt, userMessage) {
  const body = {
    model: MODEL,
    max_tokens: 8192,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  };
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Claude API ${res.status}: ${text}`);
  }
  const json = await res.json();
  totalCalls++;
  if (json.usage) {
    totalTokensIn += json.usage.input_tokens || 0;
    totalTokensOut += json.usage.output_tokens || 0;
  }
  const out = json.content?.[0]?.text;
  if (!out) throw new Error(`Empty response: ${JSON.stringify(json).slice(0, 300)}`);
  return out;
}

// Batch translate multiple English strings to one target locale.
// Returns a parallel array of translations.
async function translateBatch(englishStrings, targetLocale, contextHint = "") {
  const sys = `You are a professional translator for an international shipping rate comparison website called RateShips. Translate the given English strings to ${LOCALE_NAMES[targetLocale]}.

Rules:
- Return ONLY a JSON array of translated strings, in the same order as input. No preamble, no code fences, no markdown.
- Preserve Markdown formatting (headings, lists, **bold**, links) exactly.
- Preserve placeholders like {count}, {country}, {origin}, {destination}, $X, XX% unchanged.
- Keep carrier/brand names unchanged (DHL, FedEx, UPS, USPS, EMS, Royal Mail, etc.).
- Keep country code abbreviations (US, GB, DE, CN, etc.) unchanged.
- Use natural, fluent ${LOCALE_NAMES[targetLocale]}. Tone: practical, informative, concise.
- Do not translate URLs.
- For Arabic: use MSA, right-to-left text is handled by the frontend.
- For Chinese: use Simplified Chinese (mainland China conventions).
${contextHint ? "\nContext: " + contextHint : ""}`;

  const user = `Translate these ${englishStrings.length} strings to ${LOCALE_NAMES[targetLocale]}. Return JSON array only.

INPUT:
${JSON.stringify(englishStrings, null, 2)}`;

  const raw = await callClaude(sys, user);

  // Strip code fences if the model added them
  let cleaned = raw.trim();
  const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (fenceMatch) cleaned = fenceMatch[1].trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (e) {
    throw new Error(`Failed to parse JSON from model output:\n${raw.slice(0, 500)}\n\nError: ${e.message}`);
  }
  if (!Array.isArray(parsed) || parsed.length !== englishStrings.length) {
    throw new Error(`Expected array of ${englishStrings.length} items, got ${Array.isArray(parsed) ? parsed.length : typeof parsed}`);
  }
  return parsed;
}

async function translateInBatches(items, getEnglish, getContext, setTranslation, batchSize = 8) {
  // items: array of { obj, locale, field } to fill.
  // Group by locale so each API call produces same-target translations.
  const byLocale = {};
  for (const item of items) {
    (byLocale[item.locale] ||= []).push(item);
  }

  for (const [locale, list] of Object.entries(byLocale)) {
    for (let i = 0; i < list.length; i += batchSize) {
      const chunk = list.slice(i, i + batchSize);
      const englishStrings = chunk.map((x) => getEnglish(x));
      const context = chunk.map((x) => getContext(x)).filter(Boolean).join("; ").slice(0, 200);
      process.stdout.write(`  [${locale}] batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(list.length / batchSize)} (${chunk.length} strings)... `);
      try {
        const translations = await translateBatch(englishStrings, locale, context);
        chunk.forEach((item, idx) => setTranslation(item, translations[idx]));
        console.log("ok");
      } catch (e) {
        console.error(`\n  ERROR on locale=${locale} batch=${i}: ${e.message}`);
        console.error("  Continuing with next batch. Re-run the script to retry failed entries.");
      }
    }
  }
}

// ---- TARGET: updates ----
async function translateUpdates() {
  const file = path.join(ROOT, "src/app/[locale]/updates/page.tsx");
  let src = fs.readFileSync(file, "utf8");

  // Extract the array literal between `const updates: UpdateEntry[] = [` and the matching `];`
  const startMatch = src.match(/const updates: UpdateEntry\[\] = \[/);
  if (!startMatch) throw new Error("Could not find `const updates: UpdateEntry[] = [` in updates/page.tsx");
  const startIdx = startMatch.index + startMatch[0].length;

  // Find matching closing `];` — simple bracket counting
  let depth = 1;
  let i = startIdx;
  while (i < src.length && depth > 0) {
    const ch = src[i];
    if (ch === "[") depth++;
    else if (ch === "]") depth--;
    if (depth === 0) break;
    i++;
  }
  const arrayBody = src.slice(startIdx, i);

  // Parse entries — crude but works for this file format.
  // Each entry looks like: { date: "...", title_en: "...", ..., tags: [...] }
  // Use eval in a safe VM? Easier: match `{...}` top-level blocks.
  const entries = [];
  let buf = "";
  let bd = 0;
  for (const ch of arrayBody) {
    if (ch === "{") { if (bd === 0) buf = ""; bd++; buf += ch; }
    else if (ch === "}") { bd--; buf += ch; if (bd === 0) { entries.push(buf); buf = ""; } }
    else if (bd > 0) buf += ch;
  }

  const work = [];
  const parsedEntries = entries.map((block) => {
    // Extract title_en / desc_en values
    const getField = (name) => {
      const m = block.match(new RegExp(`${name}\\s*:\\s*("([^"\\\\]*(?:\\\\.[^"\\\\]*)*)"|\`([^\`\\\\]*(?:\\\\.[^\`\\\\]*)*)\`)`, "s"));
      if (!m) return null;
      return (m[2] ?? m[3] ?? "").replace(/\\n/g, "\n").replace(/\\"/g, '"').replace(/\\`/g, "`");
    };
    return {
      block,
      title_en: getField("title_en"),
      desc_en: getField("desc_en"),
      existingLocales: new Set(LOCALES.filter((l) => new RegExp(`title_${l}\\s*:`).test(block))),
    };
  });

  // Build work list
  for (const entry of parsedEntries) {
    for (const locale of LOCALES) {
      if (!entry.existingLocales.has(locale)) {
        if (entry.title_en) work.push({ entry, locale, field: "title", english: entry.title_en });
        if (entry.desc_en) work.push({ entry, locale, field: "desc", english: entry.desc_en });
      }
    }
  }

  console.log(`\n=== UPDATES: ${work.length} strings to translate ===`);
  if (work.length === 0) return;

  await translateInBatches(
    work,
    (x) => x.english,
    () => "Changelog entry for shipping rate comparison website",
    (x, translated) => {
      x.translated = translated;
    },
  );

  // Splice translations into each entry block
  for (const entry of parsedEntries) {
    const additions = [];
    for (const item of work.filter((w) => w.entry === entry && w.translated)) {
      const escaped = JSON.stringify(item.translated);
      additions.push(`    ${item.field}_${item.locale}: ${escaped},`);
    }
    if (additions.length === 0) continue;
    // Insert before final closing brace of block
    const before = entry.block.replace(/\}\s*$/, "");
    const newBlock = before + "\n" + additions.join("\n") + "\n  }";
    const oldBlock = entry.block;
    src = src.replace(oldBlock, newBlock);
  }

  fs.writeFileSync(file, src);
  console.log(`Wrote ${file}`);
}

// ---- TARGET: carriers (description) ----
async function translateCarriers() {
  const file = path.join(ROOT, "src/data/carriers.json");
  const data = JSON.parse(fs.readFileSync(file, "utf8"));

  const work = [];
  for (const carrier of data) {
    if (!carrier.description_en) continue;
    for (const locale of LOCALES) {
      const key = `description_${locale}`;
      if (!carrier[key] || carrier[key].length === 0) {
        work.push({ carrier, locale, english: carrier.description_en });
      }
    }
  }

  console.log(`\n=== CARRIERS: ${work.length} descriptions to translate ===`);
  if (work.length === 0) return;

  await translateInBatches(
    work,
    (x) => x.english,
    (x) => `Description of shipping carrier "${x.carrier.name}"`,
    (x, translated) => {
      x.carrier[`description_${x.locale}`] = translated;
    },
    10,
  );

  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
  console.log(`Wrote ${file}`);
}

// ---- TARGET: blog ----
async function translateBlog() {
  const file = path.join(ROOT, "src/data/blog-posts.ts");
  let src = fs.readFileSync(file, "utf8");

  // Parse post blocks (top-level `{ id: "...", ... }` inside the array)
  const arrayStart = src.indexOf("export const blogPosts: BlogPost[] = [");
  if (arrayStart === -1) throw new Error("Could not find blogPosts array");
  const startIdx = src.indexOf("[", arrayStart) + 1;

  // Find posts as top-level { ... } blocks
  const posts = [];
  let depth = 0;
  let buf = "";
  let startPos = -1;
  for (let i = startIdx; i < src.length; i++) {
    const ch = src[i];
    if (depth === 0 && ch === "]") break;
    if (ch === "{") { if (depth === 0) startPos = i; depth++; }
    if (depth > 0) buf += ch;
    if (ch === "}") { depth--; if (depth === 0) { posts.push({ block: buf, startPos, endPos: i + 1 }); buf = ""; } }
  }

  const FIELDS = ["title", "excerpt", "content"];

  const getField = (block, name) => {
    // Handles both "..." and `...` quoted values
    const m = block.match(new RegExp(`${name}_en\\s*:\\s*("((?:[^"\\\\]|\\\\.)*)"|\`((?:[^\`\\\\]|\\\\.)*)\`)`, "s"));
    if (!m) return null;
    let val = m[2] ?? m[3] ?? "";
    // Unescape
    val = val.replace(/\\"/g, '"').replace(/\\`/g, "`").replace(/\\\\/g, "\\").replace(/\\n/g, "\n");
    return val;
  };

  const hasField = (block, name, locale) => new RegExp(`${name}_${locale}\\s*:`).test(block);

  const work = [];
  for (const post of posts) {
    for (const field of FIELDS) {
      const english = getField(post.block, field);
      if (!english) continue;
      for (const locale of LOCALES) {
        if (!hasField(post.block, field, locale)) {
          work.push({ post, field, locale, english });
        }
      }
    }
  }

  console.log(`\n=== BLOG: ${work.length} fields to translate (${posts.length} posts)`);
  if (work.length === 0) return;

  await translateInBatches(
    work,
    (x) => x.english,
    (x) => `Blog post ${x.field} field`,
    (x, translated) => {
      x.translated = translated;
    },
    6, // smaller batches since content is long
  );

  // Rewrite file — splice translations per post
  // Work sorted by post position descending so edits don't shift indices.
  posts.sort((a, b) => b.startPos - a.startPos);

  for (const post of posts) {
    const postWork = work.filter((w) => w.post === post && w.translated);
    if (postWork.length === 0) continue;
    let additions = "";
    for (const w of postWork) {
      const escaped = w.translated.includes("\n")
        ? "`" + w.translated.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\${/g, "\\${") + "`"
        : JSON.stringify(w.translated);
      additions += `\n    ${w.field}_${w.locale}: ${escaped},`;
    }
    // Insert before the closing } of the post block
    const oldBlock = post.block;
    const newBlock = oldBlock.replace(/\}\s*$/, additions + "\n  }");
    src = src.slice(0, post.startPos) + newBlock + src.slice(post.endPos);
  }

  fs.writeFileSync(file, src);
  console.log(`Wrote ${file}`);
}

// ---- TARGET: customs ----
async function translateCustoms() {
  // customs-deep.ts is pure TS object literal — we'll exec it via dynamic import trick,
  // but simpler: use regex parsing country-by-country and splice translations.
  const file = path.join(ROOT, "src/data/customs-deep.ts");
  let src = fs.readFileSync(file, "utf8");

  // Find each country entry: `  US: { ... },`
  const countryStart = /^\s{2}([A-Z]{2}):\s*\{/gm;
  const countries = [];
  let m;
  while ((m = countryStart.exec(src))) {
    const code = m[1];
    // Find matching closing brace
    let i = m.index + m[0].length;
    let depth = 1;
    while (i < src.length && depth > 0) {
      const ch = src[i];
      if (ch === "{") depth++;
      else if (ch === "}") depth--;
      if (depth === 0) break;
      i++;
    }
    const blockStart = m.index;
    const blockEnd = i + 1;
    const block = src.slice(blockStart, blockEnd);
    countries.push({ code, block, blockStart, blockEnd });
  }

  const TEXT_FIELDS = [
    "clearance_process",
    "certificate_of_origin",
    "import_license_info",
    "customs_reality",
  ];

  const getField = (block, fieldPrefix) => {
    const m = block.match(new RegExp(`${fieldPrefix}_en\\s*:\\s*("((?:[^"\\\\]|\\\\.)*)"|'((?:[^'\\\\]|\\\\.)*)'|\`((?:[^\`\\\\]|\\\\.)*)\`)`, "s"));
    if (!m) return null;
    let val = m[2] ?? m[3] ?? m[4] ?? "";
    val = val.replace(/\\"/g, '"').replace(/\\'/g, "'").replace(/\\`/g, "`").replace(/\\\\/g, "\\").replace(/\\n/g, "\n");
    return val;
  };
  const hasField = (block, field, locale) => new RegExp(`${field}_${locale}\\s*:`).test(block);

  const work = [];
  for (const country of countries) {
    for (const field of TEXT_FIELDS) {
      const english = getField(country.block, field);
      if (!english) continue;
      for (const locale of LOCALES) {
        if (!hasField(country.block, field, locale)) {
          work.push({ country, field, locale, english });
        }
      }
    }

    // duty_rates array: translate each `category_en` value
    const dutyMatches = [...country.block.matchAll(/\{\s*category_en:\s*('([^']*)'|"([^"]*)")[\s\S]*?\}/g)];
    for (const dm of dutyMatches) {
      const categoryEn = dm[2] ?? dm[3];
      const rateBlock = dm[0];
      for (const locale of LOCALES) {
        if (!new RegExp(`category_${locale}\\s*:`).test(rateBlock)) {
          work.push({
            country,
            field: "category",
            locale,
            english: categoryEn,
            dutyRateBlock: rateBlock,
            isDutyRate: true,
          });
        }
      }
    }
  }

  console.log(`\n=== CUSTOMS: ${work.length} fields to translate (${countries.length} countries)`);
  if (work.length === 0) return;

  await translateInBatches(
    work,
    (x) => x.english,
    (x) => `Customs/import info for ${x.country.code}, field: ${x.field}`,
    (x, translated) => {
      x.translated = translated;
    },
    10,
  );

  // Splice translations — do per-country from bottom to top
  countries.sort((a, b) => b.blockStart - a.blockStart);

  for (const country of countries) {
    const countryWork = work.filter((w) => w.country === country && w.translated);
    if (countryWork.length === 0) continue;

    let newBlock = country.block;

    // duty_rates
    const dutyWork = countryWork.filter((w) => w.isDutyRate);
    const dutyByRate = {};
    for (const w of dutyWork) {
      (dutyByRate[w.dutyRateBlock] ||= []).push(w);
    }
    for (const [rateBlock, items] of Object.entries(dutyByRate)) {
      let additions = "";
      for (const it of items) {
        additions += `, category_${it.locale}: ${JSON.stringify(it.translated)}`;
      }
      const replaced = rateBlock.replace(/(category_en:\s*(?:'[^']*'|"[^"]*"))/, `$1${additions}`);
      newBlock = newBlock.replace(rateBlock, replaced);
    }

    // Top-level text fields
    const topWork = countryWork.filter((w) => !w.isDutyRate);
    let topAdditions = "";
    for (const w of topWork) {
      const escaped = w.translated.includes("\n")
        ? "`" + w.translated.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\${/g, "\\${") + "`"
        : JSON.stringify(w.translated);
      topAdditions += `\n    ${w.field}_${w.locale}: ${escaped},`;
    }
    if (topAdditions) {
      newBlock = newBlock.replace(/\s*\}\s*$/, topAdditions + "\n  }");
    }

    src = src.slice(0, country.blockStart) + newBlock + src.slice(country.blockEnd);
  }

  fs.writeFileSync(file, src);
  console.log(`Wrote ${file}`);
}

// ---- MAIN ----
async function main() {
  console.log(`Using model: ${MODEL}`);
  console.log(`Target: ${TARGET}\n`);

  try {
    if (TARGET === "all" || TARGET === "updates") await translateUpdates();
    if (TARGET === "all" || TARGET === "carriers") await translateCarriers();
    if (TARGET === "all" || TARGET === "blog") await translateBlog();
    if (TARGET === "all" || TARGET === "customs") await translateCustoms();
  } finally {
    console.log(`\n--- Summary ---`);
    console.log(`API calls: ${totalCalls}`);
    console.log(`Input tokens: ${totalTokensIn.toLocaleString()}`);
    console.log(`Output tokens: ${totalTokensOut.toLocaleString()}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
