"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import Cookies from "js-cookie";
import { updatePresence } from "@/actions/presence";
import { notifyOnline } from "@/actions/push";

const HEARTBEAT_MS = 15000;

type PresenceContext = {
  myName: string | null;
};

const Ctx = createContext<PresenceContext>({ myName: null });

export function usePresence(): PresenceContext {
  return useContext(Ctx);
}

export function PresenceProvider({ children }: { children: ReactNode }) {
  const [myName, setMyName] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const userName = Cookies.get("solace-user") ?? null;
    const isAdmin = Cookies.get("solace-admin") === "true";
    setMyName(userName);

    if (!userName || isAdmin) return;

    notifyOnline(userName).catch(() => {});

    const beat = () => { updatePresence(userName).catch(() => {}); };
    beat();
    intervalRef.current = setInterval(beat, HEARTBEAT_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return <Ctx.Provider value={{ myName }}>{children}</Ctx.Provider>;
}
