"use client";

import { useEffect, useCallback, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { imageTransformStyle, getResponsiveUrl, type ImageSet, type CropData } from "@/lib/images";

type ImageLightboxProps = {
  imageSet: ImageSet;
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

function useViewportWidth() {
  const [width, setWidth] = useState(800);
  useEffect(() => {
    setWidth(window.innerWidth);
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return width;
}

export default function ImageLightbox({
  imageSet,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: ImageLightboxProps) {
  const vw = useViewportWidth();
  const crop = imageSet.crops?.[currentIndex] as CropData | undefined;
  const imgStyle = imageTransformStyle(crop ?? null);
  const [loaded, setLoaded] = useState<Record<number, boolean>>({});

  const lightboxWidth = useMemo(() => Math.min(1400, Math.max(vw * (vw < 768 ? 1.5 : 2), 600)), [vw]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    },
    [onClose, onPrev, onNext]
  );

  useEffect(() => {
    const el = document.documentElement;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "contain";
    el.style.overflow = "hidden";
    el.style.overscrollBehavior = "contain";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      document.body.style.overscrollBehavior = "";
      el.style.overflow = "";
      el.style.overscrollBehavior = "";
    };
  }, [handleKeyDown]);

  useEffect(() => {
    setLoaded({});
  }, [currentIndex]);

  useEffect(() => {
    const adjacent = [
      currentIndex === 0 ? imageSet.urls.length - 1 : currentIndex - 1,
      currentIndex === imageSet.urls.length - 1 ? 0 : currentIndex + 1,
    ];
    for (const idx of adjacent) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = getResponsiveUrl(imageSet.urls[idx], lightboxWidth);
      document.head.appendChild(link);
      setTimeout(() => link.remove(), 5000);
    }
  }, [currentIndex, imageSet.urls, lightboxWidth]);

  return (
    typeof document !== "undefined" && createPortal(
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[9999999] flex items-center justify-center bg-black/95 cursor-pointer"
          onClick={onClose}
        >
        {/* Top bar */}
        <div className="fixed left-0 right-0 top-0 z-20 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent px-4 py-4">
          <div className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/60 backdrop-blur-sm">
            {currentIndex + 1} / {imageSet.urls.length}
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white/80 backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {imageSet.urls.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); onPrev(); }}
              className="fixed left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white/80 backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white shadow-lg"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onNext(); }}
              className="fixed right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white/80 backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white shadow-lg"
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}

        <motion.img
          key={currentIndex}
          src={getResponsiveUrl(imageSet.urls[currentIndex], lightboxWidth)}
          alt=""
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: loaded[currentIndex] ? 1 : 0.3, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="max-h-[90dvh] md:max-h-[95dvh] max-w-full md:max-w-[95vw] rounded-2xl object-contain shadow-2xl"
          style={imgStyle as React.CSSProperties}
          onClick={(e) => e.stopPropagation()}
          onLoad={() => setLoaded((s) => ({ ...s, [currentIndex]: true }))}
        />

        {!loaded[currentIndex] && (
          <div className="absolute inset-0 z-0 flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center">
              <ImageIcon size={24} className="text-white/20" />
            </div>
          </div>
        )}
      </motion.div>
      </AnimatePresence>,
      document.body
    )
  );
}
