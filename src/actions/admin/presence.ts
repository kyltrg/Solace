"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const val = cookieStore.get("solace-admin")?.value;
  return val === "true" || val?.length === 36;
}

export type UserStatus = {
  userName: string;
  lastSeen: string;
  isOnline: boolean;
  offlineHours: number;
};

export async function getUserStatuses(): Promise<UserStatus[]> {
  if (!(await isAdmin())) return [];

  const users = await prisma.presence.findMany({
    where: { userName: { in: ["angel", "kyle"] } },
  });

  const now = Date.now();
  const OFFLINE_THRESHOLD = 45 * 1000;

  return users.map((u) => {
    const lastSeen = u.lastSeen.getTime();
    const isOnline = now - lastSeen < OFFLINE_THRESHOLD;
    const offlineHours = Math.round((now - lastSeen) / (1000 * 60 * 60) * 10) / 10;
    return {
      userName: u.userName,
      lastSeen: u.lastSeen.toISOString(),
      isOnline,
      offlineHours,
    };
  });
}
