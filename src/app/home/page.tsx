import { BubbleBackground } from "@/components/animate-ui/components/backgrounds/bubble";
import ArrivalHero from "@/components/home/ArrivalHero";
import RelationshipTimer from "@/components/home/RelationshipTimer";
import StickyNotes from "@/components/home/StickyNotes";
import StoryOfUsHero from "@/components/home/StoryOfUsHero";
import DailyVerse from "@/components/home/DailyVerse";
import MemoryOfDay from "@/components/home/MemoryOfDay";
import StoryPreview from "@/components/home/StoryPreview";
import RoomsGrid from "@/components/home/RoomsGrid";

export default function HomePage(): React.JSX.Element {
  return (
    <main className="relative">
      <BubbleBackground
        interactive
        className="min-h-screen bg-gradient-to-br from-[var(--bg-elevated)] to-[var(--bg)]"
        colors={{
          first: '168,141,114',
          second: '212,165,93',
          third: '91,40,52',
          fourth: '182,139,76',
          fifth: '139,115,85',
          sixth: '245,232,216',
        }}
      >
        <ArrivalHero />
      </BubbleBackground>
      <div className="solace-divider" />
      <RelationshipTimer />
      <div className="solace-divider" />
      <StoryOfUsHero />
      <div className="solace-divider" />
      <StoryPreview />
      <div className="solace-divider" />
      <MemoryOfDay />
      <div className="solace-divider" />
      <StickyNotes />
      <div className="solace-divider" />
      <DailyVerse />
      <div className="solace-divider" />
      <RoomsGrid />
    </main>
  );
}
