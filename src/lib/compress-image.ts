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

  let finalW = cropW;
  let finalH = cropH;
  if (Math.max(cropW, cropH) > maxDim) {
    const scale = maxDim / Math.max(cropW, cropH);
    finalW = Math.round(cropW * scale);
    finalH = Math.round(cropH * scale);
  }

  let canvas = drawToCanvas(source, sx, sy, cropW, cropH, finalW, finalH);

  if (source instanceof ImageBitmap) source.close();

  const fmt = supportsWebP() ? "image/webp" : "image/jpeg";

  let quality = 0.8;
  let blob: Blob;

  try {
    blob = await toBlobPromise(canvas, fmt, quality);
  } catch {
    blob = await toBlobPromise(canvas, "image/jpeg", quality);
  }

  let attempts = 0;
  while (blob.size > maxSizeBytes && finalW > 300 && finalH > 300 && attempts < 5) {
    attempts++;
    if (attempts <= 2) {
      quality = [0.7, 0.5][attempts - 1];
      try {
        blob = await toBlobPromise(canvas, blob.type, quality);
      } catch {
        break;
      }
    } else {
      finalW = Math.round(finalW * 0.8);
      finalH = Math.round(finalH * 0.8);
      const img = await loadImageViaElement(new File([blob], "temp"));
      const shrink = document.createElement("canvas");
      shrink.width = finalW;
      shrink.height = finalH;
      const ctx = shrink.getContext("2d")!;
      ctx.drawImage(img, 0, 0, finalW, finalH);
      try {
        blob = await toBlobPromise(shrink, blob.type, 0.5);
      } catch {
        break;
      }
    }
  }

  return blobToBase64(blob);
}
