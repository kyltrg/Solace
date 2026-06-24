import { prisma } from "@/lib/prisma";

const HISTORY_KEY = "daily_verse_history";
const REPEAT_GAP = 15;

async function getHistory(): Promise<string[]> {
  const row = await prisma.appConfig.findUnique({ where: { key: HISTORY_KEY } });
  if (!row?.value) return [];
  try {
    const parsed = JSON.parse(row.value);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

async function saveHistory(ids: string[]): Promise<void> {
  const kept = ids.slice(-REPEAT_GAP);
  await prisma.appConfig.upsert({
    where: { key: HISTORY_KEY },
    update: { value: JSON.stringify(kept) },
    create: { key: HISTORY_KEY, value: JSON.stringify(kept) },
  });
}

function formatVerse(content: string, source: string | null): string {
  return source && !content.trim().endsWith(` — ${source}`)
    ? `${content} — ${source}`
    : content;
}

export async function pickRandomVerse(): Promise<{
  id: string;
  content: string;
  formatted: string;
} | null> {
  const total = await prisma.verse.count();
  if (total === 0) return null;

  const history = await getHistory();
  const excludeIds = new Set(history);

  if (excludeIds.size >= total) {
    const kept = history.slice(-1);
    await saveHistory(kept);
    excludeIds.clear();
    kept.forEach((id) => excludeIds.add(id));
  }

  const available = await prisma.verse.findMany({
    where: { id: { notIn: Array.from(excludeIds) } },
  });

  if (available.length === 0) return null;

  const pick = available[Math.floor(Math.random() * available.length)];
  await saveHistory([...history, pick.id]);

  return {
    id: pick.id,
    content: pick.content,
    formatted: formatVerse(pick.content, pick.source),
  };
}
