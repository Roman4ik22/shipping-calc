# Project: RateShips

International shipping rate comparison tool. 213 countries, 134 carriers, 45K+ routes. Dark-themed, data-heavy, mobile-first.

## Tech Stack
- Next.js 16 (App Router, RSC), React 19, TypeScript
- Tailwind CSS 4 with custom @theme tokens
- No component library — all custom components
- Deployed on Vercel

## Architecture
- `/src/app/[locale]/` — pages with i18n (12 locales)
- `/src/components/` — UI components (client + server)
- `/src/lib/` — data, i18n, utils (server-only)
- `/src/data/` — JSON data files (countries, carriers, customs, corridors)
- `/scripts/` — CLI tools (scraping, GSC/GA audit, indexing)

## Code Style
- Server Components by default; "use client" only when needed (interactivity)
- i18n via `t(locale, key, vars)` from `@/lib/i18n` — no external i18n library
- Inline ternary for ru/en text when only 2 variants needed: `locale === "ru" ? "..." : "..."`
- `prefetch={false}` on non-critical Links (country lists, route grids)
- No unnecessary abstractions — inline is fine for one-off logic

## UI/UX Conventions

### Design Tokens (defined in globals.css @theme)
- Background: `bg-[#0a0a0a]` (body), `bg-card` (#161616), `bg-card-hover` (#1c1c1c), `bg-surface` (#111111)
- Accent: `text-accent-light` (#2997ff), `bg-accent` (#0071e3), `hover:bg-accent-dark` (#0059b3)
- Text hierarchy: `text-white` (headings), `text-gray-300` (body), `text-gray-400` (secondary), `text-gray-500` (muted), `text-gray-600` (disabled)
- Radii: `rounded-2xl` (cards), `rounded-full` (buttons, pills), `rounded-lg` (inputs)
- Font: Inter 400/500/600/700

### Design Principles
1. **Data-first** — show numbers (prices, days, counts) prominently; decorative elements only if functional
2. **Scannable** — users compare rates across carriers; use tables, grids, clear hierarchy
3. **Minimal chrome** — dark theme, subtle borders (`border-white/5`, `border-white/10`), no heavy shadows
4. **Progressive disclosure** — show key info first, details on expand/click (ExpandableGrid, details/summary)
5. **Trust signals** — verified badges, methodology links, last-updated dates

### Anti-patterns (NEVER do)
- Bright gradients or colorful backgrounds — this is a dark, professional tool
- Card layouts where a simple list/table would work better
- Placeholder-only inputs without visible labels
- Decorative icons that don't convey meaning
- Lorem ipsum or fake data — always use real carrier/country data

### Component Patterns
- Cards: `bg-card hover:bg-card-hover rounded-2xl p-4-6 transition-colors`
- Pill buttons: `bg-card-hover rounded-full px-3-4 py-1.5-2 text-sm text-gray-400 hover:text-white`
- Section spacing: `py-8` between sections, `mt-8` / `mt-12` for major sections
- Section dividers: `border-t border-white/5` (subtle) or `py-8 border-t border-white/5` (with padding)
- Interactive elements: minimum 44px touch target on mobile
- External links: always `target="_blank" rel="noopener noreferrer nofollow"`
- Self-referencing navigation: use NavLink component (renders `<span>` for current page)
- Long lists (>12 items): use ExpandableGrid component with "Show all" button

### Responsive
- Mobile-first: base → sm(640) → md(768) → lg(1024) → xl(1280)
- Navigation: burger on mobile (MobileMenu), horizontal on desktop
- Tables: horizontal scroll on mobile (`overflow-x-auto`)
- Grids: 1 col → 2 col → 3-4 col → 6 col for country lists

### Accessibility
- All interactive elements must have visible focus states
- `aria-label` on icon-only buttons
- `aria-current="page"` on active navigation items (NavLink handles this)
- Semantic HTML: `<nav>`, `<section>`, `<details>`, `<table>` where appropriate
- Color contrast: text-gray-400 on #0a0a0a background = 7.4:1 ratio (passes AA)

## SEO
- Every page needs: unique title (<60 chars ideal), meta description (<155 chars), canonical URL, hreflang alternates
- Corridor titles include year and price: "{origin} to {destination} Shipping Rates [2026] — From ${cheapest}/kg"
- JSON-LD on every page: BreadcrumbList, FAQPage (where applicable), Service+AggregateOffer (corridors)
- Breadcrumbs on corridors: Shipping Rates → Ship to {dest} → Ship from {origin}
- Internal links budget: aim for <100 per page (use ExpandableGrid for overflow)
- External links: always nofollow on carrier/tracking/review links

## Commands
- `npm run dev` — start dev server
- `npm run build` — production build (also validates all pages generate)
- `npx tsx scripts/gsc-audit.ts` — Google Search Console audit
- `npx tsx scripts/ga-audit.ts` — Google Analytics audit
