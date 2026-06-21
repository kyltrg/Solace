"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavLink = {
  id: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  sectionId?: string;
};

interface SolaceIslandProps {
  links: NavLink[];
  isSidebarOpen?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}

export default function SolaceIsland({
  links,
  isSidebarOpen = false,
  onExpandedChange,
}: SolaceIslandProps): React.JSX.Element | null {
  const pathname = usePathname();
  const hideIsland = pathname === "/" || pathname === "/welcome" || pathname.startsWith("/letters/");
  const [expanded, setExpanded] = useState(false);
  const expandedRef = useRef(expanded);
  expandedRef.current = expanded;
  const navRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(links.length > 0 ? links[0].id : "");
  const activeRef = useRef(active);
  activeRef.current = active;
  const [hlPos, setHlPos] = useState({ x: 0, width: 0 });
  const blockScrollRef = useRef(false);

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

  const updateHighlightPosition = useCallback((id?: string) => {
    if (!navRef.current || !pillRef.current) return;
    const el = navRef.current.querySelector(`#si-item-${id || activeRef.current}`);
    if (!el) return;
    const elRect = el.getBoundingClientRect();
    const pillRect = pillRef.current.getBoundingClientRect();
    setHlPos({ x: elRect.left - pillRect.left, width: elRect.width });
  }, []);

  const handleLinkClick = (link: NavLink) => {
    if (link.onClick) link.onClick();
    const newId = link.id || "";
    if (newId !== active) setActive(newId);
    updateHighlightPosition(newId);
    blockScrollRef.current = true;
    setTimeout(() => { blockScrollRef.current = false; }, 1200);
  };

  useEffect(() => {
    if (pathname !== "/home") {
      setActive("");
      setHlPos({ x: 0, width: 0 });
    }
  }, [pathname]);

  useEffect(() => {
    if (!expanded) return;
    requestAnimationFrame(() => updateHighlightPosition());
  }, [expanded]);

  useEffect(() => {
    if (!expanded) return;
    updateHighlightPosition();
  }, [active, expanded]);

  useEffect(() => {
    if (!expanded || pathname !== "/home") return;

    const sectionOffsets = links
      .map((l) => {
        if (!l.sectionId) return null;
        const el = document.getElementById(l.sectionId);
        if (!el) return null;
        return { id: l.id, top: el.offsetTop, sectionId: l.sectionId };
      })
      .filter(Boolean) as { id: string; top: number; sectionId: string }[];

    if (sectionOffsets.length === 0) return;

    const handleScroll = () => {
      if (blockScrollRef.current) return;
      const scrollPos = window.scrollY + 90;
      let bestId = sectionOffsets[0].id;
      for (const s of sectionOffsets) {
        if (s.top <= scrollPos) {
          bestId = s.id;
        }
      }
      if (bestId !== activeRef.current) {
        setActive(bestId);
        requestAnimationFrame(() => updateHighlightPosition(bestId));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [expanded, links, pathname]);

  if (hideIsland) return null;

  return (
    <>
      {/* ─── MOBILE ─── */}
      <header
        className="fixed left-1/2 top-5 z-[85] md:hidden"
        style={{
          width: "calc(100vw - 32px)",
          clipPath: expanded
            ? "inset(0 round 9999px)"
            : "inset(0 calc(50% - 110px) round 9999px)",
          transition: "clip-path 0.16s cubic-bezier(0.22, 1, 0.36, 1)",
          willChange: "clip-path",
        }}
      >
        <div
          className={cn(
            "relative h-16 w-full overflow-hidden rounded-full border border-[var(--border)] bg-[var(--navbar-bg)] backdrop-blur shadow-md",
            "before:absolute before:inset-0 before:rounded-full before:pointer-events-none before:bg-gradient-to-b before:from-white/[0.12] before:via-white/[0.03] before:to-transparent after:absolute after:inset-0 after:rounded-full after:pointer-events-none after:shadow-[inset_0_1px_0_rgba(255,255,255,.08),inset_0_-1px_0_rgba(0,0,0,.08)]"
          )}
          style={{ transform: "translateZ(0)" }}
        >
          <motion.div
            animate={{
              left: expanded ? 16 : "50%",
              x: expanded ? 0 : "-50%",
              y: "-50%",
            }}
            transition={{ type: "tween", duration: 0.12, ease: [0.22, 1, 0.36, 1] }}
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
      </header>

      {/* ─── DESKTOP ─── */}
      <motion.header
        animate={{ width: expanded ? "740px" : "220px" }}
        transition={{ type: "spring", stiffness: 170, damping: 24 }}
        className={cn(
          "fixed left-1/2 top-5 z-[85] -translate-x-1/2 max-w-[calc(100vw-16px)] hidden md:block",
          isSidebarOpen && "blur-sm transition-all duration-300"
        )}
      >
        <div
          ref={pillRef}
          className={cn(
            "relative h-16 w-full overflow-hidden rounded-full border border-[var(--border)] bg-[var(--navbar-bg)] backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,.45)]",
            "before:absolute before:inset-0 before:rounded-full before:pointer-events-none before:bg-gradient-to-b before:from-white/[0.12] before:via-white/[0.03] before:to-transparent after:absolute after:inset-0 after:rounded-full after:pointer-events-none after:shadow-[inset_0_1px_0_rgba(255,255,255,.08),inset_0_-1px_0_rgba(0,0,0,.08)]"
          )}
          style={{ transform: "translateZ(0)" }}
        >
          {/* Highlight */}
          {expanded && active && (
            <motion.div
              ref={highlightRef}
              className="absolute inset-y-0 rounded-full z-0"
              animate={{ x: hlPos.x, width: hlPos.width }}
              transition={blockScrollRef.current
                ? { type: "tween", duration: 0.15, ease: "easeOut" }
                : { type: "spring", stiffness: 250, damping: 28 }
              }
              style={{
                left: 0,
                background: "linear-gradient(to bottom, color-mix(in srgb, var(--text) 22%, transparent), color-mix(in srgb, var(--text) 8%, transparent))",
                boxShadow: "inset 0 1px 0 color-mix(in srgb, var(--text) 12%, transparent)",
              }}
            />
          )}

          {/* Nav items */}
          {expanded && (
            <motion.nav
              ref={navRef}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, ease: "easeOut", delay: 0.12 }}
              className="absolute right-6 top-1/2 flex -translate-y-1/2 gap-1 whitespace-nowrap z-10"
              onMouseLeave={() => updateHighlightPosition()}
            >
              {links.map((link: any) => {
                const isActive = active === link.id;
                return (
                  <button
                    key={link.id}
                    id={`si-item-${link.id}`}
                    onClick={() => handleLinkClick(link)}
                    onMouseEnter={() => updateHighlightPosition(link.id)}
                    className={cn(
                      "relative text-sm transition duration-300 px-3 py-1.5 rounded-full",
                      isActive ? "text-[var(--text)] font-semibold" : "text-[var(--muted)] hover:text-[var(--text)]"
                    )}
                  >
                    {link.icon && <span className="inline mr-1">{link.icon}</span>}
                    {link.label || ""}
                  </button>
                );
              })}
            </motion.nav>
          )}

          {/* SOLACE logo */}
          <motion.div
            animate={{
              left: expanded ? 36 : 110,
              x: expanded ? 0 : "-50%",
              y: "-50%",
            }}
            transition={{ type: "spring", stiffness: 170, damping: 24 }}
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
      </motion.header>
    </>
  );
}
