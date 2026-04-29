/**
 * Decorative dividers placed between page sections to break up long pages.
 *
 * Three styles:
 *  - "wave"  — soft sinusoidal SVG wave, full-width
 *  - "dots"  — center-aligned row of 3 colored pills
 *  - "arrow" — small downward chevron in a circle
 *
 * All are zero-deps SVG, server-renderable, and respect prefers-reduced-motion
 * (via no animation by default — they're static decorations).
 *
 * Why these don't live in HeroMotion: those primitives all require client JS.
 * Section dividers should render on the server since they're purely visual
 * with no interactivity.
 */

interface DividerProps {
  variant?: "wave" | "dots" | "arrow";
  /** Background color of the section ABOVE the divider. Used to mask the wave. */
  topBg?: string;
  /** Background color of the section BELOW the divider. */
  bottomBg?: string;
  /** Vertical spacing around the divider (default 32px). */
  margin?: number;
  className?: string;
}

export default function SectionDivider({
  variant = "dots",
  topBg = "var(--bg)",
  bottomBg = "var(--bg)",
  margin = 32,
  className,
}: DividerProps) {
  if (variant === "wave") {
    return (
      <div
        aria-hidden
        className={className}
        style={{
          width: "100%",
          background: bottomBg,
          marginTop: 0,
          marginBottom: 0,
          lineHeight: 0,
        }}
      >
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          style={{ width: "100%", height: 60, display: "block" }}
        >
          <path
            d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,0 L0,0 Z"
            fill={topBg}
          />
        </svg>
      </div>
    );
  }

  if (variant === "arrow") {
    return (
      <div
        aria-hidden
        className={className}
        style={{
          display: "flex",
          justifyContent: "center",
          padding: `${margin}px 0`,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 999,
            background: "var(--card)",
            border: "1px solid var(--line)",
            display: "grid",
            placeItems: "center",
            color: "var(--muted)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
    );
  }

  // Default: "dots" — three pills, varying widths and colors
  return (
    <div
      aria-hidden
      className={className}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        padding: `${margin}px 0`,
      }}
    >
      <span style={{ width: 36, height: 4, borderRadius: 999, background: "var(--blue)", opacity: 0.6 }} />
      <span style={{ width: 8, height: 8, borderRadius: 999, background: "var(--accent)" }} />
      <span style={{ width: 36, height: 4, borderRadius: 999, background: "var(--warm)", opacity: 0.6 }} />
    </div>
  );
}
