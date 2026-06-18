"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import { getPresence } from "@/actions/presence";

const POLL_MS = 10000;
const DISPLAY_DURATION_MS = 6000;
const ACTIVE_THRESHOLD_MS = 120000;

type OtherStatus = "active" | "recent" | "offline" | null;

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);

  if (mins < 1) return "just now";
  if (mins === 1) return "1 min";
  if (hrs < 1) return `${mins} mins`;
  if (hrs === 1) return "1 hr";
  return `${hrs} hrs`;
}

function getOtherName(myName: string): string {
  return myName === "Kyle" ? "Angel" : "Kyle";
}

function shouldShowNotification(
  current: OtherStatus,
  previous: OtherStatus,
  justMounted: boolean,
): boolean {
  if (justMounted) return true;
  if (previous === null) return false;
  return current !== previous;
}

export default function PresenceNotification() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [myName, setMyName] = useState<string | null>(null);
  const prevRef = useRef<OtherStatus>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const name = Cookies.get("solace-user") ?? null;
    setMyName(name);
  }, []);

  useEffect(() => {
    if (!myName) return;

    const other = getOtherName(myName);
    let justMounted = true;

    const check = async () => {
      try {
        const result = await getPresence([other, myName]);
        const otherDate = result[other] ? new Date(result[other]) : null;
        const myDate = result[myName] ? new Date(result[myName]) : null;

        const now = Date.now();
        const otherActive = otherDate && (now - otherDate.getTime()) < ACTIVE_THRESHOLD_MS;
        const meActive = myDate && (now - myDate.getTime()) < ACTIVE_THRESHOLD_MS;

        let status: OtherStatus;
        let msg: string;

        if (!otherDate) {
          status = "offline";
          msg = "";
        } else if (otherActive) {
          status = "active";
          msg = meActive ? "you are both here." : `${other} is here.`;
        } else {
          status = "recent";
          msg = `${other} was here ${timeAgo(otherDate)} ago.`;
        }

        if (shouldShowNotification(status, prevRef.current, justMounted)) {
          setMessage(msg);
          setVisible(true);
          if (timerRef.current) clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => setVisible(false), DISPLAY_DURATION_MS);
        }

        prevRef.current = status;
        justMounted = false;
      } catch {
        // silent
      }
    };

    check();
    const interval = setInterval(check, POLL_MS);

    return () => {
      clearInterval(interval);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [myName]);

  if (pathname === "/welcome") return null;

  return (
    <AnimatePresence>
      {visible && message && (
        <motion.div
          key="presence-toast"
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-6 right-6 z-[90] md:top-6 max-sm:top-[5.5rem] max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:right-auto"
        >
          <div className="flex items-center gap-3 rounded-xl border border-[var(--border)]/60 bg-[var(--glass)]/95 px-4 py-2.5 shadow-lg backdrop-blur-2xl shadow-[0_4px_20px_rgba(0,0,0,.25)]">
            <div className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/60" />
              <span className="relative inline-block h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </div>
            <p className="font-body text-xs font-medium tracking-wide text-[var(--text)]/80">
              {message === "you are both here."
                ? message
                : message.charAt(0).toUpperCase() + message.slice(1)}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
