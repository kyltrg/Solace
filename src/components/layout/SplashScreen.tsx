"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

const particles = [...Array(12)].map((_, i) => ({
  id: i,
  w: 4 + Math.random() * 8,
  h: 4 + Math.random() * 8,
  l: `${Math.random() * 100}%`,
  t: `${Math.random() * 100}%`,
  d: 6 + Math.random() * 6,
}));

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 500);
    }, 2200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[var(--bg)]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,var(--accent-soft),transparent_35%)]" />

          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full bg-[var(--accent)]/15"
              style={{ width: p.w, height: p.h, left: p.l, top: p.t }}
              animate={{
                y: [-20, 20, -20],
                opacity: [0.1, 0.5, 0.1],
              }}
              transition={{
                duration: p.d,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}

          <div className="relative flex flex-col items-center">
            <motion.div className="relative">
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.15, 0.35, 0.15],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-full bg-[var(--accent)] blur-[60px]"
              />
              <motion.div
                animate={{ scale: [1, 1.03, 1] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative flex h-32 w-32 items-center justify-center"
              >
                <Image
                  src="/assets/logo/icon-splashed.webp"
                  alt="Solace"
                  width={128}
                  height={128}
                  priority
                  loading="eager"
                  fetchPriority="high"
                  unoptimized
                  className="h-full w-full object-contain"
                />
              </motion.div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.9 }}
              className="mt-6 font-display text-4xl tracking-[0.45em] text-[var(--text)]"
            >
              SOLACE
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mt-3 text-sm tracking-[0.12em] text-[var(--muted)]"
            >
              Your home, you're home!
            </motion.p>

            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="mt-8 text-xs tracking-[0.3em] text-[var(--muted)] uppercase"
            >
              Entering Solace
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
