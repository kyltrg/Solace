"use client";

import ReactPlayer from "react-player";
import { useMusic } from "./MusicProvider";

export default function HiddenPlayer(): React.JSX.Element {
  const { currentSong, isPlaying, nextSong } = useMusic();

  if (!currentSong) return <></>;

  return (
    <div className="fixed top-0 left-0 w-[1px] h-[1px] opacity-0 pointer-events-none overflow-hidden">
      <ReactPlayer
        src={currentSong.url}
        playing={isPlaying}
        controls={false}
        width="1"
        height="1"
        onEnded={nextSong}
        playsInline
      />
    </div>
  );
}
