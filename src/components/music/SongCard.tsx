"use client";

import { Song, useMusic } from "./MusicProvider";
import { motion } from "framer-motion";
import { Play, Music } from "lucide-react";

export default function SongCard({ song }: { song: Song }): React.JSX.Element {
  const { playSong, currentSong, isPlaying } = useMusic();
  const isActive = currentSong?.id === song.id;

  return (
    <motion.button
      onClick={() => playSong(song)}
      whileHover={{ x: 4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`group relative w-full overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300 ${
        isActive
          ? "border-[var(--accent)] bg-[var(--accent)]/10"
          : "border-[var(--border)] bg-[var(--card-bg)] hover:border-[var(--accent)]/30 hover:bg-[var(--card-hover)]"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
          isActive ? "bg-[var(--accent)] text-[var(--bg)]" : "bg-[var(--glass)] text-[var(--muted)] group-hover:bg-[var(--accent)]/20"
        }`}>
          {isActive && isPlaying ? (
            <span className="flex gap-0.5">
              <span className="h-3 w-0.5 animate-pulse rounded-full bg-current" />
              <span className="h-4 w-0.5 animate-pulse rounded-full bg-current" style={{ animationDelay: ".15s" }} />
              <span className="h-2 w-0.5 animate-pulse rounded-full bg-current" style={{ animationDelay: ".3s" }} />
            </span>
          ) : (
            <Music size={18} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className={`truncate font-display text-xl ${isActive ? "text-[var(--text)]" : "text-[var(--text)]"}`}>
            {song.title}
          </h3>
          <p className="truncate text-sm text-[var(--muted)]/60">{song.artist}</p>
        </div>

        {!isActive && (
          <Play size={16} className="shrink-0 text-[var(--muted)]/30 opacity-0 transition-all duration-300 group-hover:opacity-100" />
        )}
      </div>

      {song.note && (
        <p className="mt-3 border-t border-[var(--border)] pt-3 text-xs italic leading-relaxed text-[var(--muted)]/50">
          {song.note}
        </p>
      )}
    </motion.button>
  );
}
