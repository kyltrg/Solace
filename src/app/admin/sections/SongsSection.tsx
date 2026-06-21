"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAdminSongs, createSong, updateSong, deleteSong } from "@/actions/admin/songs";

type Item = { id: string; title: string; artist: string; url: string; note: string | null; createdAt: string };

export default function SongsSection() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [title, setTitle] = useState(""); const [artist, setArtist] = useState(""); const [url, setUrl] = useState(""); const [note, setNote] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  const load = () => getAdminSongs().then(setItems).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg("");
    const fd = new FormData(); fd.set("title", title); fd.set("artist", artist); fd.set("url", url); fd.set("note", note);
    const r = await createSong(fd);
    if (r.ok) { setTitle(""); setArtist(""); setUrl(""); setNote(""); }
    setMsg(r.ok ? "Added!" : r.error || "Failed");
    await load(); router.refresh();
  };

  const handleSave = async (id: string) => {
    const fd = new FormData(); fd.set("title", title); fd.set("artist", artist); fd.set("url", url); fd.set("note", note);
    await updateSong(id, fd);
    setEditId(null); await load(); router.refresh();
  };

  const handleDelete = async (id: string) => { await deleteSong(id); await load(); router.refresh(); };

  return (
    <div className="space-y-4">
      <h3 className="font-display text-2xl">Music Room — Songs</h3>
      {msg && <p className="text-sm text-emerald-400">{msg}</p>}

      <form onSubmit={handleAdd} className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-4 space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)]/50" />
          <input value={artist} onChange={(e) => setArtist(e.target.value)} placeholder="Artist" className="rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)]/50" />
        </div>
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="YouTube URL" className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)]/50" />
        <div className="flex gap-3">
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note (optional)" className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)]/50" />
          <button type="submit" className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--bg)] hover:opacity-90">Add</button>
        </div>
      </form>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
            {editId === item.id ? (
              <div className="space-y-3">
                <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2 text-sm outline-none" />
                <input value={artist} onChange={(e) => setArtist(e.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2 text-sm outline-none" />
                <input value={url} onChange={(e) => setUrl(e.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2 text-sm outline-none" />
                <input value={note} onChange={(e) => setNote(e.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2 text-sm outline-none" />
                <div className="flex gap-2">
                  <button onClick={() => handleSave(item.id)} className="rounded-full bg-emerald-500/20 px-4 py-1.5 text-xs text-emerald-400 hover:bg-emerald-500/30">Save</button>
                  <button onClick={() => setEditId(null)} className="rounded-full border border-[var(--border)] px-4 py-1.5 text-xs text-[var(--muted)]">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-xs text-[var(--accent)]">{item.artist}</p>
                  {item.note && <p className="text-xs text-[var(--muted)] mt-1">{item.note}</p>}
                </div>
                <div className="flex shrink-0 gap-2">
                  <button onClick={() => { setEditId(item.id); setTitle(item.title); setArtist(item.artist); setUrl(item.url); setNote(item.note || ""); }} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--muted)]">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="rounded-lg border border-red-400/30 px-3 py-1.5 text-xs text-red-400/70">Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-[var(--muted)]">No songs.</p>}
      </div>
    </div>
  );
}
