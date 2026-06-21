import { Suspense } from "react";
import RoomLayout from "@/components/layout/RoomLayout";
import Link from "next/link";
import { PenLine } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import LetterArchive from "@/components/letters/LetterArchive";
import { getLetters } from "@/actions/letters";
import ScrollToTop from "@/components/ui/ScrollToTop";

export default async function LettersPage() {
  const initialLetters = await getLetters();

  return (
    <RoomLayout
      eyebrow="Study Room"
      title="Letters"
      description="Words we wrote when we couldn't say it out loud."
    >
      <div className="relative">
        {/* ── Ambient Background Elements ── */}

        {/* Warm lamp glow from top */}
        <div
          className="animate-lamp-glow pointer-events-none fixed left-1/2 top-0 -translate-x-1/2 w-[60rem] h-[40rem] rounded-full"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(232,186,120,0.08) 0%, transparent 60%)",
          }}
        />

        {/* Softer secondary glow */}
        <div
          className="pointer-events-none fixed left-1/3 top-20 w-[30rem] h-[30rem] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle at center, rgba(232,186,120,0.04) 0%, transparent 50%)",
          }}
        />

        {/* Floating book stack — left side */}
        <div className="pointer-events-none fixed left-8 top-1/3 hidden xl:block">
          <div className="animate-book-stack flex flex-col items-center gap-1 opacity-25">
            <div className="h-2 w-14 rounded-sm bg-[var(--text)]/15" />
            <div className="h-2.5 w-16 rounded-sm bg-[var(--text)]/10" />
            <div className="h-2 w-12 rounded-sm bg-[var(--text)]/20" />
            <div className="h-1.5 w-10 rounded-sm bg-[var(--text)]/8" />
          </div>
        </div>

        {/* Floating book stack — right side */}
        <div className="pointer-events-none fixed right-12 top-1/2 hidden xl:block">
          <div className="animate-float-drift flex flex-col items-center gap-1 opacity-20">
            <div className="h-2 w-12 rounded-sm bg-[var(--text)]/12" />
            <div className="h-3 w-14 rounded-sm bg-[var(--text)]/18" />
            <div className="h-2 w-10 rounded-sm bg-[var(--text)]/10" />
          </div>
        </div>

        {/* Subtle warm edge light — left */}
        <div
          className="pointer-events-none fixed left-0 top-0 h-full w-32 opacity-30"
          style={{
            background: "linear-gradient(90deg, rgba(232,186,120,0.04) 0%, transparent 100%)",
          }}
        />

        {/* ── Main Content ── */}

        <div className="mt-16 mb-14 relative z-10">
          <GlassCard className="p-10 md:p-14">
            <div className="flex flex-col items-center text-center md:flex-row md:items-center md:justify-between md:text-left gap-6">
              <div>
                <h2 className="font-serif text-xl text-[var(--text)] md:text-2xl">
                  You want to write a letter?
                </h2>
                <p className="mt-2 text-sm text-[var(--text)]/55 max-w-md">
                  Pour your heart out. Words that only the two of you will understand.
                </p>
              </div>
              <Link
                href="/letters/compose"
                className="inline-flex items-center gap-3 rounded-full border border-[var(--text)]/20 px-8 py-4 text-sm font-medium text-[var(--text)]/80 transition-all duration-300 hover:border-[var(--text)]/40 hover:bg-[var(--text)] hover:text-[var(--bg)] shrink-0"
              >
                <PenLine size={18} />
                <span>Write a letter</span>
              </Link>
            </div>
          </GlassCard>
        </div>

        <div className="relative z-10">
          <GlassCard className="px-6 py-8 md:px-10 md:py-10">
            <div className="mb-8 flex items-center justify-between">
              <span className="text-xs uppercase tracking-[.3em] text-[var(--text)]/40">
                {initialLetters.length} {initialLetters.length === 1 ? "letter" : "letters"} saved
              </span>
            </div>

            <Suspense fallback={<div className="py-16 text-center text-sm text-[var(--text)]/40">Loading letters...</div>}>
              <LetterArchive initialLetters={initialLetters} />
            </Suspense>
          </GlassCard>
        </div>
      </div>

      <ScrollToTop />
    </RoomLayout>
  );
}
