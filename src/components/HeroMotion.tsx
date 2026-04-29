"use client";

import { motion, useScroll, useTransform, useReducedMotion, useInView, animate } from "framer-motion";
import { useRef, useEffect, useState, type ReactNode, type CSSProperties } from "react";

/**
 * Stagger fade-in for the homepage H1.
 *
 * The hero H1 is composed of three localized chunks (prefix / keyword / suffix)
 * which we receive as plain strings from the server component. Words fade up
 * one after another for a polished, "Apple-style" reveal.
 */
export function HeroH1({
  prefix,
  blue,
  suffix,
  underline,
  style,
  emphColor = "var(--blue)",
  inlineSuffix = false,
}: {
  prefix: string;
  blue: string;
  suffix: string;
  /** Hand-crafted SVG element rendered under the blue keyword */
  underline?: ReactNode;
  style?: CSSProperties;
  /** Color of the emphasized middle word. Default: var(--blue). */
  emphColor?: string;
  /** When true, suffix follows on the same line (no <br />). Useful for
   *  one-line headlines like "We built X because Y is broken." */
  inlineSuffix?: boolean;
}) {
  const reduce = useReducedMotion();

  const container = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: reduce ? 0 : 0.06, delayChildren: 0.05 },
    },
  };
  const word = {
    hidden: { opacity: 0, y: reduce ? 0 : 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
  };

  const renderWords = (text: string) =>
    text.split(" ").map((w, i, arr) => (
      <motion.span
        key={`${text}-${i}`}
        variants={word}
        style={{ display: "inline-block", marginRight: i < arr.length - 1 ? "0.25em" : 0 }}
      >
        {w}
      </motion.span>
    ));

  return (
    <motion.h1
      style={style}
      initial="hidden"
      animate="visible"
      variants={container}
    >
      {renderWords(prefix)}{" "}
      <span style={{ color: emphColor, position: "relative", display: "inline-block" }}>
        {renderWords(blue)}
        {underline}
      </span>
      {inlineSuffix ? " " : <br />}
      {renderWords(suffix)}
    </motion.h1>
  );
}

/**
 * Floating decorative shape on hero. Translates Y on scroll for parallax,
 * and gently bobs up and down on a slow infinite loop. Falls back to static
 * positioning when prefers-reduced-motion is set.
 */
export function FloatingShape({
  parallaxRange = 60,
  bobDistance = 6,
  bobDuration = 4,
  rotateDeg = 0,
  style,
  className,
  children,
}: {
  parallaxRange?: number;
  bobDistance?: number;
  bobDuration?: number;
  rotateDeg?: number;
  style?: CSSProperties;
  className?: string;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : parallaxRange]);

  return (
    <motion.div
      ref={ref}
      style={{ ...style, y }}
      className={className}
      animate={
        reduce
          ? undefined
          : {
              y: [0, -bobDistance, 0],
              rotate: [rotateDeg, rotateDeg + 1, rotateDeg],
            }
      }
      transition={
        reduce
          ? undefined
          : { duration: bobDuration, repeat: Infinity, ease: "easeInOut" }
      }
    >
      {children}
    </motion.div>
  );
}

/**
 * CTA button with a subtle magnetic hover and press-state. Wraps any child
 * link/button. Use for the primary CTA only — overuse devalues the effect.
 */
export function MagneticCTA({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  if (reduce) return <div className={className} style={style}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ display: "inline-block", ...style }}
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        el.style.setProperty("--mag-x", `${dx * 4}px`);
        el.style.setProperty("--mag-y", `${dy * 4}px`);
      }}
      onPointerLeave={() => {
        const el = ref.current;
        if (!el) return;
        el.style.setProperty("--mag-x", "0px");
        el.style.setProperty("--mag-y", "0px");
      }}
    >
      <div
        style={{
          transform: "translate(var(--mag-x, 0), var(--mag-y, 0))",
          transition: "transform 0.18s cubic-bezier(.22,1,.36,1)",
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}

/**
 * Animated grid that staggers card entry as the section scrolls into view.
 * Use for "Popular corridors", carrier strips, and similar grid sections.
 */
export function StaggerGrid({
  children,
  staggerDelay = 0.06,
  className,
  style,
}: {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: reduce ? 0 : staggerDelay } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={style}
      variants={{
        hidden: { opacity: 0, y: reduce ? 0 : 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * 3D tilt card. On hover, rotates around X/Y axis based on cursor position
 * within the card. Subtle (max ±8°) — feels premium without being gimmicky.
 * Falls back to static when prefers-reduced-motion is set.
 */
export function TiltCard({
  children,
  className,
  style,
  maxTilt = 6,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  maxTilt?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className} style={style}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ ...style, transformStyle: "preserve-3d", perspective: 1000, display: "flex" }}
      whileHover={{ scale: 1.015 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const ry = (px - 0.5) * 2 * maxTilt;
        const rx = -(py - 0.5) * 2 * maxTilt;
        el.style.setProperty("--tilt-x", `${rx}deg`);
        el.style.setProperty("--tilt-y", `${ry}deg`);
      }}
      onPointerLeave={() => {
        const el = ref.current;
        if (!el) return;
        el.style.setProperty("--tilt-x", "0deg");
        el.style.setProperty("--tilt-y", "0deg");
      }}
    >
      <div
        style={{
          transform: "rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg))",
          transition: "transform 0.18s cubic-bezier(.22,1,.36,1)",
          transformStyle: "preserve-3d",
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}

/**
 * Premium dark CTA block — for the homepage "Ready to compare?" final block.
 * Adds a subtle glow that follows the cursor + scale-up on hover.
 */
export function GlowCTA({
  children,
  className,
  style,
  glowColor = "rgba(232,92,58,.45)",
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  glowColor?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className} style={style}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        position: "relative",
        ...style,
      }}
      whileHover={{ scale: 1.005 }}
      transition={{ type: "spring", stiffness: 250, damping: 20 }}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 100;
        const y = ((e.clientY - r.top) / r.height) * 100;
        el.style.setProperty("--glow-x", `${x}%`);
        el.style.setProperty("--glow-y", `${y}%`);
        el.style.setProperty("--glow-opacity", "1");
      }}
      onPointerLeave={() => {
        const el = ref.current;
        if (!el) return;
        el.style.setProperty("--glow-opacity", "0");
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          pointerEvents: "none",
          background: `radial-gradient(600px circle at var(--glow-x, 50%) var(--glow-y, 50%), ${glowColor}, transparent 40%)`,
          opacity: "var(--glow-opacity, 0)",
          transition: "opacity 0.3s ease-out",
          zIndex: 0,
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </motion.div>
  );
}

/**
 * Animated number counter. Counts from 0 → `to` when the element scrolls into
 * view. Use for hero stats, ratings, big numbers. Respects locale formatting
 * (commas/dots) via the optional `format` callback.
 */
export function CountUp({
  to,
  duration = 1.4,
  decimals = 0,
  prefix = "",
  suffix = "",
  format,
  className,
  style,
}: {
  to: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Custom formatter that receives the current numeric value. Overrides decimals. */
  format?: (n: number) => string;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? to : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setDisplay(to);
      return;
    }
    const controls = animate(0, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, to, duration, reduce]);

  const text = format
    ? format(display)
    : decimals === 0
      ? Math.round(display).toLocaleString()
      : display.toFixed(decimals);

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}{text}{suffix}
    </span>
  );
}
