"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createTonightEntry } from "@/actions/tonight";
import LoadingOverlay from "@/components/ui/LoadingOverlay";

export default function TonightEntryForm(): React.JSX.Element {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);

    try {
      await createTonightEntry(formData);
      formRef.current?.reset();
      router.refresh();
    } catch {}
    setIsPending(false);
  };

  return (
    <>
      <LoadingOverlay phrase="The house will remember this night." visible={isPending} />
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className={`glass-card rounded-[2.5rem] p-8 transition-all duration-500 ${
          isPending ? "scale-[0.97] opacity-40 blur-[1px]" : ""
        }`}
      >
        <h2 className="font-display text-4xl font-light">Write tonight</h2>
        <p className="mt-3 text-sm text-[var(--muted)]">A quiet moment before we rest.</p>

        <div className="mt-10 space-y-5">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[.2em] text-amber-400/70">What are you grateful for?</p>
            <textarea
              required
              name="gratitude"
              disabled={isPending}
              placeholder="Today I'm thankful for..."
              className="h-24 w-full rounded-2xl border border-[var(--border)] bg-transparent p-4 outline-none placeholder:text-[var(--muted)]/30 transition-all focus:border-amber-400/30 resize-none disabled:opacity-50"
            />
          </div>

          <div>
            <p className="mb-2 text-xs uppercase tracking-[.2em] text-blue-400/70">What challenged you today?</p>
            <textarea
              required
              name="challenge"
              disabled={isPending}
              placeholder="Something that was hard..."
              className="h-24 w-full rounded-2xl border border-[var(--border)] bg-transparent p-4 outline-none placeholder:text-[var(--muted)]/30 transition-all focus:border-blue-400/30 resize-none disabled:opacity-50"
            />
          </div>

          <div>
            <p className="mb-2 text-xs uppercase tracking-[.2em] text-purple-400/70">What do you want to pray about?</p>
            <textarea
              required
              name="prayer"
              disabled={isPending}
              placeholder="A prayer, a hope, a quiet thought..."
              className="h-24 w-full rounded-2xl border border-[var(--border)] bg-transparent p-4 outline-none placeholder:text-[var(--muted)]/30 transition-all focus:border-purple-400/30 resize-none disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="rounded-full border border-[var(--accent)] px-7 py-3 text-sm transition-all duration-300 hover:bg-[var(--accent)]/10 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save Reflection"}
          </button>
        </div>
      </form>
    </>
  );
}
