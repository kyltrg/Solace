"use client";

import { useRef, useState, useEffect, useLayoutEffect, useCallback, type ReactNode } from "react";

export type AspectRatioOption = "1:1" | "4:5";

export type CropState = {
  scale: number;
  offsetX: number;
  offsetY: number;
};

type ImageCropperProps = {
  src: string;
  aspectRatio: AspectRatioOption;
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
  crop,
  onChange,
  children,
}: ImageCropperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(300);
  const [isDragging, setIsDragging] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; ox: number; oy: number } | null>(null);
  const pinchRef = useRef<{ dist: number; scale: number } | null>(null);
  const dragTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const cropRef = useRef(crop);
  cropRef.current = crop;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const natRRef = useRef(1);

  const [fitDims, setFitDims] = useState({ w: 0, h: 0 });

  // --- Dynamic sizing: always square (1:1) ---
  const calcHeight = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const w = el.clientWidth;
    if (w === 0) return;
    setContainerHeight(Math.round(w));
  }, []);

  // Load image to get natural aspect ratio
  useEffect(() => {
    natRRef.current = 1;
    setImgLoaded(false);
    const img = new Image();
    img.onload = () => {
      natRRef.current = img.naturalWidth / img.naturalHeight;
      setImgLoaded(true);
    };
    img.onerror = () => { natRRef.current = 1; setImgLoaded(true); };
    img.src = src;
  }, [src]);

  useLayoutEffect(() => { calcHeight(); }, [calcHeight]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(calcHeight);
    ro.observe(el);
    return () => ro.disconnect();
  }, [calcHeight]);

  // Compute fit-size: image covers the container (like object-cover)
  useEffect(() => {
    if (!imgLoaded) return;
    const el = containerRef.current;
    if (!el) return;
    const w = el.clientWidth;
    const h = el.clientHeight;
    if (w === 0 || h === 0) return;

    const natR = natRRef.current;
    const contR = w / h;
    let fitW: number, fitH: number;
    if (natR > contR) {
      fitW = natR * h;
      fitH = h;
    } else {
      fitW = w;
      fitH = w / natR;
    }
    setFitDims({ w: fitW, h: fitH });
  }, [imgLoaded, containerHeight]);

  // Clamp offsets given current scale
  const clampOffsets = useCallback((scale: number, ox: number, oy: number) => {
    const el = containerRef.current;
    if (!el) return { offsetX: ox, offsetY: oy };
    const cw = el.clientWidth;
    const ch = el.clientHeight;
    const { w: fw, h: fh } = fitDims;
    if (fw === 0 || fh === 0) return { offsetX: ox, offsetY: oy };

    const s = scale;
    const maxX = Math.max(0, (fw * s - cw) / 2);
    const maxY = Math.max(0, (fh * s - ch) / 2);
    return {
      offsetX: clamp(ox, -maxX, maxX),
      offsetY: clamp(oy, -maxY, maxY),
    };
  }, [fitDims]);

  const prevScaleRef = useRef(crop.scale);

  // Reclamp offsets when scale changes externally
  useEffect(() => {
    const prev = prevScaleRef.current;
    prevScaleRef.current = crop.scale;
    if (prev === crop.scale) return;
    if (fitDims.w === 0) return;

    const clamped = clampOffsets(crop.scale, crop.offsetX, crop.offsetY);
    if (clamped.offsetX !== crop.offsetX || clamped.offsetY !== crop.offsetY) {
      onChange({ ...crop, ...clamped });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crop.scale]);

  // --- Native event listeners for reliable touch/wheel handling ---
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updatePos = (patch: Partial<CropState>) => {
      const prev = cropRef.current;
      const next = { ...prev, ...patch };
      const clamped = clampOffsets(next.scale, next.offsetX, next.offsetY);
      next.offsetX = clamped.offsetX;
      next.offsetY = clamped.offsetY;
      onChangeRef.current(next);
    };

    // --- Mouse drag ---
    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      dragRef.current = { startX: e.clientX, startY: e.clientY, ox: cropRef.current.offsetX, oy: cropRef.current.offsetY };
      const onMove = (ev: MouseEvent) => {
        if (!dragRef.current) return;
        const dx = ev.clientX - dragRef.current.startX;
        const dy = ev.clientY - dragRef.current.startY;
        updatePos({ offsetX: dragRef.current.ox + dx, offsetY: dragRef.current.oy + dy });
      };
      const onUp = () => {
        setIsDragging(false);
        dragRef.current = null;
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    };

    // --- Touch drag ---
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        setIsDragging(true);
        const t = e.touches[0];
        dragRef.current = { startX: t.clientX, startY: t.clientY, ox: cropRef.current.offsetX, oy: cropRef.current.offsetY };
      } else if (e.touches.length === 2) {
        setIsDragging(true);
        dragRef.current = null;
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        pinchRef.current = {
          dist: Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY),
          scale: cropRef.current.scale,
        };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && dragRef.current) {
        const t = e.touches[0];
        const dx = t.clientX - dragRef.current.startX;
        const dy = t.clientY - dragRef.current.startY;
        updatePos({ offsetX: dragRef.current.ox + dx, offsetY: dragRef.current.oy + dy });
      } else if (e.touches.length === 2 && pinchRef.current) {
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
        const ratio = dist / pinchRef.current.dist;
        updatePos({ scale: clamp(pinchRef.current.scale * ratio, 1, 5) });
      }
    };

    const onTouchEnd = () => {
      setIsDragging(false);
      dragRef.current = null;
      pinchRef.current = null;
    };

    // --- Wheel zoom ---
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setIsDragging(true);
      clearTimeout(dragTimeoutRef.current);
      dragTimeoutRef.current = setTimeout(() => {
        setIsDragging(false);
      }, 300);
      const delta = e.deltaY > 0 ? 0.92 : 1.08;
      updatePos({ scale: clamp(cropRef.current.scale * delta, 1, 5) });
    };

    el.addEventListener("mousedown", onMouseDown);
    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("wheel", onWheel);
    };
  }, [clampOffsets]);

  const { w: fitW, h: fitH } = fitDims;
  const cw = containerHeight;

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-2xl bg-[var(--bg-soft)] ring-1 ring-[var(--border)] select-none self-center"
      style={{ width: "100%", height: containerHeight, touchAction: "none" }}
    >
      <div
        className="absolute"
        style={{
          width: fitW || "100%",
          height: fitH || "100%",
          left: fitW ? `calc(50% - ${fitW / 2}px)` : 0,
          top: fitH ? `calc(50% - ${fitH / 2}px)` : 0,
          transform: `translate(${crop.offsetX}px, ${crop.offsetY}px) scale(${crop.scale})`,
          transformOrigin: "center center",
        }}
      >
        {src && (
          <img
            src={src}
            alt=""
            draggable={false}
            className="pointer-events-none"
            style={{ width: "100%", height: "100%" }}
          />
        )}
      </div>

      {/* 3x3 Rule-of-thirds grid — visible while dragging/zooming */}
      {isDragging && (
        <div className="pointer-events-none absolute inset-0 z-10">
          <div className="absolute left-1/3 top-0 h-full w-px bg-white/30" />
          <div className="absolute left-2/3 top-0 h-full w-px bg-white/30" />
          <div className="absolute top-1/3 left-0 h-px w-full bg-white/30" />
          <div className="absolute top-2/3 left-0 h-px w-full bg-white/30" />
        </div>
      )}

      {children}
    </div>
  );
}
