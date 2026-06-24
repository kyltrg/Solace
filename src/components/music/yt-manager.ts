let ytPlayer: YT.Player | null = null;
let pendingVideoId: string | null = null;
let onEndedCallback: (() => void) | null = null;

export function extractYoutubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|music\.youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/
  );
  return m ? m[1] : null;
}

export function loadSong(videoId: string): void {
  if (ytPlayer && typeof ytPlayer.loadVideoById === "function") {
    ytPlayer.loadVideoById(videoId);
    ytPlayer.playVideo();
  } else {
    pendingVideoId = videoId;
  }
}

export function playVideo(): void {
  if (ytPlayer && typeof ytPlayer.playVideo === "function") {
    ytPlayer.playVideo();
  }
}

export function pauseVideo(): void {
  if (ytPlayer && typeof ytPlayer.pauseVideo === "function") {
    ytPlayer.pauseVideo();
  }
}

export function getCurrentTime(): number {
  if (ytPlayer && typeof ytPlayer.getCurrentTime === "function") {
    return ytPlayer.getCurrentTime();
  }
  return 0;
}

export function getDuration(): number {
  if (ytPlayer && typeof ytPlayer.getDuration === "function") {
    return ytPlayer.getDuration();
  }
  return 0;
}

export function setOnEnded(cb: () => void): void {
  onEndedCallback = cb;
}

export function initYtPlayer(containerId: string): void {
  if (typeof window === "undefined") return;
  if (document.getElementById("yt-iframe-api-script")) return;

  const tag = document.createElement("script");
  tag.id = "yt-iframe-api-script";
  tag.src = "https://www.youtube.com/iframe_api";
  document.body.appendChild(tag);

  (window as any).onYouTubeIframeAPIReady = () => {
    ytPlayer = new YT.Player(containerId, {
      height: "1",
      width: "1",
      playerVars: {
        autoplay: 1,
        playsinline: 1,
        controls: 0,
        modestbranding: 1,
        rel: 0,
      },
      events: {
        onReady: () => {
          if (pendingVideoId) {
            ytPlayer?.loadVideoById(pendingVideoId);
            pendingVideoId = null;
          }
        },
        onStateChange: (e: YT.OnStateChangeEvent) => {
          if (e.data === YT.PlayerState.ENDED) {
            onEndedCallback?.();
          }
        },
      },
    });
  };
}
