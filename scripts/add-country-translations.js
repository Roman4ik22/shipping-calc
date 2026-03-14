#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const COUNTRIES_PATH = path.join(__dirname, '..', 'src', 'data', 'countries.json');

const LANGUAGES = ['es', 'de', 'fr', 'pt', 'zh', 'ja', 'ko', 'ar', 'tr', 'it'];

// Hardcoded fallbacks for countries where Intl.DisplayNames may not return a good result
// (e.g., returns the code itself, or a name that differs from common usage)
const FALLBACKS = {
  // Kosovo (XK is user-assigned, not in ISO 3166-1 officially)
  XK: {
    es: 'Kosovo', de: 'Kosovo', fr: 'Kosovo', pt: 'Kosovo',
    zh: '科索沃', ja: 'コソボ', ko: '코소보', ar: 'كوسوفو', tr: 'Kosova', it: 'Kosovo'
  },
  // Eswatini (formerly Swaziland) — some older ICU data may not have it
  SZ: {
    es: 'Esuatini', de: 'Eswatini', fr: 'Eswatini', pt: 'Essuatíni',
    zh: '斯威士兰', ja: 'エスワティニ', ko: '에스와티니', ar: 'إسواتيني', tr: 'Esvatini', it: 'Eswatini'
  },
};

function main() {
  const countries = JSON.parse(fs.readFileSync(COUNTRIES_PATH, 'utf-8'));

  // Create DisplayNames instances for each language
  const displayNamesMap = {};
  for (const lang of LANGUAGES) {
    try {
      displayNamesMap[lang] = new Intl.DisplayNames([lang], { type: 'region' });
    } catch (e) {
      console.error(`Failed to create DisplayNames for ${lang}:`, e.message);
    }
  }

  let fallbackCount = 0;
  let intlCount = 0;

  const updated = countries.map((country) => {
    const { code, name_en, name_ru, slug_en, slug_ru, region, continent } = country;

    const newCountry = { code, name_en, name_ru };

    for (const lang of LANGUAGES) {
      const key = `name_${lang}`;

      // Check hardcoded fallback first
      if (FALLBACKS[code] && FALLBACKS[code][lang]) {
        newCountry[key] = FALLBACKS[code][lang];
        fallbackCount++;
        continue;
      }

      // Try Intl.DisplayNames
      let intlName = null;
      if (displayNamesMap[lang]) {
        try {
          intlName = displayNamesMap[lang].of(code);
        } catch (e) {
          // code not recognized
        }
      }

      // If Intl returned something useful (not the code itself, not undefined/null)
      if (intlName && intlName !== code && intlName.length > 0) {
        newCountry[key] = intlName;
        intlCount++;
      } else {
        // Ultimate fallback: use English name
        newCountry[key] = name_en;
        fallbackCount++;
        console.warn(`  Warning: Using English fallback for ${code} in ${lang}`);
      }
    }

    // Preserve remaining fields in original order
    newCountry.slug_en = slug_en;
    newCountry.slug_ru = slug_ru;
    newCountry.region = region;
    newCountry.continent = continent;

    return newCountry;
  });

  // Write out with nice formatting (one country per line, like original)
  const lines = updated.map(c => '  ' + JSON.stringify(c));
  const output = '[\n' + lines.join(',\n') + '\n]\n';

  fs.writeFileSync(COUNTRIES_PATH, output, 'utf-8');

  console.log(`Done! Updated ${updated.length} countries.`);
  console.log(`  Intl.DisplayNames: ${intlCount} translations`);
  console.log(`  Fallbacks: ${fallbackCount} translations`);
}

main();
