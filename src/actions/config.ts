"use server";

import { prisma } from "@/lib/prisma";

export async function getDailyVerseConfig(): Promise<string | null> {
  try {
    const row = await prisma.appConfig.findUnique({ where: { key: "daily_verse" } });
    const dateRow = await prisma.appConfig.findUnique({ where: { key: "daily_verse_date" } });
    const today = new Date().toISOString().slice(0, 10);

    if (dateRow?.value !== today) {
      const count = await prisma.verse.count();
      if (count > 0) {
        const skip = Math.floor(Math.random() * count);
        const verse = await prisma.verse.findFirst({ skip, take: 1 });
        if (verse) {
          const hasSource = verse.source && !verse.content.trim().endsWith(` — ${verse.source}`);
          const val = hasSource ? `${verse.content} — ${verse.source}` : verse.content;
          await prisma.appConfig.upsert({
            where: { key: "daily_verse" },
            update: { value: val },
            create: { key: "daily_verse", value: val },
          });
          await prisma.appConfig.upsert({
            where: { key: "daily_verse_date" },
            update: { value: today },
            create: { key: "daily_verse_date", value: today },
          });
          return val;
        }
      }
    }

    return row?.value ?? null;
  } catch {
    return null;
  }
}
