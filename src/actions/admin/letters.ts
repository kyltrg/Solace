"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const val = cookieStore.get("solace-admin")?.value;
  return val === "true" || val?.length === 36;
}

export async function getAdminLetters(): Promise<{ id: string; title: string; preview: string; content: string; category: string; author: string | null; createdAt: string }[]> {
  if (!(await isAdmin())) return [];
  const letters = await prisma.letter.findMany({ orderBy: { createdAt: "desc" } });
  return letters.map((l) => ({ ...l, createdAt: l.createdAt.toISOString() }));
}

export async function updateLetter(id: string, formData: FormData): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAdmin())) return { ok: false, error: "Unauthorized" };

  const title = formData.get("title")?.toString().trim();
  const content = formData.get("content")?.toString().trim();
  const category = formData.get("category")?.toString().trim();

  if (!title || !content) {
    return { ok: false, error: "Title and content are required." };
  }

  const preview = content.length > 160 ? content.slice(0, 160) + "…" : content;

  try {
    await prisma.letter.update({
      where: { id },
      data: { title, content, preview, category: category || "General" },
    });
    revalidatePath("/letters");
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to update letter." };
  }
}

export async function deleteLetter(id: string): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAdmin())) return { ok: false, error: "Unauthorized" };

  try {
    await prisma.letter.delete({ where: { id } });
    revalidatePath("/letters");
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to delete letter." };
  }
}
