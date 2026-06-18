"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ComfortCard from "./ComfortCard";
import ComfortMessage from "./ComfortMessage";

export type Comfort = {
  id: string;
  category: string;
  title: string;
  content: string;
};

export default function ComfortRoom({ messages }: { messages: Comfort[] }) {
  const [active, setActive] = useState<string | null>(null);
  const [selected, setSelected] = useState<Comfort | null>(null);

  const categories = useMemo(() => [...new Set(messages.map((item) => item.category))], [messages]);

  const filtered = active === null ? [] : active === "ALL" ? messages : messages.filter((item) => item.category === active);

  return (
    <section className="space-y-12">
      <div className="space-y-6">
        <p className="font-display text-4xl">What are you feeling right now?</p>
        <p className="text-[var(--muted)]/50">Choose one. I&apos;ll be right here.</p>

        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActive(category)}
              className={`rounded-full border px-5 py-2 text-sm transition-all duration-300 ${
                active === category
                  ? "bg-[var(--text)] text-[var(--bg)] border-[var(--text)]"
                  : "border-[var(--border)] text-[var(--muted)]/60 hover:border-[var(--accent)]/30 hover:text-[var(--accent)]"
              }`}
            >
              {category}
            </button>
          ))}

          <button
            onClick={() => setActive("ALL")}
            className="rounded-full border border-[var(--border)] px-5 py-2 text-sm text-[var(--muted)]/40 transition-all hover:border-[var(--accent)]/30 hover:text-[var(--accent)]"
          >
            See all
          </button>
        </div>
      </div>

      {active === null && (
        <div className="glass-card rounded-[3rem] p-10 text-center">
          <p className="font-display text-3xl">I&apos;m here.</p>
          <p className="mt-4 text-[var(--muted)]/50">Pick what your heart feels right now. No pressure.</p>
        </div>
      )}

      <AnimatePresence mode="wait">
        {active !== null && (
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid gap-5 md:grid-cols-2"
          >
            {filtered.length === 0 ? (
              <div className="col-span-full flex flex-col items-center py-12 text-center">
                <p className="font-display text-xl text-[var(--muted)]/50">No messages here yet</p>
              </div>
            ) : (
              filtered.map((message) => (
                <ComfortCard key={message.id} message={message} onOpen={() => setSelected(message)} />
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {selected && <ComfortMessage message={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
