"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, CalendarDays, Clock, MapPin, Trash2, Plus } from "lucide-react";
import { deleteDatePlan } from "@/actions/plans-date";

type Plan = {
  id: string;
  title: string;
  description: string;
  location: string | null;
  planDate: string;
  time: string | null;
};

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function DatesPlanner({ plans }: { plans: Plan[] }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selected, setSelected] = useState<string | null>(null);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const planMap = new Map<string, Plan[]>();
  plans.forEach((p) => {
    const key = new Date(p.planDate).toDateString();
    const existing = planMap.get(key) || [];
    existing.push(p);
    planMap.set(key, existing);
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

  const selectedPlans = selected ? planMap.get(selected) || [] : [];

  const isPast = (dateKey: string) => {
    const d = new Date(dateKey);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d < today;
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
      <div>
        <div className="overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[var(--card-bg)] backdrop-blur-xl">
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
              const dayPlans = planMap.get(key);
              const hasPlan = !!dayPlans?.length;
              const today = date.toDateString() === now.toDateString();
              const selectedDay = selected === key;
              const past = isPast(key);

              return (
                <button
                  key={day}
                  onClick={() => setSelected(selectedDay ? null : key)}
                  className={`relative flex flex-col items-center justify-center rounded-xl text-sm transition-all duration-200 h-14 md:h-16 ${
                    selectedDay
                      ? "bg-[var(--accent)] text-[var(--bg)] font-medium shadow-lg"
                      : hasPlan
                        ? "text-[var(--text)] hover:bg-[var(--accent-soft)]"
                        : today
                          ? "border border-[var(--accent)]/30 text-[var(--text)]"
                          : past
                            ? "text-[var(--muted)]/30"
                            : "text-[var(--muted)]/50 hover:bg-[var(--glass)]"
                  }`}
                >
                  <span>{day}</span>
                  {hasPlan && (
                    <span className={`mt-0.5 flex gap-0.5 ${selectedDay ? "text-[var(--bg)]/70" : ""}`}>
                      {dayPlans.slice(0, 3).map((_, i) => (
                        <span key={i} className={`h-1 w-1 rounded-full ${selectedDay ? "bg-[var(--bg)]/60" : "bg-[var(--accent)]"}`} />
                      ))}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div>
        <AnimatePresence mode="wait">
          <motion.div
            key={selected || "empty"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-h-[550px] overflow-y-auto rounded-[2.5rem] border border-[var(--border)] bg-[var(--card-bg)] p-6 backdrop-blur-xl md:p-8"
          >
            {selected ? (
              selectedPlans.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-[var(--border)]">
                    <CalendarDays size={14} className="text-[var(--accent)]" />
                    <p className="text-xs uppercase tracking-[.25em] text-[var(--accent)]">
                      {new Date(selected).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                    </p>
                  </div>
                  {selectedPlans.map((p) => (
                    <div key={p.id} className="group relative rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-5 transition-all hover:border-[var(--accent)]/30 hover:bg-[var(--card-hover)]">
                      <form action={deleteDatePlan.bind(null, p.id)} className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button type="submit" className="flex h-7 w-7 items-center justify-center rounded-full border border-red-400/20 text-red-400/50 hover:bg-red-400/10 hover:text-red-400 transition-all">
                          <Trash2 size={12} />
                        </button>
                      </form>

                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)]">
                          <CalendarDays size={14} className="text-[var(--accent)]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-display text-lg font-medium">{p.title}</h4>
                          {p.description && (
                            <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">{p.description}</p>
                          )}
                          <div className="mt-2.5 flex flex-wrap gap-3">
                            {p.time && (
                              <span className="flex items-center gap-1.5 text-xs text-[var(--muted)]/50">
                                <Clock size={11} />
                                {p.time}
                              </span>
                            )}
                            {p.location && (
                              <span className="flex items-center gap-1.5 text-xs text-[var(--muted)]/50">
                                <MapPin size={11} />
                                {p.location}
                              </span>
                            )}
                            {isPast(p.planDate) && (
                              <span className="text-[10px] uppercase tracking-[.15em] text-[var(--muted)]/30">Done</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center py-12 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-soft)]">
                    <CalendarDays size={22} className="text-[var(--muted)]/30" />
                  </div>
                  <p className="mt-4 font-display text-lg text-[var(--muted)]/60">No plans for this day</p>
                  <p className="mt-2 text-sm text-[var(--muted)]/30">A blank space for something new.</p>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-soft)]">
                  <CalendarDays size={22} className="text-[var(--muted)]/30" />
                </div>
                <p className="mt-4 font-display text-lg text-[var(--muted)]/60">Select a day</p>
                <p className="mt-2 text-sm text-[var(--muted)]/30">Pick a date to see or add plans.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <AddPlanForm selected={selected} />
      </div>
    </div>
  );
}

function AddPlanForm({ selected }: { selected: string | null }) {
  const defaultDate = selected ? new Date(selected).toISOString().split("T")[0] : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 rounded-[2.5rem] border border-[var(--border)] bg-[var(--card-bg)] p-6 backdrop-blur-xl"
    >
      <div className="flex items-center gap-2 mb-5">
        <Plus size={14} className="text-[var(--accent)]" />
        <p className="text-xs uppercase tracking-[.25em] text-[var(--accent)]">Plan a Date</p>
      </div>

      <form action={createDatePlanThunk} className="space-y-3">
        <input
          required
          name="title"
          placeholder="What's the plan?"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-3 text-sm outline-none placeholder:text-[var(--muted)]/20 transition-all focus:border-[var(--accent)]/50"
        />

        <input
          name="description"
          placeholder="Details..."
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-3 text-sm outline-none placeholder:text-[var(--muted)]/20 transition-all focus:border-[var(--accent)]/50"
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            required
            type="date"
            name="planDate"
            defaultValue={defaultDate}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-3 text-sm outline-none transition-all focus:border-[var(--accent)]/50"
          />
          <input
            type="time"
            name="time"
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-3 text-sm outline-none transition-all focus:border-[var(--accent)]/50"
          />
        </div>

        <input
          name="location"
          placeholder="Where?"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-3 text-sm outline-none placeholder:text-[var(--muted)]/20 transition-all focus:border-[var(--accent)]/50"
        />

        <button
          type="submit"
          className="w-full rounded-xl bg-[var(--accent)] px-4 py-3 text-sm font-medium text-[var(--bg)] transition-all duration-300 hover:opacity-90"
        >
          Add to Planner
        </button>
      </form>
    </motion.div>
  );
}

import { createDatePlan } from "@/actions/plans-date";

function createDatePlanThunk(formData: FormData) {
  return createDatePlan(formData);
}
