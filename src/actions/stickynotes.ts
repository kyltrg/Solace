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
    const noteTitles = [
      `${name} added a new note \u{1F4AD}`,
      `${name} left you a note \u{1F4AD}`,
      `New note from ${name} \u{1F4AD}`,
    ];
    const noteBodies = [
      "Read it now on Solace.",
      "Come see what they wrote.",
      "Open Solace to read it.",
    ];
    await sendPushToAuthor(
      target,
      noteTitles[Math.floor(Math.random() * noteTitles.length)],
      noteBodies[Math.floor(Math.random() * noteBodies.length)],
      "/home",
    );
  }

  return { updatedAt: record.updatedAt.toISOString() };
}
