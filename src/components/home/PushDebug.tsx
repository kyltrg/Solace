"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { testPush, getSubscriptionCount } from "@/actions/push";

export default function PushDebug() {
  const [status, setStatus] = useState<{ subs: number; result: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userName = Cookies.get("solace-user") ?? "";
    if (!userName) return;
    const author = userName.toLowerCase() === "kyle" ? "kyle" : "angel";
    getSubscriptionCount(author).then((count) => {
      setStatus({ subs: count, result: "" });
    });
  }, []);

  async function handleTest() {
    setLoading(true);
    const userName = Cookies.get("solace-user") ?? "";
    if (!userName) { setLoading(false); return; }
    const author = userName.toLowerCase() === "kyle" ? "kyle" : "angel";
    const res = await testPush(author);
    const count = await getSubscriptionCount(author);
    setStatus({ subs: count, result: `Sent: ${res.sent}` });
    setLoading(false);
  }

  return (
    <div className="fixed bottom-4 right-4 z-[99]">
      <button
        onClick={handleTest}
        disabled={loading}
        className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] px-3 py-2 text-xs text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
        title={`Subscriptions: ${status?.subs ?? "?"} | ${status?.result ?? ""}`}
      >
        {loading ? "..." : `Push: ${status?.subs ?? "?"} subs`}
      </button>
    </div>
  );
}
