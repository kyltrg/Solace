"use server";

import { prisma } from "@/lib/prisma";

export async function updatePresence(userName: string): Promise<void> {
  const normalized = userName.toLowerCase().trim();

  if (!normalized) return;

  await prisma.presence.upsert({
    where: { userName: normalized },
    update: { lastSeen: new Date() },
    create: { userName: normalized, lastSeen: new Date() },
  });
}

export async function getPresence(userNames: string[]): Promise<Record<string, Date | null>> {
  const records = await prisma.presence.findMany({
    where: { userName: { in: userNames.map((n) => n.toLowerCase().trim()) } },
  });

  const result: Record<string, Date | null> = {};
  for (const name of userNames) {
    const key = name.toLowerCase().trim();
    const record = records.find((r) => r.userName === key);
    result[name] = record?.lastSeen ?? null;
  }

  return result;
}
