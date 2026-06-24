"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const val = cookieStore.get("solace-admin")?.value;
  return val === "true" || val?.length === 36;
}

export async function getVerses(): Promise<{ id: string; content: string; source: string | null; createdAt: string }[]> {
  if (!(await isAdmin())) return [];
  const items = await prisma.verse.findMany({ orderBy: { createdAt: "desc" } });
  return items.map((v) => ({ ...v, createdAt: v.createdAt.toISOString() }));
}

export async function createVerse(content: string, source?: string): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAdmin())) return { ok: false, error: "Unauthorized" };
  if (!content.trim()) return { ok: false, error: "Verse content is required." };
  try {
    await prisma.verse.create({ data: { content: content.trim(), source: source?.trim() || null } });
    revalidatePath("/admin");
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to create verse." };
  }
}

export async function updateVerse(id: string, content: string, source?: string): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAdmin())) return { ok: false, error: "Unauthorized" };
  if (!content.trim()) return { ok: false, error: "Verse content is required." };
  try {
    await prisma.verse.update({
      where: { id },
      data: { content: content.trim(), source: source?.trim() || null },
    });
    revalidatePath("/admin");
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to update verse." };
  }
}

export async function deleteVerse(id: string): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAdmin())) return { ok: false, error: "Unauthorized" };
  try {
    await prisma.verse.delete({ where: { id } });
    revalidatePath("/admin");
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to delete verse." };
  }
}
