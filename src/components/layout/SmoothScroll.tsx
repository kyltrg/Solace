"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      anchors: { offset: 80 },
      lerp: 0.08,
    });
    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
