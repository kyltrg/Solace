"use client";

import { useState, useRef, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, CalendarDays, Clock, MapPin, Trash2, Plus, X } from "lucide-react";
import { deleteDatePlan, createDatePlan } from "@/actions/plans-date";
import { useRouter } from "next/navigation";
import LoadingOverlay from "@/components/ui/LoadingOverlay";

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
  const [mobileOpen, setMobileOpen] = useState(false);

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
  };

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  const goToday = () => {
    setYear(now.getFullYear());
    setMonth(now.getMonth());
  };

  const selectedPlans = selected ? planMap.get(selected) || [] : [];

  const hasPlans = plans.length > 0;

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="flex w-full items-center justify-between rounded-[2.5rem] border border-[var(--border)] bg-[var(--card-bg)] p-5 backdrop-blur-xl transition-all duration-300 hover:border-[var(--accent)]/30 hover:bg-[var(--card-hover)] lg:hidden text-left"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-soft)]">
            <CalendarDays size={16} className="text-[var(--accent)]" />
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--text)]">
              {mobileOpen ? "Hide Calendar" : "Show Calendar"}
            </p>
            <p className="text-xs text-[var(--muted)]/40">
              {hasPlans
                ? `${plans.length} plan${plans.length > 1 ? "s" : ""} coming up`
                : "Add a date"}
            </p>
          </div>
        </div>
        <ChevronRight
          size={18}
          className={`text-[var(--muted)]/50 transition-transform duration-300 ${
            mobileOpen ? "rotate-90" : ""
          }`}
        />
      </button>

      {/* Calendar — always visible on desktop, collapsible on mobile */}
      <div className={mobileOpen ? "block" : "hidden lg:block"}>
        <div className="overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[var(--card-bg)] backdrop-blur-xl">
          <div className="border-b border-[var(--border)] bg-[var(--accent-soft)]/30 p-6">
            <div className="flex items-center justify-between">
              <button onClick={prevMonth} className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted)] transition-all hover:bg-[var(--glass)] hover:text-[var(--text)]">
                <ChevronLeft size={18} />
              </button>

              <button onClick={goToday} className="group text-center">
                <p className="font-display text-xl">{MONTHS[month]}</p>
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
              const past = date < new Date(now.getFullYear(), now.getMonth(), now.getDate());

              return (
                <button
                  key={day}
                  onClick={() => setSelected(key)}
                  className={`relative flex flex-col items-center justify-center rounded-xl text-sm transition-all duration-200 h-14 ${
                    hasPlan
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
                    <span className="mt-0.5 flex gap-0.5">
                      {dayPlans.slice(0, 3).map((_, i) => (
                        <span key={i} className="h-1 w-1 rounded-full bg-[var(--accent)]" />
                      ))}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <AddPlanModal
        selected={selected}
        selectedPlans={selectedPlans}
        onClose={() => setSelected(null)}
      />
    </>
  );
}

function AddPlanModal({
  selected,
  selectedPlans,
  onClose,
}: {
  selected: string | null;
  selectedPlans: Plan[];
  onClose: () => void;
}) {
  const defaultDate = selected ? toLocalDateString(new Date(selected)) : "";
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createDatePlan(formData);
      formRef.current?.reset();
      router.refresh();
    } catch {}
    setIsPending(false);
  };

  const isPast = (dateKey: string) => {
    const d = new Date(dateKey);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d < today;
  };

  return (
    <AnimatePresence>
      {selected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 backdrop-blur-sm md:items-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-t-3xl border border-[var(--border)] bg-[var(--bg)] p-6 shadow-2xl md:rounded-3xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarDays size={14} className="text-[var(--accent)]" />
                <p className="text-xs uppercase tracking-[.25em] text-[var(--accent)]">
                  {new Date(selected).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted)] transition-all hover:bg-[var(--bg-soft)] hover:text-[var(--text)]"
              >
                <X size={16} />
              </button>
            </div>

            {selectedPlans.length > 0 && (
              <div className="mb-5 max-h-52 space-y-3 overflow-y-auto">
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
            )}

            <div className="flex items-center gap-2 mb-4">
              <Plus size={14} className="text-[var(--accent)]" />
              <p className="text-xs uppercase tracking-[.25em] text-[var(--accent)]">Plan a Date</p>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
              <input
                required
                name="title"
                disabled={isPending}
                placeholder="What's the plan?"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-3 text-sm outline-none placeholder:text-[var(--muted)]/20 transition-all focus:border-[var(--accent)]/50 disabled:opacity-50"
              />
              <input
                name="description"
                disabled={isPending}
                placeholder="Details..."
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-3 text-sm outline-none placeholder:text-[var(--muted)]/20 transition-all focus:border-[var(--accent)]/50 disabled:opacity-50"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  type="date"
                  name="planDate"
                  disabled={isPending}
                  defaultValue={defaultDate}
                  className="rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-3 text-sm outline-none transition-all focus:border-[var(--accent)]/50 disabled:opacity-50"
                />
                <input
                  type="time"
                  name="time"
                  disabled={isPending}
                  className="rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-3 text-sm outline-none transition-all focus:border-[var(--accent)]/50 disabled:opacity-50"
                />
              </div>
              <input
                name="location"
                disabled={isPending}
                placeholder="Where?"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-3 text-sm outline-none placeholder:text-[var(--muted)]/20 transition-all focus:border-[var(--accent)]/50 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-xl bg-[var(--accent)] px-4 py-3 text-sm font-medium text-[var(--bg)] transition-all duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? "Saving..." : "Add to Planner"}
              </button>
            </form>

            <LoadingOverlay phrase="Saving this day for us..." visible={isPending} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function toLocalDateString(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
