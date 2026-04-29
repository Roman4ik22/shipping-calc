"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";

/**
 * Storytelling parallax scene — five SVG layers move at different speeds as
 * the user scrolls past, creating depth and a "feature reel" feeling
 * (Stripe / Linear style).
 *
 * Sits between two homepage sections (height 360px). On reduced-motion
 * devices the layers are static — they still render their final state.
 *
 * The design tells one short story: a cargo plane crosses a sky over
 * stacked containers, while a delivery truck rolls past at the bottom.
 * Each element is a fixed SVG drawn with brand color tokens so dark mode
 * works automatically.
 */
export default function ParallaxScene() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // useScroll relative to this section's entry/exit
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Each layer moves at a different rate. Far/background = slower, close
  // = faster. Y values are in px relative to layer center.
  const skyY = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const cloudsX = useTransform(scrollYProgress, [0, 1], [-80, 80]);
  const planeX = useTransform(scrollYProgress, [0, 1], [-200, 400]);
  const planeY = useTransform(scrollYProgress, [0, 1], [10, -40]);
  const buildingsY = useTransform(scrollYProgress, [0, 1], [40, -20]);
  const truckX = useTransform(scrollYProgress, [0, 1], [-150, 250]);

  // If reduced motion, freeze every transform at its midpoint by overriding.
  const noop = useTransform(scrollYProgress, () => 0);

  return (
    <section
      ref={ref}
      aria-hidden
      style={{
        position: "relative",
        height: 360,
        overflow: "hidden",
        background: "linear-gradient(180deg, var(--bg) 0%, var(--bg-alt) 100%)",
        borderTop: "1px solid var(--line)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      {/* Sky gradient layer (slowest) */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          y: reduce ? noop : skyY,
          background:
            "radial-gradient(900px 220px at 50% 0%, rgba(26,115,232,.10), transparent 60%), radial-gradient(700px 180px at 80% 90%, rgba(242,201,76,.10), transparent 60%)",
        }}
      />

      {/* Reference horizon line (latitude-style) */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "60%",
          height: 1,
          background: "var(--line)",
          opacity: 0.6,
        }}
      />

      {/* Distant clouds (slow horizontal drift) */}
      <motion.svg
        viewBox="0 0 1200 180"
        preserveAspectRatio="xMidYMid meet"
        style={{
          position: "absolute",
          left: "50%",
          top: 30,
          marginLeft: -700,
          width: 1400,
          height: 180,
          x: reduce ? noop : cloudsX,
          opacity: 0.35,
        }}
      >
        <g fill="var(--line)">
          {[
            { cx: 100, cy: 80, r: 40 },
            { cx: 160, cy: 70, r: 30 },
            { cx: 130, cy: 90, r: 32 },
            { cx: 500, cy: 50, r: 36 },
            { cx: 540, cy: 65, r: 28 },
            { cx: 920, cy: 90, r: 42 },
            { cx: 960, cy: 75, r: 28 },
            { cx: 1080, cy: 60, r: 30 },
          ].map((c, i) => (
            <circle key={i} {...c} />
          ))}
        </g>
      </motion.svg>

      {/* Mid-layer: skyline of containers / warehouses (medium) */}
      <motion.svg
        viewBox="0 0 1200 200"
        preserveAspectRatio="xMidYMax meet"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 80,
          width: "100%",
          height: 200,
          y: reduce ? noop : buildingsY,
          opacity: 0.85,
        }}
      >
        {/* Cargo containers stacked at varied heights */}
        {[
          { x: 80, y: 130, w: 60, h: 40, fill: "var(--blue)" },
          { x: 145, y: 140, w: 60, h: 30, fill: "var(--accent)" },
          { x: 210, y: 100, w: 60, h: 70, fill: "var(--warm)" },
          { x: 275, y: 130, w: 60, h: 40, fill: "var(--blue)" },
          { x: 340, y: 110, w: 60, h: 60, fill: "var(--accent)" },
          { x: 480, y: 130, w: 60, h: 40, fill: "var(--warm)" },
          { x: 545, y: 90, w: 60, h: 80, fill: "var(--blue)" },
          { x: 610, y: 130, w: 60, h: 40, fill: "var(--accent)" },
          { x: 720, y: 110, w: 60, h: 60, fill: "var(--warm)" },
          { x: 785, y: 130, w: 60, h: 40, fill: "var(--blue)" },
          { x: 900, y: 100, w: 60, h: 70, fill: "var(--accent)" },
          { x: 965, y: 130, w: 60, h: 40, fill: "var(--warm)" },
          { x: 1030, y: 120, w: 60, h: 50, fill: "var(--blue)" },
          { x: 1095, y: 130, w: 60, h: 40, fill: "var(--accent)" },
        ].map((b, i) => (
          <g key={i}>
            <rect
              x={b.x}
              y={b.y}
              width={b.w}
              height={b.h}
              rx={3}
              fill={b.fill}
              opacity={0.85}
            />
            {/* Vertical seam line on each container for "ribbed" look */}
            <line
              x1={b.x + b.w / 2}
              x2={b.x + b.w / 2}
              y1={b.y}
              y2={b.y + b.h}
              stroke="#000"
              strokeOpacity={0.12}
              strokeWidth={1.5}
            />
          </g>
        ))}
      </motion.svg>

      {/* Plane crossing the sky (fastest horizontal motion) */}
      <motion.svg
        viewBox="0 0 60 40"
        style={{
          position: "absolute",
          top: 50,
          left: "50%",
          width: 60,
          height: 40,
          marginLeft: -30,
          x: reduce ? noop : planeX,
          y: reduce ? noop : planeY,
        }}
      >
        <g transform="rotate(8 30 20)">
          {/* Body */}
          <path
            d="M5 20 L48 18 L54 22 L48 26 L5 24 Z"
            fill="var(--card)"
            stroke="var(--ink)"
            strokeWidth="1"
          />
          {/* Wing */}
          <path
            d="M25 20 L35 8 L40 8 L34 22 Z"
            fill="var(--blue)"
            opacity="0.85"
          />
          {/* Tail */}
          <path d="M5 20 L12 12 L15 20 Z" fill="var(--accent)" opacity="0.85" />
        </g>
        {/* Contrail */}
        <line
          x1="0"
          y1="22"
          x2="-30"
          y2="22"
          stroke="var(--line)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
      </motion.svg>

      {/* Foreground truck (closest, fastest) */}
      <motion.svg
        viewBox="0 0 100 50"
        style={{
          position: "absolute",
          bottom: 28,
          left: "50%",
          width: 100,
          height: 50,
          marginLeft: -50,
          x: reduce ? noop : truckX,
        }}
      >
        {/* Truck body */}
        <rect x="2" y="14" width="50" height="22" rx="2" fill="var(--accent)" />
        <rect
          x="52"
          y="20"
          width="22"
          height="16"
          rx="1.5"
          fill="var(--ink-2)"
        />
        {/* Window */}
        <rect
          x="55"
          y="22"
          width="14"
          height="8"
          rx="1"
          fill="var(--blue)"
          opacity="0.6"
        />
        {/* Rear seam */}
        <line x1="27" y1="14" x2="27" y2="36" stroke="#000" strokeOpacity="0.18" strokeWidth="1.2" />
        {/* Wheels */}
        <circle cx="14" cy="38" r="6" fill="var(--ink)" />
        <circle cx="14" cy="38" r="2.5" fill="var(--card)" />
        <circle cx="62" cy="38" r="6" fill="var(--ink)" />
        <circle cx="62" cy="38" r="2.5" fill="var(--card)" />
      </motion.svg>

      {/* Decorative tagline overlay (centered, doesn't move with parallax) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            background: "var(--card)",
            border: "1px solid var(--line)",
            boxShadow: "var(--shadow-md)",
            padding: "10px 18px",
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 600,
            color: "var(--body)",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: 999,
              background: "var(--good)",
              boxShadow: "0 0 0 4px rgba(17,138,84,.18)",
            }}
            className="pulse-dot"
          />
          <span>Air · Sea · Road · Postal — one search, every option</span>
        </div>
      </div>
    </section>
  );
}
