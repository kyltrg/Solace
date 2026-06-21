"use client";

import { useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { Home, BookOpen, UtensilsCrossed, Star, Music, Moon, Sun, LogOut, Sofa, BedDouble } from "lucide-react";
import { ThemeContext } from "@/context/ThemeContext";

const ROOM_LINKS = [
  { label: "Living Room", href: "/when-you-need-me", icon: <Sofa size={18} /> },
  { label: "Study Room", href: "/letters", icon: <BookOpen size={18} /> },
  { label: "Kitchen", href: "/dates", icon: <UtensilsCrossed size={18} /> },
  { label: "Balcony", href: "/plans", icon: <Star size={18} /> },
  { label: "Music Room", href: "/songs", icon: <Music size={18} /> },
  { label: "Bedroom", href: "/tonight", icon: <BedDouble size={18} /> },
];

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const ctx = useContext(ThemeContext);
  const theme = ctx?.theme ?? "dark";
  const toggleTheme = ctx?.toggleTheme ?? (() => {});
  const user = typeof window !== "undefined" ? Cookies.get("solace-user") || "there" : "there";

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const handleLogout = () => {
    Cookies.remove("solace-access");
    Cookies.remove("solace-user");
    onClose();
    window.dispatchEvent(new CustomEvent("solace-loading"));
    setTimeout(() => router.push("/"), 80);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 200, damping: 28 }}
            className="fixed left-0 top-0 z-[95] flex h-full w-72 flex-col border-r border-[var(--border)] bg-[var(--bg)] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-5">
              <div>
                <p className="text-[10px] uppercase tracking-[.3em] text-[var(--accent)]/60">Welcome home,</p>
                <p className="mt-1 font-display text-xl text-[var(--text)]">{user}</p>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              {ROOM_LINKS.map((room) => {
                const isActive = pathname === room.href || pathname.startsWith(room.href + "/");
                return (
                  <button
                    key={room.href}
                    onClick={() => { window.dispatchEvent(new CustomEvent("solace-loading")); setTimeout(() => router.push(room.href), 80); onClose(); }}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-[var(--accent)]/10 text-[var(--accent)] font-medium"
                        : "text-[var(--muted)] hover:bg-[var(--accent)]/5 hover:text-[var(--text)]"
                    }`}
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)]/5">
                      {room.icon}
                    </span>
                    {room.label}
                  </button>
                );
              })}
            </nav>

            <div className="border-t border-[var(--border)] px-3 py-4 space-y-1">
              <button
                onClick={toggleTheme}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-[var(--muted)] transition-all duration-200 hover:bg-[var(--accent)]/5 hover:text-[var(--text)]"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)]/5">
                  {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                </span>
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </button>

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-400/70 transition-all duration-200 hover:bg-red-400/5 hover:text-red-400"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-400/5">
                  <LogOut size={16} />
                </span>
                Log out
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
