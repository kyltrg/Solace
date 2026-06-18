"use client";

import type { DateMemory } from "@/types/date-memory";
import { motion } from "framer-motion";
import { Heart, MapPin, Clock } from "lucide-react";

export default function DateCard({ memory }: { memory: DateMemory }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: .5, ease: [.22,1,.36,1] }}
      className="group relative overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[var(--card-bg)] p-8 backdrop-blur-xl transition-all duration-500 hover:border-[var(--accent)]/30 hover:bg-[var(--card-hover)]"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-[var(--accent)]/10 blur-3xl transition-all duration-500 group-hover:bg-[var(--accent)]/20" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-soft)]">
                <Heart size={12} className="text-[var(--accent)]" />
              </div>
              <p className="text-xs uppercase tracking-[.25em] text-[var(--accent)]">
                {new Date(memory.memoryDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>

            <h3 className="mt-5 font-display text-3xl leading-tight md:text-4xl">{memory.title}</h3>

            {memory.description && (
              <p className="mt-3 leading-relaxed text-[var(--muted)]">{memory.description}</p>
            )}

            {memory.location && (
              <p className="mt-4 flex items-center gap-1.5 text-xs text-[var(--muted)]/50">
                <MapPin size={12} />
                {memory.location}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 border-t border-[var(--border)] pt-4">
          <Clock size={11} className="text-[var(--muted)]/40" />
          <p className="text-[11px] text-[var(--muted)]/40">
            Recorded {new Date(memory.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      </div>
    </motion.article>
  );
}
