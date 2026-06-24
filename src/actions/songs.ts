"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { fetchYouTubeMetadata } from "@/lib/youtube";
import { extractYoutubeId } from "@/components/music/yt-manager";
import { cookies } from "next/headers";

export async function fetchSongPreview(url: string): Promise<{
  ok: boolean;
  title?: string;
  artist?: string;
  thumbnail?: string | null;
  error?: string;
}> {
  const videoId = extractYoutubeId(url);
  if (!videoId) return { ok: false, error: "Invalid YouTube URL." };
  try {
    const meta = await fetchYouTubeMetadata(videoId);
    return { ok: true, ...meta };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed to fetch." };
  }
}

export type PlaylistInfo = {
  id: string;
  name: string;
  author: string | null;
  songCount: number;
};

export async function getPlaylists(): Promise<PlaylistInfo[]> {
  const playlists = await prisma.playlist.findMany({
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { songs: true } } },
  });
  return playlists.map((p) => ({
    id: p.id,
    name: p.name,
    author: p.author,
    songCount: p._count.songs,
  }));
}

function fetchThumbnailOrNull(url: string): Promise<string | null> {
  const videoId = extractYoutubeId(url);
  if (!videoId) return Promise.resolve(null);
  return fetchYouTubeMetadata(videoId).then((m) => m.thumbnail).catch(() => null);
}

export async function addSongToPlaylist(
  url: string,
  note: string | null,
  playlistId: string
): Promise<{ ok: boolean; error?: string }> {
  const videoId = extractYoutubeId(url);
  if (!videoId) return { ok: false, error: "Invalid YouTube URL." };

  let meta: { title: string; artist: string; thumbnail: string | null };
  try {
    meta = await fetchYouTubeMetadata(videoId);
  } catch {
    return { ok: false, error: "Could not fetch song info from YouTube." };
  }

  const playlist = await prisma.playlist.findUnique({ where: { id: playlistId } });
  if (!playlist) return { ok: false, error: "Playlist not found." };

  try {
    const count = await prisma.song.count({ where: { playlistId } });
    await prisma.song.create({
      data: {
        title: meta.title,
        artist: meta.artist,
        url,
        note: note || null,
        thumbnail: meta.thumbnail,
        playlistId,
        order: count,
      },
    });
    revalidatePath("/songs");
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to add song." };
  }
}

export async function removeSongFromPlaylist(songId: string): Promise<{ ok: boolean; error?: string }> {
  try {
    await prisma.song.update({
      where: { id: songId },
      data: { playlistId: null, order: 0 },
    });
    revalidatePath("/songs");
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to remove song." };
  }
}

export async function deleteSongCompletely(songId: string): Promise<{ ok: boolean; error?: string }> {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("solace-admin")?.value === "true" || (cookieStore.get("solace-admin")?.value?.length ?? 0) === 36;
  if (!isAdmin) return { ok: false, error: "Unauthorized" };

  try {
    await prisma.song.delete({ where: { id: songId } });
    revalidatePath("/songs");
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to delete song." };
  }
}

export async function reorderPlaylist(
  playlistId: string,
  orderedSongIds: string[]
): Promise<{ ok: boolean; error?: string }> {
  try {
    const updates = orderedSongIds.map((id, index) =>
      prisma.song.update({
        where: { id },
        data: { order: index },
      })
    );
    await prisma.$transaction(updates);
    revalidatePath("/songs");
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to reorder playlist." };
  }
}
