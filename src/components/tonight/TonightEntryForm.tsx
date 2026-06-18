export default function TonightEntryForm(): React.JSX.Element {
  return (
    <form className="glass-card rounded-[2.5rem] p-8">
      <h2 className="font-display text-4xl font-light">Write tonight</h2>
      <p className="mt-3 text-sm text-[var(--muted)]">A quiet moment before we rest.</p>

      <div className="mt-10 space-y-5">
        <div>
          <p className="mb-2 text-xs uppercase tracking-[.2em] text-amber-400/70">What are you grateful for?</p>
          <textarea
            required
            name="gratitude"
            placeholder="Today I'm thankful for..."
            className="h-24 w-full rounded-2xl border border-[var(--border)] bg-transparent p-4 outline-none placeholder:text-[var(--muted)]/30 transition-all focus:border-amber-400/30 resize-none"
          />
        </div>

        <div>
          <p className="mb-2 text-xs uppercase tracking-[.2em] text-blue-400/70">What challenged you today?</p>
          <textarea
            required
            name="challenge"
            placeholder="Something that was hard..."
            className="h-24 w-full rounded-2xl border border-[var(--border)] bg-transparent p-4 outline-none placeholder:text-[var(--muted)]/30 transition-all focus:border-blue-400/30 resize-none"
          />
        </div>

        <div>
          <p className="mb-2 text-xs uppercase tracking-[.2em] text-purple-400/70">What do you want to pray about?</p>
          <textarea
            required
            name="prayer"
            placeholder="A prayer, a hope, a quiet thought..."
            className="h-24 w-full rounded-2xl border border-[var(--border)] bg-transparent p-4 outline-none placeholder:text-[var(--muted)]/30 transition-all focus:border-purple-400/30 resize-none"
          />
        </div>

        <button
          type="submit"
          className="rounded-full border border-[var(--accent)] px-7 py-3 text-sm transition-all duration-300 hover:bg-[var(--accent)]/10 hover:scale-[1.02]"
        >
          Save Reflection
        </button>
      </div>
    </form>
  );
}
