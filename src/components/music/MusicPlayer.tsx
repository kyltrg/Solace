"use client";

import { useRef } from "react";
import { Pause, Play, SkipBack, SkipForward, X, ImageOff } from "lucide-react";
import { useMusic } from "./MusicProvider";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useProgress, formatTime } from "./useProgress";

export default function MusicPlayer(): React.JSX.Element {
  const { currentSong, isPlaying, togglePlay, nextSong, previousSong } = useMusic();
  const barRef = useRef<HTMLDivElement | null>(null);
  const { current, duration } = useProgress(barRef);
  const [minimized, setMinimized] = useState(false);
  const pct = duration > 0 ? (current / duration) * 100 : 0;

  if (!currentSong) return <></>;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.92 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed bottom-3 right-3 z-50 md:bottom-6 md:right-6"
      >
        <div
          className={`overflow-hidden rounded-xl border border-white/10 bg-[var(--navbar-bg)]/95 text-[var(--text)] shadow-2xl shadow-black/40 backdrop-blur-2xl transition-all duration-300 md:rounded-2xl ${
            minimized ? "w-auto" : "w-[260px] md:w-[300px]"
          }`}
        >
          {minimized ? (
            <button
              onClick={() => setMinimized(false)}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--accent)] text-[var(--bg)] shadow-lg shadow-black/30 transition-all hover:scale-105 active:scale-95"
            >
              <Play size={13} fill="currentColor" />
            </button>
          ) : (
            <div className="p-3 md:p-4">
              {/* Top row */}
              <div className="flex items-start gap-2 md:gap-3">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-[var(--glass)] shadow-md md:h-12 md:w-12 md:rounded-xl">
                  {currentSong.thumbnail ? (
                    <img
                      src={currentSong.thumbnail}
                      alt=""
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[var(--muted)]/20">
                      <ImageOff size={14} />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-[var(--text)] md:text-sm">{currentSong.title}</p>
                  <p className="mt-0.5 truncate text-[10px] text-[var(--muted)]/50 md:text-xs">{currentSong.artist}</p>
                  {currentSong.note && (
                    <p className="mt-0.5 truncate text-[9px] italic text-[var(--muted)]/30 md:text-[10px]">♥ {currentSong.note}</p>
                  )}
                </div>
                <button
                  onClick={() => setMinimized(true)}
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[var(--muted)]/30 transition-all hover:bg-white/5 hover:text-[var(--text)] md:h-6 md:w-6"
                >
                  <X size={10} />
                </button>
              </div>

              {/* Progress bar + time */}
              <div className="mt-3 flex items-center gap-2">
                <span className="w-7 text-right text-[9px] tabular-nums text-[var(--muted)]/30 md:w-8 md:text-[10px]">
                  {formatTime(current)}
                </span>
                <div className="h-1 flex-1 rounded-full bg-white/5">
                  <div
                    ref={barRef}
                    className="h-full rounded-full bg-[var(--accent)]"
                    style={{ width: `${pct}%`, transition: "width 200ms linear" }}
                  />
                </div>
                <span className="w-7 text-[9px] tabular-nums text-[var(--muted)]/30 md:w-8 md:text-[10px]">
                  {formatTime(duration)}
                </span>
              </div>

              {/* Controls */}
              <div className="mt-2 flex items-center justify-center gap-2 md:mt-3 md:gap-3">
                <button
                  onClick={previousSong}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--muted)]/40 transition-all hover:bg-white/5 hover:text-[var(--text)] md:h-8 md:w-8"
                >
                  <SkipBack size={12} />
                </button>
                <button
                  onClick={togglePlay}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--text)] text-[var(--bg)] shadow-lg transition-all hover:scale-105 active:scale-95 md:h-10 md:w-10"
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
                </button>
                <button
                  onClick={nextSong}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--muted)]/40 transition-all hover:bg-white/5 hover:text-[var(--text)] md:h-8 md:w-8"
                >
                  <SkipForward size={12} />
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
