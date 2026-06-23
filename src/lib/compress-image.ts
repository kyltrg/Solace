export type AspectRatio = "1:1" | "4:5";

export async function compressImage(
  file: File,
  aspectRatio: AspectRatio = "1:1",
  maxDim = 1080,
  maxSizeBytes = 1_048_576
): Promise<string> {
  const img = await createImageBitmap(file);

  // Center-crop to aspect ratio
  let cropW: number, cropH: number;
  if (aspectRatio === "1:1") {
    const size = Math.min(img.width, img.height);
    cropW = cropH = size;
  } else {
    const ratio = 4 / 5;
    if (img.width / img.height > ratio) {
      cropH = img.height;
      cropW = Math.round(img.height * ratio);
    } else {
      cropW = img.width;
      cropH = Math.round(img.width / ratio);
    }
  }

  const sx = Math.round((img.width - cropW) / 2);
  const sy = Math.round((img.height - cropH) / 2);

  // Resize so longest side fits maxDim
  let finalW = cropW;
  let finalH = cropH;
  if (Math.max(cropW, cropH) > maxDim) {
    const scale = maxDim / Math.max(cropW, cropH);
    finalW = Math.round(cropW * scale);
    finalH = Math.round(cropH * scale);
  }

  const canvas = document.createElement("canvas");
  canvas.width = finalW;
  canvas.height = finalH;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, sx, sy, cropW, cropH, 0, 0, finalW, finalH);
  img.close();

  const toBlob = (q: number): Promise<Blob> =>
    new Promise((r) => canvas.toBlob((b) => r(b!), "image/webp", q));

  let quality = 0.85;
  let blob = await toBlob(quality);

  if (blob.size > maxSizeBytes) {
    quality = 0.7;
    blob = await toBlob(quality);
  }
  if (blob.size > maxSizeBytes) {
    quality = 0.5;
    blob = await toBlob(quality);
  }

  while (blob.size > maxSizeBytes && finalW > 200 && finalH > 200) {
    finalW = Math.round(finalW * 0.8);
    finalH = Math.round(finalH * 0.8);
    canvas.width = finalW;
    canvas.height = finalH;
    const bmp = await createImageBitmap(blob);
    ctx.drawImage(bmp, 0, 0, finalW, finalH);
    bmp.close();
    blob = await toBlob(0.5);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
