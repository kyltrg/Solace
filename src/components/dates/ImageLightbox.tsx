"use client";

import { useEffect, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Home } from "lucide-react";
import { imageTransformStyle, type ImageSet, type CropData } from "@/lib/images";

type ImageLightboxProps = {
  imageSet: ImageSet;
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export default function ImageLightbox({
  imageSet,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: ImageLightboxProps) {
  const crop = imageSet.crops?.[currentIndex] as CropData | undefined;
  const imgStyle = imageTransformStyle(crop ?? null);
  const [imgLoaded, setImgLoaded] = useState(false);

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

  return (
    typeof document !== "undefined" && createPortal(
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999999] flex items-center justify-center bg-black/95"
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

        {!imgLoaded && (
          <div className="flex items-center justify-center">
            <div className="relative flex h-16 w-16 items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-white/20" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="absolute inset-0 rounded-full border-t-2 border-white"
              />
              <Home size={24} className="text-white/60" />
            </div>
          </div>
        )}
        <motion.img
          key={currentIndex}
          src={imageSet.urls[currentIndex]}
          alt=""
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.25 }}
          className="max-h-[90dvh] md:max-h-[95dvh] max-w-full md:max-w-[95vw] rounded-2xl object-contain shadow-2xl"
          style={{ ...imgStyle, display: imgLoaded ? undefined : "none" } as React.CSSProperties}
          onClick={(e) => e.stopPropagation()}
          onLoad={() => setImgLoaded(true)}
        />
      </motion.div>
      </AnimatePresence>,
      document.body
    )
  );
}
