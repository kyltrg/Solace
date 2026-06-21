import { BubbleBackground } from "@/components/animate-ui/components/backgrounds/bubble";
import ArrivalHero from "@/components/home/ArrivalHero";
import RelationshipTimer from "@/components/home/RelationshipTimer";
import StickyNotes from "@/components/home/StickyNotes";
import StoryOfUsHero from "@/components/home/StoryOfUsHero";
import DailyVerse from "@/components/home/DailyVerse";
import MemoryOfDay from "@/components/home/MemoryOfDay";
import StoryPreview from "@/components/home/StoryPreview";
import RoomsGrid from "@/components/home/RoomsGrid";

export default function HomePage() {
  return (
    <main className="relative">
      <BubbleBackground
        className="min-h-[100dvh] bg-gradient-to-br from-[var(--bg-elevated)] to-[var(--bg)]"
        colors={{
          first: '168,141,114',
          second: '212,165,93',
          third: '91,40,52',
          fourth: '245,232,216',
        }}
      >
        <ArrivalHero />
      </BubbleBackground>
      <div className="solace-divider" />
      <section id="relationship-timer" className="scroll-mt-[90px]"><RelationshipTimer /></section>
      <div className="solace-divider" />
      <StoryOfUsHero />
      <div className="solace-divider" />
      <StoryPreview />
      <div className="solace-divider" />
      <section id="memory-of-day" className="scroll-mt-[90px]"><MemoryOfDay /></section>
      <div className="solace-divider" />
      <section id="sticky-notes" className="scroll-mt-[90px]"><StickyNotes /></section>
      <div className="solace-divider" />
      <DailyVerse />
      <div className="solace-divider" />
      <RoomsGrid />
    </main>
  );
}
