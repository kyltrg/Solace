"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { getStickyNotes, saveStickyNotes } from "@/actions/stickynotes";

type StickyData = {
  angel: string;
  kyle: string;
};

const STORAGE_KEY = "solace-stickynotes";
const DEBOUNCE_MS = 1500;

function loadFromLocal(): StickyData {
  if (typeof window === "undefined") return { angel: "", kyle: "" };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { angel: "", kyle: "" };
}

function saveToLocal(data: StickyData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export default function StickyNotes() {
  const [notes, setNotes] = useState<StickyData>({ angel: "", kyle: "" });
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestRef = useRef<StickyData>(notes);

  useEffect(() => {
    latestRef.current = notes;
  }, [notes]);

  useEffect(() => {
    const local = loadFromLocal();

    getStickyNotes()
      .then((server) => {
        const merged: StickyData = {
          angel: server.angelMessage || local.angel,
          kyle: server.kyleMessage || local.kyle,
        };
        setNotes(merged);
        if (server.updatedAt) setUpdatedAt(server.updatedAt);
        saveToLocal(merged);
        setMounted(true);
      })
      .catch(() => {
        setNotes(local);
        setMounted(true);
      });
  }, []);

  const updateNote = useCallback(
    (who: "angel" | "kyle", value: string) => {
      const next = { ...latestRef.current, [who]: value };
      latestRef.current = next;
      setNotes(next);
      saveToLocal(next);

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setSaving(true);
        const fd = new FormData();
        fd.append("angelMessage", next.angel);
        fd.append("kyleMessage", next.kyle);
        saveStickyNotes(fd).then((res) => {
          if (res?.updatedAt) setUpdatedAt(res.updatedAt);
        }).finally(() => setSaving(false));
      }, DEBOUNCE_MS);
    },
    [],
  );

  if (!mounted) return null;

  return (
    <section className="relative px-4 sm:px-6 py-20 sm:py-40">
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
              initial={{ opacity: 0, x: -20, rotate: -4 }}
              whileInView={{ opacity: 1, x: 0, rotate: -2 }}
              viewport={{ once: true }}
              transition={{ duration: .6, ease: [.22,1,.36,1] }}
               className="mb-5"
            >
              <span className="sticky-note-title-angel font-display font-bold text-2xl md:text-3xl tracking-tight -rotate-1">
                Angel&apos;s Sticky Note
              </span>
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
                className="min-h-[140px] w-full resize-none bg-transparent font-poppins text-base leading-relaxed outline-none placeholder:text-[var(--muted)]/50"
                maxLength={500}
              />
              <div className="mt-3 flex flex-col gap-1.5 border-t border-[var(--border)] pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[.15em] text-[var(--muted)]">Angel&apos;s note</span>
                  <div className="flex items-center gap-2">
                    {saving && <span className="text-[9px] uppercase tracking-[.2em] text-[var(--muted)]">Saving...</span>}
                    <p className="sticky-note-char-angel text-xs text-pink-800/40">{notes.angel.length}/500</p>
                  </div>
                </div>
                {updatedAt && (
                  <p className="text-[9px] tracking-wide text-[var(--muted)]/60">
                    Last edited {new Date(updatedAt).toLocaleDateString("en-US", {
                      year: "numeric", month: "short", day: "numeric",
                      hour: "2-digit", minute: "2-digit"
                    })}
                  </p>
                )}
              </div>
            </motion.div>
          </div>

          <div>
            <motion.p
              initial={{ opacity: 0, x: 20, rotate: 4 }}
              whileInView={{ opacity: 1, x: 0, rotate: 2 }}
              viewport={{ once: true }}
              transition={{ duration: .6, ease: [.22,1,.36,1] }}
               className="mb-5 text-right"
            >
              <span className="sticky-note-title-kyle font-display font-bold text-2xl md:text-3xl tracking-tight rotate-1">
                Kyle&apos;s Sticky Note
              </span>
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
                className="min-h-[140px] w-full resize-none bg-transparent font-poppins text-base leading-relaxed outline-none placeholder:text-[var(--muted)]/50"
                maxLength={500}
              />
              <div className="mt-3 flex flex-col gap-1.5 border-t border-[var(--border)] pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[.15em] text-[var(--muted)]">Kyle&apos;s note</span>
                  <div className="flex items-center gap-2">
                    {saving && <span className="text-[9px] uppercase tracking-[.2em] text-[var(--muted)]">Saving...</span>}
                    <p className="sticky-note-char-kyle text-xs text-blue-800/40">{notes.kyle.length}/500</p>
                  </div>
                </div>
                {updatedAt && (
                  <p className="text-[9px] tracking-wide text-[var(--muted)]/60">
                    Last edited {new Date(updatedAt).toLocaleDateString("en-US", {
                      year: "numeric", month: "short", day: "numeric",
                      hour: "2-digit", minute: "2-digit"
                    })}
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
