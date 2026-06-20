"use client";

import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, CheckCircle, Star, ArrowUp } from "lucide-react";
import { toggleDreamStatus } from "@/actions/plans";
import GradualBlur from "./GradualBlur";
import Particles from "./Particles";

type Dream = {
  id: string;
  title: string;
  description: string;
  horizon: string;
  status: "PRAYING" | "ACHIEVED";
  createdAt: Date;
};

type StarData = {
  id: string;
  x: number;
  y: number;
  size: number;
  pulseDelay: number;
  pulseDuration: number;
  floatX: number;
  floatY: number;
  floatDuration: number;
  floatDelay: number;
  hue: number;
  title: string;
  status: string;
  horizon: string;
  description: string;
};

function buildStars(dreams: Dream[]): StarData[] {
  return dreams.map((dream, i) => {
    const baseSize = dream.status === "ACHIEVED" ? 6 : 4.5;
    const seed = (i * 9973 + dream.id.charCodeAt(0) * 7919) % 10000;
    const r = (s: number) => {
      const x = Math.sin(s + 1) * 10000;
      return x - Math.floor(x);
    };
    return {
      id: dream.id,
      x: 5 + (i * 37 + Math.sin(i * 1.7) * 15) % 90,
      y: 8 + (i * 53 + Math.cos(i * 2.3) * 12) % 80,
      size: baseSize + r(seed) * 4,
      pulseDelay: r(seed + 1) * 5,
      pulseDuration: 3 + r(seed + 2) * 3,
      floatX: 20 + r(seed + 3) * 50,
      floatY: 20 + r(seed + 4) * 50,
      floatDuration: 6 + r(seed + 5) * 6,
      floatDelay: r(seed + 6) * 3,
      hue: dream.status === "ACHIEVED" ? 140 + r(seed + 7) * 30 : 38 + r(seed + 7) * 25,
      title: dream.title,
      status: dream.status,
      horizon: dream.horizon,
      description: dream.description,
    };
  });
}

export default function StarField({ dreams }: { dreams: Dream[] }) {
  const stars = useMemo(() => buildStars(dreams), [dreams]);
  const [selected, setSelected] = useState<Dream | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activePopupId, setActivePopupId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
          y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
        });
      }
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  useEffect(() => {
    if (dreams.length === 0) return;

    let index = 0;
    let hideTimer: number | null = null;
    let nextTimer: number | null = null;

    const scheduleNext = () => {
      const dream = dreams[index % dreams.length];
      setActivePopupId(dream.id);

      hideTimer = window.setTimeout(() => {
        setActivePopupId(null);
      }, 5000);

      index++;

      nextTimer = window.setTimeout(scheduleNext, 7000);
    };

    const initialDelay = window.setTimeout(scheduleNext, 3000);

    return () => {
      clearTimeout(initialDelay);
      if (hideTimer !== null) clearTimeout(hideTimer);
      if (nextTimer !== null) clearTimeout(nextTimer);
    };
  }, [dreams]);

  const handleToggleStatus = useCallback(async (dream: Dream) => {
    await toggleDreamStatus(dream.id);
    setSelected((prev) =>
      prev?.id === dream.id
        ? { ...prev, status: prev.status === "PRAYING" ? "ACHIEVED" : "PRAYING" }
        : prev
    );
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen overflow-hidden rounded-[3rem] border border-[var(--border)]"
      style={{
        background: "var(--star-bg)",
      }}
    >
      {/* 3D Particles background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <Particles
          particleColors={["#a88d72", "#c4a882", "#e8d5b7", "#ffffff"]}
          particleCount={150}
          particleSpread={12}
          speed={0.05}
          particleBaseSize={80}
          moveParticlesOnHover={true}
          particleHoverFactor={0.3}
          alphaParticles={true}
          disableRotation={false}
        />
      </div>

      {/* Mouse-following glow */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: `radial-gradient(circle at ${50 + mousePos.x * 20}% ${50 + mousePos.y * 20}%, rgba(168,147,123,.12), transparent 50%)`,
          transition: "background .5s ease",
        }}
      />

      {/* Background starfield dots */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          backgroundImage:
            "radial-gradient(1.5px 1.5px at 20px 30px, rgba(255,255,255,.12), transparent), radial-gradient(1px 1px at 40px 70px, rgba(255,255,255,.08), transparent), radial-gradient(1.5px 1.5px at 90px 40px, rgba(255,255,255,.1), transparent), radial-gradient(1px 1px at 160px 120px, rgba(255,255,255,.06), transparent), radial-gradient(1px 1px at 250px 200px, rgba(255,255,255,.07), transparent)",
          backgroundSize: "200px 200px, 150px 150px, 180px 180px, 250px 250px, 300px 300px",
        }}
      />

      {/* Header (pointer-events-none so stars are clickable through it) */}
      <div className="pointer-events-none relative z-10 px-8 pb-24 pt-16">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[.5em] text-[var(--accent)]/70">
            Dreams
          </p>
          <h2 className="mt-4 font-display text-5xl text-white md:text-7xl">
            The Stars We&apos;re Building
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-white/40">
            Hover to see a dream&apos;s name and status — click to explore.
          </p>
        </div>

        {dreams.length === 0 && (
          <div className="mt-20 text-center">
            <Sparkles size={32} className="mx-auto text-white/20" />
            <p className="mt-4 font-display text-xl text-white/30">
              No dreams yet. The sky is waiting.
            </p>
          </div>
        )}
      </div>

      {/* Dream Stars — anchor div, float wrapper, plain button */}
      <div className="pointer-events-none absolute inset-0 z-20">
        {stars.map((star) => (
          <div
            key={star.id}
            className="pointer-events-auto absolute"
            style={{ left: `${star.x}%`, top: `${star.y}%` }}
          >
            <motion.div
              className="flex flex-col items-center"
              animate={{
                x: [0, star.floatX * 0.35, 0, -(star.floatX * 0.25), 0],
                y: [0, -(star.floatY * 0.25), star.floatY * 0.35, 0, 0],
              }}
              transition={{
                duration: star.floatDuration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: star.floatDelay,
              }}
            >
              <button
                onMouseEnter={() => setHoveredId(star.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => {
                  const dream = dreams.find((d) => d.id === star.id);
                  if (dream) setSelected(dream);
                }}
                className="group flex cursor-pointer flex-col items-center"
              >
                {/* Star body */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0.4, 1, 0.4],
                    scale: [0.9, 1.3, 0.9],
                    boxShadow: [
                      `0 0 ${star.size * 3}px hsla(${star.hue}, 70%, 60%, 0.3)`,
                      `0 0 ${star.size * 12}px hsla(${star.hue}, 70%, 60%, 0.8)`,
                      `0 0 ${star.size * 3}px hsla(${star.hue}, 70%, 60%, 0.3)`,
                    ],
                  }}
                  transition={{
                    duration: star.pulseDuration,
                    delay: star.pulseDelay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="rounded-full"
                  style={{
                    width: star.size * 7,
                    height: star.size * 7,
                    background: `radial-gradient(circle, hsla(${star.hue}, 85%, 75%, 1), hsla(${star.hue}, 60%, 50%, 0.4))`,
                  }}
                >
                  <div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{
                      width: star.size * 3.5,
                      height: star.size * 3.5,
                      background: `radial-gradient(circle, hsla(${star.hue}, 95%, 90%, 1), transparent 70%)`,
                      filter: "blur(2px)",
                    }}
                  />
                </motion.div>

                {/* Star label (always visible) */}
                <span className="mt-1.5 max-w-[120px] truncate text-center text-[10px] font-display leading-tight text-white/25 transition-opacity duration-300 group-hover:text-white/60">
                  {star.title}
                </span>
              </button>

              {/* Hover tooltip */}
              <AnimatePresence>
                {hoveredId === star.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.9 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute -bottom-1 left-1/2 z-50 -translate-x-1/2 translate-y-full whitespace-nowrap rounded-2xl border border-white/10 bg-black/80 px-4 py-2.5 backdrop-blur-xl shadow-lg"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{
                          backgroundColor:
                            star.status === "ACHIEVED" ? "#6ee7b7" : "#fcd34d",
                        }}
                      />
                      <span className="font-display text-sm text-white">
                        {star.title}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-[10px] uppercase tracking-[.1em]">
                      <span
                        className="font-medium"
                        style={{
                          color: star.status === "ACHIEVED" ? "#6ee7b7" : "#fcd34d",
                        }}
                      >
                        {star.status === "ACHIEVED" ? "Achieved" : "Praying"}
                      </span>
                    </div>
                    <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-black/80 border-l border-t border-white/10" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Rotating popup anchored to star */}
              <AnimatePresence>
                {activePopupId === star.id && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.6, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.6, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="absolute z-40 cursor-pointer"
                    style={{
                      left: "50%",
                      bottom: "calc(100% + 8px)",
                      transform: "translateX(-50%)",
                    }}
                    onClick={() => {
                      const dream = dreams.find((d) => d.id === star.id);
                      if (dream) setSelected(dream);
                    }}
                  >
                    <div className="rounded-2xl border border-white/10 bg-black/60 p-3 backdrop-blur-xl shadow-lg transition-transform hover:scale-105">
                      <div className="flex items-center gap-2">
                        <Star
                          size={10}
                          className={
                            star.status === "ACHIEVED"
                              ? "text-emerald-300"
                              : "text-yellow-300"
                          }
                        />
                        <span className="font-display text-xs text-white">
                          {star.title}
                        </span>
                      </div>
                      <p className="mt-1 max-w-[140px] truncate text-[10px] text-white/40">
                        {star.description}
                      </p>
                    </div>
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Stats — pointer-events-none so stars below stay clickable */}
      <div className="pointer-events-none relative z-30 mx-auto mt-75 max-w-5xl px-8 pb-16">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-[var(--border)] bg-black/20 p-4 text-center backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[.2em] text-[var(--accent)]/60">
              Total Dreams
            </p>
            <p className="mt-1 font-display text-2xl text-white">
              {dreams.length}
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-black/20 p-4 text-center backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[.2em] text-[var(--accent)]/60">
              Praying
            </p>
            <p className="mt-1 font-display text-2xl text-yellow-300">
              {dreams.filter((d) => d.status === "PRAYING").length}
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-black/20 p-4 text-center backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[.2em] text-[var(--accent)]/60">
              Achieved
            </p>
            <p className="mt-1 font-display text-2xl text-emerald-300">
              {dreams.filter((d) => d.status === "ACHIEVED").length}
            </p>
          </div>
        </div>
      </div>



      {/* GradualBlur bottom overlay */}
      <GradualBlur
        target="parent"
        position="bottom"
        height="8rem"
        strength={3}
        divCount={8}
        curve="bezier"
        exponential={true}
        opacity={0.6}
        zIndex={5}
      />
      <GradualBlur
        target="parent"
        position="top"
        height="4rem"
        strength={1.5}
        divCount={4}
        curve="ease-in"
        exponential={false}
        opacity={0.3}
        zIndex={5}
      />

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.85, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.85, y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="group relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-white/10 p-[2px] shadow-2xl"
            >
              {/* Glow border ring */}
              <div
                className="absolute inset-0 rounded-[2.5rem] opacity-40 transition-opacity duration-500 group-hover:opacity-70"
                style={{
                  background: `conic-gradient(from 0deg, ${
                    selected.status === "ACHIEVED"
                      ? "#6ee7b7, #34d399, #10b981, #6ee7b7"
                      : "#fcd34d, #fbbf24, #f59e0b, #fcd34d"
                  })`,
                  filter: "blur(12px)",
                }}
              />
              {/* Modal body */}
              <div
                className="relative rounded-[2.45rem] p-8"
                style={{
                  background: "linear-gradient(135deg, rgba(15,15,35,.95), rgba(20,25,50,.92))",
                }}
              >
                {/* Decorative stars */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2.45rem]">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute h-px w-px rounded-full bg-white/20"
                      style={{
                        left: `${15 + i * 14}%`,
                        top: `${8 + ((i * 7) % 20)}%`,
                        boxShadow: `0 0 ${4 + (i % 3) * 2}px 1px rgba(255,255,255,.08)`,
                      }}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setSelected(null)}
                  className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/40 transition-all hover:bg-white/10 hover:text-white"
                >
                  <X size={14} />
                </button>

                <div className="relative z-[1] flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                      selected.status === "ACHIEVED"
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "bg-yellow-500/15 text-yellow-300"
                    }`}
                  >
                    {selected.status === "ACHIEVED" ? (
                      <CheckCircle size={22} />
                    ) : (
                      <Sparkles size={22} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`text-xs font-medium uppercase tracking-[.2em] ${
                        selected.status === "ACHIEVED"
                          ? "text-emerald-300/80"
                          : "text-yellow-300/80"
                      }`}
                    >
                      {selected.status === "ACHIEVED" ? "Achieved" : "Praying"}
                    </p>
                  </div>
                </div>

                <div className="relative z-[1] mt-6 border-t border-white/[.04] pt-6">
                  <h3 className="font-display text-[clamp(1.6rem,4vw,2.2rem)] leading-tight text-white">
                    {selected.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-white/50">
                    {selected.description}
                  </p>
                </div>

                <div className="relative z-[1] mt-8 flex gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleStatus(selected);
                    }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[.04] px-6 py-3 text-sm font-medium text-white/70 transition-all hover:border-white/20 hover:bg-white/[.08] hover:text-white"
                  >
                    {selected.status === "ACHIEVED" ? (
                      <>
                        <ArrowUp size={14} className="text-emerald-300" />
                        Mark as Praying
                      </>
                    ) : (
                      <>
                        <CheckCircle size={14} className="text-emerald-300" />
                        Mark as Achieved
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
