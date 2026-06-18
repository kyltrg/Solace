import RoomLayout from "@/components/layout/RoomLayout";
import StoryChapter from "@/components/story/StoryChapter";
import { FloatingPolaroids } from "@/components/story/FloatingPolaroids";
import { InfiniteRibbon } from "@/components/ui/infinite-ribbon";

import {
  STORY_CHAPTERS,
  type StoryChapter as StoryType,
} from "./data";

export default function OurStoryPage(): React.JSX.Element {
  return (
    <RoomLayout
      eyebrow="Memory"
      title="Our Story"
      description="The story of how strangers became home."
    >
      <div className="relative">
        <FloatingPolaroids />

        <section className="relative z-20 mb-10 -mx-6 md:-mx-12">
          <InfiniteRibbon repeat={8} duration={20} rotation={-1.5}>
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
          {STORY_CHAPTERS.map(
            (chapter: StoryType, index: number) => (
              <StoryChapter
                key={chapter.id}
                number={index + 1}
                title={chapter.title}
                date={chapter.date}
                content={chapter.content}
                images={chapter.images}
              />
            )
          )}
        </section>
      </div>
    </RoomLayout>
  );
}
