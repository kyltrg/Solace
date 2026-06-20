"use client";

import { useEffect, useRef } from "react";
import { useMusic } from "./MusicProvider";

export default function AutoPlayOnInteraction(): React.JSX.Element {
  const { currentSong, isPlaying, setPlaying } = useMusic();
  const triggered = useRef(false);

  useEffect(() => {
    if (triggered.current || isPlaying || !currentSong) return;

    const handler = () => {
      if (triggered.current) return;
      triggered.current = true;
      setPlaying(true);
      document.removeEventListener("click", handler, true);
      document.removeEventListener("touchstart", handler, true);
    };

    document.addEventListener("click", handler, true);
    document.addEventListener("touchstart", handler, true);

    return () => {
      document.removeEventListener("click", handler, true);
      document.removeEventListener("touchstart", handler, true);
    };
  }, [currentSong, isPlaying, setPlaying]);

  return <></>;
}
