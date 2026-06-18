"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import LetterCard from "./LetterCard";

export type Letter = {
  id: string;
  title: string;
  preview: string;
  category: string;
  createdAt: string;
};

export default function LetterArchive({ letters }: { letters: Letter[] }) {
  const [filter, setFilter] = useState("All");
  const [scrollProgress, setScrollProgress] = useState(0);
  const archiveRef = useRef<HTMLDivElement>(null);

  const categories = ["All", ...Array.from(new Set(letters.map((x) => x.category)))];

  const filtered = filter === "All" ? letters : letters.filter((x) => x.category === filter);

  useEffect(() => {
    const el = archiveRef.current;
    if (!el) return;
    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={archiveRef} className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`rounded-full border px-5 py-2 text-sm transition-all duration-300 whitespace-nowrap ${
              filter === cat
                ? "border-[var(--sepia)] text-[var(--sepia)] bg-[var(--sepia)]/10"
                : "border-[var(--border)] text-[var(--muted)]/60 hover:border-[var(--accent)]/30 hover:text-[var(--accent)]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <motion.div
        style={{
          transform: `translateY(${(1 - scrollProgress) * 20}px)`,
          opacity: Math.min(1, scrollProgress * 2),
        }}
        transition={{ duration: .2 }}
        className="divide-y divide-[var(--border)]"
      >
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <p className="font-display text-2xl text-[var(--muted)]/50">No letters yet</p>
            <p className="mt-2 text-sm text-[var(--muted)]/30">The pages are waiting to be written.</p>
          </div>
        ) : (
          filtered.map((letter, i) => (
            <div key={letter.id} className="py-4 first:pt-0">
              <LetterCard letter={letter} />
            </div>
          ))
        )}
      </motion.div>
    </section>
  );
}
