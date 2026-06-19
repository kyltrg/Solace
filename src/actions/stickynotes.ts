"use server";

import { prisma } from "@/lib/prisma";

import { revalidatePath } from "next/cache";
import { sendPushToAuthor } from "./push";

type NoteRecord = {
  message: string;
  updatedAt: string;
} | null;

export async function getStickyNotes(): Promise<{
  angel: NoteRecord;
  kyle: NoteRecord;
}> {
  try {
    const [angel, kyle] = await Promise.all([
      prisma.stickyNote.findFirst({
        where: { author: "angel" },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.stickyNote.findFirst({
        where: { author: "kyle" },
        orderBy: { updatedAt: "desc" },
      }),
    ]);

    return {
      angel: angel ? { message: angel.message, updatedAt: angel.updatedAt.toISOString() } : null,
      kyle: kyle ? { message: kyle.message, updatedAt: kyle.updatedAt.toISOString() } : null,
    };
  } catch {
    return { angel: null, kyle: null };
  }
}

export async function saveStickyNote(formData: FormData): Promise<{ updatedAt: string }> {
  const author = formData.get("author")?.toString() ?? "";
  const message = formData.get("message")?.toString() ?? "";

  const existing = await prisma.stickyNote.findFirst({
    where: { author },
    orderBy: { updatedAt: "desc" },
  });

  let record;
  if (existing) {
    record = await prisma.stickyNote.update({
      where: { id: existing.id },
      data: { message },
    });
  } else {
    record = await prisma.stickyNote.create({
      data: { author, message },
    });
  }

  revalidatePath("/home");

  if (message.trim()) {
    const name = author === "angel" ? "Angel" : "Kyle";
    const target = author === "angel" ? "kyle" : "angel";
    await sendPushToAuthor(
      target,
      "New Sticky Note",
      `${name} added a new note. Read it now!`,
      "/home",
    );
  }

  return { updatedAt: record.updatedAt.toISOString() };
}
