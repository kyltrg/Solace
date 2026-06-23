"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type ImageLightboxProps = {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export default function ImageLightbox({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: ImageLightboxProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    },
    [onClose, onPrev, onNext]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[999] flex items-center justify-center bg-black/95 px-4"
        onClick={onClose}
      >
        <button
          onClick={onClose}
          className="fixed right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white/90 backdrop-blur-sm transition-all hover:bg-black/80 hover:text-white shadow-lg"
        >
          <X size={22} />
        </button>

        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); onPrev(); }}
              className="fixed left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-black/50 text-white/90 backdrop-blur-sm transition-all hover:bg-black/70 hover:text-white shadow-lg"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onNext(); }}
              className="fixed right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-black/50 text-white/90 backdrop-blur-sm transition-all hover:bg-black/70 hover:text-white shadow-lg"
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}

        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt=""
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.25 }}
          className="max-h-[80dvh] max-w-full rounded-xl object-contain"
          onClick={(e) => e.stopPropagation()}
        />

        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-10 rounded-full bg-black/50 px-4 py-1.5 text-sm text-white/80 backdrop-blur-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
