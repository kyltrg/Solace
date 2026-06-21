"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import SplashScreen from "@/components/layout/SplashScreen";
import WelcomeContent from "@/components/WelcomeContent";

export default function Page(): React.JSX.Element {
  const router = useRouter();
  const [phase, setPhase] = useState<"splash" | "auth" | "redirecting">("splash");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleSplashDone = useCallback(() => {
    const access = Cookies.get("solace-access");
    if (access && !isNaN(Number(access))) {
      setPhase("redirecting");
      router.replace("/home");
    } else {
      setPhase("auth");
    }
  }, [router]);

  return (
    <>
      {!mounted ? null : phase === "splash" ? (
        <SplashScreen onDone={handleSplashDone} />
      ) : phase === "auth" ? (
        <WelcomeContent />
      ) : null}
    </>
  );
}
