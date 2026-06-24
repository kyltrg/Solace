import { PrismaClient } from "@prisma/client";
import { fetchYouTubeMetadata } from "../../src/lib/youtube";

const prisma = new PrismaClient();

function extractYoutubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|music\.youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/
  );
  return m ? m[1] : null;
}

async function main() {
  console.log("Fetching songs without thumbnails...");
  const songs = await prisma.song.findMany({
    where: { thumbnail: null },
  });

  console.log(`Found ${songs.length} songs to backfill.`);

  for (const song of songs) {
    const videoId = extractYoutubeId(song.url);
    if (!videoId) {
      console.log(`  SKIP ${song.title} — no video ID in URL`);
      continue;
    }

    try {
      const meta = await fetchYouTubeMetadata(videoId);
      await prisma.song.update({
        where: { id: song.id },
        data: { thumbnail: meta.thumbnail },
      });
      console.log(`  OK   ${song.title} — ${meta.thumbnail ? "thumbnail fetched" : "no thumbnail available"}`);
    } catch (e) {
      console.log(`  FAIL ${song.title} — ${e instanceof Error ? e.message : "unknown error"}`);
    }

    await new Promise((r) => setTimeout(r, 200));
  }

  console.log("Done.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
