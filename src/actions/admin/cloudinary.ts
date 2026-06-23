"use server";

export type CloudinaryUsage = {
  storageUsed: number;
  bandwidthUsed: number;
  creditsUsed: number;
  creditsLimit: number;
  plan: string;
  resources: number;
};

export async function getCloudinaryUsage(): Promise<CloudinaryUsage | null> {
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!apiKey || !apiSecret || !cloudName) return null;

  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/usage`,
      { headers: { Authorization: `Basic ${auth}` } }
    );

    if (!res.ok) return null;

    const data = await res.json();
    const toNum = (v: unknown): number => {
      const n = Number(v);
      return Number.isFinite(n) ? Math.abs(n) : 0;
    };
    return {
      storageUsed: toNum(data.storage?.usage),
      bandwidthUsed: toNum(data.bandwidth?.usage),
      creditsUsed: toNum(data.credits?.usage),
      creditsLimit: toNum(data.credits?.limit),
      resources: toNum(data.resources),
      plan: data.plan ?? "Free",
    };
  } catch {
    return null;
  }
}
