"use server";

import { prisma } from "@/lib/prisma";

import { revalidatePath } from "next/cache";

export async function getStickyNotes(): Promise<{
  angelMessage: string;
  kyleMessage: string;
  updatedAt: string | null;
}> {
  try {
    const note = await prisma.stickyNote.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    if (!note) {
      return { angelMessage: "", kyleMessage: "", updatedAt: null };
    }

    return {
      angelMessage: note.angelMessage,
      kyleMessage: note.kyleMessage,
      updatedAt: note.updatedAt.toISOString(),
    };
  } catch {
    return { angelMessage: "", kyleMessage: "", updatedAt: null };
  }
}

export async function saveStickyNotes(formData: FormData): Promise<{ updatedAt: string }> {
  const angelMessage =
    formData.get("angelMessage")?.toString() ?? "";
  const kyleMessage =
    formData.get("kyleMessage")?.toString() ?? "";

  const existing = await prisma.stickyNote.findFirst({
    orderBy: { updatedAt: "desc" },
  });

  let record;
  if (existing) {
    record = await prisma.stickyNote.update({
      where: { id: existing.id },
      data: { angelMessage, kyleMessage },
    });
  } else {
    record = await prisma.stickyNote.create({
      data: { angelMessage, kyleMessage },
    });
  }

  revalidatePath("/home");
  return { updatedAt: record.updatedAt.toISOString() };
}
