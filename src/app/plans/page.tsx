import RoomLayout from "@/components/layout/RoomLayout";
import AddPlanForm from "@/components/plans/AddPlanForm";
import StarField from "@/components/plans/StarField";
import { prisma } from "@/lib/prisma";

export default async function PlansPage(): Promise<React.JSX.Element> {
  const dreams = await prisma.dream.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <RoomLayout
      eyebrow="Dreams"
      title="Balcony"
      description="Every star in the sky is a dream we're reaching for together."
    >
      <div className="space-y-24">
        <StarField dreams={dreams} />

        <div className="relative flex items-center gap-6">
          <div className="h-px flex-1 bg-[var(--border)]" />
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
            <span className="text-xs uppercase tracking-[.25em] text-[var(--muted)]/50">
              Add another star
            </span>
            <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
          </div>
          <div className="h-px flex-1 bg-[var(--border)]" />
        </div>

        <AddPlanForm />
      </div>
    </RoomLayout>
  );
}
