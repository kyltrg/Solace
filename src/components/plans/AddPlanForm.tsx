"use client";

import { useRef, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createDream } from "@/actions/plans";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

const STAR_PARTICLES = Array.from({ length: 6 }, (_, i) => {
  const angle = (i / 6) * Math.PI * 2;
  const seed = i * 7919 + 13;
  const r = (s: number) => {
    const x = Math.sin(s + 1) * 10000;
    return x - Math.floor(x);
  };
  return {
    angle,
    spread: 80 + r(seed) * 120,
    y: -(300 + r(seed + 1) * 250),
  };
});

export default function AddPlanForm(): React.JSX.Element {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);

    try {
      await createDream(formData);
      formRef.current?.reset();
      router.refresh();
    } catch {
      //
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="relative">
      {/* Flying star particles */}
      <AnimatePresence>
        {isPending && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center overflow-hidden">
            {STAR_PARTICLES.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                animate={{
                  opacity: 0,
                  scale: 0.2,
                  x: Math.cos(p.angle) * p.spread,
                  y: p.y,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1.2,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute"
                style={{ left: "50%", bottom: "30%" }}
              >
                <div
                  className="h-3 w-3 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, #fde68a, #f59e0b)",
                    boxShadow:
                      "0 0 12px #fcd34d, 0 0 30px #f59e0b",
                  }}
                />
              </motion.div>
            ))}
            {/* Central bright star */}
            <motion.div
              initial={{ opacity: 1, scale: 1.2, y: 0 }}
              animate={{
                opacity: 0,
                scale: 0,
                y: -400,
              }}
              transition={{
                duration: 1.4,
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute"
              style={{ left: "50%", bottom: "20%" }}
            >
              <div
                className="h-8 w-8 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, #fff, #fde68a, #f59e0b)",
                  boxShadow:
                    "0 0 30px #fcd34d, 0 0 60px #f59e0b, 0 0 100px #f59e0b40",
                }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className={`relative rounded-[2.5rem] border border-[var(--border)] bg-[var(--card-bg)] p-8 backdrop-blur-xl transition-all duration-500 ${
          isPending
            ? "scale-[0.97] opacity-40 blur-[1px]"
            : ""
        }`}
      >
        <h2 className="font-display text-3xl font-medium">
          Add a star to our sky
        </h2>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Another dream we&apos;ll reach together.
        </p>

        <div className="mt-8 space-y-4">
          <input
            required
            name="title"
            disabled={isPending}
            placeholder="Travel to Japan"
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] p-4 text-sm outline-none placeholder:text-[var(--muted)]/30 transition-all focus:border-[var(--accent)]/50 disabled:opacity-50"
          />

          <textarea
            name="description"
            disabled={isPending}
            placeholder="Describe this dream..."
            className="h-28 w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] p-4 text-sm outline-none placeholder:text-[var(--muted)]/30 transition-all focus:border-[var(--accent)]/50 resize-none disabled:opacity-50"
          />

          <input
            required
            name="horizon"
            disabled={isPending}
            placeholder="When this dream..."
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] p-4 text-sm outline-none placeholder:text-[var(--muted)]/30 transition-all focus:border-[var(--accent)]/50 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-full bg-[var(--accent)] px-7 py-3.5 text-sm font-medium text-[var(--bg)] transition-all duration-300 hover:opacity-90 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <Sparkles size={16} className="animate-pulse" />
                Sending to the sky&hellip;
              </span>
            ) : (
              "Add Dream"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
