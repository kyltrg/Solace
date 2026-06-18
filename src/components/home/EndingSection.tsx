"use client";

import { BlurReveal } from "@/components/ui/blur-reveal";

export default function EndingSection() {
  return (
    <section className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-3xl text-center">
        <div className="font-display text-4xl text-[var(--text)] sm:text-6xl md:text-8xl">
          <BlurReveal>
            Tonight
          </BlurReveal>
        </div>

        <div className="mt-8 text-lg text-[var(--muted)]">
          <BlurReveal delay={0.2}>
            The house is quiet now.
          </BlurReveal>
        </div>

        <div className="mt-3 text-[var(--muted)]/60">
          <BlurReveal delay={0.4}>
            Come back tomorrow and leave another memory.
          </BlurReveal>
        </div>
      </div>
    </section>
  );
}
