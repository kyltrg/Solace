"use server";

import { prisma } from "@/lib/prisma";
import webpush from "web-push";

webpush.setVapidDetails(
  "mailto:hello@solace.app",
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
  const subs = await prisma.pushSubscription.findMany({
    where: { author: targetAuthor },
  });

  if (subs.length === 0) return { ok: true, sent: 0 };

  const toDelete: string[] = [];
  let sentCount = 0;

  for (const sub of subs) {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        },
        JSON.stringify({ title, body, url }),
      );
      sentCount++;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[push] send failed for ${sub.author} (${sub.endpoint.slice(0, 40)}...): ${msg}`);
      if (msg.includes("410") || msg.includes("Gone") || msg.includes("expired") || msg.includes("unregistered")) {
        toDelete.push(sub.id);
      }
    }
  }

  if (toDelete.length > 0) {
    await prisma.pushSubscription.deleteMany({
      where: { id: { in: toDelete } },
    });
    console.error(`[push] cleaned up ${toDelete.length} expired subscriptions for ${targetAuthor}`);
  }

  return { ok: true, sent: sentCount };
}

function getOtherName(userName: string): string {
  return userName.toLowerCase().trim() === "kyle" ? "Angel" : "Kyle";
}

const ACTIVE_THRESHOLD_MS = 180000;

export async function notifyOnline(userName: string): Promise<{ notified: boolean }> {
  const normalized = userName.toLowerCase().trim();
  if (!normalized || normalized === "admin") return { notified: false };

  const record = await prisma.presence.findUnique({
    where: { userName: normalized },
  });

  const now = Date.now();
  const lastSeen = record?.lastSeen ? record.lastSeen.getTime() : 0;
  const isNewSession = !record || (now - lastSeen) > ACTIVE_THRESHOLD_MS;

  if (!isNewSession) return { notified: false };

  const otherName = getOtherName(normalized);
  const displayName = normalized === "kyle" ? "Kyle" : "Angel";
  const lTitles = [`${displayName} is at home`, `${displayName} just arrived home`, `${displayName} is here`];
  const lBodies = ["Come home now \u{1F60A}", "Join them at home \u{1F60A}", "See you at home \u{1F60A}"];

  await sendPushToAuthor(
    otherName,
    lTitles[Math.floor(Math.random() * lTitles.length)],
    lBodies[Math.floor(Math.random() * lBodies.length)],
    "/home",
  );

  return { notified: true };
}

const RANDOM_MESSAGES = [
  { title: "Read a Letter \u{1F4EC}", body: "Want to read a letter? Open Solace now." },
  { title: "Sticky Note \u{1F4AD}", body: "Someone might have left you a sticky note. Come home." },
  { title: "Our Songs \u{1F3B5}", body: "Want to listen to our songs? Open Solace." },
  { title: "Plan a Date \u{1F48D}", body: "Plan your next date? Come home." },
  { title: "Tonight \u{1F31F}", body: "How was your day? Write in Tonight. Open Solace." },
  { title: "Our Story \u{1F4D6}", body: "Read our story again. Open Solace." },
  { title: "Dreams \u{2728}", body: "Check our dreams board. Open Solace." },
  { title: "Come Home \u{1F3E0}", body: "Your home is waiting for you. Come home now." },
  { title: "Explore \u{1F453}", body: "Want to visit the rooms? Open Solace." },
  { title: "Plans & Dreams \u{1F3AF}", body: "Check our plans and dreams. Open Solace." },
];

export async function sendRandomPush(targetAuthor: string) {
  const msg = RANDOM_MESSAGES[Math.floor(Math.random() * RANDOM_MESSAGES.length)];
  return sendPushToAuthor(targetAuthor, msg.title, msg.body, "/home");
}
