import { Metadata } from "next";
import { t, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { HeroH1, FloatingShape, TiltCard, MagneticCTA, CountUp } from "@/components/HeroMotion";
import Link from "next/link";

export function generateStaticParams() {
  // English-only — design system is internal/team-facing, not localized.
  return [{ locale: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Design System — RateShips",
    description:
      "Color tokens, typography scale, spacing, motion primitives, and component examples for the RateShips v2 design system.",
    alternates: { canonical: `/${locale}/design-system` },
    robots: { index: false, follow: true },
  };
}

const colorGroups: { name: string; tokens: { name: string; cssVar: string; hex: string; note?: string }[] }[] = [
  {
    name: "Surfaces",
    tokens: [
      { name: "bg", cssVar: "--color-bg", hex: "#FAF7F2", note: "Page background — warm ivory" },
      { name: "bg-alt", cssVar: "--color-bg-alt", hex: "#EFEAE2", note: "Section accent / subtle stripe" },
      { name: "card", cssVar: "--color-card", hex: "#FFFFFF", note: "Card / floating element surface" },
      { name: "card-hover", cssVar: "--color-card-hover", hex: "#F8F5EF", note: "Hover state on cards" },
    ],
  },
  {
    name: "Ink & body",
    tokens: [
      { name: "ink", cssVar: "--color-ink", hex: "#0F172A", note: "Headings, primary text" },
      { name: "ink-2", cssVar: "--color-ink-2", hex: "#1E293B", note: "Secondary headings" },
      { name: "body", cssVar: "--color-body", hex: "#3F4A5C", note: "Body copy" },
      { name: "muted", cssVar: "--color-muted", hex: "#6B7280", note: "Captions, tertiary" },
      { name: "line", cssVar: "--color-line", hex: "#E6E1DA", note: "Hairline borders" },
    ],
  },
  {
    name: "Brand",
    tokens: [
      { name: "accent", cssVar: "--color-accent", hex: "#1A73E8", note: "Primary CTAs, links" },
      { name: "accent-light", cssVar: "--color-accent-light", hex: "#2F88FF" },
      { name: "accent-dark", cssVar: "--color-accent-dark", hex: "#1558B8" },
      { name: "accent-50", cssVar: "--color-accent-50", hex: "#E8F0FE", note: "Tinted highlight backgrounds" },
    ],
  },
  {
    name: "Semantic",
    tokens: [
      { name: "warm", cssVar: "--color-warm", hex: "#F2C94C", note: "Warning, attention" },
      { name: "warm-50", cssVar: "--color-warm-50", hex: "#FDF6DF" },
      { name: "red", cssVar: "--color-red", hex: "#E85C3A", note: "Destructive, error" },
      { name: "red-50", cssVar: "--color-red-50", hex: "#FDECE6" },
      { name: "good", cssVar: "--color-good", hex: "#118A54", note: "Success, positive" },
      { name: "good-50", cssVar: "--color-good-50", hex: "#E4F4ED" },
    ],
  },
];

const typeScale = [
  { name: "Display", cls: "text-6xl sm:text-7xl font-extrabold tracking-tight", weight: "800", note: "Hero H1, landing pages" },
  { name: "H1", cls: "text-4xl sm:text-5xl font-extrabold tracking-tight", weight: "800", note: "Page titles" },
  { name: "H2", cls: "text-3xl font-bold tracking-tight", weight: "700", note: "Section headings" },
  { name: "H3", cls: "text-xl font-semibold", weight: "600", note: "Subsections" },
  { name: "Body large", cls: "text-lg leading-relaxed", weight: "400", note: "Lead paragraphs" },
  { name: "Body", cls: "text-base leading-relaxed", weight: "400", note: "Default" },
  { name: "Caption", cls: "text-sm text-muted", weight: "400", note: "Helper text" },
  { name: "Micro", cls: "text-xs uppercase tracking-wide text-muted", weight: "500", note: "Eyebrow labels" },
];

export default async function DesignSystemPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;

  return (
    <div className="bg-bg min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <FloatingShape
          className="absolute -top-12 -right-20 w-72 h-72 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, var(--color-accent), transparent 60%)" }}
        />
        <FloatingShape
          className="absolute bottom-0 left-1/3 w-56 h-56 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, var(--color-warm), transparent 60%)" }}
        />
        <div className="max-w-[1240px] mx-auto relative">
          <p className="text-xs uppercase tracking-[0.18em] text-muted font-semibold mb-3">
            Design system · v2
          </p>
          <HeroH1
            prefix="The"
            blue="RateShips"
            suffix="design language"
            emphColor="var(--color-accent)"
            inlineSuffix
          />
          <p className="mt-6 max-w-2xl text-lg text-body leading-relaxed">
            Tokens, typography, motion, and components used across rateships.com.
            Internal reference — useful when building new pages, OSS-package
            websites, or partner integrations.
          </p>

          {/* Counters */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl">
            {[
              { label: "Color tokens", value: 18 },
              { label: "Type sizes", value: 8 },
              { label: "Motion primitives", value: 9 },
              { label: "Locales", value: 12 },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-4xl font-extrabold text-ink">
                  <CountUp to={s.value} duration={1.2} />
                </div>
                <div className="text-sm text-muted mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Colors */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 border-t border-line bg-card">
        <div className="max-w-[1240px] mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-ink mb-2">Color tokens</h2>
          <p className="text-body mb-10 max-w-2xl">
            All UI surfaces map to one of these tokens. Hardcoded hex values in
            JSX are technical debt — convert to <code className="px-1.5 py-0.5 rounded bg-bg-alt text-sm">bg-*</code> /{" "}
            <code className="px-1.5 py-0.5 rounded bg-bg-alt text-sm">text-*</code> classes when you touch them.
          </p>
          <div className="space-y-12">
            {colorGroups.map((group) => (
              <div key={group.name}>
                <h3 className="text-base font-semibold text-ink mb-4 uppercase tracking-wide text-sm">
                  {group.name}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {group.tokens.map((t) => (
                    <div
                      key={t.name}
                      className="bg-bg rounded-2xl border border-line overflow-hidden"
                    >
                      <div
                        className="h-24 w-full"
                        style={{ background: t.hex }}
                      />
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-sm font-semibold text-ink">{t.name}</span>
                          <span className="font-mono text-xs text-muted uppercase">{t.hex}</span>
                        </div>
                        {t.note && (
                          <p className="text-xs text-body leading-snug">{t.note}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 border-t border-line">
        <div className="max-w-[1240px] mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-ink mb-2">Typography</h2>
          <p className="text-body mb-10 max-w-2xl">
            Font: <span className="font-semibold">Inter</span> (variable, with{" "}
            <code className="px-1.5 py-0.5 rounded bg-bg-alt text-sm">cv11, ss01, ss03</code>{" "}
            stylistic sets enabled).
          </p>
          <div className="space-y-8">
            {typeScale.map((t) => (
              <div key={t.name} className="flex flex-col sm:flex-row sm:items-baseline gap-4 pb-6 border-b border-line-2">
                <div className="sm:w-48 shrink-0">
                  <p className="text-sm font-semibold text-ink">{t.name}</p>
                  <p className="text-xs text-muted">{t.note}</p>
                  <p className="text-xs font-mono text-muted">weight {t.weight}</p>
                </div>
                <p className={`${t.cls} text-ink flex-1`}>
                  Compare 145+ carriers worldwide
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Buttons */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 border-t border-line bg-card">
        <div className="max-w-[1240px] mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-ink mb-2">Buttons</h2>
          <p className="text-body mb-10 max-w-2xl">
            Primary action is filled blue. Secondary is white-on-line. Ghost is
            text-only. Destructive use red sparingly.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Primary",
                code: 'bg-accent text-white rounded-full',
                preview: (
                  <button className="px-6 py-3 bg-accent text-white text-sm font-semibold rounded-full btn-press shadow-[0_4px_10px_rgba(26,115,232,.28)]">
                    Get a free quote
                  </button>
                ),
              },
              {
                title: "Secondary",
                code: 'bg-white border border-line text-ink rounded-full',
                preview: (
                  <button className="px-6 py-3 bg-white border border-line text-ink text-sm font-semibold rounded-full btn-press hover:bg-card-hover">
                    Browse carriers
                  </button>
                ),
              },
              {
                title: "Ghost",
                code: 'text-body hover:text-ink',
                preview: (
                  <button className="px-3 py-2 text-body hover:text-ink text-sm font-medium transition-colors">
                    Learn more →
                  </button>
                ),
              },
              {
                title: "Destructive",
                code: 'bg-red-50 text-red rounded-full',
                preview: (
                  <button className="px-6 py-3 bg-red-50 text-red text-sm font-semibold rounded-full btn-press border border-red/30">
                    Remove route
                  </button>
                ),
              },
            ].map((b) => (
              <div key={b.title} className="bg-bg rounded-2xl p-6 border border-line">
                <p className="text-xs uppercase tracking-wide text-muted font-semibold mb-3">
                  {b.title}
                </p>
                <div className="mb-4">{b.preview}</div>
                <code className="block text-xs font-mono text-body bg-bg-alt rounded-lg px-3 py-2">
                  {b.code}
                </code>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 border-t border-line">
        <div className="max-w-[1240px] mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-ink mb-2">Cards</h2>
          <p className="text-body mb-10 max-w-2xl">
            Three variants: standard (flat), interactive (hover lift), tilt
            (3D parallax — uses Framer Motion via TiltCard).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card rounded-2xl p-6 border border-line">
              <p className="text-xs uppercase tracking-wide text-muted font-semibold mb-3">
                Standard
              </p>
              <h3 className="text-lg font-bold text-ink mb-2">DHL Express</h3>
              <p className="text-sm text-body">
                International express courier with door-to-door tracking and
                customs clearance.
              </p>
            </div>
            <div className="bg-card rounded-2xl p-6 border border-line card-hover cursor-pointer">
              <p className="text-xs uppercase tracking-wide text-muted font-semibold mb-3">
                Hover lift
              </p>
              <h3 className="text-lg font-bold text-ink mb-2">UPS Worldwide</h3>
              <p className="text-sm text-body">
                Card lifts 3px on hover with a soft shadow. Use on clickable
                grids.
              </p>
            </div>
            <TiltCard maxTilt={5}>
              <div className="bg-card rounded-2xl p-6 border border-line h-full">
                <p className="text-xs uppercase tracking-wide text-muted font-semibold mb-3">
                  Tilt (3D)
                </p>
                <h3 className="text-lg font-bold text-ink mb-2">FedEx Priority</h3>
                <p className="text-sm text-body">
                  Mouse-tracked 3D tilt. Reserved for hero / featured grids
                  where the wow factor is worth the complexity.
                </p>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* Motion primitives */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 border-t border-line bg-card">
        <div className="max-w-[1240px] mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-ink mb-2">Motion primitives</h2>
          <p className="text-body mb-10 max-w-2xl">
            All exports from{" "}
            <code className="px-1.5 py-0.5 rounded bg-bg-alt text-sm">@/components/HeroMotion</code>.
            Every primitive honors{" "}
            <code className="px-1.5 py-0.5 rounded bg-bg-alt text-sm">prefers-reduced-motion</code>{" "}
            and is SSR-safe (renders the destination state on the server).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              ["HeroH1", "3-chunk H1 with stagger word reveal"],
              ["FloatingShape", "Decorative blur with parallax + bob"],
              ["MagneticCTA", "Button that nudges toward the cursor"],
              ["StaggerGrid + StaggerItem", "Fade-in with intersection observer"],
              ["TiltCard", "Mouse-tracked 3D tilt"],
              ["GlowCTA", "Wraps a CTA with an animated radial glow"],
              ["CountUp", "0 → target counter on first view"],
              ["StaggerWords", "Word-by-word reveal for body text"],
              ["HeroMotion (root)", "All primitives, single import"],
            ].map(([name, desc]) => (
              <div key={name} className="bg-bg rounded-xl p-4 border border-line">
                <code className="text-sm font-semibold text-accent block mb-1">{name}</code>
                <p className="text-xs text-body leading-snug">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA back */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 border-t border-line">
        <div className="max-w-[1240px] mx-auto text-center">
          <p className="text-muted mb-4">
            Ready to apply these tokens to a new feature?
          </p>
          <MagneticCTA>
            <Link
              href={`/${locale}`}
              className="inline-flex items-center px-7 py-3.5 bg-accent text-white text-base font-semibold rounded-full shadow-[0_4px_10px_rgba(26,115,232,.28)] hover:bg-accent-dark transition-colors"
            >
              Back to {t(loc, "site_name")} →
            </Link>
          </MagneticCTA>
        </div>
      </section>
    </div>
  );
}
