import { prisma } from "@/lib/prisma";
import { sendInactivityPush, sendRandomPush } from "@/actions/push";

const USERS = ["kyle", "angel"];
const MILESTONES = [5, 8, 12, 15, 20, 24];

export async function GET(request: Request) {
  const url = new URL(request.url);
  const authHeader = request.headers.get("authorization");
  const querySecret = url.searchParams.get("secret");
  const allowed = authHeader === `Bearer ${process.env.CRON_SECRET}` || querySecret === process.env.CRON_SECRET;
  if (!allowed) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const results: string[] = [];

  const records = await prisma.presence.findMany({
    where: { userName: { in: USERS } },
  });

  for (const user of USERS) {
    const record = records.find((r) => r.userName === user);
    if (!record) continue;

    const hoursSince = (now.getTime() - record.lastSeen.getTime()) / (1000 * 60 * 60);

    for (const h of MILESTONES) {
      if (hoursSince >= h) {
        const key = `inactivity_${h}h_${user}`;
        const existing = await prisma.notificationLog.findUnique({
          where: { type_key: { type: "inactivity", key } },
        });
        if (!existing) {
          const targetAuthor = user === "kyle" ? "angel" : "kyle";
          await sendInactivityPush(targetAuthor, h);
          await prisma.notificationLog.create({
            data: { type: "inactivity", key },
          });
          results.push(`Sent ${h}h inactivity push for ${user}`);
        }
      }
    }

    if (hoursSince >= 24) {
      const totalHours = Math.floor(hoursSince);
      for (let h = 36; h <= totalHours; h += 12) {
        const key = `inactivity_${h}h_${user}`;
        const existing = await prisma.notificationLog.findUnique({
          where: { type_key: { type: "inactivity", key } },
        });
        if (!existing) {
          const targetAuthor = user === "kyle" ? "angel" : "kyle";
          await sendInactivityPush(targetAuthor, h);
          await prisma.notificationLog.create({
            data: { type: "inactivity", key },
          });
          results.push(`Sent ${h}h inactivity push for ${user}`);
        }
      }
    }
  }

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

  return Response.json({ ok: true, results });
}
