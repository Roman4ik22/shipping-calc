"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

/**
 * Animated world map showing popular shipping corridors as drawn-on arcs.
 *
 * Why no continent outlines: a real geographic map costs ~50kb of path data
 * and ships with hundreds of named features we don't use. Instead this is a
 * dot-grid abstraction (latitude/longitude reference lines + country pins).
 * The story is in the *arcs* between countries, not the geography.
 *
 * Coordinate system: equirectangular projection.
 *   x = (lng + 180) / 360 * 1000
 *   y = (90  - lat) /  180 *  500
 *
 * SSR-safe: arcs render in their final state on the server (no opacity:0).
 * Client-side, Framer animates stroke-dasharray to "draw" them.
 * prefers-reduced-motion: skips draw animation, shows arcs immediately.
 */

interface Country {
  code: string;
  name: string;
  lat: number;
  lng: number;
}

const W = 1000;
const H = 500;

// ~25 ports of interest. Mix of popular origins (CN, US, GB, DE, JP) and
// destinations spanning all continents so the map looks genuinely global.
const PINS: Country[] = [
  { code: "US", name: "United States", lat: 39.8, lng: -98.6 },
  { code: "CA", name: "Canada", lat: 56.1, lng: -106.3 },
  { code: "MX", name: "Mexico", lat: 23.6, lng: -102.6 },
  { code: "BR", name: "Brazil", lat: -14.2, lng: -51.9 },
  { code: "AR", name: "Argentina", lat: -38.4, lng: -63.6 },
  { code: "GB", name: "United Kingdom", lat: 54.0, lng: -2.0 },
  { code: "DE", name: "Germany", lat: 51.2, lng: 10.5 },
  { code: "FR", name: "France", lat: 46.6, lng: 2.5 },
  { code: "IT", name: "Italy", lat: 41.9, lng: 12.6 },
  { code: "ES", name: "Spain", lat: 40.5, lng: -3.7 },
  { code: "NL", name: "Netherlands", lat: 52.1, lng: 5.3 },
  { code: "TR", name: "Turkey", lat: 38.96, lng: 35.2 },
  { code: "RU", name: "Russia", lat: 61.5, lng: 105.3 },
  { code: "CN", name: "China", lat: 35.9, lng: 104.2 },
  { code: "JP", name: "Japan", lat: 36.2, lng: 138.3 },
  { code: "KR", name: "South Korea", lat: 35.9, lng: 127.8 },
  { code: "IN", name: "India", lat: 20.6, lng: 78.96 },
  { code: "SG", name: "Singapore", lat: 1.35, lng: 103.8 },
  { code: "TH", name: "Thailand", lat: 15.9, lng: 100.99 },
  { code: "AE", name: "UAE", lat: 23.4, lng: 53.8 },
  { code: "SA", name: "Saudi Arabia", lat: 23.9, lng: 45.1 },
  { code: "AU", name: "Australia", lat: -25.3, lng: 133.8 },
  { code: "ZA", name: "South Africa", lat: -30.6, lng: 22.9 },
  { code: "EG", name: "Egypt", lat: 26.8, lng: 30.8 },
  { code: "NG", name: "Nigeria", lat: 9.1, lng: 8.7 },
];

// Popular shipping corridors (origin → destination). Order matters for arc
// direction; the top-to-bottom rendering makes sure the animation starts at
// the origin pin.
const CORRIDORS: Array<[string, string]> = [
  ["CN", "US"],
  ["CN", "DE"],
  ["CN", "GB"],
  ["US", "DE"],
  ["US", "GB"],
  ["US", "JP"],
  ["US", "AU"],
  ["GB", "DE"],
  ["DE", "FR"],
  ["JP", "US"],
  ["KR", "US"],
  ["AE", "IN"],
  ["TR", "DE"],
  ["BR", "US"],
];

const project = ({ lat, lng }: { lat: number; lng: number }) => ({
  x: ((lng + 180) / 360) * W,
  y: ((90 - lat) / 180) * H,
});

const arcPath = (a: Country, b: Country) => {
  const p1 = project(a);
  const p2 = project(b);
  // Curve height: more for longer routes, capped so trans-Pacific isn't absurd.
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const lift = Math.min(dist * 0.4, 180);
  const mx = (p1.x + p2.x) / 2;
  const my = (p1.y + p2.y) / 2 - lift;
  return `M${p1.x},${p1.y} Q${mx},${my} ${p2.x},${p2.y}`;
};

const findPin = (code: string) => PINS.find((p) => p.code === code);

export default function WorldMap({
  className,
  height = 380,
}: {
  className?: string;
  height?: number;
}) {
  const reduce = useReducedMotion();
  const [hoveredCorridor, setHoveredCorridor] = useState<string | null>(null);

  return (
    <div className={className} style={{ position: "relative", width: "100%" }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        style={{
          width: "100%",
          height,
          display: "block",
          overflow: "visible",
        }}
        role="img"
        aria-label="World map showing popular shipping corridors"
      >
        {/* Latitude / longitude reference grid */}
        <g stroke="var(--color-line)" strokeWidth="0.5" fill="none" opacity="0.6">
          {/* Equator */}
          <line x1="0" y1={H / 2} x2={W} y2={H / 2} strokeDasharray="2 4" />
          {/* Prime meridian */}
          <line x1={W / 2} y1="0" x2={W / 2} y2={H} strokeDasharray="2 4" />
          {/* Tropic of Cancer / Capricorn */}
          {[H * 0.37, H * 0.63].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2={W}
              y2={y}
              strokeDasharray="1 6"
              opacity="0.5"
            />
          ))}
        </g>

        {/* Soft continent silhouette via radial blobs (cheap, evokes geography
            without being literal). Blue and orange blobs hint at "trade
            flow" rather than "we know geography". */}
        <g opacity="0.08">
          {[
            { x: 200, y: 180, r: 130 }, // Americas
            { x: 350, y: 320, r: 80 },  // South America
            { x: 510, y: 170, r: 95 },  // Europe
            { x: 600, y: 270, r: 130 }, // Africa
            { x: 800, y: 200, r: 130 }, // Asia
            { x: 870, y: 360, r: 70 },  // Oceania
          ].map((b, i) => (
            <circle
              key={i}
              cx={b.x}
              cy={b.y}
              r={b.r}
              fill="var(--color-accent)"
            />
          ))}
        </g>

        {/* Arcs (drawn animated paths) */}
        <g fill="none" strokeLinecap="round">
          {CORRIDORS.map(([from, to], i) => {
            const a = findPin(from);
            const b = findPin(to);
            if (!a || !b) return null;
            const id = `${from}-${to}`;
            const isHover = hoveredCorridor === id;
            return (
              <motion.path
                key={id}
                d={arcPath(a, b)}
                stroke={isHover ? "var(--color-accent)" : "var(--color-accent)"}
                strokeWidth={isHover ? 2.5 : 1.5}
                strokeOpacity={isHover ? 1 : 0.45}
                initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : {
                        delay: i * 0.18,
                        duration: 1.4,
                        ease: [0.22, 1, 0.36, 1],
                      }
                }
                onMouseEnter={() => setHoveredCorridor(id)}
                onMouseLeave={() => setHoveredCorridor(null)}
                style={{ cursor: "pointer", transition: "stroke-width .2s, stroke-opacity .2s" }}
              />
            );
          })}
        </g>

        {/* Country pins (labels on top so they don't fade with arcs) */}
        <g>
          {PINS.map((p) => {
            const { x, y } = project(p);
            const isInCorridor = CORRIDORS.some(
              ([a, b]) => a === p.code || b === p.code
            );
            const isHoveredEnd =
              hoveredCorridor !== null &&
              (hoveredCorridor.startsWith(`${p.code}-`) ||
                hoveredCorridor.endsWith(`-${p.code}`));
            return (
              <g key={p.code}>
                {/* Pulse ring for corridor endpoints */}
                {isInCorridor && (
                  <motion.circle
                    cx={x}
                    cy={y}
                    r={6}
                    fill="var(--color-accent)"
                    fillOpacity={0.25}
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={
                      reduce
                        ? { scale: 1, opacity: 0.5 }
                        : { scale: [1, 2.4, 1], opacity: [0.5, 0, 0.5] }
                    }
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                )}
                <circle
                  cx={x}
                  cy={y}
                  r={isHoveredEnd ? 6 : 4}
                  fill={isInCorridor ? "var(--color-accent)" : "var(--color-muted)"}
                  fillOpacity={isInCorridor ? 1 : 0.5}
                  style={{ transition: "r .2s" }}
                />
                <text
                  x={x + 8}
                  y={y + 3}
                  fontSize="11"
                  fontWeight={isHoveredEnd ? 700 : 600}
                  fill="var(--color-ink)"
                  fillOpacity={isInCorridor ? 0.85 : 0.4}
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {p.code}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Hover read-out (route name) */}
      <div
        aria-live="polite"
        style={{
          position: "absolute",
          bottom: -8,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: 13,
          color: "var(--color-muted)",
          background: "var(--color-bg)",
          padding: "4px 12px",
          borderRadius: 999,
          opacity: hoveredCorridor ? 1 : 0,
          transition: "opacity .2s",
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        {hoveredCorridor && (() => {
          const [from, to] = hoveredCorridor.split("-");
          const fromName = findPin(from)?.name;
          const toName = findPin(to)?.name;
          return `${fromName} → ${toName}`;
        })()}
      </div>
    </div>
  );
}
