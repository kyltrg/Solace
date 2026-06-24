"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { X, Search, Music, Loader2 } from "lucide-react";
import { addSongToPlaylist, fetchSongPreview } from "@/actions/songs";
import { useMusic } from "./MusicProvider";
import Cookies from "js-cookie";

export default function AddSongModal({ onClose }: { onClose: () => void }): React.JSX.Element {
  const { playlists, activePlaylistId } = useMusic();
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<{ title: string; artist: string; thumbnail: string | null } | null>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>(() => {
    const currentUser = Cookies.get("solace-user") ?? "";
    const myPlaylist = playlists.find((p) => p.author === currentUser);
    if (myPlaylist) return myPlaylist.id;
    if (activePlaylistId) return activePlaylistId;
    return "";
  });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleFetch = useCallback(async () => {
    if (!url.trim()) {
      setError("Enter a YouTube URL first.");
      setPreview(null);
      return;
    }
    setIsFetching(true);
    setError("");
    setPreview(null);
    const result = await fetchSongPreview(url.trim());
    if (result.ok && result.title && result.artist) {
      setPreview({ title: result.title, artist: result.artist, thumbnail: result.thumbnail ?? null });
    } else {
      setError(result.error ?? "Could not fetch song info.");
    }
    setIsFetching(false);
  }, [url]);

  const handleAdd = useCallback(async () => {
    if (!url.trim() || !selectedPlaylist) {
      setError("Please enter a URL and select a playlist.");
      return;
    }
    setIsAdding(true);
    setError("");
    const result = await addSongToPlaylist(url.trim(), note.trim() || null, selectedPlaylist);
    if (result.ok) {
      onClose();
    } else {
      setError(result.error ?? "Failed to add song.");
    }
    setIsAdding(false);
  }, [url, note, selectedPlaylist, onClose]);

  if (typeof document === "undefined") return <></>;

  return createPortal(
    <div className="fixed inset-0 z-[9999999] flex items-center justify-center bg-black/70 backdrop-blur-md" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative mx-4 w-full max-w-sm rounded-3xl border border-[var(--border)] bg-gradient-to-b from-[var(--bg)] to-[var(--bg-soft)] px-5 py-5 shadow-2xl shadow-black/40"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted)] transition-all hover:bg-[var(--bg-soft)] hover:text-[var(--text)]"
        >
          <X size={14} />
        </button>

        <div className="flex items-center justify-center gap-2 mb-5">
          <Music size={14} className="text-[var(--accent)]" />
          <span className="text-xs font-medium uppercase tracking-[.2em] text-[var(--muted)]/40">Add Song</span>
        </div>

        <div className="space-y-4">
          {/* Playlist selector */}
          <div>
            <label className="mb-1.5 block text-xs text-[var(--muted)]/50">Add to</label>
            <div className="flex gap-2">
              {playlists.map((pl) => (
                <button
                  key={pl.id}
                  onClick={() => setSelectedPlaylist(pl.id)}
                  className={`flex-1 rounded-xl border py-2.5 text-xs font-medium transition-all ${
                    selectedPlaylist === pl.id
                      ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                      : "border-[var(--border)] text-[var(--muted)]/50 hover:border-[var(--accent)]/30"
                  }`}
                >
                  {pl.name}
                </button>
              ))}
            </div>
          </div>

          {/* YouTube URL */}
          <div>
            <label className="mb-1.5 block text-xs text-[var(--muted)]/50">YouTube URL</label>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={url}
                onChange={(e) => { setUrl(e.target.value); setPreview(null); setError(""); }}
                placeholder="https://youtube.com/watch?v=..."
                className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2.5 text-sm outline-none transition-all focus:border-[var(--accent)]/50 placeholder:text-[var(--muted)]/25"
              />
              <button
                onClick={handleFetch}
                disabled={!url.trim() || isFetching}
                className="shrink-0 rounded-xl border border-[var(--border)] px-3 py-2.5 text-xs text-[var(--muted)]/60 transition-all hover:bg-[var(--bg-soft)] disabled:opacity-30"
              >
                {isFetching ? <Loader2 size={14} className="animate-spin" /> : "Fetch"}
              </button>
            </div>
          </div>

          {/* Preview */}
          {preview && (
            <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[var(--glass)]">
                {preview.thumbnail ? (
                  <img src={preview.thumbnail} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Music size={16} className="text-[var(--muted)]/20" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[var(--text)]">{preview.title}</p>
                <p className="truncate text-xs text-[var(--muted)]/50">{preview.artist}</p>
              </div>
            </div>
          )}

          {/* Note */}
          <div>
            <label className="mb-1.5 block text-xs text-[var(--muted)]/50">Note (optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What does this song mean?"
              rows={2}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2.5 text-sm outline-none transition-all focus:border-[var(--accent)]/50 resize-none placeholder:text-[var(--muted)]/25"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}

          <button
            onClick={handleAdd}
            disabled={!url.trim() || !selectedPlaylist || isAdding}
            className="w-full rounded-full bg-[var(--accent)] py-3 text-sm font-medium text-[var(--bg)] transition-all hover:opacity-90 disabled:opacity-40"
          >
            {isAdding ? "Adding..." : "Add to Playlist"}
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
