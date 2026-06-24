export type CropData = {
  ar: "1:1" | "4:5";
  s: number;
  x: number;
  y: number;
};

export type ImageSet = {
  urls: string[];
  crops: (CropData | null)[];
};

export function optimizeCloudinaryUrl(url: string): string {
  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    return url.replace("/upload/", "/upload/f_webp,q_auto/");
  }
  return url;
}

export function getResponsiveUrl(url: string, width: number): string {
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
  const uploadMarker = "/upload/";
  const idx = url.indexOf(uploadMarker);
  const before = url.substring(0, idx + uploadMarker.length);
  const after = url.substring(idx + uploadMarker.length);
  if (after.startsWith("f_webp")) {
    return before + `w_${width},` + after;
  }
  return before + `w_${width},f_webp,q_auto/` + after;
}

export function parseImages(images: string | null): ImageSet {
  if (!images) return { urls: [], crops: [] };
  try {
    const parsed = JSON.parse(images);
    if (parsed && typeof parsed === "object" && "urls" in parsed) {
      return {
        urls: Array.isArray(parsed.urls) ? parsed.urls.map(optimizeCloudinaryUrl) : [],
        crops: Array.isArray(parsed.crops) ? parsed.crops : [],
      };
    }
    if (Array.isArray(parsed)) {
      return { urls: parsed.map(optimizeCloudinaryUrl), crops: [] };
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
