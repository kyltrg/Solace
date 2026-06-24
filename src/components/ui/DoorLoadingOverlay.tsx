"use client";

import { useLayoutEffect, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useAnimate } from "framer-motion";
import { usePathname } from "next/navigation";

const MIN_SHOW = 3000;
const MAX_SHOW = 15000;

const PATH_DATA = [
  "M 120 350 L 280 350",
  "M 130 200 L 130 350",
  "M 270 200 L 270 350",
  "M 120 200 L 200 120",
  "M 200 120 L 280 200",
];

const PHASES = [
  { parts: [0], dur: 0.2, stagger: 0 },
  { parts: [1, 2], dur: 0.16, stagger: 0.04 },
  { parts: [3, 4], dur: 0.18, stagger: 0.05 },
];

export default function DoorLoadingOverlay() {
  const [ready, setReady] = useState(true);
  const shownAt = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      const t = setTimeout(() => {
        window.dispatchEvent(new CustomEvent("page-ready"));
      }, 400);
      return () => clearTimeout(t);
    }
  }, [pathname]);

  useEffect(() => {
    const onNav = () => {
      if (timer.current) { clearTimeout(timer.current); timer.current = null; }
      setReady(false);
      shownAt.current = Date.now();
      timer.current = setTimeout(() => {
        setReady(true);
        timer.current = null;
      }, MAX_SHOW);
    };

    const onReady = () => {
      if (shownAt.current === 0) return;
      const elapsed = Date.now() - shownAt.current;
      if (timer.current) { clearTimeout(timer.current); timer.current = null; }
      if (elapsed >= MAX_SHOW) { setReady(true); return; }
      const wait = Math.max(0, MIN_SHOW - elapsed);
      timer.current = setTimeout(() => {
        setReady(true);
        timer.current = null;
      }, wait);
    };

    window.addEventListener("solace-loading", onNav);
    window.addEventListener("page-ready", onReady);
    return () => {
      window.removeEventListener("solace-loading", onNav);
      window.removeEventListener("page-ready", onReady);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return (
    <AnimatePresence>
      {!ready && <LoadingView />}
    </AnimatePresence>
  );
}

function LoadingView() {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      while (!cancelled) {
        for (let i = 0; i < PATH_DATA.length; i++) {
          animate(
            `.part-${i}`,
            { pathLength: 0, opacity: 0 },
            { duration: 0, type: "tween" },
          );
        }
        animate(
          ".construction-caption, .solace-title, .solace-tagline",
          { opacity: 0 },
          { duration: 0, type: "tween" },
        );

        await new Promise((r) => setTimeout(r, 100));
        if (cancelled) return;

        animate(
          ".construction-caption",
          { opacity: 0.5 },
          { duration: 0.12, ease: "easeOut", type: "tween" },
        );

        for (const phase of PHASES) {
          for (let i = 0; i < phase.parts.length; i++) {
            animate(
              `.part-${phase.parts[i]}`,
              { pathLength: 1, opacity: 1 },
              {
                duration: phase.dur,
                ease: "easeOut",
                delay: i * phase.stagger,
                type: "tween",
              },
            );
          }
          const totalMs =
            (phase.parts.length - 1) * phase.stagger * 1000 +
            phase.dur * 1000 +
            60;
          await new Promise((r) => setTimeout(r, totalMs));
          if (cancelled) return;
        }

        animate(
          ".construction-caption",
          { opacity: 0 },
          { duration: 0.25, ease: "easeOut", type: "tween" },
        );

        animate(
          ".solace-title",
          { opacity: 1 },
          { duration: 0.4, ease: "easeOut", type: "tween" },
        );
        await animate(
          ".solace-tagline",
          { opacity: 0.5 },
          { duration: 0.4, ease: "easeOut", delay: 0.15, type: "tween" },
        );

        await new Promise((r) => setTimeout(r, 1000));
        if (cancelled) return;

        animate(
          ".solace-title, .solace-tagline",
          { opacity: 0 },
          { duration: 0.2, ease: "easeOut", type: "tween" },
        );
        await new Promise((r) => setTimeout(r, 200));
        if (cancelled) return;

        for (let i = 0; i < PATH_DATA.length; i++) {
          animate(
            `.part-${i}`,
            { opacity: 0.12 },
            { duration: 0.25, ease: "easeOut", type: "tween" },
          );
        }
        await new Promise((r) => setTimeout(r, 300));
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [animate]);

  return (
    <motion.div
      className="fixed inset-0 z-[99999] flex items-center justify-center cursor-wait"
      style={{
        background:
          "radial-gradient(ellipse at 50% 35%, #19120E 0%, #0C0908 45%, #060505 70%)",
      }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.4, ease: "easeInOut" }}
    >
      <div
        ref={scope}
        className="relative w-full max-w-[520px] flex flex-col items-center justify-center px-6"
      >
        <svg
          viewBox="0 0 400 500"
          className="w-full"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="lineGrad" gradientUnits="userSpaceOnUse" x1="-80" y1="0" x2="320" y2="0">
              <animate
                attributeName="x1"
                values="-80;80;-80"
                dur="6s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="x2"
                values="320;480;320"
                dur="6s"
                repeatCount="indefinite"
              />
              <stop offset="0%" stopColor="#DAD0CE" stopOpacity={0.03} />
              <stop offset="30%" stopColor="#DAD0CE" stopOpacity={0.03} />
              <stop offset="50%" stopColor="#F5F0EE" stopOpacity={0.45} />
              <stop offset="70%" stopColor="#DAD0CE" stopOpacity={0.03} />
              <stop offset="100%" stopColor="#DAD0CE" stopOpacity={0.03} />
            </linearGradient>
          </defs>

          <g stroke="url(#lineGrad)" strokeWidth={1} strokeLinecap="round" fill="none">
            {PATH_DATA.map((d, i) => (
              <motion.path
                key={i}
                className={`part-${i}`}
                d={d}
                initial={{ pathLength: 0, opacity: 0 }}
              />
            ))}
          </g>

          <motion.text
            className="construction-caption"
            x="200"
            y="50"
            textAnchor="middle"
            fill="#DAD0CE"
            fontFamily="'Playfair Display', serif"
            fontStyle="italic"
            fontSize="11"
            letterSpacing="4"
            initial={{ opacity: 0 }}
          >
            Our house being built...
          </motion.text>

          <motion.text
            className="solace-title"
            x="200"
            y="395"
            textAnchor="middle"
            fill="#DAD0CE"
            fontFamily="'Playfair Display', serif"
            fontSize="22"
            letterSpacing="8"
            initial={{ opacity: 0 }}
          >
            SOLACE
          </motion.text>

          <motion.text
            className="solace-tagline"
            x="200"
            y="425"
            textAnchor="middle"
            fill="#DAD0CE"
            fontFamily="'Playfair Display', serif"
            fontSize="10"
            letterSpacing="3.5"
            initial={{ opacity: 0 }}
          >
            {`A place we've built together.`}
          </motion.text>
        </svg>
      </div>
    </motion.div>
  );
}

export function usePageReady() {
  const doneRef = useRef(false);
  useLayoutEffect(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        window.dispatchEvent(new CustomEvent("page-ready")),
      ),
    );
    return () => cancelAnimationFrame(raf);
  }, []);
}
