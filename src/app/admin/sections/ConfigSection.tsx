"use client";

import { useState, useEffect } from "react";
import { getAppConfig, updatePasscodes, setRandomDailyVerse, getStorageStats, type StorageInfo } from "@/actions/admin/config";
import { getCloudinaryUsage, type CloudinaryUsage } from "@/actions/admin/cloudinary";
import AdminSkeleton from "../shared/AdminSkeleton";

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
    <div>
      <div className="flex items-center gap-2 mb-5">
        <span className="text-sm font-medium">Cloudinary Storage</span>
        <span className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-[var(--muted)]/50">{usage.plan}</span>
      </div>

      <div className="space-y-5">
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
            <div className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-purple-500 transition-all" style={{ width: `${Math.min(creditsPct, 100)}%` }} />
          </div>
          <span className="text-[11px] text-[var(--muted)]/40 mt-0.5 block">{creditsPct.toFixed(2)}% used</span>
        </div>
      </div>
    </div>
  );
}

export default function ConfigSection() {
  const [loaded, setLoaded] = useState(false);
  const [userPasscode, setUserPasscode] = useState("");
  const [adminPasscode, setAdminPasscode] = useState("");
  const [currentVerse, setCurrentVerse] = useState("");
  const [storage, setStorage] = useState<StorageInfo | null>(null);
  const [expandedTable, setExpandedTable] = useState(false);
  const [msg, setMsg] = useState("");
  const [verseLoading, setVerseLoading] = useState(false);
  const [passcodeOpen, setPasscodeOpen] = useState(false);

  const load = async () => {
    setLoaded(false);
    const cfg = await getAppConfig();
    setCurrentVerse(cfg.daily_verse ?? "");
    setUserPasscode("");
    setAdminPasscode("");
    const stats = await getStorageStats();
    setStorage(stats);
    setLoaded(true);
  };

  useEffect(() => { load(); }, []);

  const handlePasscodes = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    const r = await updatePasscodes(userPasscode, adminPasscode);
    setMsg(r.ok ? "Passcodes updated!" : r.error || "Failed");
    if (r.ok) setPasscodeOpen(false);
  };

  const handleRandomVerse = async () => {
    setVerseLoading(true);
    setMsg("");
    const r = await setRandomDailyVerse();
    if (r.ok) {
      const cfg = await getAppConfig();
      setCurrentVerse(cfg.daily_verse ?? "");
    }
    setMsg(r.ok ? "Daily verse changed!" : r.error || "Failed");
    setVerseLoading(false);
  };

  return (
    <div className="space-y-8">
      <h3 className="font-display text-2xl">Configuration</h3>

      {msg && <p className="text-sm text-emerald-400">{msg}</p>}

      {!loaded ? (
        <AdminSkeleton rows={3} />
      ) : (
      <>
      {/* Passcodes — collapsible */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] overflow-hidden">
        <button
          type="button"
          onClick={() => setPasscodeOpen(!passcodeOpen)}
          className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-[var(--bg-soft)]/50"
        >
          <span className="font-display text-lg">Passcodes</span>
          <span className={`text-sm text-[var(--muted)] transition-transform ${passcodeOpen ? "rotate-180" : ""}`}>▾</span>
        </button>
        {passcodeOpen && (
          <form onSubmit={handlePasscodes} className="space-y-4 px-6 pb-6 border-t border-[var(--border)] pt-4">
            <p className="text-xs text-[var(--muted)]/60">Enter new 6-digit passcodes for user and admin.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs uppercase tracking-wider text-[var(--muted)]">User Passcode</label>
                <input
                  value={userPasscode}
                  onChange={(e) => setUserPasscode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="6 digits"
                  className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]/50"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-[var(--muted)]">Admin Passcode</label>
                <input
                  value={adminPasscode}
                  onChange={(e) => setAdminPasscode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="6 digits"
                  className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]/50"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="submit" className="rounded-full bg-[var(--accent)] px-6 py-2.5 text-sm font-medium text-[var(--bg)] transition-all hover:opacity-90">
                Update Passcodes
              </button>
              <button type="button" onClick={() => setPasscodeOpen(false)} className="rounded-full border border-[var(--border)] px-6 py-2.5 text-sm text-[var(--muted)] hover:bg-[var(--border)]/20 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Daily Verse */}
      <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-6">
        <h4 className="font-display text-lg">Daily Verse</h4>
        {currentVerse && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] p-4">
            <p className="text-xs text-[var(--muted)] mb-1">Currently live:</p>
            <p className="text-sm italic text-[var(--accent)]">"{currentVerse}"</p>
          </div>
        )}

        <button
          onClick={handleRandomVerse}
          disabled={verseLoading}
          className="rounded-full border border-[var(--accent)]/30 px-6 py-2.5 text-sm text-[var(--accent)] hover:bg-[var(--accent)]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {verseLoading ? "Picking..." : "Change Verse"}
        </button>
      </div>

      {/* Cloudinary Storage — iPhone style */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-6">
        <CloudinaryStorage />
      </div>

      {/* Database Storage — iPhone style */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-6">
        <h4 className="font-display text-lg mb-5">Database Storage</h4>

        {storage && (
          <>
            <div className="mb-5">
              <div className="h-7 w-full overflow-hidden rounded-full bg-[var(--bg-soft)]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-purple-500 transition-all duration-500"
                  style={{ width: `${Math.min((storage.usedBytes / storage.overallBytes) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div className="mb-5 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-semibold text-[var(--text)]">{storage.usedFormatted}</p>
                <p className="text-xs text-[var(--muted)]">Used</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-emerald-400">{storage.availableFormatted}</p>
                <p className="text-xs text-[var(--muted)]">Available</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-[var(--text)]">{storage.overallFormatted}</p>
                <p className="text-xs text-[var(--muted)]">Overall</p>
              </div>
            </div>

            <button
              onClick={() => setExpandedTable(!expandedTable)}
              className="flex w-full items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-3 text-sm text-[var(--muted)] transition-all hover:border-[var(--accent)]/50"
            >
              <span>Table Details</span>
              <span className={`transition-transform ${expandedTable ? "rotate-180" : ""}`}>▾</span>
            </button>

            {expandedTable && (
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)] text-left text-[var(--muted)]">
                      <th className="pb-2 pr-4 font-medium">Table</th>
                      <th className="pb-2 pr-4 font-medium">Rows</th>
                      <th className="pb-2 font-medium">Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {storage.tables.map((t) => (
                      <tr key={t.name} className="border-b border-[var(--border)]/50 text-[var(--text)]">
                        <td className="py-2 pr-4">{t.name}</td>
                        <td className="py-2 pr-4">{t.rows.toLocaleString()}</td>
                        <td className="py-2">{t.size}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {!storage && <p className="text-sm text-[var(--muted)]">Loading...</p>}
      </div>
      </>)}
    </div>
  );
}
