"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, GripVertical, Music, ImageOff } from "lucide-react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMusic, type Song } from "./MusicProvider";
import { reorderPlaylist, removeSongFromPlaylist } from "@/actions/songs";

function SortableRow({
  song,
  onRemove,
  isDragging,
}: {
  song: Song;
  onRemove: (id: string) => void;
  isDragging: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: song.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-all ${
        isDragging
          ? "border-[var(--accent)]/50 bg-[var(--accent)]/10 shadow-lg shadow-black/20 z-10"
          : "border-[var(--border)] bg-[var(--card-bg)] hover:border-[var(--accent)]/20"
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="flex h-8 w-8 shrink-0 cursor-grab items-center justify-center rounded-lg text-[var(--muted)]/30 transition-colors hover:text-[var(--muted)]/60 active:cursor-grabbing"
      >
        <GripVertical size={16} />
      </button>

      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-[var(--glass)]">
        {song.thumbnail ? (
          <img src={song.thumbnail} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[var(--muted)]/20">
            <ImageOff size={14} />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[var(--text)]">{song.title}</p>
        <p className="truncate text-xs text-[var(--muted)]/50">{song.artist}</p>
      </div>

      <button
        onClick={() => onRemove(song.id)}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[var(--muted)]/20 transition-colors hover:bg-red-500/10 hover:text-red-400"
      >
        <X size={13} />
      </button>
    </div>
  );
}

export default function PlaylistEditor({
  playlistId,
  playlistName,
  onClose,
}: {
  playlistId: string;
  playlistName: string;
  onClose: () => void;
}): React.JSX.Element {
  const { songs } = useMusic();
  const [items, setItems] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const playlistSongs = useMemo(
    () => songs.filter((s) => s.playlistId === playlistId).sort((a, b) => a.order - b.order),
    [songs, playlistId]
  );

  useEffect(() => {
    setItems(playlistSongs.map((s) => s.id));
  }, [playlistSongs]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);
      if (!over || active.id === over.id) return;
      setItems((prev) => {
        const oldIndex = prev.indexOf(active.id as string);
        const newIndex = prev.indexOf(over.id as string);
        return arrayMove(prev, oldIndex, newIndex);
      });
    },
    []
  );

  const handleRemove = useCallback(
    async (songId: string) => {
      await removeSongFromPlaylist(songId);
      setItems((prev) => prev.filter((id) => id !== songId));
    },
    []
  );

  const handleSave = useCallback(async () => {
    setSaving(true);
    await reorderPlaylist(playlistId, items);
    setSaving(false);
    onClose();
  }, [playlistId, items, onClose]);

  const activeSong = activeId ? playlistSongs.find((s) => s.id === activeId) : null;

  const songMap = useMemo(() => {
    const map = new Map<string, Song>();
    for (const s of playlistSongs) map.set(s.id, s);
    return map;
  }, [playlistSongs]);

  if (typeof document === "undefined") return <></>;

  return createPortal(
    <div className="fixed inset-0 z-[9999999] flex items-center justify-center bg-black/70 backdrop-blur-md" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative mx-4 flex max-h-[85dvh] w-full max-w-lg flex-col rounded-3xl border border-[var(--border)] bg-gradient-to-b from-[var(--bg)] to-[var(--bg-soft)] shadow-2xl shadow-black/40"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <div>
            <h2 className="font-display text-lg font-bold text-[var(--text)]">Edit Playlist</h2>
            <p className="text-xs text-[var(--muted)]/50">{playlistName}</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted)] transition-all hover:bg-[var(--bg-soft)] hover:text-[var(--text)]"
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
          {items.length === 0 ? (
            <p className="py-12 text-center text-sm text-[var(--muted)]/30">No songs in this playlist yet.</p>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={items} strategy={verticalListSortingStrategy}>
                {items.map((id) => {
                  const song = songMap.get(id);
                  if (!song) return null;
                  return (
                    <SortableRow
                      key={id}
                      song={song}
                      onRemove={handleRemove}
                      isDragging={activeId === id}
                    />
                  );
                })}
              </SortableContext>
              <DragOverlay>
                {activeSong && (
                  <div className="flex items-center gap-3 rounded-xl border border-[var(--accent)]/50 bg-[var(--card-bg)] px-3 py-2.5 shadow-2xl shadow-black/40">
                    <GripVertical size={16} className="text-[var(--muted)]/30" />
                    <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-[var(--glass)]">
                      {activeSong.thumbnail ? (
                        <img src={activeSong.thumbnail} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <Music size={14} className="text-[var(--muted)]/20" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[var(--text)]">{activeSong.title}</p>
                      <p className="truncate text-xs text-[var(--muted)]/50">{activeSong.artist}</p>
                    </div>
                  </div>
                )}
              </DragOverlay>
            </DndContext>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-[var(--border)] px-5 py-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm text-[var(--muted)]/60 transition-all hover:bg-[var(--bg-soft)] hover:text-[var(--text)]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-full bg-[var(--accent)] px-6 py-2.5 text-sm font-medium text-[var(--bg)] transition-all hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Order"}
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
