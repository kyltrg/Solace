"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getRelationshipDuration, getNextMonthsary, getNextAnniversary } from "@/lib/relationship";

export default function RelationshipTimer() {
  const [duration, setDuration] = useState(getRelationshipDuration());
  const [nextM, setNextM] = useState(getNextMonthsary());
  const [nextA, setNextA] = useState(getNextAnniversary());

  useEffect(() => {
    const interval = setInterval(() => {
      setDuration(getRelationshipDuration());
      setNextM(getNextMonthsary());
      setNextA(getNextAnniversary());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const segments = [
    { label: "Years", value: duration.years },
    { label: "Months", value: duration.months },
    { label: "Days", value: duration.days },
    { label: "Hours", value: duration.hours },
    { label: "Minutes", value: duration.minutes },
    { label: "Seconds", value: duration.seconds },
  ];

  return (
    <section className="relative overflow-hidden px-4 sm:px-6 py-20 sm:py-32">
      <div className="mx-auto max-w-6xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs uppercase tracking-[.5em] text-[var(--accent)]"
        >
          Together Since
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: .1 }}
          className="mt-4 font-display text-[clamp(2.5rem,6vw,5rem)] leading-none gradient-text"
        >
          {duration.totalDays.toLocaleString()} Days of Us
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: .2 }}
          className="mt-12 grid grid-cols-3 gap-4 md:flex md:justify-center md:gap-6"
        >
          {segments.map((seg, i) => (
            <div key={seg.label} className="flex flex-col items-center">
              <div className="glass-card flex h-20 w-full items-center justify-center rounded-2xl md:h-24 md:w-24">
                <span className="font-display text-3xl tabular-nums md:text-4xl">
                  {String(seg.value).padStart(2, "0")}
                </span>
              </div>
              <span className="mt-2 text-[10px] uppercase tracking-[.2em] text-[var(--muted)]">
                {seg.label}
              </span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: .4 }}
          className="mt-16 flex flex-col items-center gap-3 md:flex-row md:justify-center md:gap-12"
        >
          <div className="glass-card rounded-2xl px-6 py-4 text-center">
            <p className="text-xs uppercase tracking-[.25em] text-[var(--accent)]">Next Monthsary</p>
            <p className="mt-1 font-display text-xl">
              {nextM.toLocaleDateString("en-US", { month: "long", day: "numeric" })}
            </p>
            <p className="text-xs text-[var(--muted)]">
              {Math.ceil((nextM.getTime() - Date.now()) / 86400000)} days away
            </p>
          </div>

          <div className="glass-card rounded-2xl px-6 py-4 text-center">
            <p className="text-xs uppercase tracking-[.25em] text-[var(--accent)]">First Anniversary</p>
            <p className="mt-1 font-display text-xl">
              {nextA.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
            <p className="text-xs text-[var(--muted)]">
              {Math.ceil((nextA.getTime() - Date.now()) / 86400000)} days away
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
