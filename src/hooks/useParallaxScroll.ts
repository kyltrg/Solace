"use client";

import { useEffect } from "react";
import { useMotionValue, useSpring } from "framer-motion";

export function useParallaxScroll() {
  const scrollY = useMotionValue(0);

  useEffect(() => {
    const handleScroll = () => {
      scrollY.set(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollY]);

  const smoothScroll = useSpring(scrollY, {
    stiffness: 80,
    damping: 20,
  });

  return smoothScroll;
}