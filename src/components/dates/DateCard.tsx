"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import type { DateMemory } from "@/types/date-memory";
import { motion } from "framer-motion";
import { Heart, MapPin, Clock } from "lucide-react";
import { toggleDateMemoryLike } from "@/actions/dates";
import ImageCarousel from "./ImageCarousel";
import ImageLightbox from "./ImageLightbox";
import CommentSection from "./CommentSection";
import Cookies from "js-cookie";

export default function DateCard({ memory }: { memory: DateMemory }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const router = useRouter();
  const currentUser = Cookies.get("solace-user")?.toLowerCase() ?? "";

  const images: string[] = (() => {
    try {
      const parsed = JSON.parse(memory.images ?? "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })();

  const initialLikedBy: string[] = (() => {
    try {
      return JSON.parse(memory.likedBy);
    } catch {
      return [];
    }
  })();

  const [likedBy, setLikedBy] = useState(initialLikedBy);
  const isLiked = currentUser ? likedBy.includes(currentUser) : false;
  const likeRef = useRef({ pending: false });

  const handleLike = useCallback(async () => {
    if (likeRef.current.pending) return;
    likeRef.current.pending = true;

    const newLikedBy = [...likedBy];
    const idx = newLikedBy.indexOf(currentUser);
    if (idx > -1) {
      newLikedBy.splice(idx, 1);
    } else {
      if (newLikedBy.length >= 2) { likeRef.current.pending = false; return; }
      newLikedBy.push(currentUser);
    }

    setLikedBy(newLikedBy);

    try {
      await toggleDateMemoryLike(memory.id);
      router.refresh();
    } catch {
      setLikedBy(likedBy);
    }
    likeRef.current.pending = false;
  }, [likedBy, currentUser, memory.id, router]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[var(--card-bg)] p-6 backdrop-blur-xl transition-all duration-500 hover:border-[var(--accent)]/30 hover:bg-[var(--card-hover)]"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-[var(--accent)]/10 blur-3xl transition-all duration-500 group-hover:bg-[var(--accent)]/20" />

      <div className="relative">
        {images.length > 0 && (
          <div className="mb-5">
            <ImageCarousel
              images={images}
              onImageClick={(i) => setLightboxIndex(i)}
              onDoubleTap={handleLike}
              liked={isLiked}
            />
          </div>
        )}

        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-soft)]">
                <Heart size={12} className="text-[var(--accent)]" />
              </div>
              <p className="text-xs uppercase tracking-[.25em] text-[var(--accent)]">
                {new Date(memory.memoryDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <h3 className="mt-5 font-display text-3xl leading-tight md:text-4xl">
              {memory.title}
            </h3>

            {memory.description && (
              <p className="mt-3 leading-relaxed text-[var(--muted)]">
                {memory.description}
              </p>
            )}

            {memory.location && (
              <p className="mt-4 flex items-center gap-1.5 text-xs text-[var(--muted)]/50">
                <MapPin size={12} />
                {memory.location}
              </p>
            )}
          </div>
        </div>

        <div className="mt-5 flex items-center gap-4 border-t border-[var(--border)] pt-4">
          <button
            onClick={handleLike}
            className="flex items-center gap-1.5 text-sm transition-all active:scale-90"
          >
            <motion.div
              key={isLiked ? "liked" : "unliked"}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <Heart
                size={16}
                className={
                  isLiked
                    ? "fill-red-500 text-red-500"
                    : "text-[var(--muted)]/50 hover:text-red-400"
                }
              />
            </motion.div>
            <span
              className={isLiked ? "text-red-500 text-sm" : "text-[var(--muted)]/50 text-sm"}
            >
              {likedBy.length || ""}
            </span>
          </button>

          <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]/40">
            <Clock size={11} />
            <p className="text-[11px]">
              {new Date(memory.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        <CommentSection memoryId={memory.id} comments={memory.comments} />
      </div>

      {lightboxIndex !== null && (
        <ImageLightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() =>
            setLightboxIndex((prev) =>
              prev === null || prev === 0 ? images.length - 1 : prev - 1
            )
          }
          onNext={() =>
            setLightboxIndex((prev) =>
              prev === null || prev === images.length - 1 ? 0 : prev + 1
            )
          }
        />
      )}
    </motion.article>
  );
}
