"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export type LetterData = {
  id: string;
  title: string;
  preview: string;
  category: string;
  author: string | null;
  createdAt: string;
};

export async function getLetters(): Promise<LetterData[]> {
  const letters = await prisma.letter.findMany({
    orderBy: { createdAt: "desc" },
  });
  return letters.map((l) => ({
    id: l.id,
    title: l.title,
    preview: l.preview,
    category: l.category,
    author: l.author,
    createdAt: l.createdAt.toISOString(),
  }));
}

export async function createLetter(formData: FormData): Promise<{ ok: boolean; error?: string; id?: string }> {
  const title = formData.get("title")?.toString().trim();
  const content = formData.get("content")?.toString().trim();
  const category = formData.get("category")?.toString().trim() || "General";

  if (!title || !content) {
    return { ok: false, error: "Title and content are required." };
  }

  const cookieStore = await cookies();
  const author = cookieStore.get("solace-user")?.value || null;

  const preview = content.length > 160 ? content.slice(0, 160) + "…" : content;

  try {
    const letter = await prisma.letter.create({
      data: { title, content, preview, category, author },
    });
    revalidatePath("/letters");
    return { ok: true, id: letter.id };
  } catch {
    return { ok: false, error: "Failed to create letter." };
  }
}
