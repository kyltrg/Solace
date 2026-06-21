"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get("solace-admin")?.value === "true";
}

export async function getAdminDreams(): Promise<{ id: string; title: string; description: string; horizon: string; status: string; createdAt: string }[]> {
  if (!(await isAdmin())) return [];
  const items = await prisma.dream.findMany({ orderBy: { createdAt: "desc" } });
  return items.map((i) => ({ id: i.id, title: i.title, description: i.description, horizon: i.horizon, status: i.status, createdAt: i.createdAt.toISOString() }));
}

export async function updateDream(id: string, formData: FormData): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAdmin())) return { ok: false, error: "Unauthorized" };

  const title = formData.get("title")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const horizon = formData.get("horizon")?.toString().trim();
  const status = formData.get("status")?.toString();

  if (!title || !description || !horizon) {
    return { ok: false, error: "Title, description, and horizon are required." };
  }

  const validStatus = status === "ACHIEVED" || status === "PRAYING" ? status : "PRAYING";

  try {
    await prisma.dream.update({
      where: { id },
      data: { title, description, horizon, status: validStatus as any },
    });
    revalidatePath("/plans");
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to update dream." };
  }
}

export async function deleteDream(id: string): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAdmin())) return { ok: false, error: "Unauthorized" };
  try {
    await prisma.dream.delete({ where: { id } });
    revalidatePath("/plans");
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to delete dream." };
  }
}
