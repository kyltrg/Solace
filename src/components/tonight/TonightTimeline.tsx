import TonightCard from "./TonightCard";

type Entry = {
  id: string;
  gratitude: string;
  challenge: string;
  prayer: string;
  createdAt: Date;
};

export default function TonightTimeline({ entries }: { entries: Entry[] }) {
  if (entries.length === 0) {
    return (
      <div className="glass-card flex flex-col items-center rounded-[2.5rem] p-12 text-center">
        <p className="font-display text-2xl text-[var(--muted)]/50">No reflections yet</p>
        <p className="mt-2 text-sm text-[var(--muted)]/30">Tonight is a blank page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {entries.map((entry) => (
        <TonightCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
}
