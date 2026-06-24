"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const val = cookieStore.get("solace-admin")?.value;
  return val === "true" || val?.length === 36;
}

export async function addComfortMessage(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAdmin())) return { ok: false, error: "Unauthorized" };

  const title = formData.get("title")?.toString().trim();
  const content = formData.get("content")?.toString().trim();
  const category = formData.get("category")?.toString().trim();

  if (!title || !content || !category) {
    return { ok: false, error: "All fields are required." };
  }

  try {
    await prisma.comfortMessage.create({ data: { title, content, category } });
    revalidatePath("/when-you-need-me");
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to create comfort message." };
  }
}

export async function getComfortMessages(): Promise<{ id: string; title: string; content: string; category: string }[]> {
  if (!(await isAdmin())) return [];
  const msgs = await prisma.comfortMessage.findMany({ orderBy: { createdAt: "desc" } });
  return msgs.map((m) => ({ id: m.id, title: m.title, content: m.content, category: m.category }));
}

export async function deleteComfortMessage(id: string): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAdmin())) return { ok: false, error: "Unauthorized" };

  try {
    await prisma.comfortMessage.delete({ where: { id } });
    revalidatePath("/when-you-need-me");
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to delete comfort message." };
  }
}
