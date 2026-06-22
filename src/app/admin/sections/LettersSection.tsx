"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAdminLetters, updateLetter, deleteLetter } from "@/actions/admin/letters";
import AdminSkeleton from "../shared/AdminSkeleton";
import EditModal from "../shared/EditModal";
import ConfirmDialog from "../shared/ConfirmDialog";
import LoadingOverlay from "@/components/ui/LoadingOverlay";

type Item = { id: string; title: string; preview: string; content: string; category: string; author: string | null; createdAt: string };

export default function LettersSection() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    getAdminLetters().then(setItems).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!editId) return;
    setSubmitting(true);
    const fd = new FormData();
    fd.set("title", title);
    fd.set("content", content);
    fd.set("category", category);
    await updateLetter(editId, fd);
    setSubmitting(false);
    setEditId(null);
    await load();
    router.refresh();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setSubmitting(true);
    await deleteLetter(deleteId);
    setSubmitting(false);
    setDeleteId(null);
    await load();
    router.refresh();
  };

  const busy = submitting;
  const loadingPhrase = deleteId ? "Removing..." : "Saving...";

  return (
    <div className="space-y-4">
      <h3 className="font-display text-2xl">Study Room — Letters</h3>

      <LoadingOverlay phrase={loadingPhrase} visible={busy} />

      {loading ? (
        <AdminSkeleton rows={4} />
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-[var(--accent)]">{item.category} {item.author && `— ${item.author}`}</p>
                  <p className="font-medium text-sm mt-0.5">{item.title}</p>
                  <p className="text-xs text-[var(--muted)] mt-1 line-clamp-2">{item.preview}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button onClick={() => { setEditId(item.id); setTitle(item.title); setContent(item.content); setCategory(item.category); }} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--muted)] hover:bg-[var(--accent)]/10">Edit</button>
                  <button onClick={() => setDeleteId(item.id)} className="rounded-lg border border-red-400/30 px-3 py-1.5 text-xs text-red-400/70 hover:bg-red-400/10">Delete</button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-sm text-[var(--muted)]">No letters.</p>}
        </div>
      )}

      <EditModal open={editId !== null} onClose={() => { if (!busy) setEditId(null); }} title="Edit Letter">
        <div className="space-y-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2 text-sm outline-none" placeholder="Title" />
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2 text-sm outline-none resize-none" placeholder="Content" />
          <input value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2 text-sm outline-none" placeholder="Category" />
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
