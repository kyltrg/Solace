"use client";

import { Pause, Play, SkipBack, SkipForward, X } from "lucide-react";
import { useMusic } from "./MusicProvider";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function MusicPlayer(): React.JSX.Element {
  const { currentSong, isPlaying, togglePlay, nextSong, previousSong } = useMusic();
  const [minimized, setMinimized] = useState(false);

  if (!currentSong) return <></>;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: .9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: .9 }}
        className={`fixed z-50 transition-all duration-300 ${
          minimized ? "bottom-5 right-5" : "bottom-5 right-5"
        }`}
      >
        <div className={`rounded-2xl border border-[var(--border)] bg-[var(--navbar-bg)] backdrop-blur-3xl shadow-[0_10px_30px_rgba(0,0,0,.35)] transition-all duration-300 ${
          minimized ? "w-auto p-3" : "w-[260px] p-4"
        }`}>
          {minimized ? (
            <button
              onClick={() => setMinimized(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--bg)]"
            >
              <Play size={14} fill="currentColor" />
            </button>
          ) : (
            <>
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-[var(--text)]">{currentSong.title}</p>
                  <p className="mt-0.5 truncate text-[11px] text-[var(--muted)]/50">{currentSong.artist}</p>
                </div>
                <button
                  onClick={() => setMinimized(true)}
                  className="ml-2 flex h-6 w-6 items-center justify-center rounded-full text-[var(--muted)]/40 hover:bg-[var(--glass)] hover:text-[var(--text)]"
                >
                  <X size={12} />
                </button>
              </div>

              <div className="mt-3 flex items-center justify-center gap-2">
                <button onClick={previousSong} className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--muted)] transition-all hover:bg-[var(--glass)] hover:text-[var(--text)]">
                  <SkipBack size={14} />
                </button>
                <button
                  onClick={togglePlay}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--text)] text-[var(--bg)] transition-all hover:scale-105 active:scale-95"
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
                </button>
                <button onClick={nextSong} className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--muted)] transition-all hover:bg-[var(--glass)] hover:text-[var(--text)]">
                  <SkipForward size={14} />
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
