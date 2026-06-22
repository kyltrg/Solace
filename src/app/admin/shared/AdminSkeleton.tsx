export default function AdminSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-2">
              <div className="h-3 w-20 rounded bg-[var(--border)]/60" />
              <div className="h-4 w-3/4 rounded bg-[var(--border)]/60" />
              <div className="h-3 w-1/2 rounded bg-[var(--border)]/40" />
            </div>
            <div className="flex gap-2 shrink-0">
              <div className="h-8 w-14 rounded-lg bg-[var(--border)]/60" />
              <div className="h-8 w-14 rounded-lg bg-[var(--border)]/60" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
