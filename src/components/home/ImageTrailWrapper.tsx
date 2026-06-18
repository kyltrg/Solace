"use client";

import { ImageTrail } from "@/components/ui/image-trail";

const images = Array.from({ length: 13 }, (_, i) => `/assets/our-story/image${String(i + 1).padStart(2, "0")}.jpg`);

export function ImageTrailWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 z-20">
        <ImageTrail
          images={images}
          imageWidth={160}
          imageHeight={160}
          threshold={40}
          duration={1.4}
        />
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
