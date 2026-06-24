"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const val = cookieStore.get("solace-admin")?.value;
  return val === "true" || val?.length === 36;
}

export async function getDateMemories(): Promise<{ id: string; title: string; description: string; location: string | null; memoryDate: string; createdAt: string }[]> {
  if (!(await isAdmin())) return [];
  const items = await prisma.dateMemory.findMany({ orderBy: { memoryDate: "desc" } });
  return items.map((i) => ({ ...i, memoryDate: i.memoryDate.toISOString(), createdAt: i.createdAt.toISOString() }));
}

export async function getDatePlans(): Promise<{ id: string; title: string; description: string; location: string | null; planDate: string; time: string | null; createdAt: string }[]> {
  if (!(await isAdmin())) return [];
  const items = await prisma.datePlan.findMany({ orderBy: { planDate: "desc" } });
  return items.map((i) => ({ ...i, planDate: i.planDate.toISOString(), createdAt: i.createdAt.toISOString() }));
}

export async function updateDateMemory(id: string, formData: FormData): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAdmin())) return { ok: false, error: "Unauthorized" };

  const title = formData.get("title")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const location = formData.get("location")?.toString().trim();
  const memoryDate = formData.get("memoryDate")?.toString();

  if (!title || !description || !memoryDate) {
    return { ok: false, error: "Title, description, and date are required." };
  }

  try {
    await prisma.dateMemory.update({
      where: { id },
      data: { title, description, location: location || null, memoryDate: new Date(memoryDate) },
    });
    revalidatePath("/dates");
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to update date memory." };
  }
}

export async function deleteDateMemory(id: string): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAdmin())) return { ok: false, error: "Unauthorized" };
  try {
    await prisma.dateMemory.delete({ where: { id } });
    revalidatePath("/dates");
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to delete date memory." };
  }
}

export async function updateDatePlan(id: string, formData: FormData): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAdmin())) return { ok: false, error: "Unauthorized" };

  const title = formData.get("title")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const location = formData.get("location")?.toString().trim();
  const planDate = formData.get("planDate")?.toString();
  const time = formData.get("time")?.toString().trim();

  if (!title || !description || !planDate) {
    return { ok: false, error: "Title, description, and date are required." };
  }

  try {
    await prisma.datePlan.update({
      where: { id },
      data: { title, description, location: location || null, planDate: new Date(planDate), time: time || null },
    });
    revalidatePath("/dates");
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to update date plan." };
  }
}

export async function deleteDatePlan(id: string): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAdmin())) return { ok: false, error: "Unauthorized" };
  try {
    await prisma.datePlan.delete({ where: { id } });
    revalidatePath("/dates");
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to delete date plan." };
  }
}
