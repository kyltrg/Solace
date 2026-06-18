"use server";

import { prisma } from "@/lib/prisma";

import {
  revalidatePath,
} from "next/cache";


export async function createTonightEntry(
  formData: FormData
): Promise<void> {


  const gratitude =
    formData
      .get("gratitude")
      ?.toString() ?? "";


  const challenge =
    formData
      .get("challenge")
      ?.toString() ?? "";


  const prayer =
    formData
      .get("prayer")
      ?.toString() ?? "";



  if (
    !gratitude.trim() ||
    !challenge.trim() ||
    !prayer.trim()
  ) {
    return;
  }



  await prisma.tonightEntry.create({
    data: {
      gratitude,
      challenge,
      prayer,
    },
  });



  revalidatePath("/tonight");
}