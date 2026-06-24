"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { fetchYouTubeMetadata } from "@/lib/youtube";
import { extractYoutubeId } from "@/components/music/yt-manager";

async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const val = cookieStore.get("solace-admin")?.value;
  return val === "true" || val?.length === 36;
}

export type AdminSong = { id: string; title: string; artist: string; url: string; note: string | null; thumbnail: string | null; createdAt: string };

export async function getAdminSongs(): Promise<AdminSong[]> {
  if (!(await isAdmin())) return [];
  const items = await prisma.song.findMany({ orderBy: { createdAt: "desc" } });
  return items.map((i) => ({ ...i, createdAt: i.createdAt.toISOString() }));
}

function fetchThumbnailOrNull(url: string): Promise<string | null> {
  const videoId = extractYoutubeId(url);
  if (!videoId) return Promise.resolve(null);
  return fetchYouTubeMetadata(videoId).then((m) => m.thumbnail).catch(() => null);
}

export async function createSong(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAdmin())) return { ok: false, error: "Unauthorized" };

  const title = formData.get("title")?.toString().trim();
  const artist = formData.get("artist")?.toString().trim();
  const url = formData.get("url")?.toString().trim();
  const note = formData.get("note")?.toString().trim();

  if (!title || !artist || !url) {
    return { ok: false, error: "Title, artist, and URL are required." };
  }

  const thumbnail = await fetchThumbnailOrNull(url);

  try {
    await prisma.song.create({ data: { title, artist, url, note: note || null, thumbnail } });
    revalidatePath("/songs");
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to create song." };
  }
}

export async function updateSong(id: string, formData: FormData): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAdmin())) return { ok: false, error: "Unauthorized" };

  const title = formData.get("title")?.toString().trim();
  const artist = formData.get("artist")?.toString().trim();
  const url = formData.get("url")?.toString().trim();
  const note = formData.get("note")?.toString().trim();

  if (!title || !artist || !url) {
    return { ok: false, error: "Title, artist, and URL are required." };
  }

  // 1. If client explicitly sent a thumbnail, use it (from Fetch button)
  const rawThumbnail = formData.get("thumbnail")?.toString().trim();
  if (rawThumbnail) {
    try {
      await prisma.song.update({
        where: { id },
        data: { title, artist, url, note: note || null, thumbnail: rawThumbnail },
      });
      revalidatePath("/songs");
      return { ok: true };
    } catch {
      return { ok: false, error: "Failed to update song." };
    }
  }

  // 2. Otherwise auto-fetch from YouTube
  const thumbnail = await fetchThumbnailOrNull(url);

  try {
    await prisma.song.update({
      where: { id },
      data: { title, artist, url, note: note || null, thumbnail },
    });
    revalidatePath("/songs");
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to update song." };
  }
}

export async function deleteSong(id: string): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAdmin())) return { ok: false, error: "Unauthorized" };
  try {
    await prisma.song.delete({ where: { id } });
    revalidatePath("/songs");
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to delete song." };
  }
}

export async function fetchMetadataForUrl(url: string): Promise<{ ok: boolean; title?: string; artist?: string; thumbnail?: string | null; error?: string }> {
  if (!(await isAdmin())) return { ok: false, error: "Unauthorized" };

  const videoId = extractYoutubeId(url);
  if (!videoId) {
    return { ok: false, error: "Invalid YouTube URL." };
  }

  try {
    const meta = await fetchYouTubeMetadata(videoId);
    return { ok: true, ...meta };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed to fetch metadata." };
  }
}
