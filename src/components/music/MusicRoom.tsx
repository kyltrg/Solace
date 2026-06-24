"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useMusic } from "./MusicProvider";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, Heart, Music, MoreHorizontal, ListMusic, UserPlus, Users } from "lucide-react";
import { useProgress, formatTime } from "./useProgress";
import Cookies from "js-cookie";
import { addSongToPlaylist } from "@/actions/songs";

export default function MusicRoom(): React.JSX.Element | null {
  const { currentSong, isPlaying, togglePlay, nextSong, previousSong, songs, playNext, playlists } = useMusic();
  const barRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { current, duration } = useProgress(barRef);
  const pct = duration > 0 ? (current / duration) * 100 : 0;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const currentUser = (Cookies.get("solace-user") ?? "").trim();
  const myPlaylist = playlists.find((p) => p.author?.toLowerCase() === currentUser.toLowerCase());
  const direkPlaylist = playlists.find((p) => p.author === null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [menuOpen, closeMenu]);

  const handlePlayNext = useCallback(() => {
    if (currentSong) playNext(currentSong);
    closeMenu();
  }, [currentSong, playNext, closeMenu]);

  const handleAddToMyPlaylist = useCallback(async () => {
    if (!currentSong || !myPlaylist) return;
    await addSongToPlaylist(currentSong.url, currentSong.note, myPlaylist.id);
    closeMenu();
  }, [currentSong, myPlaylist, closeMenu]);

  const handleAddToDirek = useCallback(async () => {
    if (!currentSong || !direkPlaylist) return;
    await addSongToPlaylist(currentSong.url, currentSong.note, direkPlaylist.id);
    closeMenu();
  }, [currentSong, direkPlaylist, closeMenu]);

  useEffect(() => {
    if (currentSong && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentSong]);

  if (!currentSong) return null;

  const currentIndex = songs.findIndex((s) => s.id === currentSong.id);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-gradient-to-br from-[var(--card-bg)] via-[var(--card-bg)] to-[var(--accent)]/5 backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[var(--accent)]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-[var(--accent)]/8 blur-3xl" />

      <div className="relative flex flex-col items-center gap-6 p-6 text-center md:flex-row md:text-left md:items-center md:gap-10 md:p-10 lg:p-14">
        {/* Album Art */}
        <motion.div
          key={currentSong?.id ?? "none"}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="shrink-0"
        >
          <div className="relative h-48 w-48 overflow-hidden rounded-2xl bg-[var(--glass)] shadow-2xl shadow-black/30 md:h-64 md:w-64">
            {currentSong?.thumbnail ? (
              <img
                src={currentSong.thumbnail}
                alt={currentSong.title}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Music size={40} className="text-[var(--muted)]/20" />
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        </motion.div>

        {/* Info + Controls */}
        <div className="flex flex-1 flex-col gap-3 md:gap-2">
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-[10px] font-medium uppercase tracking-[.35em] text-[var(--accent)]"
          >
            Now Playing
          </motion.p>

          <motion.div
            key={currentSong?.id ?? "none"}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <h1 className="font-display text-2xl font-bold leading-tight tracking-tight text-[var(--text)] md:text-4xl">
              {currentSong?.title ?? "Choose a song"}
            </h1>
            <p className="mt-0.5 text-sm font-medium text-[var(--muted)]/70 md:text-base">
              {currentSong?.artist ?? "From our playlist"}
            </p>
          </motion.div>

          {currentSong?.note && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.4 }}
              className="flex items-center justify-center gap-2 md:justify-start"
            >
              <Heart size={10} className="shrink-0 text-[var(--accent)]" />
              <p className="text-xs italic leading-relaxed text-[var(--muted)]/60 max-w-md">{currentSong.note}</p>
            </motion.div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 md:justify-start">
            <button
              onClick={previousSong}
              className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--muted)]/60 transition-all duration-200 hover:bg-white/5 hover:text-[var(--text)] md:h-10 md:w-10"
            >
              <SkipBack size={16} />
            </button>

            <button
              onClick={togglePlay}
              className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--bg)] transition-all duration-200 hover:scale-105 active:scale-95 md:h-14 md:w-14"
            >
              <span className="absolute inset-0 rounded-full bg-[var(--accent)]/30 opacity-75 blur-sm group-hover:animate-ping" />
              {isPlaying ? <Pause size={20} /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
            </button>

            <button
              onClick={nextSong}
              className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--muted)]/60 transition-all duration-200 hover:bg-white/5 hover:text-[var(--text)] md:h-10 md:w-10"
            >
              <SkipForward size={16} />
            </button>

            {currentSong && currentIndex >= 0 && (
              <div className="ml-2 flex items-center gap-2 text-xs text-[var(--muted)]/40">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                {currentIndex + 1} / {songs.length}
              </div>
            )}

            {/* Bullet menu */}
            <div className="relative ml-auto md:ml-4">
              <button
                onClick={(e) => { e.stopPropagation(); setMenuOpen((prev) => !prev); }}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--muted)]/40 transition-all hover:bg-white/5 hover:text-[var(--text)]"
              >
                <MoreHorizontal size={16} />
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    ref={menuRef}
                    initial={{ opacity: 0, scale: 0.92, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: -4 }}
                    transition={{ duration: 0.12 }}
                    className="absolute right-0 top-10 z-50 w-56 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--navbar-bg)]/95 backdrop-blur-2xl shadow-2xl shadow-black/40"
                  >
                    <div className="py-1">
                      <button
                        onClick={handlePlayNext}
                        className="flex w-full items-center gap-3 px-3 py-2.5 text-xs text-[var(--text)]/80 transition-colors hover:bg-white/5"
                      >
                        <ListMusic size={14} className="text-[var(--muted)]/40" />
                        Play Next
                      </button>
                      {myPlaylist && (
                        <button
                          onClick={handleAddToMyPlaylist}
                          className="flex w-full items-center gap-3 px-3 py-2.5 text-xs text-[var(--text)]/80 transition-colors hover:bg-white/5"
                        >
                          <UserPlus size={14} className="text-[var(--muted)]/40" />
                          Add to {myPlaylist.name}
                        </button>
                      )}
                      {direkPlaylist && (
                        <button
                          onClick={handleAddToDirek}
                          className="flex w-full items-center gap-3 px-3 py-2.5 text-xs text-[var(--text)]/80 transition-colors hover:bg-white/5"
                        >
                          <Users size={14} className="text-[var(--muted)]/40" />
                          Add to Direk Playlist
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-1 flex items-center gap-3">
            <span className="w-7 text-right text-[10px] tabular-nums text-[var(--muted)]/30">{formatTime(current)}</span>
            <div className="group h-1.5 flex-1 cursor-pointer rounded-full bg-white/5 transition-all duration-150 hover:h-2">
              <div
                ref={barRef}
                className="h-full rounded-full bg-[var(--accent)]"
                style={{ width: `${pct}%`, transition: "width 200ms linear" }}
              />
            </div>
            <span className="w-7 text-[10px] tabular-nums text-[var(--muted)]/30">{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
