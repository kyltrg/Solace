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
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/4 h-[50rem] w-[50rem] -translate-x-1/2 rounded-full bg-[var(--accent)]/3 blur-[200px]" />
      </div>
      <ArrivalHero />
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
