"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, Maximize2 } from "lucide-react";

type ImageCarouselProps = {
  images: string[];
  onImageClick: (index: number) => void;
  onDoubleTap?: () => void;
  liked?: boolean;
};

export default function ImageCarousel({
  images,
  onImageClick,
  onDoubleTap,
  liked,
}: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [burst, setBurst] = useState(false);
  const [naturalRatio, setNaturalRatio] = useState<number>(4 / 3);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const touchMoved = useRef(false);

  if (images.length === 0) return null;

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  const triggerBurst = useCallback(() => {
    setBurst(true);
    setTimeout(() => setBurst(false), 600);
    onDoubleTap?.();
  }, [onDoubleTap]);

  const handleTouchStart = () => {
    touchMoved.current = false;
    longPressTimer.current = setTimeout(() => {
      onImageClick(current);
    }, 500);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = undefined;
    }
  };

  const handleTouchMove = () => {
    touchMoved.current = true;
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = undefined;
    }
  };

  const handleImageDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    triggerBurst();
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-[var(--bg-soft)] ring-1 ring-[var(--border)]">
      <div className="relative w-full select-none" style={{ aspectRatio: naturalRatio }}>
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={images[current]}
            alt=""
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="h-full w-full object-cover"
            draggable={false}
            onDoubleClick={handleImageDoubleClick}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
            style={{ touchAction: "manipulation" }}
            onLoad={(e) => {
              const img = e.currentTarget;
              if (img.naturalWidth && img.naturalHeight) {
                setNaturalRatio(img.naturalWidth / img.naturalHeight);
              }
            }}
          />
        </AnimatePresence>

        {/* Expand button */}
        <button
          onClick={(e) => { e.stopPropagation(); onImageClick(current); }}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-xl bg-black/50 text-white/90 backdrop-blur-sm transition-all hover:bg-black/70 hover:text-white active:scale-90 md:opacity-0 md:group-hover:opacity-100 shadow-lg"
        >
          <Maximize2 size={14} />
        </button>

        {/* Heart burst */}
        <AnimatePresence>
          {burst && (
            <motion.div
              key="burst"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.5 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <motion.div
                initial={{ scale: 0.5, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 12 }}
              >
                <Heart
                  size={80}
                  className={liked ? "fill-red-500 text-red-500" : "fill-white text-white"}
                  style={{
                    filter: liked
                      ? "drop-shadow(0 0 30px rgba(239,68,68,0.6))"
                      : "drop-shadow(0 0 24px rgba(255,255,255,0.3))",
                  }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-black/40 text-white/80 backdrop-blur-sm transition-all hover:bg-black/60 hover:text-white opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-black/40 text-white/80 backdrop-blur-sm transition-all hover:bg-black/60 hover:text-white opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === current ? "w-6 bg-white shadow-[0_0_6px_rgba(255,255,255,0.3)]" : "w-1.5 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
