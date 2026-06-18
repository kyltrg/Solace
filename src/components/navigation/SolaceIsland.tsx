"use client";

import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type RoomLink = {
  label: string;
  href: string;
};

const ROOMS: RoomLink[] = [
  { label: "Home", href: "/home" },
  { label: "Story", href: "/our-story" },
  { label: "Letters", href: "/letters" },
  { label: "Dates", href: "/dates" },
  { label: "Dreams", href: "/plans" },
  { label: "Songs", href: "/songs" },
];

export default function SolaceIsland(): React.JSX.Element | null {
  const pathname = usePathname();
  const hideIsland = pathname === "/" || pathname === "/welcome" || pathname.startsWith("/letters/");
  const { scrollY } = useScroll();
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useMotionValueEvent(scrollY, "change", (value) => {
    setExpanded(value > 80);
  });

  if (hideIsland) return null;

  return (
    <motion.header
      animate={{ width: expanded ? (isMobile ? "calc(100vw - 32px)" : "740px") : (isMobile ? "180px" : "220px") }}
      transition={{ type: "spring", stiffness: 170, damping: 24 }}
      className="fixed left-1/2 top-5 z-[100] -translate-x-1/2 max-w-[calc(100vw-16px)]"
    >
      <div className="relative h-16 w-full overflow-hidden rounded-full border border-[var(--border)] bg-[var(--navbar-bg)] backdrop-blur-3xl shadow-[0_20px_80px_rgba(0,0,0,.45)]">
        <motion.div
          animate={{ x: expanded ? (isMobile ? -70 : -140) : 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 26, mass: 0.7 }}
          className="absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 items-center"
        >
          <Link href="/home" className="font-display text-lg tracking-[.35em] text-[var(--text)] whitespace-nowrap">
            SOLACE
          </Link>
        </motion.div>

        <motion.nav
          animate={{ opacity: expanded && !isMobile ? 1 : 0, x: expanded ? 0 : 40 }}
          transition={{ duration: .35, ease: "easeOut", delay: expanded ? .12 : 0 }}
          className="absolute right-6 top-1/2 flex -translate-y-1/2 gap-5 whitespace-nowrap"
        >
          {ROOMS.map((room) => {
            const isActive = pathname === room.href || pathname.startsWith(room.href + "/");
            return (
              <Link
                key={room.href}
                href={room.href}
                className={`relative text-sm transition duration-300 ${
                  isActive ? "text-[var(--text)]" : "text-[var(--muted)] hover:text-[var(--text)]"
                }`}
              >
                {room.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute -bottom-1 left-1/2 h-px w-4 -translate-x-1/2 bg-[var(--accent)]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </motion.nav>
      </div>
    </motion.header>
  );
}
