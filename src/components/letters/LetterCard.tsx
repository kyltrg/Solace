"use client";

import Link from "next/link";
import type { Letter } from "./LetterArchive";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function LetterCard({ letter }: { letter: Letter }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: .6, ease: [.22,1,.36,1] }}
    >
      <Link
        href={`/letters/${letter.id}`}
        className="group relative block overflow-hidden rounded-[2rem] border border-[var(--paper-border)]/30 bg-[var(--paper)]/5 p-8 transition-all duration-500 hover:-translate-y-1 hover:border-[var(--paper-border)]/60"
      >
        <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[var(--sepia)]/10 blur-3xl transition-all duration-500 group-hover:bg-[var(--sepia)]/20" />

        <div className="relative flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-[.3em] text-[var(--sepia)]">{letter.category}</p>

            <h3 className="mt-4 font-display text-3xl leading-tight text-[var(--ink)] transition-colors duration-300 group-hover:text-[var(--sepia)] md:text-4xl">
              {letter.title}
            </h3>

            <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[var(--ink)]/60">{letter.preview}</p>

            <p className="mt-4 text-xs text-[var(--sepia)]/50">
              {new Date(letter.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--paper-border)]/30 text-[var(--sepia)] transition-all duration-300 group-hover:border-[var(--sepia)]/50 group-hover:bg-[var(--sepia)]/10">
            <ArrowRight size={18} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
