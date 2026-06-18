"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, MapPin, CalendarDays } from "lucide-react";

type Memory = {
  id: string;
  title: string;
  description: string;
  location: string | null;
  memoryDate: string;
};

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function DatesCalendar({ memories }: { memories: Memory[] }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selected, setSelected] = useState<string | null>(null);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const memoryMap = new Map<string, Memory[]>();
  memories.forEach((m) => {
    const key = new Date(m.memoryDate).toDateString();
    const existing = memoryMap.get(key) || [];
    existing.push(m);
    memoryMap.set(key, existing);
  });

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
    setSelected(null);
  };

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
    setSelected(null);
  };

  const goToday = () => {
    setYear(now.getFullYear());
    setMonth(now.getMonth());
    setSelected(null);
  };

  const selectedMemories = selected ? memoryMap.get(selected) || [] : [];

  const getMemoryCount = (dateKey: string) => memoryMap.get(dateKey)?.length || 0;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
      <div>
        <div className="glass-card overflow-hidden rounded-[2.5rem] border border-[var(--border)] backdrop-blur-xl">
          <div className="border-b border-[var(--border)] bg-[var(--accent-soft)]/30 p-6 md:p-8">
            <div className="flex items-center justify-between">
              <button onClick={prevMonth} className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted)] transition-all hover:bg-[var(--glass)] hover:text-[var(--text)]">
                <ChevronLeft size={18} />
              </button>

              <button onClick={goToday} className="group text-center">
                <p className="font-display text-xl md:text-2xl">{MONTHS[month]}</p>
                <p className="text-xs text-[var(--muted)]/50 group-hover:text-[var(--accent)]">{year}</p>
              </button>

              <button onClick={nextMonth} className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted)] transition-all hover:bg-[var(--glass)] hover:text-[var(--text)]">
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-7 gap-1">
              {DAYS.map((d) => (
                <div key={d} className="py-2 text-center text-[10px] uppercase tracking-[.1em] text-[var(--muted)]/40">{d}</div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 p-4">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const date = new Date(year, month, day);
              const key = date.toDateString();
              const hasMemory = memoryMap.has(key);
              const count = getMemoryCount(key);
              const isToday = date.toDateString() === now.toDateString();
              const isSelected = selected === key;

              return (
                <button
                  key={day}
                  onClick={() => setSelected(key)}
                  className={`relative flex flex-col items-center justify-center rounded-xl text-sm transition-all duration-200 h-14 md:h-16 ${
                    isSelected
                      ? "bg-[var(--accent)] text-[var(--bg)] font-medium shadow-lg"
                      : hasMemory
                        ? "text-[var(--text)] hover:bg-[var(--accent-soft)]"
                        : isToday
                          ? "border border-[var(--accent)]/30 text-[var(--text)]"
                          : "text-[var(--muted)]/50 hover:bg-[var(--glass)]"
                  }`}
                >
                  <span>{day}</span>
                  {hasMemory && (
                    <span className={`mt-0.5 text-[8px] ${isSelected ? "text-[var(--bg)]/70" : "text-[var(--accent)]"}`}>
                      {count} {count === 1 ? "memory" : "memories"}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div>
        <motion.div key={selected || "empty"} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card max-h-[550px] overflow-y-auto rounded-[2.5rem] border border-[var(--border)] p-6 backdrop-blur-xl md:p-8">
          {selected ? (
            selectedMemories.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[var(--border)]">
                  <CalendarDays size={14} className="text-[var(--accent)]" />
                  <p className="text-xs uppercase tracking-[.25em] text-[var(--accent)]">
                    {new Date(selected).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                  </p>
                </div>
                {selectedMemories.map((m) => (
                  <div key={m.id} className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-5 transition-all hover:border-[var(--accent)]/30 hover:bg-[var(--card-hover)]">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)]">
                        <Heart size={14} className="text-[var(--accent)]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-display text-lg font-medium">{m.title}</h4>
                        <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">{m.description}</p>
                        {m.location && (
                          <p className="mt-2 flex items-center gap-1.5 text-xs text-[var(--muted)]/50">
                            <MapPin size={11} />
                            {m.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card-bg)]">
                  <CalendarDays size={22} className="text-[var(--muted)]/30" />
                </div>
                <p className="mt-4 font-display text-xl text-[var(--muted)]/60">This day is empty</p>
                <p className="mt-2 text-sm text-[var(--muted)]/30">A blank page waiting for a story.</p>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card-bg)]">
                <CalendarDays size={22} className="text-[var(--muted)]/30" />
              </div>
              <p className="mt-4 font-display text-xl text-[var(--muted)]/60">Pick a day</p>
              <p className="mt-2 text-sm text-[var(--muted)]/30">Select a date to see your memories.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
