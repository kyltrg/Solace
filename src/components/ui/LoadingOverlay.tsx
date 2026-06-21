"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Home } from "lucide-react";

export default function LoadingOverlay({
  phrase,
  visible,
}: {
  phrase: string;
  visible: boolean;
}) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[var(--bg)]/80 backdrop-blur-sm"
        >
          <div className="flex flex-col items-center gap-6">
            <div className="relative flex h-16 w-16 items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-[var(--accent)]/20" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="absolute inset-0 rounded-full border-t-2 border-[var(--accent)]"
              />
              <Home size={24} className="text-[var(--accent)]" />
            </div>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="font-display text-lg text-[var(--text)]/70 tracking-wide"
            >
              {phrase}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
