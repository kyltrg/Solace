"use client";

import { useEffect, useRef } from "react";
import { runInactivityCheck } from "@/actions/cron";

const CHECK_INTERVAL_MS = 60 * 60 * 1000;

export function InactivityScheduler() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    runInactivityCheck();

    intervalRef.current = setInterval(() => {
      runInactivityCheck();
    }, CHECK_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return null;
}
