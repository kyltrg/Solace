"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { STORY_CHAPTERS } from "@/app/our-story/data";

export default function StoryPreview(): React.JSX.Element {
  return (
    <section className="relative overflow-hidden px-4 sm:px-6 py-20 sm:py-40">
      <div className="mx-auto max-w-6xl">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs uppercase tracking-[.35em] text-[var(--accent)]"
        >
          Memory
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .6, ease: [.22,1,.36,1] }}
          className="mt-5 font-display text-4xl sm:text-6xl font-light md:text-8xl"
        >
          Our Story
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .5, delay: .1 }}
          className="mt-6 text-[var(--muted)] max-w-xl"
        >
          Every home starts somewhere.
        </motion.p>

        <div className="mt-16 space-y-10">
          {STORY_CHAPTERS.map((chapter, i) => (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: .5, delay: i * 0.1, ease: [.22,1,.36,1] }}
              className="group border-l-2 border-[var(--accent)]/30 pl-6 transition-all duration-300 hover:border-[var(--accent)]"
            >
              <p className="text-[11px] uppercase tracking-[.3em] text-[var(--accent)]/60">
                Chapter {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 font-display text-2xl md:text-3xl tracking-[-0.02em]">
                {chapter.title}
              </h3>
              <p className="mt-2 max-w-lg text-sm text-[var(--muted)]/70">
                {chapter.excerpt}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .5, delay: .3 }}
          className="mt-12"
        >
          <Link
            href="/our-story"
            className="group inline-flex items-center gap-3 rounded-full border border-[var(--accent)]/30 px-7 py-3 text-sm transition-all duration-300 hover:bg-[var(--accent-soft)]"
          >
            <span>Read Our Story</span>
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
