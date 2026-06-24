"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { loadSong, playVideo, pauseVideo, extractYoutubeId } from "./yt-manager";

export type Song = {
  id: string;
  title: string;
  artist: string;
  url: string;
  note: string | null;
  thumbnail: string | null;
  playlistId: string | null;
  order: number;
};

export type Playlist = {
  id: string;
  name: string;
  author: string | null;
  songCount: number;
};

type MusicContextType = {
  songs: Song[];
  setSongs: (songs: Song[]) => void;
  currentSong: Song | null;
  isPlaying: boolean;
  setPlaying: (value: boolean) => void;
  playSong: (song: Song) => void;
  nextSong: () => void;
  previousSong: () => void;
  togglePlay: () => void;
  playNext: (song: Song) => void;
  queue: Song[];
  setQueue: (queue: Song[]) => void;
  playlists: Playlist[];
  setPlaylists: (playlists: Playlist[]) => void;
  activePlaylistId: string | null;
  setActivePlaylistId: (id: string | null) => void;
};

const MusicContext = createContext<MusicContextType | null>(null);

export function MusicProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setPlaying] = useState(false);
  const [queue, setQueue] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);

  const activeSongs = useMemo(() => {
    if (activePlaylistId === null) return songs;
    return songs.filter((s) => s.playlistId === activePlaylistId).sort((a, b) => a.order - b.order);
  }, [songs, activePlaylistId]);

  const playSong = useCallback(function (song: Song) {
    setCurrentSong(song);
    setPlaying(true);
    const videoId = extractYoutubeId(song.url);
    if (videoId) loadSong(videoId);
  }, []);

  const togglePlay = useCallback(
    function () {
      if (!currentSong) return;
      setPlaying((prev) => {
        const next = !prev;
        if (next) playVideo();
        else pauseVideo();
        return next;
      });
    },
    [currentSong]
  );

  const nextSong = useCallback(
    function () {
      if (queue.length > 0) {
        const [next, ...rest] = queue;
        setQueue(rest);
        setCurrentSong(next);
        setPlaying(true);
        const videoId = extractYoutubeId(next.url);
        if (videoId) loadSong(videoId);
        return;
      }

      if (!currentSong || activeSongs.length === 0) return;
      const index = activeSongs.findIndex((song) => song.id === currentSong.id);
      const next = activeSongs[(index + 1) % activeSongs.length];
      setCurrentSong(next);
      setPlaying(true);
      const videoId = extractYoutubeId(next.url);
      if (videoId) loadSong(videoId);
    },
    [currentSong, activeSongs, queue]
  );

  const previousSong = useCallback(
    function () {
      if (!currentSong || activeSongs.length === 0) return;
      const index = activeSongs.findIndex((song) => song.id === currentSong.id);
      const previous = activeSongs[index <= 0 ? activeSongs.length - 1 : index - 1];
      setCurrentSong(previous);
      setPlaying(true);
      const videoId = extractYoutubeId(previous.url);
      if (videoId) loadSong(videoId);
    },
    [currentSong, activeSongs]
  );

  const playNext = useCallback(function (song: Song) {
    setQueue((prev) => [song, ...prev]);
  }, []);

  const value = useMemo(
    () => ({
      songs,
      setSongs,
      currentSong,
      isPlaying,
      setPlaying,
      playSong,
      nextSong,
      previousSong,
      togglePlay,
      playNext,
      queue,
      setQueue,
      playlists,
      setPlaylists,
      activePlaylistId,
      setActivePlaylistId,
    }),
    [songs, currentSong, isPlaying, setPlaying, playSong, nextSong, previousSong, togglePlay, playNext, queue, playlists, activePlaylistId]
  );

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) throw new Error("MusicProvider missing");
  return context;
}
