import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const authHeader = request.headers.get("authorization");
  const querySecret = url.searchParams.get("secret");
  const allowed = authHeader === `Bearer ${process.env.CRON_SECRET}` || querySecret === process.env.CRON_SECRET;
  if (!allowed) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const count = await prisma.verse.count();
    if (count === 0) {
      return Response.json({ ok: true, rotated: false, reason: "No verses" });
    }

    const skip = Math.floor(Math.random() * count);
    const verse = await prisma.verse.findFirst({ skip, take: 1 });
    if (!verse) {
      return Response.json({ ok: true, rotated: false, reason: "No verse found" });
    }

    const today = new Date().toISOString().slice(0, 10);
    await prisma.appConfig.upsert({
      where: { key: "daily_verse" },
      update: { value: verse.content },
      create: { key: "daily_verse", value: verse.content },
    });
    await prisma.appConfig.upsert({
      where: { key: "daily_verse_date" },
      update: { value: today },
      create: { key: "daily_verse_date", value: today },
    });

    return Response.json({ ok: true, rotated: true, verse: verse.content });
  } catch (err) {
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
