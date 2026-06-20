"use client";

import { useEffect } from "react";
import { useMusic } from "./MusicProvider";
import { initYtPlayer, setOnEnded, loadAndPlay, pauseVideo, extractYoutubeId } from "./yt-manager";

export default function HiddenPlayer(): React.JSX.Element {
  const { currentSong, isPlaying, nextSong } = useMusic();

  useEffect(() => {
    setOnEnded(nextSong);
  }, [nextSong]);

  useEffect(() => {
    initYtPlayer("yt-hidden-player");
  }, []);

  useEffect(() => {
    if (!currentSong) {
      pauseVideo();
      return;
    }
    const videoId = extractYoutubeId(currentSong.url);
    if (!videoId) return;

    if (isPlaying) {
      loadAndPlay(videoId);
    } else {
      pauseVideo();
    }
  }, [currentSong, isPlaying]);

  return (
    <div className="fixed top-0 left-0 w-[1px] h-[1px] opacity-0 pointer-events-none overflow-hidden">
      <div id="yt-hidden-player" />
    </div>
  );
}
