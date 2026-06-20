"use client";

import { useEffect, useRef } from "react";
import { runInactivityCheck } from "@/actions/cron";

const POLL_INTERVAL_MS = 60 * 1000;

export function InactivityScheduler() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    runInactivityCheck();

    intervalRef.current = setInterval(() => {
      runInactivityCheck();
    }, POLL_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return null;
}
