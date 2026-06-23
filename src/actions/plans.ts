"use server";

import { revalidatePath } from "next/cache";

import {
  DreamStatus,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";


export type DreamData = {
  id: string;
  title: string;
  description: string;
  horizon: string;
  status: "PRAYING" | "ACHIEVED";
  createdAt: Date;
};

export async function getDreams(): Promise<DreamData[]> {
  const dreams = await prisma.dream.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return dreams.map((d) => ({
    id: d.id,
    title: d.title,
    description: d.description,
    horizon: d.horizon,
    status: d.status as "PRAYING" | "ACHIEVED",
    createdAt: d.createdAt,
  }));
}

export async function createDream(
  formData: FormData
): Promise<void> {

  const title =
    formData.get("title")?.toString() ?? "";

  const description =
    formData.get("description")?.toString() ?? "";

  const horizon =
    formData.get("horizon")?.toString() ?? "";


  if (
    !title.trim() ||
    !description.trim() ||
    !horizon.trim()
  ) {
    return;
  }


  await prisma.dream.create({
    data: {
      title,
      description,
      horizon,
      status: DreamStatus.PRAYING,
    },
  });


  revalidatePath("/plans");
}



export async function toggleDreamStatus(
  dreamId: string
): Promise<void> {

  const dream =
    await prisma.dream.findUnique({
      where: {
        id: dreamId,
      },
    });


  if (!dream) {
    return;
  }


  await prisma.dream.update({
    where: {
      id: dreamId,
    },

    data: {
      status:
        dream.status === DreamStatus.PRAYING
          ? DreamStatus.ACHIEVED
          : DreamStatus.PRAYING,
    },
  });


  revalidatePath("/plans");
}