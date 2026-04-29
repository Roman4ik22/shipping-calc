/**
 * Visual icon for the three carrier categories (international/regional/postal).
 * Replaces the previous text-only pill so cards have actual visual identity
 * instead of letter abbreviations next to a tiny grey label.
 *
 * Pure SVG, server-renderable. The size + label-visibility props let callers
 * use it in three contexts:
 *   • compact (icon only, 14px) — for tiny cards
 *   • pill   (icon + text, default) — for featured cards and rate rows
 *   • large  (icon only, 32px) — for hero / corner badges
 */

export type CarrierType = "international" | "regional" | "postal";

const TYPE_META: Record<
  CarrierType,
  { color: string; bgVar: string; iconPath: React.ReactNode; defaultLabel: string }
> = {
  international: {
    color: "var(--blue)",
    bgVar: "var(--blue-50)",
    defaultLabel: "Express",
    iconPath: (
      // Paper plane / express courier
      <>
        <path d="M22 2L11 13" />
        <path d="M22 2l-7 20-4-9-9-4 20-7z" />
      </>
    ),
  },
  regional: {
    color: "var(--accent)",
    bgVar: "var(--accent-50)",
    defaultLabel: "Regional",
    iconPath: (
      // Delivery truck
      <>
        <path d="M1 3h15v13H1z" />
        <path d="M16 8h4l3 3v5h-7z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </>
    ),
  },
  postal: {
    color: "var(--warm)",
    bgVar: "var(--warm-50)",
    defaultLabel: "Postal",
    iconPath: (
      // Envelope / mail
      <>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </>
    ),
  },
};

export function CarrierTypeIcon({
  type,
  size = 14,
  className,
  style,
}: {
  type: CarrierType | string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const meta = TYPE_META[type as CarrierType] ?? TYPE_META.regional;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      style={{ color: meta.color, flexShrink: 0, ...style }}
    >
      {meta.iconPath}
    </svg>
  );
}

export function CarrierTypePill({
  type,
  label,
  size = "sm",
}: {
  type: CarrierType | string;
  /** Override the default English label. Pass a localized string from t(). */
  label?: string;
  size?: "xs" | "sm" | "md";
}) {
  const meta = TYPE_META[type as CarrierType] ?? TYPE_META.regional;
  const text = label ?? meta.defaultLabel;
  const dims = {
    xs: { padY: 2, padX: 8, fs: 10, icon: 10 },
    sm: { padY: 3, padX: 9, fs: 11, icon: 12 },
    md: { padY: 4, padX: 12, fs: 12, icon: 14 },
  }[size];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: `${dims.padY}px ${dims.padX}px`,
        borderRadius: 999,
        background: meta.bgVar,
        color: meta.color,
        fontSize: dims.fs,
        fontWeight: 600,
        lineHeight: 1,
        whiteSpace: "nowrap",
      }}
    >
      <CarrierTypeIcon type={type} size={dims.icon} />
      {text}
    </span>
  );
}
