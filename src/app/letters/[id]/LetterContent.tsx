"use client";

import { motion } from "framer-motion";

type Letter = {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: Date;
};

export default function LetterContent({ letter }: { letter: Letter }) {
  return (
    <div className="relative z-10">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .6 }}
        className="text-[11px] uppercase tracking-[.35em] text-[var(--sepia)]"
      >
        {letter.category}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .6, delay: .1 }}
        className="mt-3 font-serif text-4xl leading-[.95] tracking-tight text-[var(--ink)] md:text-6xl"
      >
        {letter.title}
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: .6, delay: .2 }}
        className="mt-5 text-sm text-[var(--sepia)]"
      >
        {new Date(letter.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </motion.div>

      <div className="letter-divider mt-6" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: .8, delay: .3 }}
        className="letter-content mt-8 whitespace-pre-line font-serif text-[1.05rem] md:text-[1.15rem]"
      >
        {letter.content.split("\n").map((paragraph, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .5, delay: .4 + i * .08 }}
            className={paragraph.trim() ? "mb-6" : "mb-2"}
          >
            {paragraph || "\u00A0"}
          </motion.p>
        ))}
      </motion.div>
    </div>
  );
}
