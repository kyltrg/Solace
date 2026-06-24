const PFP_MAP: Record<string, string> = {
  kyle: "/assets/pfp/kyle.webp",
  angel: "/assets/pfp/angel.webp",
  direk: "/assets/pfp/direks.webp",
  "direk playlist": "/assets/pfp/direks.webp",
  "kyle's playlist": "/assets/pfp/kyle.webp",
  "angel's playlist": "/assets/pfp/angel.webp",
};

export function getPfp(userName: string | null | undefined): string | null {
  if (!userName) return null;
  const key = userName.toLowerCase();
  return PFP_MAP[key] ?? null;
}
