"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { Song, useMusic } from "./MusicProvider";
import { motion, AnimatePresence } from "framer-motion";
import { ImageOff, Play, ListMusic, UserPlus, Users, X, Trash2 } from "lucide-react";
import Cookies from "js-cookie";
import { addSongToPlaylist, removeSongFromPlaylist } from "@/actions/songs";

export default function SongCard({ song }: { song: Song }): React.JSX.Element {
  const { playSong, playNext, currentSong, isPlaying, playlists } = useMusic();
  const isActive = currentSong?.id === song.id;
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLButtonElement>(null);

  const currentUser = (Cookies.get("solace-user") ?? "").trim();
  const myPlaylist = playlists.find((p) => p.author?.toLowerCase() === currentUser.toLowerCase());
  const direkPlaylist = playlists.find((p) => p.author === null);

  const openMenu = useCallback((x: number, y: number) => {
    setMenuPos({ x, y });
    setMenuOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

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

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      openMenu(e.clientX, e.clientY);
    },
    [openMenu]
  );

  const handleTouchStart = useCallback(() => {
    longPressTimer.current = setTimeout(() => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        openMenu(rect.left + rect.width / 2, rect.top + 40);
      }
    }, 500);
  }, [openMenu]);

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handlePlayNext = useCallback(() => {
    playNext(song);
    closeMenu();
  }, [song, playNext, closeMenu]);

  const handleAddToMyPlaylist = useCallback(async () => {
    if (!myPlaylist) return;
    await addSongToPlaylist(song.url, song.note, myPlaylist.id);
    closeMenu();
  }, [song, myPlaylist, closeMenu]);

  const handleAddToDirek = useCallback(async () => {
    if (!direkPlaylist) return;
    await addSongToPlaylist(song.url, song.note, direkPlaylist.id);
    closeMenu();
  }, [song, direkPlaylist, closeMenu]);

  const handleRemove = useCallback(async () => {
    await removeSongFromPlaylist(song.id);
    closeMenu();
  }, [song, closeMenu]);

  const inAPlaylist = song.playlistId !== null;

  return (
    <>
      <motion.button
        ref={cardRef}
        onClick={() => playSong(song)}
        onContextMenu={handleContextMenu}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchEnd}
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className={`group relative w-full overflow-hidden rounded-xl border text-left transition-all duration-500 ${
          isActive
            ? "border-[var(--accent)] bg-[var(--accent)]/8 shadow-lg shadow-[var(--accent)]/10"
            : "border-[var(--border)]/50 bg-[var(--card-bg)] hover:border-[var(--accent)]/30 hover:bg-[var(--card-hover)] hover:shadow-xl hover:shadow-black/20"
        }`}
      >
        {/* Album Art */}
        <div className="relative w-full overflow-hidden bg-[var(--glass)]" style={{ paddingBottom: "100%" }}>
          {song.thumbnail ? (
            <img
              src={song.thumbnail}
              alt={song.title}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
              className="transition-all duration-700 group-hover:scale-110"
            />
          ) : (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ImageOff size={28} className="text-[var(--muted)]/20" />
            </div>
          )}

          {/* Gradient overlay at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {/* Play button on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-500 group-hover:opacity-100">
            <div className="flex h-14 w-14 translate-y-4 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--bg)] shadow-xl shadow-black/30 transition-all duration-500 group-hover:translate-y-0 group-hover:shadow-[var(--accent)]/30">
              <Play size={22} fill="currentColor" className="ml-0.5" />
            </div>
          </div>

          {/* Equalizer — active + playing */}
          {isActive && isPlaying && (
            <div className="absolute bottom-3 left-3 flex items-end gap-[3px] rounded-full bg-black/60 px-2.5 py-1.5 backdrop-blur-md">
              <span className="h-3 w-[3px] animate-pulse rounded-full bg-[var(--accent)]" />
              <span className="h-4.5 w-[3px] animate-pulse rounded-full bg-[var(--accent)]" style={{ animationDelay: ".15s" }} />
              <span className="h-2 w-[3px] animate-pulse rounded-full bg-[var(--accent)]" style={{ animationDelay: ".3s" }} />
            </div>
          )}

          {/* Paused badge */}
          {isActive && !isPlaying && (
            <div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-2.5 py-1.5 text-[10px] font-medium text-[var(--accent)] backdrop-blur-md">
              Paused
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-0.5 px-3 pb-3.5 pt-3">
          <h3 className={`truncate font-display text-sm font-semibold ${
            isActive ? "text-[var(--accent)]" : "text-[var(--text)]"
          }`}>
            {song.title}
          </h3>
          <p className="truncate text-xs text-[var(--muted)]/50">{song.artist}</p>

          {song.note && (
            <p className="mt-2 truncate text-[10px] italic leading-relaxed text-[var(--muted)]/35">
              ♥ {song.note}
            </p>
          )}
        </div>
      </motion.button>

      {menuOpen && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[9999999]" onClick={closeMenu}>
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute w-56 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--navbar-bg)]/95 backdrop-blur-2xl shadow-2xl shadow-black/40"
            style={{
              left: Math.min(menuPos.x, window.innerWidth - 240),
              top: Math.min(menuPos.y, window.innerHeight - 300),
            }}
          >
            <div className="px-3 py-2 border-b border-[var(--border)]/50">
              <p className="truncate text-xs font-medium text-[var(--text)]">{song.title}</p>
              <p className="truncate text-[10px] text-[var(--muted)]/50">{song.artist}</p>
            </div>
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
              {inAPlaylist && (
                <>
                  <div className="mx-3 my-1 border-t border-[var(--border)]/30" />
                  <button
                    onClick={handleRemove}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-xs text-red-400/80 transition-colors hover:bg-red-500/10"
                  >
                    <Trash2 size={14} />
                    Remove from playlist
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>,
        document.body
      )}
    </>
  );
}
