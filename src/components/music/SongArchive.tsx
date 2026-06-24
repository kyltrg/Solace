"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Search, X, Music } from "lucide-react";
import { useMusic } from "./MusicProvider";
import { getPfp } from "@/lib/pfp";
import SongCard from "./SongCard";
import PlaylistView from "./PlaylistView";

export default function SongArchive() {
  const { songs, playlists } = useMusic();
  const [view, setView] = useState<{ type: "main" } | { type: "playlist"; id: string }>({ type: "main" });
  const [search, setSearch] = useState("");
  const [artistFilter, setArtistFilter] = useState("all");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Determine which songs to show in the main "All Songs" view
  const query = search.toLowerCase().trim();

  const filteredSongs = useMemo(() => {
    let result = songs;
    if (artistFilter !== "all") {
      result = result.filter((s) => s.artist === artistFilter);
    }
    if (query) {
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.artist.toLowerCase().includes(query) ||
          (s.note && s.note.toLowerCase().includes(query))
      );
    }
    return result;
  }, [songs, artistFilter, query]);

  const activePlaylist = view.type === "playlist" ? playlists.find((p) => p.id === view.id) ?? null : null;

  const artists = useMemo(() => {
    const set = new Set(songs.map((s) => s.artist));
    return Array.from(set).sort();
  }, [songs]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Playlist detail view
  if (view.type === "playlist" && activePlaylist) {
    return (
      <div className="space-y-5">
        <PlaylistView
          playlist={activePlaylist}
          onBack={() => setView({ type: "main" })}
        />
      </div>
    );
  }

  // Main view — circles + search + all songs
  return (
    <div className="space-y-5">
      {/* Playlist circles */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8">
        {playlists.map((pl) => {
          const pfp = getPfp(pl.author?.toLowerCase() ?? "") || getPfp(pl.name);
          return (
            <button
              key={pl.id}
              onClick={() => setView({ type: "playlist", id: pl.id })}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="relative h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 rounded-full border-[3px] border-[var(--border)] overflow-hidden transition-all hover:border-[var(--accent)]/40 hover:shadow-lg">
                {pfp ? (
                  <img src={pfp} alt={pl.name} className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Music size={32} className="text-[var(--muted)]/40" />
                  </div>
                )}
              </div>
              <span className="text-xs sm:text-sm font-semibold whitespace-nowrap text-[var(--muted)]/50">{pl.name}</span>
              <span className="text-[11px] text-[var(--muted)]/30">{pl.songCount} songs</span>
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <hr className="border-[var(--border)]" />

      {/* Search bar */}
      <div className="sticky top-0 z-20 -mx-4 px-4 py-3 md:relative md:top-auto md:-mx-0 md:px-0 md:py-0">
        <div className="relative w-full">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]/30 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            autoComplete="off"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search song, artist, or note..."
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--card-bg)] py-2.5 pl-10 pr-9 text-sm text-[var(--text)] placeholder-[var(--muted)]/25 outline-none transition-all duration-200 focus:border-[var(--accent)]/40 focus:bg-[var(--card-hover)] md:py-3"
          />
          {search ? (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)]/30 transition-colors hover:text-[var(--muted)]/60"
            >
              <X size={14} />
            </button>
          ) : (
            <span className="absolute right-3 top-1/2 hidden -translate-y-1/2 text-[9px] text-[var(--muted)]/15 md:block">⌘K</span>
          )}
        </div>

        {/* Artist filter pills */}
        <div className="relative mt-3">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-6 bg-gradient-to-r from-[var(--bg)] to-transparent md:hidden" />
          <div
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto scrollbar-hidden pb-1 -mb-1"
          >
            <button
              onClick={() => setArtistFilter("all")}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-all duration-300 ${
                artistFilter === "all"
                  ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                  : "border-[var(--border)] text-[var(--muted)]/50 hover:border-[var(--accent)]/30 hover:text-[var(--text)]/70"
              }`}
            >
              All
            </button>
            {artists.map((artist) => (
              <button
                key={artist}
                onClick={() => setArtistFilter(artist)}
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-all duration-300 ${
                  artistFilter === artist
                    ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                    : "border-[var(--border)] text-[var(--muted)]/50 hover:border-[var(--accent)]/30 hover:text-[var(--text)]/70"
                }`}
              >
                {artist}
              </button>
            ))}
          </div>
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-6 bg-gradient-to-l from-[var(--bg)] to-transparent md:hidden" />
        </div>
      </div>

      {/* Results */}
      {filteredSongs.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <Music size={32} className="text-[var(--muted)]/15" />
          <p className="mt-4 font-serif text-lg text-[var(--text)]/30">No songs found</p>
          <p className="mt-1 text-xs text-[var(--muted)]/20">Try a different search or artist.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 md:gap-4">
          {filteredSongs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      )}
    </div>
  );
}
