"use server";

import { prisma } from "@/lib/prisma";
import { sendPushToAuthor, sendRandomPush } from "@/actions/push";

const USERS = ["kyle", "angel"];
const OFFLINE_THRESHOLD_MS = 60 * 60 * 1000;

export async function runInactivityCheck() {
  const results: string[] = [];

  const today = new Date().toISOString().slice(0, 10);
  const now = Date.now();

  for (const userName of USERS) {
    const record = await prisma.presence.findUnique({
      where: { userName },
    });

    if (record) {
      const lastSeen = record.lastSeen.getTime();
      const elapsed = now - lastSeen;

      if (elapsed > OFFLINE_THRESHOLD_MS) {
        const hours = Math.floor(elapsed / 3600000);
        const notifyKey = `offline_${userName}_${today}`;
        const alreadySent = await prisma.notificationLog.findUnique({
          where: { type_key: { type: "offline", key: notifyKey } },
        });
        if (!alreadySent) {
          const otherName = userName === "kyle" ? "Angel" : "Kyle";
          const displayName = userName === "kyle" ? "Kyle" : "Angel";
          await sendPushToAuthor(
            otherName.toLowerCase(),
            `${displayName} hasn\u2019t been home for ${hours}h`,
            `${displayName} was last seen ${hours} hours ago. Open Solace.`,
            "/home",
          );
          await prisma.notificationLog.create({
            data: { type: "offline", key: notifyKey },
          });
          results.push(`Sent offline alert for ${userName} to ${otherName}`);
        }
      }
    }
  }

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
