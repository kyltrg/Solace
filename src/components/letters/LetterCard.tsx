"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Pin, User } from "lucide-react";

export default function LetterCard({
  letter,
  pinned,
  onTogglePin,
  highlight,
}: {
  letter: { id: string; title: string; preview: string; category: string; author: string | null; createdAt: string };
  pinned?: boolean;
  onTogglePin?: () => void;
  highlight?: boolean;
}) {
  return (
    <motion.div
      id={`letter-${letter.id}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: .6, ease: [.22,1,.36,1] }}
      className={`rounded-2xl transition-all duration-700 ${
        highlight ? "ring-2 ring-amber-400/50 bg-amber-400/5" : ""
      }`}
    >
      <div className="group relative rounded-2xl border border-[var(--text)]/8 bg-[var(--text)]/[0.02] transition-all duration-300 hover:border-[var(--text)]/15 hover:bg-[var(--text)]/[0.04]">
        <Link
          href={`/letters/${letter.id}`}
          className="block p-5 md:p-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              {onTogglePin && (
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); onTogglePin(); }}
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition-all duration-200 ${
                    pinned
                      ? "border-[var(--text)]/15 text-[var(--text)]/50 bg-[var(--text)]/8"
                      : "border-transparent text-[var(--text)]/15 opacity-0 group-hover:opacity-100 group-hover:border-[var(--text)]/8 hover:!text-[var(--text)]/45 hover:!opacity-100"
                  }`}
                  title={pinned ? "Unpin" : "Pin"}
                >
                  <Pin size={14} fill={pinned ? "currentColor" : "none"} />
                </button>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-[11px] font-medium uppercase tracking-[.25em] text-[var(--text)]/45">
                    {letter.category}
                  </p>
                  {letter.author && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-[var(--text)]/30 uppercase tracking-[.15em]">
                      <User size={10} />
                      {letter.author}
                    </span>
                  )}
                </div>

                <h3 className="mt-2 font-serif text-xl leading-snug text-[var(--text)] md:text-2xl">
                  {letter.title}
                </h3>

                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--text)]/60">
                  {letter.preview}
                </p>

                <p className="mt-3 text-xs text-[var(--text)]/35">
                  {new Date(letter.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--text)]/10 text-[var(--text)]/30 transition-all duration-300 group-hover:border-[var(--text)]/20 group-hover:text-[var(--text)]/60 group-hover:bg-[var(--text)]/5">
              <ArrowRight size={16} />
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}
