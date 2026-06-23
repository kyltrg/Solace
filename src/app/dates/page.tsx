import { Suspense } from "react";
export const dynamic = "force-dynamic";
import RoomLayout from "@/components/layout/RoomLayout";
import DatesPlanner from "@/components/dates/DatesPlanner";
import DatesTimeline from "@/components/dates/DatesTimeline";
import AddMemoryForm from "@/components/dates/AddMemoryForm";
import { prisma } from "@/lib/prisma";
import type { DateMemory } from "@/types/date-memory";

async function PlannerSection() {
  let plans;
  try {
    plans = await prisma.datePlan.findMany({ orderBy: { planDate: "asc" } });
  } catch {
    return (
      <div className="rounded-[2.5rem] border border-[var(--border)] p-6 text-center text-sm text-[var(--muted)]/40">
        Could not load plans right now.
      </div>
    );
  }

  return (
    <DatesPlanner plans={plans.map((p) => ({ ...p, planDate: p.planDate.toISOString() }))} />
  );
}

function PlannerFallback() {
  return (
    <div className="rounded-[2.5rem] border border-[var(--border)] p-6">
      <div className="space-y-4">
        <div className="h-12 w-full animate-pulse rounded-xl bg-[var(--border)]" />
        <div className="h-64 w-full animate-pulse rounded-xl bg-[var(--border)]" />
      </div>
    </div>
  );
}

async function TimelineSection() {
  let memories;
  try {
    memories = await prisma.dateMemory.findMany({
      orderBy: { memoryDate: "desc" },
      include: { comments: { orderBy: { createdAt: "asc" } } },
    });
  } catch {
    return (
      <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center">
        <p className="font-display text-2xl text-[var(--muted)]/50">Could not load memories</p>
        <p className="mt-2 text-sm text-[var(--muted)]/25">Try again in a moment.</p>
      </div>
    );
  }

  if (memories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--accent-soft)] ring-1 ring-[var(--accent)]/10">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--accent)]">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </div>
        <p className="font-display text-2xl text-[var(--muted)]/50">No memories yet</p>
        <p className="mt-2 text-sm text-[var(--muted)]/25 max-w-xs">
          Start by adding a memory above. Every moment is worth keeping.
        </p>
      </div>
    );
  }

  return <DatesTimeline memories={memories as unknown as DateMemory[]} />;
}

function TimelineFallback() {
  return (
    <div className="space-y-6">
      <div className="h-72 w-full animate-pulse rounded-[2.5rem] border border-[var(--border)] bg-[var(--card-bg)]" />
      <div className="h-72 w-full animate-pulse rounded-[2.5rem] border border-[var(--border)] bg-[var(--card-bg)]" />
    </div>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="relative flex items-center gap-4 mb-6 lg:mb-6">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--border)] to-[var(--border)]" />
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_8px_rgba(168,141,114,0.4)]" />
        <span className="text-[10px] font-medium uppercase tracking-[.25em] text-[var(--muted)]/50">
          {label}
        </span>
        <span className="h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_8px_rgba(168,141,114,0.4)]" />
      </div>
      <div className="h-px flex-1 bg-gradient-to-r from-[var(--border)] via-[var(--border)] to-transparent" />
    </div>
  );
}

export default function DatesPage(): React.JSX.Element {
  return (
    <RoomLayout
      eyebrow="Dates"
      title="Kitchen"
      description="Every moment worth remembering, every plan worth looking forward to."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px] lg:gap-10">
        {/* Planner — first on mobile, right column on desktop */}
        <div className="order-1 lg:order-2">
          <SectionHeader label="Date planner" />

          <Suspense fallback={<PlannerFallback />}>
            <PlannerSection />
          </Suspense>
        </div>

        {/* Timeline — second on mobile, left column on desktop */}
        <div className="order-2 lg:order-1">
          <SectionHeader label="Memory lane" />

          <div className="space-y-6">
            <AddMemoryForm />

            <Suspense fallback={<TimelineFallback />}>
              <TimelineSection />
            </Suspense>
          </div>
        </div>
      </div>
    </RoomLayout>
  );
}
