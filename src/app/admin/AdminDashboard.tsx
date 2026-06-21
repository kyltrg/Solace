"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import StatusSection from "./sections/StatusSection";
import ConfigSection from "./sections/ConfigSection";
import ComfortSection from "./sections/ComfortSection";
import LettersSection from "./sections/LettersSection";
import DatesSection from "./sections/DatesSection";
import DreamsSection from "./sections/DreamsSection";
import SongsSection from "./sections/SongsSection";
import TonightSection from "./sections/TonightSection";
import VersesSection from "./sections/VersesSection";

type Tab = "config" | "verses" | "comfort" | "letters" | "dates" | "dreams" | "songs" | "tonight";

const TABS: { key: Tab; label: string }[] = [
  { key: "config", label: "Config" },
  { key: "verses", label: "Verses" },
  { key: "comfort", label: "Comfort" },
  { key: "letters", label: "Letters" },
  { key: "dates", label: "Dates" },
  { key: "dreams", label: "Dreams" },
  { key: "songs", label: "Songs" },
  { key: "tonight", label: "Tonight" },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("config");

  const handleLogout = () => {
    Cookies.remove("solace-access");
    Cookies.remove("solace-user");
    Cookies.remove("solace-admin");
    router.push("/");
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl">Admin</h1>
        <button onClick={handleLogout} className="rounded-full border border-red-400/30 px-4 py-2 text-xs text-red-400/70 hover:bg-red-400/10">
          Logout
        </button>
      </div>

      {/* Always visible status */}
      <div className="mb-8">
        <StatusSection />
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full px-4 py-2 text-sm transition-all ${
              tab === t.key
                ? "bg-[var(--accent)] text-[var(--bg)]"
                : "border border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "config" && <ConfigSection />}
      {tab === "verses" && <VersesSection />}
      {tab === "comfort" && <ComfortSection />}
      {tab === "letters" && <LettersSection />}
      {tab === "dates" && <DatesSection />}
      {tab === "dreams" && <DreamsSection />}
      {tab === "songs" && <SongsSection />}
      {tab === "tonight" && <TonightSection />}
    </div>
  );
}
