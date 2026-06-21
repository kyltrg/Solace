"use client";

import { useState, useEffect, useContext, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, BookOpen, UtensilsCrossed, Star, Music, Moon, Sun, LogOut, Sofa, BedDouble } from "lucide-react";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import SolaceIsland from "@/components/navigation/SolaceIsland";
import Sidebar from "@/components/layout/Sidebar";
import { ThemeContext } from "@/context/ThemeContext";

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) { el.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
}

function navigateAndScroll(router: ReturnType<typeof useRouter>, path: string, id: string) {
  if (window.location.pathname !== path) {
    window.dispatchEvent(new CustomEvent("solace-loading"));
    setTimeout(() => router.push(path), 100);
    const check = setInterval(() => {
      const el = document.getElementById(id);
      if (el) { el.scrollIntoView({ behavior: "smooth", block: "start" }); clearInterval(check); }
    }, 100);
    setTimeout(() => clearInterval(check), 5000);
  } else {
    scrollTo(id);
  }
}

export default function ClientShell() {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [islandExpanded, setIslandExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const ctx = useContext(ThemeContext);
  const theme = ctx?.theme ?? "dark";
  const toggleTheme = ctx?.toggleTheme ?? (() => {});
  const isAuth = pathname === "/" || pathname === "/welcome";

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [isMobile]);

  useEffect(() => {
    if (isAuth) { setSidebarOpen(false); setMobileMenuOpen(false); }
  }, [isAuth]);

  useEffect(() => {
    const showLoading = () => {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 1200);
    };
    window.addEventListener("solace-loading", showLoading);
    return () => window.removeEventListener("solace-loading", showLoading);
  }, []);

  useEffect(() => {
    if (!islandExpanded && mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [islandExpanded]);

  if (isAuth) return null;

  const user = Cookies.get("solace-user") || "there";

  const handleLogout = () => {
    Cookies.remove("solace-access");
    Cookies.remove("solace-user");
    setMobileMenuOpen(false);
    setSidebarOpen(false);
    window.dispatchEvent(new CustomEvent("solace-loading"));
    setTimeout(() => router.push("/"), 80);
  };

  const navLinks = [
    { id: "our-time", label: "Our Time", sectionId: "relationship-timer", onClick: () => navigateAndScroll(router, "/home", "relationship-timer") },
    { id: "our-story", label: "Our Story", sectionId: "story-of-us", onClick: () => navigateAndScroll(router, "/home", "story-of-us") },
    { id: "our-moments", label: "Our Moments", sectionId: "memory-of-day", onClick: () => navigateAndScroll(router, "/home", "memory-of-day") },
    { id: "our-notes", label: "Our Notes", sectionId: "sticky-notes", onClick: () => navigateAndScroll(router, "/home", "sticky-notes") },
    { id: "our-rooms", label: "Our Rooms", sectionId: "rooms", onClick: () => navigateAndScroll(router, "/home", "rooms") },
  ];

  const navigateRoom = (href: string) => () => {
    window.dispatchEvent(new CustomEvent("solace-loading"));
    setTimeout(() => router.push(href), 80);
    setMobileMenuOpen(false);
  };

  const mobileMenuItems = [
    { label: "Welcome home," + user },
    { divider: true },
    { label: "Living Room", icon: <Sofa size={20} />, onClick: navigateRoom("/when-you-need-me") },
    { label: "Study Room", icon: <BookOpen size={20} />, onClick: navigateRoom("/letters") },
    { label: "Kitchen", icon: <UtensilsCrossed size={20} />, onClick: navigateRoom("/dates") },
    { label: "Balcony", icon: <Star size={20} />, onClick: navigateRoom("/plans") },
    { label: "Music Room", icon: <Music size={20} />, onClick: navigateRoom("/songs") },
    { label: "Bedroom", icon: <BedDouble size={20} />, onClick: navigateRoom("/tonight") },
    { divider: true },
    { label: theme === "dark" ? "Light Mode" : "Dark Mode", icon: theme === "dark" ? <Sun size={20} /> : <Moon size={20} />, onClick: () => { toggleTheme(); setMobileMenuOpen(false); } },
    { label: "Log out", icon: <LogOut size={20} />, onClick: handleLogout },
  ];

  return (
    <>
      {/* Desktop sidebar toggle */}
      {!isLoading && (
        <motion.button
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          onClick={() => setSidebarOpen(true)}
          className="fixed left-5 top-5 z-[86] hidden md:flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--navbar-bg)] backdrop-blur-3xl text-[var(--muted)] shadow-[0_20px_80px_rgba(0,0,0,.45)] transition-all duration-300 hover:border-[var(--accent)]/30 hover:text-[var(--accent)]"
        >
          <Menu size={16} />
        </motion.button>
      )}

      <SolaceIsland
        links={navLinks}
        isSidebarOpen={sidebarOpen}
        onExpandedChange={setIslandExpanded}
      />

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Hide hamburger on desktop */}
      <style>{`@media (min-width: 768px) { #mobile-hamburger { display: none !important; } }`}</style>

      {/* Mobile hamburger toggle — floating, outside island */}
      <button
        id="mobile-hamburger"
        onClick={() => setMobileMenuOpen((v) => !v)}
        style={{
          position: "fixed",
          top: "34px",
          right: "30px",
          zIndex: 999999,
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          border: "1px solid var(--border)",
          background: "var(--navbar-bg)",
          color: "var(--muted)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          boxShadow: "0 4px 20px rgba(0,0,0,.45)",
        }}
        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={mobileMenuOpen}
      >
        {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile: hamburger overlay — direct render */}
      {isMobile && mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            background: "var(--bg)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.75rem",
              padding: "2rem",
              width: "100%",
              maxWidth: "400px",
            }}
          >
            {mobileMenuItems.map((item, i) =>
              item.divider ? (
                <hr key={`div-${i}`} style={{
                  width: "60%",
                  border: "none",
                  height: "1px",
                  background: "var(--border)",
                  opacity: 0.3,
                  margin: "0.5rem 0",
                }} />
              ) : (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.2 }}
                  onClick={() => {
                    item.onClick?.();
                    if (item.label !== "Welcome home," + user) setMobileMenuOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.75rem",
                    width: "100%",
                    padding: i === 0 ? "0.5rem 0" : "0.65rem 0",
                    border: "none",
                    background: "transparent",
                    color: i === 0 ? "var(--text)" : "var(--text)",
                    fontSize: i === 0 ? "1rem" : "1.625rem",
                    fontFamily: i === 0 ? "inherit" : "var(--font-display, inherit)",
                    fontWeight: i === 0 ? 400 : 500,
                    cursor: i === 0 ? "default" : "pointer",
                    letterSpacing: "0.02em",
                    pointerEvents: i === 0 ? "none" : "auto",
                  }}
                >
                  {item.icon && (
                    <span style={{ opacity: 0.25, display: "flex" }}>{item.icon}</span>
                  )}
                  {i === 0 ? (
                    <div style={{ textAlign: "center" }}>
                      <div style={{ opacity: 0.6, fontSize: "0.85rem" }}>Welcome home,</div>
                      <div style={{
                        fontFamily: "var(--font-accent, Georgia, serif)",
                        fontSize: "1.2rem",
                        marginTop: "0.15rem",
                      }}>{user}</div>
                    </div>
                  ) : (
                    item.label
                  )}
                </motion.button>
              )
            )}
          </div>
        </motion.div>
      )}
    </>
  );
}
