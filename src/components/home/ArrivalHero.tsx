"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const roles = ["Home", "Sanctuary", "Solace", "Ours", "Direk"];

export default function ArrivalHero(): React.JSX.Element {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);  
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .8, ease: [.22,1,.36,1] }}
          className="inline-flex items-center gap-3 rounded-full border border-[var(--accent)]/20 bg-[var(--accent-soft)] px-5 py-2"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
          <span className="text-xs uppercase tracking-[.4em] text-[var(--accent)]">Welcome Home</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: .95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, delay: .2, ease: [.22,1,.36,1] }}
          className="mt-10 font-display text-[clamp(5rem,15vw,10rem)] leading-none"
        >
          {"SOLACE".split("").map((letter, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 40, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.7, delay: 0.3 + i * 0.06, ease: [.22,1,.36,1] }}
              className="inline-block gradient-text"
              style={{ perspective: "600px" }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .8, delay: .5 }}
          className="mt-8"
        >
          <span className="text-lg text-[var(--muted)]">A quiet place for </span>
          <motion.span
            key={roles[roleIndex]}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: .4 }}
            className="text-lg font-display italic text-[var(--accent)]"
          >
            {roles[roleIndex]}
          </motion.span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: .8, delay: .7 }}
          className="mx-auto mt-6 max-w-xl leading-relaxed text-[var(--muted)]/70"
        >
          Every memory we've made, every prayer we've shared, and the love that keeps choosing us every day.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: .8, delay: 1.2 }}
          className="mt-12 sm:mt-16 md:mt-24 flex items-center justify-center gap-4"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--accent)]/20 text-[var(--accent)]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </motion.div>
          <p className="text-[10px] sm:text-xs uppercase tracking-[.4em] text-[var(--accent)]/50">Explore</p>
        </motion.div>
      </div>
    </section>
  );
}
