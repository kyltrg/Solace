"use client";

import { useEffect } from "react";
import { Song, Playlist, useMusic } from "./MusicProvider";

export default function MusicLoader({
  songs,
  playlists,
}: {
  songs: Song[];
  playlists: Playlist[];
}): React.JSX.Element {
  const { setSongs, setPlaylists } = useMusic();

  useEffect(() => {
    setSongs(songs);
  }, [songs]);

  useEffect(() => {
    setPlaylists(playlists);
  }, [playlists]);

  return <></>;
}
