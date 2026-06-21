"use client";

import { useState, useEffect, useContext } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, BookOpen, UtensilsCrossed, Star, Music, Moon, Sun, LogOut, Sofa, BedDouble } from "lucide-react";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import SolaceIsland from "@/components/navigation/SolaceIsland";
import Sidebar from "@/components/layout/Sidebar";
import HamburgerMenuOverlay from "@/components/lightswind/HamburgerMenuOverlay";
import { ThemeContext } from "@/context/ThemeContext";

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

  const navigateRoom = (href: string) => () => {
    window.dispatchEvent(new CustomEvent("solace-loading"));
    setTimeout(() => router.push(href), 80);
    setMobileMenuOpen(false);
  };

  const mobileMenuItems = [
    { label: `Welcome home, 
      ${user}` },
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
      {/* Desktop sidebar toggle — hidden on auth pages and loading screens */}
      {!isMobile && !isLoading && (
        <motion.button
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          onClick={() => setSidebarOpen(true)}
          className="fixed left-5 top-5 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--navbar-bg)] backdrop-blur-3xl text-[var(--muted)] shadow-[0_20px_80px_rgba(0,0,0,.45)] transition-all duration-300 hover:border-[var(--accent)]/30 hover:text-[var(--accent)]"
        >
          <Menu size={16} />
        </motion.button>
      )}

      <SolaceIsland
        isSidebarOpen={sidebarOpen}
        onExpandedChange={setIslandExpanded}
      />

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile: overlay */}
      {isMobile && islandExpanded && !isLoading && (
        <HamburgerMenuOverlay
          isOpen={mobileMenuOpen}
          onToggle={() => setMobileMenuOpen((v) => !v)}
          items={mobileMenuItems}
          buttonTop="52px"
          buttonLeft="calc(100% - 48px)"
          buttonSize="sm"
          fontSize="xl"
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
