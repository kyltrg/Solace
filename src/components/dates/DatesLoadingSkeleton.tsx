export default function DatesLoadingSkeleton() {
  return (
    <main className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-[var(--accent)]/4 blur-[180px]" />
      </div>

      <section className="relative px-4 sm:px-6 pt-24 sm:pt-36 pb-20 sm:pb-28">
        <div className="mx-auto max-w-6xl">
          <div className="h-7 w-32 animate-pulse rounded-full bg-[var(--border)]" />

          <div className="mt-16 border-l-2 border-[var(--accent)]/30 pl-6 md:pl-10">
            <div className="h-4 w-20 animate-pulse rounded bg-[var(--border)]" />
            <div className="mt-4 h-20 w-64 animate-pulse rounded-xl bg-[var(--border)]" />
            <div className="mt-4 h-4 w-96 animate-pulse rounded bg-[var(--border)]" />
          </div>
        </div>
      </section>

      <section className="relative px-4 sm:px-6 pb-20 sm:pb-32">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
            <div className="order-1 lg:order-2">
              <div className="h-8 w-full animate-pulse rounded-[2.5rem] bg-[var(--border)]" />
              <div className="mt-4 h-96 w-full animate-pulse rounded-[2.5rem] bg-[var(--border)]" />
            </div>
            <div className="order-2 lg:order-1 space-y-6">
              <div className="h-20 w-full animate-pulse rounded-[2.5rem] bg-[var(--border)]" />
              <div className="h-64 w-full animate-pulse rounded-[2.5rem] bg-[var(--border)]" />
              <div className="h-64 w-full animate-pulse rounded-[2.5rem] bg-[var(--border)]" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
