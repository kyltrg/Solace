"use client";

import { useState, useEffect } from "react";
import { getUserStatuses, type UserStatus } from "@/actions/admin/presence";
import { getCloudinaryUsage, type CloudinaryUsage } from "@/actions/admin/cloudinary";

function formatBytes(bytes: unknown): string {
  if (typeof bytes !== "number" || !Number.isFinite(bytes) || bytes < 0) return "0 B";
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const val = bytes / Math.pow(1024, i);
  return `${val < 10 ? val.toFixed(1) : Math.round(val)} ${units[i]}`;
}

function CloudinaryStorage() {
  const [usage, setUsage] = useState<CloudinaryUsage | null>(null);

  const load = () => getCloudinaryUsage().then(setUsage).catch(() => {});
  useEffect(() => { load(); const id = setInterval(load, 30000); return () => clearInterval(id); }, []);

  if (!usage) return null;

  const creditsPct = usage.creditsLimit > 0 ? (usage.creditsUsed / usage.creditsLimit) * 100 : 0;

  return (
    <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-medium">Cloudinary Storage</span>
        <span className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-[var(--muted)]/50">{usage.plan}</span>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-[var(--muted)]">Storage</span>
            <span className="text-xs text-[var(--muted)]/60">{formatBytes(usage.storageUsed)}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[var(--muted)]/40">
            {usage.resources} {usage.resources === 1 ? "resource" : "resources"}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-[var(--muted)]">Bandwidth</span>
            <span className="text-xs text-[var(--muted)]/60">{formatBytes(usage.bandwidthUsed)}</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-[var(--muted)]">Credits</span>
            <span className="text-xs text-[var(--muted)]/60">{usage.creditsUsed.toFixed(2)} / {usage.creditsLimit.toFixed(2)}</span>
          </div>
          <div className="h-2 rounded-full bg-[var(--border)] overflow-hidden">
            <div className="h-full rounded-full bg-[var(--accent)] transition-all" style={{ width: `${Math.min(creditsPct, 100)}%` }} />
          </div>
          <span className="text-[11px] text-[var(--muted)]/40 mt-0.5 block">{creditsPct.toFixed(2)}% used</span>
        </div>
      </div>
    </div>
  );
}

export default function StatusSection() {
  const [statuses, setStatuses] = useState<UserStatus[]>([]);

  const load = () => getUserStatuses().then(setStatuses).catch(() => {});
  useEffect(() => { load(); const id = setInterval(load, 5000); return () => clearInterval(id); }, []);

  return (
    <div>
      <div className="flex flex-wrap gap-x-8 gap-y-2">
        {["Angel", "Kyle"].map((name) => {
          const s = statuses.find((u) => u.userName.toLowerCase() === name.toLowerCase());
          const online = s?.isOnline ?? false;
          return (
            <div key={name} className="flex items-center gap-2.5">
              <span className={`h-3 w-3 rounded-full ${online ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]" : "bg-red-400/50"}`} />
              <span className="font-medium text-sm">{name}</span>
              <span className={`text-xs ${online ? "text-emerald-400" : "text-red-400/60"}`}>
                {online ? "Active now" : s ? `${s.offlineHours >= 1 ? `${s.offlineHours}h` : `${Math.round(s.offlineHours * 60)}m`} offline` : "—"}
              </span>
            </div>
          );
        })}
      </div>

      <CloudinaryStorage />
    </div>
  );
}
