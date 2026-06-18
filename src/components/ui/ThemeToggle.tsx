"use client";

import { useContext } from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { ThemeContext } from "@/context/ThemeContext";
import { usePathname } from "next/navigation";

export default function ThemeToggle() {
  const pathname = usePathname();
  const ctx = useContext(ThemeContext);
  const theme = ctx?.theme ?? "dark";
  const toggleTheme = ctx?.toggleTheme ?? (() => {});

  if (pathname === "/" || pathname === "/welcome") return null;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
      onClick={toggleTheme}
      className="fixed top-6 max-sm:top-8 right-6 z-[100] flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--navbar-bg)] text-[var(--muted)] shadow-lg backdrop-blur-2xl transition-all duration-300 hover:scale-110 hover:text-[var(--text)]"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </motion.button>
  );
}
