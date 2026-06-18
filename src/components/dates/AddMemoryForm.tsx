import { createDateMemory } from "@/actions/dates";

export default function AddMemoryForm(): React.JSX.Element {
  return (
    <form
      action={createDateMemory}
      className="rounded-[2.5rem] border border-[var(--border)] bg-[var(--card-bg)] p-8 backdrop-blur-xl"
    >
      <h2 className="font-display text-3xl font-medium">Write a memory</h2>
      <p className="mt-3 text-sm text-[var(--muted)]">A moment we never want to forget.</p>

      <div className="mt-8 space-y-4">
        <input
          required
          name="title"
          placeholder="Coffee date"
          className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] p-4 text-sm outline-none placeholder:text-[var(--muted)]/30 transition-all focus:border-[var(--accent)]/50"
        />

        <textarea
          name="description"
          placeholder="What happened?"
          className="h-32 w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] p-4 text-sm outline-none placeholder:text-[var(--muted)]/30 transition-all focus:border-[var(--accent)]/50 resize-none"
        />

        <input
          name="location"
          placeholder="Location (optional)"
          className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] p-4 text-sm outline-none placeholder:text-[var(--muted)]/30 transition-all focus:border-[var(--accent)]/50"
        />

        <input
          required
          type="date"
          name="memoryDate"
          className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] p-4 text-sm outline-none transition-all focus:border-[var(--accent)]/50"
        />

        <button
          type="submit"
          className="w-full rounded-full bg-[var(--accent)] px-7 py-3.5 text-sm font-medium text-[var(--bg)] transition-all duration-300 hover:opacity-90 hover:scale-[1.01]"
        >
          Save Memory
        </button>
      </div>
    </form>
  );
}
