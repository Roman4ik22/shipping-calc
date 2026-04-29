/**
 * Hero-corner illustrations for /about, /carriers, /customs, /blog.
 *
 * Each is a self-contained ~280x200 SVG using brand color tokens (var(--blue),
 * var(--accent), var(--warm)) so they switch with dark mode automatically.
 * Pure SVG — no JS, no client component, server-renderable.
 *
 * Designed to live in the absolute-positioned hero corners of each page,
 * giving text-heavy pages a meaningful visual anchor instead of just abstract
 * floating boxes.
 */

const SHARED_FILTER_ID = "rsIllusBlur";

/** Soft drop-shadow filter shared by all illustrations. */
function SharedDefs() {
  return (
    <defs>
      <filter id={SHARED_FILTER_ID} x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="0" />
        <feOffset dx="0" dy="3" />
        <feFlood floodColor="#000" floodOpacity="0.10" />
        <feComposite in2="SourceGraphic" operator="in" />
      </filter>
    </defs>
  );
}

interface IllustrationProps {
  className?: string;
  style?: React.CSSProperties;
  width?: number | string;
}

/**
 * /about — Magnifying glass over a transparent invoice. Theme: clarity,
 * inspection, "every fee upfront".
 */
export function AboutIllustration({ className, style, width = 280 }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 280 220"
      width={width}
      height="auto"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <SharedDefs />
      {/* Receipt paper */}
      <g transform="translate(40, 30)">
        <rect x="0" y="0" width="160" height="170" rx="8"
          fill="var(--card)" stroke="var(--line)" strokeWidth="1.5" />
        {/* Header bar */}
        <rect x="14" y="16" width="60" height="6" rx="3" fill="var(--ink)" opacity="0.9" />
        <rect x="14" y="28" width="40" height="3" rx="1.5" fill="var(--muted)" opacity="0.5" />
        {/* Line items */}
        <line x1="14" y1="48" x2="146" y2="48" stroke="var(--line)" strokeWidth="1" />
        {[58, 78, 98, 118].map((y, i) => (
          <g key={y}>
            <rect x="14" y={y} width={Math.max(40, 80 - i * 8)} height="3" rx="1.5"
              fill="var(--body)" opacity="0.6" />
            <rect x={Math.max(110, 130 - i * 4)} y={y} width={Math.max(16, 24 - i * 2)} height="3" rx="1.5"
              fill="var(--ink)" opacity="0.85" />
          </g>
        ))}
        {/* Total bar */}
        <line x1="14" y1="138" x2="146" y2="138" stroke="var(--line)" strokeWidth="1" />
        <rect x="14" y="146" width="34" height="5" rx="2.5" fill="var(--ink)" opacity="0.9" />
        <rect x="118" y="146" width="28" height="5" rx="2.5" fill="var(--blue)" />
      </g>
      {/* Magnifying glass — ring + handle */}
      <g transform="translate(120, 80)">
        <circle cx="50" cy="50" r="42" fill="var(--blue)" fillOpacity="0.08"
          stroke="var(--blue)" strokeWidth="3" />
        <circle cx="50" cy="50" r="34" fill="var(--card)" fillOpacity="0.9" stroke="var(--blue)" strokeWidth="1" />
        {/* Lens highlight */}
        <ellipse cx="38" cy="38" rx="14" ry="10" fill="var(--card)" opacity="0.6" />
        {/* Verified checkmark inside */}
        <path d="M40 52L48 60L62 44" stroke="var(--blue)" strokeWidth="3.5"
          strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* Handle */}
        <line x1="80" y1="80" x2="110" y2="110" stroke="var(--blue)" strokeWidth="6" strokeLinecap="round" />
        <line x1="80" y1="80" x2="110" y2="110" stroke="var(--blue-700)" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      </g>
    </svg>
  );
}

/**
 * /carriers — Stack of 3 packages with a paper-plane streaking past. Theme:
 * variety of shipping options, global movement.
 */
export function CarriersIllustration({ className, style, width = 280 }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 280 220"
      width={width}
      height="auto"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* Motion arc behind */}
      <path d="M 10 180 Q 90 60, 180 130 T 270 100"
        stroke="var(--blue)" strokeWidth="1.5" fill="none" strokeDasharray="3 5" opacity="0.4" />
      {/* Bottom box (largest) */}
      <g transform="translate(60, 110)">
        <rect width="110" height="80" rx="6" fill="var(--warm)" />
        <rect width="110" height="80" rx="6" fill="url(#carBoxA)" />
        <line x1="55" y1="0" x2="55" y2="80" stroke="#000" strokeOpacity="0.10" strokeWidth="1.5" />
        <rect x="36" y="20" width="38" height="14" rx="2" fill="var(--card)" opacity="0.55" />
      </g>
      {/* Middle box */}
      <g transform="translate(80, 60)">
        <rect width="90" height="60" rx="6" fill="var(--accent)" />
        <line x1="45" y1="0" x2="45" y2="60" stroke="#000" strokeOpacity="0.12" strokeWidth="1.5" />
        <rect x="30" y="14" width="30" height="10" rx="2" fill="var(--card)" opacity="0.55" />
      </g>
      {/* Top box (smallest) */}
      <g transform="translate(110, 28)">
        <rect width="68" height="42" rx="6" fill="var(--blue)" />
        <line x1="34" y1="0" x2="34" y2="42" stroke="#000" strokeOpacity="0.14" strokeWidth="1.5" />
        <rect x="22" y="10" width="24" height="8" rx="1.5" fill="var(--card)" opacity="0.6" />
      </g>
      {/* Paper plane streaking */}
      <g transform="translate(180, 30) rotate(15)">
        <path d="M0 0 L40 12 L20 16 L18 32 L8 18 L0 0 Z"
          fill="var(--card)" stroke="var(--ink)" strokeWidth="1.2" strokeLinejoin="round" />
        <line x1="0" y1="0" x2="20" y2="16" stroke="var(--ink)" strokeWidth="1" opacity="0.4" />
      </g>
      <defs>
        <linearGradient id="carBoxA" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.08" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/**
 * /customs — Document with stamp on a globe pedestal. Theme: official border
 * processing, stamps, international clearance.
 */
export function CustomsIllustration({ className, style, width = 280 }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 280 220"
      width={width}
      height="auto"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* Globe at bottom */}
      <g transform="translate(50, 130)">
        <circle cx="70" cy="50" r="50" fill="var(--blue-50)" stroke="var(--blue)" strokeWidth="1.5" opacity="0.9" />
        {/* Latitude lines */}
        <ellipse cx="70" cy="50" rx="50" ry="14" fill="none" stroke="var(--blue)" strokeWidth="1" opacity="0.45" />
        <ellipse cx="70" cy="50" rx="50" ry="32" fill="none" stroke="var(--blue)" strokeWidth="1" opacity="0.3" />
        {/* Meridians */}
        <line x1="70" y1="0" x2="70" y2="100" stroke="var(--blue)" strokeWidth="1" opacity="0.45" />
        <ellipse cx="70" cy="50" rx="20" ry="50" fill="none" stroke="var(--blue)" strokeWidth="1" opacity="0.3" />
        <ellipse cx="70" cy="50" rx="40" ry="50" fill="none" stroke="var(--blue)" strokeWidth="1" opacity="0.25" />
      </g>
      {/* Document */}
      <g transform="translate(80, 30)">
        <rect width="120" height="130" rx="6" fill="var(--card)" stroke="var(--line)" strokeWidth="1.5" />
        {/* Doc header lines */}
        <rect x="12" y="14" width="60" height="6" rx="3" fill="var(--ink)" opacity="0.85" />
        <rect x="12" y="26" width="40" height="3" rx="1.5" fill="var(--muted)" opacity="0.6" />
        {/* Doc body lines */}
        {[44, 54, 64, 74].map((y, i) => (
          <rect key={y} x="12" y={y} width={Math.max(60, 96 - i * 6)} height="3" rx="1.5"
            fill="var(--body)" opacity={0.55 - i * 0.05} />
        ))}
        {/* Stamp circle */}
        <g transform="translate(64, 80)">
          <circle cx="22" cy="22" r="22" fill="none"
            stroke="var(--accent)" strokeWidth="3" opacity="0.85"
            transform="rotate(-12 22 22)" />
          <circle cx="22" cy="22" r="16" fill="none"
            stroke="var(--accent)" strokeWidth="1" opacity="0.6"
            transform="rotate(-12 22 22)" />
          <text x="22" y="20" fontSize="6" fontWeight="800" textAnchor="middle"
            fill="var(--accent)" transform="rotate(-12 22 22)" letterSpacing="0.5">CLEARED</text>
          <text x="22" y="30" fontSize="5" fontWeight="700" textAnchor="middle"
            fill="var(--accent)" opacity="0.8" transform="rotate(-12 22 22)">CUSTOMS</text>
        </g>
      </g>
    </svg>
  );
}

/**
 * /blog — Stack of cards with a top featured one. Theme: articles, content,
 * library.
 */
export function BlogIllustration({ className, style, width = 280 }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 280 220"
      width={width}
      height="auto"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* Background card */}
      <g transform="translate(70, 70) rotate(-6 90 60)">
        <rect width="180" height="120" rx="10"
          fill="var(--card)" stroke="var(--line)" strokeWidth="1.5" opacity="0.7" />
      </g>
      {/* Middle card */}
      <g transform="translate(60, 50) rotate(3 90 60)">
        <rect width="180" height="120" rx="10"
          fill="var(--card)" stroke="var(--line)" strokeWidth="1.5" opacity="0.85" />
      </g>
      {/* Front card */}
      <g transform="translate(50, 30)">
        <rect width="180" height="140" rx="10"
          fill="var(--card)" stroke="var(--line)" strokeWidth="1.5" />
        {/* Featured tag */}
        <rect x="14" y="14" width="50" height="16" rx="8" fill="var(--accent-50)" />
        <text x="39" y="25" fontSize="10" fontWeight="700"
          textAnchor="middle" fill="var(--accent)">FEATURED</text>
        {/* Title bars */}
        <rect x="14" y="42" width="120" height="6" rx="3" fill="var(--ink)" opacity="0.9" />
        <rect x="14" y="54" width="80" height="6" rx="3" fill="var(--ink)" opacity="0.9" />
        {/* Body text bars */}
        {[76, 86, 96].map((y, i) => (
          <rect key={y} x="14" y={y} width={Math.max(80, 152 - i * 16)} height="3" rx="1.5"
            fill="var(--body)" opacity="0.5" />
        ))}
        {/* Author + date row */}
        <circle cx="22" cy="120" r="8" fill="var(--blue-50)" stroke="var(--blue)" strokeWidth="1" />
        <rect x="36" y="115" width="60" height="3" rx="1.5" fill="var(--ink)" opacity="0.7" />
        <rect x="36" y="122" width="40" height="2.5" rx="1.5" fill="var(--muted)" opacity="0.7" />
        {/* Read arrow */}
        <circle cx="156" cy="120" r="14" fill="var(--blue)" />
        <path d="M150 120h12M158 116l4 4-4 4" stroke="var(--card)" strokeWidth="2"
          fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
