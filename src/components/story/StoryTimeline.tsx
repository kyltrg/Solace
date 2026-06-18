"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const MILESTONES = [
  { label: "First Hello", year: "2024" },
  { label: "First Date", year: "2024" },
  { label: "First I Love You", year: "2024" },
  { label: "Today & Always", year: "Forever" },
];

export default function StoryTimeline(): React.JSX.Element {
  return (
    <div className="relative">
      <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-[var(--accent)]/40 via-[var(--accent)]/10 to-transparent md:left-1/2 md:-translate-x-px" />

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative z-10 mx-auto mb-16 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[var(--accent)] bg-[var(--bg)] shadow-[0_0_30px_rgba(168,141,114,0.2)]"
      >
        <Heart size={18} className="text-[var(--accent)]" />
      </motion.div>

      <div className="space-y-12">
        {MILESTONES.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: [.22,1,.36,1] }}
            className="relative flex items-center gap-6 md:flex-row"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, damping: 14, delay: i * 0.1 }}
              className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--accent)]/40 bg-[var(--bg)] md:mx-auto"
            >
              <div className="h-2 w-2 rounded-full bg-[var(--accent)]" />
            </motion.div>
            <div className="md:text-center">
              <p className="font-display text-lg tracking-[-0.01em]">{m.label}</p>
              <p className="text-xs uppercase tracking-[.2em] text-[var(--muted)]/50">{m.year}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
