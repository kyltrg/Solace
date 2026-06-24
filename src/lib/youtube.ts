export async function fetchYouTubeMetadata(videoId: string) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error("YOUTUBE_API_KEY is not configured");
  }

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`
  );

  if (!res.ok) {
    throw new Error(`YouTube API error: ${res.status}`);
  }

  const data = await res.json();

  if (!data.items || data.items.length === 0) {
    throw new Error("Video not found");
  }

  const snippet = data.items[0].snippet;
  const thumbnails = snippet.thumbnails;
  const thumbnail =
    thumbnails?.maxres?.url ||
    thumbnails?.high?.url ||
    thumbnails?.default?.url ||
    null;

  return {
    title: snippet.title,
    artist: snippet.channelTitle,
    thumbnail,
  };
}
