"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getDateMemories, getDatePlans, updateDateMemory, deleteDateMemory, deleteDatePlan } from "@/actions/admin/dates";
import AdminSkeleton from "../shared/AdminSkeleton";
import EditModal from "../shared/EditModal";
import ConfirmDialog from "../shared/ConfirmDialog";
import LoadingOverlay from "@/components/ui/LoadingOverlay";

type Memory = { id: string; title: string; description: string; location: string | null; memoryDate: string };
type Plan = { id: string; title: string; description: string; location: string | null; planDate: string; time: string | null };

export default function DatesSection() {
  const router = useRouter();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [deleteInfo, setDeleteInfo] = useState<{ id: string; type: "memory" | "plan" } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    const [mem, pl] = await Promise.all([getDateMemories(), getDatePlans()]);
    setMemories(mem);
    setPlans(pl);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const handleSaveMemory = async () => {
    if (!editId) return;
    setSubmitting(true);
    const fd = new FormData();
    fd.set("title", editTitle);
    fd.set("description", editDesc);
    await updateDateMemory(editId, fd);
    setSubmitting(false);
    setEditId(null);
    await load();
    router.refresh();
  };

  const handleDelete = async () => {
    if (!deleteInfo) return;
    setSubmitting(true);
    if (deleteInfo.type === "memory") await deleteDateMemory(deleteInfo.id);
    else await deleteDatePlan(deleteInfo.id);
    setSubmitting(false);
    setDeleteInfo(null);
    await load();
    router.refresh();
  };

  const busy = submitting;

  return (
    <div className="space-y-4">
      <h3 className="font-display text-2xl">Memory Lane — Dates & Plans</h3>

      <LoadingOverlay phrase={deleteInfo ? "Removing..." : "Saving..."} visible={busy} />

      {loading ? (
        <AdminSkeleton rows={4} />
      ) : (
        <div className="space-y-2">
          <h4 className="font-display text-lg text-[var(--accent)]/80">Memories</h4>
          {memories.map((m) => (
            <div key={m.id} className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-sm">{m.title}</p>
                  <p className="text-xs text-[var(--muted)] mt-0.5">{new Date(m.memoryDate).toLocaleDateString()} {m.location && `— ${m.location}`}</p>
                  <p className="text-xs text-[var(--muted)] mt-1 line-clamp-2">{m.description}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button onClick={() => { setEditId(m.id); setEditTitle(m.title); setEditDesc(m.description); }} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--muted)]">Edit</button>
                  <button onClick={() => setDeleteInfo({ id: m.id, type: "memory" })} className="rounded-lg border border-red-400/30 px-3 py-1.5 text-xs text-red-400/70">Delete</button>
                </div>
              </div>
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
              <button onClick={() => setDeleteInfo({ id: p.id, type: "plan" })} className="shrink-0 rounded-lg border border-red-400/30 px-3 py-1.5 text-xs text-red-400/70">Delete</button>
            </div>
          ))}
          {memories.length === 0 && plans.length === 0 && <p className="text-sm text-[var(--muted)]">No dates or plans.</p>}
        </div>
      )}

      <EditModal open={editId !== null} onClose={() => { if (!busy) setEditId(null); }} title="Edit Memory">
        <div className="space-y-3">
          <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2 text-sm outline-none" placeholder="Title" />
          <textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} rows={3} className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2 text-sm outline-none resize-none" placeholder="Description" />
          <div className="flex gap-2 pt-2">
            <button onClick={handleSaveMemory} disabled={busy} className="rounded-full bg-emerald-500/20 px-6 py-2 text-xs text-emerald-400 hover:bg-emerald-500/30 transition-colors disabled:opacity-50">Save</button>
            <button onClick={() => setEditId(null)} disabled={busy} className="rounded-full border border-[var(--border)] px-6 py-2 text-xs text-[var(--muted)] hover:bg-[var(--border)]/20 transition-colors disabled:opacity-50">Cancel</button>
          </div>
        </div>
      </EditModal>

      <ConfirmDialog open={deleteInfo !== null} onConfirm={handleDelete} onCancel={() => { if (!busy) setDeleteInfo(null); }} loading={busy} />
    </div>
  );
}
