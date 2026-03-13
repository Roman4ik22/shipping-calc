const fs = require('fs');
const db = JSON.parse(fs.readFileSync('/Users/romankolosovskiy/калькулятор доставки для доставки во все страны/regional_carriers_database.json', 'utf8'));
const existing = JSON.parse(fs.readFileSync('src/data/carriers.json', 'utf8'));
const existingIds = new Set(existing.map(c => c.id));

function slugify(name) {
  return name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function parseDeliveryTimes(dt) {
  const services = [];
  for (const [key, val] of Object.entries(dt)) {
    const match = String(val).match(/(\d+)(?:-(\d+))?\s*(?:day|week|month)?/i);
    if (match) {
      let min = parseInt(match[1]);
      let max = match[2] ? parseInt(match[2]) : min;
      if (String(val).includes('week')) { min *= 7; max *= 7; }
      services.push({ key, min, max });
    }
  }
  return services;
}

function getCarrierType(regionKey) {
  if (['europe_budget', 'cross_border_specialists'].includes(regionKey)) return 'international';
  return 'regional';
}

// Skip platform-only or domestic-only services
const skipNames = new Set([
  'WishPost', 'Joom Logistics', 'PickPoint',
  '5Post (Pyaterochka Post)', 'Sberlogistika (Сберлогистика)',
  'J&T Express (SEA)', 'Ninja Van', 'Cainiao Network', 'CDEK (СДЭК)',
  'Pos Laju (Pos Malaysia)', 'Correios Brazil'
]);

const newCarriers = [];
for (const [regionKey, region] of Object.entries(db.regions)) {
  for (const c of region.carriers) {
    if (skipNames.has(c.name)) continue;
    const id = slugify(c.name);
    if (existingIds.has(id)) continue;

    const dtServices = parseDeliveryTimes(c.delivery_times || {});
    const services = [];

    if (dtServices.length > 0) {
      const express = dtServices.find(s => s.key.includes('express') || s.key.includes('expedit') || s.key.includes('air'));
      const standard = dtServices.find(s => s.key.includes('standard') || s.key.includes('regular') || s.key.includes('regional') || s.key.includes('domestic'));
      const economy = dtServices.find(s => s.key.includes('economy') || s.key.includes('sea') || s.key.includes('surface'));

      if (express) services.push({ id: id + '-express', name: 'Express', speed_days_min: express.min, speed_days_max: express.max, max_weight_kg: c.max_weight_kg || 30, tracking: c.tracking });
      if (standard) services.push({ id: id + '-standard', name: 'Standard', speed_days_min: standard.min, speed_days_max: standard.max, max_weight_kg: c.max_weight_kg || 30, tracking: c.tracking });
      if (economy) services.push({ id: id + '-economy', name: 'Economy', speed_days_min: economy.min, speed_days_max: economy.max, max_weight_kg: c.max_weight_kg || 30, tracking: c.tracking });

      if (services.length === 0) {
        const first = dtServices[0];
        services.push({ id: id + '-standard', name: 'Standard', speed_days_min: first.min, speed_days_max: first.max, max_weight_kg: c.max_weight_kg || 30, tracking: c.tracking });
      }
    } else {
      services.push({ id: id + '-standard', name: 'Standard', speed_days_min: 5, speed_days_max: 14, max_weight_kg: c.max_weight_kg || 30, tracking: c.tracking });
    }

    const hasWideReach = c.countries && c.countries.some(cc =>
      cc.includes('Worldwide') || cc.includes('200+') || cc.includes('220+') || cc.includes('240+') || cc.includes('150+') || cc.includes('160+') || cc.includes('100+')
    );
    let type = hasWideReach ? 'international' : getCarrierType(regionKey);
    // Most are regional even if they reach many countries
    if (type === 'international') type = 'regional';

    newCarriers.push({
      id,
      name: c.name,
      type,
      logo: '/logos/' + id + '.svg',
      website: c.website,
      tracking_url: c.tracking_url.replace('{tracking_number}', '{tracking}'),
      description_en: c.description_en,
      description_ru: c.description_ru,
      services
    });
  }
}

console.log('New carriers to add:', newCarriers.length);
console.log('Existing carriers:', existing.length);
console.log('Total after merge:', existing.length + newCarriers.length);

const merged = [...existing, ...newCarriers];
fs.writeFileSync('src/data/carriers.json', JSON.stringify(merged, null, 2));
console.log('Written merged carriers.json');
