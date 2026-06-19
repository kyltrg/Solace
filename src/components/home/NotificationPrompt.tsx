"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, BellOff, X } from "lucide-react";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import { subscribePush } from "@/actions/push";

export default function NotificationPrompt() {
  const pathname = usePathname();
  const [state, setState] = useState<"loading" | "prompt" | "granted" | "denied" | "unsupported">("loading");
  const [dismissed, setDismissed] = useState(false);
  const done = useRef(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
      setState("unsupported");
      return;
    }
    if (Notification.permission === "granted") {
      setState("granted");
      return;
    }
    if (Notification.permission === "denied") {
      setState("denied");
      return;
    }
    setState("prompt");
  }, []);

  async function handleEnable() {
    try {
      const perm = await Notification.requestPermission();
      if (perm !== "granted") {
        setState("denied");
        return;
      }
      setState("granted");

      if (done.current) return;
      done.current = true;

      const userName = Cookies.get("solace-user") ?? "";
      if (!userName) return;
      const author = userName.toLowerCase() === "kyle" ? "kyle" : "angel";

      const reg = await navigator.serviceWorker.register("/sw.js");

      const key = urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
      );
      const newSub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: key.buffer as ArrayBuffer,
      });

      const raw = newSub.toJSON();
      await subscribePush(raw.endpoint!, raw.keys!.p256dh, raw.keys!.auth, author);
    } catch {
      // silent
    }
  }

  if (pathname === "/welcome") return null;

  const show = state === "prompt" && !dismissed;
  const isDenied = state === "denied";

  return (
    <AnimatePresence>
      {isDenied && (
        <motion.div
          key="notif-denied"
          initial={{ opacity: 0, y: 12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed left-1/2 z-[90] -translate-x-1/2 bottom-[15%] max-sm:top-[5.5rem] max-sm:bottom-auto"
        >
          <div className="flex items-center gap-3 rounded-2xl border border-[var(--accent)]/20 bg-gradient-to-br from-[var(--card-bg)]/95 to-[var(--accent-soft)]/20 px-5 py-3 shadow-[0_0_30px_rgba(168,141,114,0.1)] backdrop-blur-2xl">
            <BellOff className="h-4 w-4 shrink-0 text-[var(--muted)]" />
            <p className="font-body text-sm text-[var(--muted)]">
              Notifications are turned off. Enable in your browser settings.
            </p>
          </div>
        </motion.div>
      )}

      {show && (
        <motion.button
          key="notif-prompt"
          onClick={handleEnable}
          initial={{ opacity: 0, y: 12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed left-1/2 z-[90] -translate-x-1/2 bottom-[15%] max-sm:top-[5.5rem] max-sm:bottom-auto cursor-pointer"
        >
          <div className="group flex items-center gap-3 rounded-2xl border border-[var(--accent)]/30 bg-gradient-to-br from-[var(--card-bg)]/95 to-[var(--accent-soft)]/30 px-5 py-3 shadow-[0_0_30px_rgba(168,141,114,0.15)] backdrop-blur-2xl transition-all duration-300 hover:border-[var(--accent)]/50 hover:shadow-[0_0_40px_rgba(168,141,114,0.25)]">
            <div className="relative flex h-3 w-3 shrink-0">
              <span className="absolute inset-0 animate-ping rounded-full bg-[var(--accent)]/70" />
              <span className="relative inline-block h-3 w-3 rounded-full bg-[var(--accent)] shadow-[0_0_8px_rgba(168,141,114,0.5)]" />
            </div>
            <Bell className="h-4 w-4 shrink-0 text-[var(--accent)] transition-transform duration-300 group-hover:scale-110" />
            <p className="font-body text-sm font-semibold tracking-wide text-[var(--accent)] drop-shadow-[0_0_6px_rgba(168,141,114,0.2)]">
              Enable notifications
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDismissed(true);
              }}
              className="ml-1 rounded-full p-0.5 text-[var(--muted)] transition-colors hover:text-[var(--text)]"
              aria-label="Dismiss"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}
