export type CropData = {
  ar: "1:1" | "4:5" | "free";
  s: number;
  x: number;
  y: number;
};

export type ImageSet = {
  urls: string[];
  crops: (CropData | null)[];
};

export function parseImages(images: string | null): ImageSet {
  if (!images) return { urls: [], crops: [] };
  try {
    const parsed = JSON.parse(images);
    // New format: { v: 2, urls: string[], crops: [...] }
    if (parsed && typeof parsed === "object" && "urls" in parsed) {
      return {
        urls: Array.isArray(parsed.urls) ? parsed.urls : [],
        crops: Array.isArray(parsed.crops) ? parsed.crops : [],
      };
    }
    // Old format: string[]
    if (Array.isArray(parsed)) {
      return { urls: parsed, crops: [] };
    }
  } catch {}
  return { urls: [], crops: [] };
}

export function imageTransformStyle(crop: CropData | null): React.CSSProperties {
  if (!crop || (crop.s === 1 && crop.x === 0 && crop.y === 0)) return {};
  return {
    transform: `translate(${crop.x}px, ${crop.y}px) scale(${crop.s})`,
    transformOrigin: "center center",
  };
}
