"use client";

import { useState, useMemo } from "react";
import { ArrowLeft, Music, Pencil } from "lucide-react";
import { useMusic, type Playlist } from "./MusicProvider";
import { getPfp } from "@/lib/pfp";
import SongCard from "./SongCard";
import PlaylistEditor from "./PlaylistEditor";

export default function PlaylistView({
  playlist,
  onBack,
}: {
  playlist: Playlist;
  onBack: () => void;
}): React.JSX.Element {
  const { songs } = useMusic();
  const [editorOpen, setEditorOpen] = useState(false);

  const playlistSongs = useMemo(
    () =>
      songs
        .filter((s) => s.playlistId === playlist.id)
        .sort((a, b) => a.order - b.order),
    [songs, playlist.id]
  );

  const author = playlist.author?.toLowerCase() ?? "";
  const pfp = getPfp(author) || getPfp(playlist.name);

  return (
    <div className="space-y-6">
      {/* Back + Edit */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-[var(--muted)]/50 transition-all hover:text-[var(--text)]"
        >
          <ArrowLeft size={16} />
          All Songs
        </button>
        <button
          onClick={() => setEditorOpen(true)}
          className="flex items-center gap-1.5 rounded-full border border-[var(--border)] px-4 py-2 text-xs text-[var(--muted)]/60 transition-all hover:bg-[var(--bg-soft)] hover:text-[var(--text)]"
        >
          <Pencil size={13} />
          Edit Playlist
        </button>
      </div>

      {/* Playlist header */}
      <div className="flex flex-col items-center gap-4 text-center md:flex-row md:gap-6 md:text-left">
        <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-full border-[3px] border-[var(--accent)]/50 shadow-xl shadow-black/30 md:h-48 md:w-48">
          {pfp ? (
            <img src={pfp} alt={playlist.name} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[var(--card-bg)]">
              <Music size={48} className="text-[var(--muted)]/20" />
            </div>
          )}
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--text)] md:text-5xl">
            {playlist.name}
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]/50">
            {playlistSongs.length} song{playlistSongs.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-[var(--border)]" />

      {/* Song grid */}
      {playlistSongs.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <Music size={32} className="text-[var(--muted)]/15" />
          <p className="mt-4 font-serif text-lg text-[var(--text)]/30">No songs yet</p>
          <p className="mt-1 text-xs text-[var(--muted)]/20">Ask admin to add songs to this playlist.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 md:gap-4">
          {playlistSongs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      )}

      {editorOpen && (
        <PlaylistEditor
          playlistId={playlist.id}
          playlistName={playlist.name}
          onClose={() => setEditorOpen(false)}
        />
      )}
    </div>
  );
}
