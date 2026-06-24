"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { pickRandomVerse } from "@/lib/verse";

async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const val = cookieStore.get("solace-admin")?.value;
  return val === "true" || val?.length === 36;
}

export async function setRandomDailyVerse(): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAdmin())) return { ok: false, error: "Unauthorized" };

  try {
    const pick = await pickRandomVerse();
    if (!pick) return { ok: false, error: "No verses in collection." };

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

    revalidatePath("/home");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: "Failed to set random verse." };
  }
}

export async function getAppConfig(): Promise<Record<string, string>> {
  try {
    const rows = await prisma.appConfig.findMany({
      where: { key: { notIn: ["passcode", "admin_passcode"] } },
    });
    const map: Record<string, string> = {};
    for (const r of rows) map[r.key] = r.value;
    return map;
  } catch {
    return {};
  }
}

export async function updatePasscodes(
  userPasscode: string,
  adminPasscode: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAdmin())) return { ok: false, error: "Unauthorized" };

  if (userPasscode.length !== 6 || adminPasscode.length !== 6) {
    return { ok: false, error: "Passcodes must be 6 digits." };
  }

  try {
    await prisma.appConfig.upsert({
      where: { key: "passcode" },
      update: { value: bcrypt.hashSync(userPasscode, 10) },
      create: { key: "passcode", value: bcrypt.hashSync(userPasscode, 10) },
    });
    await prisma.appConfig.upsert({
      where: { key: "admin_passcode" },
      update: { value: bcrypt.hashSync(adminPasscode, 10) },
      create: { key: "admin_passcode", value: bcrypt.hashSync(adminPasscode, 10) },
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to update passcodes." };
  }
}

export async function updateDailyVerse(verse: string): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAdmin())) return { ok: false, error: "Unauthorized" };

  if (!verse.trim()) {
    return { ok: false, error: "Verse cannot be empty." };
  }

  try {
    await prisma.appConfig.upsert({
      where: { key: "daily_verse" },
      update: { value: verse },
      create: { key: "daily_verse", value: verse },
    });
    revalidatePath("/home");
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to update daily verse." };
  }
}

export type StorageInfo = {
  usedBytes: number;
  usedFormatted: string;
  overallBytes: number;
  overallFormatted: string;
  availableBytes: number;
  availableFormatted: string;
  tables: { name: string; rows: number; size: string }[];
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export async function getStorageStats(): Promise<StorageInfo> {
  if (!(await isAdmin())) return { usedBytes: 0, usedFormatted: "—", overallBytes: 0, overallFormatted: "—", availableBytes: 0, availableFormatted: "—", tables: [] };

  try {
    const dbResult = await prisma.$queryRawUnsafe<{ bytes: bigint }[]>(
      `SELECT pg_database_size(current_database()) as bytes`,
    );
    const usedBytes = Number(dbResult[0]?.bytes ?? 0);

    const config = await prisma.appConfig.findUnique({ where: { key: "storage_limit" } });
    const overallBytes = config ? Number(config.value) : 500 * 1024 * 1024;
    const availableBytes = Math.max(0, overallBytes - usedBytes);

    const tableNames = [
      "Letter", "ComfortMessage", "StoryChapter", "Song",
      "DateMemory", "DatePlan", "Dream", "Presence",
      "PushSubscription", "NotificationLog", "StickyNote",
      "TonightEntry", "AppConfig", "Verse",
    ];

    const tables: StorageInfo["tables"] = [];

    for (const name of tableNames) {
      try {
        const [countResult, sizeResult] = await Promise.all([
          prisma.$queryRawUnsafe<{ count: bigint }[]>(`SELECT COUNT(*) as count FROM "${name}"`),
          prisma.$queryRawUnsafe<{ bytes: bigint | null }[]>(`SELECT pg_total_relation_size('"${name}"') as bytes`),
        ]);
        const count = Number(countResult[0]?.count ?? 0);
        const bytes = Number(sizeResult[0]?.bytes ?? 0);
        tables.push({ name, rows: count, size: formatBytes(bytes) });
      } catch {
        tables.push({ name, rows: 0, size: "—" });
      }
    }

    return {
      usedBytes,
      usedFormatted: formatBytes(usedBytes),
      overallBytes,
      overallFormatted: formatBytes(overallBytes),
      availableBytes,
      availableFormatted: formatBytes(availableBytes),
      tables,
    };
  } catch {
    return { usedBytes: 0, usedFormatted: "—", overallBytes: 0, overallFormatted: "—", availableBytes: 0, availableFormatted: "—", tables: [] };
  }
}
