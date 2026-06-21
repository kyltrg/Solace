"use client";

import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
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

type MobileLink = {
  id: string;
  label?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  sectionId?: string;
};

interface SolaceIslandProps {
  links: NavLink[];
  mobileLinks?: MobileLink[];
  isSidebarOpen?: boolean;
  onHamburgerClick?: () => void;
  isHamburgerOpen?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}

export default function SolaceIsland({
  links,
  mobileLinks,
  isSidebarOpen = false,
  onHamburgerClick,
  isHamburgerOpen = false,
  onExpandedChange,
}: SolaceIslandProps): React.JSX.Element | null {
  const pathname = usePathname();
  const hideIsland = pathname === "/" || pathname === "/welcome" || pathname.startsWith("/letters/");
  const { scrollY } = useScroll();
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const highlightRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(links.length > 0 ? links[0].id : "");
  const activeRef = useRef(active);
  activeRef.current = active;
  const [hlPos, setHlPos] = useState({ x: 0, width: 0 });
  const blockScrollRef = useRef(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useMotionValueEvent(scrollY, "change", (value) => {
    const newExpanded = value > 80;
    if (newExpanded !== expanded) {
      setExpanded(newExpanded);
      onExpandedChange?.(newExpanded);
    }
  });

  const visibleLinks = expanded && isMobile && mobileLinks ? mobileLinks : expanded ? links : [];

  const updateHighlightPosition = useCallback((id?: string) => {
    if (!navRef.current || !pillRef.current) return;
    const el = navRef.current.querySelector(`#si-item-${id || activeRef.current}`);
    if (!el) return;
    const elRect = el.getBoundingClientRect();
    const pillRect = pillRef.current.getBoundingClientRect();
    setHlPos({ x: elRect.left - pillRect.left, width: elRect.width });
  }, []);

  const handleLinkClick = (link: NavLink | MobileLink) => {
    if (link.onClick) link.onClick();
    const newId = (link as NavLink).id || "";
    if (newId !== active) setActive(newId);
    // Update highlight immediately so user sees it move before any scroll event interferes
    updateHighlightPosition(newId);
    // Block scroll-based detection from overriding during the smooth scroll that follows
    blockScrollRef.current = true;
    setTimeout(() => { blockScrollRef.current = false; }, 1200);
  };

  // Reset active/highlight when leaving /home — no oval on room pages
  useEffect(() => {
    if (pathname !== "/home") {
      setActive("");
      setHlPos({ x: 0, width: 0 });
    }
  }, [pathname]);

  // On expansion, wait for nav entry animation to settle before measuring highlight
  useEffect(() => {
    if (!expanded) return;
    const timer = setTimeout(() => updateHighlightPosition(), 500);
    return () => clearTimeout(timer);
  }, [expanded]);

  // On active change or expand, measure highlight position
  useEffect(() => {
    if (!expanded) return;
    updateHighlightPosition();
  }, [active, expanded]);

  // Scroll-based active section detection
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
    <motion.header
      animate={{
        width: expanded
          ? (isMobile ? "calc(100vw - 32px)" : "740px")
          : (isMobile ? "220px" : "220px"),
      }}
      transition={isMobile
        ? { type: "tween", duration: 0.3, ease: [0.22, 1, 0.36, 1] }
        : { type: "spring", stiffness: 170, damping: 24 }
      }
      className={cn(
        "fixed left-1/2 top-5 z-[85] -translate-x-1/2 max-w-[calc(100vw-16px)]",
        isSidebarOpen && "blur-sm transition-all duration-300"
      )}
    >
      <div
        ref={pillRef}
        className={cn(
          "relative h-16 w-full rounded-full border border-[var(--border)] bg-[var(--navbar-bg)] shadow-[0_20px_80px_rgba(0,0,0,.45)]",
          isMobile
            ? "bg-[var(--navbar-bg)]"
            : "overflow-hidden backdrop-blur-2xl before:absolute before:inset-0 before:rounded-full before:pointer-events-none before:bg-gradient-to-b before:from-white/[0.12] before:via-white/[0.03] before:to-transparent after:absolute after:inset-0 after:rounded-full after:pointer-events-none after:shadow-[inset_0_1px_0_rgba(255,255,255,.08),inset_0_-1px_0_rgba(0,0,0,.08)]"
        )}
        style={{ transform: 'translateZ(0)' }}
      >
        {/* Sliding highlight (desktop only) — tween on click, spring on scroll */}
        {expanded && !isMobile && active && (
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

        {/* Nav links (desktop expanded) */}
        {expanded && !isMobile && (
          <motion.nav
            ref={navRef}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, ease: "easeOut", delay: 0.12 }}
            className="absolute right-6 top-1/2 flex -translate-y-1/2 gap-1 whitespace-nowrap z-10"
            onMouseLeave={() => updateHighlightPosition()}
          >
            {visibleLinks.map((link: any) => {
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

        {/* SOLACE logo — pixel left + x animation, no layout/parent-width dependency */}
        <motion.div
          animate={{
            left: expanded ? (isMobile ? 16 : 36) : 110,
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

        {/* Mobile expanded: nav links — delayed entry so SOLACE clears first */}
        {expanded && isMobile && (
          <motion.nav
            ref={navRef}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.2 }}
            className="absolute right-16 top-1/2 flex -translate-y-1/2 gap-0.5 z-10"
            onMouseLeave={() => updateHighlightPosition()}
          >
            {visibleLinks.map((link: any) => {
              const isActive = active === link.id;
              return (
                <button
                  key={link.id}
                  id={`si-item-${link.id}`}
                  onClick={() => handleLinkClick(link)}
                  onMouseEnter={() => updateHighlightPosition(link.id)}
                  className={cn(
                    "relative text-[0.65rem] transition duration-300 px-1.5 py-0.5 rounded-full whitespace-nowrap",
                    isActive ? "text-[var(--text)] font-semibold" : "text-[var(--muted)] hover:text-[var(--text)]"
                  )}
                >
                  {link.icon && <span className="inline mr-0.5">{link.icon}</span>}
                  {link.label || ""}
                </button>
              );
            })}
          </motion.nav>
        )}
      </div>
    </motion.header>
  );
}
