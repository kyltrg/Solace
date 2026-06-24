"use server";

import { prisma } from "@/lib/prisma";

export async function getDailyVerseConfig(): Promise<string | null> {
  try {
    const row = await prisma.appConfig.findUnique({ where: { key: "daily_verse" } });
    return row?.value ?? null;
  } catch {
    return null;
  }
}
