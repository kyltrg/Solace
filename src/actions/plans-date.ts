"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createDatePlan(formData: FormData): Promise<void> {
  const title = formData.get("title")?.toString() ?? "";
  const description = formData.get("description")?.toString() ?? "";
  const location = formData.get("location")?.toString() ?? "";
  const planDate = formData.get("planDate")?.toString() ?? "";
  const time = formData.get("time")?.toString() ?? "";

  if (!title.trim() || !planDate.trim()) return;

  await prisma.datePlan.create({
    data: {
      title,
      description,
      location: location || null,
      planDate: new Date(planDate),
      time: time || null,
    },
  });

  revalidatePath("/dates");
}

export async function deleteDatePlan(id: string): Promise<void> {
  await prisma.datePlan.delete({ where: { id } });
  revalidatePath("/dates");
}
