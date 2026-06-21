"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getDateMemories, getDatePlans, updateDateMemory, deleteDateMemory, deleteDatePlan } from "@/actions/admin/dates";

type Memory = { id: string; title: string; description: string; location: string | null; memoryDate: string };
type Plan = { id: string; title: string; description: string; location: string | null; planDate: string; time: string | null };

export default function DatesSection() {
  const router = useRouter();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const load = async () => {
    const [mem, pl] = await Promise.all([getDateMemories(), getDatePlans()]);
    setMemories(mem);
    setPlans(pl);
  };
  useEffect(() => { load(); }, []);

  const handleSaveMemory = async (id: string) => {
    const fd = new FormData();
    fd.set("title", editTitle);
    fd.set("description", editDesc);
    await updateDateMemory(id, fd);
    setEditId(null);
    await load();
    router.refresh();
  };

  const handleDelete = async (id: string, type: "memory" | "plan") => {
    if (type === "memory") await deleteDateMemory(id);
    else await deleteDatePlan(id);
    await load();
    router.refresh();
  };

  return (
    <div className="space-y-4">
      <h3 className="font-display text-2xl">Memory Lane — Dates & Plans</h3>

      <div className="space-y-2">
        <h4 className="font-display text-lg text-[var(--accent)]/80">Memories</h4>
        {memories.map((m) => (
          <div key={m.id} className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
            {editId === m.id ? (
              <div className="space-y-3">
                <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2 text-sm outline-none" />
                <textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} rows={3} className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2 text-sm outline-none resize-none" />
                <div className="flex gap-2">
                  <button onClick={() => handleSaveMemory(m.id)} className="rounded-full bg-emerald-500/20 px-4 py-1.5 text-xs text-emerald-400 hover:bg-emerald-500/30">Save</button>
                  <button onClick={() => setEditId(null)} className="rounded-full border border-[var(--border)] px-4 py-1.5 text-xs text-[var(--muted)]">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-sm">{m.title}</p>
                  <p className="text-xs text-[var(--muted)] mt-0.5">{new Date(m.memoryDate).toLocaleDateString()} {m.location && `— ${m.location}`}</p>
                  <p className="text-xs text-[var(--muted)] mt-1 line-clamp-2">{m.description}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button onClick={() => { setEditId(m.id); setEditTitle(m.title); setEditDesc(m.description); }} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--muted)]">Edit</button>
                  <button onClick={() => handleDelete(m.id, "memory")} className="rounded-lg border border-red-400/30 px-3 py-1.5 text-xs text-red-400/70">Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}

        <h4 className="font-display text-lg text-[var(--accent)]/80 mt-6">Plans</h4>
        {plans.map((p) => (
          <div key={p.id} className="flex items-start justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
            <div>
              <p className="font-medium text-sm">{p.title}</p>
              <p className="text-xs text-[var(--muted)] mt-0.5">{new Date(p.planDate).toLocaleDateString()} {p.time && `@ ${p.time}`} {p.location && `— ${p.location}`}</p>
              <p className="text-xs text-[var(--muted)] mt-1 line-clamp-2">{p.description}</p>
            </div>
            <button onClick={() => handleDelete(p.id, "plan")} className="shrink-0 rounded-lg border border-red-400/30 px-3 py-1.5 text-xs text-red-400/70">Delete</button>
          </div>
        ))}
        {memories.length === 0 && plans.length === 0 && <p className="text-sm text-[var(--muted)]">No dates or plans.</p>}
      </div>
    </div>
  );
}
