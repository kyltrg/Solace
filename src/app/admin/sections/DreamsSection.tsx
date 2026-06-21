"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAdminDreams, updateDream, deleteDream } from "@/actions/admin/dreams";

type Item = { id: string; title: string; description: string; horizon: string; status: string; createdAt: string };

const STATUSES = ["PRAYING", "ACHIEVED"];

export default function DreamsSection() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editStatus, setEditStatus] = useState("dreaming");

  const load = () => getAdminDreams().then(setItems).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleSave = async (id: string) => {
    const fd = new FormData();
    fd.set("title", editTitle);
    fd.set("description", editDesc);
    fd.set("status", editStatus);
    await updateDream(id, fd);
    setEditId(null);
    await load();
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    await deleteDream(id);
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

  return (
    <div className="space-y-4">
      <h3 className="font-display text-2xl">Bedroom — Dreams</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
            {editId === item.id ? (
              <div className="space-y-3">
                <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2 text-sm outline-none" />
                <textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} rows={3} className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2 text-sm outline-none resize-none" />
                <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2 text-sm outline-none">
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <div className="flex gap-2">
                  <button onClick={() => handleSave(item.id)} className="rounded-full bg-emerald-500/20 px-4 py-1.5 text-xs text-emerald-400 hover:bg-emerald-500/30">Save</button>
                  <button onClick={() => setEditId(null)} className="rounded-full border border-[var(--border)] px-4 py-1.5 text-xs text-[var(--muted)]">Cancel</button>
                </div>
              </div>
            ) : (
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
                  <button onClick={() => handleDelete(item.id)} className="rounded-lg border border-red-400/30 px-3 py-1.5 text-xs text-red-400/70">Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-[var(--muted)]">No dreams.</p>}
      </div>
    </div>
  );
}
