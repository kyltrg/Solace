"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAdminSongs, createSong, updateSong, deleteSong, fetchMetadataForUrl } from "@/actions/admin/songs";
import AdminSkeleton from "../shared/AdminSkeleton";
import EditModal from "../shared/EditModal";
import ConfirmDialog from "../shared/ConfirmDialog";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { Plus, Wand2, ImageOff } from "lucide-react";

type Item = { id: string; title: string; artist: string; url: string; note: string | null; thumbnail: string | null; createdAt: string };

export default function SongsSection() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState(""); const [artist, setArtist] = useState(""); const [url, setUrl] = useState(""); const [note, setNote] = useState(""); const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [fetching, setFetching] = useState(false);

  const load = () => {
    setLoading(true);
    getAdminSongs().then(setItems).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditId("new"); setTitle(""); setArtist(""); setUrl(""); setNote(""); setThumbnailPreview(null);
  };

  const openEdit = (item: Item) => {
    setEditId(item.id); setTitle(item.title); setArtist(item.artist); setUrl(item.url); setNote(item.note || ""); setThumbnailPreview(item.thumbnail);
  };

  const handleFetchMetadata = async () => {
    if (!url.trim()) return;
    setFetching(true);
    try {
      const result = await fetchMetadataForUrl(url.trim());
      if (result.ok && result.title) {
        setTitle(result.title);
        setArtist(result.artist || "");
        setThumbnailPreview(result.thumbnail ?? null);
      }
    } catch {}
    setFetching(false);
  };

  const handleSave = async () => {
    if (!editId) return;
    setSubmitting(true);

    // Auto-fetch metadata from client if no thumbnail yet
    if (!thumbnailPreview && url.trim()) {
      try {
        const result = await fetchMetadataForUrl(url.trim());
        if (result.ok && result.title) {
          if (!title) setTitle(result.title);
          if (!artist) setArtist(result.artist || "");
          if (result.thumbnail) setThumbnailPreview(result.thumbnail);
        }
      } catch {}
    }

    try {
      const fd = new FormData(); fd.set("title", title); fd.set("artist", artist); fd.set("url", url); fd.set("note", note);
      if (thumbnailPreview) fd.set("thumbnail", thumbnailPreview);
      if (editId === "new") {
        await createSong(fd);
      } else {
        await updateSong(editId, fd);
      }
    } catch {}
    setSubmitting(false);
    setEditId(null);
    setThumbnailPreview(null);
    await load(); router.refresh();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setSubmitting(true);
    try { await deleteSong(deleteId); } catch {}
    setSubmitting(false);
    setDeleteId(null);
    await load(); router.refresh();
  };

  const busy = submitting || fetching;

  return (
    <div className="space-y-4">
      <h3 className="font-display text-2xl">Music Room — Songs</h3>

      <LoadingOverlay phrase={deleteId ? "Removing..." : fetching ? "Fetching metadata..." : "Saving..."} visible={busy} />

      <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-medium text-[var(--bg)] hover:opacity-90 transition-opacity">
        <Plus size={16} /> Add Song
      </button>

      {loading ? (
        <AdminSkeleton rows={4} />
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1 flex items-center gap-3">
                  {item.thumbnail ? (
                    <img src={item.thumbnail} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--glass)] text-[var(--muted)]/30">
                      <ImageOff size={14} />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{item.title}</p>
                    <p className="text-xs text-[var(--accent)] truncate">{item.artist}</p>
                    {item.note && <p className="text-xs text-[var(--muted)] mt-1 truncate">{item.note}</p>}
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button onClick={() => openEdit(item)} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--muted)]">Edit</button>
                  <button onClick={() => setDeleteId(item.id)} className="rounded-lg border border-red-400/30 px-3 py-1.5 text-xs text-red-400/70">Delete</button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-sm text-[var(--muted)]">No songs.</p>}
        </div>
      )}

      <EditModal open={editId !== null} onClose={() => { if (!busy) { setEditId(null); setThumbnailPreview(null); } }} title={editId === "new" ? "Add Song" : "Edit Song"}>
        <div className="space-y-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2 text-sm outline-none" placeholder="Title" />
          <input value={artist} onChange={(e) => setArtist(e.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2 text-sm outline-none" placeholder="Artist" />
          <div className="flex gap-2">
            <input value={url} onChange={(e) => { setUrl(e.target.value); setThumbnailPreview(null); }} onBlur={(e) => { if (e.target.value.trim() && !thumbnailPreview) handleFetchMetadata(); }} className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2 text-sm outline-none" placeholder="Paste YouTube URL here → auto-fills" />
            <button
              onClick={handleFetchMetadata}
              disabled={!url.trim() || fetching}
              className="shrink-0 rounded-xl border border-[var(--border)] px-3 py-2 text-xs text-[var(--muted)] hover:bg-[var(--glass)] transition-colors disabled:opacity-40 inline-flex items-center gap-1.5"
            >
              <Wand2 size={14} />
              Fetch
            </button>
          </div>
          {thumbnailPreview && (
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[var(--glass)]">
              <img src={thumbnailPreview} alt="Thumbnail preview" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          <input value={note} onChange={(e) => setNote(e.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2 text-sm outline-none" placeholder="Note (optional)" />
          <div className="flex gap-2 pt-2">
            <button onClick={handleSave} disabled={busy} className="rounded-full bg-emerald-500/20 px-6 py-2 text-xs text-emerald-400 hover:bg-emerald-500/30 transition-colors disabled:opacity-50">{editId === "new" ? "Add" : "Save"}</button>
            <button onClick={() => { setEditId(null); setThumbnailPreview(null); }} disabled={busy} className="rounded-full border border-[var(--border)] px-6 py-2 text-xs text-[var(--muted)] hover:bg-[var(--border)]/20 transition-colors disabled:opacity-50">Cancel</button>
          </div>
        </div>
      </EditModal>

      <ConfirmDialog open={deleteId !== null} onConfirm={handleDelete} onCancel={() => { if (!busy) setDeleteId(null); }} loading={busy} />
    </div>
  );
}
