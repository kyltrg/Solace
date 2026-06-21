"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAdminLetters, updateLetter, deleteLetter } from "@/actions/admin/letters";

type Item = { id: string; title: string; preview: string; content: string; category: string; author: string | null; createdAt: string };

export default function LettersSection() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");

  const load = () => getAdminLetters().then(setItems).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleEdit = async (id: string) => {
    const fd = new FormData();
    fd.set("title", title);
    fd.set("content", content);
    fd.set("category", category);
    await updateLetter(id, fd);
    setEditId(null);
    await load();
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    await deleteLetter(id);
    await load();
    router.refresh();
  };

  return (
    <div className="space-y-4">
      <h3 className="font-display text-2xl">Study Room — Letters</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
            {editId === item.id ? (
              <div className="space-y-3">
                <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2 text-sm outline-none" />
                <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2 text-sm outline-none resize-none" />
                <input value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2 text-sm outline-none" />
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(item.id)} className="rounded-full bg-emerald-500/20 px-4 py-1.5 text-xs text-emerald-400 hover:bg-emerald-500/30">Save</button>
                  <button onClick={() => setEditId(null)} className="rounded-full border border-[var(--border)] px-4 py-1.5 text-xs text-[var(--muted)]">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-[var(--accent)]">{item.category} {item.author && `— ${item.author}`}</p>
                  <p className="font-medium text-sm mt-0.5">{item.title}</p>
                  <p className="text-xs text-[var(--muted)] mt-1 line-clamp-2">{item.preview}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button onClick={() => { setEditId(item.id); setTitle(item.title); setContent(item.content); setCategory(item.category); }} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--muted)] hover:bg-[var(--accent)]/10">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="rounded-lg border border-red-400/30 px-3 py-1.5 text-xs text-red-400/70 hover:bg-red-400/10">Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-[var(--muted)]">No letters.</p>}
      </div>
    </div>
  );
}
