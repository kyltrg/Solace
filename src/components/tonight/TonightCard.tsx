"use client";

import { motion } from "framer-motion";
import { Heart, Sun, Moon, Sparkles } from "lucide-react";

type Entry = {
  id: string;
  gratitude: string;
  challenge: string;
  prayer: string;
  createdAt: Date;
};

export default function TonightCard({ entry }: { entry: Entry }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: .5, ease: [.22,1,.36,1] }}
      className="glass-card rounded-[2.5rem] p-8"
    >
      <p className="text-xs uppercase tracking-[.3em] text-[var(--accent)]">
        {new Date(entry.createdAt).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
      </p>

      <div className="mt-8 space-y-6">
        <div className="flex gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
            <Sun size={16} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[.2em] text-amber-400/70">Gratitude</p>
            <p className="mt-1 leading-relaxed text-[var(--muted)]">{entry.gratitude}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
            <Moon size={16} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[.2em] text-blue-400/70">Challenge</p>
            <p className="mt-1 leading-relaxed text-[var(--muted)]">{entry.challenge}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-500/10 text-purple-400">
            <Sparkles size={16} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[.2em] text-purple-400/70">Prayer</p>
            <p className="mt-1 leading-relaxed text-[var(--muted)]">{entry.prayer}</p>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
