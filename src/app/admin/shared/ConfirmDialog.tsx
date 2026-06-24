"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

type ConfirmDialogProps = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
};

export default function ConfirmDialog({ open, onConfirm, onCancel, loading }: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 cursor-pointer"
          onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="relative w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-6 shadow-2xl text-center"
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-400/10">
              <AlertTriangle size={24} className="text-red-400" />
            </div>
            <h4 className="font-display text-lg mb-2">Are you sure you want to remove this?</h4>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              Once it&apos;s gone, this piece of your story will be permanently erased and cannot be brought back.
            </p>
            <div className="mt-6 flex gap-3 justify-center">
              <button
                onClick={onCancel}
                disabled={loading}
                className="rounded-full border border-[var(--border)] px-6 py-2 text-xs text-[var(--muted)] hover:bg-[var(--border)]/20 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="rounded-full bg-red-500/20 px-6 py-2 text-xs text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="h-3 w-3 rounded-full border border-red-400 border-t-transparent animate-spin" />
                    Removing...
                  </>
                ) : (
                  "Yes, remove it"
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
