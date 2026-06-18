"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const THIRTY_MINUTES = 30 * 60 * 1000;

export function InactivityTimer() {
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const resetTimer = () => {
      if (!Cookies.get("solace-access")) return;

      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        Cookies.remove("solace-access");
        router.push("/");
      }, THIRTY_MINUTES);
    };

    resetTimer();

    const events = ["mousedown", "keydown", "touchstart", "wheel"];
    for (const event of events) {
      window.addEventListener(event, resetTimer);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      for (const event of events) {
        window.removeEventListener(event, resetTimer);
      }
    };
  }, [router]);

  return null;
}
