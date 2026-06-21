"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get("solace-admin")?.value === "true";
}

export async function getAdminTonightEntries(): Promise<{ id: string; gratitude: string; challenge: string; prayer: string; createdAt: string }[]> {
  if (!(await isAdmin())) return [];
  const items = await prisma.tonightEntry.findMany({ orderBy: { createdAt: "desc" } });
  return items.map((i) => ({ ...i, createdAt: i.createdAt.toISOString() }));
}

export async function updateTonightEntry(id: string, formData: FormData): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAdmin())) return { ok: false, error: "Unauthorized" };

  const gratitude = formData.get("gratitude")?.toString().trim();
  const challenge = formData.get("challenge")?.toString().trim();
  const prayer = formData.get("prayer")?.toString().trim();

  if (!gratitude || !challenge || !prayer) {
    return { ok: false, error: "All fields are required." };
  }

  try {
    await prisma.tonightEntry.update({
      where: { id },
      data: { gratitude, challenge, prayer },
    });
    revalidatePath("/tonight");
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to update tonight entry." };
  }
}

export async function deleteTonightEntry(id: string): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAdmin())) return { ok: false, error: "Unauthorized" };
  try {
    await prisma.tonightEntry.delete({ where: { id } });
    revalidatePath("/tonight");
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to delete tonight entry." };
  }
}
