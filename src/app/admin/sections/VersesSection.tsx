"use client";

import { useState, useEffect } from "react";
import { getVerses, createVerse, updateVerse, deleteVerse } from "@/actions/admin/verses";
import AdminSkeleton from "../shared/AdminSkeleton";
import EditModal from "../shared/EditModal";
import ConfirmDialog from "../shared/ConfirmDialog";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { Plus } from "lucide-react";

type Verse = { id: string; content: string; source: string | null; createdAt: string };

export default function VersesSection() {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [content, setContent] = useState("");
  const [source, setSource] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editSource, setEditSource] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    getVerses().then(setVerses).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setShowAdd(true); setContent(""); setSource("");
  };

  const openEdit = (v: Verse) => {
    setEditId(v.id); setEditContent(v.content); setEditSource(v.source ?? "");
  };

  const handleAdd = async () => {
    setSubmitting(true);
    await createVerse(content, source || undefined);
    setSubmitting(false);
    setShowAdd(false);
    await load();
  };

  const handleEdit = async () => {
    if (!editId) return;
    setSubmitting(true);
    await updateVerse(editId, editContent, editSource || undefined);
    setSubmitting(false);
    setEditId(null);
    await load();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setSubmitting(true);
    await deleteVerse(deleteId);
    setSubmitting(false);
    setDeleteId(null);
    await load();
  };

  const busy = submitting;

  return (
    <div className="space-y-4">
      <h3 className="font-display text-2xl">Verses Collection</h3>

      <LoadingOverlay phrase={deleteId ? "Removing..." : "Saving..."} visible={busy} />

      <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-medium text-[var(--bg)] hover:opacity-90 transition-opacity">
        <Plus size={16} /> Add Verse
      </button>

      {loading ? (
        <AdminSkeleton rows={4} />
      ) : (
        <div className="space-y-2">
          {verses.map((v) => (
            <div key={v.id} className="flex items-start justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm italic leading-relaxed">"{v.content}"</p>
                {v.source && <p className="mt-1 text-xs text-[var(--accent)]">— {v.source}</p>}
                <p className="mt-1 text-xs text-[var(--muted)]">{new Date(v.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(v)} className="rounded-lg border border-[var(--accent)]/30 px-3 py-1.5 text-xs text-[var(--accent)]/70 hover:bg-[var(--accent)]/10">Edit</button>
                <button onClick={() => setDeleteId(v.id)} className="rounded-lg border border-red-400/30 px-3 py-1.5 text-xs text-red-400/70 hover:bg-red-400/10">Delete</button>
              </div>
            </div>
          ))}
          {verses.length === 0 && <p className="text-sm text-[var(--muted)]">No verses in collection.</p>}
        </div>
      )}

      <EditModal open={showAdd} onClose={() => { if (!busy) setShowAdd(false); }} title="Add Verse">
        <div className="space-y-3">
          <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Verse text..." rows={3} className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-3 text-sm outline-none resize-none" />
          <input value={source} onChange={(e) => setSource(e.target.value)} placeholder="Source / reference (optional)" className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2 text-sm outline-none" />
          <div className="flex gap-2 pt-2">
            <button onClick={handleAdd} disabled={busy} className="rounded-full bg-emerald-500/20 px-6 py-2 text-xs text-emerald-400 hover:bg-emerald-500/30 transition-colors disabled:opacity-50">Add</button>
            <button onClick={() => setShowAdd(false)} disabled={busy} className="rounded-full border border-[var(--border)] px-6 py-2 text-xs text-[var(--muted)] hover:bg-[var(--border)]/20 transition-colors disabled:opacity-50">Cancel</button>
          </div>
        </div>
      </EditModal>

      <EditModal open={editId !== null} onClose={() => { if (!busy) setEditId(null); }} title="Edit Verse">
        <div className="space-y-3">
          <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} placeholder="Verse text..." rows={3} className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-3 text-sm outline-none resize-none" />
          <input value={editSource} onChange={(e) => setEditSource(e.target.value)} placeholder="Source / reference (optional)" className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2 text-sm outline-none" />
          <div className="flex gap-2 pt-2">
            <button onClick={handleEdit} disabled={busy} className="rounded-full bg-emerald-500/20 px-6 py-2 text-xs text-emerald-400 hover:bg-emerald-500/30 transition-colors disabled:opacity-50">Save</button>
            <button onClick={() => setEditId(null)} disabled={busy} className="rounded-full border border-[var(--border)] px-6 py-2 text-xs text-[var(--muted)] hover:bg-[var(--border)]/20 transition-colors disabled:opacity-50">Cancel</button>
          </div>
        </div>
      </EditModal>

      <ConfirmDialog open={deleteId !== null} onConfirm={handleDelete} onCancel={() => { if (!busy) setDeleteId(null); }} loading={busy} />
    </div>
  );
}
