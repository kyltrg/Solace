export type AspectRatio = "1:1" | "4:5";

function supportsWebP(): boolean {
  const canvas = document.createElement("canvas");
  return canvas.toBlob
    ? canvas.toBlob !== null
    : false;
}

function loadImageViaElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

function drawToCanvas(
  source: ImageBitmap | HTMLImageElement,
  sx: number,
  sy: number,
  sw: number,
  sh: number,
  dw: number,
  dh: number
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = dw;
  canvas.height = dh;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(source, sx, sy, sw, sh, 0, 0, dw, dh);
  return canvas;
}

function toBlobPromise(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error("toBlob returned null"));
      },
      type,
      quality
    );
  });
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function compressImage(
  file: File,
  aspectRatio: AspectRatio = "1:1",
  maxDim = 1080,
  maxSizeBytes = 1_048_576
): Promise<string> {
  // Try createImageBitmap (faster), fall back to <img> for iOS HEIC
  let source: ImageBitmap | HTMLImageElement;
  let width: number, height: number;

  try {
    const bmp = await createImageBitmap(file);
    width = bmp.width;
    height = bmp.height;
    source = bmp;
  } catch {
    const img = await loadImageViaElement(file);
    width = img.naturalWidth;
    height = img.naturalHeight;
    source = img;
  }

  // Center-crop to aspect ratio
  let cropW: number, cropH: number;
  if (aspectRatio === "1:1") {
    const size = Math.min(width, height);
    cropW = cropH = size;
  } else {
    const ratio = 4 / 5;
    if (width / height > ratio) {
      cropH = height;
      cropW = Math.round(height * ratio);
    } else {
      cropW = width;
      cropH = Math.round(width / ratio);
    }
  }

  const sx = Math.round((width - cropW) / 2);
  const sy = Math.round((height - cropH) / 2);

  // Resize so longest side fits maxDim
  let finalW = cropW;
  let finalH = cropH;
  if (Math.max(cropW, cropH) > maxDim) {
    const scale = maxDim / Math.max(cropW, cropH);
    finalW = Math.round(cropW * scale);
    finalH = Math.round(cropH * scale);
  }

  let canvas = drawToCanvas(source, sx, sy, cropW, cropH, finalW, finalH);

  if (source instanceof ImageBitmap) source.close();

  // Detect best output format
  const fmt = supportsWebP() ? "image/webp" : "image/jpeg";

  let quality = 0.85;
  let blob: Blob;

  try {
    blob = await toBlobPromise(canvas, fmt, quality);
  } catch {
    // Final fallback to JPEG
    blob = await toBlobPromise(canvas, "image/jpeg", quality);
  }

  if (blob.size > maxSizeBytes && quality > 0.5) {
    quality = 0.7;
    blob = await toBlobPromise(canvas, blob.type, quality);
  }
  if (blob.size > maxSizeBytes && quality > 0.3) {
    quality = 0.5;
    blob = await toBlobPromise(canvas, blob.type, quality);
  }

  // Shrink dimensions if still too big
  while (blob.size > maxSizeBytes && finalW > 200 && finalH > 200) {
    finalW = Math.round(finalW * 0.8);
    finalH = Math.round(finalH * 0.8);
    const img = await loadImageViaElement(new File([blob], "temp"));
    const shrink = document.createElement("canvas");
    shrink.width = finalW;
    shrink.height = finalH;
    const ctx = shrink.getContext("2d")!;
    ctx.drawImage(img, 0, 0, finalW, finalH);
    blob = await toBlobPromise(shrink, blob.type, 0.5);
  }

  return blobToBase64(blob);
}
