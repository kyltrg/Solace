export default function PageSkeleton() {
  return (
    <main className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-[var(--accent)]/4 blur-[180px]" />
      </div>

      <section className="relative z-10 px-4 sm:px-6 pt-32 pb-20 sm:pb-28">
        <div className="mx-auto max-w-5xl space-y-8">
          {/* Title */}
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 animate-pulse rounded-lg bg-[var(--border)]" />
            <div className="h-6 w-48 animate-pulse rounded-lg bg-[var(--border)]" />
          </div>

          {/* Content blocks */}
          <div className="space-y-6">
            <div className="h-40 w-full animate-pulse rounded-[2.5rem] bg-[var(--border)]" />
            <div className="h-64 w-full animate-pulse rounded-[2.5rem] bg-[var(--border)]" />
            <div className="h-32 w-full animate-pulse rounded-[2.5rem] bg-[var(--border)]" />
          </div>
        </div>
      </section>
    </main>
  );
}
