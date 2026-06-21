"use server";

import { prisma } from "@/lib/prisma";

export async function getPasscodes(): Promise<{ passcode: string; adminPasscode: string }> {
  const configs = await prisma.appConfig.findMany({
    where: { key: { in: ["passcode", "admin_passcode"] } },
  });

  const passcode = configs.find((c) => c.key === "passcode")?.value ?? "022426";
  const adminPasscode = configs.find((c) => c.key === "admin_passcode")?.value ?? "111805";

  return { passcode, adminPasscode };
}
