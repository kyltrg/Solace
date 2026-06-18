"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Pin, LayoutGrid, List, BookOpen, PenLine } from "lucide-react";
import Link from "next/link";
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
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("list");
  const [pinned, setPinned] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const stored = JSON.parse(localStorage.getItem("pinned-letters") || "[]");
      return new Set<string>(stored);
    } catch {
      return new Set();
    }
  });

  const [scrollProgress, setScrollProgress] = useState(0);
  const archiveRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(letters.map((x) => x.category)))],
    [letters]
  );

  const query = search.toLowerCase().trim();
  const filtered = useMemo(() => {
    let result = filter === "All" ? letters : letters.filter((x) => x.category === filter);
    if (query) {
      result = result.filter(
        (x) =>
          x.title.toLowerCase().includes(query) ||
          x.preview.toLowerCase().includes(query) ||
          x.category.toLowerCase().includes(query)
      );
    }
    return result;
  }, [letters, filter, query]);

  const pinnedLetters = useMemo(
    () => filtered.filter((l) => pinned.has(l.id)),
    [filtered, pinned]
  );
  const unpinnedLetters = useMemo(
    () => filtered.filter((l) => !pinned.has(l.id)),
    [filtered, pinned]
  );

  const togglePin = (id: string) => {
    setPinned((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem("pinned-letters", JSON.stringify([...next]));
      return next;
    });
  };

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
    <section ref={archiveRef}>
      {letters.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--text)]/[0.04]">
            <BookOpen size={28} className="text-[var(--text)]/20" />
          </div>
          <p className="font-serif text-2xl text-[var(--text)]/50">No letters yet</p>
          <p className="mt-3 text-sm text-[var(--text)]/35 max-w-xs">
            The pages are waiting. Write something — a memory, a promise, a secret only the two of you share.
          </p>
          <Link
            href="/letters/compose"
            className="mt-10 inline-flex items-center gap-3 rounded-full border border-[var(--text)]/20 px-8 py-4 text-sm font-medium text-[var(--text)]/70 transition-all duration-300 hover:border-[var(--text)]/40 hover:bg-[var(--text)] hover:text-[var(--bg)]"
          >
            <PenLine size={18} />
            <span>Write your first letter</span>
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between mb-10">
            <div className="relative w-full sm:max-w-xs">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text)]/25" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search letters…"
                className="w-full rounded-xl border border-[var(--text)]/8 bg-[var(--text)]/[0.02] py-3 pl-11 pr-4 text-sm text-[var(--text)] placeholder-[var(--text)]/20 outline-none transition-colors focus:border-[var(--text)]/20"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex gap-1 rounded-xl border border-[var(--text)]/8 p-1">
                <button
                  onClick={() => setView("list")}
                  className={`rounded-lg p-2 transition-colors ${
                    view === "list" ? "bg-[var(--text)]/8 text-[var(--text)]" : "text-[var(--text)]/25 hover:text-[var(--text)]/50"
                  }`}
                >
                  <List size={14} />
                </button>
                <button
                  onClick={() => setView("grid")}
                  className={`rounded-lg p-2 transition-colors ${
                    view === "grid" ? "bg-[var(--text)]/8 text-[var(--text)]" : "text-[var(--text)]/25 hover:text-[var(--text)]/50"
                  }`}
                >
                  <LayoutGrid size={14} />
                </button>
              </div>

              <div className="flex gap-2 overflow-x-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`rounded-xl border px-4 py-2 text-xs transition-all duration-300 whitespace-nowrap ${
                      filter === cat
                        ? "border-[var(--text)]/25 text-[var(--text)] bg-[var(--text)]/8"
                        : "border-[var(--text)]/8 text-[var(--text)]/35 hover:border-[var(--text)]/15 hover:text-[var(--text)]/60"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <motion.div
            style={{
              transform: `translateY(${(1 - scrollProgress) * 12}px)`,
              opacity: Math.min(1, scrollProgress * 1.5),
            }}
            transition={{ duration: .2 }}
          >
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-center">
                <p className="font-serif text-xl text-[var(--text)]/40">No letters found</p>
                <p className="mt-2 text-sm text-[var(--text)]/25">Try a different search or filter.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pinnedLetters.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 pb-4">
                      <Pin size={12} className="text-[var(--text)]/25" />
                      <span className="text-[10px] font-medium uppercase tracking-[.25em] text-[var(--text)]/25">Pinned</span>
                      <div className="h-px flex-1 bg-[var(--text)]/6" />
                    </div>
                    <div className={view === "grid" ? "grid gap-3 md:grid-cols-2" : "space-y-3"}>
                      {pinnedLetters.map((l) => (
                        <LetterCard
                          key={l.id}
                          letter={l}
                          pinned={pinned.has(l.id)}
                          onTogglePin={() => togglePin(l.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {pinnedLetters.length > 0 && unpinnedLetters.length > 0 && (
                  <div className="flex items-center gap-4 py-6">
                    <div className="h-px flex-1 bg-[var(--text)]/6" />
                    <span className="text-[10px] font-medium uppercase tracking-[.25em] text-[var(--text)]/20">
                      {unpinnedLetters.length} more
                    </span>
                    <div className="h-px flex-1 bg-[var(--text)]/6" />
                  </div>
                )}

                {unpinnedLetters.length > 0 && (
                  <div className={view === "grid" ? "grid gap-3 md:grid-cols-2" : "space-y-3"}>
                    {unpinnedLetters.map((l) => (
                      <LetterCard
                        key={l.id}
                        letter={l}
                        pinned={pinned.has(l.id)}
                        onTogglePin={() => togglePin(l.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </section>
  );
}
