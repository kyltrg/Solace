import { prisma } from "@/lib/prisma";
import { pickRandomVerse } from "@/lib/verse";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const authHeader = request.headers.get("authorization");
  const querySecret = url.searchParams.get("secret");
  const allowed = authHeader === `Bearer ${process.env.CRON_SECRET}` || querySecret === process.env.CRON_SECRET;
  if (!allowed) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const pick = await pickRandomVerse();
    if (!pick) {
      return Response.json({ ok: true, rotated: false, reason: "No verses" });
    }

    const today = new Date().toISOString().slice(0, 10);
    await prisma.appConfig.upsert({
      where: { key: "daily_verse" },
      update: { value: pick.formatted },
      create: { key: "daily_verse", value: pick.formatted },
    });
    await prisma.appConfig.upsert({
      where: { key: "daily_verse_date" },
      update: { value: today },
      create: { key: "daily_verse_date", value: today },
    });

    return Response.json({ ok: true, rotated: true, verse: pick.formatted });
  } catch (err) {
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
