"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get("solace-admin")?.value === "true";
}

export async function getAdminSongs(): Promise<{ id: string; title: string; artist: string; url: string; note: string | null; createdAt: string }[]> {
  if (!(await isAdmin())) return [];
  const items = await prisma.song.findMany({ orderBy: { createdAt: "desc" } });
  return items.map((i) => ({ ...i, createdAt: i.createdAt.toISOString() }));
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

  try {
    await prisma.song.create({ data: { title, artist, url, note: note || null } });
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

  try {
    await prisma.song.update({
      where: { id },
      data: { title, artist, url, note: note || null },
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
