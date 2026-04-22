"use client";

import { useEffect } from "react";

export default function ScrollAnimations() {
  useEffect(() => {
    const animatedSelector = ".fade-in, .stagger-children";

    // Immediately reveal any element already in / near the viewport on mount.
    // IntersectionObserver fires on register, but its rootMargin can leave
    // below-the-fold content hidden until scroll — bad UX if user doesn't scroll.
    const reveal = (el: Element) => el.classList.add("is-visible");
    const inViewport = (el: Element) => {
      const r = el.getBoundingClientRect();
      const h = window.innerHeight || document.documentElement.clientHeight;
      return r.top < h * 1.2 && r.bottom > 0;
    };

    document.querySelectorAll(animatedSelector).forEach((el) => {
      if (inViewport(el)) reveal(el);
    });

    // Observer for elements that will scroll into view later.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) reveal(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll(animatedSelector).forEach((el) => {
      observer.observe(el);
    });

    // Safety net: if for any reason (ad blocker, extension interference, slow hydration)
    // elements are still hidden 1s after mount, force-reveal them so content is never lost.
    const safety = window.setTimeout(() => {
      document.querySelectorAll(animatedSelector).forEach(reveal);
    }, 1000);

    // Navbar scroll shadow
    const header = document.querySelector("header");
    const onScroll = () => {
      if (!header) return;
      if (window.scrollY > 10) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
      window.clearTimeout(safety);
    };
  }, []);

  return null;
}
