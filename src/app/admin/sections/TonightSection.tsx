"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAdminTonightEntries, updateTonightEntry, deleteTonightEntry } from "@/actions/admin/tonight";
import AdminSkeleton from "../shared/AdminSkeleton";
import EditModal from "../shared/EditModal";
import ConfirmDialog from "../shared/ConfirmDialog";
import LoadingOverlay from "@/components/ui/LoadingOverlay";

type Item = { id: string; gratitude: string; challenge: string; prayer: string; createdAt: string };

export default function TonightSection() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [gratitude, setGratitude] = useState("");
  const [challenge, setChallenge] = useState("");
  const [prayer, setPrayer] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    getAdminTonightEntries().then(setItems).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!editId) return;
    setSubmitting(true);
    const fd = new FormData();
    fd.set("gratitude", gratitude);
    fd.set("challenge", challenge);
    fd.set("prayer", prayer);
    await updateTonightEntry(editId, fd);
    setSubmitting(false);
    setEditId(null);
    await load();
    router.refresh();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setSubmitting(true);
    await deleteTonightEntry(deleteId);
    setSubmitting(false);
    setDeleteId(null);
    await load();
    router.refresh();
  };

  const busy = submitting;

  return (
    <div className="space-y-4">
      <h3 className="font-display text-2xl">Bedroom — Tonight Entries</h3>

      <LoadingOverlay phrase={deleteId ? "Removing..." : "Saving..."} visible={busy} />

      {loading ? (
        <AdminSkeleton rows={4} />
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-[var(--muted)]">{new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString()}</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-xs"><span className="text-[var(--accent)]/70">Gratitude:</span> {item.gratitude}</p>
                    <p className="text-xs"><span className="text-[var(--accent)]/70">Challenge:</span> {item.challenge}</p>
                    <p className="text-xs"><span className="text-[var(--accent)]/70">Prayer:</span> {item.prayer}</p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button onClick={() => { setEditId(item.id); setGratitude(item.gratitude); setChallenge(item.challenge); setPrayer(item.prayer); }} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--muted)]">Edit</button>
                  <button onClick={() => setDeleteId(item.id)} className="rounded-lg border border-red-400/30 px-3 py-1.5 text-xs text-red-400/70">Delete</button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-sm text-[var(--muted)]">No tonight entries.</p>}
        </div>
      )}

      <EditModal open={editId !== null} onClose={() => { if (!busy) setEditId(null); }} title="Edit Tonight Entry">
        <div className="space-y-3">
          <div>
            <label className="text-xs text-[var(--muted)]">Gratitude</label>
            <textarea value={gratitude} onChange={(e) => setGratitude(e.target.value)} rows={2} className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2 text-sm outline-none resize-none" />
          </div>
          <div>
            <label className="text-xs text-[var(--muted)]">Challenge</label>
            <textarea value={challenge} onChange={(e) => setChallenge(e.target.value)} rows={2} className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2 text-sm outline-none resize-none" />
          </div>
          <div>
            <label className="text-xs text-[var(--muted)]">Prayer</label>
            <textarea value={prayer} onChange={(e) => setPrayer(e.target.value)} rows={2} className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2 text-sm outline-none resize-none" />
          </div>
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
