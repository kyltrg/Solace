"use client";

import { useState, type ReactNode } from "react";

type Tab = "memory" | "planner";

export default function DatesTabs({
  memoryLane,
  datePlanner,
}: {
  memoryLane: ReactNode;
  datePlanner: ReactNode;
}) {
  const [tab, setTab] = useState<Tab>("memory");

  return (
    <div>
      <div className="flex items-center border-b border-[var(--border)] mb-6">
        <button
          onClick={() => setTab("memory")}
          className={`relative flex-1 pb-3 text-sm font-medium transition-colors ${
            tab === "memory"
              ? "text-[var(--text)]"
              : "text-[var(--muted)]/50 hover:text-[var(--muted)]/80"
          }`}
        >
          Memory Lane
          {tab === "memory" && (
            <span className="absolute bottom-0 left-1/2 h-0.5 w-12 -translate-x-1/2 rounded-full bg-[var(--accent)]" />
          )}
        </button>
        <button
          onClick={() => setTab("planner")}
          className={`relative flex-1 pb-3 text-sm font-medium transition-colors ${
            tab === "planner"
              ? "text-[var(--text)]"
              : "text-[var(--muted)]/50 hover:text-[var(--muted)]/80"
          }`}
        >
          Date Planner
          {tab === "planner" && (
            <span className="absolute bottom-0 left-1/2 h-0.5 w-12 -translate-x-1/2 rounded-full bg-[var(--accent)]" />
          )}
        </button>
      </div>

      {tab === "memory" ? memoryLane : datePlanner}
    </div>
  );
}
