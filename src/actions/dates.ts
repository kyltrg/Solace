"use server";

import { prisma } from "@/lib/prisma";

import {
  revalidatePath,
} from "next/cache";

export async function createDateMemory(
  formData: FormData
): Promise<void> {
  const title =
    formData.get("title")?.toString() ?? "";

  const description =
    formData.get("description")?.toString() ?? "";

  const location =
    formData.get("location")?.toString() ?? "";

  const memoryDate =
    formData.get("memoryDate")?.toString() ?? "";

  await prisma.dateMemory.create({
    data: {
      title,
      description,
      location,
      memoryDate:
        new Date(memoryDate),
    },
  });

  revalidatePath("/dates");
}