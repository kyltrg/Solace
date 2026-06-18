"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type Verse = {
  reference: string;
  text: string;
};

type HistoryEntry = {
  date: string;
  index: number;
};

const VERSES: Verse[] = [
  { reference: "Song of Solomon 2:16", text: "My beloved is mine and I am his." },
  { reference: "Song of Solomon 4:7", text: "You are altogether beautiful, my darling; there is no flaw in you." },
  { reference: "Song of Solomon 1:15", text: "How beautiful you are, my darling! Oh, how beautiful!" },
  { reference: "Song of Solomon 8:6", text: "Place me like a seal over your heart, like a seal on your arm; for love is as strong as death." },
  { reference: "Song of Solomon 3:4", text: "I have found the one whom my soul loves." },
  { reference: "Genesis 2:24", text: "That is why a man leaves his father and mother and is united to his wife, and they become one flesh." },
  { reference: "Ruth 1:16\u201317", text: "Where you go I will go, and where you stay I will stay..." },
  { reference: "Proverbs 31:10", text: "Who can find a virtuous woman? For her price is far above rubies." },
  { reference: "Psalm 143:8", text: "Let the morning bring me word of your unfailing love." },
  { reference: "Song of Solomon 2:10", text: "Arise, my darling, my beautiful one, come with me." },
  { reference: "Ecclesiastes 3:11", text: "He has made everything beautiful in its time." },
  { reference: "1 Thessalonians 5:11", text: "Encourage one another and build each other up." },
  { reference: "Philippians 2:3", text: "In humility value others above yourselves." },
  { reference: "Ephesians 4:32", text: "Be kind and compassionate to one another, forgiving each other." },
  { reference: "Colossians 3:13", text: "Bear with each other and forgive one another." },
  { reference: "Philippians 1:9", text: "And this is my prayer: that your love may abound more and more." },
  { reference: "1 Corinthians 16:14", text: "Let all that you do be done in love." },
  { reference: "Romans 15:5", text: "May the God who gives endurance and encouragement give you the same attitude of mind toward each other." },
  { reference: "1 John 4:12", text: "If we love one another, God lives in us and His love is made complete in us." },
  { reference: "1 Corinthians 13:7", text: "Love bears all things, believes all things, hopes all things." },
];

const HISTORY_KEY = "solace-daily-verse-history";
const MAX_HISTORY = 10;

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveHistory(history: HistoryEntry[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function getTodaysVerse(): Verse {
  const today = getToday();
  const history = loadHistory();

  const existing = history.find((entry) => entry.date === today);
  if (existing !== undefined) return VERSES[existing.index];

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - MAX_HISTORY);
  const cutoffStr = cutoff.toISOString().slice(0, 10);
  const recent = history.filter((entry) => entry.date >= cutoffStr);
  const used = new Set(recent.map((entry) => entry.index));

  const todayNum = today.split("-").reduce((acc, s) => acc + parseInt(s, 10), 0);
  const available = VERSES.map((_, i) => i).filter((i) => !used.has(i));
  const pick = available.length > 0
    ? available[todayNum % available.length]
    : todayNum % VERSES.length;

  saveHistory([...recent, { date: today, index: pick }]);
  return VERSES[pick];
}

function msUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setDate(midnight.getDate() + 1);
  midnight.setHours(0, 0, 0, 0);
  return midnight.getTime() - now.getTime();
}

export default function DailyVerse(): React.JSX.Element | null {
  const [verse, setVerse] = useState<Verse | null>(null);

  useEffect(() => {
    try {
      const today = getToday();
      const history = JSON.parse(localStorage.getItem("solace-daily-verse-history") || "[]");
      const filtered = history.filter((h: any) => h.date !== today);
      filtered.push({ date: today, index: 19 });
      localStorage.setItem("solace-daily-verse-history", JSON.stringify(filtered));
    } catch {}
    setVerse(getTodaysVerse());

    const checkDayChange = () => {
      try {
        const stored = JSON.parse(localStorage.getItem("solace-daily-verse-history") || "[]");
        if (!stored.some((h: any) => h.date === getToday())) {
          setVerse(getTodaysVerse());
        }
      } catch {}
    };

    const interval = setInterval(checkDayChange, 30000);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") checkDayChange();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  if (!verse) return null;

  return (
    <section className="relative overflow-hidden px-4 sm:px-6 py-20 sm:py-40 min-h-screen md:min-h-0 flex items-center">
      <div className="absolute left-1/2 top-24 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-[var(--accent)]/10 blur-[140px]" />
      <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-[var(--border)]" />

      <div className="relative mx-auto max-w-5xl text-center w-full">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs uppercase tracking-[.45em] text-[var(--accent)]"
        >
          Daily Verse
        </motion.p>

        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .8, ease: [.22,1,.36,1] }}
          className="mx-auto mt-10 max-w-4xl font-display text-3xl sm:text-5xl font-light leading-tight md:text-7xl"
        >
          {verse.text}
        </motion.h3>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: .6, delay: .3 }}
          className="mx-auto mt-12 h-px w-24 bg-[var(--accent)]/30"
        />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: .5, delay: .4 }}
          className="mt-8 text-sm uppercase tracking-[.35em] text-[var(--muted)]"
        >
          {verse.reference}
        </motion.p>


      </div>
    </section>
  );
}
