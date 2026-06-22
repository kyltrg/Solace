"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAdminDreams, updateDream, deleteDream } from "@/actions/admin/dreams";
import AdminSkeleton from "../shared/AdminSkeleton";
import EditModal from "../shared/EditModal";
import ConfirmDialog from "../shared/ConfirmDialog";
import LoadingOverlay from "@/components/ui/LoadingOverlay";

type Item = { id: string; title: string; description: string; horizon: string; status: string; createdAt: string };

const STATUSES = ["PRAYING", "ACHIEVED"];

export default function DreamsSection() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editStatus, setEditStatus] = useState("dreaming");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    getAdminDreams().then(setItems).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!editId) return;
    setSubmitting(true);
    const fd = new FormData();
    fd.set("title", editTitle);
    fd.set("description", editDesc);
    fd.set("status", editStatus);
    await updateDream(editId, fd);
    setSubmitting(false);
    setEditId(null);
    await load();
    router.refresh();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setSubmitting(true);
    await deleteDream(deleteId);
    setSubmitting(false);
    setDeleteId(null);
    await load();
    router.refresh();
  };

  const statusColor = (s: string) => {
    switch (s) {
      case "PRAYING": return "text-purple-400";
      case "ACHIEVED": return "text-emerald-400";
      default: return "text-[var(--muted)]";
    }
  };

  const busy = submitting;

  return (
    <div className="space-y-4">
      <h3 className="font-display text-2xl">Bedroom — Dreams</h3>

      <LoadingOverlay phrase={deleteId ? "Removing..." : "Saving..."} visible={busy} />

      {loading ? (
        <AdminSkeleton rows={4} />
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{item.title}</p>
                    <span className={`text-xs capitalize ${statusColor(item.status)}`}>{item.status}</span>
                  </div>
                  <p className="text-xs text-[var(--accent)]/60 capitalize mt-0.5">{item.horizon}</p>
                  <p className="text-xs text-[var(--muted)] mt-1 line-clamp-2">{item.description}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button onClick={() => { setEditId(item.id); setEditTitle(item.title); setEditDesc(item.description); setEditStatus(item.status); }} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--muted)]">Edit</button>
                  <button onClick={() => setDeleteId(item.id)} className="rounded-lg border border-red-400/30 px-3 py-1.5 text-xs text-red-400/70">Delete</button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-sm text-[var(--muted)]">No dreams.</p>}
        </div>
      )}

      <EditModal open={editId !== null} onClose={() => { if (!busy) setEditId(null); }} title="Edit Dream">
        <div className="space-y-3">
          <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2 text-sm outline-none" placeholder="Title" />
          <textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} rows={3} className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2 text-sm outline-none resize-none" placeholder="Description" />
          <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2 text-sm outline-none">
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="flex gap-2 pt-2">
            <button onClick={handleSave} disabled={busy} className="rounded-full bg-emerald-500/20 px-6 py-2 text-xs text-emerald-400 hover:bg-emerald-500/30 transition-colors disabled:opacity-50">Save</button>
            <button onClick={() => setEditId(null)} disabled={busy} className="rounded-full border border-[var(--border)] px-6 py-2 text-xs text-[var(--muted)] hover:bg-[var(--border)]/20 transition-colors disabled:opacity-50">Cancel</button>
          </div>
        </div>
      </EditModal>

      <ConfirmDialog open={deleteId !== null} onConfirm={handleDelete} onCancel={() => { if (!busy) setDeleteId(null); }} loading={busy} />
    </div>
  );
}
