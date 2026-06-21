"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SolaceIslandProps {
  isSidebarOpen?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}

export default function SolaceIsland({
  isSidebarOpen = false,
  onExpandedChange,
}: SolaceIslandProps): React.JSX.Element | null {
  const pathname = usePathname();
  const hideIsland = pathname === "/" || pathname === "/welcome" || pathname.startsWith("/letters/");
  const [expanded, setExpanded] = useState(false);
  const expandedRef = useRef(expanded);
  expandedRef.current = expanded;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const newExpanded = window.scrollY > 80;
      if (newExpanded !== expandedRef.current) {
        expandedRef.current = newExpanded;
        setExpanded(newExpanded);
        onExpandedChange?.(newExpanded);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [onExpandedChange]);

  if (hideIsland) return null;

  const headerClasses = cn(
    "fixed left-1/2 top-5 z-[85] -translate-x-1/2 max-w-[calc(100vw-16px)]",
    isSidebarOpen && "blur-sm transition-all duration-300"
  );

  const pillContent = (
    <div
      className={cn(
        "relative h-16 w-full overflow-hidden rounded-full border border-[var(--border)] bg-[var(--navbar-bg)]",
        isMobile
          ? "backdrop-blur shadow-md"
          : "backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,.45)]",
        "before:absolute before:inset-0 before:rounded-full before:pointer-events-none before:bg-gradient-to-b before:from-white/[0.12] before:via-white/[0.03] before:to-transparent after:absolute after:inset-0 after:rounded-full after:pointer-events-none after:shadow-[inset_0_1px_0_rgba(255,255,255,.08),inset_0_-1px_0_rgba(0,0,0,.08)]"
      )}
      style={{ transform: 'translateZ(0)' }}
    >
      <motion.div
        animate={{
          left: expanded ? (isMobile ? 16 : 36) : (isMobile ? "50%" : 110),
          x: expanded ? 0 : "-50%",
          y: "-50%",
        }}
        transition={isMobile
          ? { type: "tween", duration: 0.12, ease: [0.22, 1, 0.36, 1] }
          : { type: "spring", stiffness: 170, damping: 24 }
        }
        className="absolute top-1/2 z-20 pointer-events-none"
      >
        <Link
          href="/home"
          className="font-display text-lg tracking-[.35em] text-[var(--text)] whitespace-nowrap pointer-events-auto block"
        >
          SOLACE
        </Link>
      </motion.div>
    </div>
  );

  return isMobile ? (
    <header
      className={cn(
        "fixed left-1/2 top-5 z-[85]",
        isSidebarOpen && "blur-sm transition-all duration-300"
      )}
      style={{
        width: "calc(100vw - 32px)",
        transform: expanded
          ? "translateX(-50%) scaleX(1)"
          : "translateX(-50%) scaleX(0.45)",
        transformOrigin: "center",
        transition: "transform 0.16s cubic-bezier(0.22, 1, 0.36, 1)",
        willChange: "transform",
      }}
    >
      {pillContent}
    </header>
  ) : (
    <motion.header
      animate={{ width: expanded ? "740px" : "220px" }}
      transition={{ type: "spring", stiffness: 170, damping: 24 }}
      className={headerClasses}
    >
      {pillContent}
    </motion.header>
  );
}
