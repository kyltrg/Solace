"use client";

import { useState, useEffect } from "react";
import { getAppConfig, updatePasscodes, setRandomDailyVerse, getStorageStats, type StorageInfo } from "@/actions/admin/config";

export default function ConfigSection() {
  const [userPasscode, setUserPasscode] = useState("");
  const [adminPasscode, setAdminPasscode] = useState("");
  const [currentVerse, setCurrentVerse] = useState("");
  const [currentUserPasscode, setCurrentUserPasscode] = useState("");
  const [currentAdminPasscode, setCurrentAdminPasscode] = useState("");
  const [storage, setStorage] = useState<StorageInfo | null>(null);
  const [expandedTable, setExpandedTable] = useState(false);
  const [msg, setMsg] = useState("");
  const [verseLoading, setVerseLoading] = useState(false);

  const load = async () => {
    const cfg = await getAppConfig();
    setCurrentVerse(cfg.daily_verse ?? "");
    setCurrentUserPasscode(cfg.passcode ?? "");
    setCurrentAdminPasscode(cfg.admin_passcode ?? "");
    setUserPasscode(cfg.passcode ?? "");
    setAdminPasscode(cfg.admin_passcode ?? "");
    const stats = await getStorageStats();
    setStorage(stats);
  };

  useEffect(() => { load(); }, []);

  const handlePasscodes = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    const r = await updatePasscodes(userPasscode, adminPasscode);
    setMsg(r.ok ? "Passcodes updated!" : r.error || "Failed");
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

      {/* Passcodes */}
      <form onSubmit={handlePasscodes} className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-6">
        <h4 className="font-display text-lg">Change Passcodes</h4>
        {currentUserPasscode && (
          <p className="text-xs text-[var(--muted)]">
            Current: user=<span className="font-mono text-[var(--text)]">{currentUserPasscode}</span>
            &nbsp;admin=<span className="font-mono text-[var(--text)]">{currentAdminPasscode}</span>
          </p>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-wider text-[var(--muted)]">User Passcode</label>
            <input
              value={userPasscode}
              onChange={(e) => setUserPasscode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="022426"
              className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]/50"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-[var(--muted)]">Admin Passcode</label>
            <input
              value={adminPasscode}
              onChange={(e) => setAdminPasscode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="111805"
              className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]/50"
            />
          </div>
        </div>
        <button type="submit" className="rounded-full bg-[var(--accent)] px-6 py-2.5 text-sm font-medium text-[var(--bg)] transition-all hover:opacity-90">
          Update Passcodes
        </button>
      </form>

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

      {/* Storage Stats — iPhone style */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-6">
        <h4 className="font-display text-lg mb-5">Storage</h4>

        {storage && (
          <>
            {/* Storage bar */}
            <div className="mb-5">
              <div className="h-7 w-full overflow-hidden rounded-full bg-[var(--bg-soft)]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-purple-500 transition-all duration-500"
                  style={{ width: `${Math.min((storage.usedBytes / storage.overallBytes) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Stats row */}
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

            {/* Per-table breakdown */}
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
    </div>
  );
}
