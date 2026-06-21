"use client";

import { motion } from "framer-motion";
import { ImageTrailWrapper } from "./ImageTrailWrapper";

function scrollToStoryPreview() {
  const el = document.getElementById("story-preview");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function StoryOfUsHero(): React.JSX.Element {
  return (
    <section id="story-of-us" className="relative overflow-hidden scroll-mt-[90px]">
      <ImageTrailWrapper>
        <div className="relative flex min-h-screen items-center justify-center px-6">
          <div className="absolute inset-0">
            <div className="absolute left-1/2 top-0 h-[50rem] w-[50rem] -translate-x-1/2 rounded-full bg-[var(--accent)]/6 blur-[160px]" />
            <div className="absolute bottom-0 right-1/4 h-[30rem] w-[30rem] rounded-full bg-[var(--glass)] blur-[140px] animate-drift" />
          </div>

          <div className="relative z-10 text-center max-w-5xl mx-auto">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xs uppercase tracking-[.5em] text-[var(--accent)]"
            >
              Memory
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: .8, ease: [.22,1,.36,1], delay: .1 }}
              className="mt-6 font-display text-[clamp(3.5rem,10vw,8rem)] leading-[0.9] tracking-[-0.04em]"
            >
              The Story
              <br />
              <span className="gradient-text">Of Us</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: .6, delay: .25 }}
              className="mx-auto mt-6 max-w-xl text-[var(--muted)]/80 leading-relaxed"
            >
              Every home has a foundation. Ours was built on laughter, faith,
              and the quiet certainty that we were meant to find each other.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: .5, delay: .4 }}
              className="mt-10"
            >
              <div className="flex items-center justify-center gap-3">
                <div className="h-px w-12 bg-[var(--accent)]/30" />
                <button
                  onClick={scrollToStoryPreview}
                  className="group flex flex-col items-center gap-3 text-sm tracking-wide text-[var(--accent)]/70 transition-colors hover:text-[var(--accent)]"
                >
                  <span className="font-display text-sm tracking-wide uppercase">Step into where it all began</span>
                  <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--accent)]/20 transition-colors group-hover:border-[var(--accent)]/40"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </motion.div>
                </button>
                <div className="h-px w-12 bg-[var(--accent)]/30" />
              </div>
            </motion.div>
          </div>
        </div>
      </ImageTrailWrapper>
    </section>
  );
}
