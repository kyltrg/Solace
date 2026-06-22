"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import { getStickyNotes, saveStickyNote } from "@/actions/stickynotes";

type NoteRecord = {
  message: string;
  updatedAt: string;
};

const STORAGE_KEY = "solace-stickynotes";
const DEBOUNCE_MS = 3000;
const POLL_MS = 1000;

function loadFromLocal(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

function saveToLocal(author: string, message: string) {
  const data = loadFromLocal();
  data[author] = message;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function formatWrittenDate(iso: string) {
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase();
  const time = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  return `Written on ${date} | ${time}`;
}

export default function StickyNotes() {
  const [angel, setAngel] = useState<NoteRecord | null>(null);
  const [kyle, setKyle] = useState<NoteRecord | null>(null);
  const [mounted, setMounted] = useState(false);
  const [identity, setIdentity] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef<Record<string, string>>({});

  useEffect(() => {
    const cookieUser = Cookies.get("solace-user") ?? "";
    const isAdmin = Cookies.get("solace-admin") === "true";
    const me = isAdmin ? "" : cookieUser.toLowerCase() === "kyle" ? "kyle" : "angel";
    setIdentity(me);

    const local = loadFromLocal();
    getStickyNotes().then((server) => {
      setAngel(server.angel ?? { message: local.angel ?? "", updatedAt: "" });
      setKyle(server.kyle ?? { message: local.kyle ?? "", updatedAt: "" });
      setMounted(true);
    }).catch(() => {
      setAngel({ message: local.angel ?? "", updatedAt: "" });
      setKyle({ message: local.kyle ?? "", updatedAt: "" });
      setMounted(true);
    });
  }, []);

  useEffect(() => {
    if (!mounted || !identity) return;
    const interval = setInterval(() => {
      getStickyNotes().then((server) => {
        if (server.angel && server.angel.updatedAt && identity !== "angel") setAngel(server.angel);
        if (server.kyle && server.kyle.updatedAt && identity !== "kyle") setKyle(server.kyle);
      }).catch(() => {});
    }, POLL_MS);
    return () => clearInterval(interval);
  }, [mounted, identity]);

  const saveToServer = useCallback((me: string, value: string) => {
    if (lastSavedRef.current[me] === value) return;
    setSaving(true);
    const fd = new FormData();
    fd.append("author", me);
    fd.append("message", value);
    saveStickyNote(fd).then((res) => {
      lastSavedRef.current[me] = value;
      const record: NoteRecord = { message: value, updatedAt: res.updatedAt };
      if (me === "angel") setAngel(record);
      else setKyle(record);
    }).finally(() => setSaving(false));
  }, []);

  const updateNote = useCallback((value: string) => {
    const me = identity;
    if (!me) return;

    if (me === "angel") {
      setAngel((prev) => prev ? { ...prev, message: value } : { message: value, updatedAt: "" });
    } else {
      setKyle((prev) => prev ? { ...prev, message: value } : { message: value, updatedAt: "" });
    }
    saveToLocal(me, value);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      saveToServer(me, value);
    }, DEBOUNCE_MS);
  }, [identity, saveToServer]);

  const handleBlur = useCallback(() => {
    const me = identity;
    if (!me) return;
    const current = me === "angel" ? angel?.message : kyle?.message;
    if (current !== undefined) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      saveToServer(me, current);
    }
  }, [identity, angel, kyle, saveToServer]);

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
                {identity === "angel" && <span className="ml-2 text-[10px] opacity-60">(You)</span>}
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
                value={angel?.message ?? ""}
                onChange={(e) => identity === "angel" && updateNote(e.target.value)}
                onBlur={() => identity === "angel" && handleBlur()}
                placeholder="Write a message for Kyle..."
                readOnly={identity !== "angel"}
                className="min-h-[140px] w-full resize-none bg-transparent font-poppins text-base leading-relaxed outline-none placeholder:text-[var(--muted)]/50"
                maxLength={500}
              />
              <div className="mt-3 flex flex-col gap-1.5 border-t border-[var(--border)] pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[.15em] text-black">Angel&apos;s note</span>
                  <div className="flex items-center gap-2">
                    {saving && identity === "angel" && <span className="text-[9px] uppercase tracking-[.2em] text-black">Saving...</span>}
                    <p className="sticky-note-char-angel text-xs text-black/60">{(angel?.message ?? "").length}/500</p>
                  </div>
                </div>
                {angel?.updatedAt && (
                  <p className="text-[9px] tracking-wide text-black">
                    {formatWrittenDate(angel.updatedAt)}
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
                {identity === "kyle" && <span className="ml-2 text-[10px] opacity-60">(You)</span>}
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
                value={kyle?.message ?? ""}
                onChange={(e) => identity === "kyle" && updateNote(e.target.value)}
                onBlur={() => identity === "kyle" && handleBlur()}
                placeholder="Write a message for Angel..."
                readOnly={identity !== "kyle"}
                className="min-h-[140px] w-full resize-none bg-transparent font-poppins text-base leading-relaxed outline-none placeholder:text-[var(--muted)]/50"
                maxLength={500}
              />
              <div className="mt-3 flex flex-col gap-1.5 border-t border-[var(--border)] pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[.15em] text-black">Kyle&apos;s note</span>
                  <div className="flex items-center gap-2">
                    {saving && identity === "kyle" && <span className="text-[9px] uppercase tracking-[.2em] text-black">Saving...</span>}
                    <p className="sticky-note-char-kyle text-xs text-black/60">{(kyle?.message ?? "").length}/500</p>
                  </div>
                </div>
                {kyle?.updatedAt && (
                  <p className="text-[9px] tracking-wide text-black">
                    {formatWrittenDate(kyle.updatedAt)}
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
