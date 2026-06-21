"use client";

import { useState, useMemo, useRef } from "react";
import { Search, X } from "lucide-react";
import { useMusic } from "./MusicProvider";
import SongCard from "./SongCard";

export default function SongArchive() {
  const { songs } = useMusic();
  const [search, setSearch] = useState("");
  const [artistFilter, setArtistFilter] = useState("all");
  const inputRef = useRef<HTMLInputElement>(null);

  const artists = useMemo(() => {
    const set = new Set(songs.map((s) => s.artist));
    return Array.from(set).sort();
  }, [songs]);

  const query = search.toLowerCase().trim();

  const filtered = useMemo(() => {
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

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="relative w-full">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]/30" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            autoComplete="off"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search songs by title, artist, or note..."
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--card-bg)] py-3 pl-10 pr-4 text-sm text-[var(--text)] placeholder-[var(--muted)]/25 outline-none transition-colors focus:border-[var(--accent)]/30"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)]/30 hover:text-[var(--muted)]/60"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="relative self-end">
          <div className="absolute left-0 top-0 bottom-0 w-5 bg-gradient-to-r from-[var(--bg)] to-transparent z-10 pointer-events-none" />
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hidden">
            <button
              onClick={() => setArtistFilter("all")}
              className={`shrink-0 rounded-xl border px-3.5 py-2 text-xs whitespace-nowrap transition-all duration-300 ${
                artistFilter === "all"
                  ? "border-[var(--accent)]/30 bg-[var(--accent)]/10 text-[var(--text)]"
                  : "border-[var(--border)] text-[var(--muted)]/40 hover:border-[var(--accent)]/20 hover:text-[var(--text)]/60"
              }`}
            >
              All Artists
            </button>
            {artists.map((artist) => (
              <button
                key={artist}
                onClick={() => setArtistFilter(artist)}
                className={`shrink-0 rounded-xl border px-3.5 py-2 text-xs whitespace-nowrap transition-all duration-300 ${
                  artistFilter === artist
                    ? "border-[var(--accent)]/30 bg-[var(--accent)]/10 text-[var(--text)]"
                    : "border-[var(--border)] text-[var(--muted)]/40 hover:border-[var(--accent)]/20 hover:text-[var(--text)]/60"
                }`}
              >
                {artist}
              </button>
            ))}
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-5 bg-gradient-to-l from-[var(--bg)] to-transparent z-10 pointer-events-none" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <p className="font-serif text-xl text-[var(--text)]/40">No songs found</p>
          <p className="mt-2 text-sm text-[var(--muted)]/25">Try a different search or artist.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      )}
    </div>
  );
}
