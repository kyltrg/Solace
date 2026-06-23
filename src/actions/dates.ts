"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function createDateMemory(formData: FormData): Promise<void> {
  const title = formData.get("title")?.toString() ?? "";
  const description = formData.get("description")?.toString() ?? "";
  const location = formData.get("location")?.toString() ?? "";
  const memoryDateRaw = formData.get("memoryDate")?.toString() ?? "";
  const images = formData.get("images")?.toString() ?? null;

  if (!title) throw new Error("Title is required.");
  if (!memoryDateRaw) throw new Error("Date is required.");
  const memoryDate = new Date(memoryDateRaw);
  if (Number.isNaN(memoryDate.getTime())) throw new Error("Invalid date.");

  const cookieStore = await cookies();
  const author = cookieStore.get("solace-user")?.value ?? null;

  await prisma.dateMemory.create({
    data: {
      title,
      description,
      location,
      memoryDate,
      images,
      author,
    },
  });

  revalidatePath("/dates");
}

export async function toggleDateMemoryLike(memoryId: string): Promise<void> {
  const cookieStore = await cookies();
  const userName = cookieStore.get("solace-user")?.value ?? "";
  if (!userName) return;

  const memory = await prisma.dateMemory.findUnique({
    where: { id: memoryId },
    select: { likedBy: true },
  });
  if (!memory) return;

  const likedBy: string[] = JSON.parse(memory.likedBy);
  const name = userName.toLowerCase();
  const index = likedBy.indexOf(name);

  if (index > -1) {
    likedBy.splice(index, 1);
  } else {
    if (likedBy.length >= 2) return;
    likedBy.push(name);
  }

  await prisma.dateMemory.update({
    where: { id: memoryId },
    data: { likedBy: JSON.stringify(likedBy) },
  });

  revalidatePath("/dates");
}

export async function createDateMemoryComment(
  memoryId: string,
  content: string
): Promise<void> {
  const cookieStore = await cookies();
  const author = cookieStore.get("solace-user")?.value ?? "Someone";

  await prisma.dateMemoryComment.create({
    data: {
      content,
      author,
      dateMemoryId: memoryId,
    },
  });

  revalidatePath("/dates");
}

export async function deleteDateMemoryComment(commentId: string): Promise<void> {
  await prisma.dateMemoryComment.delete({
    where: { id: commentId },
  });

  revalidatePath("/dates");
}
