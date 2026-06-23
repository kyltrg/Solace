"use client";

import { useState, useRef } from "react";
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
  const clickTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const preventClick = useRef(false);

  if (images.length === 0) return null;

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  const triggerBurst = () => {
    setBurst(true);
    setTimeout(() => setBurst(false), 600);
    onDoubleTap?.();
  };

  const handleImageClick = () => {
    if (preventClick.current) {
      preventClick.current = false;
      return;
    }
    clickTimer.current = setTimeout(() => {
      onImageClick(current);
    }, 250);
  };

  const handleImageDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (clickTimer.current) clearTimeout(clickTimer.current);
    preventClick.current = true;
    triggerBurst();
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[var(--bg-soft)]">
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
            onClick={handleImageClick}
            onDoubleClick={handleImageDoubleClick}
            style={{ touchAction: "manipulation" }}
            onLoad={(e) => {
              const img = e.currentTarget;
              if (img.naturalWidth && img.naturalHeight) {
                setNaturalRatio(img.naturalWidth / img.naturalHeight);
              }
            }}
          />
        </AnimatePresence>

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
                    filter: "drop-shadow(0 0 24px rgba(239,68,68,0.6))",
                  }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white/80 backdrop-blur-sm transition-all hover:bg-black/60 hover:text-white"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white/80 backdrop-blur-sm transition-all hover:bg-black/60 hover:text-white"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === current ? "w-5 bg-white" : "w-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
