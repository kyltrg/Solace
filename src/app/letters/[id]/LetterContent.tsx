"use client";

import { motion } from "framer-motion";

type Letter = {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string | null;
  createdAt: Date;
};

function WaxSeal() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.6, type: "spring", stiffness: 180, damping: 14 }}
      className="mx-auto -mb-10 relative z-20 flex h-16 w-16 items-center justify-center rounded-full"
      style={{
        background: "radial-gradient(circle at 35% 35%, #c0392b, #922b21)",
        boxShadow: "0 4px 16px rgba(157, 47, 36, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
      }}
    >
      <span className="font-serif text-lg text-[var(--paper-soft)]/90 select-none">S</span>
      <div className="absolute inset-0 rounded-full opacity-20" style={{
        background: "repeating-conic-gradient(rgba(0,0,0,0.1) 0% 25%, transparent 25% 50%)",
      }} />
    </motion.div>
  );
}

export default function LetterContent({ letter }: { letter: Letter }) {
  const paragraphs = letter.content.split("\n").filter(Boolean);

  return (
    <div>
      <div className="flex flex-col items-center text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .6 }}
          className="text-xs uppercase tracking-[.35em] text-[var(--ink)]/50"
        >
          {letter.category}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .6, delay: .1 }}
          className="mt-4 font-serif text-4xl leading-[1.05] tracking-tight text-[var(--ink)] md:text-5xl"
        >
          {letter.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: .6, delay: .2 }}
          className="mt-3 text-sm text-[var(--ink)]/45"
        >
          {new Date(letter.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </motion.p>

        {letter.author && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: .6, delay: .25 }}
            className="mt-1 text-xs uppercase tracking-[.25em] text-[var(--ink)]/40"
          >
            From {letter.author}
          </motion.p>
        )}

        <motion.hr
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: .8, delay: .25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 w-24 origin-center border-none h-px bg-[var(--ink)]/15"
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: .8, delay: .35 }}
        className="mt-8 space-y-6 font-serif text-base leading-[2.2] text-[var(--ink)] md:text-lg"
      >
        {paragraphs.map((paragraph, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .5, delay: .4 + i * .06 }}
          >
            {paragraph}
          </motion.p>
        ))}
      </motion.div>

      <WaxSeal />
    </div>
  );
}
