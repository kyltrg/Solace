"use client";

import { useEffect } from "react";
import { useMusic } from "./MusicProvider";
import { initYtPlayer, setOnEnded, pauseVideo } from "./yt-manager";

export default function HiddenPlayer(): React.JSX.Element {
  const { currentSong, nextSong } = useMusic();

  useEffect(() => {
    setOnEnded(nextSong);
  }, [nextSong]);

  useEffect(() => {
    initYtPlayer("yt-hidden-player");
  }, []);

  // Pause if no song selected
  useEffect(() => {
    if (!currentSong) pauseVideo();
  }, [currentSong]);

  return (
    <div className="fixed top-0 left-0 w-[1px] h-[1px] opacity-0 pointer-events-none overflow-hidden">
      <div id="yt-hidden-player" />
    </div>
  );
}
