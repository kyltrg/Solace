"use client";

import { useEffect, useState } from "react";

export default function LetterReaderWrapper({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="fixed left-0 top-0 z-50 h-0.5 w-full bg-[var(--reading-room)]">
        <div
          className="h-full bg-[var(--text)]/30 transition-all duration-200"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {children}
    </>
  );
}
