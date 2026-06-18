"use client";

import { Wrapper3D } from "@/components/ui/3d-wrapper";
import { BlurReveal } from "@/components/ui/blur-reveal";
import { StaggerBlurEffect } from "@/components/ui/stagger-blur-effect";

export default function IntroHero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-[var(--accent)]/10 blur-[140px]" />

        <div className="absolute bottom-0 left-1/2 h-[25rem] w-[25rem] -translate-x-1/2 rounded-full bg-[var(--glass)] blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <StaggerBlurEffect
          className="font-display text-[clamp(5rem,12vw,10rem)] text-[var(--text)]"
        >
          SOLACE
        </StaggerBlurEffect>

        <div className="mt-6 max-w-2xl text-lg text-[var(--muted)]">
          <BlurReveal>
            A digital home for everything we never want to lose.
          </BlurReveal>
        </div>

        <div className="mt-16">
          <Wrapper3D>
            <div className="relative h-[380px] w-[260px] rounded-[2rem] border border-[var(--border)] bg-[var(--glass)] backdrop-blur-xl">
              <div className="absolute inset-4 rounded-[1.5rem] border border-[var(--border)] bg-[var(--bg-elevated)]" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-[var(--accent)]">
                    Welcome Home
                  </p>

                  <h2 className="mt-4 font-display text-4xl">
                    Solace
                  </h2>
                </div>
              </div>
            </div>
          </Wrapper3D>
        </div>

        <div className="mt-16 flex flex-col items-center gap-2">
          <div className="animate-bounce text-[var(--accent)]">
            ↓
          </div>

          <p className="text-xs uppercase tracking-[0.4em] text-[var(--accent)]">
            Enter The House
          </p>
        </div>
      </div>
    </section>
  );
}
