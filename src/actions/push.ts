"use server";

import { prisma } from "@/lib/prisma";

const webpush = require("web-push");

webpush.setVapidDetails(
  "mailto:kyle@solace.app",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

export async function subscribePush(
  endpoint: string,
  p256dh: string,
  auth: string,
  author: string,
) {
  try {
    const existing = await prisma.pushSubscription.findUnique({
      where: { endpoint },
    });
    if (existing) return { ok: true };
    await prisma.pushSubscription.create({
      data: { endpoint, p256dh, auth, author },
    });
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

export async function unsubscribePush(endpoint: string) {
  try {
    await prisma.pushSubscription.deleteMany({ where: { endpoint } });
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

export async function sendPushToAuthor(
  targetAuthor: string,
  title: string,
  body: string,
  url?: string,
) {
  try {
    const subs = await prisma.pushSubscription.findMany({
      where: { author: targetAuthor },
    });
    const results = await Promise.allSettled(
      subs.map((sub) =>
        webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          JSON.stringify({ title, body, url }),
        ),
      ),
    );
    return { ok: true, sent: results.filter((r) => r.status === "fulfilled").length };
  } catch {
    return { ok: false, sent: 0 };
  }
}
