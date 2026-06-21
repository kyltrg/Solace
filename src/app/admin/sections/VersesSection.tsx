"use client";

import { useState, useEffect } from "react";
import { getVerses, createVerse, deleteVerse } from "@/actions/admin/verses";

type Verse = { id: string; content: string; source: string | null; createdAt: string };

export default function VersesSection() {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [content, setContent] = useState("");
  const [source, setSource] = useState("");
  const [msg, setMsg] = useState("");

  const load = () => getVerses().then(setVerses).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    const r = await createVerse(content, source || undefined);
    if (r.ok) { setContent(""); setSource(""); }
    setMsg(r.ok ? "Verse added!" : r.error || "Failed");
    await load();
  };

  const handleDelete = async (id: string) => {
    await deleteVerse(id);
    await load();
  };

  return (
    <div className="space-y-4">
      <h3 className="font-display text-2xl">Verses Collection</h3>
      {msg && <p className="text-sm text-emerald-400">{msg}</p>}

      <form onSubmit={handleAdd} className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-4 space-y-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Verse text..."
          rows={3}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]/50 resize-none"
        />
        <div className="flex gap-3">
          <input
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Source / reference (optional)"
            className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)]/50"
          />
          <button type="submit" className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--bg)] hover:opacity-90">
            Add
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {verses.map((v) => (
          <div key={v.id} className="flex items-start justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
            <div className="min-w-0 flex-1">
              <p className="text-sm italic leading-relaxed">"{v.content}"</p>
              {v.source && <p className="mt-1 text-xs text-[var(--accent)]">— {v.source}</p>}
              <p className="mt-1 text-xs text-[var(--muted)]">{new Date(v.createdAt).toLocaleDateString()}</p>
            </div>
            <button onClick={() => handleDelete(v.id)} className="shrink-0 rounded-lg border border-red-400/30 px-3 py-1.5 text-xs text-red-400/70 hover:bg-red-400/10">Delete</button>
          </div>
        ))}
        {verses.length === 0 && <p className="text-sm text-[var(--muted)]">No verses in collection.</p>}
      </div>
    </div>
  );
}
