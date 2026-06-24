"use client";

import { usePageReady } from "@/components/ui/DoorLoadingOverlay";
import TransitionLink from "@/components/navigation/TransitionLink";
import { motion } from "framer-motion";

type RoomLayoutProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  backHref?: string;
};

function ArrowLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );
}

export default function RoomLayout({
  eyebrow,
  title,
  description,
  children,
  backHref = "/home#rooms",
}: RoomLayoutProps): React.JSX.Element {
  usePageReady();
  return (
    <main className="relative flex min-h-screen flex-col">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-[var(--accent)]/4 blur-[180px]" />
        <div className="absolute bottom-0 right-0 h-[30rem] w-[30rem] rounded-full bg-white/[0.02] blur-[160px] animate-pulse-glow" />
      </div>

      <section className="relative z-10 shrink-0 px-4 sm:px-6 pt-20 sm:pt-28 pb-16 sm:pb-24">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: .4 }}
          >
            <TransitionLink
              href={backHref}
              className="group inline-flex items-center gap-2 text-xs tracking-[.25em] text-[var(--muted)]/60 uppercase transition-colors hover:text-[var(--accent)]"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border)] transition-all duration-300 group-hover:border-[var(--accent)]/40 group-hover:-translate-x-0.5">
                <ArrowLeftIcon />
              </span>
              <span>Back to Rooms</span>
            </TransitionLink>
          </motion.div>

          <div className="mt-12 sm:mt-14 border-l-2 border-[var(--accent)]/30 pl-5 sm:pl-10">
            {eyebrow && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: .4, delay: .1 }}
                className="text-[11px] uppercase tracking-[.4em] text-[var(--accent)]/70"
              >
                {eyebrow}
              </motion.p>
            )}

            <div className="relative">
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.12, ease: [.22,1,.36,1] }}
                className="absolute -left-3 -top-3 text-[var(--accent)]/20 text-6xl leading-none select-none pointer-events-none"
                aria-hidden
              >
                &ldquo;
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: .5, delay: .15, ease: [.22,1,.36,1] }}
                className="mt-1 font-display text-[clamp(2.5rem,7vw,5rem)] leading-[0.95] tracking-[-0.04em]"
              >
                {title}
              </motion.h1>
            </div>

            {description && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: .4, delay: .25 }}
                className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--muted)]/80 italic"
              >
                {description}
              </motion.p>
            )}
          </div>
        </div>
      </section>

      <section className="relative z-10 flex-1 px-4 sm:px-6 pb-24 sm:pb-36">
        <div className="mx-auto max-w-5xl">{children}</div>
      </section>
    </main>
  );
}
