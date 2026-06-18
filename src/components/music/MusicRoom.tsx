"use client";

import { useMusic } from "./MusicProvider";
import { motion } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, Heart, Music } from "lucide-react";

export default function MusicRoom(): React.JSX.Element {
  const { currentSong, isPlaying, togglePlay, nextSong, previousSong, songs } = useMusic();

  if (songs.length === 0) {
    return (
      <section className="flex flex-col items-center justify-center rounded-[3rem] border border-[var(--border)] bg-[var(--card-bg)] p-16 text-center backdrop-blur-xl">
        <Music size={48} className="text-[var(--muted)]/40" />
        <h2 className="mt-6 font-display text-3xl text-[var(--muted)]">No songs yet</h2>
        <p className="mt-3 text-sm text-[var(--muted)]/50">Add some songs to get started.</p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-[3rem] border border-[var(--border)] bg-[var(--card-bg)] backdrop-blur-xl">
      <div className="relative">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--accent)]/20 blur-3xl" />

        <div className="relative p-8 md:p-12">
          <p className="text-xs uppercase tracking-[.3em] text-[var(--accent)]">Now Playing</p>

          <motion.div
            key={currentSong?.id ?? "none"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .4 }}
          >
            <h1 className="mt-4 font-display text-4xl leading-tight md:text-6xl">
              {currentSong?.title ?? "Choose a song"}
            </h1>

            <p className="mt-2 text-lg text-[var(--muted)]">{currentSong?.artist ?? "From our playlist"}</p>
          </motion.div>

          {currentSong?.note && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: .2 }}
              className="mt-6 flex items-start gap-3 border-l-2 border-[var(--accent)] pl-4"
            >
              <Heart size={14} className="mt-1 shrink-0 text-[var(--accent)]" />
              <p className="text-sm italic leading-relaxed text-[var(--muted)]/70">{currentSong.note}</p>
            </motion.div>
          )}

          <div className="mt-8 flex items-center gap-4">
            <button onClick={previousSong} className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted)] transition-all duration-200 hover:bg-[var(--glass)] hover:text-[var(--text)]">
              <SkipBack size={18} />
            </button>

            <button
              onClick={togglePlay}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--bg)] transition-all duration-200 hover:scale-105 active:scale-95"
            >
              {isPlaying ? <Pause size={22} /> : <Play size={22} fill="currentColor" />}
            </button>

            <button onClick={nextSong} className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted)] transition-all duration-200 hover:bg-[var(--glass)] hover:text-[var(--text)]">
              <SkipForward size={18} />
            </button>

            {currentSong && (
              <div className="ml-4 flex items-center gap-2 text-xs text-[var(--muted)]/50">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                {songs.findIndex((s) => s.id === currentSong.id) + 1} / {songs.length}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
