"use client";

import { motion } from "framer-motion";
import { Comfort } from "./ComfortRoom";
import { X } from "lucide-react";

export default function ComfortMessage({ message, onClose }: { message: Comfort; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm cursor-pointer"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: .95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: .95, y: 20, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-xl w-full overflow-hidden rounded-[3rem] border border-[var(--border)] bg-[var(--bg-elevated)] p-10"
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted)]/50 transition-all hover:bg-[var(--glass)] hover:text-[var(--text)]"
        >
          <X size={14} />
        </button>

        <p className="text-xs uppercase tracking-[.3em] text-[var(--accent)]/60">{message.category}</p>
        <h2 className="mt-6 font-display text-5xl">{message.title}</h2>
        <p className="mt-8 whitespace-pre-line leading-relaxed text-lg text-[var(--muted)]/70">{message.content}</p>

        <button
          onClick={onClose}
          className="mt-10 rounded-full border border-[var(--border)] px-6 py-3 text-sm transition-all duration-300 hover:bg-[var(--glass)] hover:border-[var(--accent)]/30"
        >
          I&apos;m okay now
        </button>
      </motion.div>
    </motion.div>
  );
}
