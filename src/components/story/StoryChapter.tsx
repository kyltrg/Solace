"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

type StoryChapterProps = {
  number: number;
  title: string;
  date: string;
  content: string;
  images: string[];
};

function Paragraph({ text, index }: { text: string; index: number }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.7,
        delay: 0.3 + index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="leading-relaxed text-[var(--muted)]"
    >
      {text}
    </motion.p>
  );
}

export default function StoryChapter({ number, title, date, content, images }: StoryChapterProps): React.JSX.Element {
  const paragraphs = useMemo(() => content.trim().split("\n\n"), [content]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 60, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-visible rounded-[2.5rem] border border-[var(--border)] bg-[var(--card-bg)] p-8 backdrop-blur-xl md:p-12 md:mx-16"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[var(--accent)]/10 blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute -left-20 -bottom-20 h-60 w-60 rounded-full bg-white/[0.02] blur-3xl"
      />

      <div className="relative mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-4"
        >
          <motion.span
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.1 }}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[var(--accent)]/30 bg-[var(--accent-soft)] font-display text-xl text-[var(--accent)] shadow-[0_0_20px_rgba(168,141,114,0.15)]"
          >
            {String(number).padStart(2, "0")}
          </motion.span>

          <div>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-display text-3xl tracking-[-0.02em] md:text-4xl"
            >
              {title}
            </motion.h3>
            {date && (
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="mt-1 text-xs uppercase tracking-[.25em] text-[var(--muted)]/50"
              >
                {date}
              </motion.p>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 h-px origin-left bg-gradient-to-r from-[var(--accent)]/50 via-[var(--border)] to-transparent"
        />

        <div className="mt-6 space-y-5">
          {paragraphs.map((para, i) => (
            <Paragraph key={i} text={para} index={i} />
          ))}
        </div>

        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory md:hidden"
          >
            {images.slice(0, 6).map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
                whileInView={{ opacity: 1, scale: 1, rotate: -3 + i * 3 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ rotate: 0, scale: 1.08, zIndex: 50 }}
                className="shrink-0"
              >
                <div
                  style={{ width: "9rem" }}
                  className="group relative bg-[var(--paper)] p-2 pb-9 shadow-2xl transition-shadow duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-[var(--bg-soft)]">
                    <img
                      src={src}
                      alt=""
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110 group-hover:brightness-105"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = "none";
                      }}
                    />
                  </div>
                  <div className="absolute bottom-2 left-0 right-0 px-3 text-center">
                    <span className="font-hand text-[10px] italic tracking-wide text-[var(--muted)]/50">
                      {new Date().getFullYear()}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.article>
  );
}
