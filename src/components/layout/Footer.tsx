"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname === "/" || pathname === "/welcome") return null;

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="relative z-10 border-t border-[var(--border)] px-6 py-8"
    >
      <div className="mx-auto max-w-6xl flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
        <p className="text-xs tracking-[0.2em] uppercase text-[var(--muted)]/50">
          Solace
        </p>
        <p className="text-[11px] text-[var(--muted)]/40">
          Kyle &amp; Angel &mdash; Made with love for us
        </p>
      </div>
    </motion.footer>
  );
}
