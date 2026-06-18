"use client";

import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";

type Step = "gate" | "name" | "welcome" | "choice" | "quiz" | "vault" | "success" | "wrong-door";
type Level = 1 | 2 | 3;

type QuizQuestion = {
  q: string;
  choices?: readonly string[];
  answer?: string;
  type?: "choice" | "input";
  inputAnswers?: readonly string[];
};

type Room = {
  level: Level;
  name: string;
  icon: React.ReactNode;
  code: string;
  description: string;
};

const VALID_NAMES: readonly string[] = [
  "angel", "allison", "angel allison", "angel allison melano", "angel allison melaño", "kyle",
] as const;

function toDisplayName(raw: string): string {
  const n = raw.toLowerCase().trim();
  if (n === "kyle") return "Kyle";
  return "Angel";
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
      <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
      <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
    </svg>
  );
}

function DoorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M14 12v.01" />
      <path d="M3 21h18" />
      <path d="M6 21v-16a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v16" />
    </svg>
  );
}

function DoorOpenIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 18V6h-5v12h5Zm0 0h2M4 18h2.5m3.5-5.5V12M6 6l7-2v16l-7-2V6Z" />
    </svg>
  );
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M19 4v16h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12" />
      <path d="M19 16h-12a2 2 0 0 0 -2 2" />
      <path d="M9 8h6" />
    </svg>
  );
}

function CandleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M9 21h6v-10a1 1 0 0 0 -1 -1h-4a1 1 0 0 0 -1 1l0 10" />
      <path d="M12 2l1.465 1.638a2 2 0 1 1 -3.015 .099l1.55 -1.737" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6" />
      <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
      <path d="M8 11v-4a4 4 0 1 1 8 0v4" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M5 12l5 5l10 -10" />
    </svg>
  );
}

function ProhibitedIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M5 12h-2l9 -9l8 8" />
      <path d="M5 12v7a2 2 0 0 0 2 2h6" />
      <path d="M9 21v-6a2 2 0 0 1 2 -2h2c.688 0 1.294 .347 1.654 .875" />
      <path d="M17 19a1 1 0 0 1 1 -1h3a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1v-2" />
      <path d="M18 18v-1.5a1.5 1.5 0 1 1 3 0v1.5" />
    </svg>
  );
}

const ROOMS: readonly Room[] = [
  { level: 1, name: "Foyer", icon: <DoorIcon className="w-5 h-5" />, code: "02", description: "A quiet entrance lit by a single lantern." },
  { level: 2, name: "Library", icon: <BookIcon className="w-5 h-5" />, code: "24", description: "Dusty shelves hide forgotten memories." },
  { level: 3, name: "Attic", icon: <CandleIcon className="w-5 h-5" />, code: "26", description: "The final room beneath a warm candle glow." },
] as const;

const QUIZZES: Record<Level, readonly QuizQuestion[]> = {
  1: [
    { q: "I have a face but no eyes, and hands but cannot hold anything. What am I?", choices: ["Clock", "Mirror", "Book"], answer: "Clock" },
    { q: "What has keys but cannot open doors?", choices: ["Piano", "Keyboard", "Map"], answer: "Keyboard" },
    { q: "What disappears the moment you say its name?", choices: ["Silence", "Shadow", "Light"], answer: "Silence" },
  ],
  2: [
    { q: "What has many words but never speaks?", choices: ["Book", "Phone", "Radio"], answer: "Book" },
    { q: "I am full of holes but can still hold water. What am I?", choices: ["Sponge", "Net", "Glass"], answer: "Sponge" },
    { q: "What goes up but never comes down?", choices: ["Age", "Balloon", "Rain"], answer: "Age" },
  ],
  3: [
    { q: "Where's our first date?", choices: ["Starbucks", "COG Dasma", "Mcdo Antlers"], answer: "Mcdo Antlers" },
    { q: "When is Kyle's birthday?", choices: ["December 18, 2004", "November 18, 2006", "November 18, 2005"], answer: "November 18, 2005" },
    { q: "List the 5 call signs / names I call you", type: "input", inputAnswers: ["Direk", "Mahal", "Baby", "Love", "Allison"] },
  ],
};

function FloatingOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <motion.div
        animate={{ y: [0, -40, 0], opacity: [0.06, 0.12, 0.06] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[15%] top-[10%] h-[30rem] w-[30rem] rounded-full bg-rose-500/10 blur-[180px]"
      />
      <motion.div
        animate={{ y: [0, 30, 0], opacity: [0.04, 0.09, 0.04] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute right-[10%] top-[35%] h-[25rem] w-[25rem] rounded-full bg-rose-400/8 blur-[150px]"
      />
      <motion.div
        animate={{ y: [0, -30, 0], opacity: [0.03, 0.07, 0.03] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 6 }}
        className="absolute left-[35%] bottom-[8%] h-[22rem] w-[22rem] rounded-full bg-rose-400/8 blur-[160px]"
      />
    </div>
  );
}

const ease = [0.22, 1, 0.36, 1] as const;

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease } },
  exit: { opacity: 0, y: -16, scale: 0.98, transition: { duration: 0.3, ease } },
};

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`relative overflow-hidden rounded-[32px] border border-[var(--border)] bg-[var(--card-bg)] backdrop-blur-2xl shadow-[0_0_100px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.02)_inset] ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.03] via-transparent to-black/[0.06]" />
      <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-rose-500/4 blur-[160px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-white/[0.01] blur-[160px]" />
      <div className="relative p-6 sm:p-8 md:p-10">{children}</div>
    </motion.div>
  );
}

function ProgressTracker({ level }: { level: Level }): React.JSX.Element {
  return (
    <div className="mb-6 md:mb-8 flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3">
      {ROOMS.map((room, index) => (
        <React.Fragment key={room.level}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 200, damping: 16 }}
            className={`flex h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 items-center justify-center rounded-lg sm:rounded-xl border transition-all duration-500 ${
              level >= room.level
                ? "border-rose-400/50 bg-rose-400/10 text-rose-300 shadow-[0_0_20px_rgba(251,113,133,0.1)]"
                : "border-[var(--border)] bg-[var(--card-bg)] text-[var(--muted)]/20"
            }`}
          >
            {room.icon}
          </motion.div>
          {index !== ROOMS.length - 1 && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: index * 0.1 + 0.15 }}
              className={`h-[2px] w-4 sm:w-6 md:w-8 origin-left rounded-full transition-all duration-500 ${level > room.level ? "bg-rose-400/30" : "bg-[var(--border)]"}`}
            />
          )}
        </React.Fragment>
      ))}
      <div className="h-[2px] w-4 sm:w-6 md:w-8 rounded-full bg-[var(--border)]" />
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4 }}
        className="flex h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 items-center justify-center rounded-lg sm:rounded-xl border border-[var(--border)] text-[var(--muted)]/20"
      >
        <LockIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </motion.div>
    </div>
  );
}

function PasscodeTracker({ unlocked }: { unlocked: string[] }): React.JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="mt-6 overflow-hidden"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
        <p className="text-[10px] uppercase tracking-[.35em] text-rose-400/50">Passcode fragments</p>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
      </div>
      <div className="flex justify-center gap-3 sm:gap-4">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`flex h-12 w-16 sm:h-14 sm:w-18 items-center justify-center rounded-lg sm:rounded-xl border font-display text-base sm:text-xl tracking-widest transition-all duration-500 ${
              unlocked[i]
                ? "border-rose-400/40 bg-rose-400/8 text-rose-300 shadow-[0_0_12px_rgba(251,113,133,0.08)]"
                : "border-[var(--border)] bg-[var(--bg-soft)] text-[var(--muted)]/15"
            }`}
          >
            {unlocked[i] ?? <span className="tracking-[.3em]">_ _</span>}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function ShakeError({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 1200);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.p
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className="mt-4 text-sm text-red-400/90 flex items-center justify-center gap-2"
    >
      <span className="inline-block w-1 h-1 rounded-full bg-red-400/60" />
      {message}
    </motion.p>
  );
}

function StaggerChildren({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.07, delayChildren: delay } } }}
    >
      {children}
    </motion.div>
  );
}

function FadeUp({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function PasscodePad({
  code,
  onDigit,
  onBackspace,
  disabled,
  error,
}: {
  code: string;
  onDigit: (d: string) => void;
  onBackspace: () => void;
  disabled?: boolean;
  error?: boolean;
}) {
  const shakeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error && shakeRef.current) {
      shakeRef.current.style.animation = "none";
      void shakeRef.current.offsetHeight;
      shakeRef.current.style.animation = "shake 0.5s ease-in-out";
    }
  }, [error]);

  const digits = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["", "0", "backspace"],
  ] as const;

  return (
    <div className="mt-5 sm:mt-6">
      <div ref={shakeRef} className="flex justify-center gap-2 sm:gap-3 mb-6 sm:mb-7">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1, transition: { delay: i * 0.05, type: "spring", stiffness: 300, damping: 20 } }}
            className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 transition-all duration-300 ${
              error
                ? "border-red-400/60 bg-red-400/20"
                : code.length > i
                  ? "border-rose-400 bg-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.2)]"
                  : "border-[var(--border)] bg-transparent"
            }`}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2.5 sm:gap-3 max-w-[240px] sm:max-w-[260px] mx-auto">
        {digits.flat().map((d, i) => {
          if (d === "") return <div key={i} />;
          if (d === "backspace") {
            return (
              <motion.button
                key={i}
                whileTap={{ scale: 0.9 }}
                onClick={onBackspace}
                disabled={disabled || code.length === 0}
                className="flex items-center justify-center h-[52px] sm:h-[56px] rounded-xl sm:rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] text-[var(--muted)]/60 transition-all duration-200 hover:border-rose-400/20 hover:text-rose-300/60 active:bg-rose-400/5 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M14 8l-4 4l4 4" />
                  <path d="M5 12l5 5l7 -5l-7 -5z" />
                </svg>
              </motion.button>
            );
          }
          return (
            <motion.button
              key={i}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => onDigit(d)}
              disabled={disabled}
              className="flex items-center justify-center h-[52px] sm:h-[56px] rounded-xl sm:rounded-2xl border border-[var(--accent)]/12 bg-gradient-to-b from-[var(--accent-soft)]/30 to-[var(--accent-soft)]/10 font-display text-lg sm:text-xl text-[var(--text)]/90 transition-all duration-200 hover:border-rose-400/25 hover:from-rose-400/10 hover:to-rose-400/5 hover:shadow-[0_0_20px_rgba(251,113,133,0.06)] active:from-rose-400/15 active:to-rose-400/8 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {d}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export default function AuthFlow(): React.JSX.Element {
  const [step, setStep] = useState<Step>("gate");
  const [name, setName] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [level, setLevel] = useState<Level>(1);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [passedRoom, setPassedRoom] = useState<boolean>(false);
  const [unlockedCodes, setUnlockedCodes] = useState<string[]>([]);
  const [errorKey, setErrorKey] = useState(0);
  const [codeError, setCodeError] = useState(false);
  const [inputAnswer, setInputAnswer] = useState<string>("");

  useEffect(() => { setInputAnswer(""); }, [questionIndex]);

  const currentRoom = useMemo(() => ROOMS.find((room) => room.level === level) as Room, [level]);
  const currentQuestion = useMemo(() => QUIZZES[level][questionIndex], [level, questionIndex]);

  function verifyName(): void {
    const normalized = name.trim().toLowerCase();
    if (!VALID_NAMES.includes(normalized)) {
      setError("The house does not recognize that name.");
      setErrorKey((k) => k + 1);
      return;
    }
    setStep("welcome");
  }

  function startQuiz(): void {
    setQuestionIndex(0);
    setPassedRoom(false);
    setStep("quiz");
  }

  function answerQuestion(choice: string): void {
    if (choice !== currentQuestion.answer) {
      setError("The house remains silent. Try again.");
      setErrorKey((k) => k + 1);
      return;
    }
    setError("");
    if (questionIndex < QUIZZES[level].length - 1) {
      setQuestionIndex((prev) => prev + 1);
      return;
    }
    setUnlockedCodes((prev) => [...prev, ROOMS[level - 1].code]);
    setPassedRoom(true);
  }

  function handleInputSubmit(): void {
    const normalized = inputAnswer.trim().toLowerCase();
    const parts = normalized.split(",").map((s) => s.trim()).filter(Boolean);
    const required = (currentQuestion.inputAnswers ?? []).map((a) => a.toLowerCase());
    const allPresent = required.every((r) => parts.some((p) => p === r));
    if (!allPresent || parts.length !== required.length) {
      setError("That's not quite right. Think about all the names I call you.");
      setErrorKey((k) => k + 1);
      return;
    }
    setError("");
    setInputAnswer("");
    if (questionIndex < QUIZZES[level].length - 1) {
      setQuestionIndex((prev) => prev + 1);
      return;
    }
    setUnlockedCodes((prev) => [...prev, ROOMS[level - 1].code]);
    setPassedRoom(true);
  }

  function continueAfterRoom(): void {
    setPassedRoom(false);
    if (level < 3) {
      setLevel((prev) => (prev + 1) as Level);
      setQuestionIndex(0);
      return;
    }
    setStep("vault");
  }

  function verifyCode(): void {
    if (code === "022426") {
      Cookies.set("solace-access", String(Date.now()));
      Cookies.set("solace-user", toDisplayName(name));
      setStep("success");
      setTimeout(() => { window.location.href = "/home"; }, 4200);
      return;
    }
    setCodeError(true);
    setError("The door does not recognize that code.");
    setErrorKey((k) => k + 1);
    setTimeout(() => {
      setCode("");
      setCodeError(false);
    }, 600);
  }

  const handleDigit = useCallback((digit: string) => {
    setCode((prev) => {
      const next = prev + digit;
      if (next.length === 6) {
        setTimeout(() => {
          if (next === "022426") {
            Cookies.set("solace-access", String(Date.now()));
            Cookies.set("solace-user", toDisplayName(nameRef.current));
            setStep("success");
            setTimeout(() => { window.location.href = "/home"; }, 4200);
          } else {
            setCodeError(true);
            setError("The door does not recognize that code.");
            setErrorKey((k) => k + 1);
            setTimeout(() => {
              setCode("");
              setCodeError(false);
            }, 600);
          }
        }, 150);
        return next;
      }
      return next;
    });
  }, []);

  const nameRef = useRef(name);
  useEffect(() => { nameRef.current = name; }, [name]);

  const handleBackspace = useCallback(() => {
    setCode((prev) => prev.slice(0, -1));
  }, []);

  const btnBase = "w-full rounded-2xl px-8 py-4 text-sm font-medium tracking-wide transition-all duration-300 active:scale-[0.97] hover:shadow-lg";

  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 sm:px-5 py-8 sm:py-12 text-[var(--text)] overflow-x-hidden" style={{ background: "radial-gradient(ellipse at 50% 0%, var(--bg-elevated) 0%, var(--bg-soft) 50%, var(--bg) 100%)" }}>
      <FloatingOrbs />

      <div className="w-full max-w-md mx-auto">
        {(step === "welcome" || step === "choice" || step === "quiz" || step === "vault") && (
          <ProgressTracker level={level} />
        )}

        <AnimatePresence mode="wait">
          {step === "gate" && (
            <Card key="gate">
              <StaggerChildren delay={0.1}>
                <FadeUp>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: [0, -2, 2, 0] }}
                    transition={{ duration: 0.5, ease: "easeInOut", delay: 0.2 }}
                    className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-rose-400/20 bg-gradient-to-br from-rose-400/10 to-rose-400/5 text-rose-300 animate-float-slow"
                  >
                    <HomeIcon className="w-10 h-10" />
                  </motion.div>
                </FadeUp>

                <FadeUp>
                  <h1 className="mt-8 font-display text-5xl sm:text-6xl tracking-[-0.04em] leading-none text-center">
                    {"SOLACE".split("").map((letter, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, y: 30, rotateX: -90 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 + i * 0.08, ease: [.22,1,.36,1] }}
                        className="inline-block gradient-text"
                        style={{ perspective: "800px" }}
                      >
                        {letter}
                      </motion.span>
                    ))}
                  </h1>
                </FadeUp>

                <FadeUp>
                  <div className="mx-auto mt-4 max-w-sm text-center text-sm leading-relaxed text-[var(--muted)]/80">
                    <span className="font-display italic text-rose-300">/ˈsäləs/</span>
                    <span className="block mt-4 leading-relaxed">Comfort, relief, or consolation in a time of distress, sadness, or misfortune.</span>
                  </div>
                </FadeUp>

                <FadeUp>
                  <button onClick={() => setStep("name")} className={`${btnBase} mt-8 border border-rose-400/30 bg-gradient-to-b from-rose-400/10 to-rose-400/5 text-rose-300/90 hover:from-rose-400/20 hover:to-rose-400/10 hover:shadow-[0_0_40px_rgba(251,113,133,0.12)]`}>
                    Approach The House
                  </button>
                </FadeUp>

                <FadeUp>
                  <div className="mt-8 flex items-center justify-center gap-4">
                    <div className="h-px w-16 bg-gradient-to-r from-transparent via-rose-400/20 to-transparent" />
                    <CandleIcon className="w-3 h-3 text-rose-400/30 shrink-0" />
                    <div className="h-px w-16 bg-gradient-to-r from-transparent via-rose-400/20 to-transparent" />
                  </div>
                </FadeUp>
              </StaggerChildren>
            </Card>
          )}

          {step === "name" && (
            <Card key="name">
              <StaggerChildren delay={0.1}>
                <FadeUp>
                  <h1 className="font-display text-3xl tracking-[-0.02em] text-center">Who arrives at the door?</h1>
                </FadeUp>

                <FadeUp>
                  <div className="mt-8">
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && verifyName()}
                      placeholder="Type your name..."
                      className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] px-6 py-4 text-center text-base sm:text-sm outline-none transition-all duration-300 placeholder:text-[var(--muted)]/15 focus:border-rose-400/40 focus:shadow-[0_0_30px_rgba(251,113,133,0.06)] focus:bg-[var(--bg-elevated)]"
                    />
                  </div>
                </FadeUp>

                <FadeUp>
                  <button onClick={verifyName} className={`${btnBase} mt-6 border border-rose-400/30 bg-gradient-to-b from-rose-400/10 to-rose-400/5 text-rose-300/90 hover:from-rose-400/20 hover:to-rose-400/10`}>
                    Continue
                  </button>
                </FadeUp>

                <AnimatePresence mode="wait">
                  {error && <ShakeError key={errorKey} message={error} onClose={() => setError("")} />}
                </AnimatePresence>
              </StaggerChildren>
            </Card>
          )}

          {step === "welcome" && (
            <Card key="welcome">
              <StaggerChildren delay={0.15}>
                <FadeUp>
                  <motion.div
                    initial={{ scale: 0, rotate: -15 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.1 }}
                    className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-400/20 bg-gradient-to-br from-rose-400/10 to-rose-400/5 text-rose-300"
                  >
                    <DoorOpenIcon className="w-8 h-8" />
                  </motion.div>
                </FadeUp>

                <FadeUp>
                  <h1 className="mt-8 font-display text-4xl tracking-[-0.02em] text-center">
                    {name.toLowerCase().includes("kyle") ? "Hi Kyle." : "Hi Love."}
                  </h1>
                </FadeUp>

                <FadeUp>
                  <div className="mt-4 flex items-center justify-center gap-4">
                    <div className="h-px w-10 bg-gradient-to-r from-transparent via-rose-400/20 to-transparent" />
                    <p className="text-sm text-[var(--muted)]/60">The house has been waiting.</p>
                    <div className="h-px w-10 bg-gradient-to-r from-transparent via-rose-400/20 to-transparent" />
                  </div>
                </FadeUp>

                <FadeUp>
                  <button onClick={() => setStep("choice")} className={`${btnBase} mt-8 border border-rose-400/30 bg-gradient-to-b from-rose-400/10 to-rose-400/5 text-rose-300/90 hover:from-rose-400/20 hover:to-rose-400/10`}>
                    Enter
                  </button>
                </FadeUp>
              </StaggerChildren>
            </Card>
          )}

          {step === "choice" && (
            <Card key="choice">
              <StaggerChildren delay={0.1}>
                <FadeUp>
                  <h2 className="font-display text-3xl tracking-[-0.02em] text-center">Do you remember the key?</h2>
                </FadeUp>

                <FadeUp>
                  <p className="mt-4 text-sm text-center text-[var(--muted)]/60">If not, the house prepared a journey.</p>
                </FadeUp>

                <FadeUp>
                  <div className="mt-8 flex flex-col gap-3">
                    <button onClick={() => setStep("vault")} className={`${btnBase} border border-[var(--border)] bg-[var(--card-bg)] hover:bg-[var(--card-hover)] hover:border-rose-400/20`}>
                      I Remember
                    </button>
                    <button onClick={startQuiz} className={`${btnBase} border border-rose-400/30 bg-gradient-to-b from-rose-400/10 to-rose-400/5 text-rose-300/90 hover:from-rose-400/20 hover:to-rose-400/10`}>
                      Explore The House
                    </button>
                  </div>
                </FadeUp>
              </StaggerChildren>
            </Card>
          )}

          {step === "quiz" && !passedRoom && (
            <Card key="quiz">
              <StaggerChildren delay={0.08}>
                <FadeUp>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 14 }}
                    className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-rose-400/30 bg-gradient-to-br from-rose-400/10 to-rose-400/5 text-rose-300"
                  >
                    {currentRoom.icon}
                  </motion.div>
                </FadeUp>

                <FadeUp>
                  <div className="mt-6 text-center">
                    <p className="text-[10px] uppercase tracking-[.4em] text-rose-400/50">{currentRoom.name}</p>
                    <h2 className="mt-3 font-display text-xl tracking-[-0.02em]">Riddle {questionIndex + 1} / {QUIZZES[level].length}</h2>
                  </div>
                </FadeUp>

                <FadeUp>
                  <div className="mt-6 rounded-3xl border border-[var(--border)] bg-[var(--bg-soft)]/80 p-6 text-center">
                    <p className="text-base leading-relaxed text-[var(--text)]/90">{currentQuestion.q}</p>
                  </div>
                </FadeUp>

                <FadeUp>
                  <div className="mt-6 flex flex-col gap-3">
                    {currentQuestion.type === "input" ? (
                      <>
                        <input
                          value={inputAnswer}
                          onChange={(e) => setInputAnswer(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleInputSubmit()}
                          placeholder="Separate each name with a comma..."
                          className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] px-6 py-4 text-center text-sm outline-none transition-all duration-300 placeholder:text-[var(--muted)]/15 focus:border-rose-400/40 focus:shadow-[0_0_30px_rgba(251,113,133,0.06)] focus:bg-[var(--bg-elevated)]"
                        />
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          onClick={handleInputSubmit}
                          className="w-full rounded-2xl border border-rose-400/30 bg-gradient-to-b from-rose-400/10 to-rose-400/5 px-6 py-4 text-sm font-medium tracking-wide text-rose-300/90 transition-all duration-300 hover:from-rose-400/20 hover:to-rose-400/10 hover:shadow-lg active:scale-[0.97]"
                        >
                          Submit
                        </motion.button>
                      </>
                    ) : (
                      currentQuestion.choices!.map((choice, i) => (
                        <motion.button
                          key={choice}
                          variants={{
                            hidden: { opacity: 0, x: -10 },
                            visible: { opacity: 1, x: 0, transition: { delay: 0.4 + i * 0.08 } },
                          }}
                          onClick={() => answerQuestion(choice)}
                          className="w-full rounded-2xl border border-rose-400/15 bg-rose-400/5 px-6 py-4 text-sm text-left transition-all duration-300 hover:border-rose-400/30 hover:bg-rose-400/10 hover:pl-7 active:scale-[0.99]"
                        >
                          {choice}
                        </motion.button>
                      ))
                    )}
                  </div>
                </FadeUp>

                <AnimatePresence mode="wait">
                  {error && <ShakeError key={errorKey} message={error} onClose={() => setError("")} />}
                </AnimatePresence>
              </StaggerChildren>
            </Card>
          )}

          {passedRoom && (
            <Card key="passed">
              <StaggerChildren delay={0.1}>
                <FadeUp>
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 180, damping: 12 }}
                    className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl border border-rose-400/30 bg-gradient-to-br from-rose-400/10 to-rose-400/5 text-rose-300"
                  >
                    <LockIcon className="w-7 h-7" />
                  </motion.div>
                </FadeUp>

                <FadeUp>
                  <div className="text-center mt-6">
                    <p className="text-[10px] uppercase tracking-[.4em] text-rose-400/50">Room Complete</p>
                    <h1 className="mt-3 font-display text-3xl tracking-[-0.02em]">You found a digit.</h1>
                    <p className="mt-3 text-sm text-[var(--muted)]/60">A number is engraved on it.</p>
                  </div>
                </FadeUp>

                <FadeUp>
                  <div className="mt-8 font-display text-6xl tracking-widest text-center text-rose-300 drop-shadow-[0_0_20px_rgba(251,113,133,0.15)]">{currentRoom.code}</div>
                </FadeUp>

                <PasscodeTracker unlocked={unlockedCodes} />

                <FadeUp>
                  <button onClick={continueAfterRoom} className={`${btnBase} mt-8 border border-rose-400/30 bg-gradient-to-b from-rose-400/10 to-rose-400/5 text-rose-300/90 hover:from-rose-400/20 hover:to-rose-400/10`}>
                    Continue
                  </button>
                </FadeUp>
              </StaggerChildren>
            </Card>
          )}

          {step === "vault" && (
            <Card key="vault">
              <StaggerChildren delay={0.1}>
                <FadeUp>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 14 }}
                    className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl border border-rose-400/20 bg-gradient-to-br from-rose-400/10 to-rose-400/5 text-rose-300"
                  >
                    <LockIcon className="w-8 h-8" />
                  </motion.div>
                </FadeUp>

                <FadeUp>
                  <div className="text-center">
                    <p className="text-[10px] uppercase tracking-[.4em] text-rose-400/50">Vault Door</p>
                    <h1 className="mt-3 font-display text-3xl tracking-[-0.02em]">The House Remembers</h1>
                    <p className="mt-4 text-sm text-[var(--muted)]/60 max-w-xs mx-auto leading-relaxed">
                      Three fragments form the key. Enter the passcode and the final door will open.
                    </p>
                  </div>
                </FadeUp>

                <PasscodeTracker unlocked={unlockedCodes} />

                <FadeUp>
                  <PasscodePad
                    code={code}
                    onDigit={handleDigit}
                    onBackspace={handleBackspace}
                    error={codeError}
                  />
                </FadeUp>

                <AnimatePresence mode="wait">
                  {error && <ShakeError key={errorKey} message={error} onClose={() => setError("")} />}
                </AnimatePresence>
              </StaggerChildren>
            </Card>
          )}

          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
              style={{ background: "radial-gradient(ellipse at 50% 50%, var(--bg-elevated) 0%, var(--bg-soft) 100%)" }}
            >
              <div className="flex items-center justify-center w-full h-full [transform:scale(0.35)_translateY(0)] sm:[transform:scale(0.55)_translateY(0)] md:[transform:scale(0.75)_translateY(0)] lg:[transform:scale(1)_translateY(0)] [transform-origin:center_center]">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: [.22,1,.36,1] }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="h-[480px] w-[260px] rounded-[40px] border border-[var(--border)] bg-gradient-to-b from-[#1C201E] to-[#0C0E0D] shadow-[0_0_120px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.03)_inset]" />
                </motion.div>

                <motion.div
                  initial={{ x: 0, skewY: 0 }}
                  animate={{ x: "-60%", skewY: 4 }}
                  transition={{ duration: 1.2, ease: [.22,1,.36,1], delay: 0.3 }}
                  className="relative h-[460px] w-[120px] origin-right overflow-hidden rounded-l-[32px] border-r border-[var(--border)] bg-gradient-to-b from-[#1C201E] via-[#161918] to-[#0C0E0D] shadow-2xl z-10"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.02),transparent_50%)]" />
                  <div className="absolute top-[20%] left-[30%] w-[40px] h-[55px] rounded-sm border border-rose-400/8 bg-rose-400/8" />
                  <div className="absolute top-[20%] left-[30%] w-[40px] h-[55px] rounded-sm border border-rose-400/8 bg-rose-400/8 mt-[64px]" />
                  <div className="absolute bottom-[25%] right-[18%] w-2 h-2 rounded-full border border-rose-400/20 bg-rose-400/20" />
                  <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.4, delay: 0.8 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-black/40 to-black/70"
                  />
                </motion.div>

                <motion.div
                  initial={{ x: 0, skewY: 0 }}
                  animate={{ x: "60%", skewY: -4 }}
                  transition={{ duration: 1.2, ease: [.22,1,.36,1], delay: 0.3 }}
                  className="relative h-[460px] w-[120px] origin-left overflow-hidden rounded-r-[32px] border-l border-[var(--border)] bg-gradient-to-b from-[#1C201E] via-[#161918] to-[#0C0E0D] shadow-2xl z-10"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.02),transparent_50%)]" />
                  <div className="absolute top-[20%] right-[30%] w-[40px] h-[55px] rounded-sm border border-rose-400/8 bg-rose-400/8" />
                  <div className="absolute top-[20%] right-[30%] w-[40px] h-[55px] rounded-sm border border-rose-400/8 bg-rose-400/8 mt-[64px]" />
                  <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.4, delay: 0.8 }}
                    className="absolute inset-0 bg-gradient-to-l from-transparent via-black/40 to-black/70"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: [0, 0.9, 0.5], scale: [0.5, 2, 1.4] }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.6 }}
                  className="absolute h-[600px] w-[600px] rounded-full bg-rose-500/15 blur-[150px]"
                />

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: [.22,1,.36,1], delay: 1.3 }}
                  className="absolute flex flex-col items-center z-20"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeInOut", delay: 1.5 }}
                    className="flex h-16 w-16 items-center justify-center rounded-xl border border-emerald-400/30 bg-gradient-to-br from-emerald-400/10 to-emerald-400/5 text-emerald-300"
                  >
                    <CheckIcon className="w-8 h-8" />
                  </motion.div>
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.7 }}
                    className="mt-6 sm:mt-8 font-display text-3xl sm:text-4xl md:text-5xl tracking-[-0.03em] text-center text-[#F0EAE0]"
                  >
                    Welcome Home.
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1.9 }}
                    className="mt-4 text-sm text-center text-[var(--muted)]/60"
                  >
                    The door opens. The house welcomes you.
                  </motion.p>
                </motion.div>
              </div>
            </motion.div>
          )}

          {step === "wrong-door" && (
            <Card key="wrong">
              <StaggerChildren delay={0.1}>
                <FadeUp>
                  <motion.div
                    initial={{ scale: 0, rotate: 15 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 180, damping: 12 }}
                    className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl border border-red-400/30 bg-gradient-to-br from-red-400/10 to-red-400/5 text-red-300"
                  >
                    <ProhibitedIcon className="w-8 h-8" />
                  </motion.div>
                </FadeUp>

                <FadeUp>
                  <h1 className="mt-8 font-display text-4xl tracking-[-0.02em] text-center">Wrong Door.</h1>
                </FadeUp>

                <FadeUp>
                  <p className="mt-4 text-sm text-center text-[var(--muted)]/60">The house does not recognize that name.</p>
                </FadeUp>

                <FadeUp>
                  <button onClick={() => { setStep("gate"); setError(""); setName(""); }} className={`${btnBase} mt-8 border border-red-400/20 bg-gradient-to-b from-red-400/5 to-red-400/10 hover:from-red-400/10 hover:to-red-400/15 text-red-300/80`}>
                    Return
                  </button>
                </FadeUp>
              </StaggerChildren>
            </Card>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
