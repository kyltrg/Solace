import RoomLayout from "@/components/layout/RoomLayout";
import DatesPlanner from "@/components/dates/DatesPlanner";
import DatesTimeline from "@/components/dates/DatesTimeline";
import AddMemoryForm from "@/components/dates/AddMemoryForm";
import { prisma } from "@/lib/prisma";
import type { DateMemory } from "@/types/date-memory";

export default async function DatesPage(): Promise<React.JSX.Element> {
  const [memories, plans] = await Promise.all([
    prisma.dateMemory.findMany({ orderBy: { memoryDate: "desc" } }),
    prisma.datePlan.findMany({ orderBy: { planDate: "asc" } }),
  ]);

  return (
    <RoomLayout
      eyebrow="Dates"
      title="Kitchen"
      description="Every moment worth remembering, every plan worth looking forward to."
    >
      <div className="space-y-24">
        <div>
          <div className="relative flex items-center gap-6 mb-12">
            <div className="h-px flex-1 bg-[var(--border)]" />
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
              <span className="text-xs uppercase tracking-[.25em] text-[var(--muted)]/50">
                Memory lane
              </span>
              <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
            </div>
            <div className="h-px flex-1 bg-[var(--border)]" />
          </div>

          {memories.length > 0 ? (
            <DatesTimeline memories={memories} />
          ) : (
            <div className="text-center py-16">
              <p className="font-display text-2xl text-[var(--muted)]/40">No memories yet</p>
              <p className="mt-3 text-sm text-[var(--muted)]/20">Start by adding one below.</p>
            </div>
          )}

          <div className="mt-16">
            <AddMemoryForm />
          </div>
        </div>

        <div>
          <div className="relative flex items-center gap-6 mb-12">
            <div className="h-px flex-1 bg-[var(--border)]" />
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
              <span className="text-xs uppercase tracking-[.25em] text-[var(--muted)]/50">
                Date planner
              </span>
              <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
            </div>
            <div className="h-px flex-1 bg-[var(--border)]" />
          </div>

          <DatesPlanner plans={plans.map((p) => ({ ...p, planDate: p.planDate.toISOString() }))} />
        </div>
      </div>
    </RoomLayout>
  );
}
