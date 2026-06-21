"use client";

import { useState, useEffect } from "react";
import { getUserStatuses, type UserStatus } from "@/actions/admin/presence";

export default function StatusSection() {
  const [statuses, setStatuses] = useState<UserStatus[]>([]);

  const load = () => getUserStatuses().then(setStatuses).catch(() => {});
  useEffect(() => { load(); const id = setInterval(load, 5000); return () => clearInterval(id); }, []);

  return (
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
  );
}
