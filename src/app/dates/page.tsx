import RoomLayout from "@/components/layout/RoomLayout";
import DatesPlanner from "@/components/dates/DatesPlanner";
import DatesTimeline from "@/components/dates/DatesTimeline";
import AddMemoryForm from "@/components/dates/AddMemoryForm";
import { prisma } from "@/lib/prisma";
import type { DateMemory } from "@/types/date-memory";

export default async function DatesPage(): Promise<React.JSX.Element> {
  const [memories, plans] = await Promise.all([
    prisma.dateMemory.findMany({
      orderBy: { memoryDate: "desc" },
      include: { comments: { orderBy: { createdAt: "asc" } } },
    }),
    prisma.datePlan.findMany({ orderBy: { planDate: "asc" } }),
  ]);

  return (
    <RoomLayout
      eyebrow="Dates"
      title="Kitchen"
      description="Every moment worth remembering, every plan worth looking forward to."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        {/* Date planner — first on mobile, right column on desktop */}
        <div className="order-1 lg:order-2">
          <div className="relative flex items-center gap-4 mb-6 lg:mb-6">
            <div className="h-px flex-1 bg-[var(--border)]" />
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              <span className="text-[10px] uppercase tracking-[.25em] text-[var(--muted)]/50">
                Date planner
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            </div>
            <div className="h-px flex-1 bg-[var(--border)]" />
          </div>

          <DatesPlanner plans={plans.map((p) => ({ ...p, planDate: p.planDate.toISOString() }))} />
        </div>

        {/* Memory lane — second on mobile, left column on desktop */}
        <div className="order-2 lg:order-1">
          <div className="relative flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-[var(--border)]" />
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              <span className="text-[10px] uppercase tracking-[.25em] text-[var(--muted)]/50">
                Memory lane
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            </div>
            <div className="h-px flex-1 bg-[var(--border)]" />
          </div>

          <div className="space-y-6">
            <AddMemoryForm />

            {memories.length > 0 ? (
              <DatesTimeline memories={memories as unknown as DateMemory[]} />
            ) : (
              <div className="text-center py-12">
                <p className="font-display text-2xl text-[var(--muted)]/40">No memories yet</p>
                <p className="mt-2 text-sm text-[var(--muted)]/20">Start by adding one above.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </RoomLayout>
  );
}
