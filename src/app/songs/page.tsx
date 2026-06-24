import { prisma } from "@/lib/prisma";
import RoomLayout from "@/components/layout/RoomLayout";
import MusicRoom from "@/components/music/MusicRoom";
import SongArchive from "@/components/music/SongArchive";
import MusicLoader from "@/components/music/MusicLoader";

export default async function SongsPage(): Promise<React.JSX.Element> {
  const [songs, playlists] = await Promise.all([
    prisma.song.findMany({
      orderBy: [{ playlistId: "asc" }, { order: "asc" }, { createdAt: "desc" }],
    }),
    prisma.playlist.findMany({
      orderBy: { createdAt: "asc" },
      include: { _count: { select: { songs: true } } },
    }),
  ]);

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
          thumbnail: song.thumbnail,
          playlistId: song.playlistId,
          order: song.order,
        }))}
        playlists={playlists.map((p) => ({
          id: p.id,
          name: p.name,
          author: p.author,
          songCount: p._count.songs,
        }))}
      />

      <div className="space-y-10 pb-24 md:pb-0">
        <div id="now-playing-section">
          <MusicRoom />
        </div>

        <div>
          <SongArchive />
        </div>
      </div>
    </RoomLayout>
  );
}
