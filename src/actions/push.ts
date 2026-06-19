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

export async function sendInactivityPush(
  targetAuthor: string,
  hours: number,
) {
  const messages: Record<number, string> = {
    3: "It's been 3 hours since I last saw you here. Come home.",
    5: "5 hours without you. The house feels empty.",
    7: "7 hours. Are you okay? Come home.",
    10: "10 hours. I miss you at home.",
    15: "15 hours. Please come home.",
    20: "20 hours. Our home is waiting for you.",
    24: "It's been a day. Come home now.",
  };

  const body = messages[hours] ?? `It's been ${hours} hours. Come home.`;
  return sendPushToAuthor(targetAuthor, "Missing You \u{1F49B}", body, "/home");
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

export async function testPush(author: string) {
  return sendPushToAuthor(author, "Test \u2705", "This is a test push from Solace. If you see this, push is working!", "/home");
}

export async function getSubscriptionCount(author: string) {
  const count = await prisma.pushSubscription.count({
    where: { author },
  });
  return count;
}
