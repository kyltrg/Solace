"use client";

import { useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { subscribePush } from "@/actions/push";

export default function PushSetup() {
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

    let cancelled = false;

    async function setup() {
      try {
        const userName = Cookies.get("solace-user") ?? "";
        const author = userName.toLowerCase() === "kyle" ? "kyle" : "angel";

        const reg = await navigator.serviceWorker.register("/sw.js");
        const existingSub = await reg.pushManager.getSubscription();

        if (existingSub) {
          const raw = existingSub.toJSON();
          await subscribePush(raw.endpoint!, raw.keys!.p256dh, raw.keys!.auth, author);
          done.current = true;
          return;
        }

        const perm = await Notification.requestPermission();
        if (perm !== "granted" || cancelled) return;

        const key = urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
        );
        const newSub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: key.buffer as ArrayBuffer,
        });

        const raw = newSub.toJSON();
        await subscribePush(raw.endpoint!, raw.keys!.p256dh, raw.keys!.auth, author);
        done.current = true;
      } catch {}
    }

    setup();
    return () => { cancelled = true; };
  }, []);

  return null;
}

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}
