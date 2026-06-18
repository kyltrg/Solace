"use server";

import { prisma } from "@/lib/prisma";

import { revalidatePath } from "next/cache";

export async function getStickyNotes(): Promise<{
  angelMessage: string;
  kyleMessage: string;
}> {
  try {
    const note = await prisma.stickyNote.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    if (!note) {
      return { angelMessage: "", kyleMessage: "" };
    }

    return {
      angelMessage: note.angelMessage,
      kyleMessage: note.kyleMessage,
    };
  } catch {
    return { angelMessage: "", kyleMessage: "" };
  }
}

export async function saveStickyNotes(formData: FormData): Promise<void> {
  const angelMessage =
    formData.get("angelMessage")?.toString() ?? "";
  const kyleMessage =
    formData.get("kyleMessage")?.toString() ?? "";

  const existing = await prisma.stickyNote.findFirst({
    orderBy: { updatedAt: "desc" },
  });

  if (existing) {
    await prisma.stickyNote.update({
      where: { id: existing.id },
      data: { angelMessage, kyleMessage },
    });
  } else {
    await prisma.stickyNote.create({
      data: { angelMessage, kyleMessage },
    });
  }

  revalidatePath("/home");
}
