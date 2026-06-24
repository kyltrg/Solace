"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { getCurrentTime, getDuration } from "./yt-manager";

export function useProgress(barRef: React.RefObject<HTMLDivElement | null>) {
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const stableRef = useRef(barRef);
  stableRef.current = barRef;

  useEffect(() => {
    let rafId: number | null = null;
    let lastSec = -1;

    const tick = () => {
      const cur = getCurrentTime();
      const dur = getDuration();

      // Update DOM directly for the bar — no React re-render
      const el = stableRef.current?.current;
      if (el && dur > 0) {
        el.style.width = `${(cur / dur) * 100}%`;
      }

      // Only update React state once per second (for time labels)
      const sec = Math.floor(cur);
      if (sec !== lastSec) {
        lastSec = sec;
        setCurrent(cur);
        setDuration(dur);
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return { current, duration };
}

export function formatTime(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
