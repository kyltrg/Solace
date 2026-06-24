"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getComfortMessages, addComfortMessage, deleteComfortMessage } from "@/actions/admin/comfort";
import AdminSkeleton from "../shared/AdminSkeleton";
import EditModal from "../shared/EditModal";
import ConfirmDialog from "../shared/ConfirmDialog";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { Plus } from "lucide-react";

type Msg = { id: string; title: string; content: string; category: string };

export default function ComfortSection() {
  const router = useRouter();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Love");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    getComfortMessages().then(setMessages).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditId("new"); setTitle(""); setContent(""); setCategory("Love");
  };

  const handleSave = async () => {
    if (!editId) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.set("title", title);
      fd.set("content", content);
      fd.set("category", category);
      await addComfortMessage(fd);
    } catch {}
    setSubmitting(false);
    setEditId(null);
    await load();
    router.refresh();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setSubmitting(true);
    try { await deleteComfortMessage(deleteId); } catch {}
    setSubmitting(false);
    setDeleteId(null);
    await load();
    router.refresh();
  };

  const busy = submitting;

  return (
    <div className="space-y-4">
      <h3 className="font-display text-2xl">Living Room — Comfort Messages</h3>

      <LoadingOverlay phrase={deleteId ? "Removing..." : "Saving..."} visible={busy} />

      <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-medium text-[var(--bg)] hover:opacity-90 transition-opacity">
        <Plus size={16} /> Add Message
      </button>

      {loading ? (
        <AdminSkeleton rows={4} />
      ) : (
        <div className="space-y-2">
          {messages.map((m) => (
            <div key={m.id} className="flex items-start justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-[var(--accent)]">{m.category}</p>
                <p className="font-medium text-sm mt-0.5">{m.title}</p>
                <p className="text-xs text-[var(--muted)] mt-1 line-clamp-2">{m.content}</p>
              </div>
              <button onClick={() => setDeleteId(m.id)} className="shrink-0 rounded-lg border border-red-400/30 px-3 py-1.5 text-xs text-red-400/70 hover:bg-red-400/10">Delete</button>
            </div>
          ))}
          {messages.length === 0 && <p className="text-sm text-[var(--muted)]">No comfort messages.</p>}
        </div>
      )}

      <EditModal open={editId !== null} onClose={() => { if (!busy) setEditId(null); }} title="Add Comfort Message">
        <div className="space-y-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2 text-sm outline-none" />
          <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Message content" rows={3} className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2 text-sm outline-none resize-none" />
          <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2 text-sm outline-none" />
          <div className="flex gap-2 pt-2">
            <button onClick={handleSave} disabled={busy} className="rounded-full bg-emerald-500/20 px-6 py-2 text-xs text-emerald-400 hover:bg-emerald-500/30 transition-colors disabled:opacity-50">Add</button>
            <button onClick={() => setEditId(null)} disabled={busy} className="rounded-full border border-[var(--border)] px-6 py-2 text-xs text-[var(--muted)] hover:bg-[var(--border)]/20 transition-colors disabled:opacity-50">Cancel</button>
          </div>
        </div>
      </EditModal>

      <ConfirmDialog open={deleteId !== null} onConfirm={handleDelete} onCancel={() => { if (!busy) setDeleteId(null); }} loading={busy} />
    </div>
  );
}
