"use client";

import { useEffect } from "react";

/**
 * Adds a `scrolled` class to <header> after 10px of scroll so the navbar can
 * gain a shadow. Previously this also drove fade-in animations via opacity:0
 * + IntersectionObserver, but that pattern proved unsafe (bundle-load failures
 * left content invisible). Animations are now SSR-aware via Framer Motion in
 * src/components/HeroMotion.tsx.
 */
export default function ScrollAnimations() {
  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;
    const onScroll = () => {
      if (window.scrollY > 10) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return null;
}
