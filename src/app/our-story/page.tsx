"use client";

import { useState, useCallback } from "react";
import RoomLayout from "@/components/layout/RoomLayout";
import StoryChapter from "@/components/story/StoryChapter";
import { FloatingPolaroids } from "@/components/story/FloatingPolaroids";
import { InfiniteRibbon } from "@/components/ui/infinite-ribbon";
import { motion, AnimatePresence } from "framer-motion";

import {
  STORY_CHAPTERS,
  type StoryChapter as StoryType,
} from "./data";

export default function OurStoryPage(): React.JSX.Element {
  const [revealedUpTo, setRevealedUpTo] = useState(0);

  const revealNext = useCallback(() => {
    setRevealedUpTo((prev) => Math.min(prev + 1, STORY_CHAPTERS.length - 1));
  }, []);

  return (
    <RoomLayout
      eyebrow="Memory"
      title="Our Story"
      description="The story of how strangers became home."
    >
      <div className="relative">
        <FloatingPolaroids />

        <section className="relative z-20 mb-10">
          <InfiniteRibbon repeat={8} duration={20} rotation={0}>
            <span className="mx-5 inline-flex items-center gap-5 font-display text-sm md:text-base tracking-[.2em] uppercase">
              <span className="text-[var(--accent)]/50" aria-hidden>✦</span>
              <span className="text-[var(--accent)]">Direk</span>
              <span className="text-[var(--accent)]/50" aria-hidden>✦</span>
              <span>Mahal</span>
              <span className="text-[var(--accent)]/50" aria-hidden>✦</span>
              <span className="text-[var(--accent)]">Love</span>
              <span className="text-[var(--accent)]/50" aria-hidden>✦</span>
              <span>Baby</span>
              <span className="text-[var(--accent)]/50" aria-hidden>✦</span>
              <span className="text-[var(--accent)]">Allison</span>
              <span className="text-[var(--accent)]/50" aria-hidden>✦</span>
              <span>Angel</span>
              <span className="text-[var(--accent)]/50" aria-hidden>✦</span>
              <span className="text-[var(--accent)]">Kyle</span>
            </span>
          </InfiniteRibbon>
        </section>

        <section className="relative z-20 space-y-24">
          {STORY_CHAPTERS.map((chapter: StoryType, index: number) => (
            <AnimatePresence key={chapter.id}>
              {index <= revealedUpTo && (
                <motion.div
                  initial={{ opacity: 0, y: 80 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1],
                    delay: index === 0 ? 0 : 0.15,
                  }}
                >
                  <StoryChapter
                    number={index + 1}
                    title={chapter.title}
                    date={chapter.date}
                    content={chapter.content}
                    images={chapter.images}
                    hasNext={index < STORY_CHAPTERS.length - 1 && revealedUpTo <= index}
                    onRevealNext={revealNext}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          ))}
        </section>
      </div>
    </RoomLayout>
  );
}
