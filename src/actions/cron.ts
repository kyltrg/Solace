"use server";

import { prisma } from "@/lib/prisma";
import { sendRandomPush } from "@/actions/push";

const USERS = ["kyle", "angel"];

export async function runInactivityCheck() {
  const results: string[] = [];

  const today = new Date().toISOString().slice(0, 10);
  const randomKey = `random_${today}`;
  const randomSent = await prisma.notificationLog.findUnique({
    where: { type_key: { type: "random", key: randomKey } },
  });
  if (!randomSent) {
    const targetAuthor = USERS[Math.floor(Math.random() * USERS.length)];
    await sendRandomPush(targetAuthor);
    await prisma.notificationLog.create({
      data: { type: "random", key: randomKey },
    });
    results.push(`Sent random push to ${targetAuthor}`);
  }

  return { ok: true, results };
}
