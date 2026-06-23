"use client";

import { useRef, useCallback, type ReactNode, type WheelEvent } from "react";

export type AspectRatioOption = "1:1" | "4:5" | "free";

export type CropState = {
  scale: number;
  offsetX: number;
  offsetY: number;
};

type ImageCropperProps = {
  src: string;
  aspectRatio: AspectRatioOption;
  naturalRatio?: number;
  crop: CropState;
  onChange: (crop: CropState) => void;
  children?: ReactNode;
};

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

export default function ImageCropper({
  src,
  aspectRatio,
  naturalRatio,
  crop,
  onChange,
  children,
}: ImageCropperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; ox: number; oy: number } | null>(null);
  const pinchRef = useRef<{ dist: number; scale: number } | null>(null);

  const maxOffset = (dim: number) => (dim * (crop.scale - 1)) / 2;

  const updateCrop = useCallback(
    (patch: Partial<CropState>) => {
      const next = { ...crop, ...patch };
      const cont = containerRef.current;
      if (cont) {
        const w = cont.clientWidth;
        const h = cont.clientHeight;
        next.offsetX = clamp(next.offsetX, -maxOffset(w), maxOffset(w));
        next.offsetY = clamp(next.offsetY, -maxOffset(h), maxOffset(h));
      }
      onChange(next);
    },
    [crop, onChange]
  );

  // --- Mouse drag ---
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    dragRef.current = { startX: e.clientX, startY: e.clientY, ox: crop.offsetX, oy: crop.offsetY };
    const handleMove = (ev: globalThis.MouseEvent) => {
      if (!dragRef.current) return;
      const dx = ev.clientX - dragRef.current.startX;
      const dy = ev.clientY - dragRef.current.startY;
      updateCrop({ offsetX: dragRef.current.ox + dx, offsetY: dragRef.current.oy + dy });
    };
    const handleUp = () => {
      dragRef.current = null;
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  };

  // --- Touch drag ---
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const t = e.touches[0];
      dragRef.current = { startX: t.clientX, startY: t.clientY, ox: crop.offsetX, oy: crop.offsetY };
    } else if (e.touches.length === 2) {
      dragRef.current = null;
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      pinchRef.current = {
        dist: Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY),
        scale: crop.scale,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && dragRef.current) {
      const t = e.touches[0];
      const dx = t.clientX - dragRef.current.startX;
      const dy = t.clientY - dragRef.current.startY;
      updateCrop({ offsetX: dragRef.current.ox + dx, offsetY: dragRef.current.oy + dy });
    } else if (e.touches.length === 2 && pinchRef.current) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      const ratio = dist / pinchRef.current.dist;
      updateCrop({ scale: clamp(pinchRef.current.scale * ratio, 1, 5) });
    }
  };

  const handleTouchEnd = () => {
    dragRef.current = null;
    pinchRef.current = null;
  };

  // --- Scroll wheel zoom ---
  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.92 : 1.08;
    updateCrop({ scale: clamp(crop.scale * delta, 1, 5) });
  };

  // --- Container aspect ratio ---
  const containerStyle: React.CSSProperties =
    aspectRatio === "1:1"
      ? { aspectRatio: "1 / 1", maxHeight: "55dvh" }
      : aspectRatio === "4:5"
        ? { aspectRatio: "4 / 5", maxHeight: "60dvh" }
        : naturalRatio
          ? { aspectRatio: `${naturalRatio}`, maxHeight: "60dvh" }
          : { aspectRatio: "4 / 3", maxHeight: "55dvh" };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-2xl bg-[var(--bg-soft)] ring-1 ring-[var(--border)] select-none self-center"
      style={containerStyle}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      <img
        src={src}
        alt=""
        draggable={false}
        className="pointer-events-none h-full w-full object-cover"
        style={{
          transform: `translate(${crop.offsetX}px, ${crop.offsetY}px) scale(${crop.scale})`,
          transformOrigin: "center center",
        }}
      />
      {children}
    </div>
  );
}
