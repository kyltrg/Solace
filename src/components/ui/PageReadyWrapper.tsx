"use client";

import { usePageReady } from "@/components/ui/DoorLoadingOverlay";

export default function PageReadyWrapper({ children }: { children: React.ReactNode }) {
  usePageReady();
  return <>{children}</>;
}
