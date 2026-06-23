"use server";

export type CloudinaryUsage = {
  storageUsed: number;
  storageLimit: number;
  bandwidthUsed: number;
  bandwidthLimit: number;
  plan: string;
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
    return {
      storageUsed: data.storage?.usage ?? 0,
      storageLimit: data.storage?.limit ?? 0,
      bandwidthUsed: data.bandwidth?.usage ?? 0,
      bandwidthLimit: data.bandwidth?.limit ?? 0,
      plan: data.plan ?? "Free",
    };
  } catch {
    return null;
  }
}
