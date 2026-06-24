"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";



export async function verifyPasscode(
  
  code: string,
  isAdmin: boolean,
): Promise<{ ok: boolean }> {
  const key = isAdmin ? "admin_passcode" : "passcode";

  console.log("=== VERIFY PASSCODE ===");
  console.log({
    code,
    isAdmin,
    key,
  });

  const config = await prisma.appConfig.findUnique({ where: { key } });
  
  if (!config) {
    console.log("CONFIG NOT FOUND:", key);
    return { ok: false };
  }

  console.log({
    configKey: config.key,
    configValue: config.value,
  });

  const isHash = config.value.startsWith("$2");

  const match = isHash
    ? bcrypt.compareSync(code, config.value)
    : code === config.value;

  console.log({
    isHash,
    match,
  });
  if (!match) return { ok: false };

  if (!isHash) {
    await prisma.appConfig.update({
      where: { key },
      data: { value: bcrypt.hashSync(code, 10) },
    });
  }

  const token = crypto.randomUUID();
  const cookieStore = await cookies();

  cookieStore.set("solace-access", token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 365 * 24 * 60 * 60,
    path: "/",
  });

  if (isAdmin) {
    cookieStore.set("solace-admin", "true", {
      httpOnly: false,
      sameSite: "lax",
      maxAge: 365 * 24 * 60 * 60,
      path: "/",
    });
  }

  return { ok: true };
}
