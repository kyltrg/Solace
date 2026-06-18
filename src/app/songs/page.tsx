import { prisma } from "@/lib/prisma";
import RoomLayout from "@/components/layout/RoomLayout";
import MusicRoom from "@/components/music/MusicRoom";
import SongArchive from "@/components/music/SongArchive";
import MusicLoader from "@/components/music/MusicLoader";

export default async function SongsPage(): Promise<React.JSX.Element> {
  const songs = await prisma.song.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <RoomLayout
      eyebrow="Songs"
      title="Music Room"
      description="The songs that became part of us."
    >
      <MusicLoader
        songs={songs.map((song) => ({
          id: song.id,
          title: song.title,
          artist: song.artist,
          url: song.url,
          note: song.note,
        }))}
      />

      <div className="space-y-12">
        <MusicRoom />

        <div className="h-px bg-[var(--border)]" />

        <div>
          <h2 className="font-display text-4xl font-light md:text-5xl">Playlist</h2>
          <p className="mt-2 text-sm text-[var(--muted)]/50">Every song that holds a memory.</p>
          <div className="mt-8">
            <SongArchive />
          </div>
        </div>
      </div>
    </RoomLayout>
  );
}
