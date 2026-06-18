"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type StickyData = {
  angel: string;
  kyle: string;
};

const STORAGE_KEY = "solace-stickynotes";

function loadNotes(): StickyData {
  if (typeof window === "undefined") return { angel: "", kyle: "" };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { angel: "", kyle: "" };
}

function saveNotes(data: StickyData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export default function StickyNotes() {
  const [notes, setNotes] = useState<StickyData>({ angel: "", kyle: "" });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setNotes(loadNotes());
    setMounted(true);
  }, []);

  const updateNote = (who: "angel" | "kyle", value: string) => {
    const next = { ...notes, [who]: value };
    setNotes(next);
    saveNotes(next);
  };

  if (!mounted) return null;

  return (
    <section className="relative px-6 py-40">
      <div className="mx-auto max-w-5xl">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs uppercase tracking-[.5em] text-[var(--accent)]"
        >
          Left a Note
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-4 text-center font-display text-5xl md:text-7xl"
        >
          Sticky Notes
        </motion.h2>

        <div className="mt-16 grid gap-14 md:grid-cols-2 md:gap-12">
          <div>
            <motion.p
              initial={{ opacity: 0, x: -20, rotate: -3 }}
              whileInView={{ opacity: 1, x: 0, rotate: -2 }}
              viewport={{ once: true }}
              transition={{ duration: .6, ease: [.22,1,.36,1] }}
              className="sticky-note-title-angel mb-5 font-display font-bold text-3xl tracking-tight text-[#e8a0b4] [text-shadow:0_1px_2px_rgba(0,0,0,.3)] md:text-4xl"
            >
              Angel&apos;s Sticky Note
            </motion.p>
            <motion.div
              initial={{ opacity: 0, x: -30, rotate: -2 }}
              whileInView={{ opacity: 1, x: 0, rotate: -1 }}
              viewport={{ once: true }}
              transition={{ duration: .6, ease: [.22,1,.36,1] }}
              className="sticky-note sticky-note-angel rounded-2xl p-6 shadow-lg"
            >
              <textarea
                value={notes.angel}
                onChange={(e) => updateNote("angel", e.target.value)}
                placeholder="Write a message for Kyle..."
                className="min-h-[140px] w-full resize-none bg-transparent font-poppins text-base leading-relaxed outline-none placeholder:text-white/50"
                maxLength={500}
              />
              <div className="mt-3 flex items-center justify-between border-t border-white/20 pt-3">
                <span className="text-[10px] uppercase tracking-[.15em] text-white/40">Angel&apos;s note</span>
                <p className="sticky-note-char-angel text-xs text-pink-800/40">{notes.angel.length}/500</p>
              </div>
            </motion.div>
          </div>

          <div>
            <motion.p
              initial={{ opacity: 0, x: 20, rotate: 3 }}
              whileInView={{ opacity: 1, x: 0, rotate: 2 }}
              viewport={{ once: true }}
              transition={{ duration: .6, ease: [.22,1,.36,1] }}
              className="sticky-note-title-kyle mb-5 text-right font-display font-bold text-3xl tracking-tight text-[#90b8d8] [text-shadow:0_1px_2px_rgba(0,0,0,.3)] md:text-4xl"
            >
              Kyle&apos;s sticky note
            </motion.p>
            <motion.div
              initial={{ opacity: 0, x: 30, rotate: 2 }}
              whileInView={{ opacity: 1, x: 0, rotate: 1 }}
              viewport={{ once: true }}
              transition={{ duration: .6, ease: [.22,1,.36,1] }}
              className="sticky-note sticky-note-kyle rounded-2xl p-6 shadow-lg"
            >
              <textarea
                value={notes.kyle}
                onChange={(e) => updateNote("kyle", e.target.value)}
                placeholder="Write a message for Angel..."
                className="min-h-[140px] w-full resize-none bg-transparent font-poppins text-base leading-relaxed outline-none placeholder:text-white/50"
                maxLength={500}
              />
              <div className="mt-3 flex items-center justify-between border-t border-white/20 pt-3">
                <span className="text-[10px] uppercase tracking-[.15em] text-white/40">Kyle&apos;s note</span>
                <p className="sticky-note-char-kyle mt-2 text-right text-xs text-blue-800/40">{notes.kyle.length}/500</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
