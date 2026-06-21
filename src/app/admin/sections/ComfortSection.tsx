"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getComfortMessages, addComfortMessage, deleteComfortMessage } from "@/actions/admin/comfort";

type Msg = { id: string; title: string; content: string; category: string };

export default function ComfortSection() {
  const router = useRouter();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Love");
  const [msg, setMsg] = useState("");

  const load = () => getComfortMessages().then(setMessages).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    const fd = new FormData();
    fd.set("title", title);
    fd.set("content", content);
    fd.set("category", category);
    const r = await addComfortMessage(fd);
    if (r.ok) {
      setTitle(""); setContent(""); setCategory("Love");
      await load();
      router.refresh();
    }
    setMsg(r.ok ? "Added!" : r.error || "Failed");
  };

  const handleDelete = async (id: string) => {
    await deleteComfortMessage(id);
    await load();
    router.refresh();
  };

  return (
    <div className="space-y-4">
      <h3 className="font-display text-2xl">Living Room — Comfort Messages</h3>
      {msg && <p className="text-sm text-emerald-400">{msg}</p>}

      <form onSubmit={handleAdd} className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-4 space-y-3">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)]/50" />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Message content" rows={3} className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)]/50 resize-none" />
        <div className="flex gap-3">
          <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)]/50" />
          <button type="submit" className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--bg)] hover:opacity-90">Add</button>
        </div>
      </form>

      <div className="space-y-2">
        {messages.map((m) => (
          <div key={m.id} className="flex items-start justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-[var(--accent)]">{m.category}</p>
              <p className="font-medium text-sm mt-0.5">{m.title}</p>
              <p className="text-xs text-[var(--muted)] mt-1 line-clamp-2">{m.content}</p>
            </div>
            <button onClick={() => handleDelete(m.id)} className="shrink-0 rounded-lg border border-red-400/30 px-3 py-1.5 text-xs text-red-400/70 hover:bg-red-400/10">Delete</button>
          </div>
        ))}
        {messages.length === 0 && <p className="text-sm text-[var(--muted)]">No comfort messages.</p>}
      </div>
    </div>
  );
}
