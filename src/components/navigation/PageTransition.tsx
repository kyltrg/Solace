"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PageTransition(): React.JSX.Element {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const show = () => {
      setLoading(true);
      setTimeout(() => setLoading(false), 600);
    };
    window.addEventListener("solace-loading", show);
    return () => window.removeEventListener("solace-loading", show);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          exit={{ scaleX: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed top-0 left-0 right-0 z-[9999] h-[2px] origin-left bg-gradient-to-r from-[var(--accent)] to-[var(--accent-soft)]"
        />
      )}
    </AnimatePresence>
  );
}
