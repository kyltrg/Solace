"use client";

import { useState, useEffect, useContext } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, BookOpen, UtensilsCrossed, Star, Music, Moon, Sun, LogOut, Sofa, BedDouble } from "lucide-react";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import SolaceIsland from "@/components/navigation/SolaceIsland";
import Sidebar from "@/components/layout/Sidebar";
import HamburgerMenuOverlay from "@/components/lightswind/HamburgerMenuOverlay";
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
    const style = document.createElement("style");
    style.id = "mobile-hamburger-hide";
    style.textContent = `@media (min-width: 768px) { #mobile-hamburger { display: none !important; } }`;
    document.head.appendChild(style);
    return () => { const el = document.getElementById("mobile-hamburger-hide"); if (el) el.remove(); };
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

      {/* Mobile hamburger toggle — always rendered, hidden on desktop via injected CSS */}
      <button
        id="mobile-hamburger"
        onClick={() => setMobileMenuOpen((v) => !v)}
        style={{
          position: "fixed",
          top: "32px",
          right: "20px",
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

      {/* Mobile: hamburger overlay */}
      {islandExpanded && isMobile && (
        <HamburgerMenuOverlay
          isOpen={mobileMenuOpen}
          onToggle={() => setMobileMenuOpen((v) => !v)}
          items={mobileMenuItems}
          hideToggleButton
          buttonTop="52px"
          buttonLeft="calc(100% - 48px)"
          buttonSize="sm"
          fontSize="2xl"
          enableBlur
          zIndex={9999}
          overlayBackground="var(--bg)"
          textColor="var(--text)"
          buttonClassName="border border-[var(--border)] bg-[var(--navbar-bg)] backdrop-blur-3xl text-[var(--muted)] shadow-lg"
        />
      )}
    </>
  );
}
