"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import SplashScreen from "@/components/layout/SplashScreen";
import WelcomeContent from "@/components/WelcomeContent";

export default function Page(): React.JSX.Element | null {
  const router = useRouter();
  const [phase, setPhase] = useState<"loading" | "splash" | "auth" | "redirecting">("loading");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const access = Cookies.get("solace-access");
    if (access && (!isNaN(Number(access)) || access.length === 36)) {
      setPhase("redirecting");
      window.dispatchEvent(new CustomEvent("solace-loading"));
      router.replace("/home");
    } else {
      setPhase("splash");
    }
  }, [router]);

  const handleSplashDone = useCallback(() => {
    const access = Cookies.get("solace-access");
    if (access && (!isNaN(Number(access)) || access.length === 36)) {
      setPhase("redirecting");
      window.dispatchEvent(new CustomEvent("solace-loading"));
      router.replace("/home");
    } else {
      setPhase("auth");
    }
  }, [router]);

  if (!mounted) return null;
  if (phase === "splash") return <SplashScreen onDone={handleSplashDone} />;
  if (phase === "auth") return <WelcomeContent />;
  return null;
}
