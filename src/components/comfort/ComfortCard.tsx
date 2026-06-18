"use client";

import { motion } from "framer-motion";
import { Comfort } from "./ComfortRoom";
import { ArrowRight } from "lucide-react";

export default function ComfortCard({ message, onOpen }: { message: Comfort; onOpen: () => void }) {
  return (
    <motion.button
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      onClick={onOpen}
      className="group glass-card relative w-full rounded-[2.5rem] p-8 text-left backdrop-blur-xl"
    >
      <p className="text-xs uppercase tracking-[.25em] text-[var(--accent)]/60">{message.category}</p>
      <h3 className="mt-5 font-display text-3xl">{message.title}</h3>
      <p className="mt-4 line-clamp-3 text-[var(--muted)]/60">{message.content}</p>

      <div className="mt-6 flex items-center gap-2 text-sm text-[var(--accent)]/50 transition-all duration-300 group-hover:text-[var(--accent)]">
        <span>Open</span>
        <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </motion.button>
  );
}
