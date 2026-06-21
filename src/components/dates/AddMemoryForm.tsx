"use client";

import { useRef, useState, type FormEvent } from "react";
import { createDateMemory } from "@/actions/dates";
import { useRouter } from "next/navigation";
import LoadingOverlay from "@/components/ui/LoadingOverlay";

export default function AddMemoryForm(): React.JSX.Element {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);

    try {
      await createDateMemory(formData);
      formRef.current?.reset();
      router.refresh();
    } catch {}
    setIsPending(false);
  };

  return (
    <>
      <LoadingOverlay phrase="Putting this where we'll find it again." visible={isPending} />
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className={`rounded-[2.5rem] border border-[var(--border)] bg-[var(--card-bg)] p-8 backdrop-blur-xl transition-all duration-500 ${
          isPending ? "scale-[0.97] opacity-40 blur-[1px]" : ""
        }`}
      >
        <h2 className="font-display text-3xl font-medium">Write a memory</h2>
        <p className="mt-3 text-sm text-[var(--muted)]">A moment we never want to forget.</p>

        <div className="mt-8 space-y-4">
          <input
            required
            name="title"
            disabled={isPending}
            placeholder="Coffee date"
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] p-4 text-sm outline-none placeholder:text-[var(--muted)]/30 transition-all focus:border-[var(--accent)]/50 disabled:opacity-50"
          />

          <textarea
            name="description"
            disabled={isPending}
            placeholder="What happened?"
            className="h-32 w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] p-4 text-sm outline-none placeholder:text-[var(--muted)]/30 transition-all focus:border-[var(--accent)]/50 resize-none disabled:opacity-50"
          />

          <input
            name="location"
            disabled={isPending}
            placeholder="Location (optional)"
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] p-4 text-sm outline-none placeholder:text-[var(--muted)]/30 transition-all focus:border-[var(--accent)]/50 disabled:opacity-50"
          />

          <input
            required
            type="date"
            name="memoryDate"
            disabled={isPending}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] p-4 text-sm outline-none transition-all focus:border-[var(--accent)]/50 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-full bg-[var(--accent)] px-7 py-3.5 text-sm font-medium text-[var(--bg)] transition-all duration-300 hover:opacity-90 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save Memory"}
          </button>
        </div>
      </form>
    </>
  );
}
